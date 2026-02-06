from django.contrib import admin
from .models import Program

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'description')
    
    fieldsets = (
        ('Thematic Area Info', {
            'fields': ('title', 'slug', 'icon', 'color')
        }),
        ('Content', {
            'fields': ('description', 'image')
        }),
    )
