import Link from 'next/link';
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
     { name: "Experiences", icon: BriefcaseIcon, href: "/experiences" },
     { name: "Go to Portal", icon: GlobeAltIcon, href: "/portal" }
];

export default function Sidebar({
     isOpen,
     onCloseSidebar
}: {
     isOpen: boolean,
     onCloseSidebar?: () => void
}) {
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
                              {sidebarItems.map((item) => (
                                   <li key={item.name}>
                                        <Link
                                             href={`/dashboard${item.href}`}
                                             className="flex items-center w-full p-3 hover:bg-gray-700 rounded-lg"
                                        >
                                             <item.icon className="h-6 w-6" />
                                             {isOpen && <span className="ml-2">{item.name}</span>}
                                        </Link>
                                   </li>
                              ))}
                         </ul>
                    </nav>
               </div>
          </>
     );
}