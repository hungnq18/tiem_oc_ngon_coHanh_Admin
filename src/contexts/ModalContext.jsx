import React, { createContext, useContext, useState, useCallback } from 'react';
import Dialog from '../components/Dialog';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
    confirmText: 'Xác nhận',
    cancelText: 'Hủy'
  });

  const showAlert = useCallback((title, message, type = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {},
      confirmText: 'Đã hiểu',
      cancelText: 'Hủy'
    });
  }, []);

  const showConfirm = useCallback((title, message, onConfirm, options = {}) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm,
      confirmText: options.confirmText || 'Xác nhận',
      cancelText: options.cancelText || 'Hủy'
    });
  }, []);

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <Dialog 
        {...modalConfig} 
        onClose={closeModal}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
