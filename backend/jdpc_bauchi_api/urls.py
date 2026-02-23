"""
URL configuration for jdpc_bauchi_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from impact.views import ImpactStatViewSet, ImpactLocationViewSet
from core.views import ProgramViewSet
from news.views import BlogPostViewSet
from bookings.views import AppointmentViewSet
from donations.views import DonationViewSet
from resources.views import ResourceViewSet
from gallery.views import PhotoViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'impact-stats', ImpactStatViewSet)
router.register(r'impact-locations', ImpactLocationViewSet)
router.register(r'programs', ProgramViewSet)
router.register(r'posts', BlogPostViewSet)
router.register(r'bookings', AppointmentViewSet)
router.register(r'donations', DonationViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'photos', PhotoViewSet)

from django.conf import settings
from django.urls import re_path
from django.views.static import serve

from core.dashboard_views import AdminDashboardStatsView

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/admin/dashboard-stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]

# Admin Interface Customization
admin.site.site_header = "JDPC Bauchi Admin Platform"
admin.site.site_title = "JDPC Bauchi Portal"
admin.site.index_title = "Welcome to JDPC Bauchi Digital Administration"
