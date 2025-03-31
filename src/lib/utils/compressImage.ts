import sharp from 'sharp';

export async function compressImage(buffer: Buffer, contentType: string): Promise<Buffer> {
     // Compress different image types
     if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
          return sharp(buffer)
               .jpeg({ quality: 80, progressive: true })
               .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
               .toBuffer();
     } else if (contentType.includes('image/png')) {
          return sharp(buffer)
               .png({ compressionLevel: 9, progressive: true })
               .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
               .toBuffer();
     } else if (contentType.includes('image/webp')) {
          return sharp(buffer)
               .webp({ quality: 80 })
               .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
               .toBuffer();
     } else {
          // For other image types, just resize without specific compression
          return sharp(buffer)
               .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
               .toBuffer();
     }
}