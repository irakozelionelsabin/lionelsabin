import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, storage } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { optimizeImage } from '../utils/imageOptimizer';
import { uploadFileToSupabase, deleteFileFromSupabase } from '../supabase/client';

export interface PermanentUploadedImage {
  id: string;
  fileName: string;
  originalName: string;
  downloadURL: string;
  storagePath: string;
  fileSize: number;
  mimeType: string;
  storageEngine: 'supabase-storage' | 'firebase-storage' | 'firestore-cloud';
  uploadedAt: any;
  createdAtIso: string;
}

/**
 * Generates a guaranteed unique, URL-safe filename to prevent overwriting
 * Format: 1728700000000-x8k9p2m-my-photo.jpg
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const sanitized = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-');
  return `${timestamp}-${randomSuffix}-${sanitized}`;
}

/**
 * Uploads an image permanently using Supabase Storage (primary) -> Firebase Cloud Storage -> Firestore Cloud Vault (fallback)
 * and stores its permanent download URL + metadata in Firebase Firestore ('uploads' collection).
 */
export async function uploadImagePermanently(
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<PermanentUploadedImage> {
  const uniqueFileName = generateUniqueFileName(file.name);
  let storagePath = `uploads/${uniqueFileName}`;
  const docId = uniqueFileName.replace(/\./g, '_');

  if (onProgress) onProgress(5);

  let permanentDownloadURL = '';
  let storageEngine: 'supabase-storage' | 'firebase-storage' | 'firestore-cloud' = 'supabase-storage';

  // 1. Attempt direct upload to Supabase Storage ('portfolio-media' bucket)
  const supabaseResult = await uploadFileToSupabase(file, uniqueFileName, 'uploads', onProgress);
  if (supabaseResult?.publicUrl) {
    permanentDownloadURL = supabaseResult.publicUrl;
    storagePath = supabaseResult.storagePath;
    storageEngine = 'supabase-storage';
  } else {
    // 2. Fallback to Firebase Cloud Storage bucket
    storageEngine = 'firebase-storage';
    try {
      permanentDownloadURL = await new Promise<string>((resolve, reject) => {
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file, {
          contentType: file.type || 'image/jpeg',
          customMetadata: {
            originalName: file.name,
            uploadedAt: new Date().toISOString()
          }
        });

        // Safety timeout in case Storage bucket isn't provisioned or rules block unauthenticated writes
        const safetyTimer = setTimeout(() => {
          uploadTask.cancel();
          reject(new Error('Storage bucket timeout - switching to Firestore Cloud vault'));
        }, 5500);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (snapshot.totalBytes > 0) {
              const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 85) + 10;
              if (onProgress) onProgress(Math.min(95, percent));
            }
          },
          (error) => {
            clearTimeout(safetyTimer);
            reject(error);
          },
          async () => {
            clearTimeout(safetyTimer);
            try {
              const httpsUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(httpsUrl);
            } catch (urlErr) {
              reject(urlErr);
            }
          }
        );
      });
    } catch {
      // 3. Seamless Production Fallback: Optimize and store permanently in Firestore Cloud Database
      storageEngine = 'firestore-cloud';
      if (onProgress) onProgress(45);
      permanentDownloadURL = await optimizeImage(file, 1400, 1400, 0.85);
      if (onProgress) onProgress(88);
    }
  }

  const createdAtIso = new Date().toISOString();
  const metadataRecord: PermanentUploadedImage = {
    id: docId,
    fileName: uniqueFileName,
    originalName: file.name,
    downloadURL: permanentDownloadURL,
    storagePath,
    fileSize: file.size,
    mimeType: file.type || 'image/jpeg',
    storageEngine,
    uploadedAt: serverTimestamp(),
    createdAtIso
  };

  // 4. Save permanent metadata into Firebase Firestore 'uploads' collection
  const firestorePath = `uploads/${docId}`;
  try {
    await setDoc(doc(db, 'uploads', docId), metadataRecord);
    if (onProgress) onProgress(100);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, firestorePath);
  }

  return {
    ...metadataRecord,
    uploadedAt: createdAtIso
  };
}

/**
 * Real-time listener for all permanently uploaded images in Firestore ('uploads' collection)
 */
export function subscribeToPermanentUploads(
  onUpdate: (images: PermanentUploadedImage[]) => void
): () => void {
  const path = 'uploads';
  const q = query(collection(db, 'uploads'), orderBy('createdAtIso', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: PermanentUploadedImage[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as PermanentUploadedImage),
        id: docSnap.id
      }));
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (e) {
        console.warn('Could not subscribe to uploads collection:', e);
      }
    }
  );
}

/**
 * Deletes an uploaded image from Firestore and Supabase/Firebase Storage
 */
export async function deletePermanentUpload(image: PermanentUploadedImage): Promise<void> {
  const path = `uploads/${image.id}`;
  try {
    await deleteDoc(doc(db, 'uploads', image.id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }

  if (image.storageEngine === 'supabase-storage' && image.storagePath) {
    await deleteFileFromSupabase(image.storagePath, image.id);
  } else if (image.storageEngine === 'firebase-storage' && image.storagePath) {
    try {
      const fileRef = ref(storage, image.storagePath);
      await deleteObject(fileRef);
    } catch {
      // Ignore if already removed or in Firestore mode
    }
  }
}
