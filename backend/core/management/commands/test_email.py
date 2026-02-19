from django.core.management.base import BaseCommand
from django.core.mail import EmailMessage
from django.conf import settings
import sys

class Command(BaseCommand):
    help = 'Sends a test email to verify configuration'

    def add_arguments(self, parser):
        parser.add_argument('recipient', type=str, help='The email address to send the test message to')

    def handle(self, *args, **options):
        recipient = options['recipient']
        host = settings.EMAIL_HOST
        port = settings.EMAIL_PORT
        
        self.stdout.write(f"--- DIAGNOSTICS START ---")
        self.stdout.write(f"Testing connectivity to {host}...")

        # 1. DNS Resolution
        try:
            import socket
            ip_address = socket.gethostbyname(host)
            self.stdout.write(self.style.SUCCESS(f"✔ DNS Resolved: {host} -> {ip_address}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"✘ DNS Resolution Failed: {e}"))
            return

        # 2. Socket Connection Test (Port 465)
        self.stdout.write(f"Testing connection to {host}:465 (SSL)...")
        try:
            sock = socket.create_connection((host, 465), timeout=5)
            sock.close()
            self.stdout.write(self.style.SUCCESS(f"✔ Connection to port 465 SUCCESSFUL"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"✘ Connection to port 465 FAILED: {e}"))

        # 3. Socket Connection Test (Port 587)
        self.stdout.write(f"Testing connection to {host}:587 (STARTTLS)...")
        try:
            sock = socket.create_connection((host, 587), timeout=5)
            sock.close()
            self.stdout.write(self.style.SUCCESS(f"✔ Connection to port 587 SUCCESSFUL"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"✘ Connection to port 587 FAILED: {e}"))

        self.stdout.write(f"--- DIAGNOSTICS END ---")
        
        # 4. Attempt Email Send
        subject = 'Test Email from JUDSCI Bauchi'
        body = f"""
This is a test email from the JUDSCI Bauchi backend.

Configuration:
EMAIL_HOST: {settings.EMAIL_HOST}
EMAIL_PORT: {settings.EMAIL_PORT}
EMAIL_USE_SSL: {settings.EMAIL_USE_SSL}
EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}
EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}
DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}

If you received this, your email configuration is working correctly.
"""
        
        self.stdout.write(f"\nAttempting to send email to {recipient} using configured settings...")
        
        try:
            email = EmailMessage(
                subject=subject,
                body=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient],
                reply_to=[settings.EMAIL_HOST_USER]
            )
            email.send(fail_silently=False)
            self.stdout.write(self.style.SUCCESS(f"✔ Successfully sent test email to {recipient}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"✘ Failed to send email: {str(e)}"))
