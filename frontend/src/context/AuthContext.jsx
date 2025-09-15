// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import the decoder

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // --- NEW: DECODE THE TOKEN TO GET USER INFO ---
      const decoded = jwtDecode(token);
      // The username is stored in the 'sub' (subject) field of our token
      setCurrentUser(decoded.sub);
    } else {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  // Provide the username to the whole app
  return (
    <AuthContext.Provider value={{ token, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};