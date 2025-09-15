# backend/routes/main_routes.py
import os
import requests
import io as python_io
from flask import Blueprint, send_file

main_bp = Blueprint('main_bp', __name__)

@main_bp.route('/image-proxy/<photo_reference>')
def image_proxy(photo_reference):
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    google_photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference={photo_reference}&key={api_key}"
    try:
        response = requests.get(google_photo_url, stream=True)
        if response.status_code == 200:
            return send_file(python_io.BytesIO(response.content), mimetype=response.headers['Content-Type'])
        return "Failed to fetch image", response.status_code
    except Exception as e:
        print(f"Image proxy error: {e}")
        return "Server error", 500