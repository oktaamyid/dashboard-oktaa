// components/ui/Input.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
     label?: string;
     error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
     return (
          <div className="form-control w-full">
               {label && (
                    <div className="label pb-1">
                         <span className="label-text text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{label}</span>
                    </div>
               )}
               <input
                    className={`input input-bordered rounded-none bg-black text-white px-4 border-white/20 focus:border-white focus:outline-none transition-all duration-300 w-full placeholder:text-zinc-700 ${className} ${error ? 'input-error' : ''}`}
                    {...props}
               />
               {error && (
                    <div className="label pt-1">
                         <span className="label-text-alt text-error">{error}</span>
                    </div>
               )}
          </div>
     );
}
