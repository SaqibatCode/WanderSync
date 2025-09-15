# backend/routes/itinerary_routes.py
import os
import json
import smtplib
import ssl
from email.message import EmailMessage
from flask import Blueprint, request, jsonify
from extensions import mongo, socketio
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
import openai
from prompts import SMART_TRIAGE_PROMPT, ARCHITECT_SYSTEM_PROMPT, SUMMARIZER_PROMPT, COLLABORATOR_TRIAGE_PROMPT, COLLABORATOR_SYSTEM_PROMPT
from services.data_service import enrich_itinerary_data

itinerary_bp = Blueprint('itinerary_bp', __name__)

def create_user_profile_from_history(username):
    user_itineraries = mongo.db.itineraries.find({'username': username}, {'itinerary.trip_details.title': 1, 'itinerary.days.theme': 1})
    past_trips_summary = [f"Trip: {t.get('itinerary', {}).get('trip_details', {}).get('title', '')}. Themes: {', '.join([d.get('theme', '') for d in t.get('itinerary', {}).get('days', [])])}" for t in user_itineraries]
    if not past_trips_summary: return "New user"
    try:
        response = openai.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": SUMMARIZER_PROMPT}, {"role": "user", "content": "\n".join(past_trips_summary)}])
        return response.choices[0].message.content
    except Exception as e:
        print(f"RAG Error: {e}")
        return "New user"

@itinerary_bp.route('/analyze-prompt', methods=['POST'])
@jwt_required()
def analyze_prompt_route():
    current_user = get_jwt_identity()
    user_prompt = request.json.get('prompt')
    user_profile = create_user_profile_from_history(current_user)
    augmented_prompt = f"User Profile:\n{user_profile}\n\nConversation History:\n{user_prompt}"
    try:
        response = openai.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": SMART_TRIAGE_PROMPT}, {"role": "user", "content": augmented_prompt}], response_format={"type": "json_object"})
        return jsonify(json.loads(response.choices[0].message.content))
    except Exception as e:
        print(f"Error in prompt analysis: {e}")
        return jsonify({"error": "Failed to analyze prompt."}), 500

@itinerary_bp.route('/plan-trip', methods=['POST'])
@jwt_required()
def plan_trip_route():
    user_prompt = request.json.get('prompt')
    try:
        response = openai.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": ARCHITECT_SYSTEM_PROMPT}, {"role": "user", "content": user_prompt}], response_format={"type": "json_object"})
        itinerary_data = json.loads(response.choices[0].message.content)
        return jsonify(enrich_itinerary_data(itinerary_data))
    except Exception as e:
        print(f"Error planning trip: {e}")
        return jsonify({"error": "Failed to plan trip."}), 500

@itinerary_bp.route('/itineraries', methods=['POST'])
@jwt_required()
def save_itinerary_route():
    current_user = get_jwt_identity()
    data = request.json
    mongo.db.itineraries.insert_one({'username': current_user, 'itinerary': data.get('itinerary'), 'chat_history': data.get('chat_history'), 'title': data.get('itinerary', {}).get('trip_details', {}).get('title', 'Untitled Trip')})
    return jsonify({"message": "Itinerary saved successfully"}), 201

@itinerary_bp.route('/itineraries', methods=['GET'])
@jwt_required()
def get_itineraries_route():
    current_user = get_jwt_identity()
    user_itineraries = mongo.db.itineraries.find({'username': current_user}, {'title': 1})
    return jsonify([{'id': str(itinerary['_id']), 'title': itinerary['title']} for itinerary in user_itineraries]), 200

@itinerary_bp.route('/itineraries/<trip_id>', methods=['GET'])
@jwt_required()
def get_itinerary_by_id_route(trip_id):
    try:
        itinerary = mongo.db.itineraries.find_one({'_id': ObjectId(trip_id)})
        if not itinerary: return jsonify({"error": "Itinerary not found"}), 404
        itinerary['_id'] = str(itinerary['_id'])
        return jsonify(itinerary), 200
    except:
        return jsonify({"error": "Invalid itinerary ID format"}), 400

@itinerary_bp.route('/itineraries/<trip_id>/chat', methods=['POST'])
@jwt_required()
def collaborate_chat_route(trip_id):
    current_user = get_jwt_identity()
    data = request.json
    itinerary_data, chat_history, new_prompt = data.get('itinerary'), data.get('chat_history'), data.get('prompt')
    full_conversation = "\n".join([f"{m['sender']}: {m['text']}" for m in chat_history]) + f"\n{current_user}: {new_prompt}"
    try:
        triage_response = openai.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": COLLABORATOR_TRIAGE_PROMPT}, {"role": "user", "content": full_conversation}], response_format={"type": "json_object"})
        triage_data = json.loads(triage_response.choices[0].message.content)
        intent, ai_reply = triage_data.get('intent'), triage_data.get('response')
        
        final_chat = chat_history + [{'sender': current_user, 'text': new_prompt}, {'sender': 'ai', 'text': ai_reply}]
        final_itinerary = itinerary_data

        if intent == 'update_itinerary':
            update_response = openai.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": COLLABORATOR_SYSTEM_PROMPT}, {"role": "user", "content": f"Itinerary JSON:\n{json.dumps(itinerary_data)}\n\nConversation:\n{full_conversation}\n\nPlease perform the request."}], response_format={"type": "json_object"})
            final_itinerary = enrich_itinerary_data(json.loads(update_response.choices[0].message.content))
        
        mongo.db.itineraries.update_one({'_id': ObjectId(trip_id)}, {'$set': {'itinerary': final_itinerary, 'chat_history': final_chat}})
        broadcast_data = {'itinerary': final_itinerary, 'chat_history': final_chat}
        socketio.emit('trip_updated', broadcast_data, to=trip_id)
        return jsonify(broadcast_data), 200
    except Exception as e:
        print(f"Chat Error: {e}")
        return jsonify({"error": "AI assistant error."}), 500

@itinerary_bp.route('/itineraries/<trip_id>/email', methods=['POST'])
@jwt_required()
def email_itinerary_route(trip_id):
    recipient_email = request.json.get('recipient_email')
    itinerary_doc = mongo.db.itineraries.find_one({'_id': ObjectId(trip_id)})
    if not itinerary_doc: return jsonify({"error": "Itinerary not found"}), 404
    details = itinerary_doc.get('itinerary', {}).get('trip_details', {})
    html_content = f"<h1>{details.get('title', '')}</h1>" + "".join([f"<h3>Day {d.get('day_number')}: {d.get('theme')}</h3><ul>" + "".join([f"<li><strong>{a.get('activity_name')}</strong>: {a.get('description')}</li>" for a in d.get('activities', [])]) + "</ul>" for d in itinerary_doc.get('itinerary', {}).get('days', [])])
    
    em = EmailMessage()
    em['From'] = os.getenv('SENDER_EMAIL')
    em['To'] = recipient_email
    em['Subject'] = f"Your Trip Plan: {details.get('title', '')}"
    em.add_alternative(html_content, subtype='html')
    
    try:
        with smtplib.SMTP_SSL(os.getenv('SMTP_SERVER'), int(os.getenv('SMTP_PORT')), context=ssl.create_default_context()) as smtp:
            smtp.login(os.getenv('SENDER_EMAIL'), os.getenv('SENDER_PASSWORD'))
            smtp.sendmail(os.getenv('SENDER_EMAIL'), recipient_email, em.as_string())
        return jsonify({"message": "Email sent!"}), 200
    except Exception as e:
        print(f"SMTP Error: {e}")
        return jsonify({"error": "Failed to send email."}), 500