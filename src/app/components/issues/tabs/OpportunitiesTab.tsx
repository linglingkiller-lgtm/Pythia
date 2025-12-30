import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  Clock,
  Sparkles,
  Target,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Mail,
  Phone,
  DollarSign,
  BarChart3,
  Layers,
  Filter,
  Grid3x3,
  List,
  CalendarDays,
  Plus,
  ChevronRight,
  Edit,
  Share2,
  Bookmark,
} from 'lucide-react';

interface Props {
  isDarkMode: boolean;
  selectedIssue: string;
  currentScope: { type: string; id: string | null };
}

type OpportunityType = 'legislative' | 'media' | 'coalition' | 'messaging';
type ViewMode = 'grid' | 'matrix' | 'calendar';
type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  urgencyScore: number;
  effortEstimate: string;
  impactPotential: number;
  deadline: string;
  successProbability: number;
  stakeholders: string[];
  resourcesNeeded: string[];
  actionItems: Array<{ id: string; task: string; assignee: string; completed: boolean }>;
}

// Mock opportunities data
const mockOpportunities: Opportunity[] = [
  {
    id: 'opp1',
    type: 'legislative',
    title: 'SB 247 Amendment Window',
    description: 'Committee markup session next week - opportunity to strengthen solar tax credit provisions',
    urgency: 'critical',
    urgencyScore: 95,
    effortEstimate: '12-15 hours',
    impactPotential: 88,
    deadline: '2024-12-26',
    successProbability: 72,
    stakeholders: ['Sen. Martinez', 'Rep. Chen', 'Clean Energy Coalition'],
    resourcesNeeded: ['Policy brief', 'Talking points', 'Coalition letter'],
    actionItems: [
      { id: 'a1', task: 'Draft amendment language', assignee: 'Policy Team', completed: true },
      { id: 'a2', task: 'Secure co-sponsors', assignee: 'Advocacy Lead', completed: false },
      { id: 'a3', task: 'Coordinate coalition support', assignee: 'Outreach Director', completed: false },
    ],
  },
  {
    id: 'opp2',
    type: 'media',
    title: 'Governor Climate Speech',
    description: 'Governor announcing climate initiative - prime earned media opportunity',
    urgency: 'high',
    urgencyScore: 82,
    effortEstimate: '8-10 hours',
    impactPotential: 91,
    deadline: '2024-12-28',
    successProbability: 85,
    stakeholders: ["Governor's Office", 'Press Secretary', 'Environmental reporters'],
    resourcesNeeded: ['Press release', 'Expert quotes', 'Data visualizations'],
    actionItems: [
      { id: 'a4', task: 'Draft statement', assignee: 'Comms Team', completed: false },
      { id: 'a5', task: 'Pitch to reporters', assignee: 'Media Relations', completed: false },
      { id: 'a6', task: 'Prepare spokespeople', assignee: 'Comms Director', completed: false },
    ],
  },
  {
    id: 'opp3',
    type: 'coalition',
    title: 'Business Alliance Formation',
    description: 'Major utilities expressing interest in clean energy partnership',
    urgency: 'medium',
    urgencyScore: 65,
    effortEstimate: '20-25 hours',
    impactPotential: 76,
    deadline: '2025-01-15',
    successProbability: 68,
    stakeholders: ['Pacific Power', 'SunTech Industries', 'Chamber of Commerce'],
    resourcesNeeded: ['Partnership proposal', 'MOU template', 'Business case analysis'],
    actionItems: [
      { id: 'a7', task: 'Schedule exploratory meetings', assignee: 'Partnerships Lead', completed: true },
      { id: 'a8', task: 'Develop partnership framework', assignee: 'Strategy Team', completed: false },
      { id: 'a9', task: 'Draft joint statement', assignee: 'Comms Team', completed: false },
    ],
  },
  {
    id: 'opp4',
    type: 'messaging',
    title: 'Job Creation Narrative Gap',
    description: 'Economic opportunity framing underutilized in rust belt states',
    urgency: 'medium',
    urgencyScore: 58,
    effortEstimate: '15-18 hours',
    impactPotential: 82,
    deadline: '2025-01-10',
    successProbability: 79,
    stakeholders: ['State chapters', 'Labor unions', 'Economic development orgs'],
    resourcesNeeded: ['Messaging guide', 'Regional data packets', 'Case studies'],
    actionItems: [
      { id: 'a10', task: 'Compile job creation statistics', assignee: 'Research Team', completed: false },
      { id: 'a11', task: 'Develop regional messaging', assignee: 'Strategy Team', completed: false },
      { id: 'a12', task: 'Train state advocates', assignee: 'Field Director', completed: false },
    ],
  },
  {
    id: 'opp5',
    type: 'legislative',
    title: 'Budget Reconciliation Vehicle',
    description: 'Appropriations bill could include renewable energy funding',
    urgency: 'high',
    urgencyScore: 78,
    effortEstimate: '18-22 hours',
    impactPotential: 94,
    deadline: '2025-01-05',
    successProbability: 61,
    stakeholders: ['Appropriations Chair', 'Budget Committee', 'Clean Energy Caucus'],
    resourcesNeeded: ['Budget analysis', 'Legislative memo', 'Champions list'],
    actionItems: [
      { id: 'a13', task: 'Identify funding opportunities', assignee: 'Policy Team', completed: false },
      { id: 'a14', task: 'Build champion network', assignee: 'Advocacy Lead', completed: false },
      { id: 'a15', task: 'Draft appropriations request', assignee: 'Legislative Director', completed: false },
    ],
  },
  {
    id: 'opp6',
    type: 'media',
    title: 'Editorial Board Series',
    description: 'Three major newspapers open to clean energy editorial meetings',
    urgency: 'low',
    urgencyScore: 42,
    effortEstimate: '10-12 hours',
    impactPotential: 71,
    deadline: '2025-01-20',
    successProbability: 88,
    stakeholders: ['Editorial boards', 'Subject experts', 'Coalition partners'],
    resourcesNeeded: ['Briefing materials', 'Q&A prep', 'Visual aids'],
    actionItems: [
      { id: 'a16', task: 'Schedule meetings', assignee: 'Media Relations', completed: false },
      { id: 'a17', task: 'Prepare briefing packets', assignee: 'Comms Team', completed: false },
      { id: 'a18', task: 'Identify expert speakers', assignee: 'Policy Team', completed: false },
    ],
  },
];

export function OpportunitiesTab({ isDarkMode, selectedIssue, currentScope }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [filterType, setFilterType] = useState<OpportunityType | 'all'>('all');
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Filter opportunities
  const filteredOpportunities = mockOpportunities.filter(opp =>
    filterType === 'all' ? true : opp.type === filterType
  );

  // Sort by urgency score
  const sortedOpportunities = [...filteredOpportunities].sort(
    (a, b) => b.urgencyScore - a.urgencyScore
  );

  const handleOpportunityClick = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
  };

  const handleCloseOpportunity = () => {
    setSelectedOpportunity(null);
  };

  if (selectedOpportunity) {
    return (
      <OpportunityDetailView
        isDarkMode={isDarkMode}
        opportunity={selectedOpportunity}
        onClose={handleCloseOpportunity}
        onCreateTaskBundle={() => setShowTaskModal(true)}
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
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-orange-600 text-white'
                  : isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'matrix'
                  ? 'bg-orange-600 text-white'
                  : isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Matrix
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'calendar'
                  ? 'bg-orange-600 text-white'
                  : isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Calendar
            </button>
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all outline-none ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <option value="all">All Types</option>
            <option value="legislative">Legislative</option>
            <option value="media">Media</option>
            <option value="coalition">Coalition</option>
            <option value="messaging">Messaging</option>
          </select>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center gap-4">
          <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            <span className="font-bold text-orange-600">{sortedOpportunities.length}</span> opportunities
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            <span className="font-bold text-red-600">
              {sortedOpportunities.filter(o => o.urgency === 'critical').length}
            </span>{' '}
            critical
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 gap-4">
          {sortedOpportunities.map((opp, idx) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isDarkMode={isDarkMode}
              onClick={() => handleOpportunityClick(opp)}
              delay={idx * 0.05}
            />
          ))}
        </div>
      )}

      {/* Priority Matrix View */}
      {viewMode === 'matrix' && (
        <PriorityMatrix
          opportunities={sortedOpportunities}
          isDarkMode={isDarkMode}
          onOpportunityClick={handleOpportunityClick}
        />
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <CalendarView
          opportunities={sortedOpportunities}
          isDarkMode={isDarkMode}
          onOpportunityClick={handleOpportunityClick}
        />
      )}

      {/* Empty State */}
      {sortedOpportunities.length === 0 && (
        <div
          className={`text-center py-16 ${
            isDarkMode ? 'text-slate-500' : 'text-gray-500'
          }`}
        >
          <Filter className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">No opportunities match this filter</p>
          <p className="text-sm mt-1">Try selecting a different type</p>
        </div>
      )}

      {/* Task Bundle Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <TaskBundleModal isDarkMode={isDarkMode} onClose={() => setShowTaskModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Opportunity Card Component
function OpportunityCard({
  opportunity,
  isDarkMode,
  onClick,
  delay,
}: {
  opportunity: Opportunity;
  isDarkMode: boolean;
  onClick: () => void;
  delay: number;
}) {
  const getTypeIcon = () => {
    switch (opportunity.type) {
      case 'legislative':
        return <FileText className="w-4 h-4" />;
      case 'media':
        return <Users className="w-4 h-4" />;
      case 'coalition':
        return <Target className="w-4 h-4" />;
      case 'messaging':
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (opportunity.type) {
      case 'legislative':
        return 'bg-blue-600';
      case 'media':
        return 'bg-purple-600';
      case 'coalition':
        return 'bg-green-600';
      case 'messaging':
        return 'bg-orange-600';
    }
  };

  const getUrgencyColor = () => {
    switch (opportunity.urgency) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-gray-600';
    }
  };

  const completedActions = opportunity.actionItems.filter(a => a.completed).length;
  const totalActions = opportunity.actionItems.length;
  const progressPercent = (completedActions / totalActions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
        isDarkMode
          ? 'bg-slate-900/40 border-white/10 hover:border-orange-500/50'
          : 'bg-white border-gray-200 hover:border-orange-500 hover:shadow-lg'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg text-white ${getTypeColor()}`}>
              {getTypeIcon()}
            </div>
            <span
              className={`text-xs font-bold uppercase ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              {opportunity.type}
            </span>
          </div>
          <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {opportunity.title}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {opportunity.description}
          </div>
        </div>
        <div className={`text-2xl font-bold ${getUrgencyColor()} ml-3`}>
          {opportunity.urgencyScore}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1 mb-0.5">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              Impact
            </span>
          </div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {opportunity.impactPotential}%
          </div>
        </div>
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1 mb-0.5">
            <Clock className="w-3 h-3 text-blue-500" />
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              Effort
            </span>
          </div>
          <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {opportunity.effortEstimate.split('-')[0]}h
          </div>
        </div>
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1 mb-0.5">
            <Target className="w-3 h-3 text-purple-500" />
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              Success
            </span>
          </div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {opportunity.successProbability}%
          </div>
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-orange-500" />
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Due: {new Date(opportunity.deadline).toLocaleDateString()}
          </span>
        </div>
        <span
          className={`text-xs font-bold uppercase ${
            opportunity.urgency === 'critical'
              ? 'text-red-500'
              : opportunity.urgency === 'high'
              ? 'text-orange-500'
              : 'text-gray-500'
          }`}
        >
          {opportunity.urgency}
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            PROGRESS
          </span>
          <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {completedActions}/{totalActions} tasks
          </span>
        </div>
        <div className={`h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
          <div
            className="h-full rounded-full bg-green-600"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Priority Matrix View (Eisenhower-style)
function PriorityMatrix({
  opportunities,
  isDarkMode,
  onOpportunityClick,
}: {
  opportunities: Opportunity[];
  isDarkMode: boolean;
  onOpportunityClick: (opp: Opportunity) => void;
}) {
  // Quadrants: High Impact/High Urgency, High Impact/Low Urgency, Low Impact/High Urgency, Low Impact/Low Urgency
  const q1 = opportunities.filter(o => o.impactPotential >= 75 && o.urgencyScore >= 70); // Do First
  const q2 = opportunities.filter(o => o.impactPotential >= 75 && o.urgencyScore < 70); // Schedule
  const q3 = opportunities.filter(o => o.impactPotential < 75 && o.urgencyScore >= 70); // Delegate
  const q4 = opportunities.filter(o => o.impactPotential < 75 && o.urgencyScore < 70); // Eliminate

  const QuadrantCard = ({
    title,
    description,
    items,
    color,
  }: {
    title: string;
    description: string;
    items: Opportunity[];
    color: string;
  }) => (
    <div
      className={`p-5 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <div>
          <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</div>
          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {description}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className={`text-sm text-center py-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
            No opportunities
          </div>
        ) : (
          items.map(opp => (
            <div
              key={opp.id}
              onClick={() => onOpportunityClick(opp)}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                isDarkMode
                  ? 'bg-white/5 border-white/10 hover:border-orange-500/50'
                  : 'bg-gray-50 border-gray-200 hover:border-orange-500'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {opp.title}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Impact: {opp.impactPotential}%
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>•</span>
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Urgency: {opp.urgencyScore}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Matrix Header */}
      <div
        className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Priority Matrix
        </h3>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Opportunities organized by impact and urgency
        </p>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-2 gap-4">
        <QuadrantCard
          title="Do First"
          description="High Impact • High Urgency"
          items={q1}
          color="bg-red-600"
        />
        <QuadrantCard
          title="Schedule"
          description="High Impact • Low Urgency"
          items={q2}
          color="bg-blue-600"
        />
        <QuadrantCard
          title="Delegate"
          description="Low Impact • High Urgency"
          items={q3}
          color="bg-yellow-600"
        />
        <QuadrantCard
          title="Eliminate"
          description="Low Impact • Low Urgency"
          items={q4}
          color="bg-gray-600"
        />
      </div>
    </motion.div>
  );
}

// Calendar View
function CalendarView({
  opportunities,
  isDarkMode,
  onOpportunityClick,
}: {
  opportunities: Opportunity[];
  isDarkMode: boolean;
  onOpportunityClick: (opp: Opportunity) => void;
}) {
  // Group by week
  const weekBuckets: Record<string, Opportunity[]> = {};
  
  opportunities.forEach(opp => {
    const date = new Date(opp.deadline);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weekBuckets[weekKey]) {
      weekBuckets[weekKey] = [];
    }
    weekBuckets[weekKey].push(opp);
  });

  const sortedWeeks = Object.keys(weekBuckets).sort();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {sortedWeeks.map((weekKey, weekIdx) => {
        const weekDate = new Date(weekKey);
        const weekEnd = new Date(weekDate);
        weekEnd.setDate(weekDate.getDate() + 6);

        return (
          <div key={weekKey}>
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
                  Week of {weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {weekBuckets[weekKey].length} opportunities
                </div>
              </div>
              <div className={`flex-1 h-0.5 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
            </div>

            {/* Opportunities */}
            <div className="grid grid-cols-1 gap-3 pl-8">
              {weekBuckets[weekKey]
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .map(opp => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: weekIdx * 0.1 }}
                    onClick={() => onOpportunityClick(opp)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                      isDarkMode
                        ? 'bg-slate-900/40 border-white/10 hover:border-orange-500/50'
                        : 'bg-white border-gray-200 hover:border-orange-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {opp.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            opp.urgency === 'critical'
                              ? 'bg-red-600 text-white'
                              : opp.urgency === 'high'
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-600 text-white'
                          }`}
                        >
                          {opp.urgencyScore}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-orange-500" />
                        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {new Date(opp.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {opp.impactPotential}% impact
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-blue-500" />
                        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {opp.actionItems.filter(a => a.completed).length}/{opp.actionItems.length} done
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

// Opportunity Detail View
function OpportunityDetailView({
  isDarkMode,
  opportunity,
  onClose,
  onCreateTaskBundle,
}: {
  isDarkMode: boolean;
  opportunity: Opportunity;
  onClose: () => void;
  onCreateTaskBundle: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'stakeholders' | 'resources' | 'strategy'>(
    'overview'
  );

  const completedActions = opportunity.actionItems.filter(a => a.completed).length;
  const totalActions = opportunity.actionItems.length;
  const progressPercent = (completedActions / totalActions) * 100;

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
          Back to Opportunities
        </button>
        <div className="flex items-center gap-2">
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
          <button
            onClick={onCreateTaskBundle}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white"
          >
            <Plus className="w-4 h-4" />
            Create Task Bundle
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`px-3 py-1 rounded-lg text-white text-xs font-bold uppercase ${
                  opportunity.type === 'legislative'
                    ? 'bg-blue-600'
                    : opportunity.type === 'media'
                    ? 'bg-purple-600'
                    : opportunity.type === 'coalition'
                    ? 'bg-green-600'
                    : 'bg-orange-600'
                }`}
              >
                {opportunity.type}
              </div>
              <div
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                  opportunity.urgency === 'critical'
                    ? 'bg-red-600 text-white'
                    : opportunity.urgency === 'high'
                    ? 'bg-orange-600 text-white'
                    : opportunity.urgency === 'medium'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}
              >
                {opportunity.urgency}
              </div>
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {opportunity.title}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {opportunity.description}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              URGENCY SCORE
            </div>
            <div
              className={`text-4xl font-bold ${
                opportunity.urgency === 'critical'
                  ? 'text-red-600'
                  : opportunity.urgency === 'high'
                  ? 'text-orange-600'
                  : 'text-yellow-600'
              }`}
            >
              {opportunity.urgencyScore}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-5 gap-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                IMPACT
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {opportunity.impactPotential}%
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                SUCCESS
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {opportunity.successProbability}%
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                EFFORT
              </span>
            </div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {opportunity.effortEstimate}
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                DEADLINE
              </span>
            </div>
            <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {new Date(opportunity.deadline).toLocaleDateString()}
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                PROGRESS
              </span>
            </div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(progressPercent)}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2">
        {[
          { id: 'overview', icon: BarChart3, label: 'Overview' },
          { id: 'actions', icon: CheckCircle, label: 'Action Checklist' },
          { id: 'stakeholders', icon: Users, label: 'Stakeholders' },
          { id: 'resources', icon: FileText, label: 'Resources' },
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
          {activeTab === 'overview' && <OpportunityOverview isDarkMode={isDarkMode} opportunity={opportunity} />}
          {activeTab === 'actions' && <ActionChecklist isDarkMode={isDarkMode} opportunity={opportunity} />}
          {activeTab === 'stakeholders' && <StakeholderMap isDarkMode={isDarkMode} opportunity={opportunity} />}
          {activeTab === 'resources' && <ResourcesNeeded isDarkMode={isDarkMode} opportunity={opportunity} />}
          {activeTab === 'strategy' && <OpportunityStrategy isDarkMode={isDarkMode} opportunity={opportunity} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Sub-components for Opportunity Detail tabs
function OpportunityOverview({ isDarkMode, opportunity }: { isDarkMode: boolean; opportunity: Opportunity }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Timeline to Deadline
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Today', date: new Date(), status: 'current' },
            { label: 'Midpoint Check', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), status: 'upcoming' },
            { label: 'Final Review', date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), status: 'upcoming' },
            { label: 'Deadline', date: new Date(opportunity.deadline), status: 'deadline' },
          ].map((milestone, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div
                className={`w-3 h-3 rounded-full mt-1 ${
                  milestone.status === 'current'
                    ? 'bg-green-500'
                    : milestone.status === 'deadline'
                    ? 'bg-red-500'
                    : isDarkMode
                    ? 'bg-slate-600'
                    : 'bg-gray-300'
                }`}
              />
              <div className="flex-1">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {milestone.label}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {milestone.date.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Success Factors
        </h3>
        <div className="space-y-3">
          {[
            { factor: 'Stakeholder Alignment', score: 78 },
            { factor: 'Resource Availability', score: 85 },
            { factor: 'Political Climate', score: 62 },
            { factor: 'Timing Window', score: 91 },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  {item.factor}
                </span>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.score}%
                </span>
              </div>
              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full ${
                    item.score >= 80 ? 'bg-green-600' : item.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`col-span-2 p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Risk Assessment
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { risk: 'Timeline Risk', level: 'Medium', color: 'text-yellow-500' },
            { risk: 'Resource Risk', level: 'Low', color: 'text-green-500' },
            { risk: 'Political Risk', level: 'Medium', color: 'text-yellow-500' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}
            >
              <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.risk}
              </div>
              <div className={`text-xs font-bold ${item.color}`}>{item.level}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ActionChecklist({ isDarkMode, opportunity }: { isDarkMode: boolean; opportunity: Opportunity }) {
  return (
    <div className="space-y-4">
      {opportunity.actionItems.map((action, idx) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                action.completed
                  ? 'border-green-500 bg-green-500'
                  : isDarkMode
                  ? 'border-slate-600'
                  : 'border-gray-300'
              }`}
            >
              {action.completed && <CheckCircle className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1">
              <div
                className={`font-medium mb-1 ${
                  action.completed
                    ? isDarkMode
                      ? 'text-slate-500 line-through'
                      : 'text-gray-400 line-through'
                    : isDarkMode
                    ? 'text-white'
                    : 'text-gray-900'
                }`}
              >
                {action.task}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Assigned to: {action.assignee}
              </div>
            </div>
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Edit className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      ))}

      <button
        className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border-2 border-dashed ${
          isDarkMode
            ? 'border-white/20 hover:border-white/40 text-slate-400 hover:text-white'
            : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
        }`}
      >
        <Plus className="w-4 h-4" />
        Add Action Item
      </button>
    </div>
  );
}

function StakeholderMap({ isDarkMode, opportunity }: { isDarkMode: boolean; opportunity: Opportunity }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {opportunity.stakeholders.map((stakeholder, idx) => (
        <motion.div
          key={stakeholder}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stakeholder}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`px-2 py-1 rounded text-xs font-bold ${
                idx === 0
                  ? 'bg-green-600 text-white'
                  : idx === 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {idx === 0 ? 'Champion' : idx === 1 ? 'Supporter' : 'Influencer'}
            </div>
          </div>
          <div className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {idx === 0
              ? 'Key decision-maker with strong alignment'
              : idx === 1
              ? 'Actively supportive, moderate influence'
              : 'Can shape narrative through connections'}
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Mail className="w-3 h-3" />
              Email
            </button>
            <button
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Phone className="w-3 h-3" />
              Call
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ResourcesNeeded({ isDarkMode, opportunity }: { isDarkMode: boolean; opportunity: Opportunity }) {
  return (
    <div className="space-y-4">
      {opportunity.resourcesNeeded.map((resource, idx) => (
        <motion.div
          key={resource}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {resource}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {idx === 0 ? 'Research & Analysis' : idx === 1 ? 'Communications' : 'Coalition Materials'}
                </div>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                idx === 0
                  ? 'bg-green-600 text-white'
                  : idx === 1
                  ? 'bg-yellow-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {idx === 0 ? 'Ready' : idx === 1 ? 'In Progress' : 'Not Started'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              View Document
            </button>
            <button
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function OpportunityStrategy({ isDarkMode, opportunity }: { isDarkMode: boolean; opportunity: Opportunity }) {
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
                Revere Action Plan
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {opportunity.title}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Success Probability
            </div>
            <div className="text-2xl font-bold text-purple-500">{opportunity.successProbability}%</div>
          </div>
        </div>
      </motion.div>

      {/* Strategic Approach */}
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
          STRATEGIC APPROACH
        </div>
        <ul className="space-y-2">
          {[
            'Coordinate messaging with coalition partners ahead of committee markup',
            'Deploy rapid response team for media opportunities during announcement',
            'Leverage business case arguments to build bipartisan support',
            'Schedule stakeholder briefings 48 hours before key votes',
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

      {/* Critical Path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div
          className={`text-sm font-semibold mb-3 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          CRITICAL PATH TO SUCCESS
        </div>
        <div className="space-y-3">
          {[
            { milestone: 'Secure lead sponsor', deadline: '2 days', priority: 'Critical' },
            { milestone: 'Finalize amendment language', deadline: '3 days', priority: 'High' },
            { milestone: 'Rally coalition support', deadline: '5 days', priority: 'High' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isDarkMode ? 'bg-white/5' : 'bg-gray-50'
              }`}
            >
              <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.milestone}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {item.deadline}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.priority === 'Critical'
                      ? 'bg-red-600 text-white'
                      : 'bg-orange-600 text-white'
                  }`}
                >
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Risk Mitigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
            RISK MITIGATION
          </span>
        </div>
        <ul className="space-y-2">
          {[
            'Develop Plan B if lead sponsor unavailable - identify backup champions',
            'Prepare counter-arguments for opposition talking points',
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
    </div>
  );
}

// Task Bundle Modal
function TaskBundleModal({ isDarkMode, onClose }: { isDarkMode: boolean; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Create Task Bundle
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Generate an organized set of tasks from this opportunity
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode
                  ? 'hover:bg-white/10 text-slate-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div
            className={`p-4 rounded-xl border ${
              isDarkMode
                ? 'bg-purple-900/20 border-purple-500/30'
                : 'bg-purple-50 border-purple-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Revere-Generated Bundle
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              This will create a comprehensive task bundle with assignments, deadlines, and dependencies based on the opportunity action plan.
            </p>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div
              className={`text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              BUNDLE WILL INCLUDE
            </div>
            <ul className="space-y-2">
              {[
                '12 action items with assignees',
                'Timeline with milestones and deadlines',
                'Resource checklist',
                'Stakeholder communication plan',
                'Success metrics and tracking',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className={`flex items-center gap-2 text-sm ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t ${
            isDarkMode ? 'border-white/10 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white"
            >
              <Plus className="w-4 h-4" />
              Create Task Bundle
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
