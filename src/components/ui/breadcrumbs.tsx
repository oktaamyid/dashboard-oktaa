import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Mapping of path segments to more readable labels
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

     // Remove leading and trailing slashes, split the path
     const pathSegments = pathname
          .replace(/^\/|\/$/g, '')
          .split('/')
          .filter(segment => segment !== '');

     // Generate breadcrumb items
     const breadcrumbItems = pathSegments.map((segment, index) => {
          const label = PATH_LABELS[segment.toLowerCase()] ||
               segment.charAt(0).toUpperCase() + segment.slice(1);

          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;

          return {
               label,
               href,
               isLast
          };
     });

     // If no path segments, show default Dashboard
     if (breadcrumbItems.length === 0) {
          breadcrumbItems.push({
               label: 'Dashboard',
               href: '/dashboard',
               isLast: true
          });
     }

     return (
          <div className="flex items-center space-x-2 text-sm">
               {breadcrumbItems.map((item, index) => (
                    <div key={item.href} className="flex items-center space-x-2">
                         {index > 0 && (
                              <span className="text-gray-400 mx-2">/</span>
                         )}
                         {item.isLast ? (
                              <span className="text-white font-semibold">
                                   {item.label}
                              </span>
                         ) : (
                              <Link
                                   href={item.href}
                                   className="text-gray-300 hover:text-white transition-colors"
                              >
                                   {item.label}
                              </Link>
                         )}
                    </div>
               ))}
          </div>
     );
}