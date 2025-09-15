# backend/extensions.py
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_cors import CORS
import openai
import googlemaps
from pyowm import OWM

# Initialize extensions without a specific app instance
mongo = PyMongo()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")
cors = CORS(resources={r"/api/.*": {"origins": "*"}})

# API clients will be initialized in the app factory
gmaps = None
owm_manager = None

def init_api_clients(app):
    """Initializes external API clients using keys from the app config."""
    global gmaps, owm_manager
    openai.api_key = app.config['OPENAI_API_KEY']
    gmaps = googlemaps.Client(key=app.config['GOOGLE_PLACES_API_KEY'])
    owm = OWM(app.config['OPENWEATHER_API_KEY'])
    owm_manager = owm.weather_manager()