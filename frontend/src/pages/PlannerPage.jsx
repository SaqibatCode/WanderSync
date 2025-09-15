// frontend/src/pages/PlannerPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ItineraryDisplay from '../components/ItineraryDisplay';
import ActivityModal from '../components/ActivityModal';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaStar, FaPlus, FaMagic } from 'react-icons/fa';

const ChatMessage = ({ message }) => {
    const { currentUser } = useAuth();
    const { sender, text } = message;
    const isAI = sender === 'ai';
    const isMyMessage = sender === 'user' || sender === currentUser;

    return (
        <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
            <div className={`
                max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-md
                ${isAI 
                    ? 'bg-white border border-purple-100 text-gray-800' 
                    : isMyMessage 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                }
            `}>
                {!isAI && !isMyMessage && (
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
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
        </div>
    </div>
);

function PlannerPage() {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('inProgressChat');
        return savedMessages ? JSON.parse(savedMessages) : [
            { sender: 'ai', text: '✨ Hello! I\'m your AI travel architect. Tell me about your dream trip and I\'ll craft the perfect itinerary for you!' }
        ];
    });

    const [userInput, setUserInput] = useState('');
    const [itinerary, setItinerary] = useState(null);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const { token, currentUser } = useAuth();
    const chatEndRef = useRef(null);
    const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            setUserInput(transcript);
        }
    }, [transcript]);

    useEffect(() => {
        localStorage.setItem('inProgressChat', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAiThinking]);

    const handleNewTrip = () => {
        setMessages([{ sender: 'ai', text: '🌟 Exciting! Let\'s plan a brand new adventure. Where shall we explore this time?' }]);
        setItinerary(null);
        localStorage.removeItem('inProgressChat');
    };

    const handleUserInput = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isAiThinking) return;

        const promptText = userInput;
        const newMessages = [...messages, { sender: currentUser || 'user', text: promptText }];
        setMessages(newMessages);
        setUserInput('');
        setIsAiThinking(true);

        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const response = await axios.post('/api/analyze-prompt', {
                prompt: newMessages.map(m => `${m.sender}: ${m.text}`).join('\n')
            }, { headers });

            const { intent, ai_response } = response.data;
            setMessages(prev => [...prev, { sender: 'ai', text: ai_response }]);

            if (intent === 'READY_TO_PLAN') {
                setIsAiThinking(true);
                const planResponse = await axios.post('/api/plan-trip', {
                    prompt: newMessages.map(m => `${m.sender}: ${m.text}`).join('\n')
                }, { headers });
                setItinerary(planResponse.data);
            }
        } catch (err) {
            console.error("Error with AI:", err);
            setMessages(prev => [...prev, { sender: 'ai', text: '😔 Sorry, I ran into an error. Please try again.' }]);
        } finally {
            setIsAiThinking(false);
        }
    };

    const handleSaveTrip = async () => {
        if (!itinerary) {
            alert("There's no itinerary to save!");
            return;
        }
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            await axios.post('/api/itineraries', {
                itinerary: itinerary,
                chat_history: messages
            }, { headers });
            alert('✅ Trip saved successfully!');
            handleNewTrip();
        } catch (err) {
            console.error('Error saving trip:', err);
            alert('Failed to save trip. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Chat Section */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <FaMagic className="text-yellow-300" />
                                        AI Travel Assistant
                                    </h2>
                                    <p className="text-white/80 text-sm mt-1">Chat with me to plan your perfect trip</p>
                                </div>
                                <button 
                                    onClick={handleNewTrip}
                                    className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/30 transition-all duration-300"
                                >
                                    <FaPlus /> New Trip
                                </button>
                            </div>
                        </div>
                        
                        <div className="h-[500px] overflow-y-auto p-6 bg-gradient-to-b from-purple-50/30 to-pink-50/30">
                            {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
                            {isAiThinking && <AiThinkingIndicator />}
                            <div ref={chatEndRef} />
                        </div>
                        
                        <form onSubmit={handleUserInput} className="border-t border-purple-100 bg-white p-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Describe your dream destination..."
                                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-purple-100 focus:border-purple-400 focus:outline-none transition-all duration-300"
                                    disabled={isAiThinking}
                                />
                                {hasRecognitionSupport && (
                                    <button 
                                        type="button" 
                                        onClick={isListening ? stopListening : startListening}
                                        className={`p-3 rounded-2xl transition-all duration-300 ${
                                            isListening 
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
                                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Itinerary Section */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                        <div className="bg-gradient-to-r from-pink-600 to-orange-500 p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Your Itinerary</h2>
                                {itinerary && (
                                    <button 
                                        onClick={handleSaveTrip}
                                        className="bg-white text-pink-600 px-4 py-2 rounded-full font-semibold hover:bg-white/90 transition-all duration-300"
                                    >
                                        Save Trip
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="h-[600px] overflow-y-auto p-6 bg-gradient-to-b from-pink-50/30 to-orange-50/30">
                            {itinerary ? (
                                <ItineraryDisplay
                                    itineraryData={itinerary}
                                    onShowDetails={(activity) => setSelectedActivity(activity)}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <div className="text-6xl mb-4">✈️</div>
                                    <p className="text-lg">Your amazing itinerary will appear here</p>
                                    <p className="text-sm mt-2">Start chatting to plan your trip!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <ActivityModal
                activity={selectedActivity}
                onClose={() => setSelectedActivity(null)}
            />
        </div>
    );
}

export default PlannerPage;