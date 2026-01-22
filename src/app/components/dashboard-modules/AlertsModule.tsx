import React from 'react';
import { Bell, AlertTriangle, Clock, ChevronRight, ExternalLink } from 'lucide-react';
import { DashboardModule } from '../../contexts/DashboardContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Notification } from '../notifications/NotificationDropdown';

interface AlertsModuleProps {
  module: DashboardModule;
  alerts?: Notification[];
}

export function AlertsModule({ module, alerts = [] }: AlertsModuleProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`
                  p-4 rounded-xl border transition-all duration-300 group
                  ${isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                    : 'bg-white border-gray-100 hover:border-gray-300 shadow-sm hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    mt-1 p-2 rounded-full flex-shrink-0
                    ${alert.priority === 'Urgent' 
                      ? (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
                      : (isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600')
                    }
                  `}>
                    {alert.priority === 'Urgent' ? <AlertTriangle size={16} /> : <Bell size={16} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {alert.title}
                      </h4>
                      <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock size={12} />
                        {alert.time}
                      </span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {alert.message}
                    </p>
                    
                    {alert.link && (
                      <button className={`
                        text-xs font-medium flex items-center gap-1 transition-colors
                        ${isDarkMode 
                          ? 'text-purple-400 hover:text-purple-300' 
                          : 'text-purple-600 hover:text-purple-700'
                        }
                      `}>
                        View Details
                        <ExternalLink size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center mb-3
              ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}
            `}>
              <CheckCircle2 size={24} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              All caught up!
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              No critical alerts at this time.
            </p>
          </div>
        )}
      </div>
      
      <div className={`mt-4 pt-3 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <button className={`
          text-xs font-medium flex items-center gap-1 transition-colors
          ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}
        `}>
          View Notification History
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// Helper component
import { CheckCircle2 } from 'lucide-react';
