import Link from 'next/link';
import {
     HomeIcon,
     FolderIcon,
     LinkIcon,
     BriefcaseIcon,
} from '@heroicons/react/24/solid';

const sidebarItems = [
     { name: "Overview", icon: HomeIcon, href: "/" },
     { name: "Projects", icon: FolderIcon, href: "/projects" },
     { name: "Links", icon: LinkIcon, href: "/links" },
     { name: "Experiences", icon: BriefcaseIcon, href: "/experiences" },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
     return (
          <div
               className={`bg-gray-800 text-white h-auto ${isOpen ? "w-64" : "w-16"
                    } transition-all duration-300`}
          >
               <nav>
                    <div className="flex items-center justify-center py-6">
                         <Link href="/dashboard" className={`text-2xl font-bold ${isOpen ? "" : "hidden"} `}>Oktaa</Link>
                    </div>
                    <ul className="space-y-2">
                         {sidebarItems.map((item) => (
                              <li key={item.name}>
                                   <Link
                                        href={`/dashboard/${item.href}`}
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
     );
}