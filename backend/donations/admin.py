from django.contrib import admin
from .models import Donation

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('reference', 'donor_name', 'amount', 'project_category', 'status', 'created_at')
    list_filter = ('status', 'project_category', 'created_at')
    search_fields = ('email', 'reference', 'donor_name')
    readonly_fields = ('reference', 'amount', 'email', 'created_at')
    
    fieldsets = (
        ('Donation Info', {
            'fields': ('reference', 'amount', 'status', 'created_at')
        }),
        ('Donor Details', {
            'fields': ('donor_name', 'email')
        }),
        ('Categorization', {
            'fields': ('project_category',)
        }),
    )
