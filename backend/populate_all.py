import os
import django
from django.core.files import File
from django.utils import timezone
from datetime import timedelta

# Setup Django environment - Updated 2026-02-08 19:30
import environ
env = environ.Env()
# Setup Django environment - Updated 2026-02-08 19:30
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

# Explicitly configure Cloudinary for the script environment if URL is present
c_url = os.environ.get('CLOUDINARY_URL') or env('CLOUDINARY_URL', default='')
if c_url:
    import cloudinary
    cloudinary.config(cloudinary_url=c_url)


from pathlib import Path
from core.models import Program
from impact.models import ImpactStat, ImpactLocation
from news.models import BlogPost
from resources.models import Resource
from gallery.models import Photo
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
            "description": "Our WASH interventions focus on the provision of potable water through the construction of boreholes and wells, sensitization on sanitation and hygiene, and the construction of VIP latrines. These projects are implemented with the critical support of Misereor to improve community health and dignity.",
            "icon": "💧",
            "color": "bg-blue-500",
        },
        {
            "title": "Peace Building & Conflict Resolution",
            "slug": "peace-building",
            "description": "We facilitate inclusive dialogue sessions, establish interfaith peace structures, and create Peace Clubs in schools. Our goal is to foster social and religious tolerance and build lasting harmony within communities across Bauchi and Gombe States.",
            "icon": "🕊️",
            "color": "bg-green-600",
        },
        {
            "title": "Sustainable Agriculture",
            "slug": "agriculture",
            "description": "We promote sustainable agricultural practices to improve food security and economic resilience for local farmers. Our initiatives provide training on modern techniques and support communities in adapting to environmental changes for long-term sustainability.",
            "icon": "🌱",
            "color": "bg-emerald-600",
        },
        {
            "title": "Women and Youth Empowerment",
            "slug": "empowerment",
            "description": "Empowering women and youth through vocational skills training, entrepreneurship development, and advocacy for inclusion. We focus on building the capacity of vulnerable groups to achieve economic independence and active participation in society.",
            "icon": "👩‍🚀",
            "color": "bg-orange-500",
        },
        {
            "title": "Prison Apostolate",
            "slug": "prison-apostolate",
            "description": "We advocate for the rights and dignity of inmates by providing support services, welfare assistance, and spiritual guidance. Our mission is to promote justice and human rights within the correctional facilities across the Bauchi Diocese.",
            "icon": "⚖️",
            "color": "bg-red-600",
        },
    ]

    for p_data in programs_data:
        Program.objects.create(**p_data)
        print(f"Created/Reset Program: {p_data['title']}")

    # --- News & Blog Posts ---
    BlogPost.objects.all().delete()
    
    news_items = [
        {
            "title": "Restoring Health and Dignity through Potable Water in Rijin Gani",
            "slug": "rijin-gani-water-success",
            "category": "Success Stories",
            "summary": "How a community gained reliable access to safe drinking water and eliminated waterborne diseases through JUDSCI's intervention.",
            "body": """In Rijin Gani community of Bauchi Diocese, women and children long relied on unsafe surface water, leading to frequent waterborne diseases and long hours spent fetching water, especially during the dry season. The lack of reliable access to clean water was a major barrier to the community's development and health.

To address this, JUDSCI Bauchi, with the critical support of Misereor, facilitated community consultations and constructed a motorized borehole along with two VIP latrines. We also trained a Water, Sanitation and Hygiene Committee (WASHCOM) to manage maintenance, tariffs, and accountability, ensuring the project's long-term sustainability.

The result has been transformative. Over 350 households now have reliable access to safe drinking water, and cases of water-related illnesses reported at the primary health center have significantly reduced. Women have saved vital time and energy, which they now invest in farming and other income-generating activities. As one community woman leader shared: “Before, our children were always sick. Now we drink clean water, and we are not afraid anymore.”""",
            "image": "Borehole Commissioning Pictures (49).JPG.jpeg",
            "author": "JUDSCI Media Team"
        },
        {
            "title": "Bridging Divides through Dialogue and Interfaith Cooperation",
            "slug": "peace-building-dialogue",
            "category": "Peace Building",
            "summary": "Strengthening interfaith collaboration and community trust through inclusive dialogue sessions across the Diocese.",
            "body": """Many communities across Bauchi and Gombe States have faced challenges with low trust and weak collaboration, which often hindered collective development efforts. Lingering tensions between different groups sometimes affected the peace and stability needed for progress.

JUDSCI Bauchi intervened by facilitating inclusive dialogue sessions and strengthening interfaith and community structures. We integrated peace and accountability principles into all our field activities, ensuring that every project served as a bridge between groups rather than a point of contention.

Today, there is improved cooperation among religious and community leaders, and joint decision-making on shared resources has become a standard practice. The renewed trust between communities and implementing partners has laid the groundwork for further development. “JUDSCI did not just bring projects; they brought us together and listened to us,” noted a Chief Imam from one of the beneficiary communities.""",
            "image": "GSS Bogoro LGA Peace Club members (24).JPG.jpeg",
            "author": "JUDSCI Peace Desk"
        },
        {
            "title": "Community-Led Sanitation: A Path to Better Health",
            "slug": "sanitation-success",
            "category": "WASH",
            "summary": "Eliminating open defecation and promoting hygiene through community ownership and behavior change.",
            "body": """Open defecation and poor hygiene practices were once common in several rural communities, contributing to frequent disease outbreaks and environmental degradation. These issues affected the overall quality of life and put children at high risk of preventable illnesses.

In response, JUDSCI supported the construction of VIP latrines and conducted extensive hygiene promotion sessions. Our approach focused on behavior change using participatory methods, working closely with community leaders to instill a sense of ownership over hygiene standards.

The impact has been profound as households have widely adopted improved sanitation practices. There is a marked increase in hand-washing and safer waste disposal, leading to cleaner environments and healthier families. A youth leader remarked, “We now understand that sanitation is everyone’s responsibility. Our environment is cleaner, and our children are healthier.”""",
            "image": "Borehole Commissioning Pictures (44).JPG.jpeg",
            "author": "JUDSCI WASH Team"
        },
        {
            "title": "Empowering Women and Youth for Economic Resilience",
            "slug": "women-youth-empowerment-news",
            "category": "Empowerment",
            "summary": "Skills acquisition and economic resilience programs for vulnerable groups across Bauchi and Gombe.",
            "body": """Our approach to empowerment focuses on the most vulnerable and marginalized groups in our society. We provide targeted skills acquisition and economic resilience training to help people achieve self-reliance and dignity.

Through JUDSCI's various interventions, many women have gained financial independence by starting small businesses, and youth have been actively engaged in productive peace clubs and vocational training. This reduction in idleness and increase in opportunity has made communities more resilient and less susceptible to radicalization.""",
            "image": "IMG_1849.JPG.jpeg",
            "author": "JUDSCI Admin"
        }
    ]

    # Assets directories are already defined above

    for item in news_items:
        image_name = item.pop('image')
        post = BlogPost.objects.create(**item)
        
        img_path = images_dir / image_name
        if img_path.exists():
            try:
                with open(img_path, 'rb') as f:
                    post.image.save(image_name, File(f), save=True)
                print(f"Created News: {item['title']} (with image)")
            except Exception as e:
                print(f"FAILED to upload image for News {item['title']}: {e}")
                post.save() # Save without image if upload fails
        else:
            print(f"Created News: {item['title']} (NO image found: {image_name})")


    # --- Map Images to Programs ---
    image_map = {
        'wash': 'Borehole Commissioning Pictures (49).JPG.jpeg',
        'peace-building': 'GSS Bogoro LGA Peace Club members (24).JPG.jpeg',
        'agriculture': 'sustainable_agric.jpg', 
        'empowerment': 'IMG_1849.JPG.jpeg',
        'prison-apostolate': 'IMG_20250909_093607.jpg.jpeg'
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
        try:
            with open(pdf_path, 'rb') as f:
                Resource.objects.create(
                    title="Annual Narrative Report 2023",
                    type="Annual Report",
                    date=timezone.now().date(),
                    file=File(f, name=pdf_name)
                )
            print("Created Annual Report Resource")
        except Exception as e:
            print(f"FAILED to upload PDF Resource: {e}")
    else:
        print(f"PDF not found at {pdf_path}")

    # --- Photo Gallery ---
    Photo.objects.all().delete()
    print("Populating Photo Gallery...")
    gallery_images = [
        {"title": "Borehole Commissioning", "category": "WASH", "filename": "Borehole Commissioning Pictures (49).JPG.jpeg", "caption": "Official commissioning of a new community borehole."},
        {"title": "Community Meeting", "category": "WASH", "filename": "Borehole Commissioning Pictures (44).JPG.jpeg", "caption": "Consultations with community leaders."},
        {"title": "Peace Club Session", "category": "Peace Building", "filename": "GSS Bogoro LGA Peace Club members (24).JPG.jpeg", "caption": "Students participating in peace advocacy."},
        {"title": "Vocational Training", "category": "Empowerment", "filename": "IMG_1849.JPG.jpeg", "caption": "Youth learning new skills for economic independence."},
        {"title": "Prison Visit", "category": "Prison Apostolate", "filename": "IMG_20250909_093607.jpg.jpeg", "caption": "Providing support and guidance at correctional facilities."},
        {"title": "Project Inspection", "category": "WASH", "filename": "Borehole Commissioning Pictures (37).JPG.jpeg", "caption": "Technical inspection of WASH facilities."},
    ]

    for img_data in gallery_images:
        filename = img_data.pop('filename')
        try:
            photo = Photo.objects.create(**img_data)
            img_path = images_dir / filename
            if img_path.exists():
                with open(img_path, 'rb') as f:
                    photo.image.save(filename, File(f), save=True)
                print(f"Added to Gallery: {img_data['title']}")
            else:
                print(f"Gallery Image NOT found: {filename}")
        except Exception as e:
            print(f"Error adding {filename} to Gallery: {e}")

    # --- Impact Stats ---
    ImpactStat.objects.all().delete()
    print("Populating Impact Stats...")
    stats_data = [
        {"label": "Boreholes Constructed", "value": 150, "suffix": "+", "icon": "droplets"},
        {"label": "People Reached", "value": 25000, "suffix": "+", "icon": "users"},
        {"label": "Peace Clubs Established", "value": 45, "suffix": "", "icon": "peace"},
        {"label": "Women Empowered", "value": 1200, "suffix": "+", "icon": "woman"},
    ]
    for s_data in stats_data:
        ImpactStat.objects.create(**s_data)
        print(f"Created Stat: {s_data['label']}")

    # --- Impact Locations ---
    ImpactLocation.objects.all().delete()
    print("Populating Impact Locations...")
    locations_data = [
        {"title": "Bauchi City Hub", "description": "LGA HQ and coordination center for WASH projects.", "latitude": 10.3158, "longitude": 9.8442},
        {"title": "Bogoro Outreach", "description": "Active Peace Building and Agriculture training site.", "latitude": 9.6000, "longitude": 9.5000},
        {"title": "Gombe Field Office", "description": "Regional hub for empowerment programs in Gombe State.", "latitude": 10.2897, "longitude": 11.1673},
    ]
    for l_data in locations_data:
        ImpactLocation.objects.create(**l_data)
        print(f"Created Location: {l_data['title']}")

    print("Population Complete!")

    # --- Create Superuser ---
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Created Superuser: admin / admin123")
    else:
        print("Superuser 'admin' already exists.")

if __name__ == '__main__':
    populate()
