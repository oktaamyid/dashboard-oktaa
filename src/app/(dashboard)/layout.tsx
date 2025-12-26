"use client";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
     const [isOpen, setIsOpen] = useState(typeof window !== "undefined" ? window.innerWidth >= 768 : false);

     useEffect(() => {
          const handleResize = () => {
               setIsOpen(window.innerWidth >= 768);
          };

          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
     }, []);

     return (
          <>
               <Analytics />
               <div className="antialiased bg-linear-to-br from-gray-700 to-black/80 min-h-screen">
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
          </>
     );
}