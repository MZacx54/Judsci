from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, mixins
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [] # proper way to bypass CSRF for public API

    def perform_create(self, serializer):
        appointment = serializer.save()
        
        # 1. Send Confirmation to User
        try:
            send_mail(
                subject=f"Appointment Confirmed: JDPC Bauchi - {appointment.date}",
                message=f"""Dear {appointment.name},

Your appointment request has been received.

Details:
Date: {appointment.date}
Time: {appointment.time}
Location: Catholic Secretariat, Bauchi

We look forward to seeing you.

Regards,
JDPC Bauchi Team
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[appointment.email],
                fail_silently=True,
            )

            # 2. Send Alert to Admin
            send_mail(
                subject=f"New Booking: {appointment.name}",
                message=f"""New appointment request received.

Name: {appointment.name}
Date: {appointment.date}
Time: {appointment.time}
Reason: {appointment.reason}
Phone: {appointment.phone}

Check admin panel for details.
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=['admin@jdpcbauchi.org'], # Replace with real admin email
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email sending failed: {e}")
