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

export const initialProfile: ProfileData = {
  fullName: "IRAKOZE Lionel Sabin",
  location: "Rwanda 🇷🇼",
  school: "Giheke TSS (A Level)",
  specialty: "Software & Web Developer",
  status: "✓ Open to Work",
  languages: "English, French, Kinyarwanda",
  whatsapp: "0723519793",
  email: "irakozelionelsabin191@gmail.com",
  heroHeading: "Welcome to IRAKOZE Lionel Sabin site.",
  heroIntro: "Welcome to IRAKOZE Lionel Sabin site.",
  bio: "I am IRAKOZE Lionel Sabin, a passionate and dedicated Software Development student from Rwanda with a strong foundation in modern frontend architecture, robust backend systems, and intelligent digital solutions.",
  profilePhoto: "",
  logoText: "ILS",
  logoImage: ""
};

export const initialServices: ServiceItem[] = [
  {
    id: "serv-1",
    title: "Web Development",
    description: "Responsive, fast websites using PHP, HTML, CSS, JavaScript & React.",
    iconName: "Code2"
  },
  {
    id: "serv-2",
    title: "Backend Architecture",
    description: "Efficient PHP, Node.js, and Supabase services with secure databases.",
    iconName: "Server"
  },
  {
    id: "serv-3",
    title: "Database Design",
    description: "Optimized SQL schemas, real-time data sync, and secure authentication.",
    iconName: "Database"
  },
  {
    id: "serv-4",
    title: "Interactive UI/UX",
    description: "Pixel-perfect modern interfaces with high performance and accessibility.",
    iconName: "Layout"
  }
];

export const initialEducation: EducationItem[] = [
  {
    id: "edu-1",
    school: "L'Éducateur Primary School",
    degree: "Primary Education (8 Years)",
    description: "Completed comprehensive primary education with outstanding academic excellence, building an enduring foundation in mathematics, logic, sciences, and languages.",
    status: "Completed",
    period: "Primary School Foundation",
    highlights: ["Mathematics & Science Foundation", "Critical Logical Thinking", "Academic Excellence"]
  },
  {
    id: "edu-2",
    school: "Petit Séminaire Saint Aloys",
    degree: "Ordinary Level (O'Level)",
    description: "Achieved excellent academic results with rigorous training in sciences, computer studies, discipline, analytical thinking, and team leadership.",
    status: "Completed",
    period: "Ordinary Level (O'Level)",
    highlights: ["Sciences & Computer Fundamentals", "Academic Discipline & Rigor", "Analytical Problem Solving"]
  },
  {
    id: "edu-3",
    school: "Giheke TSS",
    degree: "Advanced Level — Software Development (Current)",
    description: "Specializing in Software Development: mastering PHP, MySQL, JavaScript, React, Node.js, object-oriented programming, database systems, and networking.",
    status: "Current",
    period: "A Level — In Progress",
    highlights: ["Full Stack Web Architecture", "PHP & Database Engineering", "JavaScript & React UI", "Algorithms & System Design"]
  }
];

export const initialSkills: SkillItem[] = [
  // Frontend
  { name: "JavaScript", category: "Frontend", level: "Advanced", icon: "FileCode2", color: "#F7DF1E" },
  { name: "CSS", category: "Frontend", level: "Expert", icon: "Palette", color: "#1572B6" },
  { name: "HTML", category: "Frontend", level: "Expert", icon: "FileCode", color: "#E34F26" },
  { name: "React", category: "Frontend", level: "Proficient", icon: "Atom", color: "#61DAFB" },
  // Backend
  { name: "PHP", category: "Backend", level: "Advanced", icon: "Server", color: "#777BB4" },
  { name: "Node.js", category: "Backend", level: "Proficient", icon: "Cpu", color: "#339933" },
  { name: "Supabase", category: "Backend", level: "Proficient", icon: "Zap", color: "#3ECF8E" },
  { name: "Database & APIs", category: "Backend", level: "Advanced", icon: "Database", color: "#4479A1" },
  // Others
  { name: "GitHub", category: "Others", level: "Advanced", icon: "Github", color: "#FFFFFF" },
  { name: "Volleyball", category: "Others", level: "Passionate Player", icon: "Award", color: "#F59E0B" },
  { name: "English Speaking", category: "Others", level: "Fluent Professional", icon: "Languages", color: "#3B82F6" },
  { name: "AI Analysis", category: "Others", level: "Advanced", icon: "Sparkles", color: "#EC4899" }
];

export const initialProjects: Project[] = [];

export const initialCertificates: Certificate[] = [];

export const initialGallery: GalleryPhoto[] = [];

export const initialSchoolPhotos: SchoolPhoto[] = [];

export const initialTestimonials: Testimonial[] = [];

export const initialMessages: ContactMessage[] = [];

export const initialSettings: SiteSettings = {
  websiteName: "IRAKOZE Lionel Sabin Portfolio",
  websiteTitle: "IRAKOZE Lionel Sabin | Software Developer",
  favicon: "",
  primaryColor: "#00F2FE",
  secondaryColor: "#EC4899",
  accentColor: "#3B82F6",
  backgroundTheme: "electric-liquid",
  enable3DEffects: true,
  enableAnimations: true,
  animationIntensity: "medium",
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    whatsapp: "https://wa.me/250723519793",
    email: "mailto:irakozelionelsabin191@gmail.com"
  },
  contactPhone: "0723519793",
  contactEmail: "irakozelionelsabin191@gmail.com",
  adminPassword: "Lionel191@"
};

export const initialHeaderTabs: HeaderTabItem[] = [
  {
    id: "home",
    defaultTitle: "Home",
    title: "Home",
    href: "#home",
    iconName: "Home",
    image: "",
    imagePosition: "center",
    imageZoom: 100,
    imageOpacity: 55,
    showImageAs: "background"
  },
  {
    id: "aboutme",
    defaultTitle: "About Me",
    title: "About Me",
    href: "#aboutme",
    iconName: "User",
    image: "",
    imagePosition: "center",
    imageZoom: 100,
    imageOpacity: 55,
    showImageAs: "background"
  },
  {
    id: "myskills",
    defaultTitle: "My Skills",
    title: "My Skills",
    href: "#myskills",
    iconName: "Cpu",
    image: "",
    imagePosition: "center",
    imageZoom: 100,
    imageOpacity: 55,
    showImageAs: "background"
  },
  {
    id: "contact",
    defaultTitle: "Contact",
    title: "Contact",
    href: "#contact",
    iconName: "Mail",
    image: "",
    imagePosition: "center",
    imageZoom: 100,
    imageOpacity: 55,
    showImageAs: "background"
  }
];

export const initialHeroFeatureTabs: HeroFeatureTab[] = [
  {
    id: 'ai-ml',
    defaultTitle: 'AI & MACHINE LEARNING',
    defaultShortTitle: 'AI & ML',
    defaultDescription: 'Smart models for real-world problems.',
    title: 'AI & MACHINE LEARNING',
    shortTitle: 'AI & ML',
    description: 'Smart models for real-world problems.',
    iconName: 'brain',
    image: '',
    imagePosition: 'center',
    imageZoom: 100,
    imageOpacity: 60,
    showImageAs: 'background'
  },
  {
    id: 'web-dev',
    defaultTitle: 'WEB DEVELOPMENT',
    defaultShortTitle: 'WEB DEV',
    defaultDescription: 'Responsive & modern web applications.',
    title: 'WEB DEVELOPMENT',
    shortTitle: 'WEB DEV',
    description: 'Responsive & modern web applications.',
    iconName: 'code',
    image: '',
    imagePosition: 'center',
    imageZoom: 100,
    imageOpacity: 60,
    showImageAs: 'background'
  },
  {
    id: 'data-analytics',
    defaultTitle: 'DATA ANALYTICS',
    defaultShortTitle: 'DATA ANALYTICS',
    defaultDescription: 'Turning data into powerful insights.',
    title: 'DATA ANALYTICS',
    shortTitle: 'DATA ANALYTICS',
    description: 'Turning data into powerful insights.',
    iconName: 'barchart',
    image: '',
    imagePosition: 'center',
    imageZoom: 100,
    imageOpacity: 60,
    showImageAs: 'background'
  },
  {
    id: 'chatbots',
    defaultTitle: 'CHATBOT DEVELOPMENT',
    defaultShortTitle: 'AI CHATBOTS',
    defaultDescription: 'Intelligent conversations, better experiences.',
    title: 'CHATBOT DEVELOPMENT',
    shortTitle: 'AI CHATBOTS',
    description: 'Intelligent conversations, better experiences.',
    iconName: 'bot',
    image: '',
    imagePosition: 'center',
    imageZoom: 100,
    imageOpacity: 60,
    showImageAs: 'background'
  }
];

