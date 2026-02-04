import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jdpc_bauchi_api.settings')
django.setup()

from impact.models import ImpactStat

stats_data = [
    {'label': 'Lives Touched', 'value': 12000, 'suffix': '+'},
    {'label': 'Peace Accords', 'value': 45, 'suffix': ''},
    {'label': 'LGAs Reached', 'value': 20, 'suffix': '/20'},
    {'label': 'Legal Aid Cases', 'value': 850, 'suffix': '+'}
]

def run():
    print("Populating Impact Stats...")
    ImpactStat.objects.all().delete()
    
    for stat in stats_data:
        ImpactStat.objects.create(**stat)
        print(f"Created stat: {stat['label']}")

if __name__ == '__main__':
    run()
