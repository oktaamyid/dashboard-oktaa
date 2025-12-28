"use client";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
     // Initialize to false to avoid server/client mismatch
     const [isOpen, setIsOpen] = useState(false);
     const [isMounted, setIsMounted] = useState(false);

     useEffect(() => {
          setIsMounted(true);
          const handleResize = () => {
               setIsOpen(window.innerWidth >= 768);
          };

          // Set initial state based on window size after mount
          handleResize();

          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
     }, []);

     return (
          <>
               <Analytics />
               <div className="antialiased bg-black h-screen overflow-hidden relative selection:bg-white selection:text-black">
                    {/* Subtle Grid Background */}
                    <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none z-0" />

                    <div className="flex h-full relative z-10 transition-opacity duration-500 ease-in-out" style={{ opacity: isMounted ? 1 : 0 }}>
                         <Sidebar
                              isOpen={isOpen}
                              onCloseSidebar={() => setIsOpen(false)}
                         />
                         <div className="flex-1 flex flex-col h-full overflow-hidden">
                              <Header
                                   isOpen={isOpen}
                                   onToggleSidebar={() => setIsOpen(!isOpen)}
                              />
                              <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
                         </div>
                    </div>
               </div>
          </>
     );
}