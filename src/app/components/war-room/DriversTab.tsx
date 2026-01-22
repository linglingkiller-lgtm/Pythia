import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Users, Target, Calendar, Zap, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'motion/react';
import { TargetData } from './competitive-targets/TargetCard';

interface DriversTabProps {
  target: TargetData;
}

interface PaceDriver {
  category: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  metric?: string;
  trend?: 'up' | 'down' | 'stable';
}

export function DriversTab({ target }: DriversTabProps) {
  const { isDarkMode } = useTheme();

  // Generate demo drivers based on target status
  const drivers: PaceDriver[] = [
    {
      category: 'positive',
      title: 'Strong Volunteer Pipeline',
      description: 'Volunteer recruitment exceeding targets with 127% of goal achieved. High retention rate and consistent daily turnout.',
      impact: 'high',
      metric: '+27% vs goal',
      trend: 'up'
    },
    {
      category: 'positive',
      title: 'Data Quality Improving',
      description: 'Survey completion rate has increased from 68% to 89% over the past two weeks through better canvasser training.',
      impact: 'medium',
      metric: '89% completion',
      trend: 'up'
    },
    {
      category: 'negative',
      title: 'Weather Disruptions',
      description: 'Rain delays have reduced field hours by approximately 15% this week. Contingency indoor phone banking activated.',
      impact: 'medium',
      metric: '-15% field hours',
      trend: 'down'
    },
    {
      category: target.paceStatus === 'behind' ? 'negative' : 'neutral',
      title: target.primaryBlocker === 'understaffed' ? 'Staffing Shortage' : 'Turf Difficulty',
      description: target.primaryBlocker === 'understaffed' 
        ? 'Current staffing at 73% of optimal level. Active recruitment underway with 5 candidates in interview process.'
        : 'Rural turf areas requiring longer drive times between doors. Route optimization implemented to improve efficiency.',
      impact: 'high',
      metric: target.primaryBlocker === 'understaffed' ? '73% staffed' : '+22 min/door',
      trend: 'down'
    },
    {
      category: 'positive',
      title: 'Weekend Surge Performance',
      description: 'Saturday/Sunday operations consistently hitting 140% of weekday averages. Weekend volunteer coordinator role proving highly effective.',
      impact: 'medium',
      metric: '+40% weekends',
      trend: 'up'
    },
    {
      category: 'neutral',
      title: 'Voter Contact Rate',
      description: 'Contact rate stable at 42%, slightly below national average of 45%. Testing new approach times in next phase.',
      impact: 'low',
      metric: '42% contact rate',
      trend: 'stable'
    }
  ];

  // Performance metrics summary
  const performanceMetrics = [
    {
      label: 'Doors/Day',
      value: target.paceStatus === 'on-track' ? '892' : target.paceStatus === 'slightly-behind' ? '723' : '614',
      target: '850',
      status: target.paceStatus === 'on-track' ? 'good' : target.paceStatus === 'slightly-behind' ? 'warning' : 'danger',
      trend: target.paceStatus === 'on-track' ? 'up' : 'down'
    },
    {
      label: 'Survey Rate',
      value: '76%',
      target: '70%',
      status: 'good',
      trend: 'up'
    },
    {
      label: 'Volunteer Hours',
      value: target.paceStatus === 'behind' ? '284' : '412',
      target: '350',
      status: target.paceStatus === 'behind' ? 'danger' : 'good',
      trend: target.paceStatus === 'behind' ? 'down' : 'up'
    },
    {
      label: 'Days to Goal',
      value: target.paceStatus === 'on-track' ? '18' : target.paceStatus === 'slightly-behind' ? '23' : '31',
      target: '21',
      status: target.paceStatus === 'on-track' ? 'good' : target.paceStatus === 'slightly-behind' ? 'warning' : 'danger',
      trend: 'stable'
    }
  ];

  const getDriverIcon = (category: string) => {
    switch (category) {
      case 'positive': return <TrendingUp size={18} className="text-green-500" />;
      case 'negative': return <TrendingDown size={18} className="text-red-500" />;
      default: return <Activity size={18} className="text-blue-500" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    const styles = {
      high: isDarkMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200',
      medium: isDarkMode ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200',
      low: isDarkMode ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[impact as keyof typeof styles];
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border backdrop-blur-sm ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <h4 className={`font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Target size={18} />
            Performance Metrics
          </h4>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Current vs target • Last 7 days
          </p>
        </div>
        <div className="p-4 grid grid-cols-4 gap-4">
          {performanceMetrics.map((metric, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-slate-900/40 border-white/5'
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.label}
              </div>
              <div className="flex items-end gap-2 mb-1">
                <div className={`text-2xl font-bold ${
                  metric.status === 'good' ? 'text-green-500' :
                  metric.status === 'warning' ? 'text-amber-500' :
                  'text-red-500'
                }`}>
                  {metric.value}
                </div>
                <div className={`text-xs pb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  / {metric.target}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {metric.trend === 'up' && <TrendingUp size={12} className="text-green-500" />}
                {metric.trend === 'down' && <TrendingDown size={12} className="text-red-500" />}
                {metric.trend === 'stable' && <Activity size={12} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />}
                <span className={`text-xs ${
                  metric.trend === 'up' ? 'text-green-500' :
                  metric.trend === 'down' ? 'text-red-500' :
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {metric.trend === 'up' ? 'Improving' : metric.trend === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pace Status Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-lg border backdrop-blur-sm p-4 ${
          target.paceStatus === 'on-track'
            ? isDarkMode
              ? 'bg-green-900/20 border-green-500/30'
              : 'bg-green-50 border-green-200'
            : target.paceStatus === 'slightly-behind'
            ? isDarkMode
              ? 'bg-amber-900/20 border-amber-500/30'
              : 'bg-amber-50 border-amber-200'
            : isDarkMode
            ? 'bg-red-900/20 border-red-500/30'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            target.paceStatus === 'on-track'
              ? isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
              : target.paceStatus === 'slightly-behind'
              ? isDarkMode ? 'bg-amber-500/20' : 'bg-amber-100'
              : isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
          }`}>
            {target.paceStatus === 'on-track' ? (
              <CheckCircle size={20} className="text-green-500" />
            ) : target.paceStatus === 'slightly-behind' ? (
              <Clock size={20} className="text-amber-500" />
            ) : (
              <AlertCircle size={20} className="text-red-500" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${
              target.paceStatus === 'on-track'
                ? isDarkMode ? 'text-green-300' : 'text-green-900'
                : target.paceStatus === 'slightly-behind'
                ? isDarkMode ? 'text-amber-300' : 'text-amber-900'
                : isDarkMode ? 'text-red-300' : 'text-red-900'
            }`}>
              {target.paceStatus === 'on-track' ? 'On Track to Meet Goals' :
               target.paceStatus === 'slightly-behind' ? 'Slightly Behind Pace' :
               'Behind Target - Action Required'}
            </h4>
            <p className={`text-sm ${
              target.paceStatus === 'on-track'
                ? isDarkMode ? 'text-green-200/70' : 'text-green-700'
                : target.paceStatus === 'slightly-behind'
                ? isDarkMode ? 'text-amber-200/70' : 'text-amber-700'
                : isDarkMode ? 'text-red-200/70' : 'text-red-700'
            }`}>
              {target.paceStatus === 'on-track'
                ? 'Current operations exceeding minimum requirements. Maintain current staffing and schedule to ensure goal completion.'
                : target.paceStatus === 'slightly-behind'
                ? 'Pace is 8-12% below optimal. Minor adjustments to staffing or hours can bring project back on track within 3-5 days.'
                : 'Significant gap detected. Immediate intervention recommended. See negative drivers below for root causes.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Drivers List */}
      <div className="space-y-3">
        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Pace Drivers & Blockers
        </h4>
        {drivers.map((driver, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`rounded-lg border backdrop-blur-sm p-4 ${
              isDarkMode
                ? 'bg-slate-800/40 border-white/10'
                : 'bg-white/80 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                driver.category === 'positive'
                  ? isDarkMode ? 'bg-green-500/20' : 'bg-green-50'
                  : driver.category === 'negative'
                  ? isDarkMode ? 'bg-red-500/20' : 'bg-red-50'
                  : isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'
              }`}>
                {getDriverIcon(driver.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {driver.title}
                  </h5>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getImpactBadge(driver.impact)}`}>
                      {driver.impact.toUpperCase()} IMPACT
                    </span>
                  </div>
                </div>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {driver.description}
                </p>
                {driver.metric && (
                  <div className="flex items-center gap-2">
                    <div className={`text-xs font-mono px-2 py-1 rounded ${
                      isDarkMode ? 'bg-slate-900/60 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {driver.metric}
                    </div>
                    {driver.trend && (
                      <div className="flex items-center gap-1">
                        {driver.trend === 'up' && <TrendingUp size={12} className="text-green-500" />}
                        {driver.trend === 'down' && <TrendingDown size={12} className="text-red-500" />}
                        <span className={`text-xs ${
                          driver.trend === 'up' ? 'text-green-500' :
                          driver.trend === 'down' ? 'text-red-500' :
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {driver.trend === 'up' ? 'Trending up' : driver.trend === 'down' ? 'Trending down' : 'Stable'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommended Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-lg border backdrop-blur-sm ${
          isDarkMode
            ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30'
            : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
        }`}
      >
        <div className={`p-4 border-b ${isDarkMode ? 'border-blue-500/30' : 'border-blue-200'}`}>
          <h4 className={`font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Zap size={18} className="text-blue-500" />
            Recommended Optimizations
          </h4>
        </div>
        <div className="p-4 space-y-3">
          {[
            'Add 2 additional canvassers to evening shift (5-8pm) to capitalize on higher contact rates',
            'Implement route clustering to reduce drive time in rural areas by estimated 18%',
            'Schedule make-up weekend shifts to recover weather-delayed hours from this week',
            target.paceStatus === 'behind' && 'Consider extending daily operations by 1 hour to accelerate pace recovery'
          ].filter(Boolean).map((action, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                isDarkMode ? 'bg-slate-800/40' : 'bg-white/60'
              }`}
            >
              <CheckCircle size={16} className={`flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {action}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
