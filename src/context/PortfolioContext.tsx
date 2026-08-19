import React, { createContext, useContext, useState, useEffect } from 'react';
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
  sendMessage: (message: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void;
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
};

function safeSave(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Could not save ${key} to localStorage (quota or storage restriction):`, err);
  }
}

function loadStored<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    // Check if previous v1 had profile photo to carry over
    if (key === 'ils_portfolio_profile_v2') {
      const oldProfile = localStorage.getItem('ls_portfolio_profile_v1');
      if (oldProfile) {
        const parsed = JSON.parse(oldProfile);
        if (parsed.profilePhoto) {
          return { ...(fallback as any), profilePhoto: parsed.profilePhoto };
        }
      }
    }
  } catch (err) {
    console.error(`Error loading storage key ${key}:`, err);
  }
  return fallback;
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(() => loadStored(STORAGE_KEYS.PROFILE, initialProfile));
  const [services] = useState<ServiceItem[]>(() => loadStored(STORAGE_KEYS.SERVICES, initialServices));
  const [education] = useState<EducationItem[]>(() => loadStored(STORAGE_KEYS.EDUCATION, initialEducation));
  const [skills] = useState<SkillItem[]>(() => loadStored(STORAGE_KEYS.SKILLS, initialSkills));
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

  // Load persistent video on mount from IndexedDB if present
  useEffect(() => {
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

  // Safe Sync to local storage
  useEffect(() => {
    safeSave(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.PROJECTS, projects);
  }, [projects]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.CERTIFICATES, certificates);
  }, [certificates]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.GALLERY, gallery);
  }, [gallery]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.SCHOOL_PHOTOS, schoolPhotos);
  }, [schoolPhotos]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.TESTIMONIALS, testimonials);
  }, [testimonials]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    // Exclude huge video data from localStorage to prevent quota exhaustion
    const { introVideo, ...settingsToSave } = settings;
    safeSave(STORAGE_KEYS.SETTINGS, settingsToSave);
  }, [settings]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.HEADER_TABS, headerTabs);
  }, [headerTabs]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.HERO_TABS, heroTabs);
  }, [heroTabs]);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const updateSettings = (data: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...data }));
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
    setHeaderTabs(prev => prev.map(tab => tab.id === id ? { ...tab, ...tabData } : tab));
  };

  const resetHeaderTabs = () => {
    setHeaderTabs(initialHeaderTabs);
  };

  const updateHeroTab = (id: string, tabData: Partial<HeroFeatureTab>) => {
    setHeroTabs(prev => prev.map(tab => tab.id === id ? { ...tab, ...tabData } : tab));
  };

  const resetHeroTabs = () => {
    setHeroTabs(initialHeroFeatureTabs);
  };

  // Projects CRUD
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...projectData } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Certificates CRUD
  const addCertificate = (certData: Omit<Certificate, 'id' | 'createdAt'>) => {
    const newCert: Certificate = {
      ...certData,
      id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setCertificates(prev => [newCert, ...prev]);
  };

  const updateCertificate = (id: string, certData: Partial<Certificate>) => {
    setCertificates(prev => prev.map(c => (c.id === id ? { ...c, ...certData } : c)));
  };

  const deleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
  };

  // Gallery CRUD
  const addGalleryPhoto = (photoData: Omit<GalleryPhoto, 'id' | 'createdAt'>) => {
    const newPhoto: GalleryPhoto = {
      ...photoData,
      id: `gal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setGallery(prev => [newPhoto, ...prev]);
  };

  const updateGalleryPhoto = (id: string, photoData: Partial<GalleryPhoto>) => {
    setGallery(prev => prev.map(g => (g.id === id ? { ...g, ...photoData } : g)));
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  // School Photos CRUD
  const addSchoolPhoto = (photoData: Omit<SchoolPhoto, 'id' | 'createdAt'>) => {
    const newPhoto: SchoolPhoto = {
      ...photoData,
      id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setSchoolPhotos(prev => [newPhoto, ...prev]);
  };

  const updateSchoolPhoto = (id: string, photoData: Partial<SchoolPhoto>) => {
    setSchoolPhotos(prev => prev.map(s => (s.id === id ? { ...s, ...photoData } : s)));
  };

  const deleteSchoolPhoto = (id: string) => {
    setSchoolPhotos(prev => prev.filter(s => s.id !== id));
  };

  // Testimonial CRUD
  const addTestimonial = (itemData: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const newTestimonial: Testimonial = {
      ...itemData,
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setTestimonials(prev => [newTestimonial, ...prev]);
  };

  const updateTestimonial = (id: string, itemData: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => (t.id === id ? { ...t, ...itemData } : t)));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // Messages
  const sendMessage = (messageData: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...messageData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      read: false
    };
    setMessages(prev => [newMsg, ...prev]);
  };

  const toggleMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, read: !m.read } : m)));
  };

  const replyToMessage = (id: string, replyText: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === id) {
        const replies = m.replies || [];
        return {
          ...m,
          read: true,
          replies: [...replies, { date: new Date().toLocaleString(), text: replyText }]
        };
      }
      return m;
    }));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
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
