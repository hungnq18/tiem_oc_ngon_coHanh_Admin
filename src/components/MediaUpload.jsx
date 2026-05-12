import React, { useState, useRef } from 'react';
import api from '../api/client';
import { Upload, X, Loader2, Image as ImageIcon, Plus, Crop } from 'lucide-react';
import ImageCropper from './ImageCropper';

const MediaUpload = ({ value, onChange, label, multiple = false, aspect = 1, onUploadStateChange }) => {
  const [uploading, setUploading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Đảm bảo value luôn là một mảng nếu ở chế độ multiple
  // Lấy danh sách ảnh hiển thị từ value prop
  const getImagesList = () => {
    if (multiple) return Array.isArray(value) ? value : [];
    return value ? [value] : [];
  };

  const getImageUrl = (img) => {
    if (!img) return '';
    let url = typeof img === 'string' ? img : (img.url || '');
    if (!url) return '';
    // Xóa Date.now() ở đây để tránh việc re-render liên tục làm ảnh tải lại mãi không xong
    return url;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    // Kiểm tra dung lượng file (giới hạn 10MB để tránh treo browser)
    if (file.size > 10 * 1024 * 1024) {
      alert('File quá lớn (tối đa 10MB). Vui lòng chọn ảnh khác.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      console.log('File read success, length:', reader.result.length);
      setTempImageUrl(reader.result);
      // Đợi một chút để state tempImageUrl ổn định rồi mới hiện modal
      setTimeout(() => {
        setIsCropping(true);
      }, 50);
      
      if (files.length > 1) {
        setPendingFiles(files.slice(1));
      } else {
        setPendingFiles([]);
      }
    };
    reader.onerror = (err) => {
      console.error('FileReader error:', err);
      alert('Không thể đọc file. Vui lòng thử lại.');
    };
    console.log('Reading file:', file.name, (file.size / 1024 / 1024).toFixed(2), 'MB');
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob) => {
    setIsCropping(false);
    setTempImageUrl(null);
    setUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);
    
    // Tạo preview cục bộ để hiện lên UI ngay lập tức
    const previewUrl = URL.createObjectURL(croppedBlob);
    setLocalPreview(previewUrl);

    try {
      const formData = new FormData();
      formData.append('image', croppedBlob, 'cropped_image.webp');

      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success && res.data) {
        const newImageData = res.data;
        console.log('Upload success:', newImageData);
        
        // Xóa preview cục bộ khi đã có link server
        setLocalPreview(null);
        
        if (multiple) {
          const currentList = Array.isArray(value) ? value : [];
          const updatedList = [...currentList, newImageData];
          console.log('Updating multiple list:', updatedList);
          onChange(updatedList);
        } else {
          console.log('Updating single image:', newImageData);
          onChange(newImageData);
        }
      } else {
        console.error('Upload failed - invalid response:', res);
      }

      // Xử lý file tiếp theo trong hàng đợi nếu có
      if (pendingFiles.length > 0) {
        const nextFile = pendingFiles[0];
        setPendingFiles(prev => prev.slice(1));
        
        const reader = new FileReader();
        reader.onload = () => {
          setTempImageUrl(reader.result);
          setIsCropping(true);
        };
        reader.readAsDataURL(nextFile);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Lỗi khi tải ảnh lên: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setUploading(false);
      if (onUploadStateChange) onUploadStateChange(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setTempImageUrl(null);
    setPendingFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    const currentList = getImagesList();
    console.log('Removing image at index:', index, 'Current list:', currentList);
    if (multiple) {
      const newList = currentList.filter((_, i) => i !== index);
      console.log('Updated list after removal:', newList);
      onChange(newList);
    } else {
      console.log('Removing single image');
      onChange(null);
    }
    // Reset input file khi xóa
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderSingle = () => {
    const imagesList = getImagesList();
    const currentImg = imagesList[0];
    
    return (
      <div className="relative group">
        {(localPreview || getImageUrl(currentImg)) ? (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-primary/10 group bg-gray-50 flex items-center justify-center">
            {uploading && (
              <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <span className="text-[10px] font-bold text-primary animate-pulse">Đang tải lên...</span>
                </div>
              </div>
            )}
            <img 
              src={localPreview || getImageUrl(currentImg)} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain" 
            />
            <button 
              type="button"
              onClick={() => removeImage(0)}
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
  };

  const renderMultiple = () => {
    const imagesList = getImagesList();
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {imagesList.map((img, idx) => (
          <div 
            key={img.publicId || idx}
            className="relative aspect-square rounded-xl overflow-hidden border border-primary/10 group shadow-sm bg-gray-100"
          >
            <img 
              src={getImageUrl(img)} 
              className="w-full h-full object-cover" 
              alt={`Preview ${idx}`}
            />
            <button 
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
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
              {localPreview && <img src={localPreview} className="absolute inset-0 w-full h-full object-cover opacity-50" />}
              <Loader2 className="animate-spin text-primary z-10" size={20} />
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
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-bold text-primary">{label}</label>}
      
      {multiple ? renderMultiple() : renderSingle()}

      {isCropping && (
        <ImageCropper 
          image={tempImageUrl} 
          aspect={aspect} 
          onCropComplete={handleCropComplete} 
          onCancel={handleCropCancel} 
        />
      )}

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
