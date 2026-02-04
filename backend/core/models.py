from django.db import models
from django.utils.text import slugify

class Program(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    icon = models.CharField(max_length=50) # Emoji or icon name
    color = models.CharField(max_length=50, default='bg-green-500')
    description = models.TextField()
    full_content = models.TextField(blank=True)
    image = models.ImageField(upload_to='programs/', blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
