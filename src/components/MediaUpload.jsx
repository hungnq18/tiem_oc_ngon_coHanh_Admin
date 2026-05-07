import React, { useState, useRef } from 'react';
import api from '../api/client';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

const MediaUpload = ({ value, onChange, label }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Vì client.js sử dụng axios và có interceptor, ta cần truyền đúng headers
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.success) {
        onChange(res.data); // Trả về { url, publicId }
      }
    } catch (err) {
      alert('Lỗi khi tải ảnh lên: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    onChange({ url: '', publicId: '' });
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-bold text-primary">{label}</label>}
      
      <div className="relative group">
        {value?.url ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-primary/10 shadow-inner bg-gray-50">
            <img src={value.url} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-video rounded-2xl border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all flex flex-col items-center justify-center gap-2 bg-primary/5 text-primary/60 group"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-primary" size={32} />
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Upload size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Tải ảnh lên</span>
              </>
            )}
          </button>
        )}
      </div>

      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <p className="text-[10px] text-gray-400 italic">
        * Khuyên dùng ảnh tỉ lệ 16:9, dung lượng dưới 5MB
      </p>
    </div>
  );
};

export default MediaUpload;
