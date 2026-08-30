from django.contrib import admin
from .models import Resource

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'date', 'created_at')
    list_filter = ('type', 'date')
    search_fields = ('title', 'description')
    
    fieldsets = (
        ('Document Details', {
            'fields': ('title', 'type', 'date', 'description')
        }),
        ('Files & Media', {
            'fields': ('file', 'cover_image')
        }),
    )
