from django.contrib import admin
from .models import Resource

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'date')
    list_filter = ('type', 'date')
    search_fields = ('title',)
