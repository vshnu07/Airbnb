from django.http import JsonResponse
from django.db.models import Sum, Count, Q

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import User
from .serializers import UserDetailSerializer, UserProfileUpdateSerializer
from property.models import Property, Reservation
from property.serializers import ReservationsListSerializer, PropertiesListSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    serializer = UserDetailSerializer(request.user)
    return JsonResponse(serializer.data)


@api_view(['PATCH', 'PUT', 'POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data if hasattr(request, 'data') else request.POST

    if 'name' in data:
        user.name = data.get('name')
    if 'bio' in data:
        user.bio = data.get('bio')
    if 'is_host' in data:
        is_host_val = data.get('is_host')
        user.is_host = str(is_host_val).lower() in ['true', '1', 'yes']
    if 'phone_number' in data:
        user.phone_number = data.get('phone_number')
    if 'location' in data:
        user.location = data.get('location')
    if 'avatar_url_field' in data:
        user.avatar_url_field = data.get('avatar_url_field')
    if 'avatar' in request.FILES:
        user.avatar = request.FILES['avatar']

    user.save()
    serializer = UserDetailSerializer(user)
    return JsonResponse({'success': True, 'user': serializer.data})


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def landlord_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    serializer = UserDetailSerializer(user, many=False)
    properties = user.properties.all()
    properties_serializer = PropertiesListSerializer(properties, many=True, context={'request': request})

    return JsonResponse({
        'user': serializer.data,
        'properties': properties_serializer.data,
    }, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reservations_list(request):
    reservations = request.user.reservations.all().select_related('property', 'created_by')
    serializer = ReservationsListSerializer(reservations, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_reservation(request, pk):
    try:
        reservation = Reservation.objects.select_related('property').get(pk=pk)
    except Reservation.DoesNotExist:
        return JsonResponse({'error': 'Reservation not found'}, status=404)

    if reservation.created_by != request.user and reservation.property.landlord != request.user and not request.user.is_staff:
        return JsonResponse({'error': 'You do not have permission to cancel this reservation'}, status=403)

    reservation.status = 'cancelled'
    reservation.save(update_fields=['status'])

    return JsonResponse({
        'success': True,
        'message': 'Reservation successfully cancelled. Dates are now unblocked.',
        'reservation_id': str(reservation.id),
        'status': reservation.status
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def host_dashboard(request):
    user = request.user
    owned_properties = user.properties.all()
    reservations = Reservation.objects.filter(property__in=owned_properties).select_related('property', 'created_by')

    confirmed_reservations = reservations.filter(status='confirmed')
    total_earnings = confirmed_reservations.aggregate(Sum('total_price'))['total_price__sum'] or 0.0

    properties_serializer = PropertiesListSerializer(owned_properties, many=True, context={'request': request})
    reservations_serializer = ReservationsListSerializer(reservations, many=True)

    return JsonResponse({
        'host': UserDetailSerializer(user).data,
        'stats': {
            'total_listings': owned_properties.count(),
            'total_bookings': reservations.count(),
            'confirmed_bookings': confirmed_reservations.count(),
            'total_earnings': round(total_earnings, 2),
        },
        'properties': properties_serializer.data,
        'reservations': reservations_serializer.data,
    })