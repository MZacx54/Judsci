from rest_framework import viewsets
from .models import ImpactStat, ImpactLocation
from .serializers import ImpactStatSerializer, ImpactLocationSerializer

class ImpactStatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ImpactStat.objects.all()
    serializer_class = ImpactStatSerializer

class ImpactLocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ImpactLocation.objects.all()
    serializer_class = ImpactLocationSerializer
