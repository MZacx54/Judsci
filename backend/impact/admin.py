from django.contrib import admin
from .models import ImpactStat, ImpactLocation

@admin.register(ImpactStat)
class ImpactStatAdmin(admin.ModelAdmin):
    list_display = ('label', 'value', 'suffix')

@admin.register(ImpactLocation)
class ImpactLocationAdmin(admin.ModelAdmin):
    list_display = ('title', 'latitude', 'longitude')
