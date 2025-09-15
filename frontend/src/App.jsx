// frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PlannerPage from './pages/PlannerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyTripsPage from './pages/MyTripsPage';
import TripDetailPage from './pages/TripDetailPage';
import LandingPage from './pages/LandingPage';
import { FaPlane, FaCompass, FaSignOutAlt, FaBars, FaTimes, FaMagic } from 'react-icons/fa';
import './App.css';

// Protected Route Component remains the same
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/landing" />;
};

// Fixed Navbar Component
const Navbar = () => {
  const { token, logout, currentUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!token || location.pathname === '/landing') return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <FaPlane className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              AI Trip Architect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'hover:bg-purple-50 text-gray-700'
              }`}
            >
              <FaMagic />
              Plan Trip
            </Link>
            <Link
              to="/my-trips"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isActive('/my-trips') 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'hover:bg-purple-50 text-gray-700'
              }`}
            >
              <FaCompass />
              My Trips
            </Link>
            
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {currentUser?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-gray-700 font-medium">{currentUser || 'User'}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Navigation - same as before */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 animate-slideDown">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium mb-2 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'hover:bg-purple-50 text-gray-700'
              }`}
            >
              <FaMagic />
              Plan Trip
            </Link>
            <Link
              to="/my-trips"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium mb-2 ${
                isActive('/my-trips') 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'hover:bg-purple-50 text-gray-700'
              }`}
            >
              <FaCompass />
              My Trips
            </Link>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 w-full"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// Rest of App component remains the same
function App() {
  const { token } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={token ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={token ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/my-trips" element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
          <Route path="/trip/:tripId" element={<ProtectedRoute><TripDetailPage /></ProtectedRoute>} />
          <Route
            path="/"
            element={
              token ? (
                <ProtectedRoute>
                  <PlannerPage />
                </ProtectedRoute>
              ) : (
                <Navigate to="/landing" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;