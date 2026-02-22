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
        self.stdout.write(f"Testing connectivity to Resend API...")

        try:
            import resend
            resend.api_key = settings.RESEND_API_KEY
            
            if not resend.api_key or resend.api_key == 'your_resend_api_key_here':
                self.stdout.write(self.style.ERROR(f"[FAIL] RESEND_API_KEY is not configured in .env"))
                return
                
            self.stdout.write(f"API Key configured. Attempting to send email to {recipient}...")
            
            subject = 'Test Email from JUDSCI Bauchi (via Resend API)'
            body = f"""
This is a test email from the JUDSCI Bauchi backend.

Configuration:
RESEND_API_KEY: Configured
DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}

If you received this, your Resend API configuration is working correctly and bypassing SMTP.
"""
            params = {
                "from": settings.DEFAULT_FROM_EMAIL,
                "to": [recipient],
                "subject": subject,
                "html": body.replace('\n', '<br>'),
                "text": body,
            }

            response = resend.Emails.send(params)
            self.stdout.write(self.style.SUCCESS(f"[OK] Successfully sent test email to {recipient}. Resend ID: {response.get('id')}"))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"[FAIL] Failed to send email via Resend: {str(e)}"))
            
        self.stdout.write(f"--- DIAGNOSTICS END ---")
