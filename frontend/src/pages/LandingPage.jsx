// frontend/src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMagic , FaUsers, FaMap, FaArrowRight, FaPlane, FaGlobe, FaCalendar, FaRocket, FaChartLine } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { 
      icon: <FaMagic  className="w-8 h-8" />, 
      title: "AI-Powered Planning", 
      desc: "Let our advanced AI create perfect itineraries tailored to your preferences in seconds",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: <FaUsers className="w-8 h-8" />, 
      title: "Real-Time Collaboration", 
      desc: "Plan trips together with friends and family in real-time with live updates",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: <FaMap className="w-8 h-8" />, 
      title: "Smart Recommendations", 
      desc: "Get personalized activity suggestions based on your interests and travel style",
      color: "from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Adventure Traveler",
      text: "WanderSync completely transformed how I plan my trips. The AI suggestions are spot-on!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Family Vacationer",
      text: "Planning family trips has never been easier. Everyone can contribute ideas in real-time.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Digital Nomad",
      text: "As someone who travels constantly, this is a game-changer. It saves me hours of research.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      <div className="fixed inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-white font-bold text-2xl flex items-center gap-2">
            <FaPlane className="text-yellow-400" />
            WanderSync
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-white hover:text-yellow-300 transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8">
              <FaRocket className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-white font-medium">Powered by Generative AI Odyssey</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black text-white mb-8 leading-tight animate-fadeIn">
              Travel Planning
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                Reimagined
              </span>
            </h1>
            
            <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create perfect itineraries in seconds with AI. Collaborate with friends. 
              Discover hidden gems. Your dream trip starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="group bg-white text-purple-900 px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transform transition-all duration-300 shadow-2xl"
              >
                Start Planning Free
                <FaArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 backdrop-blur text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30"
              >
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">50K+</div>
                <div className="text-white/70 mt-2">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400">1M+</div>
                <div className="text-white/70 mt-2">Trips Planned</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400">195</div>
                <div className="text-white/70 mt-2">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-32 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-bold text-center text-white mb-16">
              Everything You Need for
              <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                Perfect Trip Planning
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                    activeFeature === index ? 'ring-4 ring-white/40 bg-white/20' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* "How It Works" Section */}
        <div className="py-32">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-5xl font-bold text-white mb-16">
                    Effortless Planning in
                    <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                        3 Simple Steps
                    </span>
                </h2>
                <div className="relative grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 border-t-2 border-dashed border-white/20 -translate-y-1/2"></div>
                    
                    <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
                        <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl font-bold">1</div>
                        <h3 className="text-2xl font-bold mb-4 mt-8">Describe Your Trip</h3>
                        <p className="text-white/70">Simply tell our AI your destination, budget, and interests in plain English.</p>
                    </div>
                    <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl font-bold">2</div>
                        <h3 className="text-2xl font-bold mb-4 mt-8">Collaborate & Refine</h3>
                        <p className="text-white/70">Invite friends, chat with the AI, and make real-time changes to perfect your plan.</p>
                    </div>
                    <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl font-bold">3</div>
                        <h3 className="text-2xl font-bold mb-4 mt-8">Export & Go!</h3>
                        <p className="text-white/70">Download a beautiful PDF or email the itinerary to have it ready for your adventure.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Demo Section */}
        <div id="demo" className="py-32">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-2 border border-white/20 max-w-6xl mx-auto">
              <div className="bg-black/40 rounded-2xl p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-5xl font-bold text-white mb-6">
                      See The Magic
                      <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                        In Action
                      </span>
                    </h2>
                    <p className="text-white/80 text-lg mb-8 leading-relaxed">
                      Watch how our AI creates a perfect 5-day Tokyo itinerary in just seconds, 
                      complete with personalized recommendations, real-time weather, and insider tips.
                    </p>
                    <div className="space-y-4">
                      {['Instant itinerary generation', 'Weather-aware planning', 'Budget optimization', 'Local hidden gems'].map((item, i) => (
                        <div key={i} className="flex items-center text-white/90">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            ✓
                          </div>
                          <span className="text-lg">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-1">
                    <div className="bg-black rounded-xl aspect-video flex items-center justify-center">
                      <FaPlane className="w-24 h-24 text-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-32 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-bold text-center text-white mb-16">
              Loved by Travelers
              <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                Around the World
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4"></div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-white/60 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-32">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-6xl font-bold text-white mb-8">
              Ready to Plan Your
              <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text">
                Next Adventure?
              </span>
            </h2>
            <p className="text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
              Join thousands of travelers who've discovered the joy of effortless trip planning.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-6 rounded-full font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Start Your Free Journey
              <FaArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;