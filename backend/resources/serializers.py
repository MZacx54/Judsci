from rest_framework import serializers
from .models import Resource

class ResourceSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = '__all__'

    def get_file(self, obj):
        if not obj.file:
            return None
        try:
            return obj.file.url
        except Exception:
            return str(obj.file)
