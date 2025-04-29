import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Tambahkan ini
import {
     ChartPieIcon,
     FolderIcon,
     LinkIcon,
     BriefcaseIcon,
     XMarkIcon,
     GlobeAltIcon
} from '@heroicons/react/24/solid';

const sidebarItems = [
     { name: "Overview", icon: ChartPieIcon, href: "/" },
     { name: "Projects", icon: FolderIcon, href: "/projects" },
     { name: "Links", icon: LinkIcon, href: "/links" },
     { name: "Experiences", icon: BriefcaseIcon, href: "/experiences" }
];

export default function Sidebar({
     isOpen,
     onCloseSidebar
}: {
     isOpen: boolean,
     onCloseSidebar?: () => void
}) {
     const pathname = usePathname(); // Dapatkan path saat ini

     return (
          <>
               {/* Mobile Overlay */}
               {isOpen && (
                    <div
                         className="fixed inset-0 bg-black/50 z-40 md:hidden"
                         onClick={onCloseSidebar}
                    />
               )}

               {/* Sidebar */}
               <div
                    className={`
          fixed top-0 left-0 bottom-0 z-50
          bg-gray-800 text-white 
          transition-all duration-300
          md:relative
          min-h-screen
          overflow-y-auto
          ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'}
        `}
               >
                    <nav>
                         <div className="flex items-center justify-between py-6 px-4">
                              <Link
                                   href="/dashboard"
                                   className={`text-2xl font-bold ${isOpen ? "" : "hidden md:block"}`}
                              >
                                   {isOpen ? 'Oktaa' : ''}
                              </Link>

                              {/* Close button for mobile */}
                              {isOpen && (
                                   <button
                                        onClick={onCloseSidebar}
                                        className="md:hidden"
                                   >
                                        <XMarkIcon className="h-6 w-6" />
                                   </button>
                              )}
                         </div>

                         <ul className="space-y-2">
                              {sidebarItems.map((item) => {
                                   // Tentukan apakah item aktif berdasarkan pathname
                                   const isActive = pathname === `/dashboard${item.href}` ||
                                        (item.href === '/' && pathname === '/dashboard');
                                   return (
                                        <li key={item.name} className='px-2'>
                                             <Link
                                                  href={`/dashboard${item.href}`}
                                                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                                                       }`}
                                             >
                                                  <item.icon className="h-6 w-6" />
                                                  {isOpen && <span className="ml-2">{item.name}</span>}
                                             </Link>
                                        </li>
                                   );
                              })}
                              {/* Pemisah */}
                              <li>
                                   <hr className="my-4 border-gray-600" />
                              </li>
                              <li className='px-2'>
                                   <Link
                                        href={`/portal`}
                                        className={`flex items-center w-full p-3 rounded-lg transition-colors ${pathname === '/portal' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                                             }`}
                                   >
                                        <GlobeAltIcon className="h-6 w-6" />
                                        {isOpen && <span className="ml-2">Go to Portal</span>}
                                   </Link>
                              </li>
                         </ul>
                    </nav>
               </div>
          </>
     );
}