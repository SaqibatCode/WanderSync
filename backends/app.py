# backend/app.py
from flask import Flask
from config import Config
from extensions import mongo, jwt, socketio, cors, init_api_clients
from routes.auth_routes import auth_bp
from routes.itinerary_routes import itinerary_bp
from routes.main_routes import main_bp
import sockets  # Import to register the socket event handlers

def create_app(config_class=Config):
    """
    An application factory, as explained in the Flask docs.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    mongo.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)
    cors.init_app(app)
    
    # Initialize external API clients within the app context
    with app.app_context():
        init_api_clients(app)

    # Register blueprints to organize routes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(itinerary_bp, url_prefix='/api')
    app.register_blueprint(main_bp, url_prefix='/api')

    return app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    # Run the app with SocketIO to support WebSockets
    socketio.run(app, debug=True)