"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
     ChartPieIcon,
     FolderIcon,
     LinkIcon,
     BriefcaseIcon,
     XMarkIcon,
     GlobeAltIcon,
     CloudIcon,
     HashtagIcon,
     ChevronDownIcon,
     ChevronUpIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

interface SidebarItem {
     name: string;
     icon: React.ElementType;
     href: string;
     target?: '_blank';
}

interface SidebarGroup {
     label: string;
     items: SidebarItem[];
}

const sidebarGroups: SidebarGroup[] = [
     {
          label: 'Analytics',
          items: [
               { name: 'Overview', icon: ChartPieIcon, href: '/' },
          ],
     },
     {
          label: 'Content Management',
          items: [
               { name: 'Links', icon: LinkIcon, href: '/links' },
               { name: 'Categories', icon: HashtagIcon, href: '/categories' },
               { name: 'API Builder', icon: GlobeAltIcon, href: '/api-builder' },
          ],
     },
     {
          label: 'Career',
          items: [
               { name: 'Projects', icon: FolderIcon, href: '/projects' },
               { name: 'Experiences', icon: BriefcaseIcon, href: '/experiences' },
          ],
     },
     {
          label: 'Configuration',
          items: [
               { name: 'Subdomains', icon: GlobeAltIcon, href: '/subdomains' },
          ],
     },
];

const externalItems: SidebarItem[] = [
     { name: 'Go to Portal', icon: CloudIcon, href: 'https://hi.oktaa.my.id/portal', target: '_blank' },
];

export default function Sidebar({
     isOpen,
     onCloseSidebar,
}: {
     isOpen: boolean;
     onCloseSidebar?: () => void;
}) {
     const [pathname, setPathname] = useState<string | null>(null);
     const currentPathname = usePathname();
     const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>(
          sidebarGroups.reduce((acc, group) => ({ ...acc, [group.label]: true }), {})
     );

     useEffect(() => {
          setPathname(currentPathname);
     }, [currentPathname]);

     const toggleGroup = (label: string) => {
          setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
     };

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
               <aside
                    className={`fixed top-0 left-0 bottom-0 z-50 bg-gray-800 text-white transition-all duration-300 md:relative min-h-screen overflow-y-auto ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'}`}
               >
                    <nav>
                         <div className="flex items-center justify-between py-6 px-4">
                              <Link
                                   href="/"
                                   className={`text-2xl font-bold ${isOpen ? '' : 'hidden md:block'}`}
                              >
                                   {isOpen ? 'Oktaa' : ''}
                              </Link>
                              {/* Close button for mobile */}
                              {isOpen && (
                                   <button onClick={onCloseSidebar} className="md:hidden">
                                        <XMarkIcon className="h-6 w-6" />
                                   </button>
                              )}
                         </div>

                         <ul className="space-y-4">
                              {sidebarGroups.map((group, groupIndex) => {
                                   const isGroupExpanded = isOpen ? expandedGroups[group.label] : true;

                                   return (
                                        <li key={group.label}>
                                             {isOpen && (
                                                  <button
                                                       onClick={() => toggleGroup(group.label)}
                                                       className="flex items-center w-full px-4 py-2 text-xs font-semibold text-gray-400 uppercase hover:text-gray-200"
                                                  >
                                                       {group.label}
                                                       {isGroupExpanded ? (
                                                            <ChevronUpIcon className="ml-auto h-4 w-4" />
                                                       ) : (
                                                            <ChevronDownIcon className="ml-auto h-4 w-4" />
                                                       )}
                                                  </button>
                                             )}
                                             <ul className="space-y-1">
                                                  {group.items.map((item) => {
                                                       const isActive = pathname === item.href;
                                                       // Show item jika grup terbuka atau item aktif
                                                       if (!isGroupExpanded && !isActive) {
                                                            return null;
                                                       }
                                                       return (
                                                            <li key={item.name} className="px-2">
                                                                 <Link
                                                                      href={item.href}
                                                                      className={`flex items-center w-full p-2 rounded-lg transition-colors ${isActive ? 'bg-gray-600 text-white' : 'hover:bg-gray-700'} ${isOpen ? 'pl-6' : ''}`}
                                                                 >
                                                                      <item.icon className="h-6 w-6" />
                                                                      {isOpen && <span className="ml-3">{item.name}</span>}
                                                                 </Link>
                                                            </li>
                                                       );
                                                  })}
                                             </ul>
                                             {groupIndex < sidebarGroups.length - 1 && isOpen && (
                                                  <hr className="my-4 mx-4 border-gray-600" />
                                             )}
                                        </li>
                                   );
                              })}
                              <li>
                                   <hr className="my-7 border-gray-600" />
                              </li>
                              {externalItems.map((item) => {
                                   const isActive = pathname === item.href;
                                   return (
                                        <li key={item.name} className="px-2">
                                             <Link
                                                  href={item.href}
                                                  target={item.target}
                                                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${isActive ? 'bg-gray-600 text-white' : 'hover:bg-gray-700'}`}
                                             >
                                                  <item.icon className="h-6 w-6" />
                                                  {isOpen && <span className="ml-3">{item.name}</span>}
                                             </Link>
                                        </li>
                                   );
                              })}
                         </ul>
                    </nav>
               </aside>
          </>
     );
}