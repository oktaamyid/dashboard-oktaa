import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { compressImage } from '@/lib/utils/compressImage';

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
               return NextResponse.json({ error: 'No file provided' }, { status: 400 });
          }

          if (!file.type.startsWith('image/')) {
               return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
          }

          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          if (!fileExtension) {
               return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
          }

          const fileName = `${uuidv4()}.${fileExtension}`;
          let buffer: Buffer = Buffer.from(await file.arrayBuffer());

          // Optimize: Compress image before upload
          try {
               buffer = await compressImage(buffer, file.type);
          } catch (compressError) {
               console.error('Compression failed, uploading original:', compressError);
               // Continue with original buffer if compression fails
          }

          const command = new PutObjectCommand({
               Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
               Key: fileName,
               Body: buffer,
               ContentType: file.type,
          });

          await r2Client.send(command);

          const publicUrl = `https://${process.env.CLOUDFLARE_PUBLIC_DOMAIN}/${fileName}`;
          return NextResponse.json({ url: publicUrl }, { status: 200 });
     } catch (error) {
          console.error('Upload error:', error);
          return NextResponse.json({ error: 'Failed to upload image to Cloudflare R2' }, { status: 500 });
     }
}