// frontend/src/pages/MyTripsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaPlane, FaCalendar, FaMapMarkedAlt, FaChevronRight, FaPlus, FaSearch } from 'react-icons/fa';

const MyTripsPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const headers = { 'Authorization': `Bearer ${token}` };
                const response = await axios.get('http://127.0.0.1:5000/api/itineraries', { headers });
                setTrips(response.data);
            } catch (error) {
                console.error('Failed to fetch trips:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [token]);

    const filteredTrips = trips.filter(trip => 
        trip.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your amazing trips...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-4">
                        My Travel Collection
                    </h1>
                    <p className="text-gray-600 text-lg">Relive your adventures and plan new ones</p>
                </div>

                {/* Search and Actions Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search your trips..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 backdrop-blur border border-purple-100 focus:border-purple-400 focus:outline-none transition-all duration-300"
                        />
                    </div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                        <FaPlus />
                        Plan New Trip
                    </Link>
                </div>

                {/* Trips Grid */}
                {filteredTrips.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-16 text-center">
                        <div className="max-w-md mx-auto">
                            <FaPlane className="text-6xl text-gray-300 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                {searchTerm ? 'No trips found' : 'No trips yet'}
                            </h2>
                            <p className="text-gray-500 mb-8">
                                {searchTerm 
                                    ? 'Try adjusting your search terms' 
                                    : 'Start planning your first adventure with our AI assistant!'}
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                                <FaMagic  />
                                Create Your First Trip
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTrips.map((trip, index) => (
                            <Link
                                to={`/trip/${trip.id}`}
                                key={trip.id}
                                className="group block"
                                style={{animationDelay: `${index * 50}ms`}}
                            >
                                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-purple-100 group-hover:border-purple-300">
                                    {/* Card Header with Gradient */}
                                    <div className="h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-6 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/20"></div>
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                                                {trip.title}
                                            </h3>
                                        </div>
                                        <FaPlane className="absolute -bottom-4 -right-4 text-white/10 text-8xl transform rotate-45" />
                                    </div>
                                    
                                    {/* Card Body */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                                            <FaMapMarkedAlt className="text-purple-500" />
                                            <span className="font-medium">
                                                {trip.destination_city || 'Adventure Awaits'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                                            <FaCalendar className="text-pink-500" />
                                            <span>{trip.days?.length || 0} Days Planned</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-sm text-gray-500">
                                                Created {new Date(trip.created_at || Date.now()).toLocaleDateString()}
                                            </span>
                                            <div className="bg-purple-100 text-purple-600 p-2 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                                <FaChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTripsPage;