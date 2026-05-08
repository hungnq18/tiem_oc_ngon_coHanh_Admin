import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/admin/auth/me');
        if (response.success) {
          setAdmin(response.admin);
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch (err) {
        localStorage.removeItem('admin_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/admin/auth/login', { email, password });
      if (response.success) {
        localStorage.setItem('admin_token', response.token);
        setAdmin(response.admin);
        return response;
      }
      throw new Error(response.message || 'Đăng nhập thất bại');
    } catch (err) {
      throw err;
    }
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
