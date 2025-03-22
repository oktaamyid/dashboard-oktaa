"use client";

import { Raleway } from "next/font/google";
import "./globals.css";
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useState } from 'react';
import { usePathname } from "next/navigation";

const raleway = Raleway({
     subsets: ['latin'],
     weight: ['400', '700'],
     variable: '--font-raleway',
});

export default function RootLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {
     const [isOpen, setIsOpen] = useState(true);
     const pathname = usePathname();

     const toggleSidebar = () => {
          setIsOpen(!isOpen);
     };

     const isShortUrlPage =
          pathname !== "/" &&  
          !pathname.startsWith("/experiences") &&
          !pathname.startsWith("/links") &&
          !pathname.startsWith("/projects") &&
          !pathname.startsWith("/api") &&
          pathname.split("/").length === 2;

     return (
          <html lang="en">
               <body className={`${raleway.variable} ${isShortUrlPage ? "bg-white" : "antialiased bg-gradient-to-br from-gray-700 to-black/80"}`}>
                    {isShortUrlPage ? (
                         <div className="p-6">{children}</div>
                    ) : (

                         <div className="flex min-h-screen">
                              {/* Teruskan state isOpen ke Sidebar */}
                              <Sidebar isOpen={isOpen} />
                              <div className="flex-1">
                                   {/* Teruskan isOpen dan toggleSidebar ke Header */}
                                   <Header isOpen={isOpen} onToggleSidebar={toggleSidebar} />
                                   <div className="p-6">{children}</div>
                              </div>
                         </div>
                    )}
               </body>
          </html>
     );
}