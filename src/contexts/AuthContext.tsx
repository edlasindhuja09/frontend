// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userType: string | null;
  login: (token: string, userType: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Initialize state from localStorage
    const token = localStorage.getItem('userToken');
    const type = localStorage.getItem('userType');
    setIsLoggedIn(!!token);
    setUserType(type);
  }, []);

  const login = (token: string, type: string) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userType', type);
    setIsLoggedIn(true);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};