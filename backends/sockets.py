# backend/sockets.py
from extensions import socketio
from flask_socketio import join_room

@socketio.on('connect')
def handle_connect():
    print('Client connected!')

@socketio.on('join_trip_room')
def handle_join_room(data):
    trip_id = data['trip_id']
    join_room(trip_id)
    print(f'Client joined room: {trip_id}')