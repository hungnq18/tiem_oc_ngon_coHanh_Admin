import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  Plus, Edit2, Trash2, Loader2, Save, X, Search, 
  Filter, Image as ImageIcon, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaUpload from '../components/MediaUpload';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, limit: 10, total: 0 });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    images: [],
    categoryId: '',
    tags: { isSignature: false, isMustTry: false, isBestSeller: false },
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems(pagination.page);
  }, [filterCategory, pagination.page]);

  const fetchItems = async (page = 1) => {
    setLoading(true);
    try {
      const url = `/public/menu-items?admin=true&page=${page}&limit=10${filterCategory ? `&category=${filterCategory}` : ''}`;
      const res = await api.get(url);
      if (res.success) {
        setItems(res.data.items);
        setPagination(res.data.pagination);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/public/categories?admin=true');
      if (res.success) setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        await api.put(`/admin/menu-items/${editingItem._id}`, formData);
      } else {
        await api.post('/admin/menu-items', formData);
      }
      await fetchItems(pagination.page); // Đợi lấy dữ liệu mới xong mới đóng modal
      closeModal();
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu món ăn');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa món ăn này?')) return;
    try {
      await api.delete(`/admin/menu-items/${id}`);
      fetchItems(pagination.page);
    } catch (err) { alert(err.message); }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId?._id || item.categoryId,
        tags: { ...item.tags },
        images: item.images?.length > 0 
          ? item.images 
          : (item.image 
              ? [typeof item.image === 'string' ? { url: item.image, publicId: '' } : item.image] 
              : []),
        isActive: item.isActive
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '', 
        description: '', 
        price: 0,
        categoryId: categories[0]?._id || '',
        tags: { isSignature: false, isMustTry: false, isBestSeller: false },
        images: [],
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary font-serif">Thực đơn</h2>
          <p className="text-gray-500">Quản lý các món ăn trong quán ({pagination.total} món)</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>Thêm món mới</span>
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm món ăn..." 
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-1 rounded-xl border border-primary/5 shadow-sm min-w-[200px]">
          <Filter size={18} className="text-primary" />
          <select 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-600 w-full outline-none"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setPagination({...pagination, page: 1});
            }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-primary/5 text-primary border-b border-primary/10">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Món ăn</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Giá (VNĐ)</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="p-20 text-center"><Loader2 className="animate-spin inline-block text-primary" size={40} /></td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-medium">Không tìm thấy món ăn nào</td></tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                          {item.images?.[0]?.url ? <img src={item.images[0].url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-primary">{item.name}</div>
                          <div className="text-xs flex gap-1 mt-1">
                            {item.tags.isSignature && <span className="bg-orange-100 text-orange-600 px-1.5 rounded font-bold">Signature</span>}
                            {item.tags.isMustTry && <span className="bg-red-100 text-red-600 px-1.5 rounded font-bold">Must Try</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        {item.categoryId?.name || 'Chưa phân loại'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">
                      {item.price.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      {item.isActive ? (
                        <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold uppercase">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          Đang bán
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs font-bold uppercase">Tạm ngưng</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="text-sm text-gray-500 font-medium">
              Hiển thị {filteredItems.length} trên tổng số {pagination.total} món ăn
           </div>
           <div className="flex items-center gap-2">
              <button 
                disabled={pagination.page <= 1}
                onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                className="p-2 rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all border border-transparent hover:border-gray-200"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPagination({...pagination, page: i + 1})}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      pagination.page === i + 1 
                        ? 'bg-primary text-white shadow-md' 
                        : 'hover:bg-white hover:border-gray-200 border border-transparent'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                className="p-2 rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all border border-transparent hover:border-gray-200"
              >
                <ChevronRight size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* Modal ... (giữ nguyên logic modal đã có ở file trước) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 my-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary">{editingItem ? 'Sửa món ăn' : 'Thêm món ăn mới'}</h3>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-primary">Tên món</label>
                    <input type="text" required className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-primary">Giá bán (VNĐ)</label>
                    <input type="number" required className="input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-primary">Danh mục</label>
                    <select required className="input" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-primary">Mô tả</label>
                    <textarea className="input min-h-[100px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-6">
                  <MediaUpload 
                    label="Hình ảnh món ăn"
                    multiple={true}
                    value={formData.images}
                    onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                  />

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-primary block">Nhãn đánh dấu</label>
                    <div className="grid grid-cols-1 gap-2">
                      <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input type="checkbox" checked={formData.tags.isSignature} onChange={(e) => setFormData({ ...formData, tags: { ...formData.tags, isSignature: e.target.checked } })} />
                        <span className="text-sm font-medium">Món Signature</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input type="checkbox" checked={formData.tags.isMustTry} onChange={(e) => setFormData({ ...formData, tags: { ...formData.tags, isMustTry: e.target.checked } })} />
                        <span className="text-sm font-medium">Món Must Try</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                        <span className="text-sm font-medium">Hiện trên website</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={submitting} className="flex-1 btn-primary">
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      <span>Lưu lại</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManagement;
