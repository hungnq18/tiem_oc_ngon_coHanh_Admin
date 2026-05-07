import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState({ id: 'demo', username: 'Demo Admin', email: 'admin@tiemoc.com', name: 'Demo Admin' });
  const [loading, setLoading] = useState(false);

  // Không cần useEffect để tránh lỗi trên Vercel
  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setAdmin({ id: 'demo', username: 'Demo Admin', email: email || 'admin@tiemoc.com', name: 'Demo Admin' });
    return { success: true, admin: { id: 'demo' }, token: 'demo-token' };
  };

  const logout = () => {
    setAdmin(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
