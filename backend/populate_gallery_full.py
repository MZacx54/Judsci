import os
import django
from django.core.files import File
from pathlib import Path
import environ

# Setup Django environment
env = environ.Env()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

# Explicitly configure Cloudinary for the script environment if URL is present
c_url = os.environ.get('CLOUDINARY_URL') or env('CLOUDINARY_URL', default='')
if c_url:
    import cloudinary
    cloudinary.config(cloudinary_url=c_url)

from gallery.models import Photo

def populate_gallery_full():
    base_dir = Path(__file__).resolve().parent
    images_dir = base_dir / 'assets' / 'Images'
    
    print(f"Populating Full Gallery from: {images_dir}")
    
    # Clear existing photos to ensure a clean, categorized state
    Photo.objects.all().delete()
    
    gallery_data = [
        # --- WASH ---
        {"title": "Borehole Commissioning", "category": "WASH", "filename": "Borehole Commissioning Pictures (49).JPG.jpeg", "caption": "Official commissioning of a new motorized borehole providing clean water to over 350 households in Rijin Gani."},
        {"title": "Sanitation Training Session", "category": "WASH", "filename": "Borehole Commissioning Pictures (44).JPG.jpeg", "caption": "JUDSCI team conducting hygiene and sanitation sensitization in rural communities."},
        {"title": "Technical Inspection", "category": "WASH", "filename": "Borehole Commissioning Pictures (37).JPG.jpeg", "caption": "Quality assurance and technical inspection of newly constructed WASH infrastructure."},

        # --- PEACE BUILDING ---
        {"title": "Peace Club Launch", "category": "PEACE_BUILDING", "filename": "GSS Bogoro LGA Peace Club members (24).JPG.jpeg", "caption": "Students of GSS Bogoro participating in the launch of the community Peace Club."},
        {"title": "Youth Peace Dialogue", "category": "PEACE_BUILDING", "filename": "GSS Bogoro LGA Peace Club members (30).JPG.jpeg", "caption": "Interfaith youth leaders engaging in dialogue to foster religious tolerance."},
        {"title": "Conflict Resolution Workshop", "category": "PEACE_BUILDING", "filename": "GSS Bogoro LGA Peace Club members (31).JPG.jpeg", "caption": "Training community members on sustainable conflict resolution techniques."},
        {"title": "Inter-community Peace Sports Festival", "category": "PEACE_BUILDING", "filename": "IMG-20250906-WA0004.jpg.jpeg", "caption": "Kick-off ceremony for the North-Gombe State Inter-community Peace Sport Festival 2023."},
        {"title": "Sports for Unity", "category": "PEACE_BUILDING", "filename": "IMG-20250906-WA0023.jpg.jpeg", "caption": "Youth teams competing in unity during the regional Peace Sports event."},
        {"title": "Peace Advocacy through Sports", "category": "PEACE_BUILDING", "filename": "IMG-20250906-WA0032.jpg.jpeg", "caption": "Using sports as a tool for bridge-building between diverse ethnic groups."},
        {"title": "Harmony Dialogue Session", "category": "PEACE_BUILDING", "filename": "IMG-20250906-WA0034.jpg.jpeg", "caption": "Community elders discussing shared resources and harmony."},

        # --- EMPOWERMENT ---
        {"title": "Vocational Skills Center", "category": "EMPOWERMENT", "filename": "IMG-20250906-WA0085.jpg.jpeg", "caption": "Ongoing vocational skills training for vulnerable women and youth."},
        {"title": "Entrepreneurship Workshop", "category": "EMPOWERMENT", "filename": "IMG-20250906-WA0039.jpg.jpeg", "caption": "Empowering women with entrepreneurship and business management skills."},
        {"title": "Youth Skills Acquisition", "category": "EMPOWERMENT", "filename": "IMG-20250906-WA0040.jpg.jpeg", "caption": "Empowering the next generation through practical vocational training."},
        {"title": "Graduation Ceremony", "category": "EMPOWERMENT", "filename": "IMG-20250906-WA0065.jpg.jpeg", "caption": "Celebrating the graduation of empowerment program beneficiaries."},
        {"title": "Tailoring and Design training", "category": "EMPOWERMENT", "filename": "IMG-20250906-WA0069.jpg.jpeg", "caption": "Women learning professional tailoring skills for economic independence."},
        {"title": "Women Empowerment Outreach", "category": "EMPOWERMENT", "filename": "IMG-20250906-WA0072.jpg.jpeg", "caption": "Field outreach program focused on female economic inclusion."},
        {"title": "Financial Literacy Session", "category": "EMPOWERMENT", "filename": "IMG-20250906-WA0078.jpg.jpeg", "caption": "Village Savings and Loan Association (VSLA) training for rural women."},
        {"title": "Group Empowerment Training", "category": "EMPOWERMENT", "filename": "IMG-20250906-WA0080.jpg.jpeg", "caption": "Interactive group training session for local empowerment groups."},
        {"title": "Community Leadership Outreach", "category": "EMPOWERMENT", "filename": "IMG_1843.JPG.jpeg", "caption": "Engaging community leaders on women's rights and economic participation."},
        {"title": "Youth Leadership Summit", "category": "EMPOWERMENT", "filename": "IMG_1849.JPG.jpeg", "caption": "Empowering youth leaders with global advocacy skills."},
        {"title": "Economic Resilience Session", "category": "EMPOWERMENT", "filename": "IMG_1866.JPG.jpeg", "caption": "Building resilience through diversified income generation training."},

        # --- PRISON APOSTOLATE ---
        {"title": "Prison Visitation", "category": "PRISON_APOSTOLATE", "filename": "IMG_20250909_093607.jpg.jpeg", "caption": "Welfare support and counseling visit to a correctional facility in Bauchi."},
        {"title": "Legal Aid Outreach", "category": "PRISON_APOSTOLATE", "filename": "IMG_20250909_093613.jpg.jpeg", "caption": "Providing legal guidance and human rights awareness to inmates."},
        {"title": "Inmate Support Program", "category": "PRISON_APOSTOLATE", "filename": "IMG_20250909_093705.jpg.jpeg", "caption": "Donation of welfare materials and essential supplies to correctional centers."},

        # --- SUSTAINABLE AGRIC ---
        {"title": "Modern Farming Demo", "category": "SUSTAINABLE_AGRIC", "filename": "sustainable_agric.jpg", "caption": "Demonstrating sustainable agricultural techniques to improve food security."},

        # --- GENERAL ---
        {"title": "Stakeholder Engagement", "category": "GENERAL", "filename": "IMG-20200310-WA0004.jpg.jpeg", "caption": "JUDSCI Bauchi coordinating with local stakeholders on regional development."},
    ]
    
    for item in gallery_data:
        filename = item.pop('filename')
        img_path = images_dir / filename
        
        if img_path.exists():
            try:
                photo = Photo.objects.create(**item)
                with open(img_path, 'rb') as f:
                    photo.image.save(filename, File(f), save=True)
                print(f"SUCCESS: Added '{item['title']}' to {item['category']}")
            except Exception as e:
                print(f"FAILED to upload '{filename}': {e}")
        else:
            print(f"MISSING: Image not found at {img_path}")

    print("\n--- Full Gallery Population Complete ---")

if __name__ == '__main__':
    populate_gallery_full()
