"""
WSGI config for jdpc_bauchi_api project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')

application = get_wsgi_application()

try:
    from populate_all import populate
    populate()
except Exception as e:
    print(f"WSGI auto-populate notice: {e}")
