import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Card3D } from './Card3D';
import { RevealOnScroll } from './RevealOnScroll';
import { 
  Code2, 
  Database, 
  Layout, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Cpu,
  Layers
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services } = usePortfolio();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return Code2;
      case 'Database':
        return Database;
      case 'Layout':
        return Layout;
      case 'ShieldCheck':
        return ShieldCheck;
      default:
        return Cpu;
    }
  };

  const getGlow = (idx: number) => {
    const glows: Array<'cyan' | 'pink' | 'blue' | 'purple'> = ['cyan', 'pink', 'blue', 'purple'];
    return glows[idx % glows.length];
  };

  return (
    <section id="services" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading & Subheading */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WHAT I OFFER</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Services
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              Specialized software engineering and full-stack capabilities engineered for performance, security, and exceptional user satisfaction.
            </p>
          </RevealOnScroll>
        </div>

        {/* 4 Liquid Glass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => {
            const Icon = getIcon(service.iconName);
            const glow = getGlow(idx);

            return (
              <RevealOnScroll key={service.id} delay={idx * 100}>
                <Card3D 
                  id={`service-card-${idx}`}
                  glowColor={glow}
                  className="h-full"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                          glow === 'cyan' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(56,189,248,0.25)]' :
                          glow === 'pink' ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.25)]' :
                          glow === 'blue' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.25)]' :
                          'bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                        }`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="font-mono text-2xl font-black text-white/10">
                          0{idx + 1}
                        </span>
                      </div>

                      {/* Service Title */}
                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 tracking-tight">
                        {service.title}
                      </h3>

                      {/* Service Description */}
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Footer Pill */}
                    <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400/90 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        Production-Ready Standard
                      </span>
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white group"
                      >
                        <span>Discuss Project</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </a>
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
