from django.urls import path

from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView, LogoutView
from rest_framework_simplejwt.views import TokenVerifyView

from . import api

urlpatterns = [
    path('register/', RegisterView.as_view(), name='rest_register'),
    path('login/', LoginView.as_view(), name='rest_login'),
    path('logout/', LogoutView.as_view(), name='rest_logout'),
    path('token/refresh/', get_refresh_view().as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    path('me/', api.my_profile, name='api_my_profile'),
    path('me/update/', api.update_profile, name='api_update_profile'),
    
    path('myreservations/', api.reservations_list, name='api_reservations_list'),
    path('trips/', api.reservations_list, name='api_trips_list'),
    path('reservations/<uuid:pk>/cancel/', api.cancel_reservation, name='api_cancel_reservation'),
    
    path('host/dashboard/', api.host_dashboard, name='api_host_dashboard'),
    path('<uuid:pk>/', api.landlord_detail, name='api_landlord_detail'),
]