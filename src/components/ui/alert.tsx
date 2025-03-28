import React from "react";

// Variasi tipe alert
type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
     variant?: AlertVariant;
     children: React.ReactNode;
     className?: string;
}

export default function Alert({
     variant = "info",
     children,
     className = ""
}: AlertProps) {
     const variantStyles = {
          success: "bg-green-600/20 border-green-500 text-green-300",
          error: "bg-red-600/20 border-red-500 text-red-300",
          warning: "bg-yellow-600/20 border-yellow-500 text-yellow-300",
          info: "bg-blue-600/20 border-blue-500 text-blue-300"
     };

     return (
            <div
                  className={`z-50 p-3 rounded-md border ${variantStyles[variant]} flex items-center ${className}`}>
                  {children}
            </div>
     );
}