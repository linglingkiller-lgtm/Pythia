import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  Newspaper,
  Users,
  FileText,
  Sparkles,
  Archive,
  TrendingUp,
  TrendingDown,
  Activity,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Bookmark,
  ChevronRight,
  Target,
  Phone,
  Mail,
} from 'lucide-react';
import {
  mentions,
  peopleByTopic,
  billsByTopic,
  pythiaInsightsByRegionTopic,
  pins,
  topicsByIssue,
} from '../../../data/issuesMockData';
import { repsByCounty } from '../../../data/issuesData';

interface Props {
  isDarkMode: boolean;
  currentScope: { type: string; id: string | null };
  selectedIssue: string;
  timeWindow: string;
}

type IntelligencePanelTab =
  | 'overview'
  | 'media'
  | 'people'
  | 'bills'
  | 'insights'
  | 'records';

export function IntelligencePanel({
  isDarkMode,
  currentScope,
  selectedIssue,
  timeWindow,
}: Props) {
  const [activeTab, setActiveTab] = useState<IntelligencePanelTab>('overview');
  const [mediaFilter, setMediaFilter] = useState<string>('all');

  // Get relevant data based on current scope
  const getScopeData = () => {
    if (currentScope.type === 'national') {
      return {
        score: null,
        momentum: null,
        topKeywords: [],
      };
    }

    // Mock score and momentum based on scope
    const scores: Record<string, number> = {
      California: 92,
      Texas: 78,
      'New York': 85,
    };

    return {
      score: scores[currentScope.id || ''] || 78,
      momentum: 12,
      topKeywords: ['solar', 'grid modernization', 'clean energy jobs'],
    };
  };

  const scopeData = getScopeData();

  // Filter mentions based on current scope and filters
  const getFilteredMentions = () => {
    let filtered = mentions;

    // Filter by region
    if (currentScope.id) {
      filtered = filtered.filter(m => m.regionKey === currentScope.id);
    }

    // Filter by media type
    if (mediaFilter !== 'all') {
      filtered = filtered.filter(m => m.type === mediaFilter);
    }

    return filtered.slice(0, 10); // Limit to 10 for display
  };

  // Get people for current topic
  const getRelevantPeople = () => {
    // If a county is selected, return county officials
    if (currentScope.type === 'county' && currentScope.id) {
      return repsByCounty[currentScope.id] || [];
    }
    
    // Otherwise, return topic-based people
    const topics = topicsByIssue[selectedIssue as keyof typeof topicsByIssue] || 
                   topicsByIssue['clean-energy'];
    const topicId = topics[0]?.topicId || 't01';
    return peopleByTopic[topicId] || [];
  };

  // Get bills for current topic
  const getRelevantBills = () => {
    const topics = topicsByIssue[selectedIssue as keyof typeof topicsByIssue] || 
                   topicsByIssue['clean-energy'];
    const topicId = topics[0]?.topicId || 't01';
    return billsByTopic[topicId] || [];
  };

  // Get Pythia insights
  const getPythiaInsights = () => {
    const topics = topicsByIssue[selectedIssue as keyof typeof topicsByIssue] || 
                   topicsByIssue['clean-energy'];
    const topicId = topics[0]?.topicId || 't01';
    const key = `${currentScope.id || 'California'}_${topicId}`;
    return pythiaInsightsByRegionTopic[key] || pythiaInsightsByRegionTopic['California_t01'];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab isDarkMode={isDarkMode} scopeData={scopeData} currentScope={currentScope} />;
      case 'media':
        return (
          <MediaTab
            isDarkMode={isDarkMode}
            mentions={getFilteredMentions()}
            mediaFilter={mediaFilter}
            setMediaFilter={setMediaFilter}
          />
        );
      case 'people':
        return <PeopleTab isDarkMode={isDarkMode} people={getRelevantPeople()} />;
      case 'bills':
        return <BillsTab isDarkMode={isDarkMode} bills={getRelevantBills()} />;
      case 'insights':
        return <InsightsTab isDarkMode={isDarkMode} insights={getPythiaInsights()} />;
      case 'records':
        return <RecordsTab isDarkMode={isDarkMode} pins={pins} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-[400px] border-l flex-shrink-0 flex flex-col transition-colors duration-500 ${
        isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      {/* Tab Navigation */}
      <div className={`border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="px-4 py-3">
          <h3 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Intelligence Panel
          </h3>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'overview', icon: BarChart3, label: 'Overview' },
              { id: 'media', icon: Newspaper, label: 'Media' },
              { id: 'people', icon: Users, label: 'People' },
              { id: 'bills', icon: FileText, label: 'Bills' },
              { id: 'insights', icon: Sparkles, label: 'Revere' },
              { id: 'records', icon: Archive, label: 'Records' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as IntelligencePanelTab)}
                className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-600 text-white'
                    : isDarkMode
                    ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({
  isDarkMode,
  scopeData,
  currentScope,
}: {
  isDarkMode: boolean;
  scopeData: any;
  currentScope: any;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div
          className={`text-xs font-semibold mb-2 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          CURRENT SCOPE
        </div>
        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {currentScope.type === 'national'
            ? 'United States'
            : currentScope.type === 'state'
            ? currentScope.id
            : currentScope.type === 'county'
            ? `County ${currentScope.id}`
            : `District ${currentScope.id}`}
        </div>
      </div>

      {currentScope.id && (
        <>
          {/* Activity Score */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div
              className={`text-xs font-semibold mb-2 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              ACTIVITY SCORE
            </div>
            <div className="text-3xl font-bold text-orange-600">{scopeData.score}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500 font-semibold">
                +{scopeData.momentum} vs previous period
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Newspaper className="w-4 h-4 text-blue-500" />
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
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-orange-500" />
                <span
                  className={`text-xs font-semibold ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}
                >
                  SENTIMENT
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4 text-green-500" />
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  68%
                </span>
              </div>
            </div>
          </div>

          {/* Top Keywords */}
          <div>
            <div
              className={`text-xs font-semibold mb-2 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              TOP KEYWORDS
            </div>
            <div className="flex flex-wrap gap-2">
              {scopeData.topKeywords.map((keyword: string) => (
                <div
                  key={keyword}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    isDarkMode
                      ? 'bg-orange-900/30 text-orange-300'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {keyword}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Trend (Mock Chart) */}
          <div>
            <div
              className={`text-xs font-semibold mb-2 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              7-DAY TREND
            </div>
            <div className="flex items-end gap-1 h-20">
              {[45, 52, 48, 61, 58, 73, 78].map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-orange-600 rounded-t"
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {!currentScope.id && (
        <div
          className={`text-center py-8 ${
            isDarkMode ? 'text-slate-500' : 'text-gray-500'
          }`}
        >
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a region to see detailed intelligence</p>
        </div>
      )}
    </div>
  );
}

// Media Tab Component
function MediaTab({
  isDarkMode,
  mentions,
  mediaFilter,
  setMediaFilter,
}: {
  isDarkMode: boolean;
  mentions: any[];
  mediaFilter: string;
  setMediaFilter: (filter: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex items-center gap-1 flex-wrap">
        {['all', 'news', 'social', 'press', 'committee'].map(filter => (
          <button
            key={filter}
            onClick={() => setMediaFilter(filter)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mediaFilter === filter
                ? 'bg-orange-600 text-white'
                : isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Mentions Feed */}
      <div className="space-y-3">
        {mentions.map(mention => (
          <div
            key={mention.id}
            className={`p-3 rounded-xl border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    mention.type === 'news'
                      ? 'bg-blue-600 text-white'
                      : mention.type === 'social'
                      ? 'bg-purple-600 text-white'
                      : mention.type === 'press'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  {mention.type}
                </div>
                {mention.sentiment === 'pos' && (
                  <ThumbsUp className="w-3 h-3 text-green-500" />
                )}
                {mention.sentiment === 'neg' && (
                  <ThumbsDown className="w-3 h-3 text-red-500" />
                )}
                {mention.sentiment === 'neu' && (
                  <Minus className="w-3 h-3 text-gray-500" />
                )}
              </div>
              <div
                className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}
              >
                {new Date(mention.dateISO).toLocaleDateString()}
              </div>
            </div>
            <div
              className={`text-sm font-medium mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {mention.titleOrText}
            </div>
            <div
              className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}
            >
              {mention.snippet}
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                }`}
              >
                {mention.source}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className={`p-1 rounded hover:bg-white/10 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}
                >
                  <Bookmark className="w-3 h-3" />
                </button>
                <button
                  className={`p-1 rounded hover:bg-white/10 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mentions.length === 0 && (
        <div
          className={`text-center py-8 ${
            isDarkMode ? 'text-slate-500' : 'text-gray-500'
          }`}
        >
          <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No mentions found for this selection</p>
        </div>
      )}
    </div>
  );
}

// People Tab Component
function PeopleTab({ isDarkMode, people }: { isDarkMode: boolean; people: any[] }) {
  // Helper function to determine the tier from a score
  const getTierFromScore = (score: number) => {
    if (score >= 75) return { tier: 'strong', color: 'text-green-500', bgColor: 'bg-green-500' };
    if (score >= 50) return { tier: 'moderate', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    return { tier: 'emerging', color: 'text-gray-500', bgColor: 'bg-gray-500' };
  };

  return (
    <div className="space-y-4">
      {people.length > 0 && (
        <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Showing {people.length} official{people.length !== 1 ? 's' : ''}
        </div>
      )}
      
      {people.map((person, idx) => {
        // Determine if this is a county official (has email/phone) or topic-based person (has personId)
        const isCountyOfficial = person.email !== undefined;
        
        // Calculate tier info for county officials
        let tierInfo = null;
        let score0to100 = 0;
        let breakdown = null;
        
        if (person.relationshipMeter) {
          if (isCountyOfficial && person.relationshipMeter.score !== undefined) {
            // County official structure
            tierInfo = getTierFromScore(person.relationshipMeter.score);
            score0to100 = person.relationshipMeter.score;
            breakdown = {
              rec: person.relationshipMeter.recency || 0,
              frq: person.relationshipMeter.frequency || 0,
              rsp: person.relationshipMeter.responsiveness || 0,
              alg: person.relationshipMeter.issueAlignment || 0,
              str: person.relationshipMeter.strategicRelevance || 0,
            };
          } else if (person.relationshipMeter.tier) {
            // Topic-based person structure
            tierInfo = {
              tier: person.relationshipMeter.tier,
              color: person.relationshipMeter.tier === 'strong'
                ? 'text-green-500'
                : person.relationshipMeter.tier === 'moderate'
                ? 'text-yellow-500'
                : 'text-gray-500',
              bgColor: person.relationshipMeter.tier === 'strong'
                ? 'bg-green-500'
                : person.relationshipMeter.tier === 'moderate'
                ? 'bg-yellow-500'
                : 'bg-gray-500',
            };
            score0to100 = person.relationshipMeter.score0to100 || 0;
            breakdown = person.relationshipMeter.breakdown;
          }
        }
        
        return (
          <div
            key={person.personId || `person-${idx}`}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {person.name}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {person.officeTitle}
                </div>
                <div className="flex items-center gap-1 mt-1">
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
                  {person.districtLabel && (
                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                      {person.districtLabel}
                    </span>
                  )}
                  {person.positionType && !person.districtLabel && (
                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                      {person.positionType.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info (for county officials) */}
            {isCountyOfficial && (
              <div className="space-y-1.5 mb-3">
                {person.email && (
                  <div className="flex items-center gap-2">
                    <Mail className={`w-3 h-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                    <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {person.email}
                    </span>
                  </div>
                )}
                {person.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className={`w-3 h-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                    <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {person.phone}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Relationship Meter */}
            {tierInfo && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-semibold ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}
                  >
                    RELATIONSHIP
                  </span>
                  <span className={`text-xs font-bold ${tierInfo.color}`}>
                    {tierInfo.tier.toUpperCase()}
                  </span>
                </div>
                <div className={`h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div
                    className={`h-full rounded-full ${tierInfo.bgColor}`}
                    style={{ width: `${score0to100}%` }}
                  />
                </div>
                {breakdown && (
                  <div className="grid grid-cols-5 gap-1 mt-2 text-xs">
                    {Object.entries(breakdown).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <div className={isDarkMode ? 'text-slate-500' : 'text-gray-500'}>
                          {typeof key === 'string' ? key.slice(0, 3) : key}
                        </div>
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {val as number}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Committees */}
            {person.committees && person.committees.length > 0 && (
              <div className="mb-3">
                <div
                  className={`text-xs font-semibold mb-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}
                >
                  COMMITTEES
                </div>
                <div className="flex flex-wrap gap-1">
                  {person.committees.map((committee: string) => (
                    <div
                      key={committee}
                      className={`px-2 py-0.5 rounded text-xs ${
                        isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {committee}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
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
                <FileText className="w-3 h-3" />
                Prep
              </button>
            </div>
          </div>
        );
      })}

      {people.length === 0 && (
        <div
          className={`text-center py-8 ${
            isDarkMode ? 'text-slate-500' : 'text-gray-500'
          }`}
        >
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No key people for this selection</p>
        </div>
      )}
    </div>
  );
}

// Bills Tab Component
function BillsTab({ isDarkMode, bills }: { isDarkMode: boolean; bills: any[] }) {
  return (
    <div className="space-y-4">
      {bills.map(bill => (
        <div
          key={bill.billId}
          className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {bill.billId}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {bill.title}
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-bold ${
                bill.status === 'active'
                  ? 'bg-green-600 text-white'
                  : bill.status === 'passed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-white'
              }`}
            >
              {bill.status}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                {bill.stage}
              </span>
              <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {bill.progressPct}%
              </span>
            </div>
            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${bill.progressPct}%` }}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mb-3">
            <div
              className={`text-xs font-semibold mb-1 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              KEY POINTS
            </div>
            <ul className="space-y-1">
              {bill.summaryBullets.slice(0, 2).map((bullet: string, idx: number) => (
                <li
                  key={idx}
                  className={`text-xs flex items-start gap-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  <CheckCircle className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flags */}
          {bill.redFlags.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3 h-3 text-orange-500" />
                <span
                  className={`text-xs font-semibold ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}
                >
                  RED FLAGS
                </span>
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                {bill.redFlags[0]}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Generate Review
            </button>
            <button
              className={`p-1.5 rounded-lg transition-all ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Bookmark className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}

      {bills.length === 0 && (
        <div
          className={`text-center py-8 ${
            isDarkMode ? 'text-slate-500' : 'text-gray-500'
          }`}
        >
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No related bills</p>
        </div>
      )}
    </div>
  );
}

// Insights Tab Component
function InsightsTab({ isDarkMode, insights }: { isDarkMode: boolean; insights: any }) {
  if (!insights) {
    return (
      <div
        className={`text-center py-8 ${
          isDarkMode ? 'text-slate-500' : 'text-gray-500'
        }`}
      >
        <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No insights available for this selection</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Confidence Score */}
      <div className={`p-4 rounded-xl border-2 ${
        isDarkMode ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Revere Analysis
            </span>
          </div>
          <div className="text-right">
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Confidence
            </div>
            <div className="text-lg font-bold text-purple-500">
              {insights.confidence0to100}%
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Shift */}
      {insights.narrativeShift && (
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              NARRATIVE SHIFT DETECTED
            </span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {insights.narrativeShift}
          </p>
        </div>
      )}

      {/* Key Patterns */}
      <div>
        <div
          className={`text-xs font-semibold mb-2 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          KEY PATTERNS
        </div>
        <ul className="space-y-2">
          {insights.keyPatterns.map((pattern: string, idx: number) => (
            <li
              key={idx}
              className={`flex items-start gap-2 text-sm ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}
            >
              <Target className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
              <span>{pattern}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Flags */}
      {insights.riskFlags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              RISK FLAGS
            </span>
          </div>
          <ul className="space-y-2">
            {insights.riskFlags.map((risk: string, idx: number) => (
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
        </div>
      )}

      {/* Recommended Actions */}
      <div>
        <div
          className={`text-xs font-semibold mb-2 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          RECOMMENDED ACTIONS
        </div>
        <ul className="space-y-2">
          {insights.recommendedActions.map((action: string, idx: number) => (
            <li
              key={idx}
              className={`flex items-start gap-2 text-sm ${
                isDarkMode ? 'text-green-300' : 'text-green-700'
              }`}
            >
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <button
        className={`w-full px-4 py-2 rounded-xl font-semibold transition-all ${
          isDarkMode
            ? 'bg-purple-600 hover:bg-purple-500 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        Create Task Bundle from Insights
      </button>
    </div>
  );
}

// Records Tab Component
function RecordsTab({ isDarkMode, pins }: { isDarkMode: boolean; pins: any[] }) {
  return (
    <div className="space-y-4">
      <div>
        <div
          className={`text-xs font-semibold mb-2 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          PINNED ITEMS
        </div>
        {pins.length === 0 ? (
          <div
            className={`text-center py-8 ${
              isDarkMode ? 'text-slate-500' : 'text-gray-500'
            }`}
          >
            <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No pinned items yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pins.map(pin => (
              <div
                key={pin.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                }`}
              >
                <div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {pin.label}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {pin.type} • {new Date(pin.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div
          className={`text-xs font-semibold mb-2 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          RECENT SAVES
        </div>
        <div
          className={`text-center py-8 ${
            isDarkMode ? 'text-slate-500' : 'text-gray-500'
          }`}
        >
          <Archive className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No saved records</p>
        </div>
      </div>
    </div>
  );
}