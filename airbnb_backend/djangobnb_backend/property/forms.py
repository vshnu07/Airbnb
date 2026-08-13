from django.forms import ModelForm
from .models import Property


class PropertyForm(ModelForm):
    class Meta:
        model = Property
        fields = (
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
            'image',
            'primary_image_url',
        )