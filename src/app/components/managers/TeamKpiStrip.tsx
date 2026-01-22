import React from 'react';
import { 
  FileText, 
  AlertCircle, 
  BarChart, 
  Clock, 
  Database, 
  Users, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TeamKpiStripProps {
  kpis: {
    activeDeliverablesThisWeek: number;
    overdueDeliverables: number;
    workloadBalanceScore: number;
    avgTimeToComplete: number;
    recordsCreatedThisWeek: number;
    clientTouchpoints: number;
    qaFlags: number;
    burnoutRiskCount: number;
  };
}

export function TeamKpiStrip({ kpis }: TeamKpiStripProps) {
  const { isDarkMode } = useTheme();

  const kpiTiles = [
    {
      label: 'Active Deliverables',
      value: kpis.activeDeliverablesThisWeek,
      subtext: 'this week',
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Overdue',
      value: kpis.overdueDeliverables,
      subtext: 'deliverables',
      icon: AlertCircle,
      color: kpis.overdueDeliverables > 0 ? 'red' : 'gray',
      highlight: kpis.overdueDeliverables > 0
    },
    {
      label: 'Workload Balance',
      value: `${kpis.workloadBalanceScore}%`,
      subtext: 'team balance',
      icon: BarChart,
      color: kpis.workloadBalanceScore >= 80 ? 'green' : kpis.workloadBalanceScore >= 60 ? 'yellow' : 'orange'
    },
    {
      label: 'Avg Completion',
      value: `${kpis.avgTimeToComplete}d`,
      subtext: 'time to complete',
      icon: Clock,
      color: 'purple'
    },
    {
      label: 'Records Created',
      value: kpis.recordsCreatedThisWeek,
      subtext: 'this week',
      icon: Database,
      color: 'indigo'
    },
    {
      label: 'Client Touchpoints',
      value: kpis.clientTouchpoints,
      subtext: 'logged this week',
      icon: Users,
      color: 'teal'
    },
    {
      label: 'QA Flags',
      value: kpis.qaFlags,
      subtext: 'compliance issues',
      icon: AlertTriangle,
      color: kpis.qaFlags > 0 ? 'orange' : 'gray'
    },
    {
      label: 'Burnout Risk',
      value: kpis.burnoutRiskCount,
      subtext: 'team members',
      icon: TrendingUp,
      color: kpis.burnoutRiskCount > 0 ? 'red' : 'green',
      highlight: kpis.burnoutRiskCount > 0
    }
  ];

  const getColorClasses = (color: string, isHighlight?: boolean) => {
    const lightColors: { [key: string]: { bg: string; text: string; icon: string } } = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-600' },
      red: { bg: 'bg-red-50', text: 'text-red-900', icon: 'text-red-600' },
      green: { bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-900', icon: 'text-purple-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-900', icon: 'text-indigo-600' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-900', icon: 'text-teal-600' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-900', icon: 'text-gray-600' },
    };

    const darkColors: { [key: string]: { bg: string; text: string; icon: string } } = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-300', icon: 'text-blue-400' },
      red: { bg: 'bg-red-500/10', text: 'text-red-300', icon: 'text-red-400' },
      green: { bg: 'bg-green-500/10', text: 'text-green-300', icon: 'text-green-400' },
      yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-300', icon: 'text-yellow-400' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-300', icon: 'text-orange-400' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-300', icon: 'text-purple-400' },
      indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-300', icon: 'text-indigo-400' },
      teal: { bg: 'bg-teal-500/10', text: 'text-teal-300', icon: 'text-teal-400' },
      gray: { bg: 'bg-slate-700/30', text: 'text-gray-300', icon: 'text-gray-400' },
    };

    const colors = isDarkMode 
      ? (darkColors[color] || darkColors.gray)
      : (lightColors[color] || lightColors.gray);
    
    if (isHighlight) {
      return {
        bg: colors.bg,
        text: colors.text,
        icon: colors.icon,
        border: isDarkMode ? 'border-2 border-red-500/50' : 'border-2 border-red-300'
      };
    }

    return { 
      ...colors, 
      border: isDarkMode ? 'border border-white/10' : 'border border-gray-200' 
    };
  };

  return (
    <div className={`px-6 py-4 flex-shrink-0 bg-transparent`}>
      <div className="grid grid-cols-8 gap-4">
        {kpiTiles.map((tile, index) => {
          const Icon = tile.icon;
          const colors = getColorClasses(tile.color, tile.highlight);

          return (
            <div
              key={index}
              className={`${colors.bg} ${colors.border} rounded-lg p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {tile.label}
                </div>
                <Icon size={18} className={colors.icon} />
              </div>
              <div className={`text-2xl font-bold ${colors.text} mb-1`}>
                {tile.value}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {tile.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}