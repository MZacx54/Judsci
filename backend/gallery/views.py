from rest_framework import viewsets, permissions
from .models import Photo
from .serializers import PhotoSerializer

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer

    def get_queryset(self):
        try:
            return Photo.objects.all().order_by('-created_at')
        except Exception:
            return Photo.objects.none()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
