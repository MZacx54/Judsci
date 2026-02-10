from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, permissions
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows appointments to be viewed or edited.
    """
    queryset = Appointment.objects.all().order_by('-created_at')
    serializer_class = AppointmentSerializer
    authentication_classes = [] # Fix: Allow public creation without CSRF token
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        appointment = serializer.save()
        
        # 1. Send Confirmation to User
        try:
            send_mail(
                subject=f"Appointment Received: JDPC Bauchi",
                message=f"""Dear {appointment.name},

Thank you for contacting JDPC Bauchi. Your appointment request has been received and is currently PENDING review.

Details:
Date: {appointment.date}
Time: {appointment.time}
Reason: {appointment.reason}

You will receive another email once your appointment is confirmed or if we need to reschedule.

Regards,
JDPC Bauchi Team
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[appointment.email],
                fail_silently=True,
            )

            # 2. Send Alert to Admin
            send_mail(
                subject=f"New Booking Request: {appointment.name}",
                message=f"""New appointment request received.

Name: {appointment.name}
Date: {appointment.date}
Time: {appointment.time}
Reason: {appointment.reason}
Phone: {appointment.phone}

Please log in to the admin dashboard to Approve or Reject this request.
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.EMAIL_HOST_USER], # Send to the configured 'from' address or a specific admin email
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email sending failed: {e}")

    def perform_update(self, serializer):
        # Check if status is changing
        instance = self.get_object()
        new_status = serializer.validated_data.get('status', instance.status)
        
        appointment = serializer.save()

        if instance.status != new_status:
            # Status changed, send notification
            subject = ""
            message = ""

            if new_status == 'CONFIRMED':
                subject = f"Appointment Confirmed: JDPC Bauchi - {appointment.date}"
                message = f"""Dear {appointment.name},

Good news! Your appointment has been CONFIRMED.

Details:
Date: {appointment.date}
Time: {appointment.time}
Location: JDPC Bauchi Secretariat

We look forward to seeing you.

Regards,
JDPC Bauchi Team
"""
            elif new_status == 'CANCELLED':
                subject = f"Appointment Update: JDPC Bauchi"
                message = f"""Dear {appointment.name},

We regret to inform you that we cannot accommodate your appointment request for {appointment.date} at this time.

Please contact us directly if you would like to reschedule.

Regards,
JDPC Bauchi Team
"""

            if subject and message:
                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[appointment.email],
                        fail_silently=True,
                    )
                except Exception as e:
                    print(f"Status update email failed: {e}")
