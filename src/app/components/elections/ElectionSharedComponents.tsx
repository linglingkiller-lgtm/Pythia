import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? { y: -2, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' } : undefined}
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-md transition-all
        ${isDarkMode 
          ? 'bg-slate-900/60 border-white/10 shadow-lg' 
          : 'bg-white/70 border-white/40 shadow-sm'
        }
        ${className}
      `}
    >
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};

interface StatusChipProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'md' }) => {
  const { isDarkMode } = useTheme();
  
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case 'filed':
      case 'published':
      case 'active':
      case 'solid':
      case 'support':
        return isDarkMode ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200';
      case 'declared':
      case 'received':
      case 'new':
      case 'likely':
      case 'monitor':
        return isDarkMode ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rumored':
      case 'requested':
      case 'lean':
      case 'medium':
        return isDarkMode ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'worsening':
      case 'oppose':
      case 'high':
      case 'critical':
      case 'tossup':
        return isDarkMode ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200';
      default:
        return isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formattedStatus = status.replace('_', ' ');

  return (
    <span className={`
      inline-flex items-center justify-center rounded-full border font-medium capitalize
      ${getStatusColor(status)}
      ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}
    `}>
      {formattedStatus}
    </span>
  );
};

interface MetricGaugeProps {
  value: number; // 0-100
  label: string;
  trend?: 'up' | 'down' | 'flat';
  color?: string;
}

export const MetricGauge: React.FC<MetricGaugeProps> = ({ value, label, trend, color = 'blue' }) => {
  const { isDarkMode } = useTheme();
  
  const getColorClass = () => {
    if (color === 'red') return 'text-red-500';
    if (color === 'green') return 'text-green-500';
    if (color === 'yellow') return 'text-yellow-500';
    return 'text-blue-500';
  };

  const getBgClass = () => {
    if (color === 'red') return 'bg-red-500';
    if (color === 'green') return 'bg-green-500';
    if (color === 'yellow') return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className={isDarkMode ? 'text-slate-700' : 'text-gray-200'}
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={175.93} // 2 * pi * 28
            strokeDashoffset={175.93 - (175.93 * value) / 100}
            className={`${getColorClass()} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className={`absolute text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </div>
      </div>
      <div className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </div>
    </div>
  );
};
