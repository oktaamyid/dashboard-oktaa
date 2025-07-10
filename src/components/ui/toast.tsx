"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert from './alert';

interface Toast {
     id: string;
     variant: 'success' | 'error' | 'warning' | 'info' | 'dark';
     message: string;
     autoClose?: boolean;
     duration?: number;
}

interface ToastContextType {
     toasts: Toast[];
     addToast: (toast: Omit<Toast, 'id'>) => void;
     removeToast: (id: string) => void;
     showSuccess: (message: string, options?: { autoClose?: boolean; duration?: number }) => void;
     showError: (message: string, options?: { autoClose?: boolean; duration?: number }) => void;
     showWarning: (message: string, options?: { autoClose?: boolean; duration?: number }) => void;
     showInfo: (message: string, options?: { autoClose?: boolean; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [toasts, setToasts] = useState<Toast[]>([]);

     const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
          const id = Math.random().toString(36).substr(2, 9);
          setToasts(prev => [...prev, { ...toast, id }]);
     }, []);

     const removeToast = useCallback((id: string) => {
          setToasts(prev => prev.filter(toast => toast.id !== id));
     }, []);

     const showSuccess = useCallback((message: string, options?: { autoClose?: boolean; duration?: number }) => {
          addToast({
               variant: 'success',
               message,
               autoClose: options?.autoClose ?? true,
               duration: options?.duration ?? 5000
          });
     }, [addToast]);

     const showError = useCallback((message: string, options?: { autoClose?: boolean; duration?: number }) => {
          addToast({
               variant: 'error',
               message,
               autoClose: options?.autoClose ?? true,
               duration: options?.duration ?? 5000
          });
     }, [addToast]);

     const showWarning = useCallback((message: string, options?: { autoClose?: boolean; duration?: number }) => {
          addToast({
               variant: 'warning',
               message,
               autoClose: options?.autoClose ?? true,
               duration: options?.duration ?? 5000
          });
     }, [addToast]);

     const showInfo = useCallback((message: string, options?: { autoClose?: boolean; duration?: number }) => {
          addToast({
               variant: 'info',
               message,
               autoClose: options?.autoClose ?? true,
               duration: options?.duration ?? 5000
          });
     }, [addToast]);

     return (
          <ToastContext.Provider value={{
               toasts,
               addToast,
               removeToast,
               showSuccess,
               showError,
               showWarning,
               showInfo
          }}>
               {children}
               <ToastContainer toasts={toasts} removeToast={removeToast} />
          </ToastContext.Provider>
     );
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
     return (
          <>
               {toasts.map((toast, index) => (
                    <Alert
                         key={toast.id}
                         variant={toast.variant}
                         floating
                         position="top-right"
                         autoClose={toast.autoClose}
                         autoCloseDuration={toast.duration}
                         onClose={() => removeToast(toast.id)}
                         showCloseButton
                         className={`mb-2`}
                         style={{ top: `${1 + index * 5.5}rem` }}
                    >
                         {toast.message}
                    </Alert>
               ))}
          </>
     );
};

export const useToast = () => {
     const context = useContext(ToastContext);
     if (context === undefined) {
          throw new Error('useToast must be used within a ToastProvider');
     }
     return context;
};

export default ToastProvider;
