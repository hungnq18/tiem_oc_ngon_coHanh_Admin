import React, { lazy, Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';

// Lazy loading để tối ưu dung lượng JS bundle ban đầu
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MenuManagement = lazy(() => import('./pages/MenuManagement'));
const CategoryManagement = lazy(() => import('./pages/CategoryManagement'));
const BuffetManagement = lazy(() => import('./pages/BuffetManagement'));
const ShopSettings = lazy(() => import('./pages/ShopSettings'));
const SeoSettings = lazy(() => import('./pages/SeoSettings'));
const FeedbackManagement = lazy(() => import('./pages/FeedbackManagement'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Loading component gọn nhẹ
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#FFF9F1]">
    <img 
      src="https://res.cloudinary.com/dijayprrw/image/upload/v1778577508/tiemoc_assets_static/logo.png" 
      alt="Loading..."
      style={{
        width: 150,
        height: 'auto',
        animation: 'pulse-logo 2s infinite ease-in-out',
      }}
    />
    <style>{`
      @keyframes pulse-logo {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<DashboardPage />} />
                          <Route path="/menu" element={<MenuManagement />} />
                          <Route path="/categories" element={<CategoryManagement />} />
                          <Route path="/buffet" element={<BuffetManagement />} />
                          <Route path="/settings" element={<ShopSettings />} />
                          <Route path="/seo" element={<SeoSettings />} />
                          <Route path="/feedback" element={<FeedbackManagement />} />
                          <Route path="/analytics" element={<AnalyticsPage />} />
                        </Routes>
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
