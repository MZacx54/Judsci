from rest_framework import viewsets
from .models import ImpactStat, ImpactLocation
from .serializers import ImpactStatSerializer, ImpactLocationSerializer

class ImpactStatViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ImpactStatSerializer

    def get_queryset(self):
        try:
            return ImpactStat.objects.all()
        except Exception:
            return ImpactStat.objects.none()

class ImpactLocationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ImpactLocationSerializer

    def get_queryset(self):
        try:
            return ImpactLocation.objects.all()
        except Exception:
            return ImpactLocation.objects.none()
