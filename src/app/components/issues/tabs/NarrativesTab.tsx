import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  GitCompare,
  Bell,
  BellOff,
  Share2,
  Bookmark,
  AlertTriangle,
  Target,
  Users,
  Radio,
  MessageSquare,
  BarChart3,
  Eye,
  Sparkles,
  CheckCircle,
  Clock,
  Map,
  Filter,
  Calendar,
} from 'lucide-react';
import {
  narrativesByIssue,
  mentions,
  peopleByTopic,
  stateKeywords,
} from '../../../data/issuesMockData';

interface Props {
  isDarkMode: boolean;
  selectedIssue: string;
  currentScope: { type: string; id: string | null };
}

type ViewMode = 'grid' | 'timeline';
type TrajectoryType = 'rising' | 'stable' | 'declining';

export function NarrativesTab({ isDarkMode, selectedIssue, currentScope }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedNarrative, setSelectedNarrative] = useState<any | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareNarratives, setCompareNarratives] = useState<any[]>([]);
  const [filterTrajectory, setFilterTrajectory] = useState<TrajectoryType | 'all'>('all');

  // Get narratives for current issue
  const narratives =
    narrativesByIssue[selectedIssue as keyof typeof narrativesByIssue] ||
    narrativesByIssue['clean-energy'];

  // Filter by trajectory
  const filteredNarratives = narratives.filter(n =>
    filterTrajectory === 'all' ? true : n.trajectory === filterTrajectory
  );

  const handleNarrativeClick = (narrative: any) => {
    if (compareMode) {
      if (compareNarratives.length < 3 && !compareNarratives.find(n => n.narrativeId === narrative.narrativeId)) {
        setCompareNarratives([...compareNarratives, narrative]);
      }
    } else {
      setSelectedNarrative(narrative);
    }
  };

  const handleCloseNarrative = () => {
    setSelectedNarrative(null);
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setCompareNarratives([]);
    }
  };

  const removeCompareNarrative = (narrativeId: string) => {
    setCompareNarratives(compareNarratives.filter(n => n.narrativeId !== narrativeId));
  };

  if (selectedNarrative) {
    return (
      <NarrativeDetailPanel
        isDarkMode={isDarkMode}
        narrative={selectedNarrative}
        onClose={handleCloseNarrative}
        currentScope={currentScope}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-orange-600 text-white'
                  : isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-orange-600 text-white'
                  : isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              Timeline
            </button>
          </div>

          {/* Trajectory Filter */}
          <select
            value={filterTrajectory}
            onChange={e => setFilterTrajectory(e.target.value as any)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all outline-none ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <option value="all">All Trajectories</option>
            <option value="rising">Rising</option>
            <option value="stable">Stable</option>
            <option value="declining">Declining</option>
          </select>
        </div>

        {/* Compare Mode */}
        <button
          onClick={toggleCompareMode}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            compareMode
              ? 'bg-blue-600 text-white'
              : isDarkMode
              ? 'bg-white/5 hover:bg-white/10 text-slate-300'
              : 'bg-white hover:bg-blue-50 text-gray-700 border border-gray-200'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          Compare {compareMode && `(${compareNarratives.length}/3)`}
        </button>
      </div>

      {/* Compare Pills */}
      {compareMode && compareNarratives.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Comparing:
          </span>
          {compareNarratives.map(narrative => (
            <div
              key={narrative.narrativeId}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-blue-900/20 border-blue-500/30 text-blue-300'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}
            >
              <span className="text-sm font-medium">{narrative.name}</span>
              <button
                onClick={() => removeCompareNarrative(narrative.narrativeId)}
                className="hover:bg-white/10 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 gap-4">
          {filteredNarratives.map((narrative, idx) => (
            <NarrativeCard
              key={narrative.narrativeId}
              narrative={narrative}
              isDarkMode={isDarkMode}
              onClick={() => handleNarrativeClick(narrative)}
              delay={idx * 0.05}
              isCompared={compareNarratives.some(n => n.narrativeId === narrative.narrativeId)}
            />
          ))}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <NarrativeTimeline
          narratives={filteredNarratives}
          isDarkMode={isDarkMode}
          onNarrativeClick={handleNarrativeClick}
        />
      )}

      {/* Comparison Table */}
      {compareMode && compareNarratives.length > 1 && (
        <NarrativeComparisonTable
          narratives={compareNarratives}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Empty State */}
      {filteredNarratives.length === 0 && (
        <div
          className={`text-center py-16 ${
            isDarkMode ? 'text-slate-500' : 'text-gray-500'
          }`}
        >
          <Filter className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">No narratives match this filter</p>
          <p className="text-sm mt-1">Try selecting a different trajectory</p>
        </div>
      )}
    </div>
  );
}

// Narrative Card Component
function NarrativeCard({
  narrative,
  isDarkMode,
  onClick,
  delay,
  isCompared,
}: {
  narrative: any;
  isDarkMode: boolean;
  onClick: () => void;
  delay: number;
  isCompared: boolean;
}) {
  const [isTracking, setIsTracking] = useState(false);

  const getTrajectoryIcon = () => {
    if (narrative.trajectory === 'rising') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (narrative.trajectory === 'declining') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getStrengthColor = () => {
    if (narrative.strength >= 80) return 'text-red-600';
    if (narrative.strength >= 60) return 'text-orange-600';
    if (narrative.strength >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
        isCompared
          ? 'border-blue-500 bg-blue-600/10'
          : isDarkMode
          ? 'bg-slate-900/40 border-white/10 hover:border-orange-500/50'
          : 'bg-white border-gray-200 hover:border-orange-500 hover:shadow-lg'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {narrative.name}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {narrative.descriptionShort}
          </div>
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            setIsTracking(!isTracking);
          }}
          className={`p-1.5 rounded-lg transition-all ${
            isTracking
              ? 'bg-orange-600 text-white'
              : isDarkMode
              ? 'bg-white/5 hover:bg-white/10 text-slate-400'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          {isTracking ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
        </button>
      </div>

      {/* Strength Meter */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-xs font-semibold ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}
          >
            STRENGTH
          </span>
          <span className={`text-sm font-bold ${getStrengthColor()}`}>
            {narrative.strength}
          </span>
        </div>
        <div className={`h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
          <div
            className={`h-full rounded-full ${
              narrative.strength >= 80
                ? 'bg-red-600'
                : narrative.strength >= 60
                ? 'bg-orange-600'
                : narrative.strength >= 40
                ? 'bg-yellow-600'
                : 'bg-gray-600'
            }`}
            style={{ width: `${narrative.strength}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1 mb-0.5">
            {getTrajectoryIcon()}
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              Trajectory
            </span>
          </div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {narrative.trajectory}
          </div>
        </div>
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1 mb-0.5">
            <Eye className="w-3 h-3 text-blue-500" />
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              Reach
            </span>
          </div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {narrative.reachEstimate}
          </div>
        </div>
      </div>

      {/* Regional Heatmap Preview */}
      <div>
        <div
          className={`text-xs font-semibold mb-1 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          TOP REGIONS
        </div>
        <div className="flex gap-1">
          {narrative.topRegions.slice(0, 5).map((region: string, idx: number) => (
            <div
              key={region}
              className={`flex-1 h-6 rounded ${
                idx === 0
                  ? 'bg-red-600'
                  : idx === 1
                  ? 'bg-orange-600'
                  : idx === 2
                  ? 'bg-yellow-600'
                  : isDarkMode
                  ? 'bg-white/10'
                  : 'bg-gray-200'
              }`}
              title={region}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Narrative Timeline Component
function NarrativeTimeline({
  narratives,
  isDarkMode,
  onNarrativeClick,
}: {
  narratives: any[];
  isDarkMode: boolean;
  onNarrativeClick: (narrative: any) => void;
}) {
  // Mock timeline data (in real app, this would be actual chronological data)
  const timelineWeeks = [
    { week: 'Week 1', date: 'Dec 1-7' },
    { week: 'Week 2', date: 'Dec 8-14' },
    { week: 'Week 3', date: 'Dec 15-21' },
    { week: 'Week 4', date: 'Dec 22-28' },
  ];

  return (
    <div className="space-y-6">
      {timelineWeeks.map((week, weekIdx) => (
        <motion.div
          key={week.week}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: weekIdx * 0.1 }}
        >
          {/* Week Header */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`px-4 py-2 rounded-xl border ${
                isDarkMode
                  ? 'bg-slate-900/40 border-white/10'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {week.week}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {week.date}
              </div>
            </div>
            <div className={`flex-1 h-0.5 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
          </div>

          {/* Narratives in this week */}
          <div className="space-y-3 pl-8">
            {narratives.slice(weekIdx * 2, weekIdx * 2 + 2).map(narrative => (
              <div
                key={narrative.narrativeId}
                onClick={() => onNarrativeClick(narrative)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                  isDarkMode
                    ? 'bg-slate-900/40 border-white/10 hover:border-orange-500/50'
                    : 'bg-white border-gray-200 hover:border-orange-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {narrative.name}
                  </div>
                  <div className="flex items-center gap-2">
                    {narrative.trajectory === 'rising' && (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    )}
                    {narrative.trajectory === 'declining' && (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        narrative.strength >= 80
                          ? 'bg-red-600 text-white'
                          : narrative.strength >= 60
                          ? 'bg-orange-600 text-white'
                          : 'bg-yellow-600 text-white'
                      }`}
                    >
                      {narrative.strength}
                    </span>
                  </div>
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {narrative.descriptionShort}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Narrative Comparison Table
function NarrativeComparisonTable({
  narratives,
  isDarkMode,
}: {
  narratives: any[];
  isDarkMode: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${
        isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-6">
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Narrative Comparison
        </h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: `150px repeat(${narratives.length}, 1fr)` }}>
          {/* Headers */}
          <div className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Metric
          </div>
          {narratives.map(narrative => (
            <div
              key={narrative.narrativeId}
              className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {narrative.name}
            </div>
          ))}

          {/* Strength */}
          <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Strength</div>
          {narratives.map(narrative => (
            <div key={narrative.narrativeId} className="text-orange-600 font-bold">
              {narrative.strength}
            </div>
          ))}

          {/* Trajectory */}
          <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Trajectory</div>
          {narratives.map(narrative => (
            <div
              key={narrative.narrativeId}
              className={`font-medium ${
                narrative.trajectory === 'rising'
                  ? 'text-green-500'
                  : narrative.trajectory === 'declining'
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`}
            >
              {narrative.trajectory}
            </div>
          ))}

          {/* Reach */}
          <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Reach</div>
          {narratives.map(narrative => (
            <div
              key={narrative.narrativeId}
              className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}
            >
              {narrative.reachEstimate}
            </div>
          ))}

          {/* Top Region */}
          <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Top Region</div>
          {narratives.map(narrative => (
            <div
              key={narrative.narrativeId}
              className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}
            >
              {narrative.topRegions[0]}
            </div>
          ))}

          {/* Dominant Frame */}
          <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Dominant Frame</div>
          {narratives.map(narrative => (
            <div
              key={narrative.narrativeId}
              className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}
            >
              {narrative.dominantFrame}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Narrative Detail Panel Component
function NarrativeDetailPanel({
  isDarkMode,
  narrative,
  onClose,
  currentScope,
}: {
  isDarkMode: boolean;
  narrative: any;
  onClose: () => void;
  currentScope: any;
}) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'messengers' | 'counter' | 'media' | 'strategy'
  >('overview');

  const [isTracking, setIsTracking] = useState(false);

  // Mock data for narrative details
  const keyMessengers = peopleByTopic['t01'] || [];
  const amplifiers = [
    { name: '@CleanEnergyNow', type: 'Twitter', followers: '245K', engagement: '8.2%' },
    { name: 'Green Future Podcast', type: 'Podcast', followers: '180K', engagement: '12.1%' },
    { name: 'Climate Action Daily', type: 'Newsletter', followers: '95K', engagement: '24.3%' },
  ];

  const counterNarratives = [
    {
      id: 'cn1',
      name: 'Economic Concerns',
      strength: 62,
      keyPoint: 'Renewable transition will cost jobs in traditional energy sector',
    },
    {
      id: 'cn2',
      name: 'Grid Reliability',
      strength: 48,
      keyPoint: 'Solar and wind are too intermittent for reliable baseload power',
    },
  ];

  const mediaBreakdown = [
    { source: 'News Media', percentage: 45, count: 342 },
    { source: 'Social Media', percentage: 32, count: 243 },
    { source: 'Press Releases', percentage: 15, count: 114 },
    { source: 'Committee Hearings', percentage: 8, count: 61 },
  ];

  const storylineEvents = [
    { date: '2024-12-01', event: 'State announces $500M solar incentive program', impact: 'high' },
    { date: '2024-12-08', event: 'Major utility commits to 50% renewable by 2030', impact: 'high' },
    { date: '2024-12-15', event: 'Governor keynote at Clean Energy Summit', impact: 'medium' },
    { date: '2024-12-20', event: 'Op-eds published in 3 major newspapers', impact: 'medium' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
            isDarkMode
              ? 'bg-white/5 hover:bg-white/10 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Narratives
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTracking(!isTracking)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              isTracking
                ? 'bg-orange-600 text-white'
                : isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            {isTracking ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            {isTracking ? 'Tracking' : 'Track Narrative'}
          </button>
          <button
            className={`p-2 rounded-xl transition-all ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            className={`p-2 rounded-xl transition-all ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Narrative Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {narrative.name}
            </h2>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {narrative.descriptionShort}
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  narrative.trajectory === 'rising'
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : narrative.trajectory === 'declining'
                    ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                    : 'bg-gray-600/20 text-gray-400 border border-gray-500/30'
                }`}
              >
                {narrative.trajectory === 'rising' && <TrendingUp className="w-4 h-4 inline mr-1" />}
                {narrative.trajectory === 'declining' && <TrendingDown className="w-4 h-4 inline mr-1" />}
                {narrative.trajectory === 'stable' && <Minus className="w-4 h-4 inline mr-1" />}
                {narrative.trajectory}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              STRENGTH
            </div>
            <div
              className={`text-4xl font-bold ${
                narrative.strength >= 80
                  ? 'text-red-600'
                  : narrative.strength >= 60
                  ? 'text-orange-600'
                  : 'text-yellow-600'
              }`}
            >
              {narrative.strength}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                REACH
              </span>
            </div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {narrative.reachEstimate}
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                MENTIONS
              </span>
            </div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              1,247
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                MESSENGERS
              </span>
            </div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {keyMessengers.length}
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-4 h-4 text-orange-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                TOP REGION
              </span>
            </div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {narrative.topRegions[0]}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2">
        {[
          { id: 'overview', icon: BarChart3, label: 'Overview' },
          { id: 'messengers', icon: Users, label: 'Messengers' },
          { id: 'counter', icon: AlertTriangle, label: 'Counter-Narratives' },
          { id: 'media', icon: Radio, label: 'Media Breakdown' },
          { id: 'strategy', icon: Sparkles, label: 'Revere Strategy' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-orange-600 text-white'
                : isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <NarrativeOverview
              isDarkMode={isDarkMode}
              narrative={narrative}
              storylineEvents={storylineEvents}
            />
          )}
          {activeTab === 'messengers' && (
            <NarrativeMessengers
              isDarkMode={isDarkMode}
              messengers={keyMessengers}
              amplifiers={amplifiers}
            />
          )}
          {activeTab === 'counter' && (
            <CounterNarratives isDarkMode={isDarkMode} counterNarratives={counterNarratives} />
          )}
          {activeTab === 'media' && (
            <MediaBreakdown isDarkMode={isDarkMode} mediaBreakdown={mediaBreakdown} />
          )}
          {activeTab === 'strategy' && (
            <NarrativeStrategy isDarkMode={isDarkMode} narrative={narrative} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Sub-components for Narrative Detail Panel

function NarrativeOverview({
  isDarkMode,
  narrative,
  storylineEvents,
}: {
  isDarkMode: boolean;
  narrative: any;
  storylineEvents: any[];
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Storyline Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`col-span-2 p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Storyline Tracker
          </h3>
        </div>
        <div className="space-y-3">
          {storylineEvents.map((event, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {event.date}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {event.event}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    event.impact === 'high'
                      ? 'text-orange-500'
                      : event.impact === 'medium'
                      ? 'text-yellow-500'
                      : 'text-gray-500'
                  }`}
                >
                  {event.impact.toUpperCase()} IMPACT
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dominant Frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-purple-500" />
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Dominant Frame
          </h3>
        </div>
        <div className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {narrative.dominantFrame}
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          This narrative primarily frames clean energy as an economic opportunity, emphasizing job creation and cost savings.
        </p>
      </motion.div>

      {/* Regional Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Map className="w-5 h-5 text-orange-500" />
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Regional Strength
          </h3>
        </div>
        <div className="space-y-2">
          {narrative.topRegions.slice(0, 5).map((region: string, idx: number) => (
            <div key={region}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  {region}
                </span>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {90 - idx * 10}
                </span>
              </div>
              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div
                  className="h-full rounded-full bg-orange-600"
                  style={{ width: `${90 - idx * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function NarrativeMessengers({
  isDarkMode,
  messengers,
  amplifiers,
}: {
  isDarkMode: boolean;
  messengers: any[];
  amplifiers: any[];
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Key Messengers */}
      <div className="col-span-2">
        <h3
          className={`text-sm font-semibold mb-3 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          KEY MESSENGERS (LEGISLATORS)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {messengers.slice(0, 4).map((person, idx) => (
            <motion.div
              key={person.personId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {person.name}
              </div>
              <div className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {person.officeTitle}
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    person.party === 'D'
                      ? 'bg-blue-600 text-white'
                      : person.party === 'R'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  {person.party}
                </div>
                <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                  {person.districtLabel}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Amplifiers */}
      <div className="col-span-2">
        <h3
          className={`text-sm font-semibold mb-3 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          TOP AMPLIFIERS
        </h3>
        <div className="space-y-3">
          {amplifiers.map((amplifier, idx) => (
            <motion.div
              key={amplifier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {amplifier.name}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {amplifier.type} • {amplifier.followers} followers
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xs font-semibold mb-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}
                  >
                    ENGAGEMENT
                  </div>
                  <div className="text-lg font-bold text-green-500">{amplifier.engagement}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CounterNarratives({
  isDarkMode,
  counterNarratives,
}: {
  isDarkMode: boolean;
  counterNarratives: any[];
}) {
  return (
    <div className="space-y-4">
      <div
        className={`p-4 rounded-xl border-2 ${
          isDarkMode
            ? 'bg-orange-900/20 border-orange-500/30'
            : 'bg-orange-50 border-orange-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Counter-Narrative Detection
          </span>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          Revere has identified {counterNarratives.length} active counter-narratives that may undermine your messaging.
        </p>
      </div>

      {counterNarratives.map((counter, idx) => (
        <motion.div
          key={counter.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {counter.name}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {counter.keyPoint}
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-lg text-sm font-bold ${
                counter.strength >= 60
                  ? 'bg-red-600 text-white'
                  : 'bg-orange-600 text-white'
              }`}
            >
              {counter.strength}
            </div>
          </div>

          {/* Strength Bar */}
          <div className="mb-3">
            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
              <div
                className={`h-full rounded-full ${
                  counter.strength >= 60 ? 'bg-red-600' : 'bg-orange-600'
                }`}
                style={{ width: `${counter.strength}%` }}
              />
            </div>
          </div>

          {/* Response Recommendation */}
          <div
            className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                REVERE RESPONSE STRATEGY
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              {idx === 0
                ? 'Emphasize job creation data from recent clean energy projects. Reference specific employment numbers.'
                : 'Highlight battery storage advancements and successful grid integration case studies.'}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MediaBreakdown({
  isDarkMode,
  mediaBreakdown,
}: {
  isDarkMode: boolean;
  mediaBreakdown: any[];
}) {
  return (
    <div className="space-y-6">
      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Source Distribution
        </h3>
        <div className="space-y-4">
          {mediaBreakdown.map((source, idx) => (
            <div key={source.source}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {source.source}
                </span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {source.count} mentions
                  </span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {source.percentage}%
                  </span>
                </div>
              </div>
              <div className={`h-3 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${source.percentage}%` }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className={`h-full rounded-full ${
                    idx === 0
                      ? 'bg-blue-600'
                      : idx === 1
                      ? 'bg-purple-600'
                      : idx === 2
                      ? 'bg-green-600'
                      : 'bg-orange-600'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Channel Insights
          </h3>
        </div>
        <ul className="space-y-2">
          <li className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
            <span>News media coverage has increased 34% week-over-week</span>
          </li>
          <li className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
            <span>Social media engagement is strongest on Twitter and LinkedIn</span>
          </li>
          <li className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
            <span>Committee hearings provide authoritative third-party validation</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

function NarrativeStrategy({
  isDarkMode,
  narrative,
}: {
  isDarkMode: boolean;
  narrative: any;
}) {
  return (
    <div className="space-y-4">
      {/* Confidence Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border-2 ${
          isDarkMode
            ? 'bg-purple-900/20 border-purple-500/30'
            : 'bg-purple-50 border-purple-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <div>
              <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Revere Narrative Positioning Strategy
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {narrative.name}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Confidence
            </div>
            <div className="text-2xl font-bold text-purple-500">94%</div>
          </div>
        </div>
      </motion.div>

      {/* Positioning Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div
          className={`text-sm font-semibold mb-3 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          STRATEGIC POSITIONING
        </div>
        <ul className="space-y-2">
          {[
            'Leverage economic opportunity framing in swing districts with high unemployment',
            'Partner with business leaders as third-party validators',
            'Time announcements to coincide with job growth reports',
            'Emphasize bipartisan support where available',
          ].map((rec, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-2 text-sm ${
                isDarkMode ? 'text-green-300' : 'text-green-700'
              }`}
            >
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Risk Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <span
            className={`text-sm font-semibold ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}
          >
            NARRATIVE RISKS
          </span>
        </div>
        <ul className="space-y-2">
          {[
            'Counter-narrative on grid reliability gaining strength in Texas',
            'Declining momentum in rust belt states - pivot messaging needed',
          ].map((risk, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-2 text-sm ${
                isDarkMode ? 'text-orange-300' : 'text-orange-700'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Amplification Tactics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div
          className={`text-sm font-semibold mb-3 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          AMPLIFICATION TACTICS
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { tactic: 'Op-Ed Placement', priority: 'High' },
            { tactic: 'Social Media Campaign', priority: 'High' },
            { tactic: 'Grassroots Events', priority: 'Medium' },
            { tactic: 'Industry Partnership', priority: 'High' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}
            >
              <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.tactic}
              </div>
              <div
                className={`text-xs ${
                  item.priority === 'High' ? 'text-orange-500' : 'text-yellow-500'
                }`}
              >
                {item.priority} Priority
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Button */}
      <button
        className={`w-full px-6 py-3 rounded-xl font-bold transition-all ${
          isDarkMode
            ? 'bg-purple-600 hover:bg-purple-500 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        Create Narrative Action Plan
      </button>
    </div>
  );
}