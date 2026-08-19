import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Quote, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Star, 
  X, 
  Upload, 
  UserCircle2 
} from 'lucide-react';
import { Testimonial } from '../../types';

export const TestimonialManager: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = usePortfolio();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [rating, setRating] = useState(5);
  const [featured, setFeatured] = useState(false);

  const resetForm = () => {
    setName('');
    setRole('');
    setCompany('');
    setTestimonial('');
    setProfilePhoto('');
    setRating(5);
    setFeatured(false);
    setEditingTestimonial(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setName(t.name);
    setRole(t.role);
    setCompany(t.company || '');
    setTestimonial(t.testimonial);
    setProfilePhoto(t.profilePhoto || '');
    setRating(t.rating || 5);
    setFeatured(t.featured);
    setModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !testimonial.trim()) return;

    const payload = {
      name: name.trim(),
      role: role.trim() || 'Collaborator',
      company: company.trim() || undefined,
      testimonial: testimonial.trim(),
      profilePhoto: profilePhoto.trim() || undefined,
      rating,
      featured
    };

    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, payload);
    } else {
      addTestimonial(payload);
    }

    setModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Testimonials & Recommendations Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Add real feedback, ratings, and endorsements from clients, teachers, and teammates.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-500 via-pink-600 to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:opacity-95 transition-opacity shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#0b1328]/70 border border-white/10 p-8">
          <Quote className="w-12 h-12 mx-auto mb-3 text-purple-400 opacity-50" />
          <h3 className="text-lg font-heading font-bold text-white">
            No testimonials recorded yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
            Add genuine testimonials from clients and academic mentors to showcase on your portfolio.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
          >
            + Add First Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-white/10 flex flex-col justify-between group hover:border-purple-500/40 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  {t.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500 text-white font-bold">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 italic mb-4 line-clamp-3">
                  "{t.testimonial}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {t.profilePhoto ? (
                    <img
                      src={t.profilePhoto}
                      alt={t.name}
                      className="w-8 h-8 rounded-full object-cover border border-purple-400/30"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center">
                      <UserCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-heading font-bold text-xs text-white">
                      {t.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {t.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-purple-300 text-xs"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTestimonial(t.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 text-xs"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div 
            className="w-full max-w-lg rounded-3xl bg-[#0b1328] border border-purple-500/30 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-xl font-heading font-bold text-white">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
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
                  Person Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jean Paul M."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Lead Instructor"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Company / School
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Giheke TSS"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Testimonial / Endorsement *
                </label>
                <textarea
                  required
                  rows={3}
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  placeholder="What they shared about your work, code quality, and dedication..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Rating (1-5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  >
                    <option value={5} className="bg-[#0b1328]">5 Stars ★★★★★</option>
                    <option value={4} className="bg-[#0b1328]">4 Stars ★★★★☆</option>
                    <option value={3} className="bg-[#0b1328]">3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300 uppercase">
                  Profile Photo (URL or Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profilePhoto}
                    onChange={(e) => setProfilePhoto(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <input
                    type="file"
                    id="testimonial-photo-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="testimonial-photo-upload"
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-purple-300 border border-purple-500/30 cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-xs font-mono text-slate-200">
                    Feature this testimonial on home page
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
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-500 via-pink-600 to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:opacity-95"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
