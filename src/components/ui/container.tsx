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
     hoverEffect = true,
     icon: Icon,
     iconPosition = "bottom-right"
}: DivContainerProps) {
     // Determine icon position classes
     const getIconPositionClasses = () => {
          switch (iconPosition) {
               case "top-left":
                    return "left-2 top-2 origin-top-left";
               case "top-right":
                    return "right-2 top-2 origin-top-right";
               case "bottom-left":
                    return "left-2 bottom-2 origin-bottom-left";
               default: // bottom-right
                    return "right-2 bottom-2 origin-bottom-right";
          }
     };

     return (
          <div
               className={`
        bg-gray-700 
        rounded-lg 
        shadow-lg 
        ${hoverEffect ? "hover:bg-gray-600 transition-all duration-300" : ""}
        relative 
        overflow-hidden 
        ${className}
      `}
          >
               {/* Background Icon (if provided) */}
               {Icon && (
                    <div
                         className={`
            absolute 
            ${getIconPositionClasses()} 
            opacity-10 
            ${hoverEffect ? "group-hover:opacity-20 transition-all duration-500 group-hover:scale-125" : ""}
          `}
                    >
                         <Icon className="h-16 w-16 text-white" />
                    </div>
               )}

               {/* Main content */}
               <div className="relative z-10 h-full w-full">
                    {children}
               </div>
          </div>
     );
}