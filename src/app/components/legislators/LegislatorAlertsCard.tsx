import React from 'react';
import { AlertCircle, Calendar, Clock, Cake } from 'lucide-react';
import { Legislator } from './legislatorData';
import { useTheme } from '../../contexts/ThemeContext';

interface LegislatorAlertsCardProps {
  legislator: Legislator;
}

export function LegislatorAlertsCard({ legislator }: LegislatorAlertsCardProps) {
  const { isDarkMode } = useTheme();

  const getAlertIcon = (type: string) => {
    const iconClass = isDarkMode ? '' : '';
    switch (type) {
      case 'hearing':
        return <Calendar size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />;
      case 'vote':
        return <AlertCircle size={16} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />;
      case 'follow-up':
        return <Clock size={16} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />;
      case 'birthday':
        return <Cake size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />;
      default:
        return <AlertCircle size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />;
    }
  };

  const getAlertColor = (type: string) => {
    if (isDarkMode) {
      switch (type) {
        case 'hearing':
          return 'bg-blue-500/10 border-blue-500/20';
        case 'vote':
          return 'bg-red-500/10 border-red-500/20';
        case 'follow-up':
          return 'bg-amber-500/10 border-amber-500/20';
        case 'birthday':
          return 'bg-purple-500/10 border-purple-500/20';
        default:
          return 'bg-slate-700/50 border-white/10';
      }
    } else {
      switch (type) {
        case 'hearing':
          return 'bg-blue-50 border-blue-200';
        case 'vote':
          return 'bg-red-50 border-red-200';
        case 'follow-up':
          return 'bg-amber-50 border-amber-200';
        case 'birthday':
          return 'bg-purple-50 border-purple-200';
        default:
          return 'bg-gray-50 border-gray-200';
      }
    }
  };

  return (
    <div className={`p-5 rounded-xl backdrop-blur-xl border transition-all ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    } shadow-lg`}>
      <h3 className={`font-semibold mb-4 flex items-center gap-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <AlertCircle size={16} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
        Alerts
      </h3>

      {legislator.alerts.length > 0 ? (
        <div className="space-y-2">
          {legislator.alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start gap-2">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {alert.message}
                  </p>
                  {alert.date && (
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {alert.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-sm p-4 rounded-lg text-center ${
          isDarkMode
            ? 'bg-slate-700/50 text-gray-400'
            : 'bg-gray-50 text-gray-500'
        }`}>
          No alerts at this time
        </div>
      )}
    </div>
  );
}