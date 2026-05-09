import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import BuffetManagement from './pages/BuffetManagement';
import CategoryManagement from './pages/CategoryManagement';
import DashboardPage from './pages/DashboardPage';
import FeedbackManagement from './pages/FeedbackManagement';
import LoginPage from './pages/LoginPage';
import MenuManagement from './pages/MenuManagement';
import SeoSettings from './pages/SeoSettings';
import ShopSettings from './pages/ShopSettings';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
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
                      <Route path="/analytics" element={<AnalyticsPage />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
