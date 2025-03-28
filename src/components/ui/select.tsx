// components/ui/Select.tsx
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
     label?: string;
     options: { label: string; value: string }[];
}

export default function Select({ label, options, className = "", ...props }: SelectProps) {
     return (
          <div className="flex flex-col space-y-1">
               {label && <label className="text-gray-300 text-sm font-semibold">{label}</label>}
               <select
                    className={`bg-gray-700 text-gray-300 p-2 rounded-lg border border-gray-500 shadow-md focus:ring-2 focus:ring-gray-400 transition-all duration-300 ${className}`}
                    {...props}
               >
                    {options.map((option) => (
                         <option key={option.value} value={option.value}>
                              {option.label}
                         </option>
                    ))}
               </select>
          </div>
     );
}
