import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Plus, Edit2, Trash2, Loader2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', order: 0 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/public/categories?admin=true');
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory._id}`, formData);
      } else {
        await api.post('/admin/categories', formData);
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu danh mục');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa danh mục');
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, order: category.order });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', order: categories.length });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', order: 0 });
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary font-serif">Danh mục</h2>
          <p className="text-gray-500">Quản lý các nhóm món ăn trên website</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
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
              <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-500">{cat.order}</td>
                <td className="px-6 py-4 font-bold text-primary">{cat.name}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{cat.slug}</td>
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="VD: Món Khai Vị"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    required
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="input"
                  />
                </div>

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
