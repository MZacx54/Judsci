from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'time', 'status')
    list_filter = ('status', 'date')
    search_fields = ('name', 'email', 'phone')
    actions = ['mark_confirmed']

    def mark_confirmed(self, request, queryset):
        queryset.update(status='CONFIRMED')
    mark_confirmed.short_description = "Mark selected appointments as confirmed"
