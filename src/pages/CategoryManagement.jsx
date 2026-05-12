import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Plus, Edit2, Trash2, Loader2, Save, X, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../contexts/ModalContext';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', order: 0, isActive: true });
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [errors, setErrors] = useState({});
  const { showAlert, showConfirm } = useModal();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get(`/admin/categories?_t=${Date.now()}`);
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống';
    }

    // Validate order
    const orderVal = parseInt(formData.order);
    if (isNaN(orderVal) || orderVal < 0) {
      newErrors.order = 'Thứ tự hiển thị phải là số từ 0 trở lên';
    }

    // Check duplicate order
    const isDuplicate = categories.some(c => 
      c.order === formData.order && 
      c._id !== editingCategory?._id
    );
    if (isDuplicate) {
      newErrors.order = `Thứ tự ${formData.order} đã tồn tại`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory._id}`, formData);
      } else {
        await api.post('/admin/categories', formData);
      }
      fetchCategories();
      closeModal();
      showAlert('Thành công', 'Lưu danh mục thành công', 'success');
    } catch (err) {
      showAlert('Lỗi', err.message || 'Lỗi khi lưu danh mục', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    showConfirm(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.',
      async () => {
        try {
          await api.delete(`/admin/categories/${id}`);
          fetchCategories();
          showAlert('Thành công', 'Đã xóa danh mục', 'success');
        } catch (err) {
          showAlert('Lỗi', err.message || 'Lỗi khi xóa danh mục', 'error');
        }
      }
    );
  };

  const handleReorder = async (direction, index) => {
    if (reordering) return;
    const newCategories = [...categories];
    if (direction === 'up' && index > 0) {
      [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
    } else if (direction === 'down' && index < newCategories.length - 1) {
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    } else {
      return;
    }

    setReordering(true);
    try {
      await api.post('/admin/categories/reorder', {
        orderedIds: newCategories.map(c => c._id)
      });
      fetchCategories();
    } catch (err) {
      showAlert('Lỗi', err.message || 'Lỗi khi sắp xếp', 'error');
    } finally {
      setReordering(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, order: category.order, isActive: category.isActive });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', order: categories.length, isActive: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', order: 0, isActive: true });
    setErrors({});
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary font-serif">Danh mục</h2>
          <p className="text-gray-500">Quản lý các nhóm món ăn trên website</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="btn-primary px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base flex items-center gap-2"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span>Thêm danh mục</span>
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/5 text-primary">
              <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Thứ tự</th>
              <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Tên danh mục</th>
              <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Slug</th>
              <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat, idx) => (
              <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center">{cat.order}</span>
                    <div className="flex flex-col">
                      <button 
                        onClick={() => handleReorder('up', idx)}
                        disabled={idx === 0 || reordering}
                        className="p-0.5 hover:text-primary disabled:opacity-30"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button 
                        onClick={() => handleReorder('down', idx)}
                        disabled={idx === categories.length - 1 || reordering}
                        className="p-0.5 hover:text-primary disabled:opacity-30"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-primary">{cat.name}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{cat.slug}</td>
                <td className="px-6 py-4">
                  {cat.isActive ? (
                    <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold uppercase">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Hiển thị
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs font-bold uppercase">Ẩn</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => openModal(cat)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">
                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Tên danh mục</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className="input"
                    placeholder="VD: Món Khai Vị"
                  />
                  {errors.name && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.order}
                    onChange={(e) => {
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 });
                      if (errors.order) setErrors({ ...errors, order: '' });
                    }}
                    className="input"
                  />
                  {errors.order && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.order}</p>}
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary">Hiển thị trên website</span>
                    <span className="text-xs text-gray-500">Cho phép người dùng thấy danh mục này</span>
                  </div>
                </label>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 btn bg-gray-100 text-gray-600 hover:bg-gray-200">
                    Hủy
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 btn-primary flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>Lưu lại</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagement;
