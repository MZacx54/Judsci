from django.contrib import admin
from django.conf import settings
from .models import Appointment
from .views import send_async_email

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'time', 'status')
    list_filter = ('status', 'date')
    search_fields = ('name', 'email', 'phone')
    actions = ['mark_confirmed']
    
    fieldsets = (
        ('Appointment Schedule', {
            'fields': ('date', 'time', 'status')
        }),
        ('Visitor Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Additional Info', {
            'fields': ('reason',)
        }),
    )

    def save_model(self, request, obj, form, change):
        if change:
            # Get the original object from the database to check if status changed
            old_obj = Appointment.objects.get(pk=obj.pk)
            if old_obj.status != obj.status:
                self.send_status_email(obj, obj.status)
        super().save_model(request, obj, form, change)

    def mark_confirmed(self, request, queryset):
        for appointment in queryset:
            if appointment.status != 'CONFIRMED':
                appointment.status = 'CONFIRMED'
                appointment.save()
                self.send_status_email(appointment, 'CONFIRMED')
    mark_confirmed.short_description = "Mark selected appointments as confirmed"

    def send_status_email(self, appointment, new_status):
        subject = ""
        message = ""

        if new_status == 'CONFIRMED':
            subject = f"Appointment Confirmed: JUDSCI Bauchi - {appointment.date}"
            message = f"""Dear {appointment.name},

Good news! Your appointment has been CONFIRMED.

Details:
Date: {appointment.date}
Time: {appointment.time}
Location: JUDSCI Bauchi Secretariat

We look forward to seeing you.

Regards,
JUDSCI Bauchi Team
"""
        elif new_status == 'CANCELLED':
            subject = f"Appointment Update: JUDSCI Bauchi"
            message = f"""Dear {appointment.name},

We regret to inform you that we cannot accommodate your appointment request for {appointment.date} at this time.

Please contact us directly if you would like to reschedule.

Regards,
JUDSCI Bauchi Team
"""
        elif new_status == 'RESCHEDULED':
            subject = f"Appointment Rescheduled: JUDSCI Bauchi - {appointment.date}"
            message = f"""Dear {appointment.name},

Your appointment with JUDSCI Bauchi has been RESCHEDULED.

New Details:
Date: {appointment.date}
Time: {appointment.time}
Location: JUDSCI Bauchi Secretariat

We look forward to seeing you at the new time.

Regards,
JUDSCI Bauchi Team
"""

        if subject and message:
            send_async_email(
                subject=subject, 
                body=message, 
                to_email=[appointment.email],
                reply_to=[settings.EMAIL_HOST_USER]
            )
