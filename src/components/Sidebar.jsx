import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Utensils, 
  FolderTree, 
  PlusCircle, 
  Settings, 
  LogOut,
  ExternalLink,
  Globe,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';
import api from '../api/client';
import { useEffect, useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await api.get('/public/shop-config');
        if (res.success && res.data.logo?.url) {
          setLogo(res.data.logo.url);
        }
      } catch (err) {
        console.error('Error fetching logo:', err);
      }
    };
    fetchLogo();
  }, []);

  const menuItems = [
    { label: 'Tổng quan', icon: LayoutDashboard, path: '/' },
    { label: 'Quản lý Menu', icon: Utensils, path: '/menu' },
    { label: 'Danh mục', icon: FolderTree, path: '/categories' },
    { label: 'Buffet', icon: PlusCircle, path: '/buffet' },
    { label: 'Cấu hình SEO', icon: Globe, path: '/seo' },
    { label: 'Góp ý', icon: MessageSquare, path: '/feedback' },
    { label: 'Phân tích', icon: BarChart3, path: '/analytics' },
    { label: 'Cài đặt Shop', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-primary/5 z-40
          flex flex-col overflow-hidden
          ${isOpen ? 'block' : 'hidden md:block'}
        `}
      >
        {/* Logo Section */}
        <div className="p-8 hidden md:flex flex-col items-center border-b border-primary/5 flex-shrink-0">
          <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center overflow-hidden mb-4 p-2">
            <img src={logo || logoImg} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-center">
            <h1 className="font-cursive text-2xl text-primary leading-tight">Tiệm Ốc</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Hệ quản trị</p>
          </div>
        </div>

        {/* Navigation Section - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-primary">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all
                ${isActive 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-gray-500 hover:bg-primary/5 hover:text-primary'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions Section */}
        <div className="p-4 border-t border-primary/5 space-y-2 flex-shrink-0 pb-8">
          <a 
            href="http://localhost:5173" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-3 text-primary font-bold hover:bg-primary/5 p-3 rounded-xl transition-all text-sm"
          >
            <ExternalLink size={18} />
            <span>Xem website</span>
          </a>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 text-red-500 font-bold hover:bg-red-50 p-3 rounded-xl transition-all text-sm"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
