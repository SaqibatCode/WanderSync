// frontend/src/components/ActivityModal.jsx
import React from 'react';
import { FaTimes, FaGlobe, FaPhone, FaClock, FaCommentAlt, FaGoogle, FaStar } from 'react-icons/fa';

const ActivityModal = ({ activity, onClose }) => {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-slideUp" onClick={(e) => e.stopPropagation()}>
        {activity.image_url && (
          <div className="relative h-64 overflow-hidden rounded-t-3xl">
            <img 
              src={`http://127.0.0.1:5000${activity.image_url}`}  
              alt={activity.activity_name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-3 hover:bg-white transition-all duration-300 shadow-lg"
            >
              <FaTimes className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="absolute bottom-4 left-6 text-3xl font-bold text-white drop-shadow-lg">
              {activity.activity_name}
            </h2>
          </div>
        )}
        
        {!activity.image_url && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-t-3xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-all duration-300"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-3xl font-bold text-white">{activity.activity_name}</h2>
          </div>
        )}
        
        <div className="p-8">
          <p className="text-gray-600 mb-6 flex items-center gap-2">
            <FaGoogle className="text-blue-500" />
            {activity.address}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {activity.website && (
              <a 
                href={activity.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <FaGlobe className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-purple-700 font-medium">Visit Website</span>
              </a>
            )}
            
            {activity.phone_number && (
              <a 
                href={`tel:${activity.phone_number}`}
                className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-2xl hover:from-green-100 hover:to-blue-100 transition-all duration-300 group"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <FaPhone className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-green-700 font-medium">{activity.phone_number}</span>
              </a>
            )}
            
            {activity.google_maps_url && (
              <a 
                href={activity.google_maps_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <FaGoogle className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-blue-700 font-medium">View on Maps</span>
              </a>
            )}
          </div>
          
          {activity.opening_hours && (
            <div className="mb-8">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                <FaClock className="text-purple-500" />
                Opening Hours
              </h4>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5">
                <ul className="space-y-2">
                  {activity.opening_hours.map((line, index) => (
                    <li key={index} className="text-gray-700">{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {activity.top_review && (
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                <FaStar className="text-yellow-500" />
                Top Review
              </h4>
              <blockquote className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-l-4 border-yellow-400">
                <p className="italic text-gray-700 mb-3">"{activity.top_review.text}"</p>
                <footer className="text-sm text-gray-600 font-semibold">— {activity.top_review.author}</footer>
              </blockquote>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;