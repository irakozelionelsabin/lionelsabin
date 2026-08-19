import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { fireConfetti } from '../../utils/confetti';
import {
  Video,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Trash2,
  Check,
  Sparkles,
  Info,
  Clock,
  Eye,
  Sliders,
  Film
} from 'lucide-react';

export const IntroVideoManager: React.FC = () => {
  const { settings, updateSettings, setIntroVideoData } = usePortfolio();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(settings.introVideoMuted ?? true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setUploadError('Please select a valid video file (MP4, WebM, MOV, etc.)');
        return;
      }

      setUploadError(null);
      setIsUploading(true);

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const result = event.target?.result as string;
          if (result) {
            await setIntroVideoData(result);
            updateSettings({
              introVideoTitle: file.name,
              introVideoEnabled: true
            });
            setSaveSuccess(true);
            fireConfetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
            setTimeout(() => setSaveSuccess(false), 3000);
          }
          setIsUploading(false);
        };
        reader.onerror = () => {
          setUploadError('Failed to read video file. Please try a different video format.');
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        console.error('Error uploading intro video:', err);
        setUploadError(err?.message || 'Error processing video upload');
        setIsUploading(false);
      }
    }
  };

  const handleRemoveVideo = async () => {
    if (confirm('Are you sure you want to remove this starting intro video? The site will display the 3D celestial planet preloader.')) {
      await setIntroVideoData(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const togglePlay = () => {
    if (videoPlayerRef.current) {
      if (isPlaying) {
        videoPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        videoPlayerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    updateSettings({ introVideoMuted: nextMuted });
    if (videoPlayerRef.current) {
      videoPlayerRef.current.muted = nextMuted;
    }
  };

  return (
    <div className="space-y-6" id="intro-video-manager">
      {/* Top Header */}
      <div className="p-5 sm:p-6 rounded-2xl mirror-glass-card shadow-[0_10px_35px_rgba(0,10,35,0.7)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-300/50 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Film className="w-5 h-5 drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-orbitron font-black text-white tracking-wide">
                Starting Video Intro & Loader
              </h2>
              <p className="text-cyan-100 text-xs sm:text-sm">
                Upload and manage your custom introductory video that loads when visitors open your website
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          {settings.introVideo && (
            <button
              onClick={() => setPreviewModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-orbitron font-bold text-[#00e5ff] bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Screen Test</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl text-xs font-orbitron font-bold text-slate-900 bg-gradient-to-r from-cyan-400 via-cyan-300 to-[#00e5ff] hover:opacity-90 shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Video</span>
          </button>
        </div>
      </div>

      {/* Hidden Video File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        onChange={handleVideoUpload}
        className="hidden"
        id="admin-intro-video-input"
      />

      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Video Player & Preview */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 sm:p-6 rounded-2xl mirror-glass-card shadow-[0_10px_35px_rgba(0,10,35,0.7)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-400/20 pb-3">
              <div className="flex items-center gap-2 text-cyan-300 font-orbitron font-bold text-sm tracking-wider uppercase">
                <Video className="w-4 h-4 text-[#00e5ff]" />
                <span>Current Starting Video</span>
              </div>

              {settings.introVideo && (
                <button
                  onClick={handleRemoveVideo}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Video</span>
                </button>
              )}
            </div>

            {/* Video Player Display */}
            {settings.introVideo ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-black aspect-video shadow-[0_0_35px_rgba(0,229,255,0.3)] group">
                <video
                  ref={videoPlayerRef}
                  src={settings.introVideo}
                  playsInline
                  muted={isMuted}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-contain"
                />

                {/* Floating Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-cyan-200 bg-black/60 px-2.5 py-1 rounded border border-cyan-400/30 truncate max-w-[200px]">
                      {settings.introVideoTitle || 'intro-video.mp4'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Active Starting Video
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlay}
                        className="w-9 h-9 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold hover:scale-105 transition-transform cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.8)]"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="w-9 h-9 rounded-full bg-slate-800/80 border border-cyan-400/40 text-cyan-300 flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      onClick={() => setPreviewModalOpen(true)}
                      className="text-xs font-orbitron font-bold text-cyan-200 hover:text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-400/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Test</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* No Video Uploaded State */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-cyan-400/40 hover:border-cyan-300 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-slate-950/50 hover:bg-cyan-950/20 transition-all flex flex-col items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-400/15 border border-cyan-300/40 flex items-center justify-center text-[#00e5ff] group-hover:scale-110 transition-transform mb-3 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  <Film className="w-8 h-8" />
                </div>
                <h3 className="font-orbitron font-bold text-base text-white mb-1">
                  Upload Starting Intro Video
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Drag & drop or click to upload your personal video (MP4, WebM, MOV) to load as your website introduction.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-orbitron font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                  <Upload className="w-4 h-4" />
                  <span>Choose Video File</span>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-400/40 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-cyan-300 font-orbitron font-bold text-xs">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  <span>Processing and Saving Starting Video...</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-cyan-400/30">
                  <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full animate-pulse w-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Options & Settings */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 sm:p-6 rounded-2xl mirror-glass-card shadow-[0_10px_35px_rgba(0,10,35,0.7)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-400/20 pb-3">
              <div className="flex items-center gap-2 text-cyan-300 font-orbitron font-bold text-sm tracking-wider uppercase">
                <Sliders className="w-4 h-4 text-[#00e5ff]" />
                <span>Intro Video Controls</span>
              </div>
              {saveSuccess && (
                <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 animate-in fade-in">
                  <Check className="w-3 h-3" /> Saved!
                </span>
              )}
            </div>

            {/* Toggle 1: Enable / Disable Starting Video */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-400/30 flex items-center justify-between">
              <div>
                <span className="font-orbitron font-bold text-xs text-white block">
                  Enable Starting Video
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Play this video when visitors land on your website
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.introVideoEnabled ?? true}
                  disabled={!settings.introVideo}
                  onChange={(e) => {
                    updateSettings({ introVideoEnabled: e.target.checked });
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-[0_0_10px_rgba(0,229,255,0.4)]"></div>
              </label>
            </div>

            {/* Toggle 2: Mute Audio by Default */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-400/30 flex items-center justify-between">
              <div>
                <span className="font-orbitron font-bold text-xs text-white block">
                  Start Muted (Browser Autoplay Safe)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Allows seamless autoplay across all mobile and computer browsers
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.introVideoMuted ?? true}
                  onChange={(e) => {
                    updateSettings({ introVideoMuted: e.target.checked });
                    setIsMuted(e.target.checked);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-[0_0_10px_rgba(0,229,255,0.4)]"></div>
              </label>
            </div>

            {/* Auto-Skip Timer Duration */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-orbitron font-semibold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Auto-Advance Timeout (Seconds)
                </span>
                <span className="text-cyan-300 font-mono font-bold">
                  {settings.introVideoAutoSkipSeconds || 5}s
                </span>
              </div>

              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={settings.introVideoAutoSkipSeconds || 5}
                onChange={(e) => {
                  updateSettings({ introVideoAutoSkipSeconds: Number(e.target.value) });
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2000);
                }}
                className="w-full accent-[#00e5ff] cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">
                Visitors can always click "Enter Website" or "Skip" immediately.
              </span>
            </div>

            {/* Note & Fallback description */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-400/20 text-slate-300 text-xs space-y-1.5">
              <div className="font-orbitron font-bold text-cyan-300 flex items-center gap-1.5 text-[11px]">
                <Info className="w-3.5 h-3.5" />
                <span>3D Celestial Fallback</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                If no video is uploaded or if the starting video is disabled, the website automatically loads with the 3D celestial planetary preloader featuring your orbiting name <strong>"IRAKOZE LIONEL SABIN"</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Live Preview Modal */}
      {previewModalOpen && settings.introVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden border border-cyan-400 shadow-[0_0_80px_rgba(0,229,255,0.4)]">
            <div className="p-4 border-b border-cyan-400/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-orbitron font-bold text-sm">
                <Film className="w-4 h-4 text-[#00e5ff]" />
                <span>Simulated Starting Intro Video Experience</span>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-cyan-400/30 cursor-pointer"
              >
                Close Preview
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src={settings.introVideo}
                autoPlay
                playsInline
                controls
                muted={settings.introVideoMuted ?? true}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
