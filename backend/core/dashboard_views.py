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
        donation_sum = Donation.objects.filter(
            status='SUCCESS',
            created_at__month=now.month,
            created_at__year=now.year
        ).aggregate(total=Sum('amount'))['total']
        
        monthly_donations = float(donation_sum) if donation_sum else 0.0

        # 3. Active Programs
        active_programs = Program.objects.count()

        # 4. Recent Activity (Latest 5 Bookings and 5 Donations)
        recent_bookings = Appointment.objects.all().order_by('-created_at')[:5]
        recent_donations = Donation.objects.filter(status='SUCCESS').order_by('-created_at')[:5]

        activity = []
        for b in recent_bookings:
            activity.append({
                "id": f"b-{b.id}",
                "type": "booking",
                "title": f"New Request: {b.name}",
                "timestamp": b.created_at.isoformat(),
                "status": b.status,
                "amount": None
            })
        for d in recent_donations:
            activity.append({
                "id": f"d-{d.id}",
                "type": "donation",
                "title": f"Donation: {d.email}",
                "timestamp": d.created_at.isoformat(),
                "status": "SUCCESS",
                "amount": float(d.amount)
            })
        
        # Sort combined activity by timestamp descending
        activity.sort(key=lambda x: x['timestamp'], reverse=True)

        return Response({
            "pendingBookings": int(pending_bookings),
            "monthlyDonations": monthly_donations,
            "activePrograms": int(active_programs),
            "recentActivity": activity[:5],
            "timestamp": timezone.now().isoformat(),
            "status": "success"
        })
