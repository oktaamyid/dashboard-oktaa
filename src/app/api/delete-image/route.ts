import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

// Konfigurasi R2
const r2Client = new S3Client({
     region: 'auto',
     endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
     credentials: {
          accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
          secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
     },
});

export async function POST(request: Request) {
     try {
          const { url } = await request.json();
          if (!url) {
               return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
          }

          const key = url.split('/').pop();
          if (!key) {
               return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
          }

          await r2Client.send(new DeleteObjectCommand({
               Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
               Key: key,
          }));

          return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
     } catch (error) {
          console.error('Delete error:', error);
          return NextResponse.json({ error: 'Failed to delete image from Cloudflare R2' }, { status: 500 });
     }
}