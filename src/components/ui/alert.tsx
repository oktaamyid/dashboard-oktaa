import React from "react";
import {
     CheckCircleIcon,
     ExclamationCircleIcon,
     ExclamationTriangleIcon,
     InformationCircleIcon,
     XMarkIcon
} from "@heroicons/react/24/solid";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
     variant?: AlertVariant;
     children: React.ReactNode;
     className?: string;
     icon?: React.ElementType;
     onClose?: () => void;
     showCloseButton?: boolean;
}

export default function Alert({
     variant = "info",
     children,
     className = "",
     icon: CustomIcon,
     onClose,
     showCloseButton = false
}: AlertProps) {
     const variantStyles = {
          success: "bg-green-600/20 border-green-500 text-green-300",
          error: "bg-red-600/20 border-red-500 text-red-300",
          warning: "bg-yellow-600/20 border-yellow-500 text-yellow-300",
          info: "bg-blue-600/20 border-blue-500 text-blue-300"
     };

     const defaultIcons = {
          success: CheckCircleIcon,
          error: ExclamationCircleIcon,
          warning: ExclamationTriangleIcon,
          info: InformationCircleIcon
     };

     const Icon = CustomIcon || defaultIcons[variant];

     return (
          <div
               className={`z-50 p-3 rounded-md border ${variantStyles[variant]} flex items-center gap-3 ${className}`}
          >
               <Icon className="h-5 w-5 flex-shrink-0" />
               <div className="flex-1">{children}</div>
               {(showCloseButton || onClose) && (
                    <button
                         onClick={onClose}
                         className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                         <XMarkIcon className="h-5 w-5" />
                    </button>
               )}
          </div>
     );
}