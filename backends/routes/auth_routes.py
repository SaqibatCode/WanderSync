# backend/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from extensions import mongo
from flask_jwt_extended import create_access_token
from bcrypt import hashpw, gensalt, checkpw

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    users = mongo.db.users
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    if users.find_one({'username': username}):
        return jsonify({"error": "Username already exists"}), 409
    hashed_password = hashpw(password.encode('utf-8'), gensalt())
    users.insert_one({'username': username, 'password': hashed_password})
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    users = mongo.db.users
    username = request.json.get('username')
    password = request.json.get('password')
    user = users.find_one({'username': username})
    if not user or not checkpw(password.encode('utf-8'), user['password']):
        return jsonify({"error": "Invalid username or password"}), 401
    access_token = create_access_token(identity=username)
    return jsonify({"access_token": access_token}), 200