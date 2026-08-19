import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { optimizeImage } from '../../utils/imageOptimizer';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  X, 
  Star, 
  Tag,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { GalleryPhoto } from '../../types';

export const GalleryManager: React.FC = () => {
  const { gallery, addGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto } = usePortfolio();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Gallery 2');
  const [featured, setFeatured] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const resetForm = () => {
    setTitle('');
    setCaption('');
    setImageUrl('');
    setCategory('Gallery 2');
    setFeatured(false);
    setEditingPhoto(null);
    setIsProcessingImage(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setTitle(photo.title);
    setCaption(photo.caption);
    setImageUrl(photo.imageUrl);
    setCategory(photo.category);
    setFeatured(photo.featured);
    setIsProcessingImage(false);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const optimized = await optimizeImage(file, 1280, 1280, 0.82);
      setImageUrl(optimized);
    } catch (err) {
      console.error('Image compression error:', err);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !caption.trim() && !imageUrl.trim()) return;

    const payload = {
      title: title.trim() || 'Gallery Moment',
      caption: caption.trim(),
      imageUrl: imageUrl.trim(),
      category: category.trim() || 'Gallery 2',
      featured
    };

    if (editingPhoto) {
      updateGalleryPhoto(editingPhoto.id, payload);
      setSaveSuccessMsg('Photo updated successfully!');
    } else {
      addGalleryPhoto(payload);
      setSaveSuccessMsg('Photo added to Gallery 2 successfully!');
    }

    setTimeout(() => setSaveSuccessMsg(''), 4000);
    setModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Photo Gallery 2 Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Upload, categorize, caption, and showcase photographs in public Gallery 2.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccessMsg && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:opacity-95 transition-opacity shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {gallery.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#0b1328]/70 border border-white/10 p-8">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-pink-400 opacity-50" />
          <h3 className="text-lg font-heading font-bold text-white">
            Photo Gallery 2 is empty
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
            Upload your personal, event, and technical moments to showcase them on your portfolio.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 transition-colors"
          >
            + Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((photo) => (
            <div
              key={photo.id}
              className="p-4 rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-white/10 flex flex-col justify-between group hover:border-pink-500/40 transition-all shadow-md"
            >
              <div>
                <div className="aspect-[4/3] rounded-xl bg-slate-900 overflow-hidden mb-3 relative border border-white/5">
                  {photo.imageUrl ? (
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-400/50">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  {photo.featured && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-pink-500 text-white font-bold flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono text-pink-400 uppercase">
                    {photo.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-white mb-1">
                  {photo.title}
                </h3>
                {photo.caption && (
                  <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                    {photo.caption}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEdit(photo)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-pink-300 text-xs font-semibold"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteGalleryPhoto(photo.id)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 text-xs"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div 
            className="w-full max-w-lg rounded-3xl bg-[#0b1328] border border-pink-500/30 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-xl font-heading font-bold text-white">
                {editingPhoto ? 'Edit Photo in Gallery 2' : 'Upload to Photo Gallery 2'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Developer Workspace / Tech Meetup"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Gallery 2 / Work / Events"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Caption / Story
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Details about this photograph..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300 uppercase">
                  Image (Upload Photo or URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image link or click upload..."
                    className="flex-1 px-4 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <input
                    type="file"
                    id="gallery-file-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isProcessingImage}
                  />
                  <label
                    htmlFor="gallery-file-upload"
                    className={`px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500/30 to-purple-500/30 hover:from-pink-500/40 hover:to-purple-500/40 text-xs font-bold text-pink-200 border border-pink-500/50 cursor-pointer flex items-center gap-1.5 shrink-0 transition-all shadow-[0_0_12px_rgba(236,72,153,0.25)] ${
                      isProcessingImage ? 'opacity-60 pointer-events-none' : ''
                    }`}
                  >
                    {isProcessingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Optimizing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </>
                    )}
                  </label>
                </div>

                {/* LIVE PHOTO PREVIEW BEFORE SAVING */}
                {isProcessingImage ? (
                  <div className="mt-3 p-6 rounded-2xl bg-black/40 border border-pink-500/30 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
                    <span className="text-xs font-mono text-pink-300">Processing & optimizing photo...</span>
                  </div>
                ) : imageUrl ? (
                  <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-pink-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-pink-300 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Photo Preview (Review before saving):
                      </span>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline"
                      >
                        Remove Photo
                      </button>
                    </div>

                    <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10">
                      <img
                        src={imageUrl}
                        alt="Upload Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] font-mono text-slate-400">
                    Upload an image file or paste an image URL to preview it here before saving.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-xs font-mono text-slate-200">
                    Feature this photo in gallery highlights
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <span>{editingPhoto ? 'Save Changes' : 'Save Photo to Gallery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
