import os
import django
from django.core.files import File
from pathlib import Path

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

from gallery.models import Photo

def populate_gallery():
    base_dir = Path(__file__).resolve().parent
    images_dir = base_dir / 'assets' / 'Images'
    
    print(f"Populating Gallery from: {images_dir}")
    
    # Clear existing photos to replace with authentic ones
    Photo.objects.all().delete()
    
    gallery_data = [
        {
            'title': 'Borehole Commissioning in Rijin Gani',
            'category': 'WASH',
            'caption': 'Community members celebrating the new motorized borehole providing clean water access.',
            'image_name': 'Borehole Commissioning Pictures (49).JPG.jpeg'
        },
        {
            'title': 'Sanitation Training Session',
            'category': 'WASH',
            'caption': 'Sensitization on hygiene and sanitation practices in rural communities.',
            'image_name': 'Borehole Commissioning Pictures (44).JPG.jpeg'
        },
        {
            'title': 'Peace Club Meeting at GSS Bogoro',
            'category': 'Outreach',
            'caption': 'Students participating in peace-building and conflict resolution workshop.',
            'image_name': 'GSS Bogoro LGA Peace Club members (24).JPG.jpeg'
        },
        {
            'title': 'Interfaith Dialogue Forum',
            'category': 'Outreach',
            'caption': 'Religious and community leaders coming together to foster religious tolerance.',
            'image_name': 'GSS Bogoro LGA Peace Club members (30).JPG.jpeg'
        },
        {
            'title': 'Vocational Skills Training',
            'category': 'Empowerment',
            'caption': 'Empowering youth through skills acquisition and entrepreneurship development.',
            'image_name': 'IMG-20250906-WA0085.jpg.jpeg'
        },
        {
            'title': 'Prison Visitation and Legal Support',
            'category': 'Legal Aid',
            'caption': 'Field team providing welfare support and legal guidance at a correctional facility.',
            'image_name': 'IMG_20250909_093607.jpg.jpeg'
        }
    ]
    
    for item in gallery_data:
        image_name = item.pop('image_name')
        img_path = images_dir / image_name
        
        if img_path.exists():
            photo = Photo.objects.create(**item)
            with open(img_path, 'rb') as f:
                photo.image.save(image_name, File(f), save=True)
            print(f"Added to Gallery: {item['title']}")
        else:
            print(f"Image not found: {image_name}")

if __name__ == '__main__':
    populate_gallery()
