// frontend/src/pages/TripDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import ItineraryDisplay from '../components/ItineraryDisplay';
import ActivityModal from '../components/ActivityModal';
import EmailModal from '../components/EmailModal';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaFilePdf, FaEnvelope, FaArrowLeft, FaUsers, FaMagic } from 'react-icons/fa';

const ChatMessage = ({ message }) => {
    const { currentUser } = useAuth();
    const { sender, text } = message;

    if (sender === 'ai') {
        return (
            <div className="flex justify-start mb-4">
                <div className="bg-white border border-purple-100 px-5 py-3 rounded-2xl shadow-md max-w-xs lg:max-w-md">
                    <div className="text-sm lg:text-base text-gray-800">{text}</div>
                </div>
            </div>
        );
    }

    const isMyMessage = sender === currentUser;
    return (
        <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`px-5 py-3 rounded-2xl shadow-md max-w-xs lg:max-w-md ${isMyMessage
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-100 text-gray-800'
                }`}>
                {!isMyMessage && (
                    <div className="text-xs font-semibold mb-1 opacity-70">{sender}</div>
                )}
                <div className="text-sm lg:text-base">{text}</div>
            </div>
        </div>
    );
};

const AiThinkingIndicator = () => (
    <div className="flex justify-start mb-4">
        <div className="bg-white border border-purple-100 px-5 py-3 rounded-2xl shadow-md">
            <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    </div>
);

const TripDetailPage = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { token, currentUser } = useAuth();
    const [tripData, setTripData] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);
    const chatEndRef = useRef(null);
    const itineraryRef = useRef(null);
    const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const headers = { 'Authorization': `Bearer ${token}` };
                const response = await axios.get(`/api/itineraries/${tripId}`, { headers });
                setTripData(response.data);
            } catch (err) {
                console.error("Failed to fetch trip details:", err);
            }
        };
        fetchTripDetails();

        const socket = io('http://127.0.0.1:5000');
        socket.on('connect', () => {
            socket.emit('join_trip_room', { trip_id: tripId });
        });
        socket.on('trip_updated', (updatedTripData) => {
            setIsAiThinking(false);
            setTripData(updatedTripData);
        });
        socket.on('users_in_room', (users) => {
            setActiveUsers(users);
        });

        return () => {
            socket.disconnect();
        };
    }, [tripId, token]);

    useEffect(() => {
        if (transcript) {
            setUserInput(transcript);
        }
    }, [transcript]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [tripData?.chat_history, isAiThinking]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isAiThinking) return;

        const prompt = userInput;
        setUserInput('');
        setIsAiThinking(true);
        setTripData(prev => ({
            ...prev,
            chat_history: [...prev.chat_history, { sender: currentUser, text: prompt }]
        }));

        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const response = await axios.post(`/api/itineraries/${tripId}/chat`, {
                itinerary: tripData.itinerary,
                chat_history: tripData.chat_history,
                prompt: prompt
            }, { headers });
            setTripData(response.data);
        } catch (err) {
            console.error("Failed to send message:", err);
        } finally {
            setIsAiThinking(false);
        }
    };

    const handleExportPDF = async () => {
        if (!tripData?.itinerary) return;

        setIsExporting(true);

        try {
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'pt', // Use points for easier font sizing and spacing
                format: 'a4'
            });

            const itinerary = tripData.itinerary;
            const details = itinerary.trip_details;
            let yPos = 40; // Vertical position start
            const margin = 40;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const usableWidth = pageWidth - (margin * 2);

            // --- PDF HEADER ---
            pdf.setFontSize(24).setFont(undefined, 'bold');
            pdf.text(details.title, pageWidth / 2, yPos, { align: 'center' });
            yPos += 30;
            pdf.setFontSize(16).setFont(undefined, 'normal');
            pdf.text(`${details.destination_city}, ${details.destination_country}`, pageWidth / 2, yPos, { align: 'center' });
            yPos += 40;

            // --- Loop through each day ---
            for (const day of itinerary.days) {
                // Check for page overflow before starting a new day
                if (yPos > pdf.internal.pageSize.getHeight() - 80) {
                    pdf.addPage();
                    yPos = 40;
                }

                pdf.setFontSize(18).setFont(undefined, 'bold');
                pdf.text(`Day ${day.day_number}: ${day.theme}`, margin, yPos);
                yPos += 25;

                // --- Loop through each activity in the day ---
                for (const activity of day.activities) {
                    // Two-column layout
                    const imageWidth = 100;
                    const textWidth = usableWidth - imageWidth - 10; // 10 is the gap
                    const initialYPosForActivity = yPos;

                    // --- COLUMN 1: IMAGE ---
                    if (activity.image_url) {
                        try {
                            const response = await fetch(`http://127.0.0.1:5000${activity.image_url}`);
                            const blob = await response.blob();
                            const imageUrl = URL.createObjectURL(blob);
                            pdf.addImage(imageUrl, 'PNG', margin, yPos, imageWidth, 60, undefined, 'FAST');
                            URL.revokeObjectURL(imageUrl);
                        } catch (e) {
                            console.error("Could not load image for PDF:", e);
                        }
                    }

                    // --- COLUMN 2: TEXT DETAILS ---
                    pdf.setFontSize(12).setFont(undefined, 'bold');
                    const titleLines = pdf.splitTextToSize(activity.activity_name, textWidth);
                    pdf.text(titleLines, margin + imageWidth + 10, yPos);
                    yPos += (titleLines.length * 12) + 5; // Adjust yPos based on title lines

                    pdf.setFontSize(9).setFont(undefined, 'normal');
                    const descLines = pdf.splitTextToSize(activity.description, textWidth);
                    pdf.text(descLines, margin + imageWidth + 10, yPos);
                    yPos += (descLines.length * 9);

                    // Determine the final height of this activity block
                    const finalYPosForActivity = Math.max(initialYPosForActivity + 70, yPos);
                    yPos = finalYPosForActivity + 20; // Add padding for the next activity

                    if (yPos > pdf.internal.pageSize.getHeight() - 40) {
                        pdf.addPage();
                        yPos = 40;
                    }
                }
            }

            pdf.save('WanderSync-Itinerary.pdf');

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("A critical error occurred while creating the PDF.");
        } finally {
            setIsExporting(false);
        }
    };


    const handleSendEmail = async (recipientEmail) => {
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            await axios.post(`/api/itineraries/${tripId}/email`, {
                recipient_email: recipientEmail
            }, { headers });
            alert('✅ Email sent successfully!');
            setIsEmailModalOpen(false);
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email.");
        }
    };

    if (!tripData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your trip details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div className="container mx-auto px-4 py-6">
                {/* Header Bar */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4 mb-6 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/my-trips')}
                        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Trips
                    </button>

                    <div className="flex items-center gap-4">
                        {activeUsers.length > 0 && (
                            <div className="flex items-center gap-2">
                                <FaUsers className="text-purple-500" />
                                <span className="text-sm text-gray-600">{activeUsers.length} collaborating</span>
                            </div>
                        )}
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-200 transition-colors"
                        >
                            <FaFilePdf />
                            {isExporting ? 'Exporting...' : 'Export PDF'}
                        </button>
                        <button
                            onClick={() => setIsEmailModalOpen(true)}
                            className="flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-xl hover:bg-pink-200 transition-colors"
                        >
                            <FaEnvelope />
                            Email Trip
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Collaborative Chat */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FaMagic className="text-yellow-300" />
                                Collaborative Planning
                            </h2>
                            <p className="text-white/80 text-sm mt-1">Chat with AI and friends to refine your trip</p>
                        </div>

                        <div className="h-[500px] overflow-y-auto p-6 bg-gradient-to-b from-purple-50/30 to-pink-50/30">
                            {tripData.chat_history.map((msg, index) => (
                                <ChatMessage key={index} message={msg} />
                            ))}
                            {isAiThinking && <AiThinkingIndicator />}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="border-t border-purple-100 bg-white p-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Suggest changes or ask questions..."
                                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-purple-100 focus:border-purple-400 focus:outline-none transition-all duration-300"
                                    disabled={isAiThinking}
                                />
                                {hasRecognitionSupport && (
                                    <button
                                        type="button"
                                        onClick={isListening ? stopListening : startListening}
                                        className={`p-3 rounded-2xl transition-all duration-300 ${isListening
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                            }`}
                                    >
                                        {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isAiThinking}
                                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Itinerary Display */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                        <div className="bg-gradient-to-r from-pink-600 to-orange-500 p-6">
                            <h2 className="text-2xl font-bold text-white">Trip Itinerary</h2>
                        </div>

                        <div ref={itineraryRef} className="h-[600px] overflow-y-auto p-6 bg-gradient-to-b from-pink-50/30 to-orange-50/30">
                            <ItineraryDisplay
                                itineraryData={tripData.itinerary}
                                onShowDetails={(activity) => setSelectedActivity(activity)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ActivityModal
                activity={selectedActivity}
                onClose={() => setSelectedActivity(null)}
            />

            {isEmailModalOpen && (
                <EmailModal
                    onClose={() => setIsEmailModalOpen(false)}
                    onSend={handleSendEmail}
                />
            )}
        </div>
    );
};

export default TripDetailPage;