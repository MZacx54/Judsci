import os
import django
from django.core.files import File
from django.utils import timezone
from datetime import timedelta

# Setup Django environment - Updated 2026-02-08 19:30
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

from pathlib import Path
from core.models import Program
from impact.models import ImpactStat
from news.models import BlogPost
from resources.models import Resource
from django.contrib.auth import get_user_model

User = get_user_model()

def populate():
    # Get absolute path to the backend directory
    base_dir = Path(__file__).resolve().parent
    assets_dir = base_dir / 'assets'
    images_dir = assets_dir / 'Images'

    print(f"Starting population from: {base_dir}")
    print(f"Expecting assets at: {assets_dir}")

    print("--- POPULATION SCRIPT V1.1 (FIXED IMPORTS) ---")
    print(f"DEBUG: Program model available: {Program}")
    print("Populating Database with fresh initial content...")

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

    # --- News & Blog Posts ---
    BlogPost.objects.all().delete()
    
    news_items = [
        {
            "title": "Enhancing Climate Resilience through WASH and Eco-Energy",
            "slug": "climate-resilience-project",
            "category": "Projects",
            "summary": "To enhance community resilience and adaptive capacity to climate change through the integration of water, sanitation, hygiene (WASH), and eco-energy solutions.",
            "body": """<strong>Project Goal</strong>
To enhance community resilience and adaptive capacity to climate change through the integration of water, sanitation, hygiene (WASH), briquette production and strengthened psychosocial support systems in Five (5) Local Government Areas of Bauchi Diocese.

<strong>Background</strong>
In many communities across Bauchi and Gombe States, daily life is shaped by hardship, uncertainty, and a lack of basic services. Families struggle with limited access to clean water, decent sanitation, and reliable sources of income. For women and children in particular, the burden is heavy, walking long distances for water, coping with poor hygiene conditions, and living with the constant risk of waterborne diseases.

The situation is made worse by a changing climate. Rains no longer come as expected, dry seasons last longer, and the land does not produce as it once did. Many smallholder farmers, already vulnerable, are losing their main source of food and income.

<strong>Key Components:</strong>
<ul>
<li>Climate change adaptation through sustainable water access</li>
<li>Promotion of eco-energy solutions, including community-based briquette production</li>
<li>Promotion of sanitation and hygiene through community-led approaches</li>
<li>Psychosocial support through trauma-informed care and safe spaces</li>
</ul>""",
            "image": "sustainable_agric.jpg",
            "author": "JDPC Admin"
        },
        {
            "title": "Restoring Health and Dignity in Rijin Gani",
            "slug": "rijin-gani-water-success",
            "category": "Success Stories",
            "summary": "How a community gained reliable access to safe drinking water and eliminated waterborne diseases through JDPC intervention.",
            "body": """<strong>Problem</strong>
In Rijin Gani community of Bauchi State, women and children relied on unsafe surface water, leading to frequent waterborne diseases and long hours spent fetching water, especially during the dry season.

<strong>Intervention</strong>
JDPC Bauchi facilitated community consultations, supported the construction of 2 VIP Latrines and a borehole, and also trained a Water, Sanitation and Hygiene Committee (WASHCOM) to manage maintenance, tariffs, and accountability.

<strong>Result</strong>
<ul>
<li>Over 350 households gained reliable access to safe drinking water</li>
<li>Cases of water-related illnesses reported at the primary health center reduced</li>
<li>Women saved time and energy for farming and income-generating activities</li>
</ul>

<em>“Before, our children were always sick. Now we drink clean water, and we are not afraid anymore.”</em> — Community woman leader""",
            "image": "Borehole Commissioning Pictures (49).JPG.jpeg",
            "author": "JDPC Media Team"
        },
        {
            "title": "Bridging Divides through Dialogue",
            "slug": "peace-building-dialogue",
            "category": "Peace Building",
            "summary": "Strengthening interfaith collaboration and community trust through inclusive dialogue sessions.",
            "body": """<strong>Problem</strong>
Some communities faced low trust, weak collaboration, and lingering tensions that affected collective development efforts.

<strong>Intervention</strong>
JDPC facilitated inclusive dialogue sessions, strengthened interfaith and community structures, and integrated peace and accountability principles into WASH activities.

<strong>Result</strong>
<ul>
<li>Improved cooperation among religious and community leaders</li>
<li>Joint decision-making on shared resources</li>
<li>Renewed trust between communities and implementing partners</li>
</ul>

<em>“JDPC did not just bring projects; they brought us together and listened to us.”</em> — Chief Imam of the community""",
            "image": "GSS Bogoro LGA Peace Club members (24).JPG.jpeg",
            "author": "JDPC Peace Desk"
        },
        {
            "title": "Community-Led Sanitation Success",
            "slug": "sanitation-success",
            "category": "WASH",
            "summary": "Eliminating open defecation and promoting hygiene through community ownership and behavior change.",
            "body": """<strong>Problem</strong>
Open defecation and poor hygiene practices were common, contributing to disease outbreaks and environmental degradation.

<strong>Intervention</strong>
JDPC supported the construction of VIP latrines, conducted hygiene promotion sessions, and worked with community leaders to promote behavior change using participatory methods.

<strong>Result</strong>
<ul>
<li>Households adopted improved sanitation practices</li>
<li>Increased hand-washing and safer waste disposal</li>
<li>Stronger community ownership of hygiene standards</li>
</ul>

<em>“We now understand that sanitation is everyone’s responsibility. Our environment is cleaner, and our children are healthier.”</em> — Youth leader""",
            "image": "Borehole Commissioning Pictures (44).JPG.jpeg",
            "author": "JDPC WASH Team"
        },
        {
            "title": "Empowering Women and Youth",
            "slug": "women-youth-empowerment-news",
            "category": "Empowerment",
            "summary": "Skills acquisition and economic resilience programs for vulnerable groups across Bauchi and Gombe.",
            "body": """<strong>Our Approach</strong>
We focus on the vulnerable and marginalized groups, providing skills acquisition and economic resilience training. Our goal is to empower communities towards self-reliance.

<strong>Impact</strong>
Through our various interventions, women have gained financial independence through small businesses, and youth have been engaged in productive peace clubs and vocational training, reducing idleness and susceptibility to radicalization.""",
            "image": "IMG_1849.JPG.jpeg",
            "author": "JDPC Admin"
        },
         {
            "title": "Promoting Good Governance",
            "slug": "good-governance-advocacy",
            "category": "Governance",
            "summary": "Legislative advocacy and civic participation for transparent leadership and accountability.",
            "body": """<strong>Activities</strong>
Our Legislative advocacy project and Promoting good governance project aim to increase civic participation. We value accountability and transparency based on responsibility entrusted to us.

We work to ensure that government policies align with the needs of the people, fostering a society where justice and equity prevail.""",
            "image": "IMG_1843.JPG.jpeg",
            "author": "JDPC Admin"
        }
    ]

    # Assets directories are already defined above

    for item in news_items:
        image_name = item.pop('image')
        post = BlogPost.objects.create(**item)
        
        img_path = images_dir / image_name
        if img_path.exists():
            with open(img_path, 'rb') as f:
                post.image.save(image_name, File(f), save=True)
            print(f"Created News: {item['title']} (with image)")
        else:
            print(f"Created News: {item['title']} (NO image found: {image_name})")


    # --- Map Images to Programs ---
    image_map = {
        'wash': 'Borehole Commissioning Pictures (49).JPG.jpeg',
        'peace-building': 'GSS Bogoro LGA Peace Club members (24).JPG.jpeg',
        'good-governance': 'IMG_1843.JPG.jpeg',
        'empowerment': 'IMG_1849.JPG.jpeg',
        'agriculture': 'sustainable_agric.jpg', 
        'prison-ministry': 'IMG_20250909_093607.jpg.jpeg'
    }

    for slug, filename in image_map.items():
        try:
            program = Program.objects.get(slug=slug)
            img_path = images_dir / filename
            if img_path.exists():
                with open(img_path, 'rb') as f:
                    program.image.save(filename, File(f), save=True)
                print(f"Added image to Program: {slug}")
        except Exception as e:
            print(f"Error adding image to {slug}: {e}")

    # --- Resources ---
    Resource.objects.all().delete()
    pdf_name = "ANNUAL NARRATIVE REPORT 2023 (1).pdf"
    pdf_path = assets_dir / pdf_name
    
    if pdf_path.exists():
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

    # --- Create Superuser ---
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Created Superuser: admin / admin123")
    else:
        print("Superuser 'admin' already exists.")

if __name__ == '__main__':
    populate()
