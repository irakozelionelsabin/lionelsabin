import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const LiquidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = usePortfolio();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let t = 0;
    const speedMultiplier = 
      settings.animationIntensity === 'low' ? 0.003 :
      settings.animationIntensity === 'high' ? 0.009 : 0.005;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animationsEnabled = settings.enableAnimations && !prefersReducedMotion;
    const effects3DEnabled = settings.enable3DEffects;

    // Glowing 3D Light Bubbles & Caustic Spheres (high-luminescence liquid)
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
      glow: number;
    }> = [];

    const particleCount = window.innerWidth < 768 ? 35 : 75;
    const colors = ['#00f0ff', '#ff00aa', '#00b4ff', '#ff00ea', '#ffffff', '#ffe600', '#00ffcc', '#7000ff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.75 + 0.35,
        glow: Math.random() * 25 + 12
      });
    }

    const render = () => {
      if (animationsEnabled) {
        t += speedMultiplier;
      }
      
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Base: High Intensity Electric Azure & Deep Royal Sapphire
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, '#00b4ff');
      baseGrad.addColorStop(0.25, '#0070f3');
      baseGrad.addColorStop(0.55, '#0038c7');
      baseGrad.addColorStop(0.85, '#0a174e');
      baseGrad.addColorStop(1, '#03081e');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Parallax shifts from 3D mouse tracking
      const mouseShiftX = effects3DEnabled ? (mouseX / width - 0.5) * 70 : 0;
      const mouseShiftY = effects3DEnabled ? (mouseY / height - 0.5) * 60 : 0;

      // Hard Light Wave 1: Ultra Vivid Fluorescent Magenta & Hot Pink Silk Fold (Upper Right Ribbon)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width * 0.15 + mouseShiftX, 0);
      
      const cp1x = width * 0.85 + Math.sin(t * 0.8) * 50 + mouseShiftX;
      const cp1y = height * 0.25 + Math.cos(t * 0.9) * 40 + mouseShiftY;
      const cp2x = width * 0.55 + Math.sin(t * 1.1) * 60;
      const cp2y = height * 0.85 + Math.cos(t * 0.7) * 50;
      const end1x = width * 1.15;
      const end1y = height * 0.65;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, end1x, end1y);
      ctx.lineTo(width, 0);
      ctx.closePath();

      const pinkGrad = ctx.createLinearGradient(width * 0.3, 0, width, height * 0.85);
      pinkGrad.addColorStop(0, '#ff007f');
      pinkGrad.addColorStop(0.25, '#ff00b7');
      pinkGrad.addColorStop(0.55, '#d000ff');
      pinkGrad.addColorStop(0.85, '#7000ff');
      pinkGrad.addColorStop(1, 'rgba(0, 80, 255, 0.4)');
      ctx.fillStyle = pinkGrad;
      ctx.shadowColor = '#ff00b7';
      ctx.shadowBlur = 40;
      ctx.fill();
      ctx.restore();

      // Iridescent Intense Golden Yellow & Pure White Specular Crest along Wave 1 Peak
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width * 0.17 + mouseShiftX, 0);
      ctx.bezierCurveTo(
        cp1x - 10, cp1y - 10,
        cp2x - 16, cp2y - 16,
        end1x, end1y - 20
      );
      ctx.lineWidth = 22;
      const rimGrad = ctx.createLinearGradient(width * 0.2, 0, width, height * 0.65);
      rimGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      rimGrad.addColorStop(0.2, '#fff275');
      rimGrad.addColorStop(0.4, '#ff9900');
      rimGrad.addColorStop(0.7, '#ff0066');
      rimGrad.addColorStop(1, 'rgba(255, 0, 150, 0)');
      ctx.strokeStyle = rimGrad;
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 30;
      ctx.stroke();
      ctx.restore();

      // Hard Light Wave 2: Sweeping Electric Cyan & Glowing Azure Silk Fold (Lower Ribbon)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.58 + mouseShiftY);
      
      const cp3x = width * 0.25 + Math.cos(t * 0.9) * 45;
      const cp3y = height * 0.38 + Math.sin(t * 0.8) * 40;
      const cp4x = width * 0.70 + Math.sin(t * 0.7) * 55;
      const cp4y = height * 0.92 + Math.cos(t * 1.2) * 45;

      ctx.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, width, height * 0.78);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const cyanGrad = ctx.createLinearGradient(0, height * 0.3, width, height);
      cyanGrad.addColorStop(0, '#00f7ff');
      cyanGrad.addColorStop(0.25, '#00b4ff');
      cyanGrad.addColorStop(0.55, '#7b00ff');
      cyanGrad.addColorStop(0.85, '#d400ff');
      cyanGrad.addColorStop(1, '#051842');
      ctx.fillStyle = cyanGrad;
      ctx.shadowColor = '#00f7ff';
      ctx.shadowBlur = 35;
      ctx.fill();
      ctx.restore();

      // Bright White & Amber Iridescent Crest for Wave 2
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.58 + mouseShiftY);
      ctx.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, width, height * 0.78);
      ctx.lineWidth = 14;
      const crestGrad = ctx.createLinearGradient(0, height * 0.4, width, height * 0.8);
      crestGrad.addColorStop(0, '#ffffff');
      crestGrad.addColorStop(0.3, '#fff4b8');
      crestGrad.addColorStop(0.6, '#ff80d5');
      crestGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.strokeStyle = crestGrad;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 25;
      ctx.stroke();
      ctx.restore();

      // Hard Light Lower Pink Wave (Bottom Left Corner)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.75);
      ctx.bezierCurveTo(
        width * 0.22 + Math.sin(t) * 30, height * 0.62,
        width * 0.48, height * 0.92,
        width * 0.62, height
      );
      ctx.lineTo(0, height);
      ctx.closePath();
      const bottomPink = ctx.createLinearGradient(0, height * 0.6, width * 0.55, height);
      bottomPink.addColorStop(0, '#ff0099');
      bottomPink.addColorStop(0.4, '#ff1a8c');
      bottomPink.addColorStop(0.8, '#a600ff');
      bottomPink.addColorStop(1, 'rgba(0, 180, 255, 0.5)');
      ctx.fillStyle = bottomPink;
      ctx.shadowColor = '#ff0099';
      ctx.shadowBlur = 35;
      ctx.fill();
      ctx.restore();

      // Interactive 3D Cursor Lighting Beam with Intense Specular Reflection
      if (effects3DEnabled) {
        const spotGrad = ctx.createRadialGradient(
          mouseX, mouseY, 10,
          mouseX, mouseY, Math.max(width, height) * 0.5
        );
        spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
        spotGrad.addColorStop(0.15, 'rgba(0, 247, 255, 0.4)');
        spotGrad.addColorStop(0.45, 'rgba(255, 0, 190, 0.25)');
        spotGrad.addColorStop(0.75, 'rgba(0, 120, 255, 0.08)');
        spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw floating luminous particles / glowing glass pearls
      particles.forEach((p) => {
        if (animationsEnabled) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.glow;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings.animationIntensity, settings.enableAnimations, settings.enable3DEffects]);

  return (
    <canvas
      id="liquid-hard-light-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
