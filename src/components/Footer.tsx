import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Heart, 
  ArrowUp, 
  Code2, 
  Sliders, 
  Phone, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin,
  Home,
  User,
  Cpu
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { profile, openAdminSafely } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const portalLinks = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About Me', href: '#aboutme', icon: User },
    { name: 'My Skills', href: '#myskills', icon: Cpu },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  return (
    <footer id="main-portfolio-footer" className="relative border-t border-white/20 bg-[#03091e]/40 backdrop-blur-2xl py-14 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/15">
          
          {/* Col 1: Identity & Bio */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {profile.logoImage ? (
                /* Pure independent logo without frame or border */
                <img
                  src={profile.logoImage}
                  alt={profile.fullName || 'Logo'}
                  className="h-10 sm:h-12 w-auto max-w-[140px] object-contain drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-pink-500 p-[1.5px] shadow-[0_0_15px_rgba(0,229,255,0.6)]">
                  <div className="w-full h-full bg-[#040c26]/90 rounded-[10px] flex items-center justify-center border border-white/30">
                    <span className="font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-400 text-xs">
                      {profile.logoText || 'ILS'}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-orbitron font-bold text-base text-white">
                  {profile.fullName || 'IRAKOZE Lionel Sabin'}
                </h3>
                <p className="text-xs font-mono text-cyan-300">
                  {profile.specialty || 'Software & Web Developer'} • Rwanda 🇷🇼
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-sm">
              {profile.bio || 'Passionate Software Development student from Rwanda building high-performance web applications with modern frontend and backend architectures.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
              <span>{profile.status || '✓ Open to Work'}</span>
            </div>
          </div>

          {/* Col 2: 4 Main Portals */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-orbitron font-bold text-white text-xs tracking-wider uppercase">
              The 4 Main Portals
            </h4>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {portalLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan-300 text-slate-100 hover:text-cyan-200 transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-300 group-hover:scale-110 transition-transform" />
                    <span className="font-orbitron font-bold text-[11px]">{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 3: Direct Channels & Admin Portal Button */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-orbitron font-bold text-white text-xs tracking-wider uppercase">
              Direct Channels &amp; Admin
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-200">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{profile.whatsapp || '0723519793'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 break-all">
                <Mail className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>{profile.email || 'irakozelionelsabin191@gmail.com'}</span>
              </div>
            </div>

            {/* Admin Management Button in Footer */}
            <div className="pt-2">
              <button
                id="footer-admin-portal-button"
                onClick={() => openAdminSafely('dashboard')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-orbitron font-bold text-slate-100 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-cyan-300 hover:text-white shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-300" />
                <span>Admin Content Portal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p className="text-slate-300 text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-white font-bold">{profile.fullName || 'IRAKOZE Lionel Sabin'}</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan-300 text-cyan-300 transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
