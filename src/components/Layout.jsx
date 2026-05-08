import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';
import api from '../api/client';
import { useEffect } from 'react';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col md:flex-row w-full">
      {/* Mobile Header */}
      <div className="md:hidden bg-white px-4 py-3 border-b border-primary/10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={logo || logoImg} alt="Logo" className="w-10 h-10 object-contain" />
          <h1 className="font-cursive text-xl text-primary">Tiệm Ốc Admin</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-primary"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
