export interface ProfileData {
  fullName: string;
  location: string;
  school: string;
  specialty: string;
  status: string;
  languages: string;
  whatsapp: string;
  email: string;
  heroHeading: string;
  heroIntro: string;
  bio: string;
  profilePhoto?: string;
  logoText?: string;
  logoImage?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  description: string;
  status: string;
  period: string;
  highlights?: string[];
}

export interface SkillItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Others' | 'Database' | 'Tools & DevOps';
  level: string;
  icon: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  certificateImage?: string;
  certificateId?: string;
  issueDate: string;
  expirationDate?: string;
  description?: string;
  verificationUrl?: string;
  relatedSkills?: string[];
  featured: boolean;
  createdAt: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

export interface SchoolPhoto {
  id: string;
  school: string;
  year: string;
  caption: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  profilePhoto?: string;
  role: string;
  company: string;
  testimonial: string;
  rating: number;
  featured: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
  replies?: Array<{
    date: string;
    text: string;
  }>;
}

export interface SiteSettings {
  websiteName: string;
  websiteTitle: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundTheme: 'electric-liquid' | 'deep-ocean' | 'cyber-magenta';
  enable3DEffects: boolean;
  enableAnimations: boolean;
  animationIntensity: 'low' | 'medium' | 'high';
  socialLinks: {
    github: string;
    linkedin: string;
    whatsapp: string;
    email: string;
  };
  contactPhone: string;
  contactEmail: string;

  // Starting Intro Video Configuration
  introVideo?: string;
  introVideoTitle?: string;
  introVideoEnabled?: boolean;
  introVideoMuted?: boolean;
  introVideoAutoSkipSeconds?: number;
}

export interface HeaderTabItem {
  id: 'home' | 'aboutme' | 'myskills' | 'contact';
  defaultTitle: string;
  title: string;
  image?: string;
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  imageZoom?: number; // 100 - 200%
  imageOpacity?: number; // 20 - 100%
  iconName?: string;
  href: string;
  showImageAs?: 'background' | 'avatar' | 'both';
}

export interface HeroFeatureTab {
  id: 'ai-ml' | 'web-dev' | 'data-analytics' | 'chatbots' | string;
  defaultTitle: string;
  defaultShortTitle: string;
  defaultDescription: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: 'brain' | 'code' | 'barchart' | 'bot' | 'sparkles' | 'database' | 'cpu' | 'globe';
  image?: string;
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  imageZoom?: number; // 100 - 200%
  imageOpacity?: number; // 20 - 100%
  showImageAs?: 'background' | 'avatar' | 'both';
}

export type AdminView = 
  | 'dashboard'
  | 'profile'
  | 'header-tabs'
  | 'hero-tabs'
  | 'intro-video'
  | 'settings'
  | 'projects'
  | 'gallery'
  | 'testimonials'
  | 'school-photos'
  | 'certificates'
  | 'messages';
