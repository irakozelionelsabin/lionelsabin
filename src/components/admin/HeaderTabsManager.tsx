import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { optimizeImage } from '../../utils/imageOptimizer';
import { 
  Home, 
  User, 
  Cpu, 
  Mail, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Sliders, 
  Eye, 
  Layers,
  ZoomIn,
  Move,
  Loader2
} from 'lucide-react';
import { HeaderTabItem } from '../../types';

export const HeaderTabsManager: React.FC = () => {
  const { headerTabs, updateHeaderTab, resetHeaderTabs } = usePortfolio();
  const [savedTabId, setSavedTabId] = useState<string | null>(null);
  const [processingTabId, setProcessingTabId] = useState<string | null>(null);

  const tabIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    home: Home,
    aboutme: User,
    myskills: Cpu,
    contact: Mail,
  };

  const handleTitleChange = (id: string, title: string) => {
    updateHeaderTab(id, { title });
    triggerSaveBadge(id);
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setProcessingTabId(id);
        const optimized = await optimizeImage(file, 800, 800, 0.85);
        updateHeaderTab(id, { image: optimized });
        triggerSaveBadge(id);
      } catch (err) {
        console.error('Error optimizing tab image:', err);
      } finally {
        setProcessingTabId(null);
      }
    }
  };

  const handleRemoveImage = (id: string) => {
    updateHeaderTab(id, { image: '' });
    triggerSaveBadge(id);
  };

  const handlePositionChange = (id: string, position: 'center' | 'top' | 'bottom' | 'left' | 'right') => {
    updateHeaderTab(id, { imagePosition: position });
    triggerSaveBadge(id);
  };

  const handleZoomChange = (id: string, zoom: number) => {
    updateHeaderTab(id, { imageZoom: zoom });
    triggerSaveBadge(id);
  };

  const handleOpacityChange = (id: string, opacity: number) => {
    updateHeaderTab(id, { imageOpacity: opacity });
    triggerSaveBadge(id);
  };

  const handleDisplayModeChange = (id: string, mode: 'background' | 'avatar' | 'both') => {
    updateHeaderTab(id, { showImageAs: mode });
    triggerSaveBadge(id);
  };

  const handleResetSingleTab = (tab: HeaderTabItem) => {
    updateHeaderTab(tab.id, {
      title: tab.defaultTitle,
      image: '',
      imagePosition: 'center',
      imageZoom: 100,
      imageOpacity: 55,
      showImageAs: 'background'
    });
    triggerSaveBadge(tab.id);
  };

  const triggerSaveBadge = (id: string) => {
    setSavedTabId(id);
    setTimeout(() => setSavedTabId(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0a1638] via-[#102354] to-[#1c1236] border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>HEADER NAVIGATION PORTALS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Customize 4 Header Navigation Tabs
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Upload custom background images, adjust visible cropping, change titles, or keep the original shiny mirror default look.
          </p>
        </div>

        <button
          type="button"
          onClick={resetHeaderTabs}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-orbitron font-bold text-slate-300 hover:text-white border border-white/15 transition-all self-start sm:self-center shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset All to Defaults</span>
        </button>
      </div>

      {/* Live Navbar Preview Bar */}
      <div className="p-6 rounded-3xl bg-black/40 border border-cyan-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Live Header Navbar Preview:</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Real-time reflection on your website
          </span>
        </div>

        {/* Mock Top Nav Bar */}
        <div className="p-3 rounded-2xl bg-[#03091e]/80 backdrop-blur-2xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-x-auto">
          <nav className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/10 border border-white/25">
            {headerTabs.map((tab, idx) => {
              const Icon = tabIcons[tab.id] || Home;
              const isActive = idx === 0;
              const displayTitle = tab.title || tab.defaultTitle;
              const hasImage = Boolean(tab.image);

              return (
                <div
                  key={tab.id}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-orbitron font-bold tracking-wider overflow-hidden transition-all duration-300 select-none ${
                    isActive
                      ? 'text-white border border-white/80 shadow-[0_0_20px_rgba(0,229,255,0.8)] scale-105'
                      : 'text-slate-100 border border-white/20'
                  }`}
                  style={{
                    background: hasImage && tab.showImageAs !== 'avatar'
                      ? undefined
                      : isActive
                      ? 'linear-gradient(to right, rgba(6,182,212,0.85), rgba(37,99,235,0.85), rgba(236,72,153,0.85))'
                      : 'rgba(255,255,255,0.08)'
                  }}
                >
                  {/* Background Image Layer if configured */}
                  {hasImage && tab.showImageAs !== 'avatar' && (
                    <>
                      <img
                        src={tab.image}
                        alt={displayTitle}
                        className="absolute inset-0 w-full h-full object-cover transition-transform"
                        style={{
                          objectPosition: tab.imagePosition || 'center',
                          transform: `scale(${(tab.imageZoom || 100) / 100})`,
                          opacity: (tab.imageOpacity || 55) / 100,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-slate-900/40 to-black/50" />
                    </>
                  )}

                  {/* Optional Avatar image inside tab */}
                  {hasImage && (tab.showImageAs === 'avatar' || tab.showImageAs === 'both') && (
                    <img
                      src={tab.image}
                      alt={displayTitle}
                      className="relative z-10 w-4 h-4 rounded-full object-cover border border-cyan-300 shadow-[0_0_6px_rgba(0,229,255,0.8)]"
                      style={{ objectPosition: tab.imagePosition || 'center' }}
                    />
                  )}

                  <Icon className={`relative z-10 w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-300'}`} />
                  <span className="relative z-10">{displayTitle}</span>

                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,229,255,1)] z-20"></span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4 Tabs Configuration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {headerTabs.map((tab, index) => {
          const Icon = tabIcons[tab.id] || Home;
          const displayTitle = tab.title || tab.defaultTitle;
          const hasImage = Boolean(tab.image);
          const isProcessing = processingTabId === tab.id;
          const isSaved = savedTabId === tab.id;

          return (
            <div
              key={tab.id}
              className="relative p-5 sm:p-6 rounded-3xl bg-[#091129]/90 border border-white/10 hover:border-cyan-500/40 transition-all space-y-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              <div className="space-y-5">
                
                {/* Tab Header Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        Portal Tab #{index + 1}
                      </span>
                      <h3 className="text-base font-orbitron font-bold text-white">
                        {tab.defaultTitle}
                      </h3>
                    </div>
                  </div>

                  {isSaved && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono animate-in fade-in">
                      <Check className="w-3 h-3" />
                      <span>Updated</span>
                    </span>
                  )}
                </div>

                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                    <span>Tab Title Inside Navbar:</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Default: "{tab.defaultTitle}"
                    </span>
                  </label>
                  <input
                    type="text"
                    value={tab.title}
                    onChange={(e) => handleTitleChange(tab.id, e.target.value)}
                    placeholder={tab.defaultTitle}
                    className="w-full px-4 py-2 rounded-xl glass-input text-xs font-orbitron font-medium text-white focus:border-cyan-400"
                  />
                </div>

                {/* Image Upload Area & Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Tab Background / Icon Image:
                    </label>
                    {hasImage && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(tab.id)}
                        className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Image</span>
                      </button>
                    )}
                  </div>

                  {/* Upload button or preview */}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id={`tab-file-upload-${tab.id}`}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(tab.id, e)}
                      className="hidden"
                      disabled={isProcessing}
                    />

                    <label
                      htmlFor={`tab-file-upload-${tab.id}`}
                      className={`flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-xs font-orbitron font-bold text-cyan-200 cursor-pointer flex items-center justify-center gap-2 transition-all ${
                        isProcessing ? 'opacity-60 pointer-events-none' : ''
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                          <span>Optimizing Image...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-cyan-400" />
                          <span>{hasImage ? 'Replace Image' : 'Upload Tab Image'}</span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Visual Adjustments if image uploaded */}
                  {hasImage && (
                    <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-4 animate-in fade-in">
                      
                      {/* Live Tab Preview Card */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-cyan-300 font-semibold">
                          Tab Look Preview:
                        </span>
                        <div className="p-3 rounded-xl bg-[#03091e] border border-white/10 flex items-center justify-center">
                          <div
                            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-orbitron font-bold tracking-wider overflow-hidden border border-white/60 shadow-[0_0_15px_rgba(0,229,255,0.5)]"
                          >
                            {tab.showImageAs !== 'avatar' && (
                              <>
                                <img
                                  src={tab.image}
                                  alt="Preview"
                                  className="absolute inset-0 w-full h-full object-cover transition-transform"
                                  style={{
                                    objectPosition: tab.imagePosition || 'center',
                                    transform: `scale(${(tab.imageZoom || 100) / 100})`,
                                    opacity: (tab.imageOpacity || 55) / 100,
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-slate-900/30 to-black/50" />
                              </>
                            )}

                            {/* Mini avatar if enabled */}
                            {(tab.showImageAs === 'avatar' || tab.showImageAs === 'both') && (
                              <img
                                src={tab.image}
                                alt="Icon"
                                className="relative z-10 w-4 h-4 rounded-full object-cover border border-cyan-300 shadow-[0_0_6px_rgba(0,229,255,0.8)]"
                                style={{ objectPosition: tab.imagePosition || 'center' }}
                              />
                            )}

                            <Icon className="relative z-10 w-3.5 h-3.5 text-cyan-300" />
                            <span className="relative z-10 text-white font-bold">{displayTitle}</span>
                          </div>
                        </div>
                      </div>

                      {/* Visible Part / Image Position Selection */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                          <Move className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Visible Part / Alignment:</span>
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {(['center', 'top', 'bottom', 'left', 'right'] as const).map((pos) => (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => handlePositionChange(tab.id, pos)}
                              className={`py-1 rounded-lg text-[10px] font-mono capitalize transition-all ${
                                (tab.imagePosition || 'center') === pos
                                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                              }`}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Zoom / Framing Slider */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Image Zoom & Framing:</span>
                          </span>
                          <span className="text-cyan-300 font-bold">{tab.imageZoom || 100}%</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="200"
                          step="5"
                          value={tab.imageZoom || 100}
                          onChange={(e) => handleZoomChange(tab.id, Number(e.target.value))}
                          className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                        />
                      </div>

                      {/* Opacity / Tint Slider */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Image Overlay Opacity:</span>
                          </span>
                          <span className="text-cyan-300 font-bold">{tab.imageOpacity || 55}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="100"
                          step="5"
                          value={tab.imageOpacity || 55}
                          onChange={(e) => handleOpacityChange(tab.id, Number(e.target.value))}
                          className="w-full accent-pink-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                        />
                      </div>

                      {/* Display Mode Toggle */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-slate-300 font-semibold">
                          Display Mode:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { mode: 'background', label: 'Background' },
                            { mode: 'avatar', label: 'Mini Icon' },
                            { mode: 'both', label: 'Both' },
                          ].map(({ mode, label }) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => handleDisplayModeChange(tab.id, mode as any)}
                              className={`py-1.5 rounded-lg text-[10px] font-mono transition-all ${
                                (tab.showImageAs || 'background') === mode
                                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>

              </div>

              {/* Card Footer: Reset Single Tab */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {hasImage ? 'Custom image active' : 'Using default mirror glass'}
                </span>
                <button
                  type="button"
                  onClick={() => handleResetSingleTab(tab)}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Tab</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
