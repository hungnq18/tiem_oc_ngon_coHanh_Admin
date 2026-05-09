import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, HelpCircle, AlertTriangle } from 'lucide-react';

const Dialog = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', // info, success, warning, error, confirm
  onConfirm,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy'
}) => {
  const icons = {
    info: <HelpCircle className="text-blue-500" size={40} />,
    success: <CheckCircle className="text-green-500" size={40} />,
    warning: <AlertTriangle className="text-orange-500" size={40} />,
    error: <AlertCircle className="text-red-500" size={40} />,
    confirm: <HelpCircle className="text-primary" size={40} />
  };

  const colors = {
    info: 'bg-blue-50',
    success: 'bg-green-50',
    warning: 'bg-orange-50',
    error: 'bg-red-50',
    confirm: 'bg-primary/5'
  };

  const btnColors = {
    info: 'bg-blue-500 hover:bg-blue-600',
    success: 'bg-green-500 hover:bg-green-600',
    warning: 'bg-orange-500 hover:bg-orange-600',
    error: 'bg-red-500 hover:bg-red-600',
    confirm: 'btn-primary'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className={`p-8 flex flex-col items-center text-center ${colors[type]}`}>
            <div className="mb-4">
              {icons[type]}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
          </div>

          <div className="p-6 flex gap-3 bg-white">
            {type === 'confirm' ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-3 rounded-2xl text-white font-bold transition-all shadow-lg shadow-primary/20 ${btnColors[type]}`}
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`w-full px-4 py-3 rounded-2xl text-white font-bold transition-all shadow-lg ${btnColors[type]}`}
              >
                Đã hiểu
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Dialog;
