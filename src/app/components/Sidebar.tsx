import React from 'react';
import { 
  LayoutGrid, 
  FileText, 
  Hash, 
  UsersRound, 
  FolderKanban, 
  CalendarDays, 
  BarChart3, 
  Settings2,
  Building2,
  Radio,
  Users,
  TrendingUp,
  Sparkles,
  Moon,
  Sun,
  Zap,
  MessageSquare,
  GitBranch
} from 'lucide-react';
import { Card } from './ui/Card';
import { Chip } from './ui/Chip';
import { Button } from './ui/Button';
import { OrgSwitcher } from './OrgSwitcher';
import pythiaLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';
import ecLogo from 'figma:asset/d7c67b108e959e20f7952a5cef5c10ce27199907.png';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../data/authData';
import { useTheme } from '../contexts/ThemeContext';
import { useAppMode } from '../contexts/AppModeContext';
import { getPageTheme, hexToRgba } from '../config/pageThemes';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  badgeColor?: 'red' | 'blue' | 'green' | 'yellow';
}

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { appMode, setAppMode } = useAppMode();
  
  const navItems: NavItem[] = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', badge: '12' },
    { icon: <Radio size={20} />, label: 'War Room', badge: '3', badgeColor: 'red' },
    { icon: <Building2 size={20} />, label: 'Clients' },
    { icon: <FileText size={20} />, label: 'Bills', badge: '7', badgeColor: 'blue' },
    { icon: <Hash size={20} />, label: 'Issues' },
    { icon: <UsersRound size={20} />, label: 'Legislators' },
    { icon: <FolderKanban size={20} />, label: 'Projects', badge: '5', badgeColor: 'yellow' },
    { icon: <CalendarDays size={20} />, label: 'Calendar' },
    { icon: <MessageSquare size={20} />, label: 'Chat', badge: '8', badgeColor: 'green' },
    { icon: <BarChart3 size={20} />, label: 'Records' },
    { icon: <Users size={20} />, label: 'Team' },
    { icon: <TrendingUp size={20} />, label: 'Analytics' },
    { icon: <Settings2 size={20} />, label: 'Settings' },
  ];
  
  return (
    <div 
      className={`
        fixed left-0 top-0 h-screen w-72 flex flex-col transition-all duration-500 z-20 backdrop-blur-xl border-r
        ${isDarkMode 
          ? 'bg-slate-950/80 border-white/5' 
          : 'bg-gradient-to-b from-[#8B1538]/95 to-[#6B0F2A]/95 border-white/10'
        }
      `}
      style={{
        boxShadow: isDarkMode 
          ? '4px 0 24px rgba(0, 0, 0, 0.2)' 
          : '4px 0 24px rgba(139, 21, 56, 0.15)'
      }}
    >
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Gradient orbs for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div 
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-[100px]"
              style={{ background: 'radial-gradient(circle, rgba(220, 38, 38, 0.8) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute top-1/2 -left-20 w-64 h-64 rounded-full opacity-15 blur-[100px]"
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)' }}
            />
          </>
        ) : (
          <>
            <div 
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-[80px]"
              style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute bottom-20 -left-20 w-64 h-64 rounded-full opacity-10 blur-[80px]"
              style={{ background: 'radial-gradient(circle, rgba(30, 58, 138, 0.5) 0%, transparent 70%)' }}
            />
          </>
        )}
      </div>

      {/* Sidebar Header - Revere Branding */}
      <div className="relative mb-4 pb-6 border-b border-white/10 px-6 pt-6 z-10">
        {/* Logo and Title */}
        <div className="flex flex-col items-center text-center">
          {/* Logo with glow effect and Christmas lights */}
          <div className="relative mb-3 group">
            {/* Christmas Lights in a perfect circle around the logo */}
            <div className="absolute inset-0" style={{ width: '96px', height: '96px', left: '-8px', top: '-8px' }}>
              {/* 12 lights evenly distributed in a circle */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180); // 30 degrees apart (360/12)
                const radius = 48; // Distance from center (smaller to avoid text overlap)
                const x = 48 + radius * Math.cos(angle - Math.PI / 2); // Center at 48px, start from top
                const y = 48 + radius * Math.sin(angle - Math.PI / 2);
                const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-400'];
                const colorClass = colors[i % 4];
                const size = i % 3 === 0 ? 'w-2.5 h-2.5' : 'w-2 h-2'; // Smaller sizes
                const shadows = {
                  'bg-red-500': '0 0 8px rgba(239, 68, 68, 0.8)',
                  'bg-green-500': '0 0 6px rgba(34, 197, 94, 0.8)',
                  'bg-blue-500': '0 0 6px rgba(59, 130, 246, 0.8)',
                  'bg-yellow-400': '0 0 6px rgba(250, 204, 21, 0.8)',
                };
                
                return (
                  <div
                    key={i}
                    className={`absolute ${size} rounded-full ${colorClass} animate-slow-pulse`}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${i * 0.25}s`,
                      boxShadow: shadows[colorClass as keyof typeof shadows],
                    }}
                  />
                );
              })}
            </div>
            
            <div 
              className="absolute inset-0 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"
              style={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #DC2626, #3B82F6)' 
                  : 'linear-gradient(135deg, #FFFFFF, #3B82F6)'
              }}
            />
            <img 
              src={pythiaLogo} 
              alt="Revere Logo" 
              className="relative transition-transform duration-500 group-hover:scale-110" 
              style={{ 
                width: '80px',
                height: '80px',
                filter: isDarkMode 
                  ? 'brightness(0) invert(1) drop-shadow(0 0 30px rgba(255, 255, 255, 0.6))' 
                  : 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))',
              }} 
            />
          </div>
          
          {/* Title with shimmer effect */}
          <div className="relative">
            <h1 
              className={`
                mb-1.5 tracking-wide relative
                ${isDarkMode ? 'text-white' : 'text-white'}
              `}
              style={{ 
                fontFamily: '"Anta", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif', 
                fontSize: '36px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textShadow: isDarkMode 
                  ? '0 0 40px rgba(220, 38, 38, 0.5), 0 2px 10px rgba(0, 0, 0, 0.5)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Santa Hat on the R */}
              <span className="relative inline-block">
                R
                <svg 
                  className="absolute" 
                  style={{ 
                    width: '22px', 
                    height: '22px', 
                    top: '0px', 
                    left: '-8px',
                    transform: 'rotate(-30deg)',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                  }}
                  viewBox="0 0 100 100"
                >
                  {/* Hat body */}
                  <path 
                    d="M 20 75 Q 50 25 80 75 Z" 
                    fill="#DC2626"
                    stroke="#B91C1C"
                    strokeWidth="2"
                  />
                  {/* White fur trim */}
                  <ellipse 
                    cx="50" 
                    cy="75" 
                    rx="32" 
                    ry="7" 
                    fill="white"
                  />
                  {/* Pom-pom */}
                  <circle 
                    cx="50" 
                    cy="23" 
                    r="9" 
                    fill="white"
                  />
                  {/* Pom-pom shadow */}
                  <circle 
                    cx="50" 
                    cy="25" 
                    r="7" 
                    fill="#F3F4F6"
                  />
                </svg>
              </span>
              evere
            </h1>
            <div 
              className={`
                text-xs font-medium tracking-wider uppercase
                ${isDarkMode ? 'text-slate-300' : 'text-white/90'}
              `}
              style={{ letterSpacing: '0.15em' }}
            >
              Intelligence Platform
            </div>
          </div>
        </div>
        
        {/* Theme Toggle - Positioned below title */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={toggleDarkMode}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-full
              transition-all duration-300 group
              ${isDarkMode 
                ? 'bg-white/10 hover:bg-white/15 border border-white/20' 
                : 'bg-white/15 hover:bg-white/20 border border-white/30'
              }
            `}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className="relative w-5 h-5">
              <Sun 
                size={20} 
                className={`
                  absolute inset-0 transition-all duration-300
                  ${isDarkMode 
                    ? 'opacity-0 rotate-180 scale-0' 
                    : 'opacity-100 rotate-0 scale-100 text-yellow-100'
                  }
                `}
              />
              <Moon 
                size={20} 
                className={`
                  absolute inset-0 transition-all duration-300
                  ${isDarkMode 
                    ? 'opacity-100 rotate-0 scale-100 text-blue-200' 
                    : 'opacity-0 -rotate-180 scale-0'
                  }
                `}
              />
            </div>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-white'}`}>
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>
        
        {/* App Mode Badge */}
        <div className="mt-3 flex justify-center">
          <div
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full
              text-xs font-bold uppercase tracking-wider
              transition-all duration-300
              ${appMode === 'demo'
                ? 'bg-orange-500/20 border border-orange-400/40 text-orange-200'
                : 'bg-green-500/20 border border-green-400/40 text-green-200'
              }
            `}
            style={{
              boxShadow: appMode === 'demo'
                ? '0 0 15px rgba(249, 115, 22, 0.25)'
                : '0 0 15px rgba(34, 197, 94, 0.25)'
            }}
          >
            <div 
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                appMode === 'demo' ? 'bg-orange-400' : 'bg-green-400'
              }`}
            />
            <span>{appMode === 'demo' ? 'Demo' : 'Live'}</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 z-10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div className="space-y-0.5">
          {navItems.map((item, index) => {
            const isActive = item.label === currentPage;
            const pageTheme = getPageTheme(item.label);
            
            return (
              <button
                key={index}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-xl
                  transition-all duration-200 group relative overflow-hidden
                  ${isActive
                    ? isDarkMode
                      ? 'bg-white text-slate-950 shadow-xl font-semibold'
                      : 'bg-white text-slate-950 shadow-xl font-semibold'
                    : isDarkMode
                      ? 'text-white/90 hover:text-white font-medium border border-transparent hover:border-white/10'
                      : 'text-white/90 hover:text-white font-medium border border-transparent hover:border-white/20'
                  }`}
                onClick={() => onPageChange(item.label)}
              >
                {/* Active left indicator bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-slate-200"
                  />
                )}
                
                {/* Hover gradient overlay */}
                {!isActive && (
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: isDarkMode
                        ? 'linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                    }}
                  />
                )}
                
                <div className="flex items-center gap-3 relative z-10">
                  <span className={`
                    transition-transform duration-200
                    ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </div>
                
                {/* Themed Badge - matches page theme */}
                {item.badge && (
                  <span 
                    className="relative z-10 px-2 py-0.5 rounded-full text-xs font-bold transition-all"
                    style={
                      isActive
                        ? {
                            background: pageTheme.accent,
                            color: '#ffffff',
                            boxShadow: `0 2px 4px ${hexToRgba(pageTheme.accent, 0.4)}`
                          }
                        : {
                            background: hexToRgba(pageTheme.accent, 0.15),
                            color: pageTheme.accent,
                            border: `1px solid ${hexToRgba(pageTheme.accent, 0.3)}`
                          }
                    }
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Suite Marketing Link */}
      <div className="px-3 pb-3 border-b border-white/10 z-10">
        <button
          className={`
            w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
            transition-all duration-300 relative overflow-hidden group
            ${currentPage === 'Suite'
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl border border-blue-400/50' 
              : isDarkMode
                ? 'bg-gradient-to-r from-red-600/30 via-purple-600/30 to-blue-600/30 text-white hover:from-red-600/40 hover:via-purple-600/40 hover:to-blue-600/40 border border-white/20 hover:border-white/30 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/15 border border-white/20 hover:border-white/30 shadow-lg'
            }
          `}
          onClick={() => onPageChange('Suite')}
        >
          {/* Animated shimmer */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            style={{ 
              backgroundSize: '200% 100%',
              animation: currentPage !== 'Suite' ? 'shimmer 2s infinite' : 'none'
            }} 
          />
          
          <Sparkles size={20} className="relative z-10" />
          <span className="relative z-10 font-bold text-sm tracking-wide">Explore Suite</span>
          <Zap size={16} className="relative z-10 ml-auto" />
        </button>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes slow-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-white\/20::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
      
      {/* Organization Switcher */}
      <div className="px-3 pt-2 pb-6 z-10">
        <OrgSwitcher variant="sidebar" direction="up">
          {/* Company Logo Section */}
          <div className="flex flex-col items-center gap-3 py-2 cursor-pointer group">
            {/* Logo with subtle glow */}
            <div className="relative">
              <div 
                className="absolute inset-0 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                style={{ 
                  background: isDarkMode 
                    ? 'radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, transparent 70%)' 
                    : 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)'
                }}
              />
              <img 
                src={ecLogo} 
                alt="Echo Canyon Consulting" 
                className={`h-16 relative transition-all duration-500 group-hover:scale-105 ${isDarkMode ? 'opacity-95' : 'opacity-100'}`}
                style={{
                  filter: isDarkMode ? 'brightness(1.1) drop-shadow(0 4px 12px rgba(147, 197, 253, 0.2))' : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))'
                }}
              />
            </div>
            
            {/* Company Name */}
            <div className="text-center">
              <div 
                className={`
                  font-bold tracking-wide transition-colors duration-300
                  ${isDarkMode 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-blue-200 to-slate-300' 
                    : 'text-white/95'
                  }
                `}
                style={{ 
                  fontFamily: '\"Corpline\", sans-serif',
                  fontSize: '15px',
                  letterSpacing: '0.08em',
                  textShadow: isDarkMode 
                    ? 'none' 
                    : '0 1px 3px rgba(0, 0, 0, 0.3)'
                }}
              >
                ECHO CANYON
              </div>
              <div 
                className={`
                  text-xs font-medium tracking-wider mt-0.5
                  ${isDarkMode ? 'text-slate-400' : 'text-white/75'}
                `}
                style={{ letterSpacing: '0.12em' }}
              >
                CONSULTING
              </div>
            </div>
          </div>
        </OrgSwitcher>
      </div>
    </div>
  );
}