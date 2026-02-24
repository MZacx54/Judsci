
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

from gallery.models import Photo
from core.models import Program
from news.models import BlogPost
from resources.models import Resource

def polish_db():
    print("Polishing database...")
    
    # List of models to polish
    models = [Photo, Program, BlogPost, Resource]
    
    for model in models:
        items = model.objects.filter(title__icontains='Legal')
        for item in items:
            old_title = item.title
            new_title = old_title.replace('Legal Aid', 'Consultation').replace('Legal Services', 'Advocacy').replace('Legal', 'Support')
            if old_title != new_title:
                print(f"Updating {model.__name__}: '{old_title}' -> '{new_title}'")
                item.title = new_title
                item.save()

    print("Database polishing complete!")

if __name__ == "__main__":
    polish_db()
