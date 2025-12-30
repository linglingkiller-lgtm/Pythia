import React, { useEffect, useState, ReactNode } from 'react';
import { motion } from 'motion/react';

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  depth?: number;
}

export function FloatingCard({ children, className = '', depth = 1 }: FloatingCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxX = isHovered ? (mousePosition.x - window.innerWidth / 2) * 0.01 * depth : 0;
  const parallaxY = isHovered ? (mousePosition.y - window.innerHeight / 2) * 0.01 * depth : 0;

  return (
    <motion.div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        x: parallaxX,
        y: parallaxY,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      }}
    >
      {children}
    </motion.div>
  );
}
