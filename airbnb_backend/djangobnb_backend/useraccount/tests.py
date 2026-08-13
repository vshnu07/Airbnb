from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from useraccount.models import User
from property.models import Property, Reservation
from datetime import date, timedelta


class UserAccountTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.host_user = User.objects.create_user(
            name='Priya Sharma',
            email='host@test.com',
            password='password123',
            is_host=True,
            bio='Luxury villa host in Goa',
            location='Goa, India'
        )
        self.guest_user = User.objects.create_user(
            name='Rahul Mehta',
            email='guest@test.com',
            password='password123',
            is_host=False,
            location='Bengaluru, India'
        )
        self.property = Property.objects.create(
            title='Villa Sol de Goa',
            description='A luxury villa in Goa',
            price_per_night=12000,
            cleaning_fee=1000,
            bedrooms=3,
            beds=3,
            bathrooms=3,
            guests=6,
            country='India',
            country_code='IN',
            city='Goa',
            category='Beachfront',
            landlord=self.host_user
        )

    def test_user_profile_retrieval(self):
        self.client.force_authenticate(user=self.guest_user)
        response = self.client.get(reverse('api_my_profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['email'], 'guest@test.com')
        self.assertEqual(response.json()['name'], 'Rahul Mehta')


    def test_user_profile_update(self):
        self.client.force_authenticate(user=self.guest_user)
        response = self.client.post(reverse('api_update_profile'), {
            'name': 'Updated Guest Name',
            'bio': 'Digital Nomad bio',
            'is_host': 'true'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.guest_user.refresh_from_db()
        self.assertEqual(self.guest_user.name, 'Updated Guest Name')
        self.assertEqual(self.guest_user.bio, 'Digital Nomad bio')
        self.assertTrue(self.guest_user.is_host)

    def test_landlord_public_detail(self):
        response = self.client.get(reverse('api_landlord_detail', kwargs={'pk': self.host_user.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['user']['name'], 'Priya Sharma')
        self.assertEqual(len(data['properties']), 1)


    def test_host_dashboard(self):
        # Create a reservation on host's property
        Reservation.objects.create(
            property=self.property,
            start_date=date.today() + timedelta(days=2),
            end_date=date.today() + timedelta(days=5),
            number_of_nights=3,
            guests=2,
            cleaning_fee=40,
            service_fee=50,
            total_price=540,
            status='confirmed',
            payment_status='paid',
            created_by=self.guest_user
        )

        self.client.force_authenticate(user=self.host_user)
        response = self.client.get(reverse('api_host_dashboard'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['stats']['total_listings'], 1)
        self.assertEqual(data['stats']['confirmed_bookings'], 1)
        self.assertEqual(data['stats']['total_earnings'], 540.0)

    def test_cancel_reservation(self):
        res = Reservation.objects.create(
            property=self.property,
            start_date=date.today() + timedelta(days=10),
            end_date=date.today() + timedelta(days=15),
            number_of_nights=5,
            guests=2,
            cleaning_fee=40,
            service_fee=50,
            total_price=840,
            status='confirmed',
            payment_status='paid',
            created_by=self.guest_user
        )

        self.client.force_authenticate(user=self.guest_user)
        response = self.client.post(reverse('api_cancel_reservation', kwargs={'pk': res.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        res.refresh_from_db()
        self.assertEqual(res.status, 'cancelled')

