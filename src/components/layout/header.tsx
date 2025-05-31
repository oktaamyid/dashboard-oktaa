import { useState, useRef, useEffect } from 'react';
import { Bars3Icon, ArrowRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter, usePathname } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import Breadcrumbs from '@/components/ui/breadcrumbs';
import Button from '@/components/ui/button';

export default function Header({
     isOpen,
     onToggleSidebar,
}: {
     isOpen: boolean;
     onToggleSidebar: () => void;
}) {
     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
     const dropdownRef = useRef<HTMLDivElement>(null);
     const router = useRouter();

     // Tutup dropdown ketika klik di luar
     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setIsDropdownOpen(false);
               }
          };

          document.addEventListener('mousedown', handleClickOutside);
          return () => {
               document.removeEventListener('mousedown', handleClickOutside);
          };
     }, []);

     // Tutup dropdown ketika route berubah
     const pathname = usePathname();

     useEffect(() => {
          setIsDropdownOpen(false);
     }, [pathname]);

     const handleLogout = async () => {
          await signOut(auth);
          deleteCookie("token");
          router.push("/login");
     };

     const profileEdit = async () => {
          router.push("/dashboard/profile");
     };

     return (
          <header className="bg-gray-800 shadow p-4 flex justify-between items-center">
               <div className="flex items-center space-x-4">
                    <Button onClick={onToggleSidebar} className="text-white">
                         {isOpen ? (
                              <Bars3Icon className="h-6 w-6" />
                         ) : (
                              <ArrowRightIcon className="h-6 w-6" />
                         )}
                    </Button>
                    <Breadcrumbs />
               </div>
               <div className="relative" ref={dropdownRef}>
                    <div className="flex gap-2">
                         <Image
                              src="https://cdn.oktaa.my.id/apple-touch-icon.png"
                              alt="Profile"
                              width={25}
                              height={25}
                              className="rounded-full cursor-pointer transition-transform duration-200 hover:scale-110"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                         />
                    </div>
                    <div
                          className={`absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen
                                ? 'opacity-100 translate-y-0 z-50'
                                : 'opacity-0 translate-y-2 pointer-events-none'
                                }`}
                    >
                          <span
                                className="block w-full px-4 py-2 text-xs text-left text-gray-300"
                                title={auth.currentUser?.email || "Guest"}
                          >
                                {auth.currentUser?.email || "Guest"}
                          </span>
                          <button
                                onClick={profileEdit}
                                className="block w-full px-4 py-2 text-left hover:bg-gray-600 transition-colors duration-200"
                          >
                                Profile
                          </button>
                          <button
                                onClick={handleLogout}
                                className="block w-full px-4 py-2 text-left hover:bg-gray-600 transition-colors duration-200"
                          >
                                Logout
                          </button>
                    </div>
               </div>
          </header>
     );
}