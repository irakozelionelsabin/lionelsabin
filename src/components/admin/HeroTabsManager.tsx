import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { HeroFeatureTab } from '../../types';
import { optimizeImage } from '../../utils/imageOptimizer';
import { fireConfetti } from '../../utils/confetti';
import {
  Brain,
  Code2,
  BarChart3,
  Bot,
  Sparkles,
  Database,
  Cpu,
  Globe,
  Upload,
  RotateCcw,
  Check,
  Image as ImageIcon,
  Sliders,
  Type,
  LayoutGrid,
  Info,
  ExternalLink
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  brain: Brain,
  code: Code2,
  barchart: BarChart3,
  bot: Bot,
  sparkles: Sparkles,
  database: Database,
  cpu: Cpu,
  globe: Globe
};

const ICON_OPTIONS = [
  { value: 'brain', label: 'Brain / AI', icon: Brain },
  { value: 'code', label: 'Code / Web', icon: Code2 },
  { value: 'barchart', label: 'Analytics / Stats', icon: BarChart3 },
  { value: 'bot', label: 'Bot / Chatbot', icon: Bot },
  { value: 'sparkles', label: 'Sparkles / Innovation', icon: Sparkles },
  { value: 'database', label: 'Database / Backend', icon: Database },
  { value: 'cpu', label: 'CPU / Tech Core', icon: Cpu },
  { value: 'globe', label: 'Globe / Web Network', icon: Globe }
];

export const HeroTabsManager: React.FC = () => {
  const { heroTabs, updateHeroTab, resetHeroTabs } = usePortfolio();
  const [selectedTabId, setSelectedTabId] = useState<string>(heroTabs[0]?.id || 'ai-ml');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedTab = heroTabs.find(t => t.id === selectedTabId) || heroTabs[0];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedTab) {
      try {
        setIsUploading(true);
        const optimized = await optimizeImage(file, 1000, 1000, 0.85);
        updateHeroTab(selectedTab.id, {
          image: optimized,
          showImageAs: selectedTab.showImageAs || 'background'
        });
        setSaveSuccess(true);
        fireConfetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error('Error optimizing hero tab image:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    if (selectedTab) {
      updateHeroTab(selectedTab.id, { image: '' });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const IconComp = (selectedTab?.iconName && ICON_MAP[selectedTab.iconName]) || Brain;

  return (
    <div className="space-y-6" id="hero-tabs-manager">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl mirror-glass-card shadow-[0_10px_35px_rgba(0,10,35,0.7)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-300/50 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <LayoutGrid className="w-5 h-5 drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-orbitron font-black text-white tracking-wide">
                Hero Profile Feature Tabs
              </h2>
              <p className="text-cyan-100 text-xs sm:text-sm">
                Customize the 4 cards surrounding your profile (AI & ML, Web Dev, Data Analysis, Chatbots)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (confirm('Reset all 4 Hero Feature Tabs back to factory defaults?')) {
                resetHeroTabs();
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2500);
              }
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-orbitron font-semibold text-rose-300 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.2)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Tab Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {heroTabs.map((tab) => {
          const isSelected = tab.id === selectedTabId;
          const TabIcon = (tab.iconName && ICON_MAP[tab.iconName]) || Brain;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTabId(tab.id)}
              className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[100px] overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-950/80 to-slate-950/90 border-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.5)]'
                  : 'bg-slate-900/60 border-cyan-400/20 hover:border-cyan-400/50 hover:bg-slate-900/90'
              }`}
            >
              {/* Optional Mini Background Preview */}
              {tab.image && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
                  style={{ backgroundImage: `url(${tab.image})` }}
                ></div>
              )}

              <div className="relative z-10 flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center text-[#00e5ff]">
                  <TabIcon className="w-4 h-4" />
                </div>
                {tab.image && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                    Custom Img
                  </span>
                )}
              </div>

              <div className="relative z-10">
                <div className="font-orbitron font-bold text-xs text-white uppercase tracking-wider truncate">
                  {tab.title || tab.defaultTitle}
                </div>
                <div className="text-[10px] text-cyan-200/80 truncate">
                  {tab.shortTitle || tab.defaultShortTitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Tab Customizer Panel */}
      {selectedTab && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center Settings Form */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Content & Text Settings */}
            <div className="p-5 sm:p-6 rounded-2xl mirror-glass-card shadow-[0_10px_30px_rgba(0,10,35,0.6)] space-y-4">
              <div className="flex items-center gap-2 text-cyan-300 font-orbitron font-bold text-sm tracking-wider uppercase border-b border-cyan-400/20 pb-3">
                <Type className="w-4 h-4 text-[#00e5ff]" />
                <span>Tab Content & Texts</span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-orbitron font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                    Main Title (Full Display)
                  </label>
                  <input
                    type="text"
                    value={selectedTab.title}
                    onChange={(e) => updateHeroTab(selectedTab.id, { title: e.target.value })}
                    placeholder={selectedTab.defaultTitle}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-cyan-400/40 text-white placeholder-slate-500 text-sm font-medium focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300/50 shadow-inner"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Default: <span className="text-cyan-300">{selectedTab.defaultTitle}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                      Short Title (Mobile / Badge)
                    </label>
                    <input
                      type="text"
                      value={selectedTab.shortTitle}
                      onChange={(e) => updateHeroTab(selectedTab.id, { shortTitle: e.target.value })}
                      placeholder={selectedTab.defaultShortTitle}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-cyan-400/40 text-white placeholder-slate-500 text-sm font-medium focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300/50 shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                      Icon Emblem
                    </label>
                    <select
                      value={selectedTab.iconName || 'brain'}
                      onChange={(e) => updateHeroTab(selectedTab.id, { iconName: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-cyan-400/40 text-white text-sm font-medium focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300/50 cursor-pointer"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                    Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={selectedTab.description}
                    onChange={(e) => updateHeroTab(selectedTab.id, { description: e.target.value })}
                    placeholder={selectedTab.defaultDescription}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-cyan-400/40 text-white placeholder-slate-500 text-sm font-medium focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300/50 shadow-inner resize-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Default: <span className="text-cyan-300">{selectedTab.defaultDescription}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Image & Background Customization */}
            <div className="p-5 sm:p-6 rounded-2xl mirror-glass-card shadow-[0_10px_30px_rgba(0,10,35,0.6)] space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-400/20 pb-3">
                <div className="flex items-center gap-2 text-cyan-300 font-orbitron font-bold text-sm tracking-wider uppercase">
                  <ImageIcon className="w-4 h-4 text-[#00e5ff]" />
                  <span>Card Picture / Background</span>
                </div>

                {selectedTab.image && (
                  <button
                    onClick={handleRemoveImage}
                    className="text-xs text-rose-400 hover:text-rose-300 font-mono underline cursor-pointer"
                  >
                    Remove Image
                  </button>
                )}
              </div>

              {/* Upload Drop Zone */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="hero-tab-image-input"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-cyan-400/40 hover:border-cyan-300 rounded-2xl p-4 sm:p-6 text-center cursor-pointer bg-slate-950/50 hover:bg-cyan-950/20 transition-all flex flex-col items-center justify-center group"
              >
                {selectedTab.image ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.6)] relative">
                      <img
                        src={selectedTab.image}
                        alt={selectedTab.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs font-orbitron font-bold text-cyan-200 group-hover:text-white flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Click to Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2 py-2">
                    <div className="w-12 h-12 rounded-xl bg-cyan-400/15 border border-cyan-300/40 flex items-center justify-center text-[#00e5ff] group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-orbitron font-bold text-sm text-white block">
                        Upload Tab Picture
                      </span>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        PNG, JPG, WEBP • Automatically optimized
                      </span>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="text-xs text-cyan-300 font-mono mt-2 animate-pulse">
                    Optimizing and saving photo...
                  </div>
                )}
              </div>

              {/* Display Mode & Visible Alignment */}
              {selectedTab.image && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-orbitron font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                        Display Mode
                      </label>
                      <select
                        value={selectedTab.showImageAs || 'background'}
                        onChange={(e) => updateHeroTab(selectedTab.id, { showImageAs: e.target.value as any })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-cyan-400/40 text-white text-xs font-medium focus:border-cyan-300 focus:outline-none"
                      >
                        <option value="background">Full Card Background</option>
                        <option value="avatar">Icon Avatar Badge</option>
                        <option value="both">Both Background & Avatar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-orbitron font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                        Visible Part / Alignment
                      </label>
                      <select
                        value={selectedTab.imagePosition || 'center'}
                        onChange={(e) => updateHeroTab(selectedTab.id, { imagePosition: e.target.value as any })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-cyan-400/40 text-white text-xs font-medium focus:border-cyan-300 focus:outline-none"
                      >
                        <option value="center">Center</option>
                        <option value="top">Top (Head / Upper)</option>
                        <option value="bottom">Bottom (Lower)</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>

                  {/* Sliders: Zoom and Opacity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                        <span>Image Zoom</span>
                        <span className="text-cyan-300 font-bold">{selectedTab.imageZoom || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="200"
                        step="5"
                        value={selectedTab.imageZoom || 100}
                        onChange={(e) => updateHeroTab(selectedTab.id, { imageZoom: Number(e.target.value) })}
                        className="w-full accent-[#00e5ff] cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                        <span>Image Visibility / Opacity</span>
                        <span className="text-cyan-300 font-bold">{selectedTab.imageOpacity || 60}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="5"
                        value={selectedTab.imageOpacity || 60}
                        onChange={(e) => updateHeroTab(selectedTab.id, { imageOpacity: Number(e.target.value) })}
                        className="w-full accent-[#00e5ff] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Live Interactive Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl mirror-glass-card shadow-[0_10px_35px_rgba(0,10,35,0.7)] sticky top-20">
              <div className="flex items-center justify-between border-b border-cyan-400/20 pb-3 mb-4">
                <div className="flex items-center gap-2 text-cyan-300 font-orbitron font-bold text-sm tracking-wider uppercase">
                  <Sliders className="w-4 h-4 text-[#00e5ff]" />
                  <span>Live Card Preview</span>
                </div>
                {saveSuccess && (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 animate-in fade-in">
                    <Check className="w-3 h-3" /> Saved!
                  </span>
                )}
              </div>

              {/* Desktop Size Preview */}
              <div className="space-y-2">
                <div className="text-[11px] font-orbitron font-semibold text-slate-400 uppercase tracking-wider">
                  Desktop Hero View
                </div>

                <div className="p-4 rounded-2xl mirror-glass-card relative overflow-hidden flex flex-col justify-between min-h-[175px] text-center border-2 border-cyan-400/60 shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                  {/* Custom Background Image if present */}
                  {selectedTab.image && (selectedTab.showImageAs === 'background' || selectedTab.showImageAs === 'both' || !selectedTab.showImageAs) && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl z-0">
                      <img
                        src={selectedTab.image}
                        alt="Background"
                        className="w-full h-full object-cover transition-all"
                        style={{
                          objectPosition: selectedTab.imagePosition || 'center',
                          transform: `scale(${(selectedTab.imageZoom || 100) / 100})`,
                          opacity: (selectedTab.imageOpacity || 60) / 100
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/50 to-slate-950/90"></div>
                    </div>
                  )}

                  <div className="absolute top-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>
                  
                  <div className="flex justify-center mb-2 relative z-10">
                    {selectedTab.image && (selectedTab.showImageAs === 'avatar' || selectedTab.showImageAs === 'both') ? (
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-cyan-300/80 shadow-[0_0_15px_rgba(0,229,255,0.6)]">
                        <img
                          src={selectedTab.image}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: selectedTab.imagePosition || 'center' }}
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-cyan-400/20 border border-cyan-300/60 shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center justify-center text-[#00e5ff]">
                        <IconComp className="w-6 h-6 drop-shadow-[0_0_8px_rgba(0,229,255,0.9)]" />
                      </div>
                    )}
                  </div>

                  <div className="relative z-10">
                    <h4 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {selectedTab.title || selectedTab.defaultTitle}
                    </h4>
                    <p className="text-[10px] text-cyan-100 leading-snug font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {selectedTab.description || selectedTab.defaultDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Size Preview */}
              <div className="space-y-2 pt-3">
                <div className="text-[11px] font-orbitron font-semibold text-slate-400 uppercase tracking-wider">
                  Mobile 2x2 View
                </div>

                <div className="w-44 mx-auto p-3 rounded-xl mirror-glass-card relative overflow-hidden flex flex-col justify-between min-h-[140px] text-center border border-cyan-400/50 shadow-[0_10px_25px_rgba(0,10,35,0.5)]">
                  {selectedTab.image && (selectedTab.showImageAs === 'background' || selectedTab.showImageAs === 'both' || !selectedTab.showImageAs) && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl z-0">
                      <img
                        src={selectedTab.image}
                        alt="Background"
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: selectedTab.imagePosition || 'center',
                          transform: `scale(${(selectedTab.imageZoom || 100) / 100})`,
                          opacity: (selectedTab.imageOpacity || 60) / 100
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/50 to-slate-950/90"></div>
                    </div>
                  )}

                  <div className="flex justify-center mb-1 relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-cyan-400/20 border border-cyan-300/60 flex items-center justify-center text-[#00e5ff]">
                      <IconComp className="w-4 h-4 drop-shadow-[0_0_6px_rgba(0,229,255,0.9)]" />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h4 className="font-orbitron font-bold text-[10px] text-white uppercase tracking-wider mb-0.5">
                      {selectedTab.shortTitle || selectedTab.title || selectedTab.defaultShortTitle}
                    </h4>
                    <p className="text-[8px] text-cyan-100/90 leading-tight">
                      {selectedTab.description || selectedTab.defaultDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="mt-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-400/20 flex items-start gap-2 text-slate-300 text-xs">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  All changes are saved instantly and reflected immediately on both desktop and mobile hero displays.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
