
import os
import environ
import cloudinary
import cloudinary.uploader

env = environ.Env()
environ.Env.read_env('.env')

cloudinary.config(
    cloud_name=env('CLOUDINARY_CLOUD_NAME'),
    api_key=env('CLOUDINARY_API_KEY'),
    api_secret=env('CLOUDINARY_API_SECRET'),
    secure=True
)

try:
    print(f"Testing Auth for Cloud Name: {cloudinary.config().cloud_name}")
    print(f"API Key: {cloudinary.config().api_key}")
    # Try a simple resource ping
    import cloudinary.api
    res = cloudinary.api.ping()
    print("Cloudinary Ping Success!")
except Exception as e:
    print(f"Cloudinary Ping Failed: {e}")
