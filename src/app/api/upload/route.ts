import { compressImage } from '@/lib/utils/compressImage';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
     try {
          const { file, contentType } = await request.json();

          // Check if file is provided
          if (!file) {
               return NextResponse.json({ error: 'No file provided' }, { status: 400 });
          }

          // Extract base64 data
          const base64Data = file.split(';base64,').pop();
          if (!base64Data) {
               return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
          }

          // Convert base64 to buffer
          const buffer = Buffer.from(base64Data, 'base64');

          // Check file size (max 5MB)
          const MAX_SIZE = 5 * 1024 * 1024; // 5MB
          if (buffer.length > MAX_SIZE) {
               // Compress the image if it's too large
               const compressedBuffer = await compressImage(buffer, contentType);

               // If still too large after compression
               if (compressedBuffer.length > MAX_SIZE) {
                    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
               }

               // Upload to Vercel Blob
               const timestamp = Date.now();
               const filename = `profile-${timestamp}.${contentType.split('/')[1]}`;

               const blob = await put(filename, compressedBuffer, {
                    contentType,
                    access: 'public',
               });

               return NextResponse.json(blob);
          }

          // Upload original file if size is acceptable
          const timestamp = Date.now();
          const filename = `profile-${timestamp}.${contentType.split('/')[1]}`;

          const blob = await put(filename, buffer, {
               contentType,
               access: 'public',
          });

          return NextResponse.json(blob);
     } catch (error) {
          console.error('Upload error:', error);
          return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
     }
}

export const config = {
     api: {
          bodyParser: {
               sizeLimit: '10mb',
          },
     },
};