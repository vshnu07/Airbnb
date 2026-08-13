from datetime import date, timedelta
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from useraccount.models import User
from property.models import Property, PropertyImage, Reservation, Review


class PropertyAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.host = User.objects.create_user(
            name='Priya Sharma',
            email='host@test.com',
            password='password123',
            is_host=True
        )

        self.other_host = User.objects.create_user(
            name='Rohit Verma',
            email='otherhost@test.com',
            password='password123',
            is_host=True
        )

        self.guest = User.objects.create_user(
            name='Rahul Mehta',
            email='guest@test.com',
            password='password123',
            is_host=False
        )

        self.property1 = Property.objects.create(
            title='Beachfront Villa Goa',
            description='Gorgeous beachfront retreat with infinity pool.',
            price_per_night=12000,
            cleaning_fee=1000,
            bedrooms=3,
            beds=3,
            bathrooms=2,
            guests=6,
            country='India',
            country_code='IN',
            city='Goa',
            address='Anjuna Beach',
            latitude=15.5808,
            longitude=73.7423,
            category='Beachfront',
            property_type='Villa',
            amenities=['Wifi', 'Pool', 'Kitchen', 'Air conditioning'],
            primary_image_url='https://images.unsplash.com/photo-1?auto=format',
            landlord=self.host
        )

        self.property2 = Property.objects.create(
            title='Himalayan Chalet Manali',
            description='Cozy wooden chalet in the Himalayan mountains.',
            price_per_night=6500,
            cleaning_fee=700,
            bedrooms=2,
            beds=2,
            bathrooms=1,
            guests=4,
            country='India',
            country_code='IN',
            city='Manali',
            category='Cabins',
            property_type='Chalet',
            amenities=['Wifi', 'Hot tub', 'Indoor fireplace'],
            primary_image_url='https://images.unsplash.com/photo-2?auto=format',
            landlord=self.host
        )

    def test_list_properties_and_search_filter(self):
        # All properties
        res = self.client.get(reverse('api_properties_list'))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.json()['count'], 2)

        # Filter by category
        res = self.client.get(reverse('api_properties_list') + '?category=Beachfront')
        self.assertEqual(res.json()['count'], 1)
        self.assertEqual(res.json()['data'][0]['title'], 'Beachfront Villa Goa')

        # Filter by search keyword
        res = self.client.get(reverse('api_properties_list') + '?query=Manali')
        self.assertEqual(res.json()['count'], 1)
        self.assertEqual(res.json()['data'][0]['title'], 'Himalayan Chalet Manali')

        # Filter by price
        res = self.client.get(reverse('api_properties_list') + '?maxPrice=7000')
        self.assertEqual(res.json()['count'], 1)

        # Filter by amenities
        res = self.client.get(reverse('api_properties_list') + '?amenities=Hot tub')
        self.assertEqual(res.json()['count'], 1)
        self.assertEqual(res.json()['data'][0]['title'], 'Himalayan Chalet Manali')

    def test_property_detail(self):
        res = self.client.get(reverse('api_properties_detail', kwargs={'pk': self.property1.id}))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertEqual(data['title'], 'Beachfront Villa Goa')
        self.assertEqual(data['landlord']['name'], 'Priya Sharma')
        self.assertIn('Wifi', data['amenities'])

    def test_create_property_as_host(self):
        self.client.force_authenticate(user=self.host)
        payload = {
            'title': 'Bengaluru Designer Studio Loft',
            'description': 'Indiranagar luxury loft',
            'price_per_night': 4000,
            'cleaning_fee': 500,
            'bedrooms': 2,
            'beds': 2,
            'bathrooms': 2,
            'guests': 4,
            'country': 'India',
            'country_code': 'IN',
            'city': 'Bengaluru',
            'category': 'Trending',
            'property_type': 'Loft',
            'amenities': ['Wifi', 'Elevator', 'Gym'],
            'primary_image_url': 'https://images.unsplash.com/photo-3'
        }
        res = self.client.post(reverse('api_create_property'), payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.json()['success'])
        self.assertEqual(Property.objects.filter(title='Bengaluru Designer Studio Loft').count(), 1)


    def test_edit_property_permissions(self):
        # Unauthorized user should be forbidden
        self.client.force_authenticate(user=self.other_host)
        res = self.client.put(
            reverse('api_edit_property', kwargs={'pk': self.property1.id}),
            {'title': 'Hacked Title'},
            format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # Owner should be allowed
        self.client.force_authenticate(user=self.host)
        res = self.client.put(
            reverse('api_edit_property', kwargs={'pk': self.property1.id}),
            {'title': 'Updated Goa Villa Title', 'price_per_night': 14000},
            format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.property1.refresh_from_db()
        self.assertEqual(self.property1.title, 'Updated Goa Villa Title')
        self.assertEqual(self.property1.price_per_night, 14000)


    def test_delete_property_by_owner(self):
        self.client.force_authenticate(user=self.host)
        res = self.client.delete(reverse('api_delete_property', kwargs={'pk': self.property2.id}))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(Property.objects.filter(id=self.property2.id).exists())

    def test_booking_flow_and_conflict_validation(self):
        self.client.force_authenticate(user=self.guest)

        # 1. Successful booking
        start = str(date.today() + timedelta(days=10))
        end = str(date.today() + timedelta(days=15))
        payload = {
            'start_date': start,
            'end_date': end,
            'guests': 2
        }
        res = self.client.post(reverse('api_book_property', kwargs={'pk': self.property1.id}), payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.json()['success'])

        # 2. Overlapping booking attempt must be rejected
        conflict_payload = {
            'start_date': str(date.today() + timedelta(days=12)),
            'end_date': str(date.today() + timedelta(days=17)),
            'guests': 2
        }
        res_conflict = self.client.post(reverse('api_book_property', kwargs={'pk': self.property1.id}), conflict_payload, format='json')
        self.assertEqual(res_conflict.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(res_conflict.json()['success'])
        self.assertIn('already booked', res_conflict.json()['error'])

        # 3. Exceeding guest limit must be rejected
        overflow_payload = {
            'start_date': str(date.today() + timedelta(days=20)),
            'end_date': str(date.today() + timedelta(days=25)),
            'guests': 10  # Max is 6
        }
        res_overflow = self.client.post(reverse('api_book_property', kwargs={'pk': self.property1.id}), overflow_payload, format='json')
        self.assertEqual(res_overflow.status_code, status.HTTP_400_BAD_REQUEST)

    def test_favorite_toggle_and_list(self):
        self.client.force_authenticate(user=self.guest)
        
        # Toggle on
        res = self.client.post(reverse('api_toggle_favorite', kwargs={'pk': self.property1.id}))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.json()['is_favorite'])

        # Check in favorites list
        fav_res = self.client.get(reverse('api_favorites_list'))
        self.assertEqual(fav_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(fav_res.json()['data']), 1)

        # Toggle off
        res_off = self.client.post(reverse('api_toggle_favorite', kwargs={'pk': self.property1.id}))
        self.assertEqual(res_off.status_code, status.HTTP_200_OK)
        self.assertFalse(res_off.json()['is_favorite'])

    def test_reviews_submission_and_aggregation(self):
        self.client.force_authenticate(user=self.guest)
        payload = {
            'rating': 5.0,
            'cleanliness_rating': 5.0,
            'accuracy_rating': 5.0,
            'communication_rating': 5.0,
            'location_rating': 5.0,
            'value_rating': 5.0,
            'comment': 'Exceptional stay, beautiful views!'
        }
        res = self.client.post(reverse('api_property_reviews', kwargs={'pk': self.property1.id}), payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.json()['success'])

        # Get reviews
        list_res = self.client.get(reverse('api_property_reviews', kwargs={'pk': self.property1.id}))
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(list_res.json()['reviews_count'], 1)
        self.assertEqual(list_res.json()['rating_avg'], 5.0)

