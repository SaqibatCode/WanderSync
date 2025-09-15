// frontend/src/components/ItineraryDisplay.jsx
import React from 'react';
import ActivityCard from './ActivityCard';
import { FaCalendarAlt, FaMapMarkedAlt } from 'react-icons/fa';

const ItineraryDisplay = ({ itineraryData, onShowDetails }) => {
    if (!itineraryData || !itineraryData.trip_details) {
        return null;
    }

    const { trip_details, days } = itineraryData;

    return (
        <div className="animate-fadeIn">
            <div className="text-center mb-8 pb-6 border-b-2 border-dashed border-purple-200">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
                    {trip_details.title}
                </h2>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                    <FaMapMarkedAlt className="text-pink-500" />
                    {trip_details.destination_city}, {trip_details.destination_country}
                </p>
            </div>
            
            <div className="space-y-8">
                {days.map((day, index) => (
                    <div key={day.day_number} className="animate-slideUp" style={{animationDelay: `${index * 100}ms`}}>
                        <div className="flex items-center gap-4 mb-5">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                                {day.day_number}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Day {day.day_number}</h3>
                                <p className="text-purple-600 font-medium">{day.theme}</p>
                            </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 pl-16">
                            {day.activities.map((activity, activityIndex) => (
                                <div 
                                    key={activity.activity_id}
                                    className="animate-fadeIn"
                                    style={{animationDelay: `${(index * 100) + (activityIndex * 50)}ms`}}
                                >
                                    <ActivityCard
                                        activity={activity}
                                        onShowDetails={onShowDetails}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItineraryDisplay;