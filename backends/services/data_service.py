# backend/services/data_service.py
from extensions import gmaps, owm_manager

def enrich_itinerary_data(itinerary_json):
    """
    Takes an AI-generated JSON itinerary and enriches it with data from Google Places and OpenWeather.
    """
    if not itinerary_json: return None
    destination_city = itinerary_json.get("trip_details", {}).get("destination_city", "")

    for day in itinerary_json.get("days", []):
        for activity in day.get("activities", []):
            location_query = activity.get("location_query_for_api")
            if not location_query: continue

            try:
                places_result = gmaps.places(query=location_query)
                if places_result and 'results' in places_result and places_result['results']:
                    place_id = places_result['results'][0].get('place_id')
                    if place_id:
                        fields = ['name', 'formatted_address', 'rating', 'website', 'formatted_phone_number', 'opening_hours', 'photo', 'url', 'review']
                        place_details = gmaps.place(place_id=place_id, fields=fields)['result']
                        
                        activity['address'] = place_details.get('formatted_address')
                        activity['google_rating'] = place_details.get('rating')
                        activity['website'] = place_details.get('website')
                        activity['phone_number'] = place_details.get('formatted_phone_number')
                        activity['opening_hours'] = place_details.get('opening_hours', {}).get('weekday_text')
                        activity['google_maps_url'] = place_details.get('url')
                        if 'reviews' in place_details and place_details['reviews']:
                            activity['top_review'] = {'author': place_details['reviews'][0].get('author_name'), 'text': place_details['reviews'][0].get('text')}
                        
                        if 'photos' in place_details and place_details['photos']:
                            photo_reference = place_details['photos'][0].get('photo_reference')
                            if photo_reference:
                                activity['image_url'] = f"/api/image-proxy/{photo_reference}"
            except Exception as e:
                print(f"Google Places API Error for '{location_query}': {e}")

            try:
                if destination_city:
                    observation = owm_manager.weather_at_place(destination_city)
                    weather = observation.weather
                    activity['weather'] = {'status': weather.detailed_status, 'temperature': weather.temperature('celsius').get('temp')}
            except Exception as e:
                print(f"OpenWeather API Error for '{destination_city}': {e}")
                
    return itinerary_json