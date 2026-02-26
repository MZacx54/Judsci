import requests
import re

try:
    response = requests.get('https://judsci-production-b036.up.railway.app/api/programs/')
    text = response.text
    
    m1 = re.search(r'<title>(.*?)</title>', text)
    title = m1.group(1) if m1 else 'No title found'
    print(f"Title: {title}")

    m2 = re.search(r'<pre class="exception_value">(.*?)</pre>', text, re.DOTALL)
    if m2:
        print(f"Exception: {m2.group(1).strip()}")
    else:
        # If standard exception string not found, just print the first 1000 chars of the body
        print("Could not find exception_value block. Showing first 1000 chars:")
        body_match = re.search(r'<body[^>]*>(.*?)</body>', text, re.DOTALL | re.IGNORECASE)
        if body_match:
            print(body_match.group(1).strip()[:1000])
        else:
            print(text[:1000])
except Exception as e:
    print(f"Error fetching URL: {e}")
