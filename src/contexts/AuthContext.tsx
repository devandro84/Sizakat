import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  hasPin: boolean;
  login: (username: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const userPin = localStorage.getItem('userPin');
    setHasPin(!!userPin);
    
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(isLoggedIn);

    // Redirect based on auth state and PIN presence
    if (!isLoggedIn) {
      if (userPin) {
        navigate('/login-pin');
      } else {
        navigate('/login');
      }
    }
  };

  const login = (username: string) => {
    localStorage.setItem('username', username);
    sessionStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, hasPin, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};