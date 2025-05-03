import { Metadata } from 'next';
import { getProfile } from '@/lib/service';

export async function generateMetadata(): Promise<Metadata> {
     try {
          const profile = await getProfile();

          if (!profile) {
               return {
                    title: 'Oktaa Portal',
                    description: 'Personal Link Sharing Platform, a place to share my links and connect with others.'
               };
          }

          return {
               title: `@${profile.username} | Oktaa Portal`,
               description: profile.bio || 'Personal Link Sharing Platform, a place to share my links and connect with others.',
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
               },
               keywords: [
                    'Oktaa Portal',
                    'Oktaa',
                    'Link Sharing',
                    'Personal Link',
                    'Profile',
                    'Social Media',
                    'Bio Link',
                    'Link in Bio',
                    'Oktaa Profile',
                    'Oktaa Link',
                    'Oktaa Bio',
                    'Oktaa Social',
               ],
               authors: [{ name: 'Oktaa', url: 'https://oktaa.my.id' }],
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