from django.db import models

class Photo(models.Model):
    CATEGORY_CHOICES = [
        ('WASH', 'Water, Sanitation and Hygiene (WASH)'),
        ('PEACE_BUILDING', 'Peace Building & Conflict Resolution'),
        ('SUSTAINABLE_AGRIC', 'Sustainable Agriculture'),
        ('EMPOWERMENT', 'Women and Youth Empowerment'),
        ('PRISON_APOSTOLATE', 'Prison Apostolate & Legal Aid'),
        ('GENERAL', 'General Impact'),
    ]

    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='gallery/')
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='GENERAL')
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"
