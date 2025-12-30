import React from 'react';
import { cn } from './utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'rounded transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30',
    secondary: 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-transparent',
    accent: 'bg-cyan-500 hover:bg-cyan-400 text-white border border-cyan-400 hover:border-cyan-300 shadow-lg shadow-cyan-500/20'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3'
  };
  
  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}