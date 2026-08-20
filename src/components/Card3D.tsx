import React, { useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glowColor?: 'cyan' | 'pink' | 'blue' | 'purple' | 'none';
  id?: string;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  innerClassName = 'p-6 sm:p-7',
  glowColor = 'cyan',
  id,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const { settings } = usePortfolio();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!settings.enable3DEffects || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates -0.5 to 0.5
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Subtle tilt: max 6-8 degrees
    const rY = ((x - centerX) / centerX) * 8;
    const rX = ((centerY - y) / centerY) * 8;

    setRotateX(rX);
    setRotateY(rY);
    setGlowPos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100)
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const getGlowStyle = () => {
    if (glowColor === 'pink') {
      return 'rgba(255, 0, 170, 0.45)';
    } else if (glowColor === 'blue') {
      return 'rgba(0, 140, 255, 0.45)';
    } else if (glowColor === 'purple') {
      return 'rgba(168, 85, 247, 0.45)';
    } else if (glowColor === 'none') {
      return 'transparent';
    }
    return 'rgba(0, 229, 255, 0.45)'; // cyan default
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 transition-transform duration-200 ease-out ${className}`}
    >
      <div
        className={`relative rounded-2xl ${innerClassName} transform-style-3d transition-all duration-300 backdrop-blur-xl`}
        style={{
          transform: settings.enable3DEffects && isHovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(10, 26, 62, 0.6) 35%, rgba(4, 14, 38, 0.75) 100%)' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(8, 20, 50, 0.5) 35%, rgba(3, 10, 28, 0.65) 100%)',
          border: isHovered
            ? '1.5px solid rgba(255, 255, 255, 0.6)'
            : '1.5px solid rgba(255, 255, 255, 0.25)',
          boxShadow: isHovered
            ? `0 20px 45px -10px rgba(0, 10, 35, 0.7), 0 0 35px ${getGlowStyle()}, inset 0 2px 3px rgba(255, 255, 255, 0.8)`
            : '0 12px 35px -10px rgba(0, 5, 25, 0.5), inset 0 1.5px 2px rgba(255, 255, 255, 0.5)'
        }}
      >
        {/* Top Specular Sheen Line */}
        <div className="absolute top-0 left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"></div>

        {/* Dynamic Light Sweep Reflection */}
        {isHovered && settings.enable3DEffects && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-80 overflow-hidden"
            style={{
              background: `radial-gradient(circle 260px at ${glowPos.x}% ${glowPos.y}%, rgba(255, 255, 255, 0.3), transparent 70%)`
            }}
          />
        )}

        {/* Content with 3D Depth */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
