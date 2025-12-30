import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'support' | 'oppose' | 'monitor' | 'warning' | 'success' | 'good' | 'watch' | 'hot' | 'neutral' | 'alert' | 'info' | 'error' | 'red' | 'amber' | 'green' | 'danger';
  size?: 'sm' | 'md';
}

export function Chip({ children, variant = 'neutral', size = 'sm' }: ChipProps) {
  const { isDarkMode } = useTheme();
  
  const getVariantClasses = () => {
    if (isDarkMode) {
      const darkVariants = {
        support: 'bg-green-500/20 text-green-400 border-green-500/30',
        oppose: 'bg-red-500/20 text-red-400 border-red-500/30',
        monitor: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        success: 'bg-green-500/20 text-green-400 border-green-500/30',
        good: 'bg-green-500/20 text-green-400 border-green-500/30',
        watch: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        hot: 'bg-red-600 text-white border-red-700',
        alert: 'bg-red-600 text-white border-red-700',
        error: 'bg-red-500/20 text-red-400 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        neutral: 'bg-white/10 text-gray-300 border-white/20',
        red: 'bg-red-500/20 text-red-400 border-red-500/30',
        amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        green: 'bg-green-500/20 text-green-400 border-green-500/30',
        danger: 'bg-red-500/20 text-red-400 border-red-500/30'
      };
      return darkVariants[variant];
    } else {
      const lightVariants = {
        support: 'bg-green-100 text-green-700 border-green-200',
        oppose: 'bg-red-100 text-red-700 border-red-200',
        monitor: 'bg-gray-100 text-gray-700 border-gray-200',
        warning: 'bg-amber-100 text-amber-700 border-amber-200',
        success: 'bg-green-100 text-green-700 border-green-200',
        good: 'bg-green-100 text-green-700 border-green-200',
        watch: 'bg-amber-100 text-amber-700 border-amber-200',
        hot: 'bg-red-600 text-white border-red-700',
        alert: 'bg-red-600 text-white border-red-700',
        error: 'bg-red-100 text-red-700 border-red-200',
        info: 'bg-blue-100 text-blue-700 border-blue-200',
        neutral: 'bg-gray-100 text-gray-700 border-gray-200',
        red: 'bg-red-100 text-red-700 border-red-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        green: 'bg-green-100 text-green-700 border-green-200',
        danger: 'bg-red-100 text-red-700 border-red-200'
      };
      return lightVariants[variant];
    }
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center rounded border ${getVariantClasses()} ${sizes[size]}`}>
      {children}
    </span>
  );
}