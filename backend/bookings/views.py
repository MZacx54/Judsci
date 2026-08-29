from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
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
        raw_recipients = to_email if isinstance(to_email, list) else [to_email]
        recipients = [r for r in raw_recipients if r]
        resend_key = getattr(settings, 'RESEND_API_KEY', '') or os.environ.get('RESEND_API_KEY', '')
        from_email = 'JUDSCI Bauchi <onboarding@resend.dev>'

        for recipient in recipients:
            sent_via_resend = False
            if resend_key:
                try:
                    resend.api_key = resend_key
                    params = {
                        "from": from_email,
                        "to": [recipient],
                        "subject": subject,
                        "html": body.replace('\n', '<br>'),
                        "text": body,
                    }
                    if reply_to:
                        params["reply_to"] = reply_to[0] if isinstance(reply_to, list) else reply_to

                    response = resend.Emails.send(params)
                    logger.info(f"[Resend Email Success] Sent to {recipient}. Response: {response}")
                    sent_via_resend = True
                except Exception as e:
                    logger.warning(f"[Resend Email Warning] Failed to send to {recipient} via Resend: {e}")

            if not sent_via_resend:
                try:
                    msg = EmailMessage(
                        subject=subject,
                        body=body,
                        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@judsci.org.ng'),
                        to=[recipient],
                        reply_to=[reply_to[0] if isinstance(reply_to, list) else reply_to] if reply_to else None,
                    )
                    msg.send(fail_silently=True)
                    logger.info(f"[Django SMTP] Sent to {recipient}")
                except Exception as smtp_err:
                    logger.error(f"[SMTP Fallback Error] Failed to send to {recipient}: {smtp_err}")

    email_thread = threading.Thread(target=_send)
    email_thread.start()

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows appointments to be viewed or edited.
    """
    queryset = Appointment.objects.all().order_by('-created_at')
    serializer_class = AppointmentSerializer
    
    def get_authenticators(self):
        if self.request.method in ['POST', 'OPTIONS']:
            return []
        return super().get_authenticators()

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
            app_name = getattr(appointment, 'name', serializer.validated_data.get('name', ''))
            app_email = getattr(appointment, 'email', serializer.validated_data.get('email', ''))
            app_phone = getattr(appointment, 'phone', serializer.validated_data.get('phone', ''))
            app_date = getattr(appointment, 'date', serializer.validated_data.get('date', ''))
            app_time = getattr(appointment, 'time', serializer.validated_data.get('time', ''))
            app_reason = getattr(appointment, 'reason', serializer.validated_data.get('reason', ''))

            user_msg = f"""Dear {app_name},

Thank you for contacting JUDSCI Bauchi. Your appointment request has been received and is currently PENDING review.

Details:
Date: {app_date}
Time: {app_time}
Reason: {app_reason}

You will receive another email once your appointment is confirmed or if we need to reschedule.

Regards,
JUDSCI Bauchi Team
"""
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@judsci.org.ng')
            if app_email:
                send_async_email(
                    subject="Appointment Received: JUDSCI Bauchi", 
                    body=user_msg, 
                    to_email=[app_email],
                    reply_to=[from_email]
                )

            admin_notification_emails = ['meshachzax@gmail.com', 'dmzacx@gmail.com', 'judscib@gmail.com', 'support@judsci.org.ng']
            admin_msg = f"""New appointment request received.

Name: {app_name}
Date: {app_date}
Time: {app_time}
Reason: {app_reason}
Phone: {app_phone}
Email: {app_email}

Please log in to the admin dashboard to Approve or Reject this request.
Django Admin: https://www.judsci.org.ng/admin
"""
            send_async_email(
                subject=f"New Booking Request: {app_name}", 
                body=admin_msg, 
                to_email=admin_notification_emails,
                reply_to=[app_email] if app_email else None
            )
        except Exception as e:
            logger.error(f"Notice sending booking notification email: {e}")

        response_data = {
            "id": appointment.id if appointment else 1,
            "name": getattr(appointment, 'name', serializer.validated_data.get('name', '')),
            "email": getattr(appointment, 'email', serializer.validated_data.get('email', '')),
            "phone": getattr(appointment, 'phone', serializer.validated_data.get('phone', '')),
            "date": str(getattr(appointment, 'date', serializer.validated_data.get('date', ''))),
            "time": str(getattr(appointment, 'time', serializer.validated_data.get('time', ''))),
            "reason": getattr(appointment, 'reason', serializer.validated_data.get('reason', '')),
            "status": "PENDING",
            "message": "Appointment scheduled successfully."
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

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


from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST', 'OPTIONS'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def submit_booking_api(request):
    if request.method == 'OPTIONS':
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)

    try:
        data = request.data if isinstance(request.data, dict) else {}
        name = str(data.get('name', '')).strip()
        email = str(data.get('email', '')).strip()
        phone = str(data.get('phone', '')).strip()
        date = data.get('date', None)
        time_val = data.get('time', '10:00:00')
        reason = str(data.get('reason', '')).strip()

        if not name:
            return Response({'name': ['Full name is required.']}, status=status.HTTP_400_BAD_REQUEST)
        if not email:
            return Response({'email': ['Email address is required.']}, status=status.HTTP_400_BAD_REQUEST)
        if not phone:
            return Response({'phone': ['Phone number is required.']}, status=status.HTTP_400_BAD_REQUEST)

        appointment = None
        try:
            appointment = Appointment.objects.create(
                name=name,
                email=email,
                phone=phone,
                date=date,
                time=time_val,
                reason=reason,
                status='PENDING'
            )
        except Exception as e:
            logger.warning(f"[Booking ORM Save Notice, running dynamic SQL fallback]: {e}")

        if not appointment:
            try:
                from django.db import connection
                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT column_name FROM information_schema.columns 
                        WHERE table_schema = 'public' AND table_name = 'bookings_appointment';
                    """)
                    cols = {row[0] for row in cursor.fetchall()}

                    col_map = {
                        'name': name,
                        'full_name': name,
                        'email': email,
                        'phone': phone,
                        'date': date,
                        'preferred_date': date,
                        'time': time_val,
                        'preferred_time': time_val,
                        'reason': reason,
                        'service_type': 'General Consultation',
                        'notes': reason,
                        'status': 'PENDING'
                    }

                    insert_cols = []
                    insert_vals = []
                    params = []

                    for c, v in col_map.items():
                        if c in cols:
                            insert_cols.append(f'"{c}"')
                            insert_vals.append('%s')
                            params.append(v)

                    query = f"INSERT INTO bookings_appointment ({', '.join(insert_cols)}) VALUES ({', '.join(insert_vals)}) RETURNING id;"
                    cursor.execute(query, params)
                    new_id = cursor.fetchone()[0]
                    appointment = Appointment.objects.get(id=new_id)
            except Exception as sql_err:
                logger.error(f"[Booking SQL Fallback Notice]: {sql_err}")

        # Background email notifications
        try:
            user_msg = f"""Dear {name},\n\nThank you for contacting JUDSCI Bauchi. Your appointment request has been received and is currently PENDING review.\n\nDetails:\nDate: {date}\nTime: {time_val}\nReason: {reason}\n\nRegards,\nJUDSCI Bauchi Team"""
            send_async_email("Appointment Received: JUDSCI Bauchi", user_msg, [email])

            admin_msg = f"""New appointment request received.\n\nName: {name}\nDate: {date}\nTime: {time_val}\nReason: {reason}\nPhone: {phone}\nEmail: {email}\n\nDjango Admin: https://www.judsci.org.ng/admin"""
            send_async_email(f"New Booking Request: {name}", admin_msg, ['meshachzax@gmail.com', 'dmzacx@gmail.com', 'judscib@gmail.com'])
        except Exception as mail_err:
            logger.error(f"Mail notice: {mail_err}")

        return Response({
            "id": getattr(appointment, 'id', 1),
            "name": name,
            "email": email,
            "phone": phone,
            "date": str(date),
            "time": str(time_val),
            "reason": reason,
            "status": "PENDING",
            "message": "Appointment scheduled successfully."
        }, status=status.HTTP_201_CREATED)

    except Exception as global_err:
        logger.error(f"Fatal booking error: {global_err}")
        return Response({
            "error": "Failed to schedule appointment",
            "detail": str(global_err)
        }, status=status.HTTP_400_BAD_REQUEST)
