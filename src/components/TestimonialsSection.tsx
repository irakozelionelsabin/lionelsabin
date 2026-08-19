import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Card3D } from './Card3D';
import { RevealOnScroll } from './RevealOnScroll';
import { 
  Quote, 
  Sparkles, 
  Star, 
  PlusCircle, 
  UserCircle2 
} from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, setAdminOpen, setActiveAdminView } = usePortfolio();

  const handleOpenAdd = () => {
    setActiveAdminView('testimonials');
    setAdminOpen(true);
  };

  if (testimonials.length === 0) {
    return null; // Cleanly hide on public portfolio when no real testimonials have been uploaded by Lionel yet
  }

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TESTIMONIALS & FEEDBACK</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              What People Say
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              Endorsements and feedback from collaborators, mentors, and project partners.
            </p>
          </RevealOnScroll>
        </div>

        {/* 3D Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <RevealOnScroll key={item.id} delay={idx * 100}>
              <Card3D 
                id={`testimonial-card-${item.id}`}
                glowColor={item.featured ? 'pink' : 'cyan'}
                className="h-full"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Stars and Quote mark */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 text-cyan-400/30" />
                    </div>

                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic mb-6">
                      "{item.testimonial}"
                    </p>
                  </div>

                  {/* Author Details */}
                  <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                    {item.profilePhoto ? (
                      <img
                        src={item.profilePhoto}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border border-cyan-400/40"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <UserCircle2 className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-heading font-bold text-white text-sm">
                        {item.name}
                      </h4>
                      <p className="text-xs text-cyan-400/80 font-mono">
                        {item.role} {item.company ? `• ${item.company}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </Card3D>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
