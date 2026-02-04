from rest_framework import viewsets, mixins
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
