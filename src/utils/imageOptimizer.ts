/**
 * Client-side safe image compressor & optimizer
 * Resizes high-resolution camera photos to web-optimal dimensions (~1000-1280px)
 * and compresses them so they save instantly in browser state without triggering
 * localStorage QuotaExceededError or blank-page memory issues.
 */
export async function optimizeImage(
  fileOrDataUrl: File | string,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    // If it's a file, convert to object URL or FileReader first
    const getSourceUrl = (): Promise<string> => {
      if (typeof fileOrDataUrl === 'string') {
        return Promise.resolve(fileOrDataUrl);
      }
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = () => rej(new Error('Failed to read file'));
        reader.readAsDataURL(fileOrDataUrl);
      });
    };

    getSourceUrl()
      .then((src) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            let { width, height } = img;

            // If image is already smaller than max dimensions, check if we need compression
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(src); // fallback to original
              return;
            }

            // High-quality image rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to web-friendly JPEG
            const mimeType = 'image/jpeg';
            const compressed = canvas.toDataURL(mimeType, quality);
            resolve(compressed);
          } catch (err) {
            console.warn('Image optimization canvas error, fallback to raw:', err);
            resolve(src);
          }
        };

        img.onerror = () => {
          resolve(src);
        };

        img.src = src;
      })
      .catch((err) => {
        console.error('Error in optimizeImage:', err);
        resolve('');
      });
  });
}
