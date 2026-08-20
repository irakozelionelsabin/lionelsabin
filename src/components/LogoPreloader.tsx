import React, { useEffect, useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { User } from 'lucide-react';

interface LogoPreloaderProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export const LogoPreloader: React.FC<LogoPreloaderProps> = ({ onComplete, forcePlay = false }) => {
  const { profile, settings } = usePortfolio();
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const hasIntroVideo = Boolean(settings.introVideo && settings.introVideoEnabled !== false);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 600);
  };

  // Duration handling and video autoplay assurance
  useEffect(() => {
    if (hasIntroVideo && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay initiated with fallback:', err);
      });
    }

    if (!hasIntroVideo) {
      // 3D Celestial Planet loader exact 3.2s duration
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 3200);

      const completeTimer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 3800);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    } else {
      // Starting Video auto-advance fallback if duration exceeds settings
      const autoSeconds = Math.max(5, (settings.introVideoAutoSkipSeconds || 15)) * 1000;

      const autoAdvanceTimer = setTimeout(() => {
        handleFinish();
      }, autoSeconds);

      return () => {
        clearTimeout(autoAdvanceTimer);
      };
    }
  }, [hasIntroVideo, settings.introVideoAutoSkipSeconds, onComplete]);

  if (!visible) return null;

  // Render 1: Clean, Full-Screen Edge-to-Edge Starting Video
  if (hasIntroVideo && settings.introVideo) {
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
          muted={settings.introVideoMuted ?? true}
          onEnded={handleFinish}
          className="w-full h-full object-cover sm:object-cover bg-black"
        />

        {/* Floating Skip / Enter Button for User Convenience */}
        <button
          onClick={handleFinish}
          className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 hover:border-cyan-400 backdrop-blur-md text-[11px] font-orbitron font-bold transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center gap-1.5 cursor-pointer"
        >
          <span>Skip</span>
          <span className="text-cyan-400 font-mono">✕</span>
        </button>
      </div>
    );
  }

  // Render 2: 3D Planetary Celestial Preloader
  return (
    <div
      id="profile-circle-preloader"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#020512] overflow-hidden select-none transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ perspective: '1200px' }}
    >
      {/* 1. AMAZING COSMIC SPACE BACKGROUND & NEBULA AURORA */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-600/15 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(14,35,80,0.45)_0%,_rgba(4,8,22,0.95)_70%,_#020512_100%)] pointer-events-none" />

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
        className="relative flex items-center justify-center w-72 h-72 sm:w-88 sm:h-88 md:w-[400px] md:h-[400px]"
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
          <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[380px] md:h-[380px] rounded-full border border-cyan-400/40 shadow-[0_0_25px_rgba(0,240,255,0.3),inset_0_0_20px_rgba(0,240,255,0.2)] animate-[spin_6s_linear_infinite]" />
          
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
          <div className="w-[280px] h-[280px] sm:w-[330px] sm:h-[330px] md:w-[360px] md:h-[360px] rounded-full border border-dashed border-pink-500/40 animate-[spin_8s_linear_infinite_reverse]" />
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

        {/* 4. BALANCED PROFILE PICTURE (PLANET CORE) */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/30 via-blue-500/20 to-pink-500/30 blur-xl animate-pulse" />
          
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full overflow-hidden flex items-center justify-center bg-slate-950 border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(0,240,255,0.6),inset_0_0_20px_rgba(0,240,255,0.3)]">
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt="IRAKOZE LIONEL SABIN"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#0b1633] via-[#10204d] to-[#1c2e68] text-cyan-300">
                <User className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-300 drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Subtitle / Rwanda Tech Tag */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
        <span className="text-[11px] font-mono text-cyan-300 font-medium tracking-wider">
          IRAKOZE LIONEL SABIN • RWANDA 🇷🇼
        </span>
      </div>
    </div>
  );
};
