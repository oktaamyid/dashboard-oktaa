// components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: "primary" | "secondary" | "danger" | "ghost";
     size?: "sm" | "md" | "lg";
     isLoading?: boolean;
}

export default function Button({
     variant = "primary",
     size = "md",
     isLoading = false,
     className = "",
     children,
     ...props
}: ButtonProps) {

     const baseStyles = "btn rounded-none font-bold uppercase tracking-widest transition-all duration-300 border-box";

     const variants = {
          primary: "bg-white text-black hover:bg-zinc-200 border-none",
          secondary: "btn-outline text-white hover:bg-white hover:text-black border-white/30",
          danger: "bg-red-600 text-white hover:bg-red-700 border-none",
          ghost: "btn-ghost text-zinc-400 hover:text-white hover:bg-white/10"
     };

     const sizes = {
          sm: "btn-sm text-[10px]",
          md: "btn-md text-xs",
          lg: "btn-lg text-sm"
     };

     return (
          <button
               className={`
                    ${baseStyles} 
                    ${variants[variant]} 
                    ${sizes[size]} 
                    ${className}
               `}
               disabled={isLoading || props.disabled}
               {...props}
          >
               {isLoading && <span className="loading loading-spinner loading-xs"></span>}
               {children}
          </button>
     );
}
