import React, { useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { fireConfetti } from '../utils/confetti';
import { optimizeImage } from '../utils/imageOptimizer';
import { 
  Bot, 
  Code2, 
  BarChart3, 
  Brain, 
  Camera, 
  Upload, 
  Check, 
  ArrowRight,
  User,
  Sparkles,
  Loader2,
  Database,
  Cpu,
  Globe
} from 'lucide-react';
import { HeroFeatureTab } from '../types';
import { initialHeroFeatureTabs } from '../data/initialData';

const ICON_MAP: Record<string, React.ElementType> = {
  brain: Brain,
  code: Code2,
  barchart: BarChart3,
  bot: Bot,
  sparkles: Sparkles,
  database: Database,
  cpu: Cpu,
  globe: Globe
};

export const Hero: React.FC = () => {
  const { profile, updateProfile, heroTabs } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const getTabIcon = (iconName?: string) => {
    if (iconName && ICON_MAP[iconName]) return ICON_MAP[iconName];
    return Brain;
  };

  const t1: HeroFeatureTab = heroTabs[0] || initialHeroFeatureTabs[0];
  const t2: HeroFeatureTab = heroTabs[1] || initialHeroFeatureTabs[1];
  const t3: HeroFeatureTab = heroTabs[2] || initialHeroFeatureTabs[2];
  const t4: HeroFeatureTab = heroTabs[3] || initialHeroFeatureTabs[3];

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingPhoto(true);
        const photoData = await optimizeImage(file, 1200, 1200, 0.86);
        updateProfile({ profilePhoto: photoData });
        setUploadSuccess(true);
        fireConfetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.4 }
        });
        setTimeout(() => setUploadSuccess(false), 4000);
      } catch (err) {
        console.error('Error optimizing hero profile photo:', err);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-2 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center overflow-hidden"
    >
      {/* Hidden File Input for Direct Profile Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePhotoUpload}
        className="hidden"
        id="hero-direct-photo-upload"
      />

      {/* Main Futuristic Container with Mirror Reflective Frame */}
      <div className="w-full max-w-[1400px] mx-auto relative z-10">
        
        {/* Shiny Mirror Glass Master Dashboard Frame */}
        <div 
          id="hero-screenshot-exact-frame"
          className="relative rounded-[20px] sm:rounded-[28px] md:rounded-[36px] mirror-glass-panel p-3.5 sm:p-6 md:p-8 lg:p-11 shadow-[0_25px_80px_rgba(0,10,40,0.8),0_0_60px_rgba(0,229,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.7)] overflow-hidden"
        >
          
          {/* Top Curved Mirror Glass Reflection Canopy */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/20 via-cyan-400/10 to-transparent pointer-events-none rounded-t-[34px]"></div>
          
          {/* Top-Right Shiny Dot Matrix */}
          <div className="absolute top-6 right-8 grid grid-cols-6 gap-2.5 opacity-70 pointer-events-none hidden sm:grid">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.9)]"></div>
            ))}
          </div>

          {/* Background Digital Globe Wireframe Hologram Effect */}
          <div className="absolute -top-10 -left-10 w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] md:w-[700px] md:h-[700px] rounded-full border border-cyan-400/20 pointer-events-none opacity-40">
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 animate-spin-slow"></div>
            <div className="absolute inset-8 rounded-full border border-cyan-400/20"></div>
            <div className="absolute inset-16 rounded-full border border-cyan-400/15"></div>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/30"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400/30"></div>
          </div>

          {/* Ambient Specular Highlights */}
          <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-10 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-pink-500/20 rounded-full blur-[120px] pointer-events-none"></div>

          {/* ======================================================== */}
          {/* MOBILE VIEW (< lg screens)                                */}
          {/* Custom phone-only layout: Position 2 in top 2x2 grid is  */}
          {/* replaced by the Profile Circle, and Skills panel below   */}
          {/* ======================================================== */}
          <div className="lg:hidden space-y-3.5 sm:space-y-5 relative z-10">
            
            {/* Mobile Title Block: Welcome to IRAKOZE Lionel Sabin site. */}
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-300/40 text-cyan-200 text-[10px] font-orbitron font-bold tracking-wider uppercase mb-1.5 shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                <Sparkles className="w-3 h-3 text-cyan-300 animate-spin-slow" />
                <span>WELCOME TO OFFICIAL SITE</span>
              </div>
              <h1 className="font-orbitron font-black text-2xl sm:text-4xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-[#00e5ff] drop-shadow-[0_0_25px_rgba(0,229,255,0.9)] leading-tight mb-1">
                Welcome to IRAKOZE Lionel Sabin site.
              </h1>
              <p className="text-cyan-100 text-xs sm:text-sm font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                Software & Web Developer from Rwanda 🇷🇼
              </p>
            </div>

            {/* Mobile 2x2 Grid with Profile Circle directly in Position 2 (replacing Web Dev tab) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 items-stretch">
              
              {/* TAB 1: (Hero Tab 1) */}
              {(() => {
                const TabIcon = getTabIcon(t1.iconName);
                return (
                  <div className="p-2.5 sm:p-3.5 rounded-xl mirror-glass-card relative overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[160px] text-center shadow-[0_10px_25px_rgba(0,10,35,0.5)]">
                    {/* Custom Background Image if present */}
                    {t1.image && (t1.showImageAs === 'background' || t1.showImageAs === 'both' || !t1.showImageAs) && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl z-0">
                        <img
                          src={t1.image}
                          alt={t1.title}
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: t1.imagePosition || 'center',
                            transform: `scale(${(t1.imageZoom || 100) / 100})`,
                            opacity: (t1.imageOpacity || 60) / 100
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/90"></div>
                      </div>
                    )}

                    <div className="absolute top-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>
                    
                    <div className="flex justify-center mb-1 relative z-10">
                      {t1.image && (t1.showImageAs === 'avatar' || t1.showImageAs === 'both') ? (
                        <div className="w-9 h-9 rounded-lg overflow-hidden border border-cyan-300/70 shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                          <img
                            src={t1.image}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: t1.imagePosition || 'center' }}
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-cyan-400/20 border border-cyan-300/60 flex items-center justify-center text-[#00e5ff]">
                          <TabIcon className="w-5 h-5 drop-shadow-[0_0_6px_rgba(0,229,255,0.9)]" />
                        </div>
                      )}
                    </div>

                    <div className="relative z-10">
                      <h4 className="font-orbitron font-bold text-[9px] sm:text-[10px] text-white uppercase tracking-wider mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {t1.shortTitle || t1.title}
                      </h4>
                      <p className="text-[8px] sm:text-[9px] text-cyan-100/90 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {t1.description}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* POSITION 2: FRAMELESS NATURAL PROFILE PHOTO (No circle, no enclosing frame) */}
              <div className="flex flex-col items-center justify-center text-center relative py-1 min-h-[160px] sm:min-h-[180px] group w-full">
                
                {/* Photo Display As-Is without circle or frame */}
                <div className="relative w-full flex-1 flex flex-col items-center justify-center mb-1">
                  
                  {/* Natural Frameless Photo */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full max-w-[160px] sm:max-w-[190px] flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  >
                    {profile.profilePhoto ? (
                      <img
                        src={profile.profilePhoto}
                        alt={profile.fullName || 'IRAKOZE Lionel Sabin'}
                        className="max-h-[160px] sm:max-h-[190px] w-full h-auto object-contain drop-shadow-[0_8px_25px_rgba(0,0,0,0.85)] transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-28 h-32 flex flex-col items-center justify-center text-center p-1">
                        <User className="w-12 h-12 text-cyan-200 drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]" />
                        <span className="font-orbitron font-bold text-white text-[9px] mt-1 leading-tight">
                          Lionel Sabin
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <Camera className="w-5 h-5 text-cyan-200" />
                    </div>
                  </div>

                  {/* Direct Upload Badge */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -top-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 text-white text-[8px] font-orbitron font-bold px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(0,229,255,0.9)] flex items-center gap-1 z-20 cursor-pointer"
                  >
                    <Upload className="w-2.5 h-2.5" />
                    <span>Upload</span>
                  </button>

                  {uploadSuccess && (
                    <div className="absolute -bottom-1 bg-emerald-500 text-white text-[7px] font-mono font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.9)] flex items-center gap-0.5 animate-in fade-in z-20">
                      <Check className="w-2 h-2" />
                      <span>Saved!</span>
                    </div>
                  )}
                </div>

                {/* Signature & Subtitle under Photo */}
                <div className="text-center mt-1">
                  <div className="font-signature text-base sm:text-lg font-bold text-[#34d399] drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] leading-tight">
                    {profile.fullName || 'IRAKOZE Lionel Sabin'}
                  </div>
                  <div className="font-orbitron font-extrabold text-[7px] sm:text-[8px] tracking-[0.18em] text-[#00e5ff] uppercase drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]">
                    {profile.specialty || 'SOFTWARE DEVELOPER'}
                  </div>
                </div>
              </div>

              {/* TAB 3: (Hero Tab 3) */}
              {(() => {
                const TabIcon = getTabIcon(t3.iconName);
                return (
                  <div className="p-2.5 sm:p-3.5 rounded-xl mirror-glass-card relative overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[160px] text-center shadow-[0_10px_25px_rgba(0,10,35,0.5)]">
                    {t3.image && (t3.showImageAs === 'background' || t3.showImageAs === 'both' || !t3.showImageAs) && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl z-0">
                        <img
                          src={t3.image}
                          alt={t3.title}
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: t3.imagePosition || 'center',
                            transform: `scale(${(t3.imageZoom || 100) / 100})`,
                            opacity: (t3.imageOpacity || 60) / 100
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/90"></div>
                      </div>
                    )}

                    <div className="absolute top-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>
                    
                    <div className="flex justify-center mb-1 relative z-10">
                      {t3.image && (t3.showImageAs === 'avatar' || t3.showImageAs === 'both') ? (
                        <div className="w-9 h-9 rounded-lg overflow-hidden border border-cyan-300/70 shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                          <img
                            src={t3.image}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: t3.imagePosition || 'center' }}
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-cyan-400/20 border border-cyan-300/60 flex items-center justify-center text-[#00e5ff]">
                          <TabIcon className="w-5 h-5 drop-shadow-[0_0_6px_rgba(0,229,255,0.9)]" />
                        </div>
                      )}
                    </div>

                    <div className="relative z-10">
                      <h4 className="font-orbitron font-bold text-[9px] sm:text-[10px] text-white uppercase tracking-wider mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {t3.shortTitle || t3.title}
                      </h4>
                      <p className="text-[8px] sm:text-[9px] text-cyan-100/90 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {t3.description}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 4: (Hero Tab 4) */}
              {(() => {
                const TabIcon = getTabIcon(t4.iconName);
                return (
                  <div className="p-2.5 sm:p-3.5 rounded-xl mirror-glass-card relative overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[160px] text-center shadow-[0_10px_25px_rgba(0,10,35,0.5)]">
                    {t4.image && (t4.showImageAs === 'background' || t4.showImageAs === 'both' || !t4.showImageAs) && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl z-0">
                        <img
                          src={t4.image}
                          alt={t4.title}
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: t4.imagePosition || 'center',
                            transform: `scale(${(t4.imageZoom || 100) / 100})`,
                            opacity: (t4.imageOpacity || 60) / 100
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/90"></div>
                      </div>
                    )}

                    <div className="absolute top-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>
                    
                    <div className="flex justify-center mb-1 relative z-10">
                      {t4.image && (t4.showImageAs === 'avatar' || t4.showImageAs === 'both') ? (
                        <div className="w-9 h-9 rounded-lg overflow-hidden border border-cyan-300/70 shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                          <img
                            src={t4.image}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: t4.imagePosition || 'center' }}
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-cyan-400/20 border border-cyan-300/60 flex items-center justify-center text-[#00e5ff]">
                          <TabIcon className="w-5 h-5 drop-shadow-[0_0_6px_rgba(0,229,255,0.9)]" />
                        </div>
                      )}
                    </div>

                    <div className="relative z-10">
                      <h4 className="font-orbitron font-bold text-[9px] sm:text-[10px] text-white uppercase tracking-wider mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {t4.shortTitle || t4.title}
                      </h4>
                      <p className="text-[8px] sm:text-[9px] text-cyan-100/90 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {t4.description}
                      </p>
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Mobile Bottom Panels: ABOUT ME on Left, SKILLS on Right */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-stretch">
              
              {/* Left Side: About Me Mirror Panel */}
              <div className="rounded-2xl mirror-glass-card p-4 sm:p-5 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,10,35,0.6)]">
                <div>
                  <div className="flex items-center gap-2 text-[#00e5ff] font-orbitron font-bold text-xs tracking-wider uppercase mb-2">
                    <span className="text-[#00e5ff] text-sm drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]">◆</span>
                    <span className="drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">ABOUT ME</span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-slate-100 leading-relaxed font-normal mb-3 sm:mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    {profile.bio || 'I am IRAKOZE Lionel Sabin, a passionate and dedicated Software Development student from Rwanda building high-quality web applications, responsive frontend experiences, and reliable backend systems.'}
                  </p>
                </div>

                <div>
                  <a
                    href="#contact"
                    onClick={(e) => handleScrollTo(e, 'contact')}
                    className="inline-flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-orbitron font-bold text-white bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.5)] cursor-pointer"
                  >
                    <span>LET'S WORK TOGETHER</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
                  </a>
                </div>
              </div>

              {/* Right Side: Skills Mirror Panel with 5 Glowing Progress Bars */}
              <div className="rounded-2xl mirror-glass-card p-4 sm:p-5 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,10,35,0.6)]">
                <div className="flex items-center gap-2 text-[#00e5ff] font-orbitron font-bold text-xs tracking-wider uppercase mb-3">
                  <span className="text-[#00e5ff] text-sm drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]">◆</span>
                  <span className="drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">SKILLS</span>
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'JavaScript & React', pct: 90 },
                    { name: 'HTML & CSS', pct: 95 },
                    { name: 'PHP & MySQL', pct: 88 },
                    { name: 'Node.js & Supabase', pct: 85 },
                    { name: 'AI & Data Analysis', pct: 88 },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs font-mono gap-2">
                      <span className="text-slate-100 font-medium w-32 sm:w-36 shrink-0 text-[10px] sm:text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                        {s.name}
                      </span>
                      
                      <div className="flex-1 h-1.5 rounded-full bg-slate-950/80 overflow-hidden border border-cyan-400/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,1)] transition-all duration-1000"
                          style={{ width: `${s.pct}%` }}
                        ></div>
                      </div>

                      <span className="text-cyan-200 text-[10px] font-bold font-mono w-6 text-right">
                        {s.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* MAIN 2-COLUMN COMPUTER / DESKTOP VIEW (lg screens and up)*/}
          {/* ======================================================== */}
          <div className="hidden lg:grid grid-cols-12 gap-10 items-center relative z-10">
            
            {/* LEFT COLUMN: TITLE, 4 MIRROR TABS, ABOUT & SKILLS */}
            <div className="col-span-8 flex flex-col justify-between space-y-8">
              
              {/* TOP HEADER TYPOGRAPHY: Welcome to IRAKOZE Lionel Sabin site. */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/15 border border-cyan-300/40 text-cyan-200 text-xs font-orbitron font-bold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
                  <span>OFFICIAL DEVELOPER PLATFORM</span>
                </div>
                <h1 className="font-orbitron font-black text-[46px] xl:text-[54px] tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-[#00e5ff] drop-shadow-[0_0_30px_rgba(0,229,255,0.9)] leading-tight mb-3">
                  Welcome to IRAKOZE Lionel Sabin site.
                </h1>
                <p className="text-cyan-50 text-base font-medium tracking-wide max-w-2xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                  Software Development & Full-Stack Web Engineering from Rwanda 🇷🇼
                </p>
              </div>

              {/* 4 SHINY MIRROR FEATURE TABS ROW */}
              <div className="grid grid-cols-4 gap-3.5">
                {[t1, t2, t3, t4].map((tab, idx) => {
                  const TabIcon = getTabIcon(tab.iconName);
                  const hasBg = Boolean(tab.image && (tab.showImageAs === 'background' || tab.showImageAs === 'both' || !tab.showImageAs));
                  const hasAvatar = Boolean(tab.image && (tab.showImageAs === 'avatar' || tab.showImageAs === 'both'));

                  return (
                    <div
                      key={tab.id || idx}
                      className="p-4 rounded-2xl mirror-glass-card hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all flex flex-col justify-between min-h-[165px] text-center group cursor-pointer relative overflow-hidden"
                    >
                      {/* Background Image with custom position, scale, opacity */}
                      {hasBg && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl z-0">
                          <img
                            src={tab.image}
                            alt={tab.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            style={{
                              objectPosition: tab.imagePosition || 'center',
                              transform: `scale(${(tab.imageZoom || 100) / 100})`,
                              opacity: (tab.imageOpacity || 60) / 100
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/90"></div>
                        </div>
                      )}

                      <div className="absolute top-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>
                      
                      <div className="flex justify-center mb-2 relative z-10">
                        {hasAvatar ? (
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-cyan-300/70 shadow-[0_0_15px_rgba(0,229,255,0.5)] group-hover:scale-110 transition-transform">
                            <img
                              src={tab.image}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              style={{ objectPosition: tab.imagePosition || 'center' }}
                            />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-cyan-400/20 border border-cyan-300/60 shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center justify-center text-[#00e5ff] group-hover:scale-110 transition-transform">
                            <TabIcon className="w-6 h-6 drop-shadow-[0_0_8px_rgba(0,229,255,0.9)]" />
                          </div>
                        )}
                      </div>

                      <div className="relative z-10">
                        <h4 className="font-orbitron font-bold text-[11px] text-white uppercase tracking-wider mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                          {tab.title}
                        </h4>
                        <p className="text-[10px] text-cyan-100/90 leading-snug font-normal drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                          {tab.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TWO BOTTOM MIRROR PANELS: ABOUT ME (LEFT) & SKILLS (RIGHT) */}
              <div className="grid grid-cols-2 gap-5">
                
                {/* BOTTOM LEFT PANEL: ABOUT ME */}
                <div className="rounded-2xl mirror-glass-card p-6 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,10,35,0.6)]">
                  <div>
                    <div className="flex items-center gap-2 text-[#00e5ff] font-orbitron font-bold text-xs tracking-wider uppercase mb-3">
                      <span className="text-[#00e5ff] text-sm drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]">◆</span>
                      <span className="drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">ABOUT ME</span>
                    </div>

                    <p className="text-xs text-slate-100 leading-relaxed font-normal mb-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {profile.bio || 'I am IRAKOZE Lionel Sabin, a passionate and dedicated Software Development student from Rwanda building high-quality web applications, responsive frontend experiences, and reliable backend systems.'}
                    </p>
                  </div>

                  <div>
                    <a
                      href="#contact"
                      onClick={(e) => handleScrollTo(e, 'contact')}
                      className="inline-flex items-center justify-between gap-3 px-5 py-2.5 rounded-xl text-xs font-orbitron font-bold text-white bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 border-2 border-cyan-400 hover:border-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:shadow-[0_0_30px_rgba(0,229,255,0.8)] transition-all group cursor-pointer"
                    >
                      <span>LET'S WORK TOGETHER</span>
                      <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* BOTTOM RIGHT PANEL: SKILLS */}
                <div className="rounded-2xl mirror-glass-card p-6 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,10,35,0.6)]">
                  <div className="flex items-center gap-2 text-[#00e5ff] font-orbitron font-bold text-xs tracking-wider uppercase mb-4">
                    <span className="text-[#00e5ff] text-sm drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]">◆</span>
                    <span className="drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">SKILLS</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'JavaScript & React', pct: 90 },
                      { name: 'HTML & CSS', pct: 95 },
                      { name: 'PHP & MySQL', pct: 88 },
                      { name: 'Node.js & Supabase', pct: 85 },
                      { name: 'AI & Data Analysis', pct: 88 },
                    ].map((s) => (
                      <div key={s.name} className="flex items-center justify-between text-xs font-mono gap-3">
                        <span className="text-slate-100 font-medium w-36 shrink-0 text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                          {s.name}
                        </span>
                        
                        <div className="flex-1 h-2 rounded-full bg-slate-950/80 overflow-hidden border border-cyan-400/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,1)] transition-all duration-1000"
                            style={{ width: `${s.pct}%` }}
                          ></div>
                        </div>

                        <span className="text-cyan-200 text-xs font-bold font-mono w-7 text-right">
                          {s.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: FRAMELESS PROFILE PHOTO AS-IS (Computer View) */}
            <div className="col-span-4 flex flex-col items-center justify-center relative">
              
              {/* Natural Frameless Photo Container */}
              <div className="relative w-full max-w-[340px] flex flex-col items-center justify-center mb-4 group">
                
                {/* Photo Display As-Is without any circle or frame */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                >
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={profile.fullName || 'IRAKOZE Lionel Sabin'}
                      className="max-h-[420px] w-full h-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-80 flex flex-col items-center justify-center text-center p-6">
                      <User className="w-24 h-24 text-cyan-200 mb-3 drop-shadow-[0_0_20px_rgba(0,229,255,0.8)]" />
                      <span className="font-orbitron font-bold text-white text-base">
                        {profile.fullName || 'IRAKOZE Lionel Sabin'}
                      </span>
                      <span className="text-xs font-mono text-cyan-300 mt-1">
                        Click to place your photo
                      </span>
                    </div>
                  )}

                  {/* Interactive Admin Upload Hover Mask */}
                  <div 
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center cursor-pointer rounded-2xl"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-500/40 border border-cyan-300 text-white flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(0,229,255,0.9)] animate-pulse">
                      <Camera className="w-6 h-6 text-cyan-200" />
                    </div>
                    <span className="text-xs font-orbitron font-bold text-white">
                      Upload Profile Photo
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono mt-1">
                      Click to choose image file
                    </span>
                  </div>

                </div>

                {/* Direct Admin Upload Floating Badge */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-white text-[11px] font-orbitron font-bold px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.9)] flex items-center gap-1.5 transition-all transform hover:scale-105 z-20 cursor-pointer"
                  title="Upload profile photo"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>

                {uploadSuccess && (
                  <div className="mt-2 bg-emerald-500 text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.9)] flex items-center gap-1 animate-in fade-in z-20">
                    <Check className="w-3 h-3" />
                    <span>Photo Uploaded!</span>
                  </div>
                )}

              </div>

              {/* Green Script Signature & SOFTWARE DEVELOPER Subtitle */}
              <div className="text-center space-y-1">
                <div className="font-signature text-4xl sm:text-5xl font-bold text-[#34d399] drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] tracking-wide">
                  {profile.fullName || 'IRAKOZE Lionel Sabin'}
                </div>
                <div className="font-orbitron font-extrabold text-xs sm:text-sm tracking-[0.3em] text-[#00e5ff] uppercase drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]">
                  {profile.specialty || 'SOFTWARE DEVELOPER'}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
