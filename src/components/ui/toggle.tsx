"use client";

import { forwardRef } from 'react';

interface ToggleProps {
     checked: boolean;
     onChange: (checked: boolean) => void;
     label?: string;
     disabled?: boolean;
     size?: 'sm' | 'md' | 'lg';
     variant?: 'default' | 'success' | 'warning' | 'danger';
     className?: string;
     id?: string;
     name?: string;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({
     checked,
     onChange,
     label,
     disabled = false,
     size = 'md',
     variant = 'default',
     className = '',
     id,
     name
}, ref) => {

     const sizeClasses = {
          sm: 'toggle-sm',
          md: 'toggle-md',
          lg: 'toggle-lg'
     };

     const variantClasses = {
          default: 'toggle-primary', // Use primary for default (which is black now)
          success: 'toggle-success',
          warning: 'toggle-warning',
          danger: 'toggle-error'
     };

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (!disabled) {
               onChange(e.target.checked);
          }
     };

     return (
          <div className="form-control">
               <label className={`label cursor-pointer gap-4 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {label && (
                         <span className="label-text text-zinc-400 font-medium uppercase tracking-wider text-xs">{label}</span>
                    )}
                    <input
                         ref={ref}
                         type="checkbox"
                         className={`
                              toggle rounded-none bg-zinc-900 border-zinc-700
                              ${sizeClasses[size]} 
                              ${variantClasses[variant]}
                         `}
                         checked={checked}
                         onChange={handleChange}
                         disabled={disabled}
                         id={id}
                         name={name}
                    />
               </label>
          </div>
     );
});

Toggle.displayName = 'Toggle';

export default Toggle;
