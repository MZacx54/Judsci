from rest_framework import viewsets
from .models import Program
from .serializers import ProgramSerializer
from django.db import connection

class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
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
