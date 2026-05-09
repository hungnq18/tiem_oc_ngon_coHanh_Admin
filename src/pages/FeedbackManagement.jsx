import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  MessageSquare, Trash2, Loader2, CheckCircle, 
  Clock, User, Phone, ChevronLeft, ChevronRight, Mail,
  Search, Filter, Inbox, CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../contexts/ModalContext';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const { showAlert, showConfirm } = useModal();

  useEffect(() => {
    fetchFeedback(pagination.page);
  }, [pagination.page, status]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedback(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchFeedback = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/admin/feedback?page=${page}&limit=10`;
      if (status !== 'all') url += `&status=${status}`;
      if (search) url += `&search=${search}`;
      
      const res = await api.get(url);
      if (res.success) {
        setFeedbacks(res.data.items);
        setPagination(res.data.pagination);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markAllRead = async () => {
    showConfirm(
      'Xác nhận',
      'Đánh dấu tất cả góp ý là đã đọc?',
      async () => {
        try {
          const res = await api.put('/admin/feedback/read-all');
          if (res.success) {
            setFeedbacks(feedbacks.map(f => ({ ...f, isRead: true })));
            showAlert('Thành công', 'Đã đánh dấu tất cả là đã đọc', 'success');
          }
        } catch (err) { showAlert('Lỗi', err.message || 'Có lỗi xảy ra', 'error'); }
      }
    );
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/admin/feedback/${id}/read`);
      setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, isRead: true } : f));
    } catch (err) { showAlert('Lỗi', err.message || 'Có lỗi xảy ra', 'error'); }
  };

  const handleDelete = async (id) => {
    showConfirm(
      'Xác nhận xóa',
      'Xóa góp ý này?',
      async () => {
        try {
          await api.delete(`/admin/feedback/${id}`);
          fetchFeedback(pagination.page);
          showAlert('Thành công', 'Đã xóa góp ý', 'success');
        } catch (err) { showAlert('Lỗi', err.message || 'Có lỗi xảy ra', 'error'); }
      }
    );
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-primary font-serif">Góp ý khách hàng</h2>
          <p className="text-gray-500">Xem các phản hồi và ý kiến đóng góp từ website</p>
        </div>
        
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-primary/5 flex items-center gap-3">
          <Inbox size={20} className="text-secondary" />
          <span className="font-bold text-primary">{pagination.total}</span>
          <span className="text-gray-400 text-sm">phản hồi</span>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm theo tên, SĐT hoặc nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-primary/5 shadow-sm outline-none focus:ring-2 ring-primary/10 transition-all font-serif"
          />
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-primary/5">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'unread', label: 'Chưa đọc' },
            { id: 'read', label: 'Đã đọc' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                status === s.id ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {feedbacks.some(f => !f.isRead) && (
          <button
            onClick={markAllRead}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-green-600 rounded-2xl border border-green-100 shadow-sm font-bold text-sm hover:bg-green-50 transition-all"
          >
            <CheckSquare size={18} />
            <span>Đọc tất cả</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border border-primary/5 shadow-sm">
           <Filter className="mx-auto text-gray-200 mb-4" size={64} />
           <p className="text-gray-400 font-medium font-serif text-xl">Không tìm thấy góp ý nào phù hợp</p>
           {(search || status !== 'all') && (
             <button 
              onClick={() => { setSearch(''); setStatus('all'); }}
              className="mt-4 text-primary font-bold hover:underline"
             >
              Xóa bộ lọc
             </button>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {feedbacks.map((f) => (
              <motion.div 
                key={f._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-6 rounded-3xl shadow-sm border transition-all ${
                  f.isRead ? 'bg-white border-primary/5' : 'bg-primary/5 border-primary/20 ring-1 ring-primary/10'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <User size={18} className="text-secondary" />
                        <span>{f.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <Phone size={16} />
                        <span>{f.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm italic">
                        <Clock size={16} />
                        <span>{new Date(f.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                      {!f.isRead && (
                        <span className="bg-primary text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">Mới</span>
                      )}
                    </div>
                    
                    <div className="bg-white/50 p-4 rounded-2xl border border-primary/5 text-gray-700 leading-relaxed italic">
                      "{f.message}"
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end gap-2 shrink-0">
                    {!f.isRead && (
                      <button 
                        onClick={() => markAsRead(f._id)}
                        className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle size={18} />
                        <span className="hidden md:inline">Đã đọc</span>
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(f._id)}
                      className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                      <span className="hidden md:inline">Xóa</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 pt-8">
            <button 
              disabled={pagination.page <= 1}
              onClick={() => setPagination({...pagination, page: pagination.page - 1})}
              className="p-3 rounded-2xl bg-white border border-primary/5 shadow-sm disabled:opacity-30 hover:bg-primary/5 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-primary">Trang {pagination.page} / {pagination.totalPages}</span>
            <button 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination({...pagination, page: pagination.page + 1})}
              className="p-3 rounded-2xl bg-white border border-primary/5 shadow-sm disabled:opacity-30 hover:bg-primary/5 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;
