import React, { useState } from 'react';
import { SettingsSidebar, SettingsTab } from './SettingsSidebar';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppMode } from '../../contexts/AppModeContext';

// Tabs
import { ProfileTab } from './tabs/ProfileTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { WorkflowTab } from './tabs/WorkflowTab';
import { CalendarTimeTab } from './tabs/CalendarTimeTab';
import { PrivacyTab } from './tabs/PrivacyTab';
import { SecurityTab } from './tabs/SecurityTab';

import { OrganizationTab } from './tabs/OrganizationTab';
import { UserManagementTab } from './tabs/UserManagementTab';
import { RolesPermissionsTab } from './tabs/RolesPermissionsTab';
import { DataTab } from './tabs/DataTab';
import { IntegrationsTab } from './tabs/IntegrationsTab';
import { AuditComplianceTab } from './tabs/AuditComplianceTab';

export function SettingsPage() {
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const renderContent = () => {
    switch (activeTab) {
      // Standard
      case 'profile': return <ProfileTab />;
      case 'notifications': return <NotificationsTab />;
      case 'appearance': return <AppearanceTab />;
      case 'workflow': return <WorkflowTab />;
      case 'calendar': return <CalendarTimeTab />;
      case 'privacy': return <PrivacyTab />;
      case 'security': return <SecurityTab />;
      
      // Admin
      case 'organization': return <OrganizationTab />;
      case 'users': return <UserManagementTab />;
      case 'roles': return <RolesPermissionsTab />;
      case 'data': return <DataTab />;
      case 'integrations': return <IntegrationsTab />;
      case 'audit': return <AuditComplianceTab />;
      
      default: return <ProfileTab />;
    }
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Top Header */}
      <div className={`
        px-8 py-5 border-b transition-colors duration-300 flex items-center justify-between
        ${isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-gray-200 bg-white/50'}
        backdrop-blur-sm sticky top-0 z-10
      `}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage account, organization, security, and preferences
          </p>
        </div>
        
        {/* Org / Mode Chip */}
        <div className={`
          hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium
          ${isDarkMode 
            ? 'bg-slate-800 border-slate-700 text-slate-300' 
            : 'bg-white border-gray-200 text-gray-600 shadow-sm'
          }
        `}>
          <span>Echo Canyon Consulting</span>
          <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}`} />
          <span className={appMode === 'demo' ? 'text-orange-500' : 'text-green-500'}>
            {appMode === 'demo' ? 'Demo Mode' : 'Live Mode'}
          </span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col md:flex-row w-full">
          {/* Sidebar */}
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-transparent via-transparent to-black/[0.02]">
            <div className="max-w-6xl mx-auto space-y-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
