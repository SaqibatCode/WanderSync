// frontend/src/components/ActivityCard.jsx
import React from 'react';
import { FaStar, FaMapMarkerAlt, FaCloudSun, FaClock } from 'react-icons/fa';

const ActivityCard = ({ activity, onShowDetails }) => {
    const renderStars = (rating) => {
        if (typeof rating !== 'number' || rating <= 0) {
            return <span className="text-gray-400 text-sm">No rating</span>;
        }
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar key={i} className={`inline-block ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
            );
        }
        return (
            <div className="flex items-center gap-1">
                {stars}
                <span className="text-gray-600 text-sm ml-1">({rating.toFixed(1)})</span>
            </div>
        );
    };

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-purple-100">
            {activity.image_url && (
                <div className="h-48 overflow-hidden relative">
                    <img 
                        src={`http://127.0.0.1:5000${activity.image_url}`} 
                        alt={activity.activity_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                            {activity.time_of_day}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="p-5">
                <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{activity.activity_name}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
                
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaMapMarkerAlt className="text-purple-500" />
                        <span className="truncate">{activity.address || 'Address not available'}</span>
                    </div>
                    
                    {activity.weather && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaCloudSun className="text-orange-500" />
                            <span>{activity.weather.temperature}°C, {activity.weather.status}</span>
                        </div>
                    )}
                </div>
                
                <div className="flex justify-between items-center">
                    {renderStars(activity.google_rating)}
                    <button
                        onClick={() => onShowDetails(activity)}
                        className="text-purple-600 font-semibold text-sm hover:text-pink-600 transition-colors duration-300"
                    >
                        More Details →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;