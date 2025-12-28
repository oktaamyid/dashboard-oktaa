import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PATH_LABELS: { [key: string]: string } = {
     'dashboard': 'Dashboard',
     'projects': 'Projects',
     'links': 'Links',
     'experiences': 'Experiences',
     'settings': 'Settings',
     'profile': 'Profile'
};

export default function Breadcrumbs() {
     const pathname = usePathname();

     const pathSegments = pathname
          .replace(/^\/|\/$/g, '')
          .split('/')
          .filter(segment => segment !== '');

     const breadcrumbItems = pathSegments.map((segment, index) => {
          const label = PATH_LABELS[segment.toLowerCase()] ||
               segment.charAt(0).toUpperCase() + segment.slice(1);

          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;

          return { label, href, isLast };
     });

     if (breadcrumbItems.length === 0) {
          breadcrumbItems.push({
               label: 'Dashboard',
               href: '/dashboard',
               isLast: true
          });
     }

     return (
          <div className="breadcrumbs text-[10px] uppercase font-bold tracking-widest text-zinc-500">
               <ul>
                    {breadcrumbItems.map((item, index) => (
                         <li key={item.href}>
                              {item.isLast ? (
                                   <span className="text-white border-b border-white pb-0.5">{item.label}</span>
                              ) : (
                                   <Link href={item.href} className="hover:text-white transition-colors">
                                        {item.label}
                                   </Link>
                              )}
                         </li>
                    ))}
               </ul>
          </div>
     );
}