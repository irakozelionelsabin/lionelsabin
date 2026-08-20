import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Card3D } from './Card3D';
import { RevealOnScroll } from './RevealOnScroll';
import { 
  Image as ImageIcon, 
  Sparkles, 
  GraduationCap, 
  Maximize2, 
  PlusCircle, 
  Calendar, 
  Camera 
} from 'lucide-react';
import { GalleryPhoto, SchoolPhoto } from '../types';

export const GallerySection: React.FC = () => {
  const { gallery, schoolPhotos, setSelectedPhoto, setAdminOpen, setActiveAdminView } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'all' | 'gallery2' | 'school'>('all');

  const allItems: Array<{ item: GalleryPhoto | SchoolPhoto; type: 'gallery2' | 'school' }> = [
    ...gallery.map(g => ({ item: g, type: 'gallery2' as const })),
    ...schoolPhotos.map(s => ({ item: s, type: 'school' as const }))
  ];

  const filteredItems = activeTab === 'all'
    ? allItems
    : allItems.filter(i => i.type === activeTab);

  const handleOpenUpload = () => {
    setActiveAdminView(activeTab === 'school' ? 'school-photos' : 'gallery');
    setAdminOpen(true);
  };

  return (
    <section id="gallery" className="relative py-12 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-14">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-xs font-mono mb-2 sm:mb-4">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>VISUAL CHRONICLES</span>
            </div>
            <h2 className="font-orbitron text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Photo Gallery
            </h2>
            <p className="mt-1.5 sm:mt-4 text-slate-300 text-xs sm:text-lg leading-relaxed max-w-xl mx-auto">
              Moments, academic life at Giheke TSS, Petit Séminaire Saint Aloys, and technical milestones.
            </p>
          </RevealOnScroll>
        </div>

        {/* Gallery Filter Tabs */}
        <RevealOnScroll delay={80}>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-12">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              All ({allItems.length})
            </button>
            <button
              onClick={() => setActiveTab('gallery2')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-semibold transition-all ${
                activeTab === 'gallery2'
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              Gallery 2 ({gallery.length})
            </button>
            <button
              onClick={() => setActiveTab('school')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-semibold transition-all ${
                activeTab === 'school'
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              School ({schoolPhotos.length})
            </button>
          </div>
        </RevealOnScroll>

        {/* Gallery Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <RevealOnScroll delay={120}>
            <div className="max-w-2xl mx-auto text-center p-6 sm:p-12 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_25px_rgba(56,189,248,0.3)]">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-2xl font-orbitron font-bold text-white mb-2 sm:mb-3">
                Gallery Ready For Moments
              </h3>
              <p className="text-slate-300 text-xs sm:text-base leading-relaxed mb-6 sm:mb-8">
                Upload your school memories, developer hackathons, team moments, and technical milestones directly via the Admin panel.
              </p>
              <button
                onClick={handleOpenUpload}
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload Photos in Admin</span>
              </button>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {filteredItems.map(({ item, type }, idx) => {
              const isSchool = type === 'school';
              const schoolItem = isSchool ? (item as SchoolPhoto) : null;
              const galleryItem = !isSchool ? (item as GalleryPhoto) : null;

              return (
                <RevealOnScroll key={item.id} delay={idx * 40}>
                  <Card3D 
                    id={`photo-card-${item.id}`}
                    glowColor={isSchool ? 'cyan' : 'blue'}
                    innerClassName="p-2 sm:p-5"
                    className="h-full group cursor-pointer"
                    onClick={() => setSelectedPhoto(item)}
                  >
                    <div className="relative aspect-[4/3] sm:aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-slate-950 border border-cyan-500/20 mb-2 sm:mb-3 shadow-inner">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.caption || (isSchool ? schoolItem?.school : galleryItem?.title) || 'Gallery item'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#08152e] to-[#122852] text-cyan-400 p-2">
                          <ImageIcon className="w-6 h-6 sm:w-10 sm:h-10 mb-1 opacity-70" />
                          <span className="text-[9px] sm:text-xs font-mono text-slate-300 text-center truncate w-full px-1">
                            {isSchool ? schoolItem?.school : galleryItem?.title || 'Photo'}
                          </span>
                        </div>
                      )}

                      {/* Overlay On Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-3">
                        <div className="flex items-center justify-between w-full text-white text-[10px] sm:text-xs font-medium">
                          <span className="hidden sm:inline">Click to Expand</span>
                          <span className="sm:hidden">Expand</span>
                          <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                        </div>
                      </div>

                      {/* Badge */}
                      <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[8px] sm:text-[10px] font-mono font-semibold bg-black/75 backdrop-blur-md text-cyan-300 border border-cyan-500/30 truncate max-w-[85%]">
                        {isSchool ? `🏫 ${schoolItem?.school}` : `📸 ${galleryItem?.category || 'Gallery'}`}
                      </div>
                    </div>

                    <div className="space-y-0.5 sm:space-y-1">
                      <h4 className="font-orbitron font-bold text-white text-[11px] sm:text-base leading-tight group-hover:text-cyan-300 transition-colors truncate">
                        {isSchool ? `${schoolItem?.school} (${schoolItem?.year})` : galleryItem?.title}
                      </h4>
                      <p className="text-[9.5px] sm:text-xs text-slate-300/80 truncate leading-snug">
                        {item.caption || (isSchool ? `School photo from ${schoolItem?.year}` : 'Captured moment')}
                      </p>
                    </div>
                  </Card3D>
                </RevealOnScroll>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
