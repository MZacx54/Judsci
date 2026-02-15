from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, permissions
from .models import Appointment
from .serializers import AppointmentSerializer
import threading

def send_async_email(subject, message, recipient_list):
    """Utility to send emails in a background thread to avoid blocking the main request."""
    email_thread = threading.Thread(
        target=send_mail,
        args=(subject, message, settings.EMAIL_HOST_USER, recipient_list),
        kwargs={'fail_silently': True}
    )
    email_thread.start()

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows appointments to be viewed or edited.
    """
    queryset = Appointment.objects.all().order_by('-created_at')
    serializer_class = AppointmentSerializer
    authentication_classes = [] # Allow public creation
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        appointment = serializer.save()
        
        # 1. Background Confirmation to User
        user_msg = f"""Dear {appointment.name},

Thank you for contacting JUDSCI Bauchi. Your appointment request has been received and is currently PENDING review.

Details:
Date: {appointment.date}
Time: {appointment.time}
Reason: {appointment.reason}

You will receive another email once your appointment is confirmed or if we need to reschedule.

Regards,
JUDSCI Bauchi Team
"""
        send_async_email(f"Appointment Received: JUDSCI Bauchi", user_msg, [appointment.email])

        # 2. Background Alert to Admin
        admin_msg = f"""New appointment request received.

Name: {appointment.name}
Date: {appointment.date}
Time: {appointment.time}
Reason: {appointment.reason}
Phone: {appointment.phone}

Please log in to the admin dashboard to Approve or Reject this request.
"""
        send_async_email(f"New Booking Request: {appointment.name}", admin_msg, [settings.EMAIL_HOST_USER])

    def perform_update(self, serializer):
        instance = self.get_object()
        new_status = serializer.validated_data.get('status', instance.status)
        appointment = serializer.save()

        if instance.status != new_status:
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

            if subject and message:
                send_async_email(subject, message, [appointment.email])
