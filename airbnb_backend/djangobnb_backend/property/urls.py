from django.urls import path
from . import api

urlpatterns = [
    path('', api.properties_list, name='api_properties_list'),
    path('create/', api.create_property, name='api_create_property'),
    path('favorites/', api.favorites_list, name='api_favorites_list'),
    path('<uuid:pk>/', api.properties_detail, name='api_properties_detail'),
    path('<uuid:pk>/edit/', api.edit_property, name='api_edit_property'),
    path('<uuid:pk>/delete/', api.delete_property, name='api_delete_property'),
    path('<uuid:pk>/book/', api.book_property, name='api_book_property'),
    path('<uuid:pk>/reservations/', api.property_reservations, name='api_property_reservations'),
    path('<uuid:pk>/toggle_favorite/', api.toggle_favorite, name='api_toggle_favorite'),
    path('<uuid:pk>/reviews/', api.property_reviews, name='api_property_reviews'),
]