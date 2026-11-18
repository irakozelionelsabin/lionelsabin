import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore, 
  getFirestore,
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc, 
  getDoc 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with resilient long-polling fallback and persistent cache
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, firebaseConfig.firestoreDatabaseId || undefined);
} catch (e) {
  // If already initialized in HMR or testing
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
}

export const db = firestoreInstance;
export const auth = getAuth(app);
export const storage = getStorage(app);

// Connection verification as per Firebase skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'portfolio', 'profile'));
    return snap.exists();
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn('Firestore operating in local/offline cache mode.');
    }
    return false;
  }
}
