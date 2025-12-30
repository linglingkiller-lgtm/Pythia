import React from 'react';
import { 
  User, 
  Bell, 
  Palette, 
  Workflow, 
  Calendar, 
  Eye, 
  Shield, 
  Search,
  Building2,
  Users,
  Lock,
  Database,
  Link,
  FileText
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export type SettingsTab = 
  // Standard
  | 'profile' | 'notifications' | 'appearance' | 'workflow' | 'calendar' | 'privacy' | 'security'
  // Admin
  | 'organization' | 'users' | 'roles' | 'data' | 'integrations' | 'audit';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  const { isDarkMode } = useTheme();

  const standardTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'workflow', label: 'Workflow', icon: Workflow },
    { id: 'calendar', label: 'Calendar & Time', icon: Calendar },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const adminTabs = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Lock },
    { id: 'data', label: 'Data & Exports', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'audit', label: 'Audit & Compliance', icon: FileText },
  ];

  const TabButton = ({ tab, isAdmin = false }: { tab: any, isAdmin?: boolean }) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;

    return (
      <button
        onClick={() => onTabChange(tab.id as SettingsTab)}
        className={`
          w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
          ${isActive 
            ? isDarkMode 
              ? 'bg-blue-500/10 text-blue-400' 
              : 'bg-blue-50 text-blue-700'
            : isDarkMode
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={isActive ? 'text-blue-500' : 'opacity-70 group-hover:opacity-100'} />
          {tab.label}
        </div>
        {isAdmin && (
          <span className={`
            text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border
            ${isActive
              ? isDarkMode ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' : 'bg-blue-100 border-blue-200 text-blue-700'
              : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-gray-100 border-gray-200 text-gray-500'
            }
          `}>
            Admin
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={`
      w-full md:w-64 flex-shrink-0 h-full flex flex-col md:border-r
      ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
    `}>
      {/* Search */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input 
            type="text"
            placeholder="Search settings..."
            className={`
              w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all
              ${isDarkMode 
                ? 'bg-slate-800/50 border border-slate-700 focus:border-slate-600 text-white placeholder-slate-500' 
                : 'bg-gray-50 border border-gray-200 focus:border-gray-300 text-gray-900 placeholder-gray-500'
              }
            `}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Standard Settings */}
        <nav className="space-y-1">
          {standardTabs.map(tab => (
            <TabButton key={tab.id} tab={tab} />
          ))}
        </nav>

        {/* Admin Divider */}
        <div className="relative py-2">
          <div className={`absolute inset-0 flex items-center`}>
            <div className={`w-full border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`} />
          </div>
          <div className="relative flex justify-center">
            <span className={`
              inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm
              ${isDarkMode 
                ? 'bg-slate-900 border-indigo-500/30 text-indigo-400 shadow-indigo-900/20' 
                : 'bg-white border-indigo-100 text-indigo-600 shadow-indigo-100/50'
              }
            `}>
              <Shield size={10} className="fill-current" />
              Admin Tools
            </span>
          </div>
        </div>

        {/* Admin Settings */}
        <nav className="space-y-1">
          {adminTabs.map(tab => (
            <TabButton key={tab.id} tab={tab} isAdmin />
          ))}
        </nav>
      </div>
    </div>
  );
}
