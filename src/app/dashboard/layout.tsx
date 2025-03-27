"use client";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
     const [isOpen, setIsOpen] = useState(true);
     const pathname = usePathname();

     const isDashboard = pathname.startsWith("/dashboard");

     return (
          <>
               <Analytics />
               {isDashboard ? (
                    <div className="antialiased bg-gradient-to-br from-gray-700 to-black/80">
                         <div className="flex min-h-screen">
                              <Sidebar isOpen={isOpen} />
                              <div className="flex-1">
                                   <Header isOpen={isOpen} onToggleSidebar={() => setIsOpen(!isOpen)} />
                                   <div className="p-6">{children}</div>
                              </div>
                         </div>
                    </div>
               ) : (
                    // Layout default untuk halaman lain
                    <div className="p-6">{children}</div>
               )}
          </>
     );
}
