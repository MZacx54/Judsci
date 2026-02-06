from django.db import models

class Donation(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    email = models.EmailField()
    donor_name = models.CharField(max_length=100, blank=True)
    reference = models.CharField(max_length=100, unique=True)
    project_category = models.CharField(max_length=100, blank=True, null=True, help_text="Specific project or thematic area being funded")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - ₦{self.amount} ({self.status})"
