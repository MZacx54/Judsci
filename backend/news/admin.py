from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'published_date')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('category', 'published_date')
    search_fields = ('title', 'body')
    
    fieldsets = (
        ('Content Information', {
            'fields': ('title', 'slug', 'category', 'author', 'summary', 'body')
        }),
        ('Media', {
            'fields': ('image',)
        }),
    )
