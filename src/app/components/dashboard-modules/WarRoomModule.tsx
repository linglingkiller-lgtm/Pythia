import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Pause, XCircle, ChevronRight } from 'lucide-react';
import { DashboardModule } from '../../contexts/DashboardContext';
import { useTheme } from '../../contexts/ThemeContext';

interface WarRoomModuleProps {
  module: DashboardModule;
}

interface Project {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'waiting' | 'blocked';
  statusText: string;
  department: string;
  daysRemaining?: number;
}

const DEMO_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'HB 247 Committee Testimony',
    status: 'on-track',
    statusText: 'Materials drafted, review scheduled for Dec 23',
    department: 'lobbying',
    daysRemaining: 5,
  },
  {
    id: '2',
    name: 'Q4 Valley Transit Canvass',
    status: 'behind',
    statusText: '1,200 doors behind pace, staffing gap identified',
    department: 'campaign-services',
    daysRemaining: 10,
  },
  {
    id: '3',
    name: 'Desert Solar Media Campaign',
    status: 'at-risk',
    statusText: 'Awaiting client approval on messaging framework',
    department: 'public-affairs',
    daysRemaining: 3,
  },
  {
    id: '4',
    name: 'Healthcare Alliance Q4 Deliverables',
    status: 'on-track',
    statusText: 'Weekly update sent, QBR prep underway',
    department: 'public-affairs',
  },
  {
    id: '5',
    name: 'SB 156 Amendment Strategy',
    status: 'waiting',
    statusText: 'Pending committee chair response',
    department: 'lobbying',
  },
];

const STATUS_CONFIG = {
  'on-track': {
    lightColor: 'text-green-700 bg-green-50 border-green-200',
    darkColor: 'text-green-400 bg-green-500/20 border-green-500/30',
    icon: CheckCircle2,
    label: 'On Track',
  },
  'at-risk': {
    lightColor: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    darkColor: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    icon: AlertCircle,
    label: 'At Risk',
  },
  'behind': {
    lightColor: 'text-red-700 bg-red-50 border-red-200',
    darkColor: 'text-red-400 bg-red-500/20 border-red-500/30',
    icon: XCircle,
    label: 'Behind Pace',
  },
  'waiting': {
    lightColor: 'text-blue-700 bg-blue-50 border-blue-200',
    darkColor: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    icon: Clock,
    label: 'Waiting',
  },
  'blocked': {
    lightColor: 'text-gray-700 bg-gray-50 border-gray-200',
    darkColor: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
    icon: Pause,
    label: 'Blocked',
  },
};

export function WarRoomModule({ module }: WarRoomModuleProps) {
  const { isDarkMode } = useTheme();
  const filteredProjects = DEMO_PROJECTS.filter(project => {
    if (module.filters.department === 'all') return true;
    return project.department === module.filters.department;
  }).slice(0, 5);

  const topActions = [
    'Schedule HB 247 testimony review with legal team',
    'Allocate 3 additional canvassers to Valley Transit project',
    'Follow up with Desert Solar on messaging approval',
  ];

  return (
    <div className="space-y-4">
      {/* Active Projects */}
      <div>
        <h4 className={`
          text-xs font-bold uppercase tracking-wide mb-3
          ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}
        `}>
          Active Priority Projects ({filteredProjects.length})
        </h4>
        <div className="space-y-2">
          {filteredProjects.map(project => {
            const StatusIcon = STATUS_CONFIG[project.status].icon;
            return (
              <div
                key={project.id}
                className={`
                  p-3 border rounded-lg transition-all duration-300
                  ${isDarkMode 
                    ? 'border-slate-700 hover:border-purple-500/50 hover:bg-slate-700/50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h5 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.name}
                    </h5>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {project.statusText}
                    </p>
                  </div>
                  {project.daysRemaining !== undefined && (
                    <span className={`text-xs flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {project.daysRemaining}d left
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border
                    ${isDarkMode ? STATUS_CONFIG[project.status].darkColor : STATUS_CONFIG[project.status].lightColor}
                  `}>
                    <StatusIcon className="w-3 h-3" />
                    {STATUS_CONFIG[project.status].label}
                  </span>
                  <span className={`text-xs capitalize ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {project.department.replace('-', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Actions */}
      <div className={`border-t pt-4 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <h4 className={`
          text-xs font-bold uppercase tracking-wide mb-3
          ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}
        `}>
          Today's Top Actions
        </h4>
        <div className="space-y-1.5">
          {topActions.slice(0, 3).map((action, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${isDarkMode 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'bg-purple-100 text-purple-600'
                }
              `}>
                <span className="text-xs font-bold">{idx + 1}</span>
              </div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className={`border-t pt-4 flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button className={`
          text-sm font-medium flex items-center gap-1 transition-colors
          ${isDarkMode 
            ? 'text-purple-400 hover:text-purple-300' 
            : 'text-purple-600 hover:text-purple-700'
          }
        `}>
          View War Room
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className={`
          px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-300
          ${isDarkMode
            ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/30'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
          }
        `}>
          Create Bundle
        </button>
      </div>
    </div>
  );
}