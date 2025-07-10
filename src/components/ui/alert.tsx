import React, { useEffect, useState } from "react";
import {
     CheckCircleIcon,
     ExclamationCircleIcon,
     ExclamationTriangleIcon,
     InformationCircleIcon
} from "@heroicons/react/24/solid";

type AlertVariant = "success" | "error" | "warning" | "info" | "dark";
type AlertPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";

interface AlertProps {
     variant?: AlertVariant;
     children: React.ReactNode;
     className?: string;
     icon?: React.ElementType;
     onClose?: () => void;
     showCloseButton?: boolean;
     id?: string;
     floating?: boolean;
     position?: AlertPosition;
     autoClose?: boolean;
     autoCloseDuration?: number;
     style?: React.CSSProperties;
}

export default function Alert({
     variant = "info",
     children,
     className = "",
     icon: CustomIcon,
     onClose,
     showCloseButton = false,
     id,
     floating = false,
     position = "top-right",
     autoClose = false,
     autoCloseDuration = 5000,
     style
}: AlertProps) {
     const [isVisible, setIsVisible] = useState(true);
     const [isAnimating, setIsAnimating] = useState(false);

     useEffect(() => {
          if (floating) {
               setIsAnimating(true);
               const timer = setTimeout(() => setIsAnimating(false), 300);
               return () => clearTimeout(timer);
          }
     }, [floating]);

     useEffect(() => {
          if (autoClose && floating) {
               const timer = setTimeout(() => {
                    handleClose();
               }, autoCloseDuration);
               return () => clearTimeout(timer);
          }
     }, [autoClose, autoCloseDuration, floating]);

     const handleClose = () => {
          if (floating) {
               setIsAnimating(true);
               setTimeout(() => {
                    setIsVisible(false);
                    onClose?.();
               }, 300);
          } else {
               onClose?.();
          }
     };

     if (!isVisible) return null;
     const variantStyles = {
          success: "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400",
          error: "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400",
          warning: "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300",
          info: "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400",
          dark: "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
     };

     const buttonStyles = {
          success: "bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-200 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700",
          error: "bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-200 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700",
          warning: "bg-yellow-50 text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700",
          info: "bg-blue-50 text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700",
          dark: "bg-gray-50 text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
     };

     const defaultIcons = {
          success: CheckCircleIcon,
          error: ExclamationCircleIcon,
          warning: ExclamationTriangleIcon,
          info: InformationCircleIcon,
          dark: InformationCircleIcon
     };

     const Icon = CustomIcon || defaultIcons[variant];

     const positionClasses = {
          "top-right": "fixed top-4 right-4 z-50",
          "top-left": "fixed top-4 left-4 z-50",
          "bottom-right": "fixed bottom-4 right-4 z-50",
          "bottom-left": "fixed bottom-4 left-4 z-50",
          "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
          "bottom-center": "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
     };

     const animationClasses = floating 
          ? `transition-all duration-300 transform ${
               isAnimating 
                    ? position.includes('top') 
                         ? '-translate-y-2 opacity-0' 
                         : 'translate-y-2 opacity-0'
                    : 'translate-y-0 opacity-100'
            } shadow-lg max-w-md`
          : 'mb-4';

     return (
          <div
               id={id}
               style={style}
               className={`
                    flex items-center p-4 rounded-lg 
                    ${variantStyles[variant]} 
                    ${floating ? positionClasses[position] : ''} 
                    ${animationClasses}
                    ${className}
               `}
               role="alert"
          >
               <Icon className="shrink-0 w-4 h-4" aria-hidden="true" />
               <span className="sr-only">{variant.charAt(0).toUpperCase() + variant.slice(1)}</span>
               <div className="ms-3 text-sm font-medium">
                    {children}
               </div>
               {(showCloseButton || onClose) && (
                    <button
                         type="button"
                         onClick={handleClose}
                         className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 ${buttonStyles[variant]}`}
                         aria-label="Close"
                    >
                         <span className="sr-only">Close</span>
                         <svg 
                              className="w-3 h-3" 
                              aria-hidden="true" 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 14 14"
                         >
                              <path 
                                   stroke="currentColor" 
                                   strokeLinecap="round" 
                                   strokeLinejoin="round" 
                                   strokeWidth="2" 
                                   d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                         </svg>
                    </button>
               )}
          </div>
     );
}