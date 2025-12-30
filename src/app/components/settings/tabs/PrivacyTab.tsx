import React from 'react';
import { Card } from '../../ui/Card';
import { Switch } from '../../ui/switch';
import { useTheme } from '../../../contexts/ThemeContext';
import { Eye, Shield, Users } from 'lucide-react';

export function PrivacyTab() {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Eye size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Activity Visibility</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <div>
               <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Hide my activity from teammates</p>
               <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Your actions won't appear in team feeds</p>
             </div>
             <Switch />
          </div>
          
           <div className={`p-3 rounded-lg flex gap-3 mt-2 ${isDarkMode ? 'bg-blue-900/10 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
            <Users size={16} className="shrink-0 mt-0.5" />
            <p className="text-xs">
              Admins can always view full audit logs for security and compliance purposes.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Screen Sharing Privacy</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <div>
               <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Mask sensitive fields</p>
               <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Obfuscate SSN, profit margins, and personal emails</p>
             </div>
             <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
             <div>
               <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Blur attachments</p>
               <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Require a click to reveal images and files</p>
             </div>
             <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="p-6 opacity-75">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Data Retention</h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Your organization retains activity logs for 90 days.
            </p>
          </div>
          <span className={`text-xs px-2 py-1 rounded font-medium ${isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            Policy Managed
          </span>
        </div>
      </Card>
    </div>
  );
}
