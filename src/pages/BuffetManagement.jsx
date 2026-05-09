import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Save, Loader2, Plus, Trash2, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import MediaUpload from '../components/MediaUpload';
import { useModal } from '../contexts/ModalContext';

const BuffetManagement = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showAlert } = useModal();
  const [buffet, setBuffet] = useState({
    title: '',
    subtitle: '',
    description: '',
    timeStart: '',
    timeEnd: '',
    items: [],
    isActive: true
  });

  useEffect(() => {
    fetchBuffet();
  }, []);

  const fetchBuffet = async () => {
    try {
      const res = await api.get('/public/buffet');
      if (res.success) setBuffet(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/admin/buffet', buffet);
      await fetchBuffet();
      showAlert('Thành công', 'Cập nhật buffet thành công!', 'success');
    } catch (err) { 
      showAlert('Lỗi', err.message, 'error'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const addItem = () => {
    setBuffet({
      ...buffet,
      items: [...buffet.items, { name: '', image: { url: '', publicId: '' }, position: 'main' }]
    });
  };

  const removeItem = (idx) => {
    const newItems = buffet.items.filter((_, i) => i !== idx);
    setBuffet({ ...buffet, items: newItems });
  };

  const updateItemData = (idx, field, value) => {
    const newItems = [...buffet.items];
    newItems[idx][field] = value;
    setBuffet({ ...buffet, items: newItems });
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-primary font-serif">Quản lý Buffet</h2>
          <p className="text-gray-500">Thông tin chương trình Buffet tráng miệng</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={submitting}
          className="btn-primary flex items-center gap-2 shadow-xl"
        >
          {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>Lưu thay đổi</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 pb-20">
        {/* Basic Info */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-6">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <Info className="text-secondary" />
            <span>Nội dung hiển thị</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Tiêu đề chính</label>
              <input 
                type="text" className="input" value={buffet.title} 
                onChange={(e) => setBuffet({...buffet, title: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Tiêu đề phụ (Badge)</label>
              <input 
                type="text" className="input" value={buffet.subtitle}
                onChange={(e) => setBuffet({...buffet, subtitle: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-primary">Mô tả chương trình</label>
            <textarea 
              className="input min-h-[100px]" value={buffet.description}
              onChange={(e) => setBuffet({...buffet, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 text-sm font-bold text-primary">
              <label className="flex items-center gap-2 mb-1"><Clock size={16}/> Bắt đầu</label>
              <input 
                type="time" className="input" value={buffet.timeStart}
                onChange={(e) => setBuffet({...buffet, timeStart: e.target.value})}
              />
            </div>
            <div className="space-y-1 text-sm font-bold text-primary">
              <label className="flex items-center gap-2 mb-1"><Clock size={16}/> Kết thúc</label>
              <input 
                type="time" className="input" value={buffet.timeEnd}
                onChange={(e) => setBuffet({...buffet, timeEnd: e.target.value})}
              />
            </div>
          </div>
        </section>

        {/* Buffet Items */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-primary">Danh sách món Buffet</h3>
            <button onClick={addItem} className="text-primary font-bold flex items-center gap-1 hover:underline">
              <Plus size={20} />
              <span>Thêm món</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buffet.items.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-4 relative"
              >
                <button 
                  onClick={() => removeItem(idx)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                >
                  <Trash2 size={18} />
                </button>

                <MediaUpload 
                  value={item.image}
                  onChange={(imgData) => updateItemData(idx, 'image', imgData)}
                />

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary">Vị trí hiển thị</label>
                    <select 
                      className="input bg-white"
                      value={item.position || 'main'}
                      onChange={(e) => updateItemData(idx, 'position', e.target.value)}
                    >
                      <option value="main">Chính giữa (Lớn nhất)</option>
                      <option value="left">Phía bên trái</option>
                      <option value="right">Phía bên phải</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary">Tên món tráng miệng</label>
                    <input 
                      type="text" className="input bg-white" 
                      placeholder="VD: Chè khúc bạch"
                      value={item.name}
                      onChange={(e) => updateItemData(idx, 'name', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BuffetManagement;
