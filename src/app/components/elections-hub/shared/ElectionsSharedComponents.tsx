import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../../contexts/ThemeContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};

interface StatusChipProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'lean' | 'stage' | 'status';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'md', variant = 'status' }) => {
  const { isDarkMode } = useTheme();
  
  const getStatusColor = (s: string) => {
    const lower = s.toLowerCase();
    
    // Leans
    if (lower.includes('strong_dem') || lower.includes('strong dem')) return isDarkMode ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-200';
    if (lower.includes('lean_dem') || lower.includes('lean dem')) return isDarkMode ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200';
    if (lower.includes('swing')) return isDarkMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-800 border-purple-200';
    if (lower.includes('lean_rep') || lower.includes('lean rep')) return isDarkMode ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200';
    if (lower.includes('strong_rep') || lower.includes('strong rep')) return isDarkMode ? 'bg-red-600/20 text-red-300 border-red-500/30' : 'bg-red-100 text-red-800 border-red-200';

    // Stages
    if (lower === 'primary') return isDarkMode ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (lower === 'general') return isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (lower === 'special') return isDarkMode ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200';

    // Generic Status
    if (lower === 'new' || lower === 'active') return isDarkMode ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200';
    if (lower === 'high' || lower === 'critical') return isDarkMode ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200';
    
    return isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatLabel = (s: string) => {
    return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const px = size === 'sm' ? 'px-2' : size === 'lg' ? 'px-4' : 'px-3';
  const py = size === 'sm' ? 'py-0.5' : size === 'lg' ? 'py-1.5' : 'py-1';
  const text = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <span className={`
      inline-flex items-center justify-center rounded-full border font-bold capitalize whitespace-nowrap
      ${getStatusColor(status)}
      ${px} ${py} ${text}
    `}>
      {formatLabel(status)}
    </span>
  );
};

export const TrendSparkline = ({ data, color = 'blue' }: { data: number[], color?: string }) => {
  const { isDarkMode } = useTheme();
  
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 30;
  const width = 80;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = color === 'red' ? '#ef4444' : color === 'green' ? '#22c55e' : '#3b82f6';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <circle 
        cx={width} 
        cy={height - ((data[data.length - 1] - min) / range) * height} 
        r="3" 
        fill={strokeColor} 
      />
    </svg>
  );
};

export const TrendIndicator = ({ direction, label }: { direction: string, label?: string }) => {
  const isUp = direction === 'improving' || direction === 'up';
  const isDown = direction === 'worsening' || direction === 'down';
  
  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${
      isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-gray-500'
    }`}>
      {isUp && <TrendingUp size={14} />}
      {isDown && <TrendingDown size={14} />}
      {!isUp && !isDown && <Minus size={14} />}
      {label && <span>{label}</span>}
    </div>
  );
};
