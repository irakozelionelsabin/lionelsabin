import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Card3D } from './Card3D';
import { RevealOnScroll } from './RevealOnScroll';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  Layers,
  Cpu
} from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { education } = usePortfolio();

  return (
    <section id="education" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ACADEMIC JOURNEY</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Education
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              A progressive timeline of academic discipline, technical immersion, and rigorous foundations in Rwanda.
            </p>
          </RevealOnScroll>
        </div>

        {/* 3D Glowing Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Vertical Glowing Timeline Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-500 via-pink-500 to-blue-500 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] z-0 hidden sm:block"></div>

          <div className="space-y-12 sm:space-y-16">
            {education.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const glow = idx === 0 ? 'cyan' : idx === 1 ? 'pink' : 'purple';

              return (
                <div 
                  key={item.id}
                  className={`relative flex flex-col sm:flex-row items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center Node Badge on timeline */}
                  <div className="hidden sm:flex absolute left-1/2 top-8 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-[#080f24] border-2 border-cyan-400 items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.6)]">
                    <GraduationCap className="w-5 h-5 text-cyan-300" />
                  </div>

                  {/* Spacer for 2-column layout on Desktop */}
                  <div className="hidden sm:block sm:w-1/2"></div>

                  {/* Content Card (on the other half) */}
                  <div className="w-full sm:w-1/2 sm:px-6">
                    <RevealOnScroll delay={idx * 150} direction={isEven ? 'left' : 'right'}>
                      <Card3D 
                        id={`education-card-${idx}`}
                        glowColor={glow as any}
                        className="w-full"
                      >
                        <div className="space-y-3">
                          
                          {/* Top Status & Level */}
                          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-white/10 pb-3">
                            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                              {item.period}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
                              item.status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                              item.status === 'Outstanding' ? 'bg-pink-500/10 text-pink-300 border-pink-500/30' :
                              'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            }`}>
                              Status: {item.status}
                            </span>
                          </div>

                          {/* School Name & Degree */}
                          <div>
                            <h3 className="text-xl font-heading font-bold text-white tracking-tight">
                              {item.school}
                            </h3>
                            <p className="text-sm font-semibold text-pink-400 mt-0.5">
                              {item.degree}
                            </p>
                          </div>

                          {/* Description */}
                          <p className="text-slate-300 text-sm leading-relaxed pt-1">
                            {item.description}
                          </p>

                          {/* Highlights Pills if available */}
                          {item.highlights && item.highlights.length > 0 && (
                            <div className="pt-3 flex flex-wrap gap-1.5">
                              {item.highlights.map((h, i) => (
                                <span 
                                  key={i}
                                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-white/5"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          )}

                        </div>
                      </Card3D>
                    </RevealOnScroll>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
