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
  GitBranch,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  Vote,
  Network,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Card } from './ui/Card';
import { Chip } from './ui/Chip';
import { Button } from './ui/Button';
import { OrgSwitcher } from './OrgSwitcher';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
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
  isFolder?: boolean;
  children?: NavItem[];
}

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ currentPage, onPageChange, collapsed, onToggleCollapse }: SidebarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { appMode, setAppMode } = useAppMode();
  
  // State for expanded folders
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());
  
  // Get current page theme
  const pageTheme = getPageTheme(currentPage);
  
  const navItems: NavItem[] = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', badge: '12' },
    { icon: <Radio size={20} />, label: 'War Room', badge: '3', badgeColor: 'red' },
    { icon: <Building2 size={20} />, label: 'Clients' },
    { icon: <FileText size={20} />, label: 'Bills', badge: '7', badgeColor: 'blue' },
    { icon: <Hash size={20} />, label: 'Issues' },
    { icon: <UsersRound size={20} />, label: 'Legislators' },
    { icon: <Vote size={20} />, label: 'Elections', badge: 'New', badgeColor: 'blue' },
    { icon: <FolderKanban size={20} />, label: 'Projects', badge: '5', badgeColor: 'yellow' },
    { icon: <CalendarDays size={20} />, label: 'Calendar' },
    { icon: <MessageSquare size={20} />, label: 'Chat', badge: '8', badgeColor: 'green' },
    { icon: <BarChart3 size={20} />, label: 'Records' },
    { icon: <Users size={20} />, label: 'Team' },
    { 
      icon: <Folder size={20} />, 
      label: 'Test Folder', 
      badge: '2',
      badgeColor: 'blue',
      isFolder: true,
      children: [
        { icon: <FileText size={18} />, label: 'Test Page 1' },
        { icon: <BarChart3 size={18} />, label: 'Test Page 2' },
      ]
    },
    { icon: <TrendingUp size={20} />, label: 'Analytics' },
    { icon: <Network size={20} />, label: 'Constellation', badge: 'Beta', badgeColor: 'blue' },
    { icon: <Settings2 size={20} />, label: 'Settings' },
  ];
  
  const toggleFolder = (folderLabel: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderLabel)) {
      newExpanded.delete(folderLabel);
    } else {
      newExpanded.add(folderLabel);
    }
    setExpandedFolders(newExpanded);
  };
  
  return (
    <div 
      className={`
        fixed left-0 top-0 h-screen flex flex-col transition-all duration-500 ease-in-out z-20 overflow-hidden
        ${collapsed ? 'w-20' : 'w-72'}
      `}
      style={{
        background: isDarkMode 
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
          : 'linear-gradient(180deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)',
        backgroundSize: '100% 200%',
        animation: 'background-drift 20s ease infinite',
        boxShadow: '8px 0 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Animated mesh overlay - REMOVED */}
      
      {/* Floating light orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-64 h-64 rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
            top: '10%',
            right: '-50px',
            animation: 'float-orb-1 15s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-48 h-48 rounded-full blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            bottom: '20%',
            left: '-30px',
            animation: 'float-orb-2 18s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-56 h-56 rounded-full blur-[90px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
            top: '50%',
            left: '20%',
            animation: 'float-orb-3 12s ease-in-out infinite'
          }}
        />
      </div>
      
      {/* Glass reflection effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 100%)',
          backgroundSize: '200% 200%',
          animation: 'glass-shine 10s ease-in-out infinite'
        }}
      />
      
      {/* Collapse Toggle Button */}
      <div className={`absolute -right-3 top-6 z-50 transition-all duration-300 ${collapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        <button
          onClick={onToggleCollapse}
          className={`
            w-6 h-6 rounded-full flex items-center justify-center
            backdrop-blur-md shadow-lg border transition-all hover:scale-110
            ${isDarkMode 
              ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white' 
              : 'bg-white/90 border-white/40 hover:text-slate-900'
            }
          `}
          style={{
            color: !isDarkMode ? pageTheme.accent : undefined
          }}
          title={collapsed ? "Expand Sidebar (Cmd+B)" : "Collapse Sidebar (Cmd+B)"}
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      {/* Sidebar Header - Revere Branding */}
      <div className={`relative mb-4 z-10 transition-all duration-500 ${collapsed ? 'px-2 pt-6 pb-4' : 'px-6 pt-6 pb-6'} border-b border-white/20`}>
        
        {/* Toggle button when collapsed (centered) */}
        {collapsed && (
           <button
           onClick={onToggleCollapse}
           className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
           title="Expand Sidebar"
         >
           <PanelLeftOpen size={14} />
         </button>
        )}

        {/* Logo and Title */}
        <div className="flex flex-col items-center text-center">
          {/* Logo with animated glow */}
          <div className="relative mb-3 group">
            <div 
              className="absolute inset-0 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"
              style={{ 
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)'
              }}
            />
            <img 
              src={pythiaLogo} 
              alt="Revere Logo" 
              className={`relative transition-all duration-500 group-hover:scale-110 ${collapsed ? 'w-10 h-10' : 'w-20 h-20'}`}
              style={{
                filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))'
              }}
            />
          </div>
          
          {/* Title - Hide when collapsed */}
          <div className={`relative overflow-hidden transition-all duration-300 ${collapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
            <h1 
              className="mb-1.5 tracking-wide relative whitespace-nowrap text-white font-bold"
              style={{ 
                fontFamily: '"Anta", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif', 
                fontSize: '36px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              Revere
            </h1>
            <div 
              className="text-xs font-medium tracking-wider uppercase whitespace-nowrap text-white/80"
              style={{ letterSpacing: '0.15em' }}
            >
              Intelligence Platform
            </div>
          </div>
        </div>
        
        {/* Theme Toggle */}
        <div className={`mt-4 flex justify-center transition-all duration-300 ${collapsed ? 'mt-6' : 'mt-4'}`}>
          <button
            onClick={toggleDarkMode}
            className={`
              relative flex items-center justify-center rounded-full
              transition-all duration-300 group backdrop-blur-sm
              bg-white/10 hover:bg-white/20 border border-white/30
              ${collapsed ? 'w-10 h-10' : 'gap-2 px-4 py-2'}
            `}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className={`relative ${collapsed ? 'w-5 h-5' : 'w-5 h-5'}`}>
              <Sun 
                size={20} 
                className={`
                  absolute inset-0 transition-all duration-300 text-yellow-300
                  ${isDarkMode 
                    ? 'opacity-0 rotate-180 scale-0' 
                    : 'opacity-100 rotate-0 scale-100'
                  }
                `}
              />
              <Moon 
                size={20} 
                className={`
                  absolute inset-0 transition-all duration-300 text-blue-200
                  ${isDarkMode 
                    ? 'opacity-100 rotate-0 scale-100' 
                    : 'opacity-0 -rotate-180 scale-0'
                  }
                `}
              />
            </div>
            {!collapsed && (
              <span className="text-xs font-semibold text-white">
                {isDarkMode ? 'Dark' : 'Light'}
              </span>
            )}
          </button>
        </div>
        
        {/* App Mode Badge */}
        <div className={`mt-3 flex justify-center transition-all duration-300`}>
          <div
            className={`
              flex items-center rounded-full backdrop-blur-sm
              transition-all duration-300
              ${appMode === 'demo'
                ? 'bg-orange-500/30 border border-orange-300/50 text-orange-100'
                : 'bg-green-500/30 border border-green-300/50 text-green-100'
              }
              ${collapsed ? 'w-3 h-3 p-0 justify-center border-0' : 'gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider'}
            `}
            style={{
              boxShadow: appMode === 'demo'
                ? '0 0 20px rgba(249, 115, 22, 0.4)'
                : '0 0 20px rgba(34, 197, 94, 0.4)'
            }}
          >
            <div 
              className={`rounded-full animate-pulse ${
                appMode === 'demo' ? 'bg-orange-300' : 'bg-green-300'
              } ${collapsed ? 'w-2 h-2' : 'w-1.5 h-1.5'}`}
            />
            {!collapsed && <span>{appMode === 'demo' ? 'Demo' : 'Live'}</span>}
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 z-10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div className="space-y-0.5">
          {navItems.map((item, index) => {
            const isActive = item.label === currentPage;
            const pageTheme = getPageTheme(item.label);
            const hasUnread = !!item.badge;
            const isExpanded = expandedFolders.has(item.label);
            const isFolder = item.isFolder && item.children && item.children.length > 0;
            
            // Check if any child is active
            const hasActiveChild = isFolder && item.children?.some(child => child.label === currentPage);
            
            if (isFolder) {
              // Render folder with children
              return (
                <div key={index} className="folder-container">
                  {/* Folder Button */}
                  <button
                    className={`
                      flex items-center rounded-xl
                      transition-all duration-200 group relative overflow-hidden
                      ${collapsed 
                        ? 'w-12 h-12 justify-center mx-auto mb-2' 
                        : 'w-full justify-between px-4 py-3'
                      }
                      ${hasActiveChild
                        ? 'bg-white text-slate-900 shadow-2xl font-semibold'
                        : 'text-white/90 hover:text-white font-medium'
                      }
                    `}
                    onClick={() => {
                      if (!collapsed) {
                        toggleFolder(item.label);
                      } else {
                        // In collapsed mode, clicking shows tooltip with children
                        onToggleCollapse();
                      }
                    }}
                  >
                    {/* Hover gradient overlay */}
                    {!hasActiveChild && (
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: isDarkMode
                            ? 'linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent)'
                            : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                        }}
                      />
                    )}
                    
                    <div className={`flex items-center gap-3 relative z-10 ${collapsed ? 'justify-center' : ''}`}>
                      <span 
                        className={`
                          transition-all duration-200
                          ${hasActiveChild || isExpanded ? 'scale-110' : 'group-hover:scale-110'}
                        `}
                        style={{
                          color: (collapsed && hasUnread && !hasActiveChild) ? pageTheme.accent : undefined
                        }}
                      >
                        {isExpanded && !collapsed ? <FolderOpen size={20} /> : item.icon}
                      </span>
                      
                      {/* Collapsed Mode: Unread Dot */}
                      {collapsed && hasUnread && (
                        <span 
                          className="absolute top-0 right-0 -mr-1 -mt-1 w-2.5 h-2.5 rounded-full border border-slate-900"
                          style={{ background: pageTheme.accent }}
                        />
                      )}

                      {!collapsed && <span className="text-sm">{item.label}</span>}
                    </div>
                    
                    {!collapsed && (
                      <div className="flex items-center gap-2 relative z-10">
                        {/* Badge */}
                        {item.badge && (
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-bold transition-all"
                            style={
                              hasActiveChild
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
                        {/* Chevron */}
                        <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
                          <ChevronRight size={16} className="opacity-60" />
                        </span>
                      </div>
                    )}
                  </button>
                  
                  {/* Children - Animated dropdown */}
                  {!collapsed && (
                    <div 
                      className="folder-children overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: isExpanded ? `${item.children!.length * 48}px` : '0px',
                        opacity: isExpanded ? 1 : 0
                      }}
                    >
                      <div className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50/50'} rounded-xl mt-1 py-1 pl-3`}>
                        {item.children!.map((child, childIndex) => {
                          const childIsActive = child.label === currentPage;
                          const childPageTheme = getPageTheme(child.label);
                          
                          return (
                            <button
                              key={childIndex}
                              className={`
                                flex items-center gap-3 w-full px-4 py-2.5 rounded-lg
                                transition-all duration-200 group relative overflow-hidden
                                ${childIsActive
                                  ? isDarkMode
                                    ? 'bg-white text-slate-950 shadow-lg font-semibold'
                                    : 'bg-white text-slate-800 font-semibold shadow-md'
                                  : isDarkMode
                                    ? 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 font-medium'
                                }
                              `}
                              onClick={() => onPageChange(child.label)}
                            >
                              {/* Hover effect */}
                              {!childIsActive && (
                                <div 
                                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  style={{
                                    background: isDarkMode
                                      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)'
                                      : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)'
                                  }}
                                />
                              )}
                              
                              {/* Active indicator dot */}
                              {childIsActive && (
                                <div 
                                  className="absolute left-1 w-1.5 h-1.5 rounded-full"
                                  style={{ background: childPageTheme.accent }}
                                />
                              )}
                              
                              <span className={`relative z-10 transition-transform duration-200 ${childIsActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                {child.icon}
                              </span>
                              <span className="text-sm relative z-10">{child.label}</span>
                              
                              {/* Child badge if exists */}
                              {child.badge && (
                                <span 
                                  className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold relative z-10"
                                  style={{
                                    background: childIsActive ? childPageTheme.accent : hexToRgba(childPageTheme.accent, 0.15),
                                    color: childIsActive ? '#ffffff' : childPageTheme.accent
                                  }}
                                >
                                  {child.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            
            // Regular item (not a folder)
            const buttonContent = (
              <button
                className={`
                  flex items-center rounded-xl
                  transition-all duration-200 group relative overflow-hidden
                  ${collapsed 
                    ? 'w-12 h-12 justify-center mx-auto mb-2' 
                    : 'w-full justify-between px-4 py-3'
                  }
                  ${isActive
                    ? 'bg-white text-slate-900 shadow-2xl font-semibold'
                    : 'text-white/90 hover:text-white font-medium'
                  }
                `}
                onClick={() => onPageChange(item.label)}
              >
                {/* Active left indicator bar - Only in Expanded */}
                {isActive && !collapsed && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-slate-200"
                  />
                )}

                {/* Active Indicator - Collapsed Mode (Pill behind) */}
                {isActive && collapsed && (
                   <div 
                     className="absolute inset-0 bg-white opacity-100 z-[-1]"
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
                
                <div className={`flex items-center gap-3 relative z-10 ${collapsed ? 'justify-center' : ''}`}>
                  <span 
                    className={`
                      transition-transform duration-200
                      ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                    `}
                    style={{
                      color: (collapsed && hasUnread && !isActive) ? pageTheme.accent : undefined
                    }}
                  >
                    {item.icon}
                  </span>
                  
                  {/* Collapsed Mode: Unread Dot */}
                  {collapsed && hasUnread && (
                    <span 
                      className="absolute top-0 right-0 -mr-1 -mt-1 w-2.5 h-2.5 rounded-full border border-slate-900"
                      style={{ background: pageTheme.accent }}
                    />
                  )}

                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </div>
                
                {/* Expanded Badge */}
                {!collapsed && item.badge && (
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

            if (collapsed) {
              return (
                <TooltipProvider key={index} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {buttonContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-2 bg-slate-900 text-white border-slate-800">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span 
                          className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: pageTheme.accent, color: 'white' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            return <div key={index}>{buttonContent}</div>;
          })}
        </div>
      </nav>
      
      {/* Suite Marketing Link */}
      <div className={`border-b border-white/10 z-10 ${collapsed ? 'px-2 pb-3' : 'px-3 pb-3'}`}>
        <button
          className={`
            flex items-center rounded-xl
            transition-all duration-300 relative overflow-hidden group
            ${collapsed 
              ? 'w-12 h-12 justify-center mx-auto' 
              : 'w-full gap-3 px-4 py-3.5'
            }
            ${currentPage === 'Suite'
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl border border-blue-400/50' 
              : isDarkMode
                ? 'bg-gradient-to-r from-red-600/30 via-purple-600/30 to-blue-600/30 text-white hover:from-red-600/40 hover:via-purple-600/40 hover:to-blue-600/40 border border-white/20 hover:border-white/30 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/15 border border-white/20 hover:border-white/30 shadow-lg'
            }
          `}
          onClick={() => onPageChange('Suite')}
          title={collapsed ? "Explore Suite" : undefined}
        >
          {/* Animated shimmer */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            style={{ 
              backgroundSize: '200% 100%',
              animation: currentPage !== 'Suite' ? 'shimmer 2s infinite' : 'none'
            }} 
          />
          
          <Sparkles size={20} className="relative z-10 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="relative z-10 font-bold text-sm tracking-wide">Explore Suite</span>
              <Zap size={16} className="relative z-10 ml-auto" />
            </>
          )}
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
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
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
        
        @keyframes gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.04;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.06;
          }
        }
        
        @keyframes logo-gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        
        /* Animated gradient filter for logo - Red to Blue transition */
        .logo-gradient-animated {
          animation: logo-color-shift 15s ease infinite;
          filter: brightness(0) saturate(100%);
        }
        
        @keyframes logo-color-shift {
          0% {
            filter: brightness(0) saturate(100%) invert(22%) sepia(94%) saturate(3000%) hue-rotate(348deg) brightness(95%) contrast(91%) drop-shadow(0 0 20px rgba(220, 38, 38, 0.6));
          }
          25% {
            filter: brightness(0) saturate(100%) invert(19%) sepia(81%) saturate(4762%) hue-rotate(271deg) brightness(93%) contrast(96%) drop-shadow(0 0 20px rgba(147, 51, 234, 0.6));
          }
          50% {
            filter: brightness(0) saturate(100%) invert(40%) sepia(97%) saturate(2033%) hue-rotate(205deg) brightness(102%) contrast(94%) drop-shadow(0 0 20px rgba(59, 130, 246, 0.6));
          }
          75% {
            filter: brightness(0) saturate(100%) invert(19%) sepia(81%) saturate(4762%) hue-rotate(271deg) brightness(93%) contrast(96%) drop-shadow(0 0 20px rgba(147, 51, 234, 0.6));
          }
          100% {
            filter: brightness(0) saturate(100%) invert(22%) sepia(94%) saturate(3000%) hue-rotate(348deg) brightness(95%) contrast(91%) drop-shadow(0 0 20px rgba(220, 38, 38, 0.6));
          }
        }
        
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background-color: transparent;
        }
        
        /* Background drift animation */
        @keyframes background-drift {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 0% 100%;
          }
        }
        
        /* Mesh move animation */
        @keyframes mesh-move {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        
        /* Floating orb animations */
        @keyframes float-orb-1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        
        @keyframes float-orb-2 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        
        @keyframes float-orb-3 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -20px) scale(1.05);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        
        /* Glass shine animation */
        @keyframes glass-shine {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>
      
      {/* Organization Switcher */}
      <div className={`z-10 ${collapsed ? 'px-2 pt-2 pb-6' : 'px-3 pt-2 pb-6'}`}>
        <OrgSwitcher variant="sidebar" direction="up" collapsed={collapsed}>
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
                className={`relative transition-all duration-500 group-hover:scale-105 ${isDarkMode ? 'opacity-95' : 'opacity-100'} ${collapsed ? 'h-10' : 'h-16'}`}
                style={{
                  filter: isDarkMode ? 'brightness(1.1) drop-shadow(0 4px 12px rgba(147, 197, 253, 0.2))' : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))'
                }}
              />
            </div>
            
            {/* Company Name - Hide when collapsed */}
            {!collapsed && (
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
            )}
          </div>
        </OrgSwitcher>
      </div>
    </div>
  );
}