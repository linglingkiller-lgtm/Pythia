import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Sparkles, MapPin, Calendar, Users, ExternalLink, X, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AIOpportunitiesProps {
  onAddEvent: (opportunityData: {
    id: string;
    name: string;
    date: string;
    time: string;
    venue: string;
    city: string;
    whyItMatters: string;
    relevance: string[];
    likelyAttendees: string[];
  }) => void;
}

export function AIOpportunities({ onAddEvent }: AIOpportunitiesProps) {
  const { isDarkMode } = useTheme();
  const [nearMeFilter, setNearMeFilter] = React.useState(false);
  const [radius, setRadius] = React.useState('25');
  const [relevance, setRelevance] = React.useState('tracked');
  const [timeWindow, setTimeWindow] = React.useState('14');
  const [addedOpportunityIds, setAddedOpportunityIds] = React.useState<Set<string>>(new Set());

  const opportunities = [
    {
      id: '1',
      name: 'Clean Energy Town Hall',
      date: 'Nov 6, 2024',
      time: '6:00 PM - 7:30 PM',
      venue: 'Mesa Community Center',
      city: '263 N Center St, Mesa, AZ',
      host: 'East Valley Clean Energy Coalition',
      whyItMatters: 'Key district leaders and energy staff expected; good chance to shape reliability framing and identify sponsor appetite.',
      relevance: ['Energy', 'Solar', 'Grid Reliability'],
      relatedBills: ['HB90', 'HB1234'],
      likelyAttendees: ['Rep. Jordan Ramirez', 'Sen. Priya Shah', 'City Council Member T. Alvarez'],
      confidence: 'High',
      strategicValue: 8,
      distance: '12 miles',
    },
    {
      id: '2',
      name: 'AZ Solar Industry Summit',
      date: 'Dec 22, 2024',
      time: '9:00 AM - 5:00 PM',
      venue: 'Scottsdale Resort & Conference Center',
      city: 'Scottsdale, AZ',
      whyItMatters: 'Annual summit with policy track featuring legislators and regulators discussing HB90 implications',
      relevance: ['Solar', 'Policy', 'HB90'],
      likelyAttendees: ['Industry leaders', 'ACC commissioners'],
      confidence: 'High',
      strategicValue: 10,
      distance: '18 miles',
    },
    {
      id: '3',
      name: 'District 12 Coffee & Conversation',
      date: 'Dec 20, 2024',
      time: '8:00 AM',
      venue: 'Main Street Cafe',
      city: 'Tempe, AZ',
      whyItMatters: 'Rep. Ramirez monthly constituent meeting - casual networking opportunity',
      relevance: ['Solar'],
      likelyAttendees: ['Rep. Jordan Ramirez', 'Local constituents'],
      confidence: 'Med',
      strategicValue: 7,
      distance: '8 miles',
    },
  ];

  const handleAddToCalendar = (opportunity: typeof opportunities[0]) => {
    onAddEvent(opportunity);
    setAddedOpportunityIds(new Set(addedOpportunityIds).add(opportunity.id));
  };

  const handleDismiss = (opportunityId: string) => {
    // In a real app, this would remove it from the list or mark as dismissed
    console.log('Dismissed opportunity:', opportunityId);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return 'success';
      case 'Med':
        return 'warning';
      case 'Low':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStrategicValueColor = (value: number) => {
    if (value >= 8) return 'text-green-600';
    if (value >= 6) return 'text-amber-600';
    return 'text-gray-600';
  };

  return (
    <div className={`rounded-lg p-5 backdrop-blur-xl border transition-all ${
      isDarkMode
        ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'
        : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
    } shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold flex items-center gap-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Sparkles size={18} className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} />
          Revere Opportunities
        </h3>
      </div>

      {/* Filters */}
      <div className={`space-y-3 mb-4 pb-4 border-b ${
        isDarkMode ? 'border-purple-500/20' : 'border-purple-200'
      }`}>
        <div className="flex items-center justify-between">
          <label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Near me</label>
          <button
            onClick={() => setNearMeFilter(!nearMeFilter)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              nearMeFilter 
                ? isDarkMode
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
                  : 'bg-purple-100 text-purple-700'
                : isDarkMode
                ? 'bg-slate-700/50 text-gray-400 border border-white/10'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {nearMeFilter ? 'On' : 'Off'}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Radius</label>
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className={`px-2 py-1 text-xs rounded-md focus:outline-none focus:ring-2 transition-all ${
              isDarkMode
                ? 'bg-slate-700/50 border border-white/10 text-white focus:ring-purple-500/50'
                : 'bg-white border border-gray-200 text-gray-900 focus:ring-purple-500'
            }`}
          >
            <option value="10">10 miles</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Relevance</label>
          <select
            value={relevance}
            onChange={(e) => setRelevance(e.target.value)}
            className={`px-2 py-1 text-xs rounded-md focus:outline-none focus:ring-2 transition-all ${
              isDarkMode
                ? 'bg-slate-700/50 border border-white/10 text-white focus:ring-purple-500/50'
                : 'bg-white border border-gray-200 text-gray-900 focus:ring-purple-500'
            }`}
          >
            <option value="tracked">Only tracked issues</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Time window</label>
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            className={`px-2 py-1 text-xs rounded-md focus:outline-none focus:ring-2 transition-all ${
              isDarkMode
                ? 'bg-slate-700/50 border border-white/10 text-white focus:ring-purple-500/50'
                : 'bg-white border border-gray-200 text-gray-900 focus:ring-purple-500'
            }`}
          >
            <option value="7">Next 7 days</option>
            <option value="14">Next 14 days</option>
            <option value="30">Next 30 days</option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.map((opp) => (
          <div key={opp.id} className={`p-4 rounded-lg border transition-all ${
            isDarkMode
              ? 'bg-slate-800/50 border-purple-500/30 hover:border-purple-500/50'
              : 'bg-white border-purple-200 hover:border-purple-400'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 pr-2">
                <h4 className={`font-medium mb-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{opp.name}</h4>
                <div className={`text-xs space-y-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {opp.date} • {opp.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    {opp.venue}, {opp.city} ({opp.distance})
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Chip variant={getConfidenceColor(opp.confidence) as any} size="sm">
                  {opp.confidence}
                </Chip>
                <div className={`text-xs font-medium ${
                  opp.strategicValue >= 8 
                    ? isDarkMode ? 'text-green-400' : 'text-green-600'
                    : opp.strategicValue >= 6
                    ? isDarkMode ? 'text-amber-400' : 'text-amber-600'
                    : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Value: {opp.strategicValue}/10
                </div>
              </div>
            </div>

            {/* Why it matters */}
            <div className={`mb-3 p-2 rounded-md ${
              isDarkMode
                ? 'bg-purple-500/20 border border-purple-500/30'
                : 'bg-purple-50'
            }`}>
              <div className={`text-xs font-medium mb-1 ${
                isDarkMode ? 'text-purple-300' : 'text-purple-900'
              }`}>Why it matters:</div>
              <div className={`text-xs ${
                isDarkMode ? 'text-purple-200' : 'text-purple-800'
              }`}>{opp.whyItMatters}</div>
            </div>

            {/* Relevance Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {opp.relevance.map((tag) => (
                <Chip key={tag} variant="info" size="sm">
                  {tag}
                </Chip>
              ))}
            </div>

            {/* Likely Attendees */}
            {opp.likelyAttendees.length > 0 && (
              <div className="mb-3">
                <div className={`flex items-center gap-1 text-xs mb-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Users size={12} />
                  Likely attendees:
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {opp.likelyAttendees.join(', ')}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="accent"
                size="sm"
                className="flex-1"
                onClick={() => handleAddToCalendar(opp)}
                disabled={addedOpportunityIds.has(opp.id)}
              >
                {addedOpportunityIds.has(opp.id) ? (
                  <>
                    ✓ Added
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Add to Calendar
                  </>
                )}
              </Button>
              <Button variant="secondary" size="sm">
                <ExternalLink size={14} />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleDismiss(opp.id)}>
                <X size={14} />
              </Button>
            </div>

            {/* Verification note */}
            <div className={`mt-2 text-xs italic ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Suggested — verify details
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}