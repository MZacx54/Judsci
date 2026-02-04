import os
import django
import shutil

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

from resources.models import Resource
from django.core.files import File

# Using the uploaded report
PDF_NAME = 'ANNUAL NARRATIVE REPORT 2023 (1).pdf'
SOURCE_PATH = f'../assets/{PDF_NAME}'
MEDIA_ROOT = 'media/resources/'
os.makedirs(MEDIA_ROOT, exist_ok=True)

def run():
    print("Populating Resources...")
    Resource.objects.all().delete()
    
    if os.path.exists(SOURCE_PATH):
        try:
            # We must be careful to open with proper read-binary context
            # Or manually copy to media root and then reference
            dest_path = os.path.join(MEDIA_ROOT, PDF_NAME.replace(' ', '_'))
            shutil.copy2(SOURCE_PATH, dest_path)
            
            # Create object pointing to this file
            Resource.objects.create(
                title='JDPC Annual Narrative Report 2023',
                type='Annual Report',
                date='2023-12-31',
                file=f'resources/{os.path.basename(dest_path)}'
            )
            print("Successfully created Annual Report resource.")
        except Exception as e:
            print(f"Error creating resource: {e}")
    else:
        print(f"Source file not found: {SOURCE_PATH}")

if __name__ == '__main__':
    run()
