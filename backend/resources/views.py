from rest_framework import viewsets
from .models import Resource
from .serializers import ResourceSerializer

class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def get_queryset(self):
        try:
            return Resource.objects.all().order_by('-date')
        except Exception:
            return Resource.objects.none()
