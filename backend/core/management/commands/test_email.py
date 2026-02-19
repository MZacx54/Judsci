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
        
        self.stdout.write(f"Attempting to send email to {recipient}...")
        
        try:
            email = EmailMessage(
                subject=subject,
                body=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient],
                reply_to=[settings.EMAIL_HOST_USER]
            )
            email.send(fail_silently=False)
            self.stdout.write(self.style.SUCCESS(f"Successfully sent test email to {recipient}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to send email: {str(e)}"))
