from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Program
from .serializers import ProgramSerializer
from django.db import connection
from django.utils import timezone

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        "status": "healthy",
        "service": "JUDSCI Bauchi Digital Platform API",
        "timestamp": timezone.now().isoformat()
    })

class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        try:
            return Program.objects.all()
        except Exception:
            try:
                with connection.cursor() as cursor:
                    cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT '📌';")
                    cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT 'bg-green-500';")
                    cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS full_content TEXT DEFAULT '';")
                    cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS image VARCHAR(255);")
                return Program.objects.all()
            except Exception:
                return Program.objects.none()
