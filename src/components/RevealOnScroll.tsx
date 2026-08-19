import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  id?: string;
}

export const RevealOnScroll: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  id
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = usePortfolio();

  useEffect(() => {
    if (!settings.enableAnimations) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [settings.enableAnimations]);

  const getTransform = () => {
    if (!settings.enableAnimations || isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 32px, -20px)';
      case 'down':
        return 'translate3d(0, -32px, -20px)';
      case 'left':
        return 'translate3d(32px, 0, -20px)';
      case 'right':
        return 'translate3d(-32px, 0, -20px)';
      default:
        return 'translate3d(0, 0, -20px)';
    }
  };

  return (
    <div
      id={id}
      ref={ref}
      className={`transition-all duration-700 ease-out transform-style-3d ${className}`}
      style={{
        opacity: isVisible || !settings.enableAnimations ? 1 : 0,
        filter: isVisible || !settings.enableAnimations ? 'blur(0px)' : 'blur(8px)',
        transform: getTransform(),
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};
