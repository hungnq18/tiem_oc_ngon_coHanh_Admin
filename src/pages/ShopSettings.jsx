import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  Save, Loader2, Store, Phone, MapPin, Globe, User, 
  MousePointer2, Plus, Trash2, MessageSquare, 
  Send, Music, Map, Star, Share2, List
} from 'lucide-react';
import MediaUpload from '../components/MediaUpload';
import { motion, AnimatePresence } from 'framer-motion';

const FacebookIcon = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.42-1.58 2.39-.16.88-.05 1.8.35 2.6.58 1.08 1.64 1.87 2.85 2.09.86.17 1.76.09 2.55-.31.94-.51 1.62-1.41 1.84-2.45.1-.47.11-.96.11-1.44V.02z" />
  </svg>
);

const MessengerIcon = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.112.308 2.29.475 3.503.475 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.293 14.393l-3.074-3.279-5.996 3.279 6.596-7.001 3.149 3.279 5.921-3.279-6.596 7.001z" />
  </svg>
);

const AVAILABLE_ICONS = {
  Phone: Phone,
  Message: MessageSquare,
  Messenger: MessengerIcon,
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  Send: Send,
  Music: Music,
  Map: Map,
  Star: Star,
  Globe: Globe,
  Share: Share2
};

const PREDEFINED_LINKS = [
  { label: 'Trang chủ', value: '/' },
  { label: 'Thực đơn (Trang riêng)', value: '/menu' },
  { label: 'Vùng Khuyến mãi (Buffet)', value: '#buffet-section' },
  { label: 'Vùng Món ăn đặc sắc', value: '#signature-dishes' },
  { label: 'Vùng Về chúng tôi', value: '#founder' },
  { label: 'Vùng Góp ý & Phản hồi', value: '#newsletter' },
  { label: 'Tùy chỉnh...', value: 'custom' },
];

const ShopSettings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [config, setConfig] = useState({
    shopName: '',
    logo: { url: '', publicId: '' },
    tagline: '',
    address: '',
    phone: '',
    email: '',
    openTime: '',
    closeTime: '',
    socialLinks: { facebook: '', tiktok: '', instagram: '' },
    founder: { name: '', bio: '', image: { url: '', publicId: '' } },
    cta: [],
    footerAboutLinks: [],
    footerSocialLinks: [],
    footerCopyright: ''
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

  const addFooterAboutLink = () => {
    const newLinks = [...(config.footerAboutLinks || []), { label: 'Link mới', link: '#' }];
    setConfig({ ...config, footerAboutLinks: newLinks });
  };

  const removeFooterAboutLink = (idx) => {
    const newLinks = config.footerAboutLinks.filter((_, i) => i !== idx);
    setConfig({ ...config, footerAboutLinks: newLinks });
  };

  const updateFooterAboutLink = (idx, field, value) => {
    const newLinks = [...config.footerAboutLinks];
    newLinks[idx][field] = value;
    setConfig({ ...config, footerAboutLinks: newLinks });
  };

  const addFooterSocialLink = () => {
    const newLinks = [...(config.footerSocialLinks || []), { label: 'Mạng xã hội mới', link: '#' }];
    setConfig({ ...config, footerSocialLinks: newLinks });
  };

  const removeFooterSocialLink = (idx) => {
    const newLinks = config.footerSocialLinks.filter((_, i) => i !== idx);
    setConfig({ ...config, footerSocialLinks: newLinks });
  };

  const updateFooterSocialLink = (idx, field, value) => {
    const newLinks = [...config.footerSocialLinks];
    newLinks[idx][field] = value;
    setConfig({ ...config, footerSocialLinks: newLinks });
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
              <div className="space-y-1">
                <MediaUpload 
                  label="Logo cửa hàng"
                  value={config.logo}
                  onChange={(imgData) => setConfig({ ...config, logo: imgData })}
                />
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
                        <div className="flex gap-2">
                          <select className="input bg-white text-sm flex-1" value={item.icon} onChange={(e) => updateCta(idx, 'icon', e.target.value)}>
                            {Object.keys(AVAILABLE_ICONS).map(iconName => (
                              <option key={iconName} value={iconName}>{iconName}</option>
                            ))}
                            <option value="custom">Tải ảnh riêng...</option>
                          </select>
                          <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white rounded-xl border border-primary/10 text-primary overflow-hidden">
                            {item.icon === 'custom' && item.iconImage?.url ? (
                              <img src={item.iconImage.url} alt="icon" className="w-full h-full object-cover" />
                            ) : (
                              AVAILABLE_ICONS[item.icon] ? React.createElement(AVAILABLE_ICONS[item.icon], { size: 20 }) : <MousePointer2 size={20} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {item.icon === 'custom' && (
                      <div className="pt-2 border-t border-primary/5">
                        <MediaUpload 
                          label="Tải ảnh biểu tượng riêng"
                          value={item.iconImage}
                          onChange={(img) => updateCta(idx, 'iconImage', img)}
                        />
                      </div>
                    )}

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

          {/* Footer Management */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-8">
            {/* About Links */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <List className="text-green-500" size={24} />
                  <span>Liên kết Footer (Cột About)</span>
                </h3>
                <button onClick={addFooterAboutLink} className="text-primary font-bold flex items-center gap-1 hover:underline text-sm">
                  <Plus size={18} />
                  <span>Thêm link</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {(config.footerAboutLinks || []).map((item, idx) => {
                  const isPredefined = PREDEFINED_LINKS.some(p => p.value === item.link);
                  return (
                    <div key={idx} className="flex gap-2 items-start p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-primary uppercase">Tên hiển thị</label>
                          <input 
                            type="text" 
                            className="input bg-white text-sm" 
                            value={item.label} 
                            onChange={(e) => updateFooterAboutLink(idx, 'label', e.target.value)} 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-primary uppercase">Đích đến (Link)</label>
                          <div className="flex gap-2">
                            <select 
                              className="input bg-white text-sm flex-1"
                              value={isPredefined ? item.link : 'custom'}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val !== 'custom') updateFooterAboutLink(idx, 'link', val);
                              }}
                            >
                              {PREDEFINED_LINKS.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                              ))}
                            </select>
                            {!isPredefined && (
                              <div className="flex-[1.5] space-y-1">
                                <input 
                                  type="text" 
                                  placeholder="Nhập link tay..."
                                  className="input bg-white text-sm w-full" 
                                  value={item.link} 
                                  onChange={(e) => updateFooterAboutLink(idx, 'link', e.target.value)} 
                                />
                                <p className="text-[10px] text-gray-400 leading-tight">
                                  Dùng # để cuộn trang (VD: #menu), hoặc dán link đầy đủ (https://...)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeFooterAboutLink(idx)} className="text-red-500 hover:bg-red-50 p-2 mt-6 rounded-full">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6 pt-8 border-t border-primary/5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Share2 className="text-blue-500" size={24} />
                  <span>Mạng xã hội (Cột Social)</span>
                </h3>
                <button onClick={addFooterSocialLink} className="text-primary font-bold flex items-center gap-1 hover:underline text-sm">
                  <Plus size={18} />
                  <span>Thêm link</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {(config.footerSocialLinks || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="Nhãn (Facebook, TikTok...)" 
                      className="input text-sm flex-1" 
                      value={item.label} 
                      onChange={(e) => updateFooterSocialLink(idx, 'label', e.target.value)} 
                    />
                    <input 
                      type="text" 
                      placeholder="Link (https://...)" 
                      className="input text-sm flex-[1.5]" 
                      value={item.link} 
                      onChange={(e) => updateFooterSocialLink(idx, 'link', e.target.value)} 
                    />
                    <button onClick={() => removeFooterSocialLink(idx)} className="text-red-500 hover:bg-red-50 p-3 rounded-xl">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-primary/5 space-y-2">
              <label className="text-sm font-bold text-primary">Bản quyền (Copyright)</label>
              <input 
                type="text" 
                className="input" 
                placeholder="© 2026 TIỆM ỐC CÔ HẠNH..." 
                value={config.footerCopyright} 
                onChange={(e) => setConfig({ ...config, footerCopyright: e.target.value })} 
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShopSettings;
