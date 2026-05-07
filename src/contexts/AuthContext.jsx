import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState({ id: 'demo', username: 'Demo Admin', email: 'admin@tiemoc.com' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Commented out real auth check for demo
    /*
    const fetchMe = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const res = await api.get('/admin/auth/me');
          if (res.success) {
            setAdmin(res.admin);
          }
        } catch (err) {
          console.error('Failed to fetch admin profile:', err);
          localStorage.removeItem('admin_token');
        }
      }
      setLoading(false);
    };

    fetchMe();
    */
  }, []);

  const login = async (email, password) => {
    // Mock login for demo
    setAdmin({ id: 'demo', username: 'Demo Admin', email: email || 'admin@tiemoc.com' });
    return { success: true, admin: { id: 'demo' }, token: 'demo-token' };
    /*
    const res = await api.post('/admin/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('admin_token', res.token);
      setAdmin(res.admin);
    }
    return res;
    */
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
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
