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
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Tổng quan', icon: LayoutDashboard, path: '/' },
    { label: 'Quản lý Menu', icon: Utensils, path: '/menu' },
    { label: 'Danh mục', icon: FolderTree, path: '/categories' },
    { label: 'Buffet', icon: PlusCircle, path: '/buffet' },
    { label: 'Cấu hình SEO', icon: Globe, path: '/seo' },
    { label: 'Góp ý', icon: MessageSquare, path: '/feedback' },
    { label: 'Cài đặt Shop', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-primary/5 z-40
          ${isOpen ? 'block' : 'hidden md:block'}
        `}
      >
        <div className="p-8 hidden md:block">
          <h1 className="font-cursive text-3xl text-primary">Tiệm Ốc</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">Hệ quản trị</p>
        </div>

        <nav className="px-4 py-4 space-y-2">
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

        <div className="absolute bottom-8 left-0 w-full px-8 space-y-4">
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
      </motion.aside>

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
