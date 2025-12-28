import React from 'react';

interface FormWrapperProps {
     title: string;
     description?: string;
     children: React.ReactNode;
}

export default function FormWrapper({ title, description, children }: FormWrapperProps) {
     return (
          <div className="w-full">
               <div className="mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                         {title}
                    </h2>
                    {description && (
                         <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">
                              {description}
                         </p>
                    )}
               </div>
               <div>
                    {children}
               </div>
          </div>
     );
}
