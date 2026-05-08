import React, { useState, useRef } from 'react';
import api from '../api/client';
import { Upload, X, Loader2, Image as ImageIcon, Plus } from 'lucide-react';

const MediaUpload = ({ value, onChange, label, multiple = false }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Đảm bảo value luôn là một mảng nếu ở chế độ multiple
  const images = multiple ? (Array.isArray(value) ? value : []) : (value || { url: '', publicId: '' });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      const validImages = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        
        const res = await api.post('/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (res.success && res.data) {
          validImages.push(res.data);
        }
      }

      if (multiple) {
        onChange([...(Array.isArray(images) ? images : []), ...validImages]);
      } else if (validImages.length > 0) {
        onChange(validImages[0]);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Lỗi khi tải ảnh lên: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setUploading(false);
      // Quan trọng: Reset input để có thể chọn lại chính file vừa xóa nếu muốn
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    if (multiple) {
      const newList = images.filter((_, i) => i !== index);
      onChange(newList);
    } else {
      onChange({ url: '', publicId: '' });
    }
    // Reset input file khi xóa
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderSingle = () => (
    <div className="relative group">
      {images && (typeof images === 'string' ? images : images.url) ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-primary/10 shadow-sm bg-gray-50">
          {uploading && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          <img 
            key={typeof images === 'string' ? images : images.url}
            src={typeof images === 'string' ? images : images.url} 
            alt="Preview" 
            className="w-full h-full object-cover" 
          />
          <button 
            type="button"
            onClick={() => removeImage()}
            className="absolute top-2 right-2 z-30 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-video rounded-2xl border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all flex flex-col items-center justify-center gap-2 bg-primary/5 text-primary/60"
        >
          {uploading ? (
            <Loader2 className="animate-spin text-primary" size={32} />
          ) : (
            <>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Upload size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Tải ảnh lên</span>
            </>
          )}
        </button>
      )}
    </div>
  );

  const renderMultiple = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((img, idx) => (
        <div 
          key={img.publicId || idx}
          className="relative aspect-square rounded-xl overflow-hidden border border-primary/10 group shadow-sm bg-gray-100"
        >
          <img 
            key={typeof img === 'string' ? img : img.url}
            src={typeof img === 'string' ? img : img.url} 
            className="w-full h-full object-cover" 
          />
          <button 
            type="button"
            onClick={() => removeImage(idx)}
            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
          {idx === 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[8px] font-bold uppercase py-0.5 text-center">
              Ảnh đại diện
            </div>
          )}
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="aspect-square rounded-xl border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all flex flex-col items-center justify-center gap-1 bg-primary/5 text-primary/60 relative overflow-hidden"
      >
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : (
          <>
            <Plus size={20} />
            <span className="text-[10px] font-bold uppercase">Thêm ảnh</span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-bold text-primary">{label}</label>}
      
      {multiple ? renderMultiple() : renderSingle()}

      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
      />
      
      <p className="text-[10px] text-gray-400 italic">
        {multiple 
          ? "* Bạn có thể chọn nhiều ảnh cùng lúc. Ảnh đầu tiên sẽ làm ảnh đại diện."
          : "* Khuyên dùng ảnh tỉ lệ 16:9, dung lượng dưới 5MB"
        }
      </p>
    </div>
  );
};

export default MediaUpload;
