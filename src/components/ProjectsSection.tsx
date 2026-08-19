import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Card3D } from './Card3D';
import { RevealOnScroll } from './RevealOnScroll';
import { 
  FolderGit2, 
  Sparkles, 
  Github, 
  ExternalLink, 
  PlusCircle, 
  Layers, 
  Sliders,
  Star
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { projects, setAdminOpen, setActiveAdminView } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const handleOpenAddProject = () => {
    setActiveAdminView('projects');
    setAdminOpen(true);
  };

  return (
    <section id="projects" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FEATURED WORKS</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Projects
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              Real-world web applications and system solutions engineered with precision, efficiency, and clean code.
            </p>
          </RevealOnScroll>
        </div>

        {/* Filter Pills if multiple categories exist */}
        {categories.length > 1 && (
          <RevealOnScroll delay={100}>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeFilter === cat
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                      : 'bg-slate-900/70 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </RevealOnScroll>
        )}

        {/* Projects Display Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <RevealOnScroll delay={150}>
            <div className="max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(56,189,248,0.3)]">
                <FolderGit2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3">
                Project Vault Ready
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                Your portfolio project system is primed and connected to the central Admin Panel. You can add, edit, feature, and showcase your live applications right now.
              </p>
              <button
                onClick={handleOpenAddProject}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Project in Admin Panel</span>
              </button>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => (
              <RevealOnScroll key={project.id} delay={idx * 100}>
                <Card3D 
                  id={`project-card-${project.id}`}
                  glowColor={project.featured ? 'pink' : 'cyan'}
                  className="h-full group"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Project Image Preview */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/10 mb-5">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#0b1329] to-[#162347] text-cyan-400 p-4">
                            <FolderGit2 className="w-10 h-10 opacity-70 mb-2" />
                            <span className="text-xs font-mono text-slate-400">{project.name}</span>
                          </div>
                        )}

                        {/* Category & Featured Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                            {project.category || 'Web App'}
                          </span>
                          {project.featured && (
                            <span className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold bg-pink-500/80 backdrop-blur-md text-white flex items-center gap-1 shadow-md">
                              <Star className="w-3 h-3 fill-current" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {project.name}
                      </h3>

                      {/* Project Description */}
                      <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Technologies Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links and Actions */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          <span>Source Code</span>
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors ml-auto"
                        >
                          <span>Live Preview</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card3D>
              </RevealOnScroll>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
