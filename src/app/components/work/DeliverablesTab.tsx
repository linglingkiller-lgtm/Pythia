import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Plus, FileText, Mail, Download, Sparkles, Filter, Search, Clock, CheckCircle, AlertCircle, TrendingUp, Target, BarChart3, Calendar } from 'lucide-react';
import { mockDeliverables, type Deliverable } from '../../data/workHubData';
import { DeliverablesQueue } from './DeliverablesQueue';
import { useTheme } from '../../contexts/ThemeContext';

interface DeliverablesTabProps {
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToBill?: (billId: string) => void;
}

export function DeliverablesTab({ onNavigateToClient, onNavigateToBill }: DeliverablesTabProps) {
  const { isDarkMode } = useTheme();
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const deliverableTypes = [
    { id: 'all', label: 'All Types', count: mockDeliverables.length },
    { id: 'weekly-update', label: 'Weekly Updates', count: mockDeliverables.filter(d => d.type === 'weekly-update').length },
    { id: 'bill-tracker', label: 'Bill Trackers', count: mockDeliverables.filter(d => d.type === 'bill-tracker').length },
    { id: 'meeting-brief', label: 'Meeting Briefs', count: mockDeliverables.filter(d => d.type === 'meeting-brief').length },
    { id: 'hearing-prep', label: 'Hearing Prep', count: mockDeliverables.filter(d => d.type === 'hearing-prep').length },
    { id: 'amendment-memo', label: 'Amendment Memos', count: mockDeliverables.filter(d => d.type === 'amendment-memo').length },
    { id: 'qbr-summary', label: 'QBR Summaries', count: mockDeliverables.filter(d => d.type === 'qbr-summary').length },
  ];

  const filteredDeliverables = mockDeliverables.filter(d => {
    const matchesType = selectedType === 'all' || d.type === selectedType;
    const matchesSearch = searchQuery === '' ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate statistics
  const totalDeliverables = mockDeliverables.length;
  const draftCount = mockDeliverables.filter(d => d.status === 'draft').length;
  const inReviewCount = mockDeliverables.filter(d => d.status === 'internal-review').length;
  const clientReadyCount = mockDeliverables.filter(d => d.status === 'client-ready').length;
  const sentCount = mockDeliverables.filter(d => d.status === 'sent').length;
  
  // Calculate this week/month stats
  const thisWeekCount = 12; // Mock - would calculate from dates
  const thisMonthCount = 48; // Mock - would calculate from dates

  return (
    <div className="pb-32 w-full overflow-x-hidden">
      <div className="p-6 w-full">
        {/* Header Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {/* Total Deliverables */}
          <div className={`p-5 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-white/10'
              : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
          } shadow-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <FileText className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} size={20} />
              </div>
              <TrendingUp className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`} size={16} />
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {totalDeliverables}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Deliverables
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              {thisWeekCount} this week
            </div>
          </div>

          {/* Client Ready */}
          <div className={`p-5 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-white/10'
              : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
          } shadow-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
              }`}>
                <CheckCircle className={isDarkMode ? 'text-green-300' : 'text-green-600'} size={20} />
              </div>
              <Chip variant="success" size="sm">
                Ready
              </Chip>
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {clientReadyCount}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Client Ready
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
              Ready to send
            </div>
          </div>

          {/* In Review */}
          <div className={`p-5 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-white/10'
              : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
          } shadow-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
              }`}>
                <Clock className={isDarkMode ? 'text-yellow-300' : 'text-yellow-600'} size={20} />
              </div>
              {inReviewCount > 0 && (
                <Chip variant="warning" size="sm">
                  {inReviewCount}
                </Chip>
              )}
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {inReviewCount}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              In Review
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
              Awaiting approval
            </div>
          </div>

          {/* Sent This Month */}
          <div className={`p-5 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-white/10'
              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
          } shadow-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <Mail className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} size={20} />
              </div>
              <Chip variant="success" size="sm">
                Sent
              </Chip>
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {sentCount}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sent to Clients
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              {thisMonthCount} this month
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Workflow Progress */}
          <div className={`p-6 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-slate-800/40 border-white/10'
              : 'bg-white/80 border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <BarChart3 className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} size={20} />
              </div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Workflow Pipeline
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Deliverables by status
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className={`flex items-center justify-between text-sm mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span>Draft ({draftCount})</span>
                  <span>{Math.round((draftCount / totalDeliverables) * 100)}%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600"
                    style={{ width: `${(draftCount / totalDeliverables) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className={`flex items-center justify-between text-sm mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span>In Review ({inReviewCount})</span>
                  <span>{Math.round((inReviewCount / totalDeliverables) * 100)}%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                    style={{ width: `${(inReviewCount / totalDeliverables) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className={`flex items-center justify-between text-sm mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span>Client Ready ({clientReadyCount})</span>
                  <span>{Math.round((clientReadyCount / totalDeliverables) * 100)}%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${(clientReadyCount / totalDeliverables) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className={`flex items-center justify-between text-sm mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span>Sent ({sentCount})</span>
                  <span>{Math.round((sentCount / totalDeliverables) * 100)}%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: `${(sentCount / totalDeliverables) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deliverable Types Breakdown */}
          <div className={`p-6 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-slate-800/40 border-white/10'
              : 'bg-white/80 border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <Target className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} size={20} />
              </div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Deliverable Types
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Distribution across categories
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {deliverableTypes.filter(t => t.id !== 'all').map(type => (
                <div
                  key={type.id}
                  className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`text-2xl font-bold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {type.count}
                  </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {type.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revere Deliverable Builder */}
        <div className={`p-6 rounded-xl backdrop-blur-xl border mb-6 transition-all ${
          isDarkMode
            ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'
            : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
        } shadow-lg`}>
          <div className="flex items-start gap-3 mb-4">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Sparkles className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} size={20} />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Revere Deliverable Builder
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Auto-generates deliverables from your records, bills, and engagement data
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <Button variant="secondary" className="w-full">
              <FileText size={16} />
              Generate Weekly Update
            </Button>
            <Button variant="secondary" className="w-full">
              <FileText size={16} />
              Generate Bill Tracker
            </Button>
            <Button variant="secondary" className="w-full">
              <FileText size={16} />
              Generate Hearing Prep
            </Button>
            <Button variant="secondary" className="w-full">
              <FileText size={16} />
              Generate QBR Summary
            </Button>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'
          }`}>
            <div className={`text-xs font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              What's auto-compiled:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • Bill status updates + progress bars
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • Recent engagement ledger entries
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • Upcoming calendar events
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • Identified risks and opportunities
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • Client-appropriate tone and messaging
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className={`rounded-xl backdrop-blur-xl border px-6 py-4 mb-6 transition-all ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-white/80 border-gray-200'
        } shadow-lg`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                All Deliverables
              </h2>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ({filteredDeliverables.length} {selectedType !== 'all' ? 'filtered' : 'total'})
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} size={18} />
                <input
                  type="text"
                  placeholder="Search deliverables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border text-sm transition-all ${
                    isDarkMode
                      ? 'bg-slate-700/50 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/50'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>

              {/* Type Filter Dropdown */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                  isDarkMode
                    ? 'bg-slate-700/50 border-white/10 text-white focus:border-cyan-500/50'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                {deliverableTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label} ({type.count})
                  </option>
                ))}
              </select>

              <Button variant="primary">
                <Plus size={16} />
                New Deliverable
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <DeliverablesQueue
            deliverables={filteredDeliverables}
            onNavigateToBill={onNavigateToBill}
          />
        </div>
      </div>
    </div>
  );
}