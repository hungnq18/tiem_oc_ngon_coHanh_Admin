import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointer2, 
  Calendar, 
  Loader2, 
  ArrowLeft,
  Search,
  Clock,
  History,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchDetailedStats();
  }, [days]);

  const fetchDetailedStats = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/analytics/stats?days=${days}`);
      if (res.success) setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getEventName = (event) => {
    switch (event) {
      case 'click_banner_menu': return 'Menu (Banner)';
      case 'click_hotline': return 'Đặt bàn / Hotline';
      case 'click_buffet': return 'Xem Buffet';
      default: return event;
    }
  };

  const getEventColor = (event) => {
    switch (event) {
      case 'click_banner_menu': return 'bg-purple-500';
      case 'click_hotline': return 'bg-secondary';
      case 'click_buffet': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading && !data) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-primary mb-4 transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </button>
          <h2 className="text-3xl font-bold text-primary font-serif">Phân tích Chi tiết</h2>
          <p className="text-gray-500">Theo dõi hành vi người dùng và hiệu quả chuyển đổi</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-primary/5">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${days === d ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {d} Ngày
            </button>
          ))}
        </div>
      </header>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {['click_banner_menu', 'click_hotline', 'click_buffet'].map(evt => (
          <div key={evt} className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${getEventColor(evt)} opacity-5 -mr-8 -mt-8 rounded-full transition-all group-hover:scale-150`} />
            <div className="flex flex-col gap-4">
               <div className={`w-12 h-12 ${getEventColor(evt)} rounded-2xl flex items-center justify-center text-white`}>
                  <MousePointer2 size={24} />
               </div>
               <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{getEventName(evt)}</p>
                  <h3 className="text-4xl font-bold text-primary tracking-tight">
                    {data?.totals[evt] || 0}
                    <span className="text-sm font-normal text-gray-400 ml-2">lượt</span>
                  </h3>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events List */}
        <section className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2 font-serif">
                <History className="text-secondary" />
                <span>Hoạt động gần đây</span>
              </h3>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                Real-time
              </span>
           </div>

           <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Thời gian</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Hành động</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Nguồn/Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data?.recent.length === 0 ? (
                      <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400">Chưa có dữ liệu</td></tr>
                    ) : (
                      data?.recent.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={14} className="text-gray-400" />
                              {new Date(log.timestamp).toLocaleString('vi-VN', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getEventColor(log.event)}`} />
                                <span className="text-sm font-bold text-primary">{getEventName(log.event)}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {log.metadata ? (
                                Object.entries(log.metadata).map(([k, v]) => (
                                  <span key={k} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-blue-100 uppercase">
                                    {k}: {v}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-300 text-xs italic">Không có</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        </section>

        {/* Breakdown Widget */}
        <section className="space-y-6">
           <div className="px-2">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2 font-serif">
                <Tag className="text-primary" />
                <span>Phân bổ Click</span>
              </h3>
           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-8">
              {['click_banner_menu', 'click_hotline', 'click_buffet'].map(evt => {
                const total = Object.values(data?.totals || {}).reduce((a, b) => a + b, 0) || 1;
                const percent = Math.round(((data?.totals[evt] || 0) / total) * 100);
                
                return (
                  <div key={evt} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-gray-600">{getEventName(evt)}</span>
                      <span className="text-lg font-bold text-primary">{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className={`h-full rounded-full ${getEventColor(evt)}`}
                       />
                    </div>
                  </div>
                );
              })}

              <div className="pt-6 border-t border-gray-100 mt-6">
                 <div className="bg-[#7B150C]/5 p-6 rounded-2xl border border-[#7B150C]/10">
                    <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                      <TrendingUp size={16} />
                      Gợi ý tối ưu
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed italic">
                      Lượt click vào Menu cao cho thấy khách hàng quan tâm đến thực đơn. Nên cập nhật hình ảnh món ăn thường xuyên để tăng tỉ lệ chuyển đổi.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;
