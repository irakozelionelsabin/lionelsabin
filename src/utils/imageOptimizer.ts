/**
 * Client-side safe image compressor & optimizer
 * Preserves PNG transparency for transparent cutout photos/logos
 * and compresses photos so they save cleanly without storage errors.
 */
export async function optimizeImage(
  fileOrDataUrl: File | string,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    // Detect if input is PNG / transparent
    let isPng = false;
    if (typeof fileOrDataUrl !== 'string' && fileOrDataUrl instanceof File) {
      isPng = fileOrDataUrl.type === 'image/png' || fileOrDataUrl.name.toLowerCase().endsWith('.png');
    } else if (typeof fileOrDataUrl === 'string') {
      isPng = fileOrDataUrl.startsWith('data:image/png');
    }

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

        if (src.startsWith('data:image/png')) {
          isPng = true;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            let { width, height } = img;

            // If image is already reasonably sized and is a transparent PNG under ~400KB, keep as is
            if (isPng && src.length < 500000 && width <= maxWidth && height <= maxHeight) {
              resolve(src);
              return;
            }

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

            // Explicitly clear rect so PNG transparency is 100% preserved
            ctx.clearRect(0, 0, width, height);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            if (isPng) {
              // Preserve PNG format without background
              const compressedPng = canvas.toDataURL('image/png');
              resolve(compressedPng);
            } else {
              // Standard JPEG compression for opaque camera photos
              let compressed = canvas.toDataURL('image/jpeg', quality);

              if (compressed.length > 450000) {
                const secondCanvas = document.createElement('canvas');
                secondCanvas.width = Math.round(width * 0.75);
                secondCanvas.height = Math.round(height * 0.75);
                const secondCtx = secondCanvas.getContext('2d');
                if (secondCtx) {
                  secondCtx.imageSmoothingEnabled = true;
                  secondCtx.imageSmoothingQuality = 'medium';
                  secondCtx.drawImage(canvas, 0, 0, secondCanvas.width, secondCanvas.height);
                  compressed = secondCanvas.toDataURL('image/jpeg', 0.72);
                }
              }

              resolve(compressed);
            }
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
