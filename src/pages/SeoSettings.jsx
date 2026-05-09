import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Save, Loader2, Search, Share2, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import MediaUpload from '../components/MediaUpload';
import { useModal } from '../contexts/ModalContext';

const SeoSettings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showAlert } = useModal();
  const [seo, setSeo] = useState({
    title: '',
    description: '',
    keywords: '',
    ogImage: { url: '', publicId: '' }
  });
  const [shopName, setShopName] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await api.get('/public/shop-config');
      if (res.success) {
        // Hỗ trợ cả string (legacy) và object image cho ogImage
        const rawSeo = res.data.seo || {};
        const ogImageData = typeof rawSeo.ogImage === 'string' 
          ? { url: rawSeo.ogImage, publicId: '' }
          : (rawSeo.ogImage || { url: '', publicId: '' });

        setSeo({
          ...rawSeo,
          ogImage: ogImageData
        });
        setShopName(res.data.shopName);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/admin/shop-config', { seo });
      showAlert('Thành công', 'Cập nhật cấu hình SEO thành công!', 'success');
    } catch (err) { 
      showAlert('Lỗi', err.message, 'error'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-primary font-serif">Cấu hình SEO</h2>
          <p className="text-gray-500">Tối ưu hóa tìm kiếm trên Google và mạng xã hội</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={submitting}
          className="btn-primary flex items-center gap-2 shadow-xl"
        >
          {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>Lưu SEO</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Google Preview */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Search size={16} />
            <span>Google Preview</span>
          </h3>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate mb-1">
              {seo.title || shopName || 'Tiêu đề trang'}
            </div>
            <div className="text-[#006621] text-sm mb-1 truncate">
              https://tiemoccohanh.vn/
            </div>
            <div className="text-[#4d5156] text-sm line-clamp-2">
              {seo.description || 'Mô tả trang web sẽ hiển thị ở đây để thu hút khách hàng từ kết quả tìm kiếm Google...'}
            </div>
          </div>
        </section>

        {/* SEO Meta Tags */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Globe size={20} />
            </div>
            <h3 className="text-xl font-bold text-primary">Thẻ Meta Cơ bản</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-primary">SEO Title</label>
                <span className={`text-xs ${seo.title.length > 60 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {seo.title.length}/60 ký tự
                </span>
              </div>
              <input 
                type="text" className="input" 
                placeholder="VD: Tiệm Ốc Cô Hạnh | Ốc Ngon Đông Ngạc Hà Nội"
                value={seo.title} 
                onChange={(e) => setSeo({...seo, title: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-primary">SEO Description</label>
                <span className={`text-xs ${seo.description.length > 160 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {seo.description.length}/160 ký tự
                </span>
              </div>
              <textarea 
                className="input min-h-[100px]" 
                placeholder="Mô tả ngắn gọn về quán, dịch vụ và món ăn để thu hút người dùng..."
                value={seo.description}
                onChange={(e) => setSeo({...seo, description: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Từ khóa (Keywords)</label>
              <input 
                type="text" className="input" 
                placeholder="quán ốc ngon, tiệm ốc cô hạnh, ốc đông ngạc..."
                value={seo.keywords}
                onChange={(e) => setSeo({...seo, keywords: e.target.value})}
              />
            </div>
          </div>
        </section>

        {/* Social Sharing */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-primary">
              <Share2 size={20} />
            </div>
            <h3 className="text-xl font-bold text-primary">Chia sẻ Mạng xã hội (OG Tags)</h3>
          </div>

          <MediaUpload 
            label="Ảnh khi chia sẻ (OG Image)"
            value={seo.ogImage}
            onChange={(imgData) => setSeo({ ...seo, ogImage: imgData })}
          />
        </section>
      </div>
    </div>
  );
};

export default SeoSettings;
