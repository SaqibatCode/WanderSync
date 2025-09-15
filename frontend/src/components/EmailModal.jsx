// frontend/src/components/EmailModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const EmailModal = ({ onClose, onSend }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);
    await onSend(email);
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-md transform animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaEnvelope className="text-purple-600" />
            Email Itinerary
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Enter the email address to send this amazing trip plan to:
        </p>
        
        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl border-2 border-purple-100 focus:border-purple-400 focus:outline-none transition-all duration-300"
          />
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;