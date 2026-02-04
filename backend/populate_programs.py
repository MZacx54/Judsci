import os
import django
import shutil

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

from core.models import Program

# Define programs based on the ABOUT US doc
programs_data = [
    {
        'title': 'Water, Sanitation and Hygiene (WASH)',
        'description': 'Provision of potable water, sensitization on sanitation and hygiene, and construction of VIP Latrines.',
        'icon': '🚰',
        'color': 'bg-sky-500',
        'image_src': 'Borehole Commissioning Pictures (49).JPG.jpeg' # Mapping to best image
    },
    {
        'title': 'Peace Building & Conflict Resolution',
        'description': 'Facilitation of inclusive dialogue sessions, interfaith structures, and establishment of Peace Clubs in schools.',
        'icon': '🤝',
        'color': 'bg-blue-500',
        'image_src': 'GSS Bogoro LGA Peace Club members (30).JPG.jpeg'
    },
    {
        'title': 'Sustainable Agriculture',
        'description': 'Promoting sustainable agriculture to support climate change adaptation and sensitization on alternative fertilizers.',
        'icon': '🌱',
        'color': 'bg-green-500',
        # No direct image name matched, using a generic field one based on list
        'image_src': 'IMG-20250906-WA0032.jpg.jpeg' 
    },
    {
        'title': 'Good Governance & Advocacy',
        'description': 'Legislative advocacy aimed at promoting transparency, accountability, and the rule of law.',
        'icon': '⚖️',
        'color': 'bg-red-500',
        'image_src': 'IMG_1843.JPG.jpeg' # Placeholder for governance
    },
    {
        'title': 'Psychosocial Support',
        'description': 'Facilitation of safe spaces for psychosocial support and trauma healing for vulnerable populations.',
        'icon': '❤️',
        'color': 'bg-purple-500',
        'image_src': 'IMG-20250906-WA0085.jpg.jpeg' # Placeholder
    },
    {
        'title': 'Eco-Energy Solutions',
        'description': 'Promotion of eco-energy solutions including community-based briquette production.',
        'icon': '🔥',
        'color': 'bg-orange-500',
        'image_src': 'IMG-20250906-WA0040.jpg.jpeg'
    }
]

# Source directory for images
SOURCE_DIR = '../assets/Images'
MEDIA_ROOT = 'media/programs'

def run():
    print("Populating Programs...")
    Program.objects.all().delete() # Clear old data
    
    for p_data in programs_data:
        image_filename = p_data.pop('image_src')
        src_path = os.path.join(SOURCE_DIR, image_filename)
        dest_filename = f"{p_data['title'].lower().replace(' ', '_').replace(',', '')[:20]}.jpg"
        dest_path = os.path.join(MEDIA_ROOT, dest_filename)
        
        # Copy image if exists
        db_image_path = ''
        if os.path.exists(src_path):
            try:
                shutil.copy2(src_path, dest_path)
                db_image_path = f"programs/{dest_filename}"
                print(f"Copied image for {p_data['title']}")
            except Exception as e:
                print(f"Error copying image {src_path}: {e}")
        else:
            print(f"Warning: Image not found {src_path}")
            
        # Create Program
        Program.objects.create(image=db_image_path, **p_data)
        print(f"Created program: {p_data['title']}")

if __name__ == '__main__':
    run()
