from django.contrib import admin
from .models import Donation

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('reference', 'email', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('email', 'reference')
    readonly_fields = ('reference', 'amount', 'email', 'created_at')
