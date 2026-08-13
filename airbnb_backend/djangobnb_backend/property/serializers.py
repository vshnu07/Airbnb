from rest_framework import serializers

from .models import Property, PropertyImage, Reservation, Review
from useraccount.serializers import UserDetailSerializer


class PropertyImageSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='get_image_url', read_only=True)

    class Meta:
        model = PropertyImage
        fields = ('id', 'url', 'order')


class ReviewSerializer(serializers.ModelSerializer):
    author = UserDetailSerializer(read_only=True)

    class Meta:
        model = Review
        fields = (
            'id',
            'author',
            'rating',
            'cleanliness_rating',
            'accuracy_rating',
            'communication_rating',
            'location_rating',
            'value_rating',
            'comment',
            'created_at',
        )


class PropertiesListSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(read_only=True)
    images = serializers.ListField(source='all_images', read_only=True)
    rating = serializers.FloatField(source='rating_avg', read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'description',
            'price_per_night',
            'cleaning_fee',
            'image_url',
            'images',
            'country',
            'country_code',
            'city',
            'address',
            'latitude',
            'longitude',
            'category',
            'property_type',
            'bedrooms',
            'beds',
            'bathrooms',
            'guests',
            'rating',
            'reviews_count',
            'is_favorite',
            'landlord_id',
            'created_at',
        )

    def get_is_favorite(self, obj):
        request = self.context.get('request', None)
        if request and request.user and request.user.is_authenticated:
            return obj.favorited.filter(id=request.user.id).exists()
        return False


class PropertiesDetailSerializer(serializers.ModelSerializer):
    landlord = UserDetailSerializer(read_only=True)
    image_url = serializers.CharField(read_only=True)
    images = serializers.ListField(source='all_images', read_only=True)
    gallery = PropertyImageSerializer(source='images', many=True, read_only=True)
    rating = serializers.FloatField(source='rating_avg', read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)
    category_ratings = serializers.DictField(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()
    reserved_dates = serializers.SerializerMethodField()


    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'description',
            'price_per_night',
            'cleaning_fee',
            'service_fee_percentage',
            'bedrooms',
            'beds',
            'bathrooms',
            'guests',
            'country',
            'country_code',
            'city',
            'address',
            'latitude',
            'longitude',
            'category',
            'property_type',
            'amenities',
            'image_url',
            'images',
            'gallery',
            'landlord',
            'rating',
            'reviews_count',
            'category_ratings',
            'reviews',
            'is_favorite',
            'reserved_dates',
            'created_at',
        )

    def get_is_favorite(self, obj):
        request = self.context.get('request', None)
        if request and request.user and request.user.is_authenticated:
            return obj.favorited.filter(id=request.user.id).exists()
        return False

    def get_reserved_dates(self, obj):
        active_reservations = obj.reservations.filter(status='confirmed')
        return [
            {
                'id': str(res.id),
                'start_date': str(res.start_date),
                'end_date': str(res.end_date),
            }
            for res in active_reservations
        ]


class ReservationsListSerializer(serializers.ModelSerializer):
    property = PropertiesListSerializer(read_only=True)
    created_by = UserDetailSerializer(read_only=True)
    
    class Meta:
        model = Reservation
        fields = (
            'id',
            'start_date',
            'end_date',
            'number_of_nights',
            'guests',
            'cleaning_fee',
            'service_fee',
            'total_price',
            'status',
            'payment_status',
            'property',
            'created_by',
            'created_at',
        )