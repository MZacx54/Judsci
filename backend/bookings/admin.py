from django.contrib import admin
from django.conf import settings
from .models import Appointment
from .views import send_async_email

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'date', 'time', 'status', 'created_at')
    list_filter = ('status', 'date')
    search_fields = ('name', 'email', 'phone', 'reason')
    readonly_fields = ('created_at',)
    actions = ['mark_confirmed', 'mark_rescheduled', 'mark_cancelled']
    
    fieldsets = (
        ('Appointment Schedule & Status', {
            'fields': ('status', 'date', 'time')
        }),
        ('Visitor Contact Details', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Consultation Reason / Notes', {
            'fields': ('reason',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        old_date = None
        old_time = None
        old_status = None

        if change and obj.pk:
            try:
                if form and hasattr(form, 'initial') and form.initial:
                    old_date = form.initial.get('date', None)
                    old_time = form.initial.get('time', None)
                    old_status = form.initial.get('status', None)
                else:
                    old_record = Appointment.objects.filter(pk=obj.pk).values('date', 'time', 'status').first()
                    if old_record:
                        old_date = old_record['date']
                        old_time = old_record['time']
                        old_status = old_record['status']
            except Exception:
                pass

        schedule_changed = False
        if old_date is not None and old_time is not None:
            schedule_changed = (str(old_date) != str(obj.date)) or (str(old_time) != str(obj.time))

        if schedule_changed and obj.status in ('PENDING', 'CONFIRMED'):
            obj.status = 'RESCHEDULED'

        super().save_model(request, obj, form, change)

        try:
            prev_info_str = f"{old_date} at {old_time}" if (schedule_changed and old_date and old_time) else None
            self.send_status_email(obj, obj.status, previous_schedule=prev_info_str)
        except Exception as mail_err:
            print(f"Notice sending status email: {mail_err}")

    def mark_confirmed(self, request, queryset):
        count = 0
        for appointment in queryset:
            if appointment.status != 'CONFIRMED':
                appointment.status = 'CONFIRMED'
                appointment.save()
                self.send_status_email(appointment, 'CONFIRMED')
                count += 1
        self.message_user(request, f"{count} appointment(s) marked as CONFIRMED and notification emails dispatched.")
    mark_confirmed.short_description = "Mark selected appointments as CONFIRMED"

    def mark_rescheduled(self, request, queryset):
        count = 0
        for appointment in queryset:
            if appointment.status != 'RESCHEDULED':
                appointment.status = 'RESCHEDULED'
                appointment.save()
                self.send_status_email(appointment, 'RESCHEDULED')
                count += 1
        self.message_user(request, f"{count} appointment(s) marked as RESCHEDULED and notification emails dispatched.")
    mark_rescheduled.short_description = "Mark selected appointments as RESCHEDULED"

    def mark_cancelled(self, request, queryset):
        count = 0
        for appointment in queryset:
            if appointment.status != 'CANCELLED':
                appointment.status = 'CANCELLED'
                appointment.save()
                self.send_status_email(appointment, 'CANCELLED')
                count += 1
        self.message_user(request, f"{count} appointment(s) marked as CANCELLED and notification emails dispatched.")
    mark_cancelled.short_description = "Mark selected appointments as CANCELLED"

    def send_status_email(self, appointment, new_status, previous_schedule=None):
        if not appointment or not getattr(appointment, 'email', None):
            return

        subject = ""
        message = ""

        if new_status == 'CONFIRMED':
            subject = f"Appointment Confirmed: JUDSCI Bauchi - {appointment.date}"
            message = f"""Dear {appointment.name},

Good news! Your appointment with the Justice Development and Social Cohesion Initiative (JUDSCI) Bauchi has been CONFIRMED.

Appointment Details:
----------------------------------------
Date: {appointment.date}
Time: {appointment.time}
Status: CONFIRMED
Location: JUDSCI Bauchi Secretariat (Catholic Secretariat, Bauchi)
Reason: {appointment.reason or 'General Consultation'}

If you need any directions or have urgent inquiries before your visit, please reply directly to this email or call our desk.

Warm regards,
JUDSCI Bauchi Team
https://www.judsci.org.ng
"""
        elif new_status == 'RESCHEDULED':
            prev_info = f"\nPrevious Schedule: {previous_schedule}\n" if previous_schedule else ""
            subject = f"Appointment Rescheduled: JUDSCI Bauchi - {appointment.date}"
            message = f"""Dear {appointment.name},

Please be informed that your consultation appointment with JUDSCI Bauchi has been RESCHEDULED.
{prev_info}
New Appointment Schedule:
----------------------------------------
New Date: {appointment.date}
New Time: {appointment.time}
Status: RESCHEDULED
Location: JUDSCI Bauchi Secretariat (Catholic Secretariat, Bauchi)
Reason: {appointment.reason or 'General Consultation'}

We look forward to meeting with you at the new time. If this new schedule is inconvenient for you, please reply directly to this email to coordinate another date.

Warm regards,
JUDSCI Bauchi Team
https://www.judsci.org.ng
"""
        elif new_status == 'CANCELLED':
            subject = f"Appointment Cancelled: JUDSCI Bauchi"
            message = f"""Dear {appointment.name},

We regret to inform you that your appointment request scheduled for {appointment.date} at {appointment.time} has been CANCELLED.

If you would like to reschedule or book another consultation session, please visit our online booking portal:
https://www.judsci.org.ng/bookings

Warm regards,
JUDSCI Bauchi Team
https://www.judsci.org.ng
"""
        elif new_status == 'PENDING':
            subject = f"Appointment Status Update: PENDING - JUDSCI Bauchi"
            message = f"""Dear {appointment.name},

Your appointment request for {appointment.date} at {appointment.time} is currently PENDING review by our administrative team. You will receive an official confirmation shortly.

Warm regards,
JUDSCI Bauchi Team
https://www.judsci.org.ng
"""

        if subject and message:
            try:
                # 1. Send to visitor
                send_async_email(
                    subject=subject, 
                    body=message, 
                    to_email=[appointment.email],
                    reply_to=['support@judsci.org.ng']
                )

                # 2. Also notify admin team
                admin_subject = f"[Admin Alert] Appointment {new_status}: {appointment.name}"
                admin_body = f"""Appointment for {appointment.name} was updated to {new_status}.

Schedule: {appointment.date} at {appointment.time}
Contact: {appointment.email} | {appointment.phone}
Reason: {appointment.reason}

Django Admin: https://www.judsci.org.ng/admin/bookings/appointment/{appointment.id}/change/
"""
                send_async_email(
                    subject=admin_subject,
                    body=admin_body,
                    to_email=['meshachzax@gmail.com', 'dmzacx@gmail.com', 'judscib@gmail.com']
                )
            except Exception as e:
                print(f"Notice sending appointment status email: {e}")
