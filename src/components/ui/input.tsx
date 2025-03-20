// components/ui/Input.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
     label?: string;
}

export default function Input({ label, className, ...props }: InputProps) {
     return (
          <div className="flex flex-col space-y-1">
               {label && <label className="text-gray-300 text-sm">{label}</label>}
               <input
                    className={`bg-gray-800 text-white p-2 rounded-md border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 ${className}`}
                    {...props}
               />
          </div>
     );
}
