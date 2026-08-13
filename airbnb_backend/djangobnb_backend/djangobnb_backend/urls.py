from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def root_index(request):
    return JsonResponse({
        'status': 'healthy',
        'app': 'Airbnb India Backend API',
        'version': '1.0.0',
        'message': 'Airbnb India API is up and running!',
        'endpoints': {
            'properties': '/api/properties/',
            'auth': '/api/auth/',
            'chat': '/api/chat/',
            'admin': '/admin/',
        }
    })


urlpatterns = [
    path('', root_index, name='api_root_index'),
    path('admin/', admin.site.urls),
    path('api/properties/', include('property.urls')),
    path('api/auth/', include('useraccount.urls')),
    path('api/chat/', include('chat.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

