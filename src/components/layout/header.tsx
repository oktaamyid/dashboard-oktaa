import { useState, useRef, useEffect } from 'react';
import { Bars3Icon, ArrowRightIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { useRouter, usePathname } from "next/navigation";
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
     const dropdownRef = useRef<HTMLDivElement>(null);
     const router = useRouter();

     // Close dropdown when clicking outside
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

     // Close dropdown on route change
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
          router.push("/profile");
     };

     return (
          <header className={`navbar bg-black/50 backdrop-blur-md border-b border-white/10 min-h-20 px-6 sticky top-0 z-40 transition-all duration-300`}>
               {/* Left Section: Toggle & Breadcrumbs */}
               <div className="flex-1 gap-4">
                    <button
                         onClick={onToggleSidebar}
                         className="btn btn-square btn-ghost btn-sm text-white hover:bg-white/10 rounded-none"
                    >
                         {isOpen ? (
                              <Bars3Icon className="h-5 w-5" />
                         ) : (
                              <ArrowRightIcon className="h-5 w-5" />
                         )}
                    </button>

                    <div className="hidden md:block">
                         <Breadcrumbs />
                    </div>
               </div>

               {/* Right Section: System Config Dropdown */}
               <div className="flex-none gap-2" ref={dropdownRef}>
                    <div className="relative">
                         <button
                              type="button"
                              className="btn btn-ghost rounded-none text-white hover:bg-white/10 flex items-center gap-3 px-3 normal-case"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                         >
                              {/* Simple Gear Icon for System Config */}
                              <div className="w-8 h-8 rounded-none border border-white/20 flex items-center justify-center bg-black transition-colors hover:border-white">
                                   <Cog6ToothIcon className="h-4 w-4 text-white" />
                              </div>
                         </button>

                         {/* Dropdown Content */}
                         {isDropdownOpen && (
                              <div
                                   className="absolute right-0 top-full mt-2 w-64 bg-black border border-white/10 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200"
                              >
                                   <div className="border-b border-white/10 px-4 py-3 bg-zinc-900/50">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">Authenticated As</span>
                                        <span className="block text-white text-xs font-bold truncate font-mono">
                                             {auth.currentUser?.email || "Administrator"}
                                        </span>
                                   </div>

                                   <div className="py-2">
                                        <button
                                             onClick={profileEdit}
                                             className="w-full text-left hover:bg-white/5 text-zinc-300 hover:text-white font-bold uppercase text-[10px] tracking-wider py-3 px-4 flex gap-3 items-center transition-colors"
                                        >
                                             <Cog6ToothIcon className="h-4 w-4" />
                                             System Configuration
                                        </button>

                                        <button
                                             onClick={handleLogout}
                                             className="w-full text-left hover:bg-red-950/30 text-red-500 hover:text-red-400 font-bold uppercase text-[10px] tracking-wider py-3 px-4 flex gap-3 items-center transition-colors mt-2 border-t border-white/5"
                                        >
                                             <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                                             Terminate Session
                                        </button>
                                   </div>
                              </div>
                         )}
                    </div>
               </div>
          </header>
     );
}