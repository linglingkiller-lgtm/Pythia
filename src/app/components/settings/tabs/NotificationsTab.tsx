import React from 'react';
import { Card } from '../../ui/Card';
import { Switch } from '../../ui/switch';
import { useTheme } from '../../../contexts/ThemeContext';
import { Bell, Mail, Smartphone, Clock, AlertCircle } from 'lucide-react';

export function NotificationsTab() {
  const { isDarkMode } = useTheme();

  const ChannelHeader = ({ icon: Icon, title, status }: { icon: any, title: string, status?: string }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
      </div>
      {status && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          {status}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <ChannelHeader icon={Bell} title="In-App Notifications" />
          <div className="space-y-4">
            {[
              { label: 'Task Assigned', desc: 'When you are assigned to a task', default: true },
              { label: 'Task Due Soon', desc: '24 hours before deadline', default: true },
              { label: 'Mentions', desc: 'When someone @mentions you', default: true },
              { label: 'New Comments', desc: 'On records you follow', default: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.label}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
                </div>
                <Switch defaultChecked={item.default} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <ChannelHeader icon={Mail} title="Email Notifications" />
          <div className="space-y-4">
            {[
              { label: 'Weekly Digest', desc: 'Summary of team activity', default: true },
              { label: 'Compliance Reminders', desc: 'Critical filing alerts', default: true },
              { label: 'Client Reports', desc: 'When reports are generated', default: false },
              { label: 'Security Alerts', desc: 'New logins and password changes', default: true, locked: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.label}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
                </div>
                <Switch defaultChecked={item.default} disabled={item.locked} />
              </div>
            ))}
            
            <div className="pt-4 mt-2 border-t border-gray-200/10">
              <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Digest Frequency
              </label>
              <select className={`
                w-full px-3 py-2 rounded-lg border outline-none transition-all text-sm
                ${isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }
              `}>
                <option value="daily">Daily (8:00 AM)</option>
                <option value="weekly">Weekly (Monday)</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 opacity-75">
        <ChannelHeader icon={Smartphone} title="Push Notifications" status="Coming Soon" />
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Mobile push notifications are currently being rolled out to beta users.
        </p>
        <div className={`p-3 rounded-lg flex gap-3 ${isDarkMode ? 'bg-blue-900/10 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p className="text-xs">
            Download the Revere Companion App to enable push alerts for urgent legislative updates.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quiet Hours</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Pause all non-urgent notifications during these hours. Critical security alerts will still be delivered.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Start Time
                </label>
                <input
                  type="time"
                  defaultValue="18:00"
                  className={`
                    w-full px-3 py-2 rounded-lg border outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                  `}
                />
              </div>
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  End Time
                </label>
                <input
                  type="time"
                  defaultValue="08:00"
                  className={`
                    w-full px-3 py-2 rounded-lg border outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                  `}
                />
              </div>
            </div>
          </div>
          <div className="md:w-px md:h-24 bg-gray-200 dark:bg-slate-800" />
          <div className="flex-1">
             <div className="flex items-center justify-between mb-3">
               <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Enable Quiet Hours</span>
               <Switch defaultChecked />
             </div>
             <div className="flex items-center justify-between">
               <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pause on Weekends</span>
               <Switch defaultChecked />
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
