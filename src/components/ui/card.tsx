export default function Card({
     title,
     value,
     icon: Icon,
     className
}: {
     title: string;
     value: string;
     icon?: React.ComponentType<{ className?: string }>;
     className?: string
}) {
     return (
          <div className={`group bg-gray-700 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300 flex items-center space-x-4 relative overflow-hidden ${className}`}>
               {/* Background Icon with hover effect */}
               {Icon && (
                    <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-125 transform origin-bottom-right">
                         <Icon className="h-16 w-16 text-white" />
                    </div>
               )}

               {/* Icon in Foreground */}
               {Icon && (
                    <div className="bg-gray-600 p-3 rounded-full z-10">
                         <Icon className="h-6 w-6 text-white" />
                    </div>
               )}

               <div className="z-10">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-300">{title}</h3>
                    <p className="text-xl sm:text-2xl font-bold mt-1 text-white">{value}</p>
               </div>
          </div>
     );
}