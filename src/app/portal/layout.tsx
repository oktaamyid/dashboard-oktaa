import { Metadata } from 'next';
import { getProfile } from '@/lib/service';

export async function generateMetadata(): Promise<Metadata> {
     try {
          const profile = await getProfile();

          if (!profile) {
               return {
                    title: 'Oktaa Portal',
                    description: 'Personal Link Sharing Platform'
               };
          }

          return {
               title: `@${profile.username} | Oktaa Portal`,
               description: profile.bio || 'Personal Link Sharing Platform',
               icons: profile.profilePicture ? [{ url: profile.profilePicture }] : [],
               openGraph: {
                    title: `@${profile.username} | Oktaa Portal`,
                    description: profile.bio || 'Personal Link Sharing Platform',
                    images: 'https://cdn.oktaa.my.id/banner.png'
               },
               twitter: {
                    card: 'summary_large_image',
                    title: `@${profile.username} | Oktaa Portal`,
                    description: profile.bio || 'Personal Link Sharing Platform',
                    images: 'https://cdn.oktaa.my.id/banner.png'
               }
          };
     } catch (error) {
          console.error('Gagal mengambil metadata:', error);
          return {
               title: 'Oktaa Portal',
               description: 'Personal Link Sharing Platform'
          };
     }
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
     return (
          <div>
               {children}
          </div>
     );
}