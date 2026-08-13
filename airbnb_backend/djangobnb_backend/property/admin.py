from django.contrib import admin
from .models import Property, PropertyImage, Reservation, Review

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'landlord', 'city', 'country', 'category', 'price_per_night', 'created_at')
    search_fields = ('title', 'description', 'city', 'country')
    list_filter = ('category', 'property_type', 'country')

@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property', 'order', 'created_at')

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('property', 'created_by', 'start_date', 'end_date', 'total_price', 'status')
    list_filter = ('status', 'start_date')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('property', 'author', 'rating', 'created_at')
    list_filter = ('rating',)