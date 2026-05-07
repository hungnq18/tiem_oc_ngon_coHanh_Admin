import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import BuffetManagement from './pages/BuffetManagement';
import CategoryManagement from './pages/CategoryManagement';
import DashboardPage from './pages/DashboardPage';
import FeedbackManagement from './pages/FeedbackManagement';
import LoginPage from './pages/LoginPage';
import MenuManagement from './pages/MenuManagement';
import SeoSettings from './pages/SeoSettings';
import ShopSettings from './pages/ShopSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              // <ProtectedRoute>
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
              // </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
