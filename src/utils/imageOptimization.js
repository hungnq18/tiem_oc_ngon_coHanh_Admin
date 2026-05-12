export const getOptimizedImageUrl = (url, width = 500, quality = 'auto') => {
  if (!url) return null;
  // Chỉ tối ưu hóa URL từ Cloudinary
  if (url.includes('res.cloudinary.com')) {
    const uploadPath = '/upload/';
    const index = url.indexOf(uploadPath);
    if (index !== -1) {
      const parts = url.split(uploadPath);
      // c_limit: chỉ thu nhỏ nếu ảnh gốc lớn hơn width. f_auto: tự động chọn định dạng webp/avif
      return `${parts[0]}${uploadPath}c_limit,w_${width},q_${quality},f_auto/${parts[1]}`;
    }
  }
  return url;
};
