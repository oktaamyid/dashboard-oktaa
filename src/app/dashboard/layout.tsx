"use client";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
     const [isOpen, setIsOpen] = useState(false);
     const pathname = usePathname();
     const isDashboard = pathname.startsWith("/dashboard");

     useEffect(() => {
          const handleResize = () => {
               setIsOpen(window.innerWidth >= 768);
          };

          handleResize();

          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
     }, []);

     return (
          <>
               <Analytics />
               {isDashboard ? (
                    <div className="antialiased bg-gradient-to-br from-gray-700 to-black/80 min-h-screen">
                         <div className="flex h-full">
                              <Sidebar
                                   isOpen={isOpen}
                                   onCloseSidebar={() => setIsOpen(false)}
                              />
                              <div className="flex-1 flex flex-col h-full overflow-hidden">
                                   <Header
                                        isOpen={isOpen}
                                        onToggleSidebar={() => setIsOpen(!isOpen)}
                                   />
                                   <main className="flex-1 overflow-auto p-6">{children}</main>
                              </div>
                         </div>
                    </div>
               ) : (
                    <div className="p-6">{children}</div>
               )}
          </>
     );
}