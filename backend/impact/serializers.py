from rest_framework import serializers
from .models import ImpactStat, ImpactLocation

class ImpactStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactStat
        fields = '__all__'

class ImpactLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactLocation
        fields = '__all__'
