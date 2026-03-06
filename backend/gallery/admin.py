from django.contrib import admin
from .models import Photo

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'category')
