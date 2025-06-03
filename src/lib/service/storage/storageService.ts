export async function uploadImage(file: File): Promise<{ url: string }> {
     try {
          if (!file.type.startsWith('image/')) {
               throw new Error('File must be an image');
          }
          if (file.size > 5 * 1024 * 1024) {
               throw new Error('File size exceeds 5MB');
          }

          const formData = new FormData();
          formData.append('image', file);

          const res = await fetch('/api/upload-image', {
               method: 'POST',
               body: formData,
               cache: 'no-store',
          });

          if (!res.ok) {
               const error = await res.json();
               console.error('Upload API error:', error);
               throw new Error('Failed to upload image to Cloudflare R2');
          }

          const data = await res.json();
          console.log('Uploaded image URL:', data.url);
          return data;
     } catch (error) {
          console.error('Upload service error:', error);
          throw error;
     }
}

export async function deleteImage(url: string): Promise<void> {
     try {
          if (!url) {
               throw new Error('No URL provided');
          }

          const res = await fetch('/api/delete-image', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ url }),
               cache: 'no-store',
          });

          if (!res.ok) {
               const error = await res.json();
               console.error('Delete API error:', error);
               throw new Error('Failed to delete image from Cloudflare R2');
          }

          console.log('Deleted image:', url);
     } catch (error) {
          console.error('Delete service error:', error);
          throw error;
     }
}