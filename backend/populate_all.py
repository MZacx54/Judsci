import os
import django
from django.core.files import File
from django.utils import timezone
from datetime import timedelta
from pathlib import Path

# Setup Django environment
import environ
env = environ.Env()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

from core.models import Program
from impact.models import ImpactStat, ImpactLocation
from news.models import BlogPost
from resources.models import Resource
from gallery.models import Photo
from bookings.models import Appointment
from donations.models import Donation
from django.contrib.auth import get_user_model

User = get_user_model()

def populate():
    base_dir = Path(__file__).resolve().parent
    assets_dir = base_dir / 'assets'
    images_dir = assets_dir / 'Images'

    print("--- POPULATION SCRIPT V2.0 (SAFE UPDATE OR CREATE) ---")

    # Ensure PostgreSQL tables and columns exist on Supabase
    from django.db import connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS core_program (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(200) NOT NULL DEFAULT '',
                    slug VARCHAR(200) NOT NULL DEFAULT '',
                    icon VARCHAR(50) NOT NULL DEFAULT '📌',
                    color VARCHAR(50) NOT NULL DEFAULT 'bg-green-500',
                    description TEXT NOT NULL DEFAULT '',
                    full_content TEXT NOT NULL DEFAULT '',
                    image VARCHAR(255)
                );
            """)
            cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS title VARCHAR(200) DEFAULT '';")
            cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS slug VARCHAR(200) DEFAULT '';")
            cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT '📌';")
            cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT 'bg-green-500';")
            cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';")
            cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS full_content TEXT DEFAULT '';")
            cursor.execute("ALTER TABLE core_program ADD COLUMN IF NOT EXISTS image VARCHAR(255);")
            # Universal PostgreSQL PL/pgSQL auto-drop NOT NULL for all legacy columns with typed defaults
            try:
                cursor.execute("""
                    DO $$
                    DECLARE
                        r RECORD;
                    BEGIN
                        FOR r IN (
                            SELECT table_name, column_name, data_type 
                            FROM information_schema.columns 
                            WHERE table_schema = 'public' 
                              AND table_name IN ('bookings_appointment', 'core_program', 'resources_resource', 'impact_impactstat', 'impact_impactlocation', 'donations_donation', 'news_blogpost', 'gallery_photo')
                              AND column_name != 'id'
                              AND is_nullable = 'NO'
                        ) LOOP
                            BEGIN
                                EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL;';
                            EXCEPTION WHEN OTHERS THEN
                                NULL;
                            END;

                            BEGIN
                                IF r.column_name LIKE '%_id' THEN
                                    EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP DEFAULT;';
                                    EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' SET DEFAULT NULL;';
                                ELSIF r.data_type IN ('integer', 'bigint', 'smallint', 'numeric', 'double precision') THEN
                                    EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' SET DEFAULT 0;';
                                ELSIF r.data_type = 'boolean' THEN
                                    EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' SET DEFAULT TRUE;';
                                ELSIF r.data_type IN ('date') THEN
                                    EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' SET DEFAULT CURRENT_DATE;';
                                ELSIF r.data_type LIKE '%time%' THEN
                                    EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' SET DEFAULT CURRENT_TIMESTAMP;';
                                ELSE
                                    EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' SET DEFAULT '''';';
                                END IF;
                            EXCEPTION WHEN OTHERS THEN
                                NULL;
                            END;
                        END LOOP;
                    END $$;
                """)
            except Exception as plsql_err:
                pass

            # Explicit Supabase PostgreSQL legacy schema auto-repair (handling reserved keywords)
            legacy_schema_fixes = [
                # bookings_appointment
                "ALTER TABLE bookings_appointment ADD COLUMN IF NOT EXISTS name VARCHAR(200) DEFAULT '';",
                "ALTER TABLE bookings_appointment ALTER COLUMN full_name DROP NOT NULL;",
                "ALTER TABLE bookings_appointment ALTER COLUMN full_name SET DEFAULT '';",
                "ALTER TABLE bookings_appointment ALTER COLUMN service_type DROP NOT NULL;",
                "ALTER TABLE bookings_appointment ALTER COLUMN service_type SET DEFAULT '';",
                "ALTER TABLE bookings_appointment ALTER COLUMN preferred_date DROP NOT NULL;",
                "ALTER TABLE bookings_appointment ALTER COLUMN preferred_date SET DEFAULT CURRENT_DATE;",
                "ALTER TABLE bookings_appointment ALTER COLUMN preferred_time DROP NOT NULL;",
                "ALTER TABLE bookings_appointment ALTER COLUMN preferred_time SET DEFAULT '10:00:00';",
                "ALTER TABLE bookings_appointment ALTER COLUMN notes DROP NOT NULL;",
                "ALTER TABLE bookings_appointment ALTER COLUMN notes SET DEFAULT '';",
                "ALTER TABLE bookings_appointment ALTER COLUMN name DROP NOT NULL;",
                "ALTER TABLE bookings_appointment ALTER COLUMN name SET DEFAULT '';",

                # core_program
                "ALTER TABLE core_program ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';",
                "ALTER TABLE core_program ADD COLUMN IF NOT EXISTS full_content TEXT DEFAULT '';",
                "ALTER TABLE core_program ALTER COLUMN \"order\" DROP NOT NULL;",
                "ALTER TABLE core_program ALTER COLUMN \"order\" SET DEFAULT 0;",
                "ALTER TABLE core_program ALTER COLUMN content DROP NOT NULL;",
                "ALTER TABLE core_program ALTER COLUMN content SET DEFAULT '';",
                "ALTER TABLE core_program ALTER COLUMN icon_class DROP NOT NULL;",
                "ALTER TABLE core_program ALTER COLUMN icon_class SET DEFAULT '';",
                "ALTER TABLE core_program ALTER COLUMN summary DROP NOT NULL;",
                "ALTER TABLE core_program ALTER COLUMN summary SET DEFAULT '';",
                "ALTER TABLE core_program ALTER COLUMN full_content DROP NOT NULL;",
                "ALTER TABLE core_program ALTER COLUMN full_content SET DEFAULT '';",

                # resources_resource & category constraint removal
                "CREATE TABLE IF NOT EXISTS resources_resourcecategory (id SERIAL PRIMARY KEY, name VARCHAR(100) DEFAULT '');",
                "INSERT INTO resources_resourcecategory (id, name) VALUES (0, 'General') ON CONFLICT (id) DO NOTHING;",
                "ALTER TABLE resources_resource DROP CONSTRAINT IF EXISTS resources_resource_category_id_0cd2d52c_fk_resources CASCADE;",
                "ALTER TABLE resources_resource DROP CONSTRAINT IF EXISTS resources_resource_category_id_fk CASCADE;",
                "ALTER TABLE resources_resource ALTER COLUMN category_id DROP NOT NULL;",
                "ALTER TABLE resources_resource ALTER COLUMN category_id DROP DEFAULT;",
                "ALTER TABLE resources_resource ALTER COLUMN category_id SET DEFAULT NULL;",
                "ALTER TABLE resources_resource ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';",
                "ALTER TABLE resources_resource ALTER COLUMN is_active DROP NOT NULL;",
                "ALTER TABLE resources_resource ALTER COLUMN is_active SET DEFAULT TRUE;",
                "ALTER TABLE resources_resource ALTER COLUMN description DROP NOT NULL;",
                "ALTER TABLE resources_resource ALTER COLUMN description SET DEFAULT '';",
                "ALTER TABLE resources_resource ALTER COLUMN external_link DROP NOT NULL;",
                "ALTER TABLE resources_resource ALTER COLUMN external_link SET DEFAULT '';",

                # impact_impactstat
                "ALTER TABLE impact_impactstat ADD COLUMN IF NOT EXISTS label VARCHAR(100) DEFAULT '';",
                "ALTER TABLE impact_impactstat ALTER COLUMN \"order\" DROP NOT NULL;",
                "ALTER TABLE impact_impactstat ALTER COLUMN \"order\" SET DEFAULT 0;",
                "ALTER TABLE impact_impactstat ALTER COLUMN title DROP NOT NULL;",
                "ALTER TABLE impact_impactstat ALTER COLUMN title SET DEFAULT '';",
                "ALTER TABLE impact_impactstat ALTER COLUMN count DROP NOT NULL;",
                "ALTER TABLE impact_impactstat ALTER COLUMN count SET DEFAULT 0;",

                # impact_impactlocation
                "ALTER TABLE impact_impactlocation ADD COLUMN IF NOT EXISTS title VARCHAR(100) DEFAULT '';",
                "ALTER TABLE impact_impactlocation ALTER COLUMN name DROP NOT NULL;",
                "ALTER TABLE impact_impactlocation ALTER COLUMN name SET DEFAULT '';",
                "ALTER TABLE impact_impactlocation ALTER COLUMN intervention_type DROP NOT NULL;",
                "ALTER TABLE impact_impactlocation ALTER COLUMN intervention_type SET DEFAULT '';",

                # donations_donation
                "ALTER TABLE donations_donation ADD COLUMN IF NOT EXISTS project_category VARCHAR(100) DEFAULT '';",
                "ALTER TABLE donations_donation ALTER COLUMN gateway DROP NOT NULL;",
                "ALTER TABLE donations_donation ALTER COLUMN gateway SET DEFAULT '';",
                "ALTER TABLE donations_donation ALTER COLUMN metadata DROP NOT NULL;",
                "ALTER TABLE donations_donation ALTER COLUMN metadata SET DEFAULT '';",

                # news_blogpost
                "ALTER TABLE news_blogpost ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';",
                "ALTER TABLE news_blogpost ALTER COLUMN content DROP NOT NULL;",
                "ALTER TABLE news_blogpost ALTER COLUMN content SET DEFAULT '';",

                # auth_user
                "ALTER TABLE auth_user ADD COLUMN IF NOT EXISTS first_name VARCHAR(150) DEFAULT '';",
                "ALTER TABLE auth_user ADD COLUMN IF NOT EXISTS last_name VARCHAR(150) DEFAULT '';",
                "ALTER TABLE auth_user ADD COLUMN IF NOT EXISTS email VARCHAR(254) DEFAULT '';",
                "ALTER TABLE auth_user ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT TRUE;",
                "ALTER TABLE auth_user ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;",
                "ALTER TABLE auth_user ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT TRUE;",
                "ALTER TABLE auth_user ADD COLUMN IF NOT EXISTS date_joined TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;",
                "UPDATE auth_user SET first_name = COALESCE(first_name, ''), last_name = COALESCE(last_name, ''), email = COALESCE(email, ''), is_staff = COALESCE(is_staff, TRUE), is_active = COALESCE(is_active, TRUE), is_superuser = COALESCE(is_superuser, TRUE), date_joined = COALESCE(date_joined, CURRENT_TIMESTAMP);"
            ]
            for stmt in legacy_schema_fixes:
                try:
                    cursor.execute(stmt)
                except Exception:
                    pass

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS impact_impactstat (
                    id SERIAL PRIMARY KEY,
                    label VARCHAR(100) NOT NULL DEFAULT '',
                    value INTEGER NOT NULL DEFAULT 0,
                    suffix VARCHAR(10) NOT NULL DEFAULT '',
                    icon VARCHAR(50) NOT NULL DEFAULT ''
                );
            """)
            cursor.execute("ALTER TABLE impact_impactstat ADD COLUMN IF NOT EXISTS label VARCHAR(100) DEFAULT '';")
            cursor.execute("ALTER TABLE impact_impactstat ADD COLUMN IF NOT EXISTS value INTEGER DEFAULT 0;")
            cursor.execute("ALTER TABLE impact_impactstat ADD COLUMN IF NOT EXISTS suffix VARCHAR(10) DEFAULT '';")
            cursor.execute("ALTER TABLE impact_impactstat ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT '';")

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS impact_impactlocation (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(100) NOT NULL DEFAULT '',
                    description TEXT NOT NULL DEFAULT '',
                    latitude NUMERIC(9,6) NOT NULL DEFAULT 0.0,
                    longitude NUMERIC(9,6) NOT NULL DEFAULT 0.0
                );
            """)
            cursor.execute("ALTER TABLE impact_impactlocation ADD COLUMN IF NOT EXISTS title VARCHAR(100) DEFAULT '';")
            cursor.execute("ALTER TABLE impact_impactlocation ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';")
            cursor.execute("ALTER TABLE impact_impactlocation ADD COLUMN IF NOT EXISTS latitude NUMERIC(9, 6) DEFAULT 0.0;")
            cursor.execute("ALTER TABLE impact_impactlocation ADD COLUMN IF NOT EXISTS longitude NUMERIC(9, 6) DEFAULT 0.0;")

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS news_blogpost (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(200) NOT NULL DEFAULT '',
                    slug VARCHAR(200) NOT NULL DEFAULT '',
                    category VARCHAR(50) NOT NULL DEFAULT '',
                    summary TEXT NOT NULL DEFAULT '',
                    body TEXT NOT NULL DEFAULT '',
                    image VARCHAR(255),
                    author VARCHAR(100) NOT NULL DEFAULT 'JUDSCI Admin',
                    published_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cursor.execute("ALTER TABLE news_blogpost ADD COLUMN IF NOT EXISTS title VARCHAR(200) DEFAULT '';")
            cursor.execute("ALTER TABLE news_blogpost ADD COLUMN IF NOT EXISTS slug VARCHAR(200) DEFAULT '';")
            cursor.execute("ALTER TABLE news_blogpost ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT '';")
            cursor.execute("ALTER TABLE news_blogpost ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';")
            cursor.execute("ALTER TABLE news_blogpost ADD COLUMN IF NOT EXISTS body TEXT DEFAULT '';")
            cursor.execute("ALTER TABLE news_blogpost ADD COLUMN IF NOT EXISTS image VARCHAR(255);")
            cursor.execute("ALTER TABLE news_blogpost ADD COLUMN IF NOT EXISTS author VARCHAR(100) DEFAULT '';")
            cursor.execute("ALTER TABLE news_blogpost ADD COLUMN IF NOT EXISTS published_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;")

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS resources_resource (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(200) NOT NULL DEFAULT '',
                    type VARCHAR(50) NOT NULL DEFAULT 'ANNUAL_REPORT',
                    date DATE DEFAULT CURRENT_DATE,
                    file VARCHAR(255),
                    cover_image VARCHAR(255),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cursor.execute("ALTER TABLE resources_resource ADD COLUMN IF NOT EXISTS title VARCHAR(200) DEFAULT '';")
            cursor.execute("ALTER TABLE resources_resource ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'ANNUAL_REPORT';")
            cursor.execute("ALTER TABLE resources_resource ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;")
            cursor.execute("ALTER TABLE resources_resource ADD COLUMN IF NOT EXISTS file VARCHAR(255);")
            cursor.execute("ALTER TABLE resources_resource ADD COLUMN IF NOT EXISTS cover_image VARCHAR(255);")
            cursor.execute("ALTER TABLE resources_resource ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;")

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS gallery_photo (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(200) NOT NULL DEFAULT '',
                    category VARCHAR(50) NOT NULL DEFAULT '',
                    caption TEXT NOT NULL DEFAULT '',
                    image VARCHAR(255),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cursor.execute("ALTER TABLE gallery_photo ADD COLUMN IF NOT EXISTS title VARCHAR(200) DEFAULT '';")
            cursor.execute("ALTER TABLE gallery_photo ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT '';")
            cursor.execute("ALTER TABLE gallery_photo ADD COLUMN IF NOT EXISTS caption TEXT DEFAULT '';")
            cursor.execute("ALTER TABLE gallery_photo ADD COLUMN IF NOT EXISTS image VARCHAR(255);")
            cursor.execute("ALTER TABLE gallery_photo ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;")

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS bookings_appointment (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(200) NOT NULL DEFAULT '',
                    email VARCHAR(254) NOT NULL DEFAULT '',
                    phone VARCHAR(20) NOT NULL DEFAULT '',
                    date DATE DEFAULT CURRENT_DATE,
                    time TIME DEFAULT '10:00:00',
                    reason TEXT NOT NULL DEFAULT '',
                    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cursor.execute("ALTER TABLE bookings_appointment ADD COLUMN IF NOT EXISTS name VARCHAR(200) DEFAULT '';")
            cursor.execute("ALTER TABLE bookings_appointment ADD COLUMN IF NOT EXISTS email VARCHAR(254) DEFAULT '';")
            cursor.execute("ALTER TABLE bookings_appointment ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT '';")
            cursor.execute("ALTER TABLE bookings_appointment ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;")
            cursor.execute("ALTER TABLE bookings_appointment ADD COLUMN IF NOT EXISTS time TIME DEFAULT '10:00:00';")
            cursor.execute("ALTER TABLE bookings_appointment ADD COLUMN IF NOT EXISTS reason TEXT DEFAULT '';")
            cursor.execute("ALTER TABLE bookings_appointment ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PENDING';")
            cursor.execute("ALTER TABLE bookings_appointment ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;")

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS donations_donation (
                    id SERIAL PRIMARY KEY,
                    donor_name VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
                    email VARCHAR(254) NOT NULL DEFAULT '',
                    amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
                    reference VARCHAR(100) NOT NULL DEFAULT '',
                    project_category VARCHAR(100) DEFAULT '',
                    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cursor.execute("ALTER TABLE donations_donation ADD COLUMN IF NOT EXISTS donor_name VARCHAR(100) DEFAULT 'Anonymous';")
            cursor.execute("ALTER TABLE donations_donation ADD COLUMN IF NOT EXISTS email VARCHAR(254) DEFAULT '';")
            cursor.execute("ALTER TABLE donations_donation ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2) DEFAULT 0.00;")
            cursor.execute("ALTER TABLE donations_donation ADD COLUMN IF NOT EXISTS reference VARCHAR(100) DEFAULT '';")
            cursor.execute("ALTER TABLE donations_donation ADD COLUMN IF NOT EXISTS project_category VARCHAR(100) DEFAULT '';")
            cursor.execute("ALTER TABLE donations_donation ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PENDING';")
            cursor.execute("ALTER TABLE donations_donation ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;")
    except Exception as e:
        print(f"Schema sync notice: {e}")

    # --- Step 1: Create Superuser Accounts FIRST ---
    for uname in ['admin', 'judsci_admin', 'superadmin']:
        try:
            u, _ = User.objects.get_or_create(username=uname)
            u.email = f"{uname}@judsci.org.ng"
            u.set_password('Admin@12345')
            u.is_staff = True
            u.is_superuser = True
            u.is_active = True
            u.save()
            print(f"GUARANTEED SUPERUSER CREATED/RESET: username={uname} password=Admin@12345 (is_staff=True, is_active=True)")
        except Exception as e:
            print(f"Superuser creation notice for {uname}: {e}")

    # --- Programs (Using update_or_create) ---
    programs_data = [
        {
            "title": "Water, Sanitation and Hygiene (WASH)",
            "slug": "wash",
            "description": "Our WASH interventions focus on the provision of potable water through the construction of boreholes and wells, sensitization on sanitation and hygiene, and the construction of VIP latrines. These projects are implemented with the critical support of Misereor to improve community health and dignity.",
            "full_content": "Our WASH interventions focus on the provision of potable water through the construction of boreholes and wells, sensitization on sanitation and hygiene, and the construction of VIP latrines. These projects are implemented with the critical support of Misereor to improve community health and dignity.",
            "icon": "💧",
            "color": "bg-blue-500",
        },
        {
            "title": "Peace Building & Conflict Resolution",
            "slug": "peace-building",
            "description": "We facilitate inclusive dialogue sessions, establish interfaith peace structures, and create Peace Clubs in schools. Our goal is to foster social and religious tolerance and build lasting harmony within communities across Bauchi and Gombe States.",
            "full_content": "We facilitate inclusive dialogue sessions, establish interfaith peace structures, and create Peace Clubs in schools. Our goal is to foster social and religious tolerance and build lasting harmony within communities across Bauchi and Gombe States.",
            "icon": "🕊️",
            "color": "bg-green-600",
        },
        {
            "title": "Sustainable Agriculture",
            "slug": "agriculture",
            "description": "We promote sustainable agricultural practices to improve food security and economic resilience for local farmers. Our initiatives provide training on modern techniques and support communities in adapting to environmental changes for long-term sustainability.",
            "full_content": "We promote sustainable agricultural practices to improve food security and economic resilience for local farmers. Our initiatives provide training on modern techniques and support communities in adapting to environmental changes for long-term sustainability.",
            "icon": "🌱",
            "color": "bg-emerald-600",
        },
        {
            "title": "Women and Youth Empowerment",
            "slug": "empowerment",
            "description": "Empowering women and youth through vocational skills training, entrepreneurship development, and advocacy for inclusion. We focus on building the capacity of vulnerable groups to achieve economic independence and active participation in society.",
            "full_content": "Empowering women and youth through vocational skills training, entrepreneurship development, and advocacy for inclusion. We focus on building the capacity of vulnerable groups to achieve economic independence and active participation in society.",
            "icon": "👩‍🚀",
            "color": "bg-orange-500",
        },
        {
            "title": "Prison Apostolate",
            "slug": "prison-apostolate",
            "description": "We advocate for the rights and dignity of inmates by providing support services, welfare assistance, and spiritual guidance. Our mission is to promote justice and human rights within the correctional facilities across the Bauchi Diocese.",
            "full_content": "We advocate for the rights and dignity of inmates by providing support services, welfare assistance, and spiritual guidance. Our mission is to promote justice and human rights within the correctional facilities across the Bauchi Diocese.",
            "icon": "⚖️",
            "color": "bg-red-600",
        },
    ]

    for p_data in programs_data:
        try:
            slug = p_data.pop('slug')
            prog, _ = Program.objects.update_or_create(slug=slug, defaults=p_data)
            print(f"Created/Updated Program: {prog.title}")
        except Exception as e:
            print(f"Notice updating Program {p_data.get('title')}: {e}")

    # --- News & Blog Posts (Using update_or_create) ---
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

    for item in news_items:
        image_name = item.pop('image')
        slug = item.pop('slug')
        try:
            post, created = BlogPost.objects.update_or_create(slug=slug, defaults=item)
            img_path = images_dir / image_name
            if img_path.exists() and not post.image:
                try:
                    with open(img_path, 'rb') as f:
                        post.image.save(image_name, File(f), save=True)
                except Exception as e:
                    print(f"Notice saving image for News {slug}: {e}")
            print(f"Created/Updated News: {post.title}")
        except Exception as e:
            print(f"Notice creating News {slug}: {e}")

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
            program = Program.objects.filter(slug=slug).first()
            if program and not program.image:
                img_path = images_dir / filename
                if img_path.exists():
                    with open(img_path, 'rb') as f:
                        program.image.save(filename, File(f), save=True)
                    print(f"Added image to Program: {slug}")
        except Exception as e:
            print(f"Error adding image to {slug}: {e}")

    # --- Resources (Using update_or_create) ---
    print("Populating Resources...")
    resources_data = [
        {
            "title": "Annual Narrative Report 2023",
            "type": "ANNUAL_REPORT",
            "date": "2023-12-31",
            "description": "Comprehensive overview of JUDSCI Bauchi interventions, achievements, and financial reports for the 2023 project year.",
            "pdf_name": "ANNUAL_NARRATIVE_REPORT_2023.pdf"
        },
        {
            "title": "WASH Community Implementation & Sanitation Guide",
            "type": "NEWSLETTER",
            "date": "2024-03-15",
            "description": "Best practices for establishing WASHCOM committees and managing rural water infrastructure.",
            "pdf_name": "ANNUAL_NARRATIVE_REPORT_2023.pdf"
        },
        {
            "title": "Peace Building & Inter-faith Dialogue Toolkit",
            "type": "OTHER",
            "date": "2024-06-20",
            "description": "Practical handbook for facilitating community peace clubs and conflict resolution in northern Nigeria.",
            "pdf_name": "ANNUAL_NARRATIVE_REPORT_2023.pdf"
        }
    ]

    for item in resources_data:
        pdf_name = item.pop("pdf_name")
        title = item["title"]
        try:
            res, created = Resource.objects.update_or_create(
                title=title,
                defaults=item
            )
            pdf_path = assets_dir / "ANNUAL NARRATIVE REPORT 2023 (1).pdf"
            if not pdf_path.exists():
                pdf_path = settings.BASE_DIR / "media" / "resources" / pdf_name
            if pdf_path.exists() and not res.file:
                with open(pdf_path, 'rb') as f:
                    res.file.save(pdf_name, File(f), save=True)
            print(f"Verified Resource: {title}")
        except Exception as e:
            print(f"Notice creating Resource {title}: {e}")

    # --- Photo Gallery (Using get_or_create) ---
    print("Populating Photo Gallery...")
    gallery_images = [
        {"title": "Borehole Commissioning", "category": "WASH", "filename": "Borehole Commissioning Pictures (49).JPG.jpeg", "caption": "Official commissioning of a new motorized borehole providing clean water to over 350 households in Rijin Gani."},
        {"title": "Sanitation Training Session", "category": "WASH", "filename": "Borehole Commissioning Pictures (44).JPG.jpeg", "caption": "JUDSCI team conducting hygiene and sanitation sensitization in rural communities."},
        {"title": "Technical Inspection", "category": "WASH", "filename": "Borehole Commissioning Pictures (37).JPG.jpeg", "caption": "Quality assurance and technical inspection of newly constructed WASH infrastructure."},
        {"title": "Peace Club Launch", "category": "PEACE_BUILDING", "filename": "GSS Bogoro LGA Peace Club members (24).JPG.jpeg", "caption": "Students of GSS Bogoro participating in the launch of the community Peace Club."},
        {"title": "Youth Peace Dialogue", "category": "PEACE_BUILDING", "filename": "GSS Bogoro LGA Peace Club members (30).JPG.jpeg", "caption": "Interfaith youth leaders engaging in dialogue to foster religious tolerance."},
        {"title": "Conflict Resolution Workshop", "category": "PEACE_BUILDING", "filename": "GSS Bogoro LGA Peace Club members (31).JPG.jpeg", "caption": "Training community members on sustainable conflict resolution techniques."},
        {"title": "Inter-community Peace Sports Festival", "category": "PEACE_BUILDING", "filename": "IMG-20250906-WA0004.jpg.jpeg", "caption": "Kick-off ceremony for the North-Gombe State Inter-community Peace Sport Festival 2023."},
        {"title": "Sports for Unity", "category": "PEACE_BUILDING", "filename": "IMG-20250906-WA0023.jpg.jpeg", "caption": "Youth teams competing in unity during the regional Peace Sports event."},
        {"title": "Peace Advocacy through Sports", "category": "PEACE_BUILDING", "filename": "IMG-20250906-WA0032.jpg.jpeg", "caption": "Using sports as a tool for bridge-building between diverse ethnic groups."},
        {"title": "Harmony Dialogue Session", "category": "PEACE_BUILDING", "filename": "IMG-20250906-WA0034.jpg.jpeg", "caption": "Community elders discussing shared resources and harmony."},
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
        {"title": "Prison Visitation", "category": "PRISON_APOSTOLATE", "filename": "IMG_20250909_093607.jpg.jpeg", "caption": "Welfare support and counseling visit to a correctional facility in Bauchi."},
        {"title": "Legal Aid Outreach", "category": "PRISON_APOSTOLATE", "filename": "IMG_20250909_093613.jpg.jpeg", "caption": "Providing legal guidance and human rights awareness to inmates."},
        {"title": "Inmate Support Program", "category": "PRISON_APOSTOLATE", "filename": "IMG_20250909_093705.jpg.jpeg", "caption": "Donation of welfare materials and essential supplies to correctional centers."},
        {"title": "Modern Farming Demo", "category": "SUSTAINABLE_AGRIC", "filename": "sustainable_agric.jpg", "caption": "Demonstrating sustainable agricultural techniques to improve food security."},
        {"title": "Stakeholder Engagement", "category": "GENERAL", "filename": "IMG-20200310-WA0004.jpg.jpeg", "caption": "JUDSCI Bauchi coordinating with local stakeholders on regional development."},
    ]

    for img_data in gallery_images:
        filename = img_data.pop('filename')
        title = img_data['title']
        try:
            photo, created = Photo.objects.get_or_create(title=title, defaults=img_data)
            img_path = images_dir / filename
            if img_path.exists() and not photo.image:
                with open(img_path, 'rb') as f:
                    photo.image.save(filename, File(f), save=True)
            print(f"Verified Gallery: {title}")
        except Exception as e:
            print(f"Error adding {title} to Gallery: {e}")

    # --- Impact Stats (Using update_or_create) ---
    print("Populating Impact Stats...")
    stats_data = [
        {"label": "Households Reached", "value": 35000, "suffix": "+", "icon": "users"},
        {"label": "Communities Served", "value": 60, "suffix": "", "icon": "home"},
        {"label": "LGAs Covered", "value": 8, "suffix": "", "icon": "map-pin"},
        {"label": "Completed Projects", "value": 10, "suffix": "", "icon": "check-circle"},
    ]
    for s_data in stats_data:
        label = s_data.pop('label')
        try:
            ImpactStat.objects.update_or_create(label=label, defaults=s_data)
            print(f"Created/Updated Stat: {label}")
        except Exception as e:
            print(f"Notice stat {label}: {e}")

    # --- Impact Locations (Using update_or_create) ---
    try:
        locations_data = [
            {"title": "Bauchi City Hub", "description": "LGA HQ and coordination center for WASH projects.", "latitude": 10.3158, "longitude": 9.8442},
            {"title": "Bogoro Outreach", "description": "Active Peace Building and Agriculture training site.", "latitude": 9.6000, "longitude": 9.5000},
            {"title": "Gombe Field Office", "description": "Regional hub for empowerment programs in Gombe State.", "latitude": 10.2897, "longitude": 11.1673},
        ]
        for l_data in locations_data:
            title = l_data.pop('title')
            ImpactLocation.objects.update_or_create(title=title, defaults=l_data)
            print(f"Created/Updated Location: {title}")
    except Exception as e:
        print(f"Notice populating locations: {e}")

    # --- Sample Appointments (Using get_or_create) ---
    try:
        Appointment.objects.get_or_create(
            email="emmanuel@example.com",
            defaults={
                "name": "Emmanuel Garba",
                "phone": "+2348123456789",
                "date": timezone.now().date(),
                "time": "10:00:00",
                "reason": "Consultation regarding Prison Apostolate legal aid outreach in Bauchi Central.",
                "status": "PENDING"
            }
        )
        print("Verified sample Appointment record")
    except Exception as e:
        print(f"Notice creating sample appointment: {e}")

    # --- Sample Donations (Using get_or_create) ---
    try:
        Donation.objects.get_or_create(
            reference="REF-JUDSCI-2024-001",
            defaults={
                "donor_name": "Misereor Partner Support",
                "email": "donor@example.org",
                "amount": 250000.00,
                "project_category": "WASH Interventions",
                "status": "SUCCESS"
            }
        )
        print("Verified sample Donation record")
    except Exception as e:
        print(f"Notice creating sample donation: {e}")

    print("Population Complete!")

if __name__ == '__main__':
    populate()
