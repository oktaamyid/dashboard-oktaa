// components/ui/Select.tsx
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
     label?: string;
     options: { label: string; value: string }[];
     error?: string;
}

export default function Select({
     label,
     options,
     className = "",
     error,
     ...props
}: SelectProps) {
     return (
          <div className="flex flex-col space-y-1">
               {label && (
                    <label className="text-gray-300 text-sm font-semibold mb-1">
                         {label}
                    </label>
               )}
               <select
                    className={`bg-gray-700 text-gray-300 p-2 rounded-lg border ${error ? "border-red-500" : "border-gray-500"
                         } shadow-md focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all duration-300 ${className
                         }`}
                    {...props}
               >
                    {options.map((option) => (
                         <option
                              key={option.value}
                              value={option.value}
                              className="bg-gray-800 hover:bg-gray-600" 
                         >
                              {option.label}
                         </option>
                    ))}
               </select>
               {/* Error Output */}
               {error && (
                    <p className="text-red-400 text-xs mt-1">{error}</p>
               )}
          </div>
     );
}