import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/client';
import { 
  LayoutDashboard, 
  Utensils, 
  FolderTree, 
  PlusCircle, 
  Database,
  TrendingUp,
  MousePointerClick,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/analytics/stats?days=30');
      if (res.success) setStats(res.data.totals);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const mainStats = [
    { label: 'Tổng món ăn', value: '12', icon: Utensils, color: 'bg-blue-500' },
    { label: 'Danh mục', value: '6', icon: FolderTree, color: 'bg-green-500' },
    { label: 'Lượt click Menu', value: stats?.click_banner_menu || 0, icon: MousePointerClick, color: 'bg-purple-500' },
  ];

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif">
            Chào mừng, {admin?.name || 'Admin'} 👋
          </h2>
          <p className="text-gray-500">Dưới đây là chỉ số hoạt động trong 30 ngày qua</p>
        </div>
        <div className="bg-green-50 text-green-600 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-sm">
          <TrendingUp size={18} />
          <span>+12.5% so với tháng trước</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
        {mainStats.map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5 flex items-center gap-4"
          >
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shrink-0`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Section */}
        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-primary/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
              <TrendingUp className="text-secondary" />
              <span>Tỉ lệ chuyển đổi</span>
            </h3>
            <button 
              onClick={() => navigate('/analytics')}
              className="text-xs font-bold text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-full"
            >
              Xem chi tiết
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-600">Click nút Menu (Banner)</span>
                <span className="text-primary">{stats?.click_banner_menu || 0} lần</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min((stats?.click_banner_menu || 0) / 500 * 100, 100)}%` }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-600">Click đặt bàn / Hotline</span>
                <span className="text-primary">{stats?.click_hotline || 0} lần</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min((stats?.click_hotline || 0) / 100 * 100, 100)}%` }}
                  className="bg-secondary h-full rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-600">Click xem Buffet</span>
                <span className="text-primary">{stats?.click_buffet || 0} lần</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min((stats?.click_buffet || 0) / 200 * 100, 100)}%` }}
                  className="bg-green-500 h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-primary/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
            <Database className="text-blue-500" />
            <span>Trạng thái Hệ thống</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Database</span>
              <span className="flex items-center gap-1.5 text-green-500 font-bold">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Kết nối tốt
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Tracking API</span>
              <span className="text-sm font-bold text-blue-600">Đang hoạt động</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-500 font-medium">Lưu trữ Analytics</span>
              <span className="text-sm text-gray-400">Mongodb Collection</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
