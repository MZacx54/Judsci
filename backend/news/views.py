from rest_framework import viewsets
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        try:
            return BlogPost.objects.all().order_by('-published_date')
        except Exception:
            return BlogPost.objects.none()
