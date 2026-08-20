import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Home, 
  User, 
  Cpu, 
  Mail, 
  Send, 
  Camera,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Navbar: React.FC = () => {
  const { profile, headerTabs, openAdminSafely } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'aboutme', 'myskills', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    home: Home,
    aboutme: User,
    myskills: Cpu,
    contact: Mail,
  };

  const portalLinks = headerTabs.map((tab) => ({
    id: tab.id,
    name: tab.title || tab.defaultTitle,
    short: (tab.title || tab.defaultTitle).split(' ')[0],
    href: tab.href,
    icon: tabIcons[tab.id] || Home,
    image: tab.image,
    imagePosition: tab.imagePosition || 'center',
    imageZoom: tab.imageZoom || 100,
    imageOpacity: tab.imageOpacity || 55,
    showImageAs: tab.showImageAs || 'background',
  }));

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Top Main Navbar Header */}
      <header 
        id="main-navbar-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'py-2 sm:py-2.5 bg-[#03091e]/50 backdrop-blur-2xl border-b border-white/25 shadow-[0_10px_35px_rgba(0,10,35,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)]' 
            : 'py-3 sm:py-4 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Identity / Logo Tab */}
            <a
              id="nav-logo-link"
              href="#home"
              onClick={(e) => handleScrollTo(e, '#home')}
              className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer"
            >
              {profile.logoImage ? (
                /* Pure independent logo image without any box, frame, or border */
                <img
                  src={profile.logoImage}
                  alt={profile.fullName || 'Logo'}
                  className="h-8 sm:h-9 md:h-10 w-auto max-w-[120px] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]"
                />
              ) : (
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-pink-500 p-[1.5px] shadow-[0_0_20px_rgba(0,229,255,0.7)] group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-[#040c26]/90 rounded-[10px] flex items-center justify-center border border-white/40">
                    <span className="font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-400 text-xs">
                      {profile.logoText || 'ILS'}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-orbitron font-bold text-xs sm:text-base text-white tracking-wider group-hover:text-cyan-300 transition-colors drop-shadow-[0_1px_8px_rgba(0,229,255,0.6)]">
                  {profile.fullName || 'IRAKOZE Lionel Sabin'}
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-cyan-300 font-semibold -mt-0.5 flex items-center gap-1">
                  <span>Rwanda 🇷🇼</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
                </span>
              </div>
            </a>

            {/* Desktop 4 Portals Navigation Panel - Individual Shiny Mirror Tabs */}
            <nav 
              id="four-main-portals-nav"
              className="hidden md:flex items-center gap-2.5 p-1.5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/30 shadow-[0_8px_30px_rgba(0,10,35,0.5),inset_0_1px_3px_rgba(255,255,255,0.6)]"
            >
              {portalLinks.map((portal) => {
                const isActive = activeSection === portal.id;
                const Icon = portal.icon;
                const hasImage = Boolean(portal.image);

                return (
                  <a
                    key={portal.id}
                    id={`portal-tab-${portal.id}`}
                    href={portal.href}
                    onClick={(e) => handleScrollTo(e, portal.href)}
                    className={`relative flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-orbitron font-bold tracking-wider transition-all duration-300 cursor-pointer overflow-hidden ${
                      isActive
                        ? 'text-white border border-white/80 shadow-[0_0_20px_rgba(0,229,255,0.8),inset_0_1px_2px_rgba(255,255,255,0.9)] scale-105'
                        : 'text-slate-100 bg-white/5 hover:bg-white/15 border border-white/20 hover:border-cyan-300/60 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    }`}
                    style={{
                      background: hasImage && portal.showImageAs !== 'avatar'
                        ? undefined
                        : isActive
                        ? 'linear-gradient(to right, rgba(6,182,212,0.85), rgba(37,99,235,0.85), rgba(236,72,153,0.85))'
                        : undefined
                    }}
                  >
                    {/* Background Custom Image if provided */}
                    {hasImage && portal.showImageAs !== 'avatar' && (
                      <>
                        <img
                          src={portal.image}
                          alt={portal.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
                          style={{
                            objectPosition: portal.imagePosition,
                            transform: `scale(${portal.imageZoom / 100})`,
                            opacity: portal.imageOpacity / 100,
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-slate-900/30 to-black/50 pointer-events-none" />
                      </>
                    )}

                    {/* Mini avatar badge inside tab if selected */}
                    {hasImage && (portal.showImageAs === 'avatar' || portal.showImageAs === 'both') && (
                      <img
                        src={portal.image}
                        alt={portal.name}
                        className="relative z-10 w-4 h-4 rounded-full object-cover border border-cyan-300 shadow-[0_0_6px_rgba(0,229,255,0.8)]"
                        style={{ objectPosition: portal.imagePosition }}
                      />
                    )}

                    <Icon className={`relative z-10 w-3.5 h-3.5 ${isActive ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]' : 'text-cyan-300'}`} />
                    <span className="relative z-10">{portal.name}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,229,255,1)] z-20"></span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right Action: Profile Picture Display & Hire Me CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Profile Picture (Display only, in front of Hire Me button) */}
              <div 
                id="header-profile-avatar-display"
                className="relative flex items-center p-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 shadow-[0_0_15px_rgba(0,229,255,0.4)] shrink-0"
                title={profile.fullName || 'IRAKOZE Lionel Sabin'}
              >
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-[#040c26] border border-black/40">
                  {profile.profilePhoto ? (
                    <img 
                      src={profile.profilePhoto} 
                      alt={profile.fullName || 'IRAKOZE Lionel Sabin'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-300">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Hire Me CTA Button */}
              <a
                id="nav-hire-me-btn"
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-orbitron font-extrabold text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 border border-white/70 shadow-[0_0_20px_rgba(0,229,255,0.7)] hover:scale-105 transition-all cursor-pointer"
              >
                <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Hire Me</span>
              </a>
            </div>

          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MOBILE-ONLY SHINY MIRROR FLOATING SIDE PORTALS DOCK      */}
      {/* Positioned on the right side of the screen on phones      */}
      {/* ======================================================== */}
      <nav 
        id="mobile-side-mirror-portals"
        className="md:hidden fixed right-2 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-2xl border-2 border-white/40 shadow-[0_10px_35px_rgba(0,10,35,0.8),inset_0_1px_3px_rgba(255,255,255,0.7)]"
      >
        {portalLinks.map((portal) => {
          const isActive = activeSection === portal.id;
          const Icon = portal.icon;
          const hasImage = Boolean(portal.image);

          return (
            <a
              key={portal.id}
              id={`mobile-side-portal-${portal.id}`}
              href={portal.href}
              onClick={(e) => handleScrollTo(e, portal.href)}
              className={`relative group flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                isActive
                  ? 'text-white border-2 border-white shadow-[0_0_20px_rgba(0,229,255,0.9),inset_0_1px_2px_rgba(255,255,255,0.9)] scale-110'
                  : 'bg-white/10 hover:bg-white/20 text-slate-100 border border-white/25 hover:border-cyan-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]'
              }`}
              style={{
                background: hasImage && portal.showImageAs !== 'avatar'
                  ? undefined
                  : isActive
                  ? 'linear-gradient(to top right, rgba(6,182,212,0.9), rgba(37,99,235,0.9), rgba(236,72,153,0.9))'
                  : undefined
              }}
              title={portal.name}
            >
              {/* Background Custom Image if provided */}
              {hasImage && portal.showImageAs !== 'avatar' && (
                <>
                  <img
                    src={portal.image}
                    alt={portal.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      objectPosition: portal.imagePosition,
                      transform: `scale(${portal.imageZoom / 100})`,
                      opacity: (portal.imageOpacity / 100) * 0.7,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              )}

              {/* Shiny Specular Sheen line */}
              <div className="absolute top-0 left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>
              
              <Icon className={`relative z-10 w-4 h-4 ${isActive ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,1)]' : 'text-cyan-300'}`} />
              <span className="relative z-10 text-[8px] font-orbitron font-bold mt-0.5 tracking-tighter truncate max-w-[38px]">
                {portal.short}
              </span>

              {/* Active Indicator Pip */}
              {isActive && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-3 rounded-r-full bg-cyan-300 shadow-[0_0_8px_rgba(0,229,255,1)] z-20"></span>
              )}
            </a>
          );
        })}
      </nav>
    </>
  );
};
