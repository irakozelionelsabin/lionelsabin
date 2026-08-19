import React, { useState } from 'react';
import { Card3D } from './Card3D';
import { RevealOnScroll } from './RevealOnScroll';
import { 
  Sparkles, 
  Code2, 
  Server, 
  Layers, 
  FileCode2, 
  Palette, 
  FileCode, 
  Atom, 
  Cpu, 
  Zap, 
  Database, 
  Github, 
  Trophy, 
  Globe2, 
  BrainCircuit,
  CheckCircle2,
  LayoutGrid
} from 'lucide-react';

interface CompactSkill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Others';
  proficiency: number;
  level: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  glowColor: 'cyan' | 'pink' | 'blue';
  tags: string[];
  drawingType: string;
}

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Frontend' | 'Backend' | 'Others' | 'All'>('Frontend');

  const skillsData: CompactSkill[] = [
    // ------------------------------------------
    // TAB 1: FRONTEND (4 Technologies)
    // ------------------------------------------
    {
      id: 'skill-javascript',
      name: 'JavaScript',
      category: 'Frontend',
      proficiency: 90,
      level: 'Advanced',
      tagline: 'Modern ES6+, DOM & Async Logic',
      icon: FileCode2,
      accentColor: '#F7DF1E',
      glowColor: 'cyan',
      tags: ['ES6+', 'DOM Logic', 'Async/Await', 'Event Loops'],
      drawingType: 'javascript'
    },
    {
      id: 'skill-css',
      name: 'CSS3',
      category: 'Frontend',
      proficiency: 95,
      level: 'Expert',
      tagline: 'Responsive, Glassmorphism & Motion',
      icon: Palette,
      accentColor: '#38BDF8',
      glowColor: 'blue',
      tags: ['Flex & Grid', 'Keyframe FX', 'Glassmorphism', 'Tailwind'],
      drawingType: 'css'
    },
    {
      id: 'skill-html',
      name: 'HTML5',
      category: 'Frontend',
      proficiency: 95,
      level: 'Expert',
      tagline: 'Semantic DOM & Accessibility',
      icon: FileCode,
      accentColor: '#E34F26',
      glowColor: 'pink',
      tags: ['Semantic DOM', 'a11y Standards', 'SEO Tree', 'Modern Web'],
      drawingType: 'html'
    },
    {
      id: 'skill-react',
      name: 'React',
      category: 'Frontend',
      proficiency: 88,
      level: 'Proficient',
      tagline: 'Hooks, State & SPA Architecture',
      icon: Atom,
      accentColor: '#61DAFB',
      glowColor: 'cyan',
      tags: ['React Hooks', 'State Management', 'Modular UI', 'Fast SPAs'],
      drawingType: 'react'
    },

    // ------------------------------------------
    // TAB 2: BACKEND (4 Technologies)
    // ------------------------------------------
    {
      id: 'skill-php',
      name: 'PHP',
      category: 'Backend',
      proficiency: 90,
      level: 'Advanced',
      tagline: 'OOP Scripting & RESTful APIs',
      icon: Server,
      accentColor: '#777BB4',
      glowColor: 'blue',
      tags: ['PHP OOP', 'RESTful APIs', 'Sanitization', 'Session Auth'],
      drawingType: 'php'
    },
    {
      id: 'skill-nodejs',
      name: 'Node.js',
      category: 'Backend',
      proficiency: 85,
      level: 'Proficient',
      tagline: 'Event-Driven Async Runtime',
      icon: Cpu,
      accentColor: '#339933',
      glowColor: 'cyan',
      tags: ['Event Engine', 'Express.js', 'JSON APIs', 'Middleware'],
      drawingType: 'nodejs'
    },
    {
      id: 'skill-supabase',
      name: 'Supabase',
      category: 'Backend',
      proficiency: 86,
      level: 'Proficient',
      tagline: 'PostgreSQL DB & Realtime Auth',
      icon: Zap,
      accentColor: '#3ECF8E',
      glowColor: 'pink',
      tags: ['Cloud Postgres', 'Realtime Sync', 'RLS Security', 'BaaS Auth'],
      drawingType: 'supabase'
    },
    {
      id: 'skill-database',
      name: 'Database & APIs',
      category: 'Backend',
      proficiency: 88,
      level: 'Advanced',
      tagline: 'Relational Schemas & Queries',
      icon: Database,
      accentColor: '#4479A1',
      glowColor: 'blue',
      tags: ['MySQL / Postgres', 'Schema Design', 'Foreign Keys', 'CRUD Endpoints'],
      drawingType: 'database'
    },

    // ------------------------------------------
    // TAB 3: OTHERS (4 Talents)
    // ------------------------------------------
    {
      id: 'skill-github',
      name: 'GitHub & Git',
      category: 'Others',
      proficiency: 90,
      level: 'Advanced',
      tagline: 'Branching & Code Collaboration',
      icon: Github,
      accentColor: '#FFFFFF',
      glowColor: 'cyan',
      tags: ['Git Workflows', 'Branching', 'Pull Requests', 'CI/CD Ops'],
      drawingType: 'github'
    },
    {
      id: 'skill-volleyball',
      name: 'Volleyball',
      category: 'Others',
      proficiency: 92,
      level: 'Athlete',
      tagline: 'Reflexes, Agility & Team Play',
      icon: Trophy,
      accentColor: '#F59E0B',
      glowColor: 'pink',
      tags: ['Court Reflexes', 'High Energy', 'Teamwork', 'Spike & Block'],
      drawingType: 'volleyball'
    },
    {
      id: 'skill-english',
      name: 'English Speaking',
      category: 'Others',
      proficiency: 95,
      level: 'Fluent',
      tagline: 'Clear Global Communication',
      icon: Globe2,
      accentColor: '#3B82F6',
      glowColor: 'blue',
      tags: ['Fluent Spoken', 'Technical Docs', 'Presentations', 'Global Teams'],
      drawingType: 'english'
    },
    {
      id: 'skill-ai-analysis',
      name: 'AI Analysis',
      category: 'Others',
      proficiency: 88,
      level: 'Advanced',
      tagline: 'Prompt Design & LLM Insights',
      icon: BrainCircuit,
      accentColor: '#EC4899',
      glowColor: 'cyan',
      tags: ['Prompt Eng.', 'LLM Systems', 'Data Insights', 'AI Problem Solving'],
      drawingType: 'ai-analysis'
    }
  ];

  const displayedSkills = activeTab === 'All' 
    ? skillsData 
    : skillsData.filter(s => s.category === activeTab);

  // Compact High-Precision SVG Schematic Drawings (Height ~44px, viewBox 0 0 160 44)
  const renderCompactDrawing = (drawingType: string) => {
    switch (drawingType) {
      case 'javascript':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#08142c" stroke="#F7DF1E" strokeWidth="1" strokeOpacity="0.7" />
            <text x="12" y="17" fill="#F7DF1E" fontSize="8.5" fontFamily="monospace" fontWeight="bold">const js = {"{"}</text>
            <text x="22" y="28" fill="#38BDF8" fontSize="8" fontFamily="monospace">async run() =&gt; 'Fast'</text>
            <text x="12" y="37" fill="#F7DF1E" fontSize="8.5" fontFamily="monospace">{"};"}</text>
            <circle cx="145" cy="14" r="2.5" fill="#F7DF1E" />
            <circle cx="145" cy="14" r="5" stroke="#F7DF1E" strokeWidth="0.8" strokeDasharray="2 2" className="animate-spin" />
          </svg>
        );

      case 'css':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#030d22" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" />
            <rect x="14" y="8" width="132" height="28" rx="4" fill="#072044" stroke="#00E5FF" strokeWidth="1" />
            <rect x="36" y="14" width="88" height="16" rx="3" fill="#00E5FF" fillOpacity="0.2" stroke="#FFFFFF" strokeWidth="0.8" />
            <text x="44" y="25" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" fontWeight="bold">FLEX // GRID UI</text>
          </svg>
        );

      case 'html':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#170605" stroke="#E34F26" strokeWidth="1" strokeOpacity="0.8" />
            <text x="10" y="18" fill="#E34F26" fontSize="9" fontFamily="monospace" fontWeight="bold">&lt;!DOCTYPE html&gt;</text>
            <text x="18" y="32" fill="#F87171" fontSize="8" fontFamily="monospace">&lt;main role="app"&gt;...</text>
            <path d="M 125 12 L 148 12 L 148 32 L 125 32" stroke="#00ff88" strokeWidth="1" strokeDasharray="2 2" />
            <text x="127" y="25" fill="#00ff88" fontSize="6.5" fontFamily="monospace">a11y ✓</text>
          </svg>
        );

      case 'react':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#021528" stroke="#61DAFB" strokeWidth="1" strokeOpacity="0.8" />
            {/* React Atom Orbital */}
            <ellipse cx="40" cy="22" rx="20" ry="7" stroke="#61DAFB" strokeWidth="1" />
            <ellipse cx="40" cy="22" rx="20" ry="7" stroke="#61DAFB" strokeWidth="1" transform="rotate(60 40 22)" />
            <ellipse cx="40" cy="22" rx="20" ry="7" stroke="#61DAFB" strokeWidth="1" transform="rotate(120 40 22)" />
            <circle cx="40" cy="22" r="2.5" fill="#61DAFB" />
            <text x="72" y="20" fill="#61DAFB" fontSize="8.5" fontFamily="monospace" fontWeight="bold">useHook()</text>
            <text x="72" y="32" fill="#93C5FD" fontSize="7.5" fontFamily="monospace">SPA State // V-DOM</text>
          </svg>
        );

      case 'php':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#0a0f28" stroke="#777BB4" strokeWidth="1" strokeOpacity="0.8" />
            <text x="10" y="16" fill="#777BB4" fontSize="8.5" fontFamily="monospace" fontWeight="bold">&lt;?php</text>
            <text x="18" y="27" fill="#A5B4FC" fontSize="8" fontFamily="monospace">class API extends Controller</text>
            <text x="18" y="37" fill="#34D399" fontSize="7" fontFamily="monospace">PDO::prepare($query)-&gt;bind()</text>
          </svg>
        );

      case 'nodejs':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#03160a" stroke="#339933" strokeWidth="1" strokeOpacity="0.8" />
            {/* Hexagon Node Icon */}
            <path d="M 30 12 L 40 17 L 40 27 L 30 32 L 20 27 L 20 17 Z" fill="#339933" fillOpacity="0.25" stroke="#4ade80" strokeWidth="1" />
            <text x="26" y="25" fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold">N</text>
            <text x="50" y="20" fill="#4ade80" fontSize="8.5" fontFamily="monospace" fontWeight="bold">app.use(route)</text>
            <text x="50" y="32" fill="#86EFAC" fontSize="7" fontFamily="monospace">Express / Event Loop</text>
          </svg>
        );

      case 'supabase':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#041a12" stroke="#3ECF8E" strokeWidth="1" strokeOpacity="0.8" />
            <path d="M 28 8 L 18 24 L 28 24 L 22 36 L 38 18 L 28 18 Z" fill="#3ECF8E" />
            <text x="46" y="19" fill="#3ECF8E" fontSize="8.5" fontFamily="monospace" fontWeight="bold">supabase.from()</text>
            <text x="46" y="31" fill="#6EE7B7" fontSize="7" fontFamily="monospace">Postgres + Realtime RLS</text>
          </svg>
        );

      case 'database':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#051726" stroke="#4479A1" strokeWidth="1" strokeOpacity="0.8" />
            {/* Cylinders */}
            <ellipse cx="26" cy="14" rx="12" ry="4" fill="#1e3a5f" stroke="#38BDF8" strokeWidth="0.8" />
            <path d="M 14 14 v 14 a 12 4 0 0 0 24 0 v -14" fill="#0f2744" stroke="#38BDF8" strokeWidth="0.8" />
            <line x1="14" y1="21" x2="38" y2="21" stroke="#38BDF8" strokeWidth="0.6" strokeDasharray="1 1" />
            <text x="48" y="19" fill="#38BDF8" fontSize="8.5" fontFamily="monospace" fontWeight="bold">SELECT * FROM db</text>
            <text x="48" y="31" fill="#93C5FD" fontSize="7" fontFamily="monospace">FK / Indexing / CRUD</text>
          </svg>
        );

      case 'github':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#080e22" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.7" />
            {/* Git Branching */}
            <line x1="20" y1="22" x2="140" y2="22" stroke="#38BDF8" strokeWidth="1.2" />
            <circle cx="28" cy="22" r="3" fill="#38BDF8" />
            <circle cx="70" cy="22" r="3" fill="#38BDF8" />
            <circle cx="130" cy="22" r="3" fill="#00ff88" />
            <path d="M 28 22 Q 50 10 70 10 L 100 10 Q 115 10 130 22" fill="none" stroke="#EC4899" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="85" cy="10" r="2.5" fill="#EC4899" />
            <text x="35" y="35" fill="#38BDF8" fontSize="7" fontFamily="monospace">git merge pr/feat</text>
          </svg>
        );

      case 'volleyball':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#1f1103" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.8" />
            {/* Net line & Ball trajectory */}
            <line x1="80" y1="12" x2="80" y2="36" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
            <path d="M 25 32 Q 80 8 135 24" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="2 2" />
            <circle cx="80" cy="13" r="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1" />
            <text x="15" y="16" fill="#F59E0B" fontSize="7" fontFamily="orbitron" fontWeight="bold">AGILITY</text>
            <text x="96" y="36" fill="#FDE68A" fontSize="6.5" fontFamily="monospace">COURT REFLEX</text>
          </svg>
        );

      case 'english':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#061226" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.8" />
            <circle cx="28" cy="22" r="10" fill="#1e3a8a" stroke="#60A5FA" strokeWidth="1" />
            {/* Sound Wave Bars */}
            <line x1="48" y1="18" x2="48" y2="26" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="56" y1="13" x2="56" y2="31" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
            <line x1="64" y1="17" x2="64" y2="27" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
            <text x="76" y="20" fill="#FFFFFF" fontSize="8" fontFamily="orbitron" fontWeight="bold">FLUENT COMM</text>
            <text x="76" y="32" fill="#93C5FD" fontSize="6.8" fontFamily="monospace">Global Teams &amp; Docs</text>
          </svg>
        );

      case 'ai-analysis':
        return (
          <svg className="w-full h-11" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="156" height="40" rx="6" fill="#1c0722" stroke="#EC4899" strokeWidth="1" strokeOpacity="0.8" />
            {/* Neural Net Nodes */}
            <circle cx="22" cy="15" r="2.5" fill="#00E5FF" />
            <circle cx="22" cy="29" r="2.5" fill="#00E5FF" />
            <circle cx="50" cy="11" r="2.5" fill="#EC4899" />
            <circle cx="50" cy="22" r="2.5" fill="#EC4899" />
            <circle cx="50" cy="33" r="2.5" fill="#EC4899" />
            <circle cx="78" cy="22" r="3" fill="#34D399" />
            {/* Synapse Lines */}
            <line x1="22" y1="15" x2="50" y2="11" stroke="#00E5FF" strokeWidth="0.8" strokeOpacity="0.6" />
            <line x1="22" y1="15" x2="50" y2="22" stroke="#00E5FF" strokeWidth="0.8" strokeOpacity="0.6" />
            <line x1="22" y1="29" x2="50" y2="22" stroke="#00E5FF" strokeWidth="0.8" strokeOpacity="0.6" />
            <line x1="22" y1="29" x2="50" y2="33" stroke="#00E5FF" strokeWidth="0.8" strokeOpacity="0.6" />
            <line x1="50" y1="22" x2="78" y2="22" stroke="#EC4899" strokeWidth="0.8" strokeOpacity="0.6" />
            <text x="90" y="19" fill="#EC4899" fontSize="8" fontFamily="orbitron" fontWeight="bold">AI LOGIC</text>
            <text x="90" y="31" fill="#34D399" fontSize="6.8" fontFamily="monospace">Prompt &amp; Insights</text>
          </svg>
        );

      default:
        return null;
    }
  };

  const navTabItems = [
    { key: 'Frontend', label: 'Frontend', icon: Code2, count: '4 Items' },
    { key: 'Backend', label: 'Backend', icon: Server, count: '4 Items' },
    { key: 'Others', label: 'Others', icon: Layers, count: '4 Items' },
    { key: 'All', label: 'All in One View', icon: LayoutGrid, count: '12 Items' }
  ];

  return (
    <section id="myskills" className="relative py-12 sm:py-16 overflow-hidden scroll-mt-16">
      <div id="skills" className="sr-only"></div>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Sleek Compact Header Bar (Fits on Screen) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-orbitron font-bold tracking-wider mb-1.5 shadow-[0_0_12px_rgba(0,229,255,0.25)]">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span>CORE SPECIALIZATIONS &amp; COMPETENCIES</span>
            </div>
            <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              My Skills &amp; Proficiencies
            </h2>
          </div>

          {/* Sleek Header-Sized Tabs (Identical sleek capsule size to the Navbar tabs) */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#040c26]/80 backdrop-blur-xl border border-white/25 shadow-[0_8px_25px_rgba(0,10,35,0.6)]">
            {navTabItems.map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  id={`skills-tab-${tab.key.toLowerCase()}`}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded-xl font-orbitron font-bold text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-400 via-blue-600 to-pink-500 text-white border border-white/80 shadow-[0_0_15px_rgba(0,229,255,0.7)] scale-[1.02]'
                      : 'bg-transparent hover:bg-white/10 text-slate-200 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-300'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-cyan-300'}`}>
                    {tab.count.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. MOBILE PHONE VIEW: SLEEK HEADER-TAB-SIZED SKILL CAPSULES */}
        <div className="grid grid-cols-1 sm:hidden gap-2">
          {displayedSkills.map((skill, idx) => {
            const Icon = skill.icon;
            return (
              <RevealOnScroll key={`mob-${skill.id}`} delay={idx * 30}>
                <div 
                  id={`mob-${skill.id}`}
                  className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-[#061539]/90 via-[#0a204e]/90 to-[#040e26]/90 border border-white/20 hover:border-cyan-400/50 shadow-[0_4px_15px_rgba(0,10,35,0.7)] flex items-center justify-between gap-2 transition-all"
                >
                  {/* Left: Icon + Name + Category */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/30 shadow-[0_0_8px_rgba(0,229,255,0.3)] shrink-0"
                      style={{ backgroundColor: `${skill.accentColor}25`, color: skill.accentColor }}
                    >
                      <Icon className="w-3.5 h-3.5 drop-shadow-[0_0_4px_currentColor]" />
                    </div>
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-orbitron text-xs font-bold text-white truncate">
                          {skill.name}
                        </h3>
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-orbitron font-bold uppercase bg-white/10 text-cyan-200 border border-white/15">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-[9px] font-mono text-cyan-300 truncate">
                        {skill.category} • {skill.tags.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Right: Proficiency + Micro Bar */}
                  <div className="flex flex-col items-end shrink-0 pl-1">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {skill.proficiency}%
                    </span>
                    <div className="w-14 h-1 rounded-full bg-slate-950/80 overflow-hidden border border-cyan-400/30 mt-0.5">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-[#00ff88]"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* 2. TABLET & DESKTOP VIEW: RICH 3D SCHEMATIC CARDS */}
        <div className={`hidden sm:grid gap-3.5 sm:gap-4 ${
          activeTab === 'All'
            ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {displayedSkills.map((skill, idx) => {
            const Icon = skill.icon;

            return (
              <RevealOnScroll key={skill.id} delay={idx * 40}>
                <Card3D 
                  id={skill.id}
                  glowColor={skill.glowColor}
                  className="h-full"
                >
                  {/* Compact Header-Tab Styled Interior */}
                  <div className="flex flex-col h-full justify-between p-2.5 sm:p-3 space-y-2">
                    
                    {/* Top Row: Icon + Name + Percentage Badge */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/40 shadow-[0_0_10px_rgba(0,229,255,0.4)] shrink-0"
                            style={{ backgroundColor: `${skill.accentColor}25`, color: skill.accentColor }}
                          >
                            <Icon className="w-4 h-4 drop-shadow-[0_0_4px_currentColor]" />
                          </div>
                          
                          <div>
                            <h3 className="font-orbitron text-sm font-bold text-white tracking-wide leading-tight">
                              {skill.name}
                            </h3>
                            <span className="text-[10px] font-mono text-cyan-300 leading-none">
                              {skill.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-orbitron font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-cyan-200">
                            {skill.level}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </div>

                      {/* Tagline */}
                      <p className="text-[11px] text-slate-200 font-medium line-clamp-1 mb-2">
                        {skill.tagline}
                      </p>

                      {/* Compact High-Precision SVG Schematic Drawing */}
                      <div className="rounded-lg bg-black/40 border border-white/15 p-0.5 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
                        {renderCompactDrawing(skill.drawingType)}
                      </div>
                    </div>

                    {/* Bottom Row: Tags + Slim Progress Bar */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {skill.tags.map((t, i) => (
                          <span 
                            key={i}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-200 flex items-center gap-0.5"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#00ff88]" />
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Micro Progress Bar */}
                      <div className="w-full h-1 rounded-full bg-slate-950/80 overflow-hidden border border-cyan-400/30">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.9)]"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>

                  </div>
                </Card3D>
              </RevealOnScroll>
            );
          })}
        </div>

      </div>
    </section>
  );
};
