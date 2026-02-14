import os
import django
import shutil

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

from core.models import Program

# Define programs based on owner's required arrangement and updated descriptions
programs_data = [
    {
        'title': 'Water, Sanitation and Hygiene (WASH)',
        'description': 'Our WASH interventions focus on the provision of potable water through the construction of boreholes and wells, sensitization on sanitation and hygiene, and the construction of VIP latrines. These projects are implemented with the critical support of Misereor to improve community health and dignity.',
        'icon': '🚰',
        'color': 'bg-sky-500',
        'image_src': 'Borehole Commissioning Pictures (49).JPG.jpeg' 
    },
    {
        'title': 'Peace Building & Conflict Resolution',
        'description': 'We facilitate inclusive dialogue sessions, establish interfaith peace structures, and create Peace Clubs in schools. Our goal is to foster social and religious tolerance and build lasting harmony within communities across Bauchi and Gombe States.',
        'icon': '🤝',
        'color': 'bg-blue-500',
        'image_src': 'GSS Bogoro LGA Peace Club members (30).JPG.jpeg'
    },
    {
        'title': 'Sustainable Agriculture',
        'description': 'We promote sustainable agricultural practices to improve food security and economic resilience for local farmers. Our initiatives provide training on modern techniques and support communities in adapting to environmental changes for long-term sustainability.',
        'icon': '🌱',
        'color': 'bg-green-500',
        'image_src': 'IMG-20250906-WA0032.jpg.jpeg' 
    },
    {
        'title': 'Women and Youth Empowerment',
        'description': 'Empowering women and youth through vocational skills training, entrepreneurship development, and advocacy for inclusion. We focus on building the capacity of vulnerable groups to achieve economic independence and active participation in society.',
        'icon': '👩‍👩‍👧‍👦',
        'color': 'bg-purple-500',
        'image_src': 'IMG-20250906-WA0085.jpg.jpeg'
    },
    {
        'title': 'Prison Apostolate',
        'description': 'We advocate for the rights and dignity of inmates by providing legal aid services, welfare support, and spiritual guidance. Our mission is to promote justice and human rights within the correctional facilities across the Bauchi Diocese.',
        'icon': '⚖️',
        'color': 'bg-red-500',
        'image_src': 'IMG_1843.JPG.jpeg' # Corrected image reference for justice/prison
    }
]

# Source directory for images
SOURCE_DIR = 'assets/Images'
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
