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
          sm: {
               container: 'w-9 h-5',
               thumb: 'after:h-4 after:w-4 after:top-[2px] after:start-[2px]',
               translate: 'peer-checked:after:translate-x-4'
          },
          md: {
               container: 'w-11 h-6',
               thumb: 'after:h-5 after:w-5 after:top-[2px] after:start-[2px]',
               translate: 'peer-checked:after:translate-x-full'
          },
          lg: {
               container: 'w-14 h-7',
               thumb: 'after:h-6 after:w-6 after:top-[2px] after:start-[2px]',
               translate: 'peer-checked:after:translate-x-7'
          }
     };

     const variantClasses = {
          default: 'peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600',
          success: 'peer-checked:bg-green-600 dark:peer-checked:bg-green-600',
          warning: 'peer-checked:bg-yellow-600 dark:peer-checked:bg-yellow-600',
          danger: 'peer-checked:bg-red-600 dark:peer-checked:bg-red-600'
     };

     const focusRingClasses = {
          default: 'peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800',
          success: 'peer-focus:ring-green-300 dark:peer-focus:ring-green-800',
          warning: 'peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800',
          danger: 'peer-focus:ring-red-300 dark:peer-focus:ring-red-800'
     };

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (!disabled) {
               onChange(e.target.checked);
          }
     };

     return (
          <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
               <input
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="sr-only peer"
                    id={id}
                    name={name}
               />
               <div 
                    className={`
                         relative bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 
                         peer-checked:after:border-white after:content-[''] after:absolute after:bg-white 
                         after:border-gray-300 after:border after:rounded-full after:transition-all dark:border-gray-600
                         ${sizeClasses[size].container}
                         ${sizeClasses[size].thumb}
                         ${sizeClasses[size].translate}
                         ${variantClasses[variant]}
                         ${focusRingClasses[variant]}
                         rtl:peer-checked:after:-translate-x-full
                    `}
               />
               {label && (
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                         {label}
                    </span>
               )}
          </label>
     );
});

Toggle.displayName = 'Toggle';

export default Toggle;
