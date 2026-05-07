import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col md:flex-row w-full">
      {/* Mobile Header */}
      <div className="md:hidden bg-white px-4 py-4 border-b border-primary/10 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-cursive text-2xl text-primary">Tiệm Ốc Admin</h1>
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
