import React, { useEffect, useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { User, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface LogoPreloaderProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export const LogoPreloader: React.FC<LogoPreloaderProps> = ({ onComplete }) => {
  const { profile, settings, projects, certificates, gallery, schoolPhotos, isInitialHydrated, setIsSiteReady } = usePortfolio();
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(10);
  const [statusMessage, setStatusMessage] = useState('CONNECTING TO SECURE CLOUD GATEWAY...');
  const [videoBuffered, setVideoBuffered] = useState(false);
  const [showingVideoPhase, setShowingVideoPhase] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(settings.introVideoMuted ?? true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasFinishedRef = useRef(false);

  const hasIntroVideo = Boolean(settings.introVideo && settings.introVideoEnabled !== false);

  const handleFinish = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    // Immediately notify context that the site is fully ready
    setIsSiteReady(true);
    setIsExiting(true);

    setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 600);
  };

  // 1. Comprehensive Asset & Video Preloader Engine
  useEffect(() => {
    let isCancelled = false;

    const preloadAllAssets = async () => {
      try {
        // Step 1: Initial Gateway Handshake
        setProgress(20);
        setStatusMessage('INITIALIZING PORTFOLIO ASSETS...');
        await new Promise(r => setTimeout(r, 300));
        if (isCancelled) return;

        // Step 2: Wait for Firestore / Local DB Hydration
        setStatusMessage('HYDRATING PROFILE DATA & CONFIGURATION...');
        setProgress(35);
        
        let waitCount = 0;
        while (!isInitialHydrated && waitCount < 25) {
          await new Promise(r => setTimeout(r, 100));
          waitCount++;
        }
        if (isCancelled) return;
        setProgress(50);

        // Step 3: Preload Profile Uploads, Avatar, Logo & Key Media
        setStatusMessage('PRELOADING HIGH-DEFINITION PROFILE UPLOADS...');
        const imagesToPreload: string[] = [];

        if (profile.profilePhoto) imagesToPreload.push(profile.profilePhoto);
        if (profile.logoImage) imagesToPreload.push(profile.logoImage);
        if (settings.favicon) imagesToPreload.push(settings.favicon);

        // Add top projects, certificates, gallery, and school photos to cache
        projects.forEach(p => {
          if (p.image) imagesToPreload.push(p.image);
        });
        certificates.forEach(c => {
          if (c.certificateImage) imagesToPreload.push(c.certificateImage);
        });
        gallery.forEach(g => {
          if (g.imageUrl) imagesToPreload.push(g.imageUrl);
        });
        schoolPhotos.forEach(s => {
          if (s.imageUrl) imagesToPreload.push(s.imageUrl);
        });

        // Preload each image with decoding
        const imagePromises = imagesToPreload.map(url => {
          return new Promise<void>(resolve => {
            const img = new Image();
            img.src = url;
            const timer = setTimeout(() => resolve(), 2500); // 2.5s safety timeout per image
            img.onload = () => {
              if ('decode' in img) {
                img.decode().then(() => {
                  clearTimeout(timer);
                  resolve();
                }).catch(() => {
                  clearTimeout(timer);
                  resolve();
                });
              } else {
                clearTimeout(timer);
                resolve();
              }
            };
            img.onerror = () => {
              clearTimeout(timer);
              resolve();
            };
          });
        });

        await Promise.all(imagePromises);
        if (isCancelled) return;
        setProgress(75);

        // Step 4: Preload & Buffer Video Stream if Enabled
        if (hasIntroVideo && settings.introVideo) {
          setStatusMessage('BUFFERING INTRO VIDEO STREAM...');
          await new Promise<void>(resolve => {
            const v = document.createElement('video');
            v.preload = 'auto';
            v.src = settings.introVideo!;
            const timer = setTimeout(() => {
              setVideoBuffered(true);
              resolve();
            }, 3500); // Max 3.5s video buffer wait

            v.onloadeddata = () => {
              clearTimeout(timer);
              setVideoBuffered(true);
              resolve();
            };
            v.oncanplay = () => {
              clearTimeout(timer);
              setVideoBuffered(true);
              resolve();
            };
            v.onerror = () => {
              clearTimeout(timer);
              setVideoBuffered(true);
              resolve();
            };
          });
        }
        if (isCancelled) return;
        setProgress(90);

        // Step 5: Verify Typography & Fonts Readiness
        setStatusMessage('CALIBRATING TYPOGRAPHY & GRAPHICS...');
        if ('fonts' in document) {
          try {
            await Promise.race([
              document.fonts.ready,
              new Promise(r => setTimeout(r, 800))
            ]);
          } catch (e) {
            // Non-blocking
          }
        }
        if (isCancelled) return;

        // Step 6: 100% Ready
        setProgress(100);
        setStatusMessage('SYSTEM 100% READY • PREPARING VIEW');
        await new Promise(r => setTimeout(r, 400));
        if (isCancelled) return;

        // Route to Video or Direct Reveal
        if (hasIntroVideo && settings.introVideo) {
          setShowingVideoPhase(true);
        } else {
          handleFinish();
        }

      } catch (err) {
        console.warn('Preloader orchestrator notice:', err);
        setProgress(100);
        handleFinish();
      }
    };

    preloadAllAssets();

    return () => {
      isCancelled = true;
    };
  }, [hasIntroVideo, isInitialHydrated, profile.profilePhoto, profile.logoImage, settings.introVideo]);

  // Video Autoplay & Auto-skip handler
  useEffect(() => {
    if (showingVideoPhase && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay note:', err);
      });

      const autoSeconds = Math.max(5, (settings.introVideoAutoSkipSeconds || 15)) * 1000;
      const autoTimer = setTimeout(() => {
        handleFinish();
      }, autoSeconds);

      return () => clearTimeout(autoTimer);
    }
  }, [showingVideoPhase, settings.introVideoAutoSkipSeconds]);

  if (!visible) return null;

  // Render 1: Full-Screen Cinematic Video Stream (Shown only after 100% buffering is ready)
  if (showingVideoPhase && hasIntroVideo && settings.introVideo) {
    return (
      <div
        id="starting-video-intro-preloader"
        className={`fixed inset-0 z-[100] w-screen h-screen flex items-center justify-center bg-black overflow-hidden select-none transition-all duration-700 ${
          isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <video
          ref={videoRef}
          src={settings.introVideo}
          autoPlay
          playsInline
          muted={isVideoMuted}
          onEnded={handleFinish}
          className="w-full h-full object-cover sm:object-cover bg-black"
        />

        {/* Video Control Bar: Skip and Mute Toggle */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsVideoMuted(!isVideoMuted)}
            className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 hover:border-cyan-400 backdrop-blur-md text-xs transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center gap-1.5 cursor-pointer"
            title={isVideoMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isVideoMuted ? <VolumeX className="w-3.5 h-3.5 text-cyan-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-300" />}
            <span className="text-[10px] font-mono font-bold uppercase">{isVideoMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="px-4 py-1.5 rounded-full bg-black/70 hover:bg-cyan-500 text-white hover:text-black border border-white/30 hover:border-cyan-300 backdrop-blur-md text-xs font-orbitron font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>Skip & Enter</span>
            <span className="text-cyan-300 font-mono">→</span>
          </button>
        </div>
      </div>
    );
  }

  // Render 2: 3D Planetary Celestial Preload Gate with Live Progress Meter
  return (
    <div
      id="profile-circle-preloader"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020512] overflow-hidden select-none transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ perspective: '1200px' }}
    >
      {/* 1. COSMIC SPACE BACKGROUND & NEBULA AURORA */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-600/20 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(14,35,80,0.55)_0%,_rgba(4,8,22,0.95)_70%,_#020512_100%)] pointer-events-none" />

      {/* Twinkling Starfield Constellations */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-[15%] left-[20%] w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f0ff] animate-ping" />
        <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-pink-300 shadow-[0_0_10px_#ff4bb8]" />
        <div className="absolute bottom-[20%] left-[30%] w-1 h-1 rounded-full bg-cyan-200 shadow-[0_0_8px_#00f0ff]" />
        <div className="absolute bottom-[35%] right-[15%] w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
        <div className="absolute top-[60%] left-[10%] w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#38bdf8]" />
        <div className="absolute top-[20%] right-[12%] w-1 h-1 rounded-full bg-purple-300 shadow-[0_0_8px_#c084fc]" />
      </div>

      {/* Ambient Pulsing Central Core Halo */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-tr from-cyan-500/25 via-blue-600/15 to-pink-500/25 blur-3xl pointer-events-none animate-pulse" />

      {/* 2. 3D ORBITAL REVOLUTION SYSTEM (MOON ORBITING EARTH) */}
      <div 
        className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 md:w-[360px] md:h-[360px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 3D Tilted Planetary Orbit Ring Layer 1 (Elliptical Moon Orbit) */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: 'rotateX(66deg) rotateY(15deg) rotateZ(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="w-[270px] h-[270px] sm:w-[320px] sm:h-[320px] md:w-[350px] md:h-[350px] rounded-full border border-cyan-400/40 shadow-[0_0_25px_rgba(0,240,255,0.3),inset_0_0_20px_rgba(0,240,255,0.2)] animate-[spin_6s_linear_infinite]" />
          
          <div 
            className="absolute w-full h-full animate-[spin_5s_linear_infinite]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-cyan-300 to-white shadow-[0_0_20px_rgba(0,240,255,1),0_0_40px_rgba(236,72,153,0.8)] border border-white" />
              <div className="absolute w-8 h-8 rounded-full bg-cyan-400/30 blur-sm animate-ping" />
            </div>
          </div>
        </div>

        {/* 3D Tilted Planetary Orbit Ring Layer 2 (Opposite Axis) */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: 'rotateX(-60deg) rotateY(25deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[330px] md:h-[330px] rounded-full border border-dashed border-pink-500/40 animate-[spin_8s_linear_infinite_reverse]" />
          <div 
            className="absolute w-full h-full animate-[spin_7s_linear_infinite_reverse]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-pink-300 to-white shadow-[0_0_15px_rgba(255,75,184,1)] border border-white" />
            </div>
          </div>
        </div>

        {/* 3. CIRCLING NAME SVG: "IRAKOZE LIONEL SABIN" */}
        <svg
          className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] pointer-events-none z-20"
          viewBox="0 0 300 300"
          style={{ willChange: 'transform' }}
        >
          <defs>
            <path
              id="nameOrbitPath3D"
              d="M 150, 150 m -122, 0 a 122,122 0 1,1 244,0 a 122,122 0 1,1 -244,0"
            />
            <linearGradient id="circling3DGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="35%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#ff4bb8" />
              <stop offset="85%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#00f0ff" />
            </linearGradient>
          </defs>

          <text
            className="font-mono text-[10px] sm:text-[11px] md:text-[11.5px] font-extrabold tracking-[0.24em] uppercase"
            fill="url(#circling3DGradient)"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.8)) drop-shadow(0 0 16px rgba(236,72,153,0.6))',
            }}
          >
            <textPath href="#nameOrbitPath3D" xlinkHref="#nameOrbitPath3D" startOffset="0%">
              ✦ IRAKOZE LIONEL SABIN ✦ IRAKOZE LIONEL SABIN ✦
            </textPath>
          </text>
        </svg>

        {/* 4. PROFILE PICTURE / LOGO (PLANET CORE) */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/30 via-blue-500/20 to-pink-500/30 blur-xl animate-pulse" />
          
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden flex items-center justify-center bg-slate-950 border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(0,240,255,0.6),inset_0_0_20px_rgba(0,240,255,0.3)]">
            {profile.profilePhoto || profile.logoImage ? (
              <img
                src={profile.profilePhoto || profile.logoImage}
                alt="IRAKOZE LIONEL SABIN"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#0b1633] via-[#10204d] to-[#1c2e68] text-cyan-300">
                <User className="w-14 h-14 sm:w-16 sm:h-16 text-cyan-300 drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 5. DYNAMIC PRELOAD PROGRESS METER & STATUS */}
      <div className="relative z-20 mt-6 sm:mt-8 w-72 sm:w-88 max-w-[90vw] text-center space-y-2.5">
        
        {/* Progress Bar Frame */}
        <div className="relative h-2 w-full rounded-full bg-slate-900/90 border border-cyan-500/30 overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(0,240,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Metrics & Status Label */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
          <span className="text-cyan-300 flex items-center gap-1.5 truncate max-w-[70%]">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin-slow shrink-0" />
            <span className="truncate">{statusMessage}</span>
          </span>
          <span className="font-bold text-white font-orbitron px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-[10px]">
            {progress}%
          </span>
        </div>

        {/* Rwanda Tech Tag */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-300 tracking-wider">
            IRAKOZE LIONEL SABIN • RWANDA 🇷🇼
          </span>
        </div>
      </div>
    </div>
  );
};
