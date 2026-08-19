import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { optimizeImage } from '../../utils/imageOptimizer';
import { 
  User, 
  Save, 
  Upload, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  RotateCcw,
  Play,
  Loader2
} from 'lucide-react';
import { LogoPreloader } from '../LogoPreloader';

export const ProfileManager: React.FC = () => {
  const { profile, updateProfile, resetToDefaults } = usePortfolio();
  const [formData, setFormData] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const [previewingAnimation, setPreviewingAnimation] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingPhoto(true);
        const optimized = await optimizeImage(file, 1000, 1000, 0.85);
        setFormData(prev => ({ ...prev, profilePhoto: optimized }));
      } catch (err) {
        console.error('Profile photo optimization error:', err);
      } finally {
        setIsProcessingPhoto(false);
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingLogo(true);
        const optimized = await optimizeImage(file, 800, 800, 0.88);
        setFormData(prev => ({ ...prev, logoImage: optimized }));
      } catch (err) {
        console.error('Logo image optimization error:', err);
      } finally {
        setIsProcessingLogo(false);
      }
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logoImage: '' }));
  };

  const handleRemoveProfilePhoto = () => {
    setFormData(prev => ({ ...prev, profilePhoto: '' }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-heading font-bold text-white">
            Profile & Logo Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5 sm:mt-1">
            Update personal identity details, school, contact channels, and visual branding.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono animate-in fade-in self-start sm:self-auto">
            <Check className="w-4 h-4" />
            <span>Profile Synchronized</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
        
        {/* Visual Brand Assets (Logo & Profile Photo) */}
        <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-cyan-500/20 space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-sm sm:text-base font-heading font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Visual Branding &amp; Logo (No Frames or Borders)</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Logo renders cleanly as uploaded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Custom Logo Image Upload */}
            <div className="space-y-2.5">
              <label className="block text-xs font-mono text-slate-300 uppercase">
                Custom Logo Image (PNG / SVG / JPG)
              </label>
              
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <input
                  type="file"
                  id="logo-image-upload"
                  accept="image/*,.svg"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="logo-image-upload"
                  className="px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-xs font-bold text-cyan-300 border border-cyan-500/40 cursor-pointer flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(0,229,255,0.2)]"
                >
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{formData.logoImage ? 'Change Logo Image' : 'Upload Custom Logo'}</span>
                </label>
                {formData.logoImage && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors"
                  >
                    Remove Logo
                  </button>
                )}
              </div>

              {/* Logo Preview - Displayed raw and independent without any box or frame */}
              {formData.logoImage ? (
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-cyan-300 block mb-1">
                    Live Logo Preview (Rendered raw without border/frame):
                  </span>
                  <div className="py-2 inline-flex items-center">
                    <img
                      src={formData.logoImage}
                      alt="Custom Logo Preview"
                      className="h-10 sm:h-12 w-auto max-w-[180px] object-contain drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-[11px] font-mono text-slate-400">
                  No image logo uploaded yet. The monogram below is used by default.
                </p>
              )}
            </div>

            {/* Logo Monogram Text (Fallback or Text-Only Brand) */}
            <div className="space-y-2.5">
              <label className="block text-xs font-mono text-slate-300 uppercase">
                Logo Monogram Text (Fallback / Short Initials)
              </label>
              <input
                type="text"
                name="logoText"
                value={formData.logoText || 'ILS'}
                onChange={handleChange}
                placeholder="e.g. ILS or LS"
                maxLength={6}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
              <span className="text-[10px] font-mono text-slate-400 block">
                Shown when no image logo is uploaded or as stylized typography.
              </span>
            </div>

            {/* Profile Photo Upload */}
            <div className="space-y-2.5 sm:col-span-2 pt-2 border-t border-white/10">
              <label className="block text-xs font-mono text-slate-300 uppercase">
                Profile Photo (Independent / Borderless)
              </label>
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <input
                  type="file"
                  id="profile-photo-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-cyan-500/30 cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Choose Profile Photo</span>
                </label>
                {formData.profilePhoto && (
                  <>
                    <span className="text-[11px] sm:text-xs text-emerald-400 font-mono">Photo Attached ✓</span>
                    <button
                      type="button"
                      onClick={handleRemoveProfilePhoto}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono"
                    >
                      Clear Photo
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Identity Details */}
        <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-white/10 space-y-4 sm:space-y-5">
          <h2 className="text-sm sm:text-base font-heading font-bold text-white">
            Primary Identification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Specialty
              </label>
              <input
                type="text"
                name="specialty"
                required
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Current School
              </label>
              <input
                type="text"
                name="school"
                required
                value={formData.school}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Status
              </label>
              <input
                type="text"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Languages
              </label>
              <input
                type="text"
                name="languages"
                required
                value={formData.languages}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                WhatsApp Phone
              </label>
              <input
                type="text"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Contact Email
              </label>
              <input
                type="text"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Hero Headings & Introductions */}
        <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-white/10 space-y-4 sm:space-y-5">
          <h2 className="text-sm sm:text-base font-heading font-bold text-white">
            Hero Text & Bio
          </h2>

          <div className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Hero Heading
              </label>
              <input
                type="text"
                name="heroHeading"
                required
                value={formData.heroHeading}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Hero Introduction
              </label>
              <textarea
                name="heroIntro"
                required
                rows={3}
                value={formData.heroIntro}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Detailed Biography
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewingAnimation(true)}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-cyan-300 bg-white/5 hover:bg-white/10 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 text-pink-400" />
            <span>Play Logo Loading Animation</span>
          </button>
        </div>

      </form>

      {/* Interactive In-Admin Animation Preview */}
      {previewingAnimation && (
        <LogoPreloader
          forcePlay={true}
          onComplete={() => setPreviewingAnimation(false)}
        />
      )}
    </div>
  );
};
