from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_host', 'is_superhost', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('email', 'name', 'location')
    list_filter = ('is_host', 'is_superhost', 'is_staff', 'is_superuser')