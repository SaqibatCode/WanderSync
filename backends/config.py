# backend/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration from environment variables."""
    # Flask settings
    SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'a-very-secret-key-for-dev')
    DEBUG = True

    # MongoDB settings
    MONGO_URI = os.getenv('MONGO_URI')

    # JWT settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

    # API keys
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    GOOGLE_PLACES_API_KEY = os.getenv('GOOGLE_PLACES_API_KEY')
    OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')

    # SMTP (Email) settings
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 465))
    SENDER_EMAIL = os.getenv('SENDER_EMAIL')
    SENDER_PASSWORD = os.getenv('SENDER_PASSWORD')