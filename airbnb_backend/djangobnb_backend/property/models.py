import uuid

from django.conf import settings
from django.db import models
from django.db.models import Avg

from useraccount.models import User


class Property(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price_per_night = models.IntegerField()
    cleaning_fee = models.IntegerField(default=50)
    service_fee_percentage = models.IntegerField(default=14)

    bedrooms = models.IntegerField(default=1)
    beds = models.IntegerField(default=1)
    bathrooms = models.IntegerField(default=1)
    guests = models.IntegerField(default=2)

    country = models.CharField(max_length=255, default='India')
    country_code = models.CharField(max_length=10, default='IN')
    city = models.CharField(max_length=255, default='')
    address = models.CharField(max_length=255, blank=True, null=True, default='')
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)

    category = models.CharField(max_length=255)
    property_type = models.CharField(max_length=100, default='House')
    amenities = models.JSONField(default=list, blank=True)

    favorited = models.ManyToManyField(User, related_name='favorites', blank=True)
    image = models.ImageField(upload_to='uploads/properties', blank=True, null=True)
    primary_image_url = models.CharField(max_length=1000, blank=True, null=True)

    landlord = models.ForeignKey(User, related_name='properties', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

    def image_url(self):
        if self.image:
            try:
                return f'{settings.WEBSITE_URL}{self.image.url}'
            except Exception:
                pass
        if self.primary_image_url:
            return self.primary_image_url
        first_img = self.images.first()
        if first_img:
            return first_img.get_image_url()
        return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'

    def all_images(self):
        urls = []
        primary = self.image_url()
        if primary:
            urls.append(primary)
        for img in self.images.all():
            img_url = img.get_image_url()
            if img_url and img_url not in urls:
                urls.append(img_url)
        return urls

    @property
    def reviews_count(self):
        return self.reviews.count()

    @property
    def rating_avg(self):
        avg = self.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 2) if avg is not None else 4.95

    @property
    def category_ratings(self):
        agg = self.reviews.aggregate(
            cleanliness=Avg('cleanliness_rating'),
            accuracy=Avg('accuracy_rating'),
            communication=Avg('communication_rating'),
            location=Avg('location_rating'),
            value=Avg('value_rating'),
        )
        return {
            'cleanliness': round(agg['cleanliness'] or 4.9, 1),
            'accuracy': round(agg['accuracy'] or 4.9, 1),
            'communication': round(agg['communication'] or 5.0, 1),
            'location': round(agg['location'] or 4.9, 1),
            'value': round(agg['value'] or 4.8, 1),
        }


class PropertyImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='uploads/properties/gallery', blank=True, null=True)
    image_url = models.CharField(max_length=1000, blank=True, null=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('order', 'created_at')

    def get_image_url(self):
        if self.image:
            try:
                return f'{settings.WEBSITE_URL}{self.image.url}'
            except Exception:
                pass
        if self.image_url:
            return self.image_url
        return ''


class Reservation(models.Model):
    STATUS_CHOICES = (
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, related_name='reservations', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    number_of_nights = models.IntegerField()
    guests = models.IntegerField(default=1)
    cleaning_fee = models.FloatField(default=0)
    service_fee = models.FloatField(default=0)
    total_price = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    payment_status = models.CharField(max_length=20, default='paid')
    created_by = models.ForeignKey(User, related_name='reservations', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, related_name='reviews', on_delete=models.CASCADE)
    author = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)
    rating = models.FloatField(default=5.0)
    cleanliness_rating = models.FloatField(default=5.0)
    accuracy_rating = models.FloatField(default=5.0)
    communication_rating = models.FloatField(default=5.0)
    location_rating = models.FloatField(default=5.0)
    value_rating = models.FloatField(default=5.0)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)