// components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: "primary" | "secondary" | "danger";
}

export default function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
     const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-300";
     const variants = {
          primary: "bg-blue-600 hover:bg-blue-500 text-white",
          secondary: "bg-gray-600 hover:bg-gray-500 text-white",
          danger: "bg-red-600 hover:bg-red-500 text-white",
     };

     return (
          <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
               {children}
          </button>
     );
}
