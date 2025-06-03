import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

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
          const formData = await request.formData();
          const file = formData.get('image') as File;

          if (!file) {
               console.error('No file provided in FormData');
               return NextResponse.json({ error: 'No file provided' }, { status: 400 });
          }

          if (!file.type.startsWith('image/')) {
               console.error(`Invalid file type: ${file.type}`);
               return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
          }

          if (file.size > 5 * 1024 * 1024) {
               console.error(`File too large: ${file.size} bytes`);
               return NextResponse.json({ error: 'File size exceeds 5MB' }, { status: 400 });
          }

          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          if (!fileExtension) {
               console.error('No file extension found');
               return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
          }

          const fileName = `${uuidv4()}.${fileExtension}`;
          const buffer = Buffer.from(await file.arrayBuffer());

          console.log(`Uploading file: ${fileName}, size: ${file.size}, type: ${file.type}`);

          const command = new PutObjectCommand({
               Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
               Key: fileName,
               Body: buffer,
               ContentType: file.type,
          });

          await r2Client.send(command);
          console.log(`Successfully uploaded file: ${fileName}`);

          const publicUrl = `https://${process.env.CLOUDFLARE_PUBLIC_DOMAIN}/${fileName}`;
          return NextResponse.json({ url: publicUrl }, { status: 200 });
     } catch (error) {
          console.error('Upload error:', error);
          return NextResponse.json({ error: 'Failed to upload image to Cloudflare R2' }, { status: 500 });
     }
}