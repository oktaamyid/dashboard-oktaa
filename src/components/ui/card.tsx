export default function Card({
     title,
     value,
     icon: Icon,
     className
}: {
     title: string;
     value: string | number;
     icon?: React.ComponentType<{ className?: string }>;
     className?: string
}) {
     return (
          <div className={`stats shadow bg-black border border-white/10 rounded-none overflow-hidden ${className}`}>
               <div className="stat px-6 py-6 group hover:bg-white/5 transition-colors duration-300">
                    <div className="stat-figure text-secondary">
                         {Icon && (
                              <div className="w-12 h-12 flex items-center justify-center border border-white/10 bg-black text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                                   <Icon className="h-6 w-6" />
                              </div>
                         )}
                    </div>
                    <div className="stat-title text-zinc-500 font-bold uppercase tracking-widest text-xs mb-1">{title}</div>
                    <div className="stat-value text-white font-black text-4xl tracking-tight font-outfit">{value}</div>
                    {/* Optional: Add minimal desc or trend if needed later */}
                    {/* <div className="stat-desc text-zinc-600 text-xs mt-2">↗ 20% more than last month</div> */}
               </div>
          </div>
     );
}