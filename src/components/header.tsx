import { useState } from 'react';
import { Bars3Icon, ArrowRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import Breadcrumbs from '@/components/ui/breadcrumbs';

export default function Header({
     isOpen,
     onToggleSidebar,
}: {
     isOpen: boolean;
     onToggleSidebar: () => void;
}) {
     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

     const router = useRouter();

     const handleLogout = async () => {
          await signOut(auth);
          deleteCookie("token");
          router.push("/login");
     };

     return (
          <header className="bg-gray-800 shadow p-4 flex justify-between items-center">
               <div className="flex items-center space-x-4">
                    {/* Tombol Toggle Sidebar */}
                    <button onClick={onToggleSidebar} className="text-white">
                         {isOpen ? (
                              <Bars3Icon className="h-6 w-6" />
                         ) : (
                              <ArrowRightIcon className="h-6 w-6" />
                         )}
                    </button>

                    {/* Breadcrumbs */}
                    <Breadcrumbs />
               </div>
               <div className="relative">
                    <Image
                         src="/oktaa-white.svg"
                         alt="Profile"
                         width={25}
                         height={25}
                         className="rounded-full cursor-pointer"
                         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                    {isDropdownOpen && (
                         <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-lg shadow-lg">
                              <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-600">
                                   Logout
                              </button>
                         </div>
                    )}
               </div>
          </header>
     );
}