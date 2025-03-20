// components/ui/Select.tsx
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
     label?: string;
     options: { label: string; value: string }[];
}

export default function Select({ label, options, className, ...props }: SelectProps) {
     return (
          <div className="flex flex-col space-y-1">
               {label && <label className="text-gray-300 text-sm">{label}</label>}
               <select
                    className={`bg-gray-800 text-white p-2 rounded-md border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 ${className}`}
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
