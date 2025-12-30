import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface GlowOrbProps {
  className?: string;
  color?: 'red' | 'blue' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

export function GlowOrb({ className = '', color = 'blue', size = 'md' }: GlowOrbProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
  };

  const colorClasses = {
    red: 'bg-red-500/30',
    blue: 'bg-blue-500/30',
    white: 'bg-white/20',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full blur-3xl ${className}`}
      animate={{
        x: mousePosition.x * 0.02,
        y: mousePosition.y * 0.02,
        scale: [1, 1.1, 1],
      }}
      transition={{
        x: { type: 'spring', stiffness: 50, damping: 30 },
        y: { type: 'spring', stiffness: 50, damping: 30 },
        scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      }}
    />
  );
}
