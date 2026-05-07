import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  Save, Loader2, Store, Phone, MapPin, Globe, User, 
  MousePointer2, Plus, Trash2, MessageSquare, 
  Send, Music, Map, Star, Share2
} from 'lucide-react';
import MediaUpload from '../components/MediaUpload';
import { motion, AnimatePresence } from 'framer-motion';

const AVAILABLE_ICONS = {
  Phone: Phone,
  Message: MessageSquare,
  Send: Send,
  Music: Music,
  Map: Map,
  Star: Star,
  Globe: Globe,
  Share: Share2
};

const ShopSettings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [config, setConfig] = useState({
    shopName: '',
    tagline: '',
    address: '',
    phone: '',
    email: '',
    openTime: '',
    closeTime: '',
    socialLinks: { facebook: '', tiktok: '', instagram: '' },
    founder: { name: '', bio: '', image: { url: '', publicId: '' } },
    cta: []
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await api.get('/public/shop-config');
      if (res.success) {
        const data = res.data;
        if (!data.cta || !Array.isArray(data.cta)) data.cta = [];
        setConfig(data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/admin/shop-config', config);
      alert('Cập nhật cấu hình thành công!');
    } catch (err) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  const addCta = () => {
    const newCta = [...config.cta, { label: 'Nút mới', link: '', icon: 'Phone', color: 'primary' }];
    setConfig({ ...config, cta: newCta });
  };

  const removeCta = (idx) => {
    const newCta = config.cta.filter((_, i) => i !== idx);
    setConfig({ ...config, cta: newCta });
  };

  const updateCta = (idx, field, value) => {
    const newCta = [...config.cta];
    newCta[idx][field] = value;
    setConfig({ ...config, cta: newCta });
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-primary font-serif">Cài đặt Cửa hàng</h2>
          <p className="text-gray-500">Thông tin cơ bản và các nút chức năng trên website</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={submitting}
          className="btn-primary flex items-center gap-2 shadow-xl"
        >
          {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>Lưu cài đặt</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* General & Contact */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-6">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <Store className="text-secondary" size={24} />
              <span>Thông tin cửa hàng</span>
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-primary">Tên cửa hàng</label>
                <input type="text" className="input" value={config.shopName} onChange={(e) => setConfig({...config, shopName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-primary">Giờ mở</label>
                  <input type="time" className="input" value={config.openTime} onChange={(e) => setConfig({...config, openTime: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-primary">Giờ đóng</label>
                  <input type="time" className="input" value={config.closeTime} onChange={(e) => setConfig({...config, closeTime: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-primary">Số điện thoại</label>
                <input type="text" className="input" value={config.phone} onChange={(e) => setConfig({...config, phone: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-primary">Địa chỉ</label>
                <input type="text" className="input" value={config.address} onChange={(e) => setConfig({...config, address: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Dynamic Buttons (CTA) */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <MousePointer2 className="text-primary" size={24} />
                <span>Nút & Liên kết (CTA)</span>
              </h3>
              <button onClick={addCta} className="text-primary font-bold flex items-center gap-1 hover:underline text-sm">
                <Plus size={18} />
                <span>Thêm nút</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {config.cta.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-6 bg-primary/5 rounded-3xl border border-primary/10 relative space-y-4"
                  >
                    <button onClick={() => removeCta(idx)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-full">
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-primary uppercase">Nhãn nút</label>
                        <input type="text" className="input bg-white text-sm" value={item.label} onChange={(e) => updateCta(idx, 'label', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-primary uppercase">Icon</label>
                        <select className="input bg-white text-sm" value={item.icon} onChange={(e) => updateCta(idx, 'icon', e.target.value)}>
                          {Object.keys(AVAILABLE_ICONS).map(iconName => (
                            <option key={iconName} value={iconName}>{iconName}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary uppercase">Liên kết (Link)</label>
                      <input type="text" className="input bg-white text-sm" placeholder="tel:033... hoặc link zalo" value={item.link} onChange={(e) => updateCta(idx, 'link', e.target.value)} />
                    </div>

                    <div className="flex items-center gap-4">
                       <label className="text-[10px] font-bold text-primary uppercase shrink-0">Màu sắc:</label>
                       <div className="flex gap-2">
                          {['primary', 'secondary', 'green', 'blue'].map(color => (
                            <button 
                              key={color}
                              type="button"
                              onClick={() => updateCta(idx, 'color', color)}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${item.color === color ? 'border-primary scale-110' : 'border-transparent'}
                                ${color === 'primary' ? 'bg-[#7B150C]' : color === 'secondary' ? 'bg-[#F9C06A]' : color === 'green' ? 'bg-green-500' : 'bg-blue-500'}
                              `}
                            />
                          ))}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        <div className="space-y-8">
           {/* Founder Info */}
           <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-6">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <User className="text-orange-500" size={24} />
              <span>Người sáng lập</span>
            </h3>
            
            <div className="space-y-6">
              <MediaUpload 
                label="Ảnh đại diện Cô Hạnh"
                value={config.founder.image}
                onChange={(imgData) => setConfig({
                  ...config, 
                  founder: { ...config.founder, image: imgData }
                })}
              />
              <div className="space-y-1">
                <label className="text-sm font-bold text-primary">Tên</label>
                <input type="text" className="input" value={config.founder.name} onChange={(e) => setConfig({...config, founder: {...config.founder, name: e.target.value}})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-primary">Tiểu sử</label>
                <textarea className="input min-h-[120px]" value={config.founder.bio} onChange={(e) => setConfig({...config, founder: {...config.founder, bio: e.target.value}})} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShopSettings;
