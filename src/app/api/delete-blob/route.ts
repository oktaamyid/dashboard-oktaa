import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
     try {
          const { url } = await request.json();

          if (!url) {
               return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
          }

          try {
               const urlObj = new URL(url);
               const pathname = urlObj.pathname.startsWith('/') ? urlObj.pathname : `/${urlObj.pathname}`;

               await del(pathname);
               return NextResponse.json({ success: true });
          } catch (error) {
               console.error('Error deleting blob:', error);
               return NextResponse.json({ error: 'Invalid URL or deletion failed' }, { status: 400 });
          }
     } catch (error) {
          console.error('Delete blob error:', error);
          return NextResponse.json({ error: 'Server error' }, { status: 500 });
     }
}