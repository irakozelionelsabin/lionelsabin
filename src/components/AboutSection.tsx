import React, { useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Card3D } from './Card3D';
import { RevealOnScroll } from './RevealOnScroll';
import confetti from 'canvas-confetti';
import { 
  User, 
  GraduationCap, 
  School, 
  BookOpen, 
  Sparkles, 
  Camera, 
  Upload, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Send,
  Calendar,
  Award
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { profile, updateProfile } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ profilePhoto: reader.result as string });
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.3 }
        });
      };
      reader.readAsDataURL(file);
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
    <section id="aboutme" className="relative py-14 sm:py-20 overflow-hidden scroll-mt-20">
      <div id="about" className="sr-only"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-8">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-orbitron font-bold tracking-wider mb-3 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT ME &amp; ACADEMIC FOUNDATION</span>
            </div>
            <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
              About IRAKOZE Lionel Sabin
            </h2>
            <p className="mt-3 text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Get to know my personal journey, academic background, and technical progression from primary education to advanced software engineering.
            </p>
          </RevealOnScroll>
        </div>

        {/* 1. FRAMELESS & UNCIRCLED NATURAL PROFILE PRESENTATION */}
        <RevealOnScroll>
          <div className="relative py-4 sm:py-8">
            
            {/* Ambient Background Aura */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
              
              {/* Frameless & Uncircled Natural Photo Column */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center relative">
                
                {/* Natural Frameless Photo Wrapper (NO circle frame, NO square box frame) */}
                <div className="relative flex flex-col items-center">
                  
                  {/* Photo Display As-Is without any frame or circle */}
                  <div className="relative max-w-[280px] sm:max-w-[320px] w-full flex items-center justify-center transition-transform duration-300">
                    {profile.profilePhoto ? (
                      <img 
                        src={profile.profilePhoto} 
                        alt={profile.fullName || 'IRAKOZE Lionel Sabin'}
                        className="w-full max-h-[380px] object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.7)] transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-64 h-72 flex flex-col items-center justify-center p-6 text-center">
                        <User className="w-24 h-24 text-cyan-300/80 mb-3 drop-shadow-[0_0_20px_rgba(0,229,255,0.7)]" />
                        <span className="font-orbitron text-sm font-bold text-white">
                          {profile.fullName || 'IRAKOZE Lionel Sabin'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature & Title */}
                <div className="mt-4 space-y-1">
                  <div className="font-signature text-3xl sm:text-4xl font-bold text-[#34d399] drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]">
                    {profile.fullName || 'IRAKOZE Lionel Sabin'}
                  </div>
                  <span className="font-orbitron font-bold text-xs sm:text-sm text-[#00e5ff] tracking-widest uppercase block drop-shadow-[0_0_10px_rgba(0,229,255,0.7)]">
                    {profile.specialty || 'Software & Web Developer'}
                  </span>
                </div>
              </div>

              {/* Bio & Information Column */}
              <div className="md:col-span-7 space-y-5 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                    <MapPin className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Rwanda 🇷🇼</span>
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Open to Opportunities</span>
                  </span>
                </div>

                <h3 className="font-orbitron text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  Passionate Software Developer &amp; Problem Solver
                </h3>

                <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
                  {profile.bio || 'I am IRAKOZE Lionel Sabin, a passionate and dedicated Software Development student from Rwanda with a strong foundation in modern frontend architecture, robust backend systems, and intelligent digital solutions. I strive for excellence in every project, combining clean code practices with high-performance execution.'}
                </p>

                {/* Direct Action Buttons */}
                <div className="pt-2 flex flex-wrap gap-3.5">
                  <a
                    href="#contact"
                    onClick={(e) => handleScrollTo(e, 'contact')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-orbitron font-bold text-xs text-white bg-gradient-to-r from-cyan-400 via-blue-600 to-pink-500 hover:from-cyan-300 hover:to-pink-400 border border-white/70 shadow-[0_0_20px_rgba(0,229,255,0.6)] cursor-pointer transition-transform hover:scale-105"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Contact Me Directly</span>
                  </a>

                  <a
                    href="https://wa.me/250723519793"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-orbitron font-bold text-xs text-white bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform hover:scale-105"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-200" />
                    <span>WhatsApp (0723519793)</span>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </RevealOnScroll>

        {/* 2. CHRONOLOGICAL ACADEMIC PROGRESSION */}
        <div className="space-y-6 pt-4">
          <RevealOnScroll>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-300/60 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron text-xl sm:text-2xl font-bold text-white tracking-wide">
                  Academic &amp; Educational Journey
                </h3>
                <p className="text-xs sm:text-sm text-cyan-200 font-mono">
                  From Primary School Foundation to Advanced Level Software Engineering
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Education Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Primary Education */}
            <RevealOnScroll delay={100}>
              <Card3D id="edu-primary-school" glowColor="cyan" className="h-full">
                <div className="flex flex-col h-full justify-between p-2">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-orbitron font-bold bg-cyan-500/20 border border-cyan-400 text-cyan-300">
                        STEP 01 — FOUNDATION
                      </span>
                      <School className="w-5 h-5 text-cyan-400" />
                    </div>

                    <h4 className="font-orbitron font-bold text-lg text-white mb-1">
                      L'Éducateur Primary School
                    </h4>
                    
                    <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Primary Education — 8 Years</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed mb-4">
                      Completed 8 years of comprehensive primary education with outstanding academic excellence, laying a strong foundation in mathematics, logic, sciences, and languages.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/15">
                    <div className="text-[10px] font-orbitron font-bold text-cyan-300 uppercase tracking-wider mb-2">
                      Key Pillars:
                    </div>
                    <div className="space-y-1">
                      {['Mathematics & Logic', 'Sciences Foundation', 'Academic Excellence'].map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-100 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-[#00ff88]" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </Card3D>
            </RevealOnScroll>

            {/* 2. Ordinary Level (O'Level) */}
            <RevealOnScroll delay={200}>
              <Card3D id="edu-olevel-school" glowColor="blue" className="h-full">
                <div className="flex flex-col h-full justify-between p-2">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-orbitron font-bold bg-blue-500/20 border border-blue-400 text-blue-300">
                        STEP 02 — O'LEVEL
                      </span>
                      <BookOpen className="w-5 h-5 text-blue-400" />
                    </div>

                    <h4 className="font-orbitron font-bold text-lg text-white mb-1">
                      Petit Séminaire Saint Aloys
                    </h4>
                    
                    <div className="flex items-center gap-1.5 text-xs text-blue-300 font-mono mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Ordinary Level (O'Level)</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed mb-4">
                      Achieved outstanding results in sciences and computer studies. Developed strong academic discipline, leadership qualities, teamwork, and analytical critical thinking.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/15">
                    <div className="text-[10px] font-orbitron font-bold text-blue-300 uppercase tracking-wider mb-2">
                      Key Pillars:
                    </div>
                    <div className="space-y-1">
                      {['Sciences & Computing', 'Discipline & Leadership', 'Analytical Problem Solving'].map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-100 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-[#00ff88]" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </Card3D>
            </RevealOnScroll>

            {/* 3. Advanced Level (A Level) */}
            <RevealOnScroll delay={300}>
              <Card3D id="edu-alevel-school" glowColor="pink" className="h-full">
                <div className="flex flex-col h-full justify-between p-2">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-orbitron font-bold bg-pink-500/20 border border-pink-400 text-pink-300">
                        STEP 03 — SPECIALIZATION
                      </span>
                      <Award className="w-5 h-5 text-pink-400" />
                    </div>

                    <h4 className="font-orbitron font-bold text-lg text-white mb-1">
                      Giheke TSS
                    </h4>
                    
                    <div className="flex items-center gap-1.5 text-xs text-pink-300 font-mono mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>A Level — Software Development (Current)</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed mb-4">
                      Specialized in Software Development: mastering PHP, MySQL, JavaScript, React, Node.js, algorithms, object-oriented programming, and full-stack web architectures.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/15">
                    <div className="text-[10px] font-orbitron font-bold text-pink-300 uppercase tracking-wider mb-2">
                      Key Pillars:
                    </div>
                    <div className="space-y-1">
                      {['Full Stack Web Dev', 'Database Architecture', 'PHP & JavaScript OOP', 'System Engineering'].map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-100 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-[#00ff88]" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </Card3D>
            </RevealOnScroll>

          </div>
        </div>

      </div>
    </section>
  );
};
