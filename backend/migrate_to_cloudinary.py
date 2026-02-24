
import os
import django
import environ
from django.conf import settings
from django.core.files import File

# Set up Django environment
env = environ.Env()
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(PROJECT_ROOT, '.env')
environ.Env.read_env(env_path)

c_url = env('CLOUDINARY_URL', default='')
print(f"DEBUG: env_path={env_path}")

if c_url:
    # Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
    try:
        parts = c_url.split('://')[1]
        auth_part, cloud_name = parts.split('@')
        api_key, api_secret = auth_part.split(':')
        
        os.environ['CLOUDINARY_CLOUD_NAME'] = cloud_name
        os.environ['CLOUDINARY_API_KEY'] = api_key
        os.environ['CLOUDINARY_API_SECRET'] = api_secret
        
        import cloudinary
        import cloudinary.uploader
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )
        print(f"DEBUG: Cloudinary config applied for {cloud_name}")
    except Exception as e:
        print(f"ERROR parsing CLOUDINARY_URL: {e}")
else:
    print("ERROR: CLOUDINARY_URL is empty!")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

# Check settings.DEFAULT_FILE_STORAGE or STORAGES
from django.conf import settings
print(f"DEBUG: Storage backend={settings.STORAGES['default']['BACKEND']}")

from gallery.models import Photo
from core.models import Program
from resources.models import Resource
from news.models import BlogPost

def migrate_media():
    print("Starting media migration to Cloudinary...")

    # 1. Migrate Gallery Photos
    print("\nMigrating Gallery Photos...")
    for photo in Photo.objects.all():
        if photo.image and not str(photo.image).startswith('http'):
            local_path = os.path.join(settings.MEDIA_ROOT, str(photo.image))
            if os.path.exists(local_path):
                print(f"Uploading {photo.title} ({local_path})...")
                with open(local_path, 'rb') as f:
                    photo.image.save(os.path.basename(local_path), File(f), save=True)
                print(f"Successfully uploaded {photo.title}")
            else:
                print(f"File not found: {local_path}")

    # 2. Migrate Program Images
    print("\nMigrating Program Images...")
    for program in Program.objects.all():
        if program.image and not str(program.image).startswith('http'):
            local_path = os.path.join(settings.MEDIA_ROOT, str(program.image))
            if os.path.exists(local_path):
                print(f"Uploading {program.title} ({local_path})...")
                with open(local_path, 'rb') as f:
                    program.image.save(os.path.basename(local_path), File(f), save=True)
                print(f"Successfully uploaded {program.title}")
            else:
                print(f"File not found: {local_path}")

    # 3. Migrate Resource Files
    print("\nMigrating Resource Files...")
    for resource in Resource.objects.all():
        if resource.file and not str(resource.file).startswith('http'):
            local_path = os.path.join(settings.MEDIA_ROOT, str(resource.file))
            if os.path.exists(local_path):
                print(f"Uploading {resource.title} ({local_path})...")
                with open(local_path, 'rb') as f:
                    resource.file.save(os.path.basename(local_path), File(f), save=True)
                print(f"Successfully uploaded {resource.title}")
            else:
                print(f"File not found: {local_path}")

    # 4. Migrate News Images
    print("\nMigrating News Images...")
    for post in BlogPost.objects.all():
        if post.image and not str(post.image).startswith('http'):
            local_path = os.path.join(settings.MEDIA_ROOT, str(post.image))
            if os.path.exists(local_path):
                print(f"Uploading {post.title} ({local_path})...")
                with open(local_path, 'rb') as f:
                    post.image.save(os.path.basename(local_path), File(f), save=True)
                print(f"Successfully uploaded {post.title}")
            else:
                print(f"File not found: {local_path}")

    print("\nMigration complete!")

if __name__ == "__main__":
    migrate_media()
