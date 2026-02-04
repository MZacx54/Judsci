import os
import django
from django.core.files import File
from django.utils import timezone
from datetime import timedelta

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

from core.models import Program
from impact.models import ImpactStat
from news.models import BlogPost
from resources.models import Resource

def populate():
    print("Populating Database...")

    # --- Programs ---
    Program.objects.all().delete()
    programs_data = [
        {
            "title": "Water, Sanitation and Hygiene (WASH)",
            "slug": "wash",
            "description": "Providing safe water, VIP latrines, and hygiene training to reduce disease.",
            "icon": "💧",
            "color": "bg-blue-500",
        },
        {
            "title": "Peace Building & Dialogue",
            "slug": "peace-building",
            "description": "Facilitating inter-religious dialogue and establishing Peace Clubs in schools.",
            "icon": "🕊️",
            "color": "bg-green-600",
        },
        {
            "title": "Good Governance",
            "slug": "good-governance",
            "description": "Legislative advocacy and civic participation for transparent leadership.",
            "icon": "⚖️",
            "color": "bg-purple-600",
        },
        {
            "title": "Women & Youth Empowerment",
            "slug": "empowerment",
            "description": "Skills acquisition and economic resilience for vulnerable groups.",
            "icon": "👩‍🚀",
            "color": "bg-orange-500",
        },
        {
            "title": "Sustainable Agriculture",
            "slug": "agriculture",
            "description": "Promoting climate-smart farming and eco-friendly alternatives like briquettes.",
            "icon": "🌱",
            "color": "bg-emerald-600",
        },
        {
            "title": "Prison Ministry",
            "slug": "prison-ministry",
            "description": "Legal aid and psychosocial support for inmates and their families.",
            "icon": "🔓",
            "color": "bg-gray-600",
        },
    ]

    for p_data in programs_data:
        Program.objects.create(**p_data)
        print(f"Created/Reset Program: {p_data['title']}")

    # --- News ---
    BlogPost.objects.all().delete()
    BlogPost.objects.create(
        title="JDPC Launches New Legal Clinic",
        slug="new-legal-clinic",
        summary="Providing free legal representation to awaiting trial inmates.",
        body="Full story content...",
        category="Justice",
        author="Admin",
        # published_date auto-adds
    )
    print("Created News Post")

    # --- Resources ---
    # Check if we have files in assets?
    # For now, just ensuring DB entries exist if user uploads them manually
    # or re-using previous populate_resources logic if valid.

    # --- Map Images to Programs ---
    image_map = {
        'wash': 'Borehole Commissioning Pictures (49).JPG.jpeg',
        'peace-building': 'GSS Bogoro LGA Peace Club members (24).JPG.jpeg',
        'good-governance': 'IMG_1843.JPG.jpeg',
        'empowerment': 'IMG_1849.JPG.jpeg',
        'agriculture': 'sustainable_agric.jpg', 
        'prison-ministry': 'IMG_20250909_093607.jpg.jpeg'
    }

    assets_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets')
    images_dir = os.path.join(assets_dir, 'Images')

    for slug, filename in image_map.items():
        try:
            program = Program.objects.get(slug=slug)
            img_path = os.path.join(images_dir, filename)
            if os.path.exists(img_path):
                with open(img_path, 'rb') as f:
                    program.image.save(filename, File(f), save=True)
                print(f"Added image to {slug}")
        except Exception as e:
            print(f"Error adding image to {slug}: {e}")

    # --- Resources ---
    Resource.objects.all().delete()
    pdf_name = "ANNUAL NARRATIVE REPORT 2023 (1).pdf"
    pdf_path = os.path.join(assets_dir, pdf_name)
    
    if os.path.exists(pdf_path):
        with open(pdf_path, 'rb') as f:
            Resource.objects.create(
                title="Annual Narrative Report 2023",
                type="Annual Report",
                date=timezone.now().date(),
                file=File(f, name=pdf_name)
            )
        print("Created Annual Report Resource")
    else:
        print(f"PDF not found at {pdf_path}")

    print("Population Complete!")

if __name__ == '__main__':
    populate()
