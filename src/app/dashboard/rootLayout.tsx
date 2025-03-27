"use client";

import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     const [isOpen, setIsOpen] = useState(true);
     const pathname = usePathname();

     const toggleSidebar = () => {
          setIsOpen(!isOpen);
     };

     // Pengecekan untuk halaman Short URL
     const isShortUrlPage =
          pathname !== "/" &&
          !pathname.startsWith("/dashboard") &&
          pathname.split("/").length === 2;

     useEffect(() => {
          document.body.className = isShortUrlPage
               ? "bg-gray-100"
               : "antialiased bg-gradient-to-br from-gray-700 to-black/80";
     }, [isShortUrlPage]);

     return (
          <>
               <Analytics />
               {isShortUrlPage ? (
                    <div className="p-6">{children}</div>
               ) : (
                    <div className="flex min-h-screen">
                         <Sidebar isOpen={isOpen} />
                         <div className="flex-1">
                              <Header isOpen={isOpen} onToggleSidebar={toggleSidebar} />
                              <div className="p-6">{children}</div>
                         </div>
                    </div>
               )}
          </>
     );
}
