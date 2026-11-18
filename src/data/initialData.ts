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
  profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
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

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    name: "Giheke TSS Academic & Records Portal",
    description: "A comprehensive educational management system built with PHP, MySQL, and modern JavaScript, allowing administrators, teachers, and students to access schedules, term grades, attendance tracking, and school announcements with secure role-based access.",
    technologies: ["PHP", "MySQL", "JavaScript", "HTML/CSS", "Bootstrap"],
    category: "Full-Stack Web App",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    githubUrl: "https://github.com",
    liveDemoUrl: "https://giheketss.rw",
    featured: true,
    createdAt: "2024-03-15T10:00:00.000Z"
  },
  {
    id: "proj-2",
    name: "Liquid 3D Interactive Portfolio",
    description: "High-performance futuristic web application engineered with React 19, TypeScript, and Three.js featuring real-time Firebase Cloud persistence, interactive particle simulations, and dynamic admin content synchronization.",
    technologies: ["React", "TypeScript", "Three.js", "Tailwind CSS", "Firebase"],
    category: "Frontend & 3D Web",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    githubUrl: "https://github.com",
    liveDemoUrl: "https://render.com",
    featured: true,
    createdAt: "2024-05-20T12:00:00.000Z"
  },
  {
    id: "proj-3",
    name: "Rwanda Tech Real-Time Messaging & Cloud Vault",
    description: "Scalable backend communications engine with Node.js, Express, and Google Firestore cloud database, supporting permanent asset uploads, instant notifications, and multi-platform client interactions.",
    technologies: ["Node.js", "Express", "Firebase Firestore", "Cloud Storage"],
    category: "Backend & Cloud",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    githubUrl: "https://github.com",
    liveDemoUrl: "https://github.com",
    featured: true,
    createdAt: "2024-08-10T09:30:00.000Z"
  }
];

export const initialCertificates: Certificate[] = [
  {
    id: "cert-1",
    title: "Advanced Level Software Development Specialization",
    organization: "Giheke TSS / Rwanda TVET Board (RTB)",
    certificateId: "RTB-SWD-2024-0891",
    issueDate: "2024",
    expirationDate: "Lifetime",
    description: "Rigorous technical curriculum in full-stack web engineering, PHP, MySQL, database normalization, algorithms, object-oriented software engineering, and responsive UI architecture.",
    certificateImage: "https://images.unsplash.com/photo-1589330694653-dad6d3240e2b?auto=format&fit=crop&w=1200&q=80",
    verificationUrl: "https://rtb.gov.rw",
    relatedSkills: ["PHP", "MySQL", "JavaScript", "Database Design", "OOP"],
    featured: true,
    createdAt: "2024-04-12T00:00:00.000Z"
  },
  {
    id: "cert-2",
    title: "Full-Stack Web Development & Modern JavaScript",
    organization: "Rwanda Tech Developer Academy",
    certificateId: "RDA-FSWD-9421",
    issueDate: "2023",
    expirationDate: "Lifetime",
    description: "Certified proficiency in HTML5, CSS3, modern ES6+ JavaScript, React component hierarchies, REST API integration, and cloud database persistence.",
    certificateImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    verificationUrl: "https://github.com",
    relatedSkills: ["React", "JavaScript", "HTML/CSS", "REST APIs"],
    featured: true,
    createdAt: "2023-11-20T00:00:00.000Z"
  },
  {
    id: "cert-3",
    title: "Ordinary Level (O'Level) Certificate of Academic Excellence",
    organization: "Petit Séminaire Saint Aloys",
    certificateId: "PSSA-OLEV-2021-314",
    issueDate: "2021",
    expirationDate: "Lifetime",
    description: "Distinguished academic honors in mathematics, computer literacy, scientific reasoning, analytical problem solving, and French & English languages.",
    certificateImage: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80",
    verificationUrl: "",
    relatedSkills: ["Computer Studies", "Mathematics", "Scientific Logic", "Leadership"],
    featured: true,
    createdAt: "2021-12-05T00:00:00.000Z"
  }
];

export const initialGallery: GalleryPhoto[] = [
  {
    id: "gal-1",
    title: "Giheke TSS Software Lab & Code Engineering",
    caption: "Hands-on software development laboratory building database schemas and web backends at Giheke TSS.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    category: "Academic Life",
    featured: true,
    createdAt: "2024-02-14T10:00:00.000Z"
  },
  {
    id: "gal-2",
    title: "Developer Workstation & High-Performance Setup",
    caption: "Modern software development setup crafting high-efficiency React UI animations and API architectures.",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    category: "Workspace",
    featured: true,
    createdAt: "2024-04-18T14:30:00.000Z"
  },
  {
    id: "gal-3",
    title: "Rwanda Tech Innovation Collaboration",
    caption: "Collaborative teamwork solving real-world challenges through modern software solutions.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    category: "Events",
    featured: true,
    createdAt: "2024-06-25T11:15:00.000Z"
  },
  {
    id: "gal-4",
    title: "Software System Architecture Presentation",
    caption: "Presenting scalable database design and client-server workflows to peers and faculty.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    category: "Presentations",
    featured: true,
    createdAt: "2024-09-02T16:45:00.000Z"
  }
];

export const initialSchoolPhotos: SchoolPhoto[] = [
  {
    id: "sch-1",
    school: "Giheke TSS",
    year: "2024",
    caption: "Advanced Level Software Development department — laboratory sessions, computer programming, and technical innovation.",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    category: "A-Level Software",
    createdAt: "2024-01-20T08:00:00.000Z"
  },
  {
    id: "sch-2",
    school: "Petit Séminaire Saint Aloys",
    year: "2021",
    caption: "Ordinary Level studies building academic discipline, mathematics, science, and leadership character.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    category: "O-Level Graduation",
    createdAt: "2021-11-10T14:00:00.000Z"
  },
  {
    id: "sch-3",
    school: "L'Éducateur Primary School",
    year: "2018",
    caption: "Eight years of foundational education developing academic rigor, intellectual curiosity, and passion for learning.",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80",
    category: "Primary Education",
    createdAt: "2018-09-15T10:00:00.000Z"
  }
];

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

