import React from 'react';
import { Download, Upload, FileText, Database, History, RefreshCw } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAppMode } from '../../../contexts/AppModeContext';

const AdminBadge = () => (
  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
    ADMIN
  </span>
);

export function DataTab() {
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Data Export <AdminBadge />
        </h3>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Download your organization's data in CSV format. Large exports may take a few minutes to process.
        </p>
        
        <div className="space-y-4">
          {[
            { id: 'users', name: 'User Directory', desc: 'Full list of team members and roles', icon: Database },
            { id: 'records', name: 'Records & Activity', desc: 'All client records and interactions', icon: FileText },
            { id: 'audit', name: 'Audit Logs', desc: 'Security and access logs (Last 90 days)', icon: History },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className={`p-4 rounded-lg border flex items-center justify-between ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  disabled={appMode === 'demo'}
                >
                  <Download size={16} className="mr-2" />
                  Export CSV
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 opacity-75">
           <div className="flex items-center gap-2 mb-4">
             <Upload size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
             <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Data Import</h3>
           </div>
           <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
             Bulk import tools for clients, bills, and legacy records are coming soon.
           </p>
           <Button variant="secondary" disabled className="w-full">
             Import Wizard (Coming Soon)
           </Button>
        </Card>

        <Card className="p-6">
           <div className="flex items-center gap-2 mb-4">
             <RefreshCw size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
             <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Data Retention <AdminBadge /></h3>
           </div>
           <div className="flex items-center justify-between mb-4">
             <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Retention Period</span>
             <span className={`text-xs px-2 py-1 rounded font-medium border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
               90 Days
             </span>
           </div>
           <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
             To extend your data retention window for compliance purposes, please contact support.
           </p>
        </Card>
      </div>
    </div>
  );
}
