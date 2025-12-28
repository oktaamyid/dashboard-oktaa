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
     Cog6ToothIcon
} from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { ASSETS } from '@/lib/assets';
import Image from 'next/image';

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
          label: 'Content',
          items: [
               { name: 'Links', icon: LinkIcon, href: '/links' },
               { name: 'Categories', icon: HashtagIcon, href: '/categories' },
               { name: 'API Builder', icon: GlobeAltIcon, href: '/api-builder' },
          ],
     },
     {
          label: 'Portfolio',
          items: [
               { name: 'Projects', icon: FolderIcon, href: '/projects' },
               { name: 'Experiences', icon: BriefcaseIcon, href: '/experiences' },
          ],
     },
     {
          label: 'System',
          items: [
               { name: 'Subdomains', icon: GlobeAltIcon, href: '/subdomains' },
               { name: 'Portal Config', icon: Cog6ToothIcon, href: '/profile' },
          ],
     },
];

const externalItems: SidebarItem[] = [
     { name: 'Open Portal', icon: CloudIcon, href: 'https://hi.oktaa.my.id/portal', target: '_blank' },
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
               <div
                    className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={onCloseSidebar}
               />

               {/* Sidebar Container */}
               <aside
                    className={`
                    fixed md:relative top-0 left-0 bottom-0 z-50 
                    h-screen
                    bg-black border-r border-white/10 
                    transition-all duration-300 ease-in-out
                    flex flex-col
                    ${isOpen ? 'w-72 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
               `}
               >
                    {/* Header Logo */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                         <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-8 h-8 flex items-center justify-center bg-black shrink-0">
                                   <Image
                                        src={ASSETS.LOGO_LIGHT}
                                        alt="Logo"
                                        width={30}
                                        height={30}
                                        className="object-contain"
                                   />
                              </div>
                              <span className={`font-black text-xl tracking-tighter uppercase text-white whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                   OKTAA.
                              </span>
                         </div>

                         {/* Mobile Close */}
                         <button
                              onClick={onCloseSidebar}
                              className="md:hidden text-zinc-500 hover:text-white transition-colors"
                         >
                              <XMarkIcon className="h-6 w-6" />
                         </button>
                    </div>

                    {/* Scrollable Content */}
                    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
                         <div className="flex flex-col gap-6">
                              {/* Dashboard / Main - Top Level */}
                              <div>
                                   <Link
                                        href="/"
                                        className={`
                                             relative flex items-center gap-4 px-6 py-3
                                             text-sm transition-all duration-200
                                             group
                                             ${pathname === '/'
                                                  ? 'text-white bg-white/5'
                                                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/2'
                                             }
                                        `}
                                   >
                                        {pathname === '/' && (
                                             <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                        )}
                                        <ChartPieIcon className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/' ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                                        <span className={`
                                             uppercase tracking-wider text-[11px] whitespace-nowrap transition-all duration-300
                                             ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute left-16 pointer-events-none'}
                                             ${pathname === '/' ? 'font-bold' : 'font-medium'}
                                        `}>
                                             Dashboard
                                        </span>

                                        {!isOpen && (
                                             <div className="absolute left-14 bg-zinc-900 border border-white/10 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                  <span className="text-[10px] uppercase tracking-widest text-white whitespace-nowrap">Dashboard</span>
                                             </div>
                                        )}
                                   </Link>
                              </div>

                              {sidebarGroups.map((group) => {
                                   const isGroupExpanded = isOpen ? expandedGroups[group.label] : true;

                                   return (
                                        <div key={group.label} className="px-0">
                                             {isOpen && (
                                                  <button
                                                       onClick={() => toggleGroup(group.label)}
                                                       className="w-full px-6 mb-2 flex items-center justify-between group"
                                                  >
                                                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                                            {group.label}
                                                       </span>
                                                       {isGroupExpanded ? (
                                                            <ChevronUpIcon className="h-3 w-3 text-zinc-700 group-hover:text-zinc-500" />
                                                       ) : (
                                                            <ChevronDownIcon className="h-3 w-3 text-zinc-700 group-hover:text-zinc-500" />
                                                       )}
                                                  </button>
                                             )}

                                             <div className={`flex flex-col gap-0.5 transition-all duration-300 ${isGroupExpanded ? 'opacity-100 max-h-125' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                                  {group.items.map((item) => {
                                                       const isActive = pathname === item.href;
                                                       return (
                                                            <Link
                                                                 key={item.href}
                                                                 href={item.href}
                                                                 className={`
                                                                       relative flex items-center gap-4 px-6 py-3
                                                                       text-sm transition-all duration-200
                                                                       group
                                                                       ${isActive
                                                                           ? 'text-white bg-white/5'
                                                                           : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/2'
                                                                      }
                                                                  `}
                                                            >
                                                                 {/* Active Indicator Line */}
                                                                 {isActive && (
                                                                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                                                 )}

                                                                 <item.icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`} />

                                                                 <span className={`
                                                                       uppercase tracking-wider text-[11px] whitespace-nowrap transition-all duration-300
                                                                       ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute left-16 pointer-events-none'}
                                                                       ${isActive ? 'font-bold' : 'font-medium'}
                                                                  `}>
                                                                      {item.name}
                                                                 </span>

                                                                 {/* Tooltip for collapsed state */}
                                                                 {!isOpen && (
                                                                      <div className="absolute left-14 bg-zinc-900 border border-white/10 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                                           <span className="text-[10px] uppercase tracking-widest text-white whitespace-nowrap">{item.name}</span>
                                                                      </div>
                                                                 )}
                                                            </Link>
                                                       );
                                                  })}
                                             </div>
                                        </div>
                                   );
                              })}
                         </div>
                    </nav>

                    {/* Footer / External */}
                    <div className="p-4 border-t border-white/10 bg-black shrink-0">
                         {externalItems.map((item) => (
                              <Link
                                   key={item.href}
                                   href={item.href}
                                   target={item.target}
                                   className="flex items-center gap-4 px-6 py-3 text-zinc-500 hover:text-white transition-colors group relative border border-white/5 hover:border-white/20 bg-zinc-900/50"
                              >
                                   <item.icon className="h-4 w-4 shrink-0" />
                                   <span className={`
                                        uppercase tracking-wider text-[10px] font-bold whitespace-nowrap transition-all duration-300
                                        ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
                                   `}>
                                        {item.name}
                                   </span>
                                   {isOpen && <span className="text-[10px] ml-auto opacity-50">↗</span>}

                                   {!isOpen && (
                                        <div className="absolute left-14 bg-zinc-900 border border-white/10 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                             <span className="text-[10px] uppercase tracking-widest text-white whitespace-nowrap">{item.name}</span>
                                        </div>
                                   )}
                              </Link>
                         ))}
                    </div>
               </aside>
          </>
     );
}