import React from 'react';
import { type Client } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Download, Mail, BarChart, FileCheck, Sparkles, Clock, CheckCircle2, Send } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ReportsDeliverablesHubProps {
  client: Client;
  onOpenGenerator?: () => void;
}

type TimeFilter = '7days' | '30days' | '3months' | 'all';

interface Deliverable {
  id: string;
  type: 'Weekly Update' | 'Bill Report' | 'QBR' | 'Compliance Log' | 'Custom Report' | 'Meeting Brief';
  title: string;
  sentDate: Date;
  sentBy: string;
  status: 'delivered' | 'opened' | 'replied';
  description?: string;
}

export function ReportsDeliverablesHub({ client, onOpenGenerator }: ReportsDeliverablesHubProps) {
  const { isDarkMode } = useTheme();
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>('30days');
  
  const reports = [
    {
      id: '1',
      name: 'Weekly Update',
      description: 'Comprehensive weekly legislative activity summary',
      icon: Mail,
      lastGenerated: '2024-12-15',
    },
    {
      id: '2',
      name: 'Bill Status Report',
      description: 'Current status of all tracked bills with impact analysis',
      icon: FileText,
      lastGenerated: '2024-12-14',
    },
    {
      id: '3',
      name: 'QBR Summary',
      description: 'Quarterly business review slide-style summary',
      icon: BarChart,
      lastGenerated: '2024-10-01',
    },
    {
      id: '4',
      name: 'Compliance Activity Log',
      description: 'Detailed log of all lobbying and engagement activities',
      icon: FileCheck,
      lastGenerated: '2024-12-01',
    },
  ];
  
  // Mock deliverables data
  const allDeliverables: Deliverable[] = [
    {
      id: 'd1',
      type: 'Weekly Update',
      title: 'Week of December 9-13 Legislative Update',
      sentDate: new Date('2024-12-15T14:30:00'),
      sentBy: 'William Deiley',
      status: 'opened',
      description: 'Weekly summary covering HB1090 committee passage and SB2045 amendments'
    },
    {
      id: 'd2',
      type: 'Bill Report',
      title: 'HB1090 Detailed Analysis & Position Recommendation',
      sentDate: new Date('2024-12-14T10:15:00'),
      sentBy: 'Sarah Johnson',
      status: 'replied',
      description: 'Comprehensive bill analysis with fiscal impact assessment'
    },
    {
      id: 'd3',
      type: 'Meeting Brief',
      title: 'Pre-Meeting Brief: Rep. Chen Energy Committee Discussion',
      sentDate: new Date('2024-12-12T09:00:00'),
      sentBy: 'William Deiley',
      status: 'opened',
      description: 'Talking points and background for stakeholder meeting'
    },
    {
      id: 'd4',
      type: 'Weekly Update',
      title: 'Week of December 2-6 Legislative Update',
      sentDate: new Date('2024-12-08T15:45:00'),
      sentBy: 'William Deiley',
      status: 'delivered',
      description: 'Weekly summary covering session opening and committee assignments'
    },
    {
      id: 'd5',
      type: 'Custom Report',
      title: 'End-of-Session Advocacy Impact Report',
      sentDate: new Date('2024-12-01T11:00:00'),
      sentBy: 'Sarah Johnson',
      status: 'replied',
      description: 'Summary of legislative wins and strategic outcomes for 2024 session'
    },
    {
      id: 'd6',
      type: 'Compliance Log',
      title: 'November Lobbying Activity Report',
      sentDate: new Date('2024-12-01T16:30:00'),
      sentBy: 'William Deiley',
      status: 'delivered',
      description: 'Monthly compliance filing with all lobbying contacts and expenditures'
    },
    {
      id: 'd7',
      type: 'Weekly Update',
      title: 'Week of November 25-29 Legislative Update',
      sentDate: new Date('2024-11-30T14:00:00'),
      sentBy: 'William Deiley',
      status: 'opened',
      description: 'Pre-session planning and committee preview'
    },
    {
      id: 'd8',
      type: 'Bill Report',
      title: 'SB2045 Strike-Everything Amendment Analysis',
      sentDate: new Date('2024-11-22T13:20:00'),
      sentBy: 'Sarah Johnson',
      status: 'replied',
      description: 'Analysis of significant amendments to solar interconnection bill'
    },
    {
      id: 'd9',
      type: 'QBR',
      title: 'Q4 2024 Quarterly Business Review',
      sentDate: new Date('2024-10-15T10:00:00'),
      sentBy: 'William Deiley',
      status: 'replied',
      description: 'Comprehensive quarterly review with metrics and strategic outlook'
    },
    {
      id: 'd10',
      type: 'Custom Report',
      title: 'Election Results Impact Analysis',
      sentDate: new Date('2024-10-08T09:30:00'),
      sentBy: 'Sarah Johnson',
      status: 'opened',
      description: 'Analysis of election outcomes and implications for energy policy'
    },
    {
      id: 'd11',
      type: 'Weekly Update',
      title: 'Week of October 1-5 Legislative Update',
      sentDate: new Date('2024-10-06T14:30:00'),
      sentBy: 'William Deiley',
      status: 'delivered',
      description: 'End of session wrap-up and interim committee activities'
    },
    {
      id: 'd12',
      type: 'Compliance Log',
      title: 'September Lobbying Activity Report',
      sentDate: new Date('2024-10-01T16:00:00'),
      sentBy: 'William Deiley',
      status: 'delivered',
      description: 'Monthly compliance filing for September activities'
    },
  ];

  // Filter deliverables based on time filter
  const getFilteredDeliverables = () => {
    const now = new Date();
    const cutoffDates: Record<TimeFilter, Date> = {
      '7days': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30days': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '3months': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      'all': new Date(0),
    };

    return allDeliverables.filter(d => d.sentDate >= cutoffDates[timeFilter])
      .sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime());
  };

  const filteredDeliverables = getFilteredDeliverables();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getStatusColor = (status: Deliverable['status']) => {
    switch (status) {
      case 'replied':
        return isDarkMode ? 'text-emerald-400' : 'text-emerald-600';
      case 'opened':
        return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      case 'delivered':
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusLabel = (status: Deliverable['status']) => {
    switch (status) {
      case 'replied':
        return 'Client replied';
      case 'opened':
        return 'Opened';
      case 'delivered':
        return 'Delivered';
    }
  };

  const getTypeColor = (type: Deliverable['type']) => {
    switch (type) {
      case 'Weekly Update':
        return isDarkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Bill Report':
        return isDarkMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-300';
      case 'QBR':
        return isDarkMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Compliance Log':
        return isDarkMode ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-300';
      case 'Custom Report':
        return isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Meeting Brief':
        return isDarkMode ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border-cyan-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg backdrop-blur-xl border ${
        isDarkMode
          ? 'bg-slate-800/40 border-white/10'
          : 'bg-white/80 border-gray-200'
      }`}>
        <h3 className={`font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Client-Ready Reports</h3>
        <p className={`text-sm mb-4 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Generate and export professional reports for client delivery
        </p>

        <div className="space-y-3">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className={`p-4 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-slate-700/30 border-white/10 hover:border-emerald-500/30'
                  : 'bg-gray-50 border-gray-200 hover:border-emerald-300'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded ${
                    isDarkMode
                      ? 'bg-emerald-500/20'
                      : 'bg-emerald-100'
                  }`}>
                    <Icon size={20} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                  </div>

                  <div className="flex-1">
                    <div className={`font-semibold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{report.name}</div>
                    <div className={`text-sm mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{report.description}</div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Last generated: {new Date(report.lastGenerated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="primary" size="sm">
                      Generate
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revere Client Update Generator */}
      <div className={`p-6 rounded-lg backdrop-blur-xl border ${
        isDarkMode
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-emerald-50 border-emerald-200'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2 rounded ${
            isDarkMode
              ? 'bg-emerald-500'
              : 'bg-emerald-600'
          }`}>
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-900'
            }`}>Revere Client Update Generator</h4>
            <p className={`text-sm ${
              isDarkMode ? 'text-emerald-200' : 'text-emerald-800'
            }`}>
              Automatically converts internal notes, bill movement, and engagement records into a clean, neutral client email/report
            </p>
          </div>
        </div>

        <div className={`space-y-3 mb-4 p-4 rounded-lg border ${
          isDarkMode
            ? 'bg-slate-800/50 border-emerald-500/20'
            : 'bg-white border-emerald-200'
        }`}>
          <div>
            <div className={`text-xs font-semibold mb-1 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
            }`}>What's included:</div>
            <ul className={`text-sm space-y-1 list-disc list-inside ${
              isDarkMode ? 'text-emerald-200' : 'text-emerald-700'
            }`}>
              <li>Wins (bills advanced, supportive votes secured)</li>
              <li>Risks (opposition activity, unfavorable amendments)</li>
              <li>Next steps (upcoming hearings, recommended actions)</li>
              <li>Asks/decisions needed from client</li>
            </ul>
          </div>
        </div>

        <Button variant="primary" onClick={onOpenGenerator}>
          <Mail size={16} />
          Generate Client Update Now
        </Button>
      </div>

      {/* Deliverables Timeline */}
      <div className={`p-6 rounded-lg backdrop-blur-xl border ${
        isDarkMode
          ? 'bg-slate-800/40 border-white/10'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Deliverables Timeline</h3>
            <p className={`text-sm mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Complete history of all reports and updates sent to {client.name}
            </p>
          </div>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
              ${isDarkMode 
                ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-700 hover:border-white/20' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }
            `}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="3months">Last 3 months</option>
            <option value="all">All time</option>
          </select>
        </div>

        {filteredDeliverables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center mb-4
              ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'}
            `}>
              <Clock size={24} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <p className={`font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No deliverables in this time period
            </p>
            <p className={`text-sm mt-1 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Try selecting a different time range
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredDeliverables.map((deliverable, index) => (
              <div key={deliverable.id} className="relative">
                {/* Timeline line */}
                {index !== filteredDeliverables.length - 1 && (
                  <div className={`
                    absolute left-[21px] top-[44px] w-0.5 h-full
                    ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}
                  `} />
                )}
                
                <div className="relative pl-12 pb-6 group">
                  {/* Timeline dot and icon */}
                  <div className={`
                    absolute left-0 top-3 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border-2
                    ${deliverable.status === 'replied'
                      ? isDarkMode
                        ? 'bg-emerald-500/20 border-emerald-500/50 group-hover:bg-emerald-500/30 group-hover:border-emerald-500'
                        : 'bg-emerald-100 border-emerald-300 group-hover:bg-emerald-200 group-hover:border-emerald-400'
                      : deliverable.status === 'opened'
                        ? isDarkMode
                          ? 'bg-blue-500/20 border-blue-500/50 group-hover:bg-blue-500/30 group-hover:border-blue-500'
                          : 'bg-blue-100 border-blue-300 group-hover:bg-blue-200 group-hover:border-blue-400'
                        : isDarkMode
                          ? 'bg-slate-700/50 border-white/20 group-hover:bg-slate-700 group-hover:border-white/30'
                          : 'bg-gray-100 border-gray-300 group-hover:bg-gray-200 group-hover:border-gray-400'
                    }
                  `}>
                    <Send size={18} className={`
                      ${deliverable.status === 'replied'
                        ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                        : deliverable.status === 'opened'
                          ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }
                    `} />
                  </div>

                  {/* Content card */}
                  <div className={`
                    p-4 rounded-lg border transition-all duration-300
                    ${isDarkMode
                      ? 'bg-slate-700/30 border-white/10 hover:bg-slate-700/50 hover:border-emerald-500/30'
                      : 'bg-gray-50/80 border-gray-200 hover:bg-white hover:border-emerald-300 hover:shadow-sm'
                    }
                  `}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`
                            px-2 py-0.5 rounded text-xs font-medium border
                            ${getTypeColor(deliverable.type)}
                          `}>
                            {deliverable.type}
                          </span>
                          <span className={`
                            px-2 py-0.5 rounded text-xs font-medium
                            ${deliverable.status === 'replied'
                              ? isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                              : deliverable.status === 'opened'
                                ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                                : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                            }
                          `}>
                            {getStatusLabel(deliverable.status)}
                          </span>
                        </div>
                        <h4 className={`
                          font-semibold mb-1
                          ${isDarkMode ? 'text-white' : 'text-gray-900'}
                        `}>
                          {deliverable.title}
                        </h4>
                        {deliverable.description && (
                          <p className={`
                            text-sm mb-2
                            ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                          `}>
                            {deliverable.description}
                          </p>
                        )}
                        <div className={`
                          flex items-center gap-4 text-xs
                          ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}
                        `}>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(deliverable.sentDate)} at {formatTime(deliverable.sentDate)}
                          </span>
                          <span>•</span>
                          <span>Sent by {deliverable.sentBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="secondary" size="sm">
                          <Download size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
