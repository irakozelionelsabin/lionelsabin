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
    <section id="gallery" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VISUAL CHRONICLES</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Photo Gallery
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              Moments, academic life at Giheke TSS, Petit Séminaire Saint Aloys, and community engagements.
            </p>
          </RevealOnScroll>
        </div>

        {/* Gallery Filter Tabs */}
        <RevealOnScroll delay={100}>
          <div className="flex items-center justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              All Photos ({allItems.length})
            </button>
            <button
              onClick={() => setActiveTab('gallery2')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'gallery2'
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              Photo Gallery 2 ({gallery.length})
            </button>
            <button
              onClick={() => setActiveTab('school')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'school'
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              School Photos ({schoolPhotos.length})
            </button>
          </div>
        </RevealOnScroll>

        {/* Gallery Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <RevealOnScroll delay={150}>
            <div className="max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(56,189,248,0.3)]">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3">
                Gallery Ready For Moments
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                Upload your school memories, developer hackathons, team moments, and technical milestones directly via the Admin panel.
              </p>
              <button
                onClick={handleOpenUpload}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload Photos in Admin</span>
              </button>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(({ item, type }, idx) => {
              const isSchool = type === 'school';
              const schoolItem = isSchool ? (item as SchoolPhoto) : null;
              const galleryItem = !isSchool ? (item as GalleryPhoto) : null;

              return (
                <RevealOnScroll key={item.id} delay={idx * 60}>
                  <Card3D 
                    id={`photo-card-${item.id}`}
                    glowColor={isSchool ? 'cyan' : 'pink'}
                    className="h-full group cursor-pointer"
                    onClick={() => setSelectedPhoto(item)}
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-white/10 mb-4">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.caption || (isSchool ? schoolItem?.school : galleryItem?.title) || 'Gallery item'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#0c162e] to-[#1a2b56] text-cyan-400 p-4">
                          <ImageIcon className="w-10 h-10 mb-2 opacity-70" />
                          <span className="text-xs font-mono text-slate-300 text-center">
                            {isSchool ? schoolItem?.school : galleryItem?.title || 'Photo'}
                          </span>
                        </div>
                      )}

                      {/* Overlay On Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="flex items-center justify-between w-full text-white text-xs font-medium">
                          <span>Click to Expand</span>
                          <Maximize2 className="w-4 h-4 text-cyan-400" />
                        </div>
                      </div>

                      {/* Badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                        {isSchool ? `🏫 ${schoolItem?.school}` : `📸 ${galleryItem?.category || 'Gallery 2'}`}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                        {isSchool ? `${schoolItem?.school} (${schoolItem?.year})` : galleryItem?.title}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-2">
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
