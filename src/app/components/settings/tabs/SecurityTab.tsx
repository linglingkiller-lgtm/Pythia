import React from 'react';
import { Shield, Key, Smartphone, Clock, LogOut, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Switch } from '../../ui/switch';
import { useTheme } from '../../../contexts/ThemeContext';

export function SecurityTab() {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Authentication</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-gray-200/10">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <Key size={20} />
              </div>
              <div>
                <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Password</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last changed 3 months ago</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">Change Password</Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-green-400' : 'bg-green-50 text-green-600'}`}>
                <Smartphone size={20} />
              </div>
              <div>
                <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Two-Factor Authentication</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enabled via Authenticator App</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                <CheckCircle size={12} />
                Enabled
              </span>
              <Button variant="secondary" size="sm">Configure</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
           <AlertTriangle size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
           <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Security Alerts</h3>
        </div>
        
        <div className="space-y-4">
           <div className="flex items-center justify-between">
             <div>
               <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Unusual Activity</p>
               <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Alert me about logins from new devices or locations</p>
             </div>
             <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Active Sessions</h3>
        
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border flex items-center justify-between ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`} />
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chrome on macOS</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phoenix, AZ • Current Session</p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border flex items-center justify-between opacity-70 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Safari on iPhone</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phoenix, AZ • 2 days ago</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-full">
              <LogOut size={16} />
            </button>
          </div>

          <div className="pt-2">
            <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/10">
              Sign Out All Other Sessions
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
