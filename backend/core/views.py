from rest_framework import viewsets
from .models import Program
from .serializers import ProgramSerializer

class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    lookup_field = 'slug'
