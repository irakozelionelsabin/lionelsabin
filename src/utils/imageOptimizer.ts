/**
 * Client-side safe image compressor & optimizer
 * Resizes camera photos to web-optimal dimensions (~800-960px)
 * and compresses them so they save instantly in Firestore and browser storage
 * without triggering Firestore 1MB document limit or storage errors.
 */
export async function optimizeImage(
  fileOrDataUrl: File | string,
  maxWidth = 960,
  maxHeight = 960,
  quality = 0.78
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
        if (!src) {
          resolve('');
          return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            let { width, height } = img;

            // Constrain dimensions
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
              resolve(src);
              return;
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to web-friendly JPEG
            let compressed = canvas.toDataURL('image/jpeg', quality);

            // If still unusually large (>350KB base64), do a second lighter pass
            if (compressed.length > 450000) {
              const secondCanvas = document.createElement('canvas');
              secondCanvas.width = Math.round(width * 0.75);
              secondCanvas.height = Math.round(height * 0.75);
              const secondCtx = secondCanvas.getContext('2d');
              if (secondCtx) {
                secondCtx.imageSmoothingEnabled = true;
                secondCtx.imageSmoothingQuality = 'medium';
                secondCtx.drawImage(canvas, 0, 0, secondCanvas.width, secondCanvas.height);
                compressed = secondCanvas.toDataURL('image/jpeg', 0.70);
              }
            }

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
