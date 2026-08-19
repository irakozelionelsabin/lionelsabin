import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Settings, 
  Save, 
  Sparkles, 
  Check, 
  Sliders, 
  Layers, 
  Palette, 
  Share2 
} from 'lucide-react';

export const SiteSettingsManager: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = usePortfolio();
  const [formData, setFormData] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Site Settings & 3D Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Configure global website parameters, visual theme, animations, and 3D effects.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings Applied</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 3D & Animation Controls */}
        <div className="p-6 rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-cyan-500/20 space-y-6">
          <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>3D Engine & Physics Settings</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* 3D Effects Toggle */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase block mb-1">
                  3D Effects
                </span>
                <p className="text-xs text-slate-400 mb-4">
                  Controls card tilt, depth parallax, and 3D hover lighting.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enable3DEffects"
                  checked={formData.enable3DEffects}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                <span className="ml-3 text-xs font-mono font-bold text-white">
                  {formData.enable3DEffects ? 'ON' : 'OFF'}
                </span>
              </label>
            </div>

            {/* Animations Toggle */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-pink-300 uppercase block mb-1">
                  Animations
                </span>
                <p className="text-xs text-slate-400 mb-4">
                  Enables fluid waves, emergence transitions, and glow pulses.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableAnimations"
                  checked={formData.enableAnimations}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                <span className="ml-3 text-xs font-mono font-bold text-white">
                  {formData.enableAnimations ? 'ON' : 'OFF'}
                </span>
              </label>
            </div>

            {/* Animation Intensity */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-purple-300 uppercase block mb-1">
                  Animation Intensity
                </span>
                <p className="text-xs text-slate-400 mb-3">
                  Adjust fluid wave speed and rendering responsiveness.
                </p>
              </div>
              <select
                name="animationIntensity"
                value={formData.animationIntensity}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg glass-input text-xs font-mono text-white"
              >
                <option value="low">Low (Battery Saver)</option>
                <option value="medium">Medium (Cinematic Default)</option>
                <option value="high">High (Maximum Fluidity)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Website Meta & Details */}
        <div className="p-6 rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-white/10 space-y-5">
          <h2 className="text-base font-heading font-bold text-white">
            General Site Meta
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Website Name
              </label>
              <input
                type="text"
                name="websiteName"
                value={formData.websiteName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Website Browser Title
              </label>
              <input
                type="text"
                name="websiteTitle"
                value={formData.websiteTitle}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Contact Email
              </label>
              <input
                type="text"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-white/10 space-y-5">
          <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Social & Channel URLs</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="text"
                name="github"
                value={formData.socialLinks?.github || ''}
                onChange={handleSocialChange}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.socialLinks?.linkedin || ''}
                onChange={handleSocialChange}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:opacity-95 transition-opacity flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Apply Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
