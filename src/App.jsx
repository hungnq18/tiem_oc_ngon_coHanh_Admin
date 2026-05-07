import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MenuManagement from './pages/MenuManagement';
import CategoryManagement from './pages/CategoryManagement';
import BuffetManagement from './pages/BuffetManagement';
import ShopSettings from './pages/ShopSettings';
import SeoSettings from './pages/SeoSettings';
import FeedbackManagement from './pages/FeedbackManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/menu" element={<MenuManagement />} />
                    <Route path="/categories" element={<CategoryManagement />} />
                    <Route path="/buffet" element={<BuffetManagement />} />
                    <Route path="/settings" element={<ShopSettings />} />
                    <Route path="/seo" element={<SeoSettings />} />
                    <Route path="/feedback" element={<FeedbackManagement />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
