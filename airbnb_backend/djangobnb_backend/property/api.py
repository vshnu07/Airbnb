import json
from datetime import datetime, date
from django.db.models import Q
from django.http import JsonResponse
from django.core.paginator import Paginator

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken

from .models import Property, PropertyImage, Reservation, Review
from .serializers import (
    PropertiesListSerializer,
    PropertiesDetailSerializer,
    ReservationsListSerializer,
    ReviewSerializer
)
from useraccount.models import User


def get_user_from_request(request):
    if request.user and request.user.is_authenticated:
        return request.user
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if auth_header.startswith('Bearer '):
        try:
            token_str = auth_header.split('Bearer ')[1].strip()
            token = AccessToken(token_str)
            user_id = token.payload.get('user_id')
            if user_id:
                return User.objects.get(pk=user_id)
        except Exception:
            pass
    return None


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def properties_list(request):
    user = get_user_from_request(request)
    properties = Property.objects.all().select_related('landlord').prefetch_related('favorited', 'images', 'reviews')

    # Search query
    query = request.GET.get('query', '') or request.GET.get('search', '')
    if query:
        properties = properties.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(city__icontains=query) |
            Q(country__icontains=query) |
            Q(address__icontains=query)
        )

    # Location filters
    country = request.GET.get('country', '')
    if country and country != 'undefined':
        properties = properties.filter(country__iexact=country)

    city = request.GET.get('city', '')
    if city and city != 'undefined':
        properties = properties.filter(city__iexact=city)

    # Category & Property Type
    category = request.GET.get('category', '')
    if category and category != 'undefined' and category.lower() != 'all':
        properties = properties.filter(category__iexact=category)

    property_type = request.GET.get('property_type', '') or request.GET.get('propertyType', '')
    if property_type and property_type != 'undefined':
        properties = properties.filter(property_type__iexact=property_type)

    # Price range
    min_price = request.GET.get('min_price', '') or request.GET.get('minPrice', '')
    if min_price:
        try:
            properties = properties.filter(price_per_night__gte=int(min_price))
        except ValueError:
            pass

    max_price = request.GET.get('max_price', '') or request.GET.get('maxPrice', '')
    if max_price:
        try:
            properties = properties.filter(price_per_night__lte=int(max_price))
        except ValueError:
            pass

    # Rooms & Capacity
    guests = request.GET.get('numGuests', '') or request.GET.get('guests', '')
    if guests:
        try:
            properties = properties.filter(guests__gte=int(guests))
        except ValueError:
            pass

    bedrooms = request.GET.get('numBedrooms', '') or request.GET.get('bedrooms', '')
    if bedrooms:
        try:
            properties = properties.filter(bedrooms__gte=int(bedrooms))
        except ValueError:
            pass

    bathrooms = request.GET.get('numBathrooms', '') or request.GET.get('bathrooms', '')
    if bathrooms:
        try:
            properties = properties.filter(bathrooms__gte=int(bathrooms))
        except ValueError:
            pass

    beds = request.GET.get('numBeds', '') or request.GET.get('beds', '')
    if beds:
        try:
            properties = properties.filter(beds__gte=int(beds))
        except ValueError:
            pass

    # Amenities filter (comma-separated, e.g. "Wifi,Pool,Kitchen")
    amenities_param = request.GET.get('amenities', '')
    if amenities_param:
        amenity_list = [a.strip() for a in amenities_param.split(',') if a.strip()]
        for amenity in amenity_list:
            properties = properties.filter(amenities__icontains=amenity)

    # Date range availability filter
    checkin_date = request.GET.get('checkIn', '') or request.GET.get('checkin', '') or request.GET.get('start_date', '')
    checkout_date = request.GET.get('checkOut', '') or request.GET.get('checkout', '') or request.GET.get('end_date', '')
    if checkin_date and checkout_date:
        try:
            c_in = datetime.strptime(checkin_date, '%Y-%m-%d').date()
            c_out = datetime.strptime(checkout_date, '%Y-%m-%d').date()
            if c_in < c_out:
                # Find properties that have an overlapping active reservation
                overlapping_ids = Reservation.objects.filter(
                    status='confirmed',
                    start_date__lt=c_out,
                    end_date__gt=c_in
                ).values_list('property_id', flat=True)
                properties = properties.exclude(id__in=overlapping_ids)
        except Exception:
            pass

    # Landlord filter
    landlord_id = request.GET.get('landlord_id', '') or request.GET.get('host_id', '')
    if landlord_id:
        properties = properties.filter(landlord_id=landlord_id)

    # Favorites filter
    is_favorites = request.GET.get('is_favorites', '')
    if is_favorites and user:
        properties = properties.filter(favorited=user)

    # Ordering
    ordering = request.GET.get('ordering', '')
    if ordering == 'price_asc':
        properties = properties.order_by('price_per_night')
    elif ordering == 'price_desc':
        properties = properties.order_by('-price_per_night')
    elif ordering == 'newest':
        properties = properties.order_by('-created_at')

    # Favorites list for current user
    favorites = []
    if user:
        favorites = list(user.favorites.values_list('id', flat=True))

    # Pagination
    page_number = request.GET.get('page', 1)
    page_size = request.GET.get('limit', '') or request.GET.get('page_size', '')
    
    total_count = properties.count()

    if page_size:
        try:
            page_size = int(page_size)
            paginator = Paginator(properties, page_size)
            page_obj = paginator.get_page(page_number)
            serializer = PropertiesListSerializer(page_obj, many=True, context={'request': request})
            return JsonResponse({
                'data': serializer.data,
                'results': serializer.data,
                'count': total_count,
                'total_pages': paginator.num_pages,
                'current_page': page_obj.number,
                'favorites': [str(f) for f in favorites]
            })
        except Exception:
            pass

    serializer = PropertiesListSerializer(properties, many=True, context={'request': request})
    return JsonResponse({
        'data': serializer.data,
        'results': serializer.data,
        'count': total_count,
        'favorites': [str(f) for f in favorites]
    })


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def properties_detail(request, pk):
    try:
        property = Property.objects.select_related('landlord').prefetch_related('images', 'reviews__author', 'favorited').get(pk=pk)
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Property not found'}, status=404)

    serializer = PropertiesDetailSerializer(property, many=False, context={'request': request})
    return JsonResponse(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_property(request):
    try:
        data = request.data if hasattr(request, 'data') else request.POST
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        category = data.get('category', 'Trending')
        price_per_night = int(data.get('price_per_night', 100))
        bedrooms = int(data.get('bedrooms', 1))
        beds = int(data.get('beds', 1))
        bathrooms = int(data.get('bathrooms', 1))
        guests = int(data.get('guests', 2))
        country = data.get('country', 'India')
        country_code = data.get('country_code', 'IN')
        city = data.get('city', '')
        address = data.get('address', '')
        latitude = float(data.get('latitude', 0.0) or 0.0)
        longitude = float(data.get('longitude', 0.0) or 0.0)
        property_type = data.get('property_type', 'House')
        cleaning_fee = int(data.get('cleaning_fee', 500) or 500)
        primary_image_url = data.get('primary_image_url', '')

        # Amenities handling
        amenities = data.get('amenities', [])
        if isinstance(amenities, str):
            try:
                amenities = json.loads(amenities)
            except Exception:
                amenities = [a.strip() for a in amenities.split(',') if a.strip()]

        image_file = request.FILES.get('image', None)

        if not title or not description or not country:
            return JsonResponse({'error': 'Title, description, and country are required.'}, status=400)

        property = Property.objects.create(
            title=title,
            description=description,
            price_per_night=price_per_night,
            cleaning_fee=cleaning_fee,
            bedrooms=bedrooms,
            beds=beds,
            bathrooms=bathrooms,
            guests=guests,
            country=country,
            country_code=country_code,
            city=city,
            address=address,
            latitude=latitude,
            longitude=longitude,
            category=category,
            property_type=property_type,
            amenities=amenities,
            image=image_file,
            primary_image_url=primary_image_url,
            landlord=request.user
        )

        # Handle multiple uploaded gallery images or image urls
        gallery_files = request.FILES.getlist('images') or request.FILES.getlist('gallery')
        for idx, g_file in enumerate(gallery_files):
            PropertyImage.objects.create(property=property, image=g_file, order=idx)

        gallery_urls = data.get('gallery_urls', [])
        if isinstance(gallery_urls, str):
            try:
                gallery_urls = json.loads(gallery_urls)
            except Exception:
                gallery_urls = [u.strip() for u in gallery_urls.split(',') if u.strip()]
        for idx, g_url in enumerate(gallery_urls):
            PropertyImage.objects.create(property=property, image_url=g_url, order=idx + len(gallery_files))

        # Mark user as host
        if not request.user.is_host:
            request.user.is_host = True
            request.user.save(update_fields=['is_host'])

        serializer = PropertiesDetailSerializer(property, context={'request': request})
        return JsonResponse({'success': True, 'property': serializer.data}, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['PUT', 'PATCH', 'POST'])
@permission_classes([IsAuthenticated])
def edit_property(request, pk):
    try:
        property = Property.objects.get(pk=pk)
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Property not found'}, status=404)

    if property.landlord != request.user and not request.user.is_staff:
        return JsonResponse({'error': 'You do not have permission to edit this property'}, status=403)

    data = request.data if hasattr(request, 'data') else request.POST

    fields_to_update = [
        'title', 'description', 'price_per_night', 'cleaning_fee', 'service_fee_percentage',
        'bedrooms', 'beds', 'bathrooms', 'guests', 'country', 'country_code', 'city',
        'address', 'latitude', 'longitude', 'category', 'property_type', 'primary_image_url'
    ]

    for field in fields_to_update:
        if field in data:
            val = data.get(field)
            if field in ['price_per_night', 'cleaning_fee', 'service_fee_percentage', 'bedrooms', 'beds', 'bathrooms', 'guests']:
                val = int(val)
            elif field in ['latitude', 'longitude']:
                val = float(val)
            setattr(property, field, val)

    if 'amenities' in data:
        amenities = data.get('amenities')
        if isinstance(amenities, str):
            try:
                amenities = json.loads(amenities)
            except Exception:
                amenities = [a.strip() for a in amenities.split(',') if a.strip()]
        property.amenities = amenities

    if 'image' in request.FILES:
        property.image = request.FILES['image']

    property.save()

    # Additional gallery files
    gallery_files = request.FILES.getlist('images') or request.FILES.getlist('gallery')
    for idx, g_file in enumerate(gallery_files):
        PropertyImage.objects.create(property=property, image=g_file, order=idx)

    serializer = PropertiesDetailSerializer(property, context={'request': request})
    return JsonResponse({'success': True, 'property': serializer.data})


@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def delete_property(request, pk):
    try:
        property = Property.objects.get(pk=pk)
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Property not found'}, status=404)

    if property.landlord != request.user and not request.user.is_staff:
        return JsonResponse({'error': 'You do not have permission to delete this property'}, status=403)

    property.delete()
    return JsonResponse({'success': True, 'message': 'Property successfully deleted'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_property(request, pk):
    try:
        property = Property.objects.get(pk=pk)
    except Property.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Property not found'}, status=404)

    data = request.data if hasattr(request, 'data') else request.POST

    start_date_str = data.get('start_date', '')
    end_date_str = data.get('end_date', '')
    guests_count = int(data.get('guests', 1) or 1)

    if not start_date_str or not end_date_str:
        return JsonResponse({'success': False, 'error': 'Please provide check-in and check-out dates.'}, status=400)

    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({'success': False, 'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

    if start_date >= end_date:
        return JsonResponse({'success': False, 'error': 'Check-out date must be after check-in date.'}, status=400)

    # Guest capacity validation
    if guests_count > property.guests:
        return JsonResponse({
            'success': False,
            'error': f'Maximum guest capacity for this property is {property.guests}.'
        }, status=400)

    # Overlap validation: check for conflicting active bookings
    has_conflict = Reservation.objects.filter(
        property=property,
        status='confirmed',
        start_date__lt=end_date,
        end_date__gt=start_date
    ).exists()

    if has_conflict:
        return JsonResponse({
            'success': False,
            'error': 'These dates are already booked. Please choose another date range.'
        }, status=400)

    number_of_nights = (end_date - start_date).days
    nightly_cost = property.price_per_night * number_of_nights
    cleaning_fee = property.cleaning_fee
    service_fee = round(nightly_cost * (property.service_fee_percentage / 100), 2)
    calculated_total = nightly_cost + cleaning_fee + service_fee

    # Allow total_price override from frontend if passed and valid
    total_price = float(data.get('total_price', calculated_total) or calculated_total)

    reservation = Reservation.objects.create(
        property=property,
        start_date=start_date,
        end_date=end_date,
        number_of_nights=number_of_nights,
        guests=guests_count,
        cleaning_fee=cleaning_fee,
        service_fee=service_fee,
        total_price=total_price,
        status='confirmed',
        payment_status='paid',
        created_by=request.user
    )

    serializer = ReservationsListSerializer(reservation)
    return JsonResponse({
        'success': True,
        'message': 'Booking confirmed successfully!',
        'reservation': serializer.data
    }, status=201)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def property_reservations(request, pk):
    try:
        property = Property.objects.get(pk=pk)
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Property not found'}, status=404)

    reservations = property.reservations.filter(status='confirmed')
    serializer = ReservationsListSerializer(reservations, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, pk):
    try:
        property = Property.objects.get(pk=pk)
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Property not found'}, status=404)

    if request.user in property.favorited.all():
        property.favorited.remove(request.user)
        return JsonResponse({'is_favorite': False, 'message': 'Removed from wishlist'})
    else:
        property.favorited.add(request.user)
        return JsonResponse({'is_favorite': True, 'message': 'Added to wishlist'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def favorites_list(request):
    properties = request.user.favorites.all()
    serializer = PropertiesListSerializer(properties, many=True, context={'request': request})
    return JsonResponse({'data': serializer.data, 'favorites': list(properties.values_list('id', flat=True))})


@api_view(['GET', 'POST'])
def property_reviews(request, pk):
    try:
        property = Property.objects.get(pk=pk)
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Property not found'}, status=404)

    if request.method == 'GET':
        reviews = property.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return JsonResponse({
            'reviews': serializer.data,
            'rating_avg': property.rating_avg,
            'reviews_count': property.reviews_count,
            'category_ratings': property.category_ratings
        })

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required to leave a review.'}, status=401)

        data = request.data if hasattr(request, 'data') else request.POST
        rating = float(data.get('rating', 5.0))
        comment = data.get('comment', '').strip()

        if not comment:
            return JsonResponse({'error': 'Please enter a review comment.'}, status=400)

        review = Review.objects.create(
            property=property,
            author=request.user,
            rating=rating,
            cleanliness_rating=float(data.get('cleanliness_rating', rating)),
            accuracy_rating=float(data.get('accuracy_rating', rating)),
            communication_rating=float(data.get('communication_rating', rating)),
            location_rating=float(data.get('location_rating', rating)),
            value_rating=float(data.get('value_rating', rating)),
            comment=comment
        )

        serializer = ReviewSerializer(review)
        return JsonResponse({'success': True, 'review': serializer.data}, status=201)