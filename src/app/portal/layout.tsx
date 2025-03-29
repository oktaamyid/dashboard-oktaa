import { Metadata } from 'next';
import { getProfiles } from '@/lib/service';

export async function generateMetadata(): Promise<Metadata> {
     try {
          const profiles = await getProfiles();

          const profile = profiles[0];

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
                    images: 'https://oktaa.my.id/banner.png'
               },
               twitter: {
                    card: 'summary_large_image',
                    title: `@${profile.username} | Oktaa Portal`,
                    description: profile.bio || 'Personal Link Sharing Platform',
                    images: 'https://oktaa.my.id/banner.png'
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