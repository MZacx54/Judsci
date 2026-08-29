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
    Sends an email in a background thread using Resend API with Django SMTP fallback.
    """
    def _send():
        recipients = to_email if isinstance(to_email, list) else [to_email]
        resend_key = getattr(settings, 'RESEND_API_KEY', '') or os.environ.get('RESEND_API_KEY', '')
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@judsci.org.ng')

        sent_via_resend = False

        if resend_key:
            try:
                resend.api_key = resend_key
                params = {
                    "from": from_email,
                    "to": recipients,
                    "subject": subject,
                    "html": body.replace('\n', '<br>'),
                    "text": body,
                }
                if reply_to:
                    params["reply_to"] = reply_to[0] if isinstance(reply_to, list) else reply_to

                response = resend.Emails.send(params)
                logger.info(f"[Resend Email Success] Sent to {recipients}. Response: {response}")
                sent_via_resend = True
            except Exception as e:
                logger.warning(f"[Resend Email Warning] Failed to send via Resend ({e}). Trying Django SMTP fallback...")

        # Fallback to Django core mail if Resend was not used or failed
        if not sent_via_resend:
            try:
                msg = EmailMessage(
                    subject=subject,
                    body=body,
                    from_email=from_email,
                    to=recipients,
                    reply_to=[reply_to[0] if isinstance(reply_to, list) else reply_to] if reply_to else None,
                )
                msg.send(fail_silently=False)
                logger.info(f"[Django SMTP Success] Sent email to {recipients}")
            except Exception as e:
                logger.error(f"[Email Dispatch Error] Failed to send email to {recipients}: {e}")

    email_thread = threading.Thread(target=_send)
    email_thread.start()

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows appointments to be viewed or edited.
    """
    queryset = Appointment.objects.all().order_by('-created_at')
    serializer_class = AppointmentSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'metadata'] or self.request.method in ['POST', 'OPTIONS']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"[Booking Serializer Validation Error]: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        appointment = None
        try:
            appointment = serializer.save()
        except Exception as e:
            logger.warning(f"[Booking Serializer Save Notice, trying resilient SQL fallback]: {e}")
            try:
                from django.db import connection
                data = serializer.validated_data
                name = data.get('name', '')
                email = data.get('email', '')
                phone = data.get('phone', '')
                date = data.get('date')
                time = data.get('time')
                reason = data.get('reason', '')
                status_val = 'PENDING'

                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT column_name FROM information_schema.columns 
                        WHERE table_schema = 'public' AND table_name = 'bookings_appointment';
                    """)
                    db_columns = {row[0] for row in cursor.fetchall()}

                    col_mapping = {
                        'name': name,
                        'full_name': name,
                        'email': email,
                        'phone': phone,
                        'date': date,
                        'preferred_date': date,
                        'time': time,
                        'preferred_time': time,
                        'reason': reason,
                        'service_type': 'General Consultation',
                        'notes': reason,
                        'status': status_val,
                    }

                    insert_cols = []
                    insert_vals = []
                    params = []

                    for col, val in col_mapping.items():
                        if col in db_columns:
                            insert_cols.append(f'"{col}"')
                            insert_vals.append('%s')
                            params.append(val)

                    query = f"""
                        INSERT INTO bookings_appointment ({', '.join(insert_cols)})
                        VALUES ({', '.join(insert_vals)})
                        RETURNING id;
                    """
                    cursor.execute(query, params)
                    new_id = cursor.fetchone()[0]
                    appointment = Appointment.objects.get(id=new_id)
            except Exception as sql_err:
                logger.error(f"[Booking Resilient Fallback Error]: {sql_err}")
                return Response({"error": "Failed to save appointment", "detail": str(sql_err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Background email notifications
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

            admin_notification_emails = getattr(settings, 'ADMIN_NOTIFICATION_EMAILS', ['dmzacx@gmail.com', 'judscib@gmail.com', 'support@judsci.org.ng'])
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

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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
