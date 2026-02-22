from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.utils import timezone
from django.db.models import Sum
from bookings.models import Appointment
from donations.models import Donation
from core.models import Program

class AdminDashboardStatsView(APIView):
    """
    Returns aggregated statistics for the Admin Dashboard.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, *args, **kwargs):
        # 1. Pending Bookings
        pending_bookings = Appointment.objects.filter(status='PENDING').count()

        # 2. Monthly Donations
        now = timezone.now()
        monthly_donations = Donation.objects.filter(
            status='SUCCESS',
            created_at__month=now.month,
            created_at__year=now.year
        ).aggregate(total=Sum('amount'))['total'] or 0

        # 3. Active Programs
        active_programs = Program.objects.count()

        return Response({
            "pendingBookings": pending_bookings,
            "monthlyDonations": float(monthly_donations),
            "activePrograms": active_programs
        })
