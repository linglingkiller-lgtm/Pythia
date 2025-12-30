import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Switch } from '../../ui/switch';
import { useTheme } from '../../../contexts/ThemeContext';
import { FileText, Filter, Download, AlertCircle, Search } from 'lucide-react';

const AdminBadge = () => (
  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
    ADMIN
  </span>
);

export function AuditComplianceTab() {
  const { isDarkMode } = useTheme();

  const auditLogs = [
    { id: 1, action: 'User Login', user: 'Sarah Connor', ip: '192.168.1.1', time: '2 mins ago' },
    { id: 2, action: 'Record Created', user: 'John Smith', resource: 'Meeting Note #429', time: '15 mins ago' },
    { id: 3, action: 'Settings Updated', user: 'Admin User', resource: 'Org Settings', time: '1 hour ago' },
    { id: 4, action: 'Export Generated', user: 'Sarah Connor', resource: 'Client List CSV', time: '3 hours ago' },
    { id: 5, action: 'User Invited', user: 'Admin User', resource: 'new.user@example.com', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
         <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className={`
                  w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all
                  ${isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400'
                  }
                `}
              />
            </div>
            <Button variant="secondary" className="flex items-center gap-2">
              <Filter size={16} />
              Filter
            </Button>
         </div>
         <Button variant="secondary" className="flex items-center gap-2">
            <Download size={16} />
            Export Log
         </Button>
      </div>

      {/* Log Viewer */}
      <Card className="overflow-hidden">
         <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Audit Log</h3>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Showing last 5 events</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm">
               <thead className={`${isDarkMode ? 'bg-slate-900/50 text-gray-400' : 'bg-white text-gray-500'} border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                  <tr>
                     <th className="px-6 py-3 text-left font-medium">Action</th>
                     <th className="px-6 py-3 text-left font-medium">User</th>
                     <th className="px-6 py-3 text-left font-medium">Details</th>
                     <th className="px-6 py-3 text-right font-medium">Time</th>
                  </tr>
               </thead>
               <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-gray-100'}`}>
                  {auditLogs.map((log) => (
                     <tr key={log.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'}`}>
                        <td className={`px-6 py-3 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{log.action}</td>
                        <td className={`px-6 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.user}</td>
                        <td className={`px-6 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.resource || log.ip}</td>
                        <td className={`px-6 py-3 text-right ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{log.time}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>

      {/* Compliance Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Compliance Mode <AdminBadge /></h3>
            </div>
            <div className="flex items-center justify-between">
               <div>
                 <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Enforce Strict Logging</p>
                 <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Log every read access to sensitive records</p>
               </div>
               <Switch />
            </div>
         </Card>

         <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Export Controls <AdminBadge /></h3>
            </div>
            <div className="flex items-center justify-between">
               <div>
                 <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Require Approval</p>
                 <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Admins must approve bulk data exports</p>
               </div>
               <Switch defaultChecked />
            </div>
         </Card>
      </div>
    </div>
  );
}
