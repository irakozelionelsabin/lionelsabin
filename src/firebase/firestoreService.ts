import { 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  deleteDoc,
  updateDoc,
  collection 
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
}

/**
 * Fetch all modular data from Firestore
 */
export async function loadAllFromFirestore(): Promise<FullPortfolioData | null> {
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

    return hasAnyCloudData ? result : null;
  } catch (error) {
    console.warn('Could not read modular collections from Firestore:', error);
    return null;
  }
}

/**
 * Granular sync for Profile
 */
export async function saveProfileToCloud(profile: ProfileData): Promise<void> {
  const path = 'portfolio/profile';
  try {
    await setDoc(doc(db, 'portfolio', 'profile'), {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
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
    await setDoc(doc(db, 'portfolio', 'settings'), {
      ...cleanSettings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
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
    await setDoc(doc(db, 'portfolio', 'tabs'), {
      headerTabs,
      heroTabs,
      updatedAt: new Date().toISOString()
    }, { merge: true });
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
    await setDoc(doc(db, 'portfolio', 'services'), {
      items: services,
      updatedAt: new Date().toISOString()
    });
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
    await setDoc(doc(db, 'portfolio', 'education'), {
      items: education,
      updatedAt: new Date().toISOString()
    });
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
    await setDoc(doc(db, 'portfolio', 'skills'), {
      items: skills,
      updatedAt: new Date().toISOString()
    });
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
    await setDoc(doc(db, 'projects', project.id), project, { merge: true });
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
    await setDoc(doc(db, 'certificates', cert.id), cert, { merge: true });
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
    await setDoc(doc(db, 'gallery', photo.id), photo, { merge: true });
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
    await setDoc(doc(db, 'schoolPhotos', photo.id), photo, { merge: true });
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
    await setDoc(doc(db, 'testimonials', item.id), item, { merge: true });
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
    await setDoc(doc(db, 'messages', message.id), message);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateMessageInCloud(id: string, partial: Partial<ContactMessage>): Promise<void> {
  const path = `messages/${id}`;
  try {
    await updateDoc(doc(db, 'messages', id), partial);
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
