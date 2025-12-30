import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'rose' | 'green' | 'none';
  onClick?: () => void;
}

export function Card({ children, className = '', glowColor = 'none', onClick }: CardProps) {
  const { isDarkMode } = useTheme();
  
  const glowStyles = {
    cyan: 'shadow-cyan-500/10',
    rose: 'shadow-rose-500/10',
    green: 'shadow-green-500/10',
    none: ''
  };
  
  return (
    <div 
      className={`
        backdrop-blur-xl 
        rounded 
        shadow-lg ${glowStyles[glowColor]}
        transition-all duration-300
        ${isDarkMode 
          ? 'bg-slate-800/50 border border-white/10 hover:border-white/20 hover:bg-slate-800/60 hover:shadow-2xl' 
          : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl'
        }
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}