import React from "react";

interface DivContainerProps {
     children: React.ReactNode;
     className?: string;
     hoverEffect?: boolean;
     icon?: React.ComponentType<{ className?: string }>;
     iconPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export default function DivContainer({
     children,
     className = "",
     hoverEffect = false, // Default false for sharp look
     icon: Icon,
     iconPosition = "bottom-right"
}: DivContainerProps) {
     // Determine icon position classes
     const getIconPositionClasses = () => {
          switch (iconPosition) {
               case "top-left":
                    return "left-0 top-0 origin-top-left";
               case "top-right":
                    return "right-0 top-0 origin-top-right";
               case "bottom-left":
                    return "left-0 bottom-0 origin-bottom-left";
               default: // bottom-right
                    return "right-0 bottom-0 origin-bottom-right";
          }
     };

     return (
          <div
               className={`
               bg-black 
               border border-white/10 
               rounded-none
               relative 
               overflow-hidden 
               ${hoverEffect ? "hover:border-white transition-colors duration-300" : ""}
               ${className}
          `}
          >
               {/* Background Icon (if provided) */}
               {Icon && (
                    <div
                         className={`
                    absolute 
                    ${getIconPositionClasses()} 
                    opacity-[0.03] 
                    pointer-events-none
                    ${hoverEffect ? "group-hover:opacity-[0.05] transition-opacity duration-500" : ""}
               `}
                    >
                         <Icon className="h-32 w-32 text-white" />
                    </div>
               )}

               {/* Main content */}
               <div className="relative z-10 h-full w-full">
                    {children}
               </div>
          </div>
     );
}