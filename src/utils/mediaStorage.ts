// Utility for persistent media storage (videos, high-res media) using IndexedDB
// Provides zero-quota-limit persistent storage in the browser

const DB_NAME = 'ils_portfolio_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_store';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function saveMediaItem(key: string, data: string | Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`IndexedDB save failed for ${key}:`, err);
    // Fallback to localStorage if small
    if (typeof data === 'string' && data.length < 2000000) {
      try {
        localStorage.setItem(`ils_fallback_${key}`, data);
      } catch (e) {
        console.warn('Fallback localStorage also failed:', e);
      }
    }
  }
}

export async function getMediaItem(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          if (typeof result === 'string') {
            resolve(result);
          } else if (result instanceof Blob) {
            resolve(URL.createObjectURL(result));
          } else {
            resolve(null);
          }
        } else {
          // Check fallback localStorage
          const fallback = localStorage.getItem(`ils_fallback_${key}`);
          resolve(fallback);
        }
      };

      request.onerror = () => {
        const fallback = localStorage.getItem(`ils_fallback_${key}`);
        resolve(fallback);
      };
    });
  } catch (err) {
    console.warn(`IndexedDB get failed for ${key}:`, err);
    const fallback = localStorage.getItem(`ils_fallback_${key}`);
    return fallback;
  }
}

export async function removeMediaItem(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (err) {
    console.warn(`IndexedDB remove failed for ${key}:`, err);
  } finally {
    localStorage.removeItem(`ils_fallback_${key}`);
  }
}
