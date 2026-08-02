from rest_framework import serializers
from .models import Photo

class PhotoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = '__all__'

    def get_image(self, obj):
        if not obj.image:
            return None
        try:
            return obj.image.url
        except Exception:
            return str(obj.image)
