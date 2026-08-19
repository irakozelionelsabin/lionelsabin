import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Calendar, MapPin, Tag } from 'lucide-react';
import { GalleryPhoto, SchoolPhoto } from '../types';

export const PhotoModal: React.FC = () => {
  const { selectedPhoto, setSelectedPhoto } = usePortfolio();

  if (!selectedPhoto) return null;

  const isSchool = 'school' in selectedPhoto;
  const schoolItem = isSchool ? (selectedPhoto as SchoolPhoto) : null;
  const galleryItem = !isSchool ? (selectedPhoto as GalleryPhoto) : null;

  return (
    <div 
      id="photo-viewer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setSelectedPhoto(null)}
    >
      <div 
        className="relative w-full max-w-4xl rounded-3xl bg-[#080f22] border border-cyan-500/30 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setSelectedPhoto(null)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors z-20"
          aria-label="Close photo view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
            {selectedPhoto.imageUrl ? (
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption || 'Photo full size'}
                className="w-full max-h-[65vh] object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="py-24 text-center text-slate-400 font-mono text-sm">
                No visual image uploaded for this item.
              </div>
            )}
          </div>

          <div className="p-2 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-white">
                {isSchool ? `${schoolItem?.school} (${schoolItem?.year})` : galleryItem?.title}
              </h3>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {isSchool ? `Category: ${schoolItem?.category || 'Academic'}` : `Category: ${galleryItem?.category || 'General'}`}
              </span>
            </div>

            {selectedPhoto.caption && (
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedPhoto.caption}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
