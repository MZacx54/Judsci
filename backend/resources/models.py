from django.db import models

class Resource(models.Model):
    TYPE_CHOICES = [
        ('ANNUAL_REPORT', 'Annual Report'),
        ('NEWSLETTER', 'Newsletter'),
        ('OTHER', 'Other'),
    ]

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    date = models.DateField()
    file = models.FileField(upload_to='resources/')
    cover_image = models.ImageField(upload_to='resources/covers/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
