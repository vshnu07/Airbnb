from rest_framework import serializers

from .models import User


class UserDetailSerializer(serializers.ModelSerializer):
    avatar_url = serializers.CharField(read_only=True)
    total_listings = serializers.IntegerField(source='total_listings_count', read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'name',
            'email',
            'avatar_url',
            'bio',
            'is_host',
            'is_superhost',
            'phone_number',
            'location',
            'total_listings',
            'date_joined',
        )



class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'name',
            'bio',
            'is_host',
            'phone_number',
            'location',
            'avatar',
            'avatar_url_field',
        )