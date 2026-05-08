import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F1]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
