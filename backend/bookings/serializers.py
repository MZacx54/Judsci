from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('status', 'created_at')

    def validate(self, data):
        # Prevent double booking
        if Appointment.objects.filter(date=data['date'], time=data['time']).exclude(status='CANCELLED').exists():
            raise serializers.ValidationError("This time slot is already booked. Please choose another time.")
        return data
