"use client";

import { Raleway } from "next/font/google";
import "./globals.css";
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useState } from 'react';

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

     const toggleSidebar = () => {
          setIsOpen(!isOpen);
     };

     return (
          <html lang="en">
               <body
                    className={`${raleway.variable} antialiased bg-gradient-to-br from-gray-700 to-black/80`}
               >
                    <div className="flex min-h-screen">
                         {/* Teruskan state isOpen ke Sidebar */}
                         <Sidebar isOpen={isOpen} />
                         <div className="flex-1">
                              {/* Teruskan isOpen dan toggleSidebar ke Header */}
                              <Header isOpen={isOpen} onToggleSidebar={toggleSidebar} />
                              <div className="p-6">{children}</div>
                         </div>
                    </div>
               </body>
          </html>
     );
}