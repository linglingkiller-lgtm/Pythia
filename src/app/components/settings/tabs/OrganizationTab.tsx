import React from 'react';
import { Upload, Palette, Building2 } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Switch } from '../../ui/switch';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAppMode } from '../../../contexts/AppModeContext';
import ecLogo from 'figma:asset/d7c67b108e959e20f7952a5cef5c10ce27199907.png';

const AdminBadge = () => (
  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
    ADMIN
  </span>
);

export function OrganizationTab() {
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();

  return (
    <div className="space-y-6">
      {/* Identity Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Organization Identity</h3>
          <AdminBadge />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-6">
          <div className="flex-shrink-0">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Logo <AdminBadge />
            </label>
            <div className={`
              w-32 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group
              ${isDarkMode 
                ? 'border-slate-700 hover:border-blue-500/50 bg-slate-800/50' 
                : 'border-gray-300 hover:border-blue-400 bg-gray-50'
              }
            `}>
              <img src={ecLogo} alt="Org Logo" className="w-16 h-16 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Click to replace</span>
            </div>
          </div>

          <div className="flex-1 space-y-5">
            <div className="space-y-1.5">
              <label className={`flex items-center text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                Organization Name <AdminBadge />
              </label>
              <input
                type="text"
                defaultValue="Echo Canyon Consulting"
                className={`
                  w-full px-3 py-2.5 rounded-lg border outline-none transition-all
                  ${isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400'
                  }
                `}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className={`flex items-center text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                Brand Accent Color <AdminBadge />
              </label>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-blue-600 shadow-sm border-2 border-white dark:border-slate-700 cursor-pointer" />
                 <input
                  type="text"
                  defaultValue="#2563EB"
                  className={`
                    w-32 px-3 py-2.5 rounded-lg border outline-none transition-all font-mono uppercase
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                      : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                    }
                  `}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200/10">
          <Button variant="primary">Save Changes</Button>
        </div>
      </Card>

      {/* Modules Card */}
      <Card className="p-6">
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Active Modules <AdminBadge />
        </h3>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage available modules for your workspace. Disabling a module hides it for all users.
        </p>
        
        <div className="space-y-4">
          {[
            { name: 'Lobbying Intelligence', desc: 'Bill tracking, legislator analysis, and committee monitoring.', active: true },
            { name: 'Public Affairs', desc: 'Stakeholder management, communication logs, and sentiment analysis.', active: true },
            { name: 'Canvassing & Field', desc: 'Turf management, walker tracking, and voter data integration.', active: true },
            { name: 'PAC Management', desc: 'Donation tracking, compliance reporting, and disbursement logs.', active: false },
          ].map((module) => (
            <div key={module.name} className={`p-4 rounded-lg border flex items-center justify-between ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex-1 pr-4">
                <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{module.name}</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{module.desc}</p>
              </div>
              <Switch checked={module.active} />
            </div>
          ))}
        </div>
      </Card>

      {/* Demo Mode Settings */}
      <Card className="p-6">
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Environment <AdminBadge />
        </h3>
        <div className="flex items-center justify-between">
           <div>
             <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Demo Mode Availability</p>
             <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Allow users to switch between Live and Demo environments</p>
           </div>
           <Switch defaultChecked />
        </div>
      </Card>
    </div>
  );
}
