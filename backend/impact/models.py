from django.db import models

class ImpactStat(models.Model):
    label = models.CharField(max_length=100)
    value = models.IntegerField()
    suffix = models.CharField(max_length=10, blank=True)
    icon = models.CharField(max_length=50, blank=True) # Lucide icon name or emoji

    def __str__(self):
        return f"{self.label}: {self.value}{self.suffix}"

class ImpactLocation(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return self.title
