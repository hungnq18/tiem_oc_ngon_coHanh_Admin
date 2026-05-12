import React, { useCallback, useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Check, RotateCcw, X } from 'lucide-react';

// Sử dụng đường dẫn CSS chuẩn
import 'react-easy-crop/react-easy-crop.css';

const ImageCropper = ({ image, onCropComplete, onCancel, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    console.log('ImageCropper mounted with image length:', image?.length);
  }, [image]);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);
  const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async () => {
    try {
      if (!croppedAreaPixels) return null;
      const img = new Image();
      img.src = image;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const { x, y, width, height } = croppedAreaPixels;
      
      // Giới hạn kích thước tối đa để upload siêu nhanh (800x800 là đủ cho ảnh hiển thị)
      const MAX_DIMENSION = 800;
      let targetWidth = width;
      let targetHeight = height;
      
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          targetWidth = MAX_DIMENSION;
          targetHeight = (height / width) * MAX_DIMENSION;
        } else {
          targetHeight = MAX_DIMENSION;
          targetWidth = (width / height) * MAX_DIMENSION;
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw and scale on the fly
      ctx.drawImage(img, x, y, width, height, 0, 0, targetWidth, targetHeight);

      // Nén định dạng WebP (nhẹ hơn JPG 30-50%) với chất lượng 0.8
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/webp', 0.8);
      });
    } catch (e) {
      console.error('Crop error:', e);
      return null;
    }
  };

  const handleConfirm = async () => {
    console.log('Confirming crop...');
    const croppedBlob = await getCroppedImg();
    if (croppedBlob) {
      onCropComplete(croppedBlob);
    } else {
      alert('Không thể cắt ảnh. Vui lòng thử lại.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl flex flex-col shadow-2xl h-[90vh] sm:h-auto">
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <h3 className="font-bold text-primary">Cắt ảnh món ăn</h3>
          <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="relative flex-1 bg-gray-200 min-h-[300px] sm:h-[400px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            showGrid={true}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteInternal}
          />
        </div>

        <div className="p-4 space-y-4 bg-white">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase w-20">Phóng to</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); }}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Đặt lại</span>
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-[2] py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2 shadow-lg"
            >
              <Check size={16} />
              <span>Xác nhận & Tải lên</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
