import { 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  deleteDoc,
  updateDoc,
  collection,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import {
  ProfileData,
  ServiceItem,
  EducationItem,
  SkillItem,
  Project,
  Certificate,
  GalleryPhoto,
  SchoolPhoto,
  Testimonial,
  ContactMessage,
  SiteSettings,
  HeaderTabItem,
  HeroFeatureTab
} from '../types';

export interface FullPortfolioData {
  profile?: ProfileData;
  services?: ServiceItem[];
  education?: EducationItem[];
  skills?: SkillItem[];
  projects?: Project[];
  certificates?: Certificate[];
  gallery?: GalleryPhoto[];
  schoolPhotos?: SchoolPhoto[];
  testimonials?: Testimonial[];
  messages?: ContactMessage[];
  settings?: SiteSettings;
  headerTabs?: HeaderTabItem[];
  heroTabs?: HeroFeatureTab[];
  introVideo?: string;
}

/**
 * Fetch all modular data from Firestore with timeout protection
 */
export async function loadAllFromFirestore(): Promise<FullPortfolioData | null> {
  const fetchPromise = async (): Promise<FullPortfolioData | null> => {
    try {
      const result: FullPortfolioData = {};

      // 1. Load singleton docs under /portfolio/*
      const [profileSnap, settingsSnap, tabsSnap, servicesSnap, eduSnap, skillsSnap] = await Promise.allSettled([
        getDoc(doc(db, 'portfolio', 'profile')),
        getDoc(doc(db, 'portfolio', 'settings')),
        getDoc(doc(db, 'portfolio', 'tabs')),
        getDoc(doc(db, 'portfolio', 'services')),
        getDoc(doc(db, 'portfolio', 'education')),
        getDoc(doc(db, 'portfolio', 'skills'))
      ]);

      let hasAnyCloudData = false;

      if (profileSnap.status === 'fulfilled' && profileSnap.value.exists()) {
        result.profile = profileSnap.value.data() as ProfileData;
        hasAnyCloudData = true;
      }
      if (settingsSnap.status === 'fulfilled' && settingsSnap.value.exists()) {
        result.settings = settingsSnap.value.data() as SiteSettings;
        hasAnyCloudData = true;
      }
      if (tabsSnap.status === 'fulfilled' && tabsSnap.value.exists()) {
        const data = tabsSnap.value.data();
        if (data.headerTabs) result.headerTabs = data.headerTabs;
        if (data.heroTabs) result.heroTabs = data.heroTabs;
        hasAnyCloudData = true;
      }
      if (servicesSnap.status === 'fulfilled' && servicesSnap.value.exists()) {
        result.services = servicesSnap.value.data().items as ServiceItem[];
        hasAnyCloudData = true;
      }
      if (eduSnap.status === 'fulfilled' && eduSnap.value.exists()) {
        result.education = eduSnap.value.data().items as EducationItem[];
        hasAnyCloudData = true;
      }
      if (skillsSnap.status === 'fulfilled' && skillsSnap.value.exists()) {
        result.skills = skillsSnap.value.data().items as SkillItem[];
        hasAnyCloudData = true;
      }

      // 2. Load collections
      const [projSnap, certSnap, galSnap, schSnap, testSnap, msgSnap] = await Promise.allSettled([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'certificates')),
        getDocs(collection(db, 'gallery')),
        getDocs(collection(db, 'schoolPhotos')),
        getDocs(collection(db, 'testimonials')),
        getDocs(collection(db, 'messages'))
      ]);

      if (projSnap.status === 'fulfilled' && !projSnap.value.empty) {
        result.projects = projSnap.value.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        hasAnyCloudData = true;
      }
      if (certSnap.status === 'fulfilled' && !certSnap.value.empty) {
        result.certificates = certSnap.value.docs.map(d => ({ id: d.id, ...d.data() } as Certificate));
        hasAnyCloudData = true;
      }
      if (galSnap.status === 'fulfilled' && !galSnap.value.empty) {
        result.gallery = galSnap.value.docs.map(d => ({ id: d.id, ...d.data() } as GalleryPhoto));
        hasAnyCloudData = true;
      }
      if (schSnap.status === 'fulfilled' && !schSnap.value.empty) {
        result.schoolPhotos = schSnap.value.docs.map(d => ({ id: d.id, ...d.data() } as SchoolPhoto));
        hasAnyCloudData = true;
      }
      if (testSnap.status === 'fulfilled' && !testSnap.value.empty) {
        result.testimonials = testSnap.value.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
        hasAnyCloudData = true;
      }
      if (msgSnap.status === 'fulfilled' && !msgSnap.value.empty) {
        result.messages = msgSnap.value.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
        hasAnyCloudData = true;
      }

      // 3. Load intro video from Firestore cloud if available
      try {
        const cloudVideo = await loadIntroVideoFromCloud();
        if (cloudVideo) {
          result.introVideo = cloudVideo;
          hasAnyCloudData = true;
        }
      } catch (err) {
        console.warn('Video cloud load note:', err);
      }

      return hasAnyCloudData ? result : null;
    } catch (error) {
      console.warn('Could not read modular collections from Firestore:', error);
      return null;
    }
  };

  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), 8000);
  });

  return Promise.race([fetchPromise(), timeoutPromise]);
}

/**
 * Recursively cleans any object or array so no `undefined` values exist before Firestore writes.
 * Firestore strictly throws an error when writing `{ someField: undefined }`.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter(item => item !== undefined)
      .map(item => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as any;
  }
  return data;
}

/**
 * Granular sync for Profile
 */
export async function saveProfileToCloud(profile: ProfileData): Promise<void> {
  const path = 'portfolio/profile';
  try {
    const cleanData = sanitizeForFirestore({
      ...profile,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'portfolio', 'profile'), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Granular sync for Settings (excluding heavy binary video)
 */
export async function saveSettingsToCloud(settings: SiteSettings): Promise<void> {
  const path = 'portfolio/settings';
  try {
    const { introVideo, ...cleanSettings } = settings;
    const cleanData = sanitizeForFirestore({
      ...cleanSettings,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'portfolio', 'settings'), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Granular sync for Navigation & Hero Tabs
 */
export async function saveTabsToCloud(headerTabs: HeaderTabItem[], heroTabs: HeroFeatureTab[]): Promise<void> {
  const path = 'portfolio/tabs';
  try {
    const cleanData = sanitizeForFirestore({
      headerTabs,
      heroTabs,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'portfolio', 'tabs'), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Granular sync for Services
 */
export async function saveServicesToCloud(services: ServiceItem[]): Promise<void> {
  const path = 'portfolio/services';
  try {
    const cleanData = sanitizeForFirestore({
      items: services,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'portfolio', 'services'), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Granular sync for Education
 */
export async function saveEducationToCloud(education: EducationItem[]): Promise<void> {
  const path = 'portfolio/education';
  try {
    const cleanData = sanitizeForFirestore({
      items: education,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'portfolio', 'education'), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Granular sync for Skills
 */
export async function saveSkillsToCloud(skills: SkillItem[]): Promise<void> {
  const path = 'portfolio/skills';
  try {
    const cleanData = sanitizeForFirestore({
      items: skills,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'portfolio', 'skills'), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Project CRUD
 */
export async function saveProjectToCloud(project: Project): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    const cleanData = sanitizeForFirestore(project);
    await setDoc(doc(db, 'projects', project.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProjectFromCloud(id: string): Promise<void> {
  const path = `projects/${id}`;
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Certificate CRUD
 */
export async function saveCertificateToCloud(cert: Certificate): Promise<void> {
  const path = `certificates/${cert.id}`;
  try {
    const cleanData = sanitizeForFirestore(cert);
    await setDoc(doc(db, 'certificates', cert.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCertificateFromCloud(id: string): Promise<void> {
  const path = `certificates/${id}`;
  try {
    await deleteDoc(doc(db, 'certificates', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Gallery CRUD
 */
export async function saveGalleryPhotoToCloud(photo: GalleryPhoto): Promise<void> {
  const path = `gallery/${photo.id}`;
  try {
    const cleanData = sanitizeForFirestore(photo);
    await setDoc(doc(db, 'gallery', photo.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteGalleryPhotoFromCloud(id: string): Promise<void> {
  const path = `gallery/${id}`;
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * School Photo CRUD
 */
export async function saveSchoolPhotoToCloud(photo: SchoolPhoto): Promise<void> {
  const path = `schoolPhotos/${photo.id}`;
  try {
    const cleanData = sanitizeForFirestore(photo);
    await setDoc(doc(db, 'schoolPhotos', photo.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSchoolPhotoFromCloud(id: string): Promise<void> {
  const path = `schoolPhotos/${id}`;
  try {
    await deleteDoc(doc(db, 'schoolPhotos', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Testimonial CRUD
 */
export async function saveTestimonialToCloud(item: Testimonial): Promise<void> {
  const path = `testimonials/${item.id}`;
  try {
    const cleanData = sanitizeForFirestore(item);
    await setDoc(doc(db, 'testimonials', item.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTestimonialFromCloud(id: string): Promise<void> {
  const path = `testimonials/${id}`;
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Message CRUD
 */
export async function saveContactMessageToCloud(message: ContactMessage): Promise<void> {
  const path = `messages/${message.id}`;
  try {
    const cleanData = sanitizeForFirestore(message);
    await setDoc(doc(db, 'messages', message.id), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateMessageInCloud(id: string, partial: Partial<ContactMessage>): Promise<void> {
  const path = `messages/${id}`;
  try {
    const cleanData = sanitizeForFirestore(partial);
    await updateDoc(doc(db, 'messages', id), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteMessageFromCloud(id: string): Promise<void> {
  const path = `messages/${id}`;
  try {
    await deleteDoc(doc(db, 'messages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Persistent Chunked Video Cloud Storage
 * Splits larger video data URLs into <= 600KB chunks stored in Firestore 'introVideoChunks'
 * Enables permanent video playback across all devices (Mobile & Computer)
 */
const CHUNK_SIZE = 600000; // ~450KB base64 safe chunk size

export async function saveIntroVideoToCloud(videoDataUrlOrUrl: string): Promise<void> {
  try {
    if (!videoDataUrlOrUrl) return;

    // 1. Direct Web/CDN URL (e.g. https://...)
    if (videoDataUrlOrUrl.startsWith('http://') || videoDataUrlOrUrl.startsWith('https://')) {
      await setDoc(doc(db, 'portfolio', 'videoInfo'), {
        type: 'url',
        url: videoDataUrlOrUrl,
        enabled: true,
        updatedAt: new Date().toISOString()
      });
      return;
    }

    // 2. Base64 / Data URL: Chunk into Firestore subdocuments
    const totalLength = videoDataUrlOrUrl.length;
    const numChunks = Math.ceil(totalLength / CHUNK_SIZE);
    
    // First, save chunks in batches
    for (let i = 0; i < numChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, totalLength);
      const chunkData = videoDataUrlOrUrl.substring(start, end);

      await setDoc(doc(db, 'introVideoChunks', `chunk_${i}`), {
        index: i,
        totalChunks: numChunks,
        data: chunkData,
        updatedAt: new Date().toISOString()
      });
    }

    // Save video metadata index
    await setDoc(doc(db, 'portfolio', 'videoInfo'), {
      type: 'chunks',
      totalChunks: numChunks,
      totalSize: totalLength,
      enabled: true,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error saving intro video to cloud:', err);
    throw err;
  }
}

export async function loadIntroVideoFromCloud(): Promise<string | null> {
  try {
    const infoSnap = await getDoc(doc(db, 'portfolio', 'videoInfo'));
    if (!infoSnap.exists()) return null;

    const info = infoSnap.data();
    if (!info.enabled) return null;

    // If direct web URL
    if (info.type === 'url' && info.url) {
      return info.url;
    }

    // If chunked video in Firestore
    if (info.type === 'chunks' && info.totalChunks > 0) {
      const numChunks = info.totalChunks as number;
      const chunkPromises: Promise<any>[] = [];

      for (let i = 0; i < numChunks; i++) {
        chunkPromises.push(getDoc(doc(db, 'introVideoChunks', `chunk_${i}`)));
      }

      const snapshots = await Promise.all(chunkPromises);
      const chunkDataArray: { index: number; data: string }[] = [];

      for (const snap of snapshots) {
        if (snap.exists()) {
          const c = snap.data();
          chunkDataArray.push({ index: c.index ?? 0, data: c.data || '' });
        }
      }

      // Sort by chunk index
      chunkDataArray.sort((a, b) => a.index - b.index);

      if (chunkDataArray.length === numChunks) {
        const fullVideo = chunkDataArray.map(c => c.data).join('');
        return fullVideo;
      }
    }

    return null;
  } catch (err) {
    console.warn('Error loading intro video from cloud:', err);
    return null;
  }
}

export async function deleteIntroVideoFromCloud(): Promise<void> {
  try {
    const infoSnap = await getDoc(doc(db, 'portfolio', 'videoInfo'));
    if (infoSnap.exists()) {
      const info = infoSnap.data();
      if (info.type === 'chunks' && info.totalChunks) {
        for (let i = 0; i < (info.totalChunks as number); i++) {
          try {
            await deleteDoc(doc(db, 'introVideoChunks', `chunk_${i}`));
          } catch (e) {
            // ignore individual chunk delete error
          }
        }
      }
      await deleteDoc(doc(db, 'portfolio', 'videoInfo'));
    }
  } catch (err) {
    console.warn('Error removing intro video from cloud:', err);
  }
}

/**
 * Seed all initial items as separate docs
 */
export async function seedModularDataToFirestore(data: {
  profile: ProfileData;
  services: ServiceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: Project[];
  certificates: Certificate[];
  gallery: GalleryPhoto[];
  schoolPhotos: SchoolPhoto[];
  testimonials: Testimonial[];
  messages: ContactMessage[];
  settings: SiteSettings;
  headerTabs: HeaderTabItem[];
  heroTabs: HeroFeatureTab[];
}): Promise<void> {
  try {
    await Promise.all([
      saveProfileToCloud(data.profile),
      saveSettingsToCloud(data.settings),
      saveTabsToCloud(data.headerTabs, data.heroTabs),
      saveServicesToCloud(data.services),
      saveEducationToCloud(data.education),
      saveSkillsToCloud(data.skills),
      ...data.projects.map(p => saveProjectToCloud(p)),
      ...data.certificates.map(c => saveCertificateToCloud(c)),
      ...data.gallery.map(g => saveGalleryPhotoToCloud(g)),
      ...data.schoolPhotos.map(s => saveSchoolPhotoToCloud(s)),
      ...data.testimonials.map(t => saveTestimonialToCloud(t)),
      ...data.messages.map(m => saveContactMessageToCloud(m))
    ]);
  } catch (err) {
    console.warn('Initial seeding note:', err);
  }
}
