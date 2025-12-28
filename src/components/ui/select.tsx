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
          <div className="form-control w-full">
               {label && (
                    <div className="label pb-1">
                         <span className="label-text text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{label}</span>
                    </div>
               )}
               <select
                    className={`select select-bordered rounded-none bg-black text-white border-white/20 focus:border-white focus:outline-none transition-all duration-300 w-full ${className} ${error ? "select-error" : ""}`}
                    {...props}
               >
                    {options.map((option) => (
                         <option
                              key={option.value}
                              value={option.value}
                              className="bg-black text-white"
                         >
                              {option.label}
                         </option>
                    ))}
               </select>
               {error && (
                    <div className="label pt-1">
                         <span className="label-text-alt text-error">{error}</span>
                    </div>
               )}
          </div>
     );
}