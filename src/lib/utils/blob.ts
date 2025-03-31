import { PutBlobResult } from '@vercel/blob';

export async function uploadToBlob(file: string, contentType: string): Promise<PutBlobResult> {
     const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json',
          },
          body: JSON.stringify({
               file,
               contentType
          }),
     });

     if (!response.ok) {
          throw new Error('Failed to upload file');
     }

     return response.json();
}

export async function deleteFromBlob(url: string): Promise<void> {
     const response = await fetch('/api/delete-blob', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
     });

     if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to delete file');
     }
}