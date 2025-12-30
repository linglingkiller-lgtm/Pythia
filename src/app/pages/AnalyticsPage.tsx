import React from 'react';
import { TrendingUp, DollarSign, Target, Users, Award, Sparkles, Download, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';
import { printDocument, formatMetric, formatSection, formatTable, formatStatusBadge } from '../utils/exportUtils';
import { getPageTheme, hexToRgba } from '../config/pageThemes';
import {
  mockClientPerformance,
  mockBillTypePerformance,
  mockLegislatorInfluence,
  mockTeamUtilization,
  mockPythiaAccuracy,
  mockWinRateTrend,
  mockDeliverablesTrend,
  getOverallWinRate,
  getTotalRevenue,
  getAverageROI,
  getTopPerformingClients
} from '../data/analyticsData';

type TimeRange = '30d' | '90d' | 'ytd' | '1y';

export function AnalyticsPage() {
  const { isDarkMode } = useTheme();
  const [timeRange, setTimeRange] = React.useState<TimeRange>('90d');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Get Analytics page theme
  const analyticsTheme = getPageTheme('Analytics');

  const overallWinRate = getOverallWinRate();
  const totalRevenue = getTotalRevenue();
  const averageROI = getAverageROI();
  const topClients = getTopPerformingClients(5);

  // Scroll detection
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 20);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExportReport = () => {
    const clientTableHTML = formatTable(
      ['Client', 'Win Rate', 'Bills', 'Deliverables', 'ROI', 'Owner'],
      mockClientPerformance.map(c => [
        c.clientName,
        `${c.winRate}% (${c.billsPassed}/${c.billsSupported})`,
        c.billsSupported.toString(),
        c.deliverablesCompleted.toString(),
        `${c.estimatedROI}%`,
        c.primaryOwner
      ])
    );

    const billTypeHTML = mockBillTypePerformance.map(bt => `
      <p><strong>${bt.billType}:</strong> ${bt.winRate}% win rate (${bt.passed} passed / ${bt.totalBills} total, ${bt.pending} pending)</p>
    `).join('');

    const teamUtilHTML = mockTeamUtilization.map(m => `
      <div style="margin-bottom: 15px; padding: 10px; background: #f9fafb; border-left: 4px solid #3b82f6;">
        <p><strong>${m.userName}</strong> (${m.department})</p>
        <p>Avg Workload: ${m.avgWorkloadScore}% | On-Time Rate: ${m.onTimeRate}%</p>
        <p>Deliverables: ${m.deliverablesCompleted} | Records: ${m.recordsCreated} | Touchpoints: ${m.clientTouchpoints}</p>
      </div>
    `).join('');

    const content = `
      ${formatSection('Executive Summary', `
        ${formatMetric('Overall Win Rate', `${overallWinRate}%`)}
        ${formatMetric('Total Contract Value', `$${(totalRevenue / 1000).toFixed(0)}K`)}
        ${formatMetric('Average ROI', `${averageROI}%`)}
        ${formatMetric('Active Clients', mockClientPerformance.length.toString())}
      `)}

      ${formatSection('Client Performance', clientTableHTML)}

      ${formatSection('Win Rate by Bill Type', billTypeHTML)}

      ${formatSection('Team Utilization', teamUtilHTML)}

      ${formatSection('Revere Accuracy', `
        ${mockPythiaAccuracy.map(p => `
          <p><strong>${p.insightType}:</strong> ${p.accuracyRate}% accuracy (${p.actedUpon}/${p.totalInsights} acted upon, ${p.successfulOutcomes} successful)</p>
        `).join('')}
      `)}
    `;

    printDocument({
      title: 'Performance Analytics Report',
      subtitle: `Generated for ${timeRange === '30d' ? '30 Days' : timeRange === '90d' ? '90 Days' : timeRange === 'ytd' ? 'Year to Date' : '1 Year'}`,
      content,
      includeTimestamp: true,
      includeBranding: true
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Sticky Header */}
      <motion.div
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
              : 'bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg'
            : isDarkMode
            ? 'bg-slate-900/40 backdrop-blur-sm'
            : 'bg-white/40 backdrop-blur-sm'
        }`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Analytics" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(analyticsTheme.gradientFrom, 0.12)}, ${hexToRgba(analyticsTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(analyticsTheme.gradientFrom, 0.08)}, ${hexToRgba(analyticsTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(analyticsTheme.accent, 0.25)
                    : hexToRgba(analyticsTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(analyticsTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(analyticsTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(analyticsTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(analyticsTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <BarChart3
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? analyticsTheme.glow : analyticsTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: analyticsTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? analyticsTheme.glow : analyticsTheme.accent,
                  }}
                >
                  Analytics
                </span>
              </motion.div>

              {/* Subtle breadcrumb-style divider */}
              <span
                className="text-sm font-medium"
                style={{
                  color: isDarkMode
                    ? hexToRgba('#FFFFFF', 0.2)
                    : hexToRgba('#000000', 0.15),
                }}
              >
                /
              </span>

              {/* Title + Subtitle */}
              <div>
                <h1
                  className={`text-3xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: '"Corpline", sans-serif' }}
                >
                  Performance Analytics
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Win rates, client outcomes, team utilization, and insights
                </p>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className={`flex items-center p-1 rounded-lg ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'
              }`}>
                {(['30d', '90d', 'ytd', '1y'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                      timeRange === range
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-white text-gray-900 shadow-sm'
                        : isDarkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : range === 'ytd' ? 'YTD' : '1 Year'}
                  </button>
                ))}
              </div>

              <Button variant="secondary" size="sm" onClick={handleExportReport}>
                <Download size={16} />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top KPIs */}
            <div className="grid grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`border rounded-lg p-6 backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border-white/10'
                    : 'bg-white/80 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                  }`}>
                    <Target size={20} className="text-green-500" />
                  </div>
                  <Chip variant="success" size="sm">+5%</Chip>
                </div>
                <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {overallWinRate}%
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overall Win Rate</div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Bills passed / Bills supported</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={`border rounded-lg p-6 backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border-white/10'
                    : 'bg-white/80 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <DollarSign size={20} className="text-blue-500" />
                  </div>
                  <Chip variant="info" size="sm">+12%</Chip>
                </div>
                <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${(totalRevenue / 1000).toFixed(0)}K
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Contract Value</div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Active client contracts</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`border rounded-lg p-6 backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border-white/10'
                    : 'bg-white/80 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                  }`}>
                    <TrendingUp size={20} className="text-purple-500" />
                  </div>
                  <Chip variant="info" size="sm">+8%</Chip>
                </div>
                <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {averageROI}%
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average ROI</div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Estimated return on investment</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className={`border rounded-lg p-6 backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border-white/10'
                    : 'bg-white/80 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'
                  }`}>
                    <Users size={20} className="text-orange-500" />
                  </div>
                  <Chip variant="warning" size="sm">2 overloaded</Chip>
                </div>
                <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {mockClientPerformance.length}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Clients</div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Across all service lines</div>
              </motion.div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Win Rate Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`border rounded-lg p-6 backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border-white/10'
                    : 'bg-white/80 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                    Win Rate Trend
                  </h3>
                  <Chip variant="success" size="sm">↑ 8% from baseline</Chip>
                </div>
                <div className="h-64">
                  <LineChart data={mockWinRateTrend} color={isDarkMode ? '#10b981' : '#10b981'} isDarkMode={isDarkMode} />
                </div>
              </motion.div>

              {/* Deliverables Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className={`border rounded-lg p-6 backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border-white/10'
                    : 'bg-white/80 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                    Deliverables Completed
                  </h3>
                  <Chip variant="info" size="sm">↑ 15% growth</Chip>
                </div>
                <div className="h-64">
                  <BarChart data={mockDeliverablesTrend} color={isDarkMode ? '#3b82f6' : '#3b82f6'} isDarkMode={isDarkMode} />
                </div>
              </motion.div>
            </div>

            {/* Bill Type Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`border rounded-lg p-6 backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-slate-800/50 border-white/10'
                  : 'bg-white/80 border-gray-200'
              }`}
            >
              <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                Win Rate by Bill Type
              </h3>
              <div className="space-y-4">
                {mockBillTypePerformance.map((billType) => (
                  <div key={billType.billType} className="flex items-center gap-4">
                    <div className={`w-48 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {billType.billType}
                    </div>
                    <div className="flex-1">
                      <div className={`flex items-center justify-between text-xs mb-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <span>{billType.passed} passed / {billType.totalBills} total</span>
                        <span className="font-semibold">{billType.winRate}%</span>
                      </div>
                      <div className={`w-full rounded-full h-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <div
                          className={`h-3 rounded-full ${
                            billType.winRate >= 75 ? 'bg-green-500' :
                            billType.winRate >= 60 ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${billType.winRate}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-32 text-right">
                      <Chip 
                        variant={billType.winRate >= 75 ? 'success' : billType.winRate >= 60 ? 'info' : 'warning'}
                        size="sm"
                      >
                        {billType.pending} pending
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Client Performance Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className={`border rounded-lg overflow-hidden backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-slate-800/50 border-white/10'
                  : 'bg-white/80 border-gray-200'
              }`}
            >
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <h3 className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                  Client Performance
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Client
                      </th>
                      <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Win Rate
                      </th>
                      <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Bills Supported
                      </th>
                      <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Deliverables
                      </th>
                      <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        ROI
                      </th>
                      <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Avg Response Time
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Owner
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
                    {mockClientPerformance.map((client) => (
                      <tr key={client.clientId} className={`transition-colors ${
                        isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
                      }`}>
                        <td className="px-6 py-4">
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{client.clientName}</div>
                          <div className={`text-xs capitalize ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {client.clientType.replace('-', ' ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {client.winRate}%
                            </span>
                            <Chip 
                              variant={client.winRate >= 80 ? 'success' : client.winRate >= 60 ? 'info' : 'warning'}
                              size="sm"
                            >
                              {client.billsPassed}/{client.billsSupported}
                            </Chip>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {client.billsSupported}
                        </td>
                        <td className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {client.deliverablesCompleted}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-semibold text-green-500">{client.estimatedROI}%</span>
                        </td>
                        <td className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {client.avgResponseTime}h
                        </td>
                        <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {client.primaryOwner}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Legislator Influence Network */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`border rounded-lg p-6 backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-slate-800/50 border-white/10'
                  : 'bg-white/80 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                  Legislator Influence Network
                </h3>
                <Chip variant="info" size="sm">Top 5 by alignment</Chip>
              </div>
              <div className="space-y-3">
                {mockLegislatorInfluence.slice(0, 5).map((legislator) => (
                  <div key={legislator.legislatorId} className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {legislator.legislatorName}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {legislator.district} • {legislator.party}
                        </div>
                        {legislator.leadershipPosition && (
                          <div className="text-xs text-purple-500 mt-1">{legislator.leadershipPosition}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {legislator.influenceScore}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Influence Score</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {legislator.meetingsHeld}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Meetings</div>
                      </div>
                      <div>
                        <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {legislator.billsSponsored}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bills Sponsored</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-500">{legislator.alignmentRate}%</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Alignment</div>
                      </div>
                      <div>
                        <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {legislator.committeeMemberships}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Committees</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Team Utilization Heat Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className={`border rounded-lg p-6 backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-slate-800/50 border-white/10'
                  : 'bg-white/80 border-gray-200'
              }`}
            >
              <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                Team Utilization Overview
              </h3>
              <div className="space-y-3">
                {mockTeamUtilization.map((member) => (
                  <div key={member.userId} className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {member.userName}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {member.department}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {member.avgWorkloadScore}%
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Avg Workload</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">{member.onTimeRate}%</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>On-Time</div>
                        </div>
                        <Chip 
                          variant={
                            member.avgWorkloadScore >= 80 ? 'danger' :
                            member.avgWorkloadScore >= 60 ? 'success' :
                            'warning'
                          }
                        >
                          {member.avgWorkloadScore >= 80 ? 'Overloaded' :
                           member.avgWorkloadScore >= 60 ? 'Optimal' :
                           'Underutilized'}
                        </Chip>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3 text-center text-sm">
                      <div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {member.deliverablesCompleted}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deliverables</div>
                      </div>
                      <div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {member.recordsCreated}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Records</div>
                      </div>
                      <div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {member.clientTouchpoints}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Touchpoints</div>
                      </div>
                      <div>
                        <div className="font-semibold text-orange-500">{member.daysOverloaded}d</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overloaded</div>
                      </div>
                      <div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {member.activeClients}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Clients</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Revere Recommendation Accuracy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`border rounded-lg p-6 backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-400/20'
                  : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                  <Sparkles size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                    Revere Recommendation Accuracy
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Performance tracking for intelligent insights
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {mockPythiaAccuracy.map((metric) => (
                  <div key={metric.insightType} className={`rounded-lg p-4 text-center ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-white'
                  }`}>
                    <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {metric.insightType}
                    </div>
                    <div className="text-3xl font-bold text-purple-500 mb-1">{metric.accuracyRate}%</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {metric.actedUpon}/{metric.totalInsights} acted upon
                    </div>
                    <div className="mt-2">
                      <Chip variant={metric.accuracyRate >= 90 ? 'success' : 'info'} size="sm">
                        {metric.successfulOutcomes} successful
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-slow-pulse {
          animation: slow-pulse 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Simple chart components
function LineChart({ data, color, isDarkMode }: { data: any[]; color: string; isDarkMode: boolean }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  return (
    <div className="relative h-full flex items-end justify-between gap-2 px-4">
      {data.map((point, index) => {
        const height = range > 0 ? ((point.value - minValue) / range) * 80 + 20 : 50;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{ 
                  height: `${height}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{point.label}</div>
            <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{point.value}%</div>
          </div>
        );
      })}
    </div>
  );
}

function BarChart({ data, color, isDarkMode }: { data: any[]; color: string; isDarkMode: boolean }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="relative h-full flex items-end justify-between gap-2 px-4">
      {data.map((point, index) => {
        const height = (point.value / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{ 
                  height: `${height}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{point.label}</div>
            <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{point.value}</div>
          </div>
        );
      })}
    </div>
  );
}