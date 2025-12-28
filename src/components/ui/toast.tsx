"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
     CheckCircleIcon,
     ExclamationCircleIcon,
     ExclamationTriangleIcon,
     InformationCircleIcon,
     XMarkIcon
} from "@heroicons/react/24/solid";

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
          <div className="toast toast-top toast-end z-50 p-4 gap-2">
               {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
               ))}
          </div>
     );
};

const ToastItem: React.FC<{ toast: Toast; removeToast: (id: string) => void }> = ({ toast, removeToast }) => {
     useEffect(() => {
          if (toast.autoClose) {
               const timer = setTimeout(() => {
                    removeToast(toast.id);
               }, toast.duration || 5000);

               return () => clearTimeout(timer);
          }
     }, [toast, removeToast]);

     const variantClasses = {
          success: "alert-success bg-black border border-green-500 text-green-500",
          error: "alert-error bg-black border border-red-500 text-red-500",
          warning: "alert-warning bg-black border border-yellow-500 text-yellow-500",
          info: "alert-info bg-black border border-blue-500 text-blue-500",
          dark: "alert-neutral bg-black border border-white/20 text-white"
     };

     const defaultIcons = {
          success: CheckCircleIcon,
          error: ExclamationCircleIcon,
          warning: ExclamationTriangleIcon,
          info: InformationCircleIcon,
          dark: InformationCircleIcon
     };

     const Icon = defaultIcons[toast.variant];

     return (
          <div
               role="alert"
               className={`alert rounded-none shadow-lg ${variantClasses[toast.variant]} w-full max-w-xs animate-in slide-in-from-right fade-in`}
          >
               <Icon className="h-6 w-6 stroke-current shrink-0" />
               <span className="text-xs uppercase font-bold tracking-wider">{toast.message}</span>
               <button
                    onClick={() => removeToast(toast.id)}
                    className="btn btn-sm btn-ghost btn-square rounded-none hover:bg-white/10"
               >
                    <XMarkIcon className="h-4 w-4" />
               </button>
          </div>
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
