from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework import viewsets, permissions
from .models import Appointment
from .serializers import AppointmentSerializer
import threading
import logging

logger = logging.getLogger(__name__)

import resend

import os

def send_async_email(subject, body, to_email, reply_to=None):
    """
    Sends an email in a background thread using the Resend HTTPS API.
    """
    def _send():
        try:
            resend_key = getattr(settings, 'RESEND_API_KEY', '') or os.environ.get('RESEND_API_KEY', '')
            if not resend_key:
                logger.info("Resend API key not set, skipping email dispatch.")
                return

            resend.api_key = resend_key
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'onboarding@resend.dev')

            params = {
                "from": from_email,
                "to": to_email if isinstance(to_email, list) else [to_email],
                "subject": subject,
                "html": body.replace('\n', '<br>'),
                "text": body,
            }
            
            if reply_to:
                if isinstance(reply_to, list):
                    params["reply_to"] = reply_to[0]
                else:
                    params["reply_to"] = reply_to

            response = resend.Emails.send(params)
            logger.info(f"Resend API success. Email sent to {to_email}. Response: {response}")
        except Exception as e:
            logger.error(f"Notice sending email via Resend to {to_email}: {str(e)}")

    email_thread = threading.Thread(target=_send)
    email_thread.start()

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows appointments to be viewed or edited.
    """
    queryset = Appointment.objects.all().order_by('-created_at')
    serializer_class = AppointmentSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        appointment = serializer.save()
        
        try:
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
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@judsci.org.ng')
            send_async_email(
                subject="Appointment Received: JUDSCI Bauchi", 
                body=user_msg, 
                to_email=[appointment.email],
                reply_to=[from_email]
            )

            admin_notification_emails = getattr(settings, 'ADMIN_NOTIFICATION_EMAILS', ['support@judsci.org.ng', 'judscib@gmail.com'])
            admin_msg = f"""New appointment request received.

Name: {appointment.name}
Date: {appointment.date}
Time: {appointment.time}
Reason: {appointment.reason}
Phone: {appointment.phone}
Email: {appointment.email}

Please log in to the admin dashboard to Approve or Reject this request.
Django Admin: https://www.judsci.org.ng/admin
"""
            send_async_email(
                subject=f"New Booking Request: {appointment.name}", 
                body=admin_msg, 
                to_email=admin_notification_emails,
                reply_to=[appointment.email]
            )
        except Exception as e:
            logger.error(f"Notice sending booking notification email: {e}")

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
