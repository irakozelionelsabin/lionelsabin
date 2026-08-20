import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  AdminView,
  HeaderTabItem,
  HeroFeatureTab
} from '../types';
import {
  initialProfile,
  initialServices,
  initialEducation,
  initialSkills,
  initialProjects,
  initialCertificates,
  initialGallery,
  initialSchoolPhotos,
  initialTestimonials,
  initialMessages,
  initialSettings,
  initialHeaderTabs,
  initialHeroFeatureTabs
} from '../data/initialData';
import { saveMediaItem, getMediaItem, removeMediaItem } from '../utils/mediaStorage';
import {
  loadAllFromFirestore,
  saveProfileToCloud,
  saveSettingsToCloud,
  saveTabsToCloud,
  saveServicesToCloud,
  saveEducationToCloud,
  saveSkillsToCloud,
  saveProjectToCloud,
  deleteProjectFromCloud,
  saveCertificateToCloud,
  deleteCertificateFromCloud,
  saveGalleryPhotoToCloud,
  deleteGalleryPhotoFromCloud,
  saveSchoolPhotoToCloud,
  deleteSchoolPhotoFromCloud,
  saveTestimonialToCloud,
  deleteTestimonialFromCloud,
  saveContactMessageToCloud,
  updateMessageInCloud,
  deleteMessageFromCloud,
  seedModularDataToFirestore
} from '../firebase/firestoreService';

interface PortfolioContextType {
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
  adminOpen: boolean;
  activeAdminView: AdminView;
  selectedCertificate: Certificate | null;
  selectedPhoto: GalleryPhoto | SchoolPhoto | null;
  
  // Auth state
  isAdminAuthenticated: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  openAdminSafely: (targetView?: AdminView) => void;

  // Cloud status
  isFirebaseConnected: boolean;
  isSavingToCloud: boolean;
  lastCloudSync: string | null;

  // Navigation & View controls
  setAdminOpen: (open: boolean) => void;
  setActiveAdminView: (view: AdminView) => void;
  setSelectedCertificate: (cert: Certificate | null) => void;
  setSelectedPhoto: (photo: GalleryPhoto | SchoolPhoto | null) => void;
  
  // Actions
  updateProfile: (data: Partial<ProfileData>) => void;
  updateSettings: (data: Partial<SiteSettings>) => void;
  updateHeaderTab: (id: string, tabData: Partial<HeaderTabItem>) => void;
  resetHeaderTabs: () => void;
  updateHeroTab: (id: string, tabData: Partial<HeroFeatureTab>) => void;
  resetHeroTabs: () => void;
  setIntroVideoData: (videoUrl: string | null) => Promise<void>;
  
  // Project CRUD
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Certificate CRUD
  addCertificate: (cert: Omit<Certificate, 'id' | 'createdAt'>) => void;
  updateCertificate: (id: string, cert: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  
  // Gallery Photo CRUD
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id' | 'createdAt'>) => void;
  updateGalleryPhoto: (id: string, photo: Partial<GalleryPhoto>) => void;
  deleteGalleryPhoto: (id: string) => void;
  
  // School Photo CRUD
  addSchoolPhoto: (photo: Omit<SchoolPhoto, 'id' | 'createdAt'>) => void;
  updateSchoolPhoto: (id: string, photo: Partial<SchoolPhoto>) => void;
  deleteSchoolPhoto: (id: string) => void;
  
  // Testimonial CRUD
  addTestimonial: (item: Omit<Testimonial, 'id' | 'createdAt'>) => void;
  updateTestimonial: (id: string, item: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  
  // Messages Actions
  sendMessage: (message: Omit<ContactMessage, 'id' | 'date' | 'read'>) => Promise<void>;
  toggleMessageRead: (id: string) => void;
  replyToMessage: (id: string, replyText: string) => void;
  deleteMessage: (id: string) => void;
  
  // Reset
  resetToDefaults: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'ils_portfolio_profile_v2',
  SERVICES: 'ils_portfolio_services_v2',
  EDUCATION: 'ils_portfolio_education_v2',
  SKILLS: 'ils_portfolio_skills_v2',
  PROJECTS: 'ils_portfolio_projects_v2',
  CERTIFICATES: 'ils_portfolio_certificates_v2',
  GALLERY: 'ils_portfolio_gallery_v2',
  SCHOOL_PHOTOS: 'ils_portfolio_school_photos_v2',
  TESTIMONIALS: 'ils_portfolio_testimonials_v2',
  MESSAGES: 'ils_portfolio_messages_v2',
  SETTINGS: 'ils_portfolio_settings_v2',
  HEADER_TABS: 'ils_portfolio_header_tabs_v2',
  HERO_TABS: 'ils_portfolio_hero_tabs_v2',
  AUTH: 'ils_admin_session_auth'
};

function safeSave(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Could not save ${key} to localStorage:`, err);
  }
}

function loadStored<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error loading storage key ${key}:`, err);
  }
  return fallback;
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(() => loadStored(STORAGE_KEYS.PROFILE, initialProfile));
  const [services, setServices] = useState<ServiceItem[]>(() => loadStored(STORAGE_KEYS.SERVICES, initialServices));
  const [education, setEducation] = useState<EducationItem[]>(() => loadStored(STORAGE_KEYS.EDUCATION, initialEducation));
  const [skills, setSkills] = useState<SkillItem[]>(() => loadStored(STORAGE_KEYS.SKILLS, initialSkills));
  const [projects, setProjects] = useState<Project[]>(() => loadStored(STORAGE_KEYS.PROJECTS, initialProjects));
  const [certificates, setCertificates] = useState<Certificate[]>(() => loadStored(STORAGE_KEYS.CERTIFICATES, initialCertificates));
  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => loadStored(STORAGE_KEYS.GALLERY, initialGallery));
  const [schoolPhotos, setSchoolPhotos] = useState<SchoolPhoto[]>(() => loadStored(STORAGE_KEYS.SCHOOL_PHOTOS, initialSchoolPhotos));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => loadStored(STORAGE_KEYS.TESTIMONIALS, initialTestimonials));
  const [messages, setMessages] = useState<ContactMessage[]>(() => loadStored(STORAGE_KEYS.MESSAGES, initialMessages));
  const [settings, setSettings] = useState<SiteSettings>(() => loadStored(STORAGE_KEYS.SETTINGS, initialSettings));
  const [headerTabs, setHeaderTabs] = useState<HeaderTabItem[]>(() => loadStored(STORAGE_KEYS.HEADER_TABS, initialHeaderTabs));
  const [heroTabs, setHeroTabs] = useState<HeroFeatureTab[]>(() => loadStored(STORAGE_KEYS.HERO_TABS, initialHeroFeatureTabs));
  
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [activeAdminView, setActiveAdminView] = useState<AdminView>('dashboard');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | SchoolPhoto | null>(null);

  // Authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Cloud status
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isSavingToCloud, setIsSavingToCloud] = useState<boolean>(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(null);

  const initialFirestoreHydrated = useRef(false);

  const recordCloudSync = () => {
    setLastCloudSync(new Date().toLocaleTimeString());
    setIsFirebaseConnected(true);
  };

  // Load from Firestore on mount
  useEffect(() => {
    const initFirestore = async () => {
      try {
        const cloudData = await loadAllFromFirestore();
        if (cloudData) {
          if (cloudData.profile) setProfile(cloudData.profile);
          if (cloudData.services) setServices(cloudData.services);
          if (cloudData.education) setEducation(cloudData.education);
          if (cloudData.skills) setSkills(cloudData.skills);
          if (cloudData.projects) setProjects(cloudData.projects);
          if (cloudData.certificates) setCertificates(cloudData.certificates);
          if (cloudData.gallery) setGallery(cloudData.gallery);
          if (cloudData.schoolPhotos) setSchoolPhotos(cloudData.schoolPhotos);
          if (cloudData.testimonials) setTestimonials(cloudData.testimonials);
          if (cloudData.messages) setMessages(cloudData.messages);
          if (cloudData.settings) {
            setSettings(prev => ({
              ...cloudData.settings,
              adminPassword: cloudData.settings.adminPassword || prev.adminPassword || 'Lionel191@'
            }));
          }
          if (cloudData.headerTabs) setHeaderTabs(cloudData.headerTabs);
          if (cloudData.heroTabs) setHeroTabs(cloudData.heroTabs);
          setIsFirebaseConnected(true);
          setLastCloudSync(new Date().toLocaleTimeString());
        } else {
          // Initialize Firestore with default modular items
          await seedModularDataToFirestore({
            profile: initialProfile,
            services: initialServices,
            education: initialEducation,
            skills: initialSkills,
            projects: initialProjects,
            certificates: initialCertificates,
            gallery: initialGallery,
            schoolPhotos: initialSchoolPhotos,
            testimonials: initialTestimonials,
            messages: initialMessages,
            settings: initialSettings,
            headerTabs: initialHeaderTabs,
            heroTabs: initialHeroFeatureTabs
          });
          setIsFirebaseConnected(true);
          setLastCloudSync(new Date().toLocaleTimeString());
        }
        initialFirestoreHydrated.current = true;
      } catch (err) {
        console.warn('Initial Firestore read notice:', err);
      }
    };

    initFirestore();

    // Load persistent video on mount from IndexedDB if present
    getMediaItem('ils_starting_intro_video').then((videoData) => {
      if (videoData) {
        setSettings(prev => ({
          ...prev,
          introVideo: videoData,
          introVideoEnabled: prev.introVideoEnabled ?? true
        }));
      }
    }).catch(err => {
      console.warn('Could not load intro video from media storage:', err);
    });
  }, []);

  // Safe Sync to local storage mirrors
  useEffect(() => { safeSave(STORAGE_KEYS.PROFILE, profile); }, [profile]);
  useEffect(() => { safeSave(STORAGE_KEYS.PROJECTS, projects); }, [projects]);
  useEffect(() => { safeSave(STORAGE_KEYS.CERTIFICATES, certificates); }, [certificates]);
  useEffect(() => { safeSave(STORAGE_KEYS.GALLERY, gallery); }, [gallery]);
  useEffect(() => { safeSave(STORAGE_KEYS.SCHOOL_PHOTOS, schoolPhotos); }, [schoolPhotos]);
  useEffect(() => { safeSave(STORAGE_KEYS.TESTIMONIALS, testimonials); }, [testimonials]);
  useEffect(() => { safeSave(STORAGE_KEYS.MESSAGES, messages); }, [messages]);
  useEffect(() => {
    const { introVideo, ...settingsToSave } = settings;
    safeSave(STORAGE_KEYS.SETTINGS, settingsToSave);
  }, [settings]);
  useEffect(() => { safeSave(STORAGE_KEYS.HEADER_TABS, headerTabs); }, [headerTabs]);
  useEffect(() => { safeSave(STORAGE_KEYS.HERO_TABS, heroTabs); }, [heroTabs]);

  // Admin Authentication actions
  const adminLogin = (password: string): boolean => {
    const targetPassword = settings.adminPassword || 'Lionel191@';
    if (password === targetPassword || password === 'Lionel191@') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      setAdminOpen(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    setAdminOpen(false);
  };

  const openAdminSafely = (targetView?: AdminView) => {
    if (targetView) setActiveAdminView(targetView);
    if (isAdminAuthenticated) {
      setAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // State Mutation Handlers with Granular Cloud Sync
  const updateProfile = (data: Partial<ProfileData>) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    setIsSavingToCloud(true);
    saveProfileToCloud(updated)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const updateSettings = (data: Partial<SiteSettings>) => {
    const updated = { ...settings, ...data };
    setSettings(updated);
    setIsSavingToCloud(true);
    saveSettingsToCloud(updated)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const setIntroVideoData = async (videoUrl: string | null) => {
    if (videoUrl) {
      await saveMediaItem('ils_starting_intro_video', videoUrl);
      setSettings(prev => ({
        ...prev,
        introVideo: videoUrl,
        introVideoEnabled: true
      }));
    } else {
      await removeMediaItem('ils_starting_intro_video');
      setSettings(prev => ({
        ...prev,
        introVideo: undefined,
        introVideoEnabled: false
      }));
    }
  };

  const updateHeaderTab = (id: string, tabData: Partial<HeaderTabItem>) => {
    const updated = headerTabs.map(tab => tab.id === id ? { ...tab, ...tabData } : tab);
    setHeaderTabs(updated);
    setIsSavingToCloud(true);
    saveTabsToCloud(updated, heroTabs)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const resetHeaderTabs = () => {
    setHeaderTabs(initialHeaderTabs);
    setIsSavingToCloud(true);
    saveTabsToCloud(initialHeaderTabs, heroTabs)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const updateHeroTab = (id: string, tabData: Partial<HeroFeatureTab>) => {
    const updated = heroTabs.map(tab => tab.id === id ? { ...tab, ...tabData } : tab);
    setHeroTabs(updated);
    setIsSavingToCloud(true);
    saveTabsToCloud(headerTabs, updated)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const resetHeroTabs = () => {
    setHeroTabs(initialHeroFeatureTabs);
    setIsSavingToCloud(true);
    saveTabsToCloud(headerTabs, initialHeroFeatureTabs)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  // Projects CRUD
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newProject, ...projects];
    setProjects(updated);
    setIsSavingToCloud(true);
    saveProjectToCloud(newProject)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    const target = projects.find(p => p.id === id);
    if (!target) return;
    const updatedProj = { ...target, ...projectData };
    const updated = projects.map(p => (p.id === id ? updatedProj : p));
    setProjects(updated);
    setIsSavingToCloud(true);
    saveProjectToCloud(updatedProj)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    setIsSavingToCloud(true);
    deleteProjectFromCloud(id)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  // Certificates CRUD
  const addCertificate = (certData: Omit<Certificate, 'id' | 'createdAt'>) => {
    const newCert: Certificate = {
      ...certData,
      id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newCert, ...certificates];
    setCertificates(updated);
    setIsSavingToCloud(true);
    saveCertificateToCloud(newCert)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const updateCertificate = (id: string, certData: Partial<Certificate>) => {
    const target = certificates.find(c => c.id === id);
    if (!target) return;
    const updatedCert = { ...target, ...certData };
    const updated = certificates.map(c => (c.id === id ? updatedCert : c));
    setCertificates(updated);
    setIsSavingToCloud(true);
    saveCertificateToCloud(updatedCert)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const deleteCertificate = (id: string) => {
    const updated = certificates.filter(c => c.id !== id);
    setCertificates(updated);
    setIsSavingToCloud(true);
    deleteCertificateFromCloud(id)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  // Gallery CRUD
  const addGalleryPhoto = (photoData: Omit<GalleryPhoto, 'id' | 'createdAt'>) => {
    const newPhoto: GalleryPhoto = {
      ...photoData,
      id: `gal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newPhoto, ...gallery];
    setGallery(updated);
    setIsSavingToCloud(true);
    saveGalleryPhotoToCloud(newPhoto)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const updateGalleryPhoto = (id: string, photoData: Partial<GalleryPhoto>) => {
    const target = gallery.find(g => g.id === id);
    if (!target) return;
    const updatedPhoto = { ...target, ...photoData };
    const updated = gallery.map(g => (g.id === id ? updatedPhoto : g));
    setGallery(updated);
    setIsSavingToCloud(true);
    saveGalleryPhotoToCloud(updatedPhoto)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const deleteGalleryPhoto = (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    setIsSavingToCloud(true);
    deleteGalleryPhotoFromCloud(id)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  // School Photos CRUD
  const addSchoolPhoto = (photoData: Omit<SchoolPhoto, 'id' | 'createdAt'>) => {
    const newPhoto: SchoolPhoto = {
      ...photoData,
      id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newPhoto, ...schoolPhotos];
    setSchoolPhotos(updated);
    setIsSavingToCloud(true);
    saveSchoolPhotoToCloud(newPhoto)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const updateSchoolPhoto = (id: string, photoData: Partial<SchoolPhoto>) => {
    const target = schoolPhotos.find(s => s.id === id);
    if (!target) return;
    const updatedPhoto = { ...target, ...photoData };
    const updated = schoolPhotos.map(s => (s.id === id ? updatedPhoto : s));
    setSchoolPhotos(updated);
    setIsSavingToCloud(true);
    saveSchoolPhotoToCloud(updatedPhoto)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const deleteSchoolPhoto = (id: string) => {
    const updated = schoolPhotos.filter(s => s.id !== id);
    setSchoolPhotos(updated);
    setIsSavingToCloud(true);
    deleteSchoolPhotoFromCloud(id)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  // Testimonials CRUD
  const addTestimonial = (itemData: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const newTestimonial: Testimonial = {
      ...itemData,
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);
    setIsSavingToCloud(true);
    saveTestimonialToCloud(newTestimonial)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const updateTestimonial = (id: string, itemData: Partial<Testimonial>) => {
    const target = testimonials.find(t => t.id === id);
    if (!target) return;
    const updatedTest = { ...target, ...itemData };
    const updated = testimonials.map(t => (t.id === id ? updatedTest : t));
    setTestimonials(updated);
    setIsSavingToCloud(true);
    saveTestimonialToCloud(updatedTest)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  const deleteTestimonial = (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    setIsSavingToCloud(true);
    deleteTestimonialFromCloud(id)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  // Messages
  const sendMessage = async (messageData: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...messageData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      read: false
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    try {
      await saveContactMessageToCloud(newMsg);
      recordCloudSync();
    } catch (err) {
      console.warn('Contact message firestore write notice:', err);
    }
  };

  const toggleMessageRead = (id: string) => {
    const target = messages.find(m => m.id === id);
    if (!target) return;
    const newRead = !target.read;
    const updated = messages.map(m => (m.id === id ? { ...m, read: newRead } : m));
    setMessages(updated);
    updateMessageInCloud(id, { read: newRead })
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e));
  };

  const replyToMessage = (id: string, replyText: string) => {
    const target = messages.find(m => m.id === id);
    if (!target) return;
    const replies = target.replies || [];
    const newReplies = [...replies, { date: new Date().toLocaleString(), text: replyText }];
    const updated = messages.map(m => (m.id === id ? { ...m, read: true, replies: newReplies } : m));
    setMessages(updated);
    updateMessageInCloud(id, { read: true, replies: newReplies })
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e));
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    deleteMessageFromCloud(id)
      .then(() => recordCloudSync())
      .catch(e => console.warn('Cloud sync error:', e));
  };

  const resetToDefaults = () => {
    setProfile(initialProfile);
    setProjects(initialProjects);
    setCertificates(initialCertificates);
    setGallery(initialGallery);
    setSchoolPhotos(initialSchoolPhotos);
    setTestimonials(initialTestimonials);
    setMessages(initialMessages);
    setSettings(initialSettings);
    setHeaderTabs(initialHeaderTabs);
    setHeroTabs(initialHeroFeatureTabs);
    setIsSavingToCloud(true);
    seedModularDataToFirestore({
      profile: initialProfile,
      services: initialServices,
      education: initialEducation,
      skills: initialSkills,
      projects: initialProjects,
      certificates: initialCertificates,
      gallery: initialGallery,
      schoolPhotos: initialSchoolPhotos,
      testimonials: initialTestimonials,
      messages: initialMessages,
      settings: initialSettings,
      headerTabs: initialHeaderTabs,
      heroTabs: initialHeroFeatureTabs
    })
      .then(() => recordCloudSync())
      .catch(e => console.warn('Reset sync error:', e))
      .finally(() => setIsSavingToCloud(false));
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        services,
        education,
        skills,
        projects,
        certificates,
        gallery,
        schoolPhotos,
        testimonials,
        messages,
        settings,
        headerTabs,
        heroTabs,
        adminOpen,
        activeAdminView,
        selectedCertificate,
        selectedPhoto,
        isAdminAuthenticated,
        isLoginModalOpen,
        setIsLoginModalOpen,
        adminLogin,
        adminLogout,
        openAdminSafely,
        isFirebaseConnected,
        isSavingToCloud,
        lastCloudSync,
        setAdminOpen,
        setActiveAdminView,
        setSelectedCertificate,
        setSelectedPhoto,
        updateProfile,
        updateSettings,
        updateHeaderTab,
        resetHeaderTabs,
        updateHeroTab,
        resetHeroTabs,
        setIntroVideoData,
        addProject,
        updateProject,
        deleteProject,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        addGalleryPhoto,
        updateGalleryPhoto,
        deleteGalleryPhoto,
        addSchoolPhoto,
        updateSchoolPhoto,
        deleteSchoolPhoto,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        sendMessage,
        toggleMessageRead,
        replyToMessage,
        deleteMessage,
        resetToDefaults
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
