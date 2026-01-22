import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import {
  X,
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Users,
  Sparkles,
  Download,
  Share2,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Target,
  AlertTriangle,
  CheckCircle,
  Mail,
  Flame,
  ArrowLeft,
  Clock,
  Scale,
  Gavel,
  Lightbulb,
  Zap,
} from 'lucide-react';
import {
  topicsByIssue,
  mentions,
  billsByTopic,
  peopleByTopic,
  pythiaInsightsByRegionTopic,
} from '../../../data/issuesMockData';

// Helper function to generate sparkline data
const generateSparkline = () => {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 60 + 20));
};

interface Props {
  isDarkMode: boolean;
  selectedIssue: string;
  currentScope: { type: string; id: string | null };
}

type TopicDetailView = 'overview' | 'mentions' | 'legislative' | 'people' | 'strategy';

export function TopicsHubTab({ isDarkMode, selectedIssue, currentScope }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [detailView, setDetailView] = useState<TopicDetailView>('overview');
  const [showBriefModal, setShowBriefModal] = useState(false);

  // Get topics for current issue
  const topics =
    topicsByIssue[selectedIssue as keyof typeof topicsByIssue] ||
    topicsByIssue['clean-energy'];

  // Filter topics by search
  const filteredTopics = topics.filter(
    topic =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.descriptionShort.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTopicClick = (topic: any) => {
    setSelectedTopic(topic);
    setDetailView('overview');
  };

  const handleCloseTopic = () => {
    setSelectedTopic(null);
  };

  const handleGenerateBrief = () => {
    setShowBriefModal(true);
  };

  if (selectedTopic) {
    return (
      <TopicDetailView
        isDarkMode={isDarkMode}
        topic={selectedTopic}
        detailView={detailView}
        setDetailView={setDetailView}
        onClose={handleCloseTopic}
        onGenerateBrief={handleGenerateBrief}
        currentScope={currentScope}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`}
          />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-orange-500/50'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500'
            } outline-none`}
          />
        </div>
        <button
          onClick={handleGenerateBrief}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
            isDarkMode
              ? 'bg-orange-600 hover:bg-orange-500 text-white'
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Generate Brief
        </button>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredTopics.map((topic, idx) => (
          <motion.div
            key={topic.topicId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleTopicClick(topic)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
              isDarkMode
                ? 'bg-slate-900/40 border-white/10 hover:border-orange-500/50'
                : 'bg-white border-gray-200 hover:border-orange-500 hover:shadow-lg'
            }`}
          >
            {/* Header with Heat Badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div
                  className={`text-sm font-bold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {topic.name}
                </div>
                <div
                  className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}
                >
                  {topic.descriptionShort}
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-lg text-xs font-bold ml-2 flex-shrink-0 ${
                  topic.heatScore >= 80
                    ? 'bg-red-600 text-white'
                    : topic.heatScore >= 60
                    ? 'bg-orange-600 text-white'
                    : topic.heatScore >= 40
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}
              >
                {topic.heatScore}
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <MessageSquare className="w-3 h-3 text-blue-500" />
                  <span
                    className={`text-xs font-semibold ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}
                  >
                    Mentions
                  </span>
                </div>
                <div
                  className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {topic.mentionCountLastWeek}
                </div>
              </div>
              <div
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Scale className="w-3 h-3 text-orange-500" />
                  <span
                    className={`text-xs font-semibold ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}
                  >
                    Sentiment
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {topic.sentimentNetPercent > 0 ? (
                    <ThumbsUp className="w-3 h-3 text-green-500" />
                  ) : topic.sentimentNetPercent < 0 ? (
                    <ThumbsDown className="w-3 h-3 text-red-500" />
                  ) : (
                    <Minus className="w-3 h-3 text-gray-500" />
                  )}
                  <span
                    className={`text-sm font-bold ${
                      topic.sentimentNetPercent > 0
                        ? 'text-green-500'
                        : topic.sentimentNetPercent < 0
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {topic.sentimentNetPercent > 0 ? '+' : ''}
                    {topic.sentimentNetPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Momentum with Sparkline */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {topic.momentumDelta > 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    topic.momentumDelta > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {topic.momentumDelta > 0 ? '+' : ''}
                  {topic.momentumDelta}%
                </span>
              </div>
              {/* Sparkline */}
              <div className="flex items-end gap-0.5 h-6">
                {generateSparkline().map((val, i) => (
                  <div
                    key={i}
                    className="w-1 bg-orange-600 rounded-t"
                    style={{ height: `${(val / 80) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div
          className={`text-center py-16 ${
            isDarkMode ? 'text-slate-500' : 'text-gray-500'
          }`}
        >
          <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">No topics found</p>
          <p className="text-sm mt-1">Try adjusting your search query</p>
        </div>
      )}

      {/* Generate Brief Modal */}
      <AnimatePresence>
        {showBriefModal && (
          <BriefGenerationModal
            isDarkMode={isDarkMode}
            onClose={() => setShowBriefModal(false)}
            selectedIssue={selectedIssue}
            topics={topics}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Topic Detail View Component
function TopicDetailView({
  isDarkMode,
  topic,
  detailView,
  setDetailView,
  onClose,
  onGenerateBrief,
  currentScope,
}: {
  isDarkMode: boolean;
  topic: any;
  detailView: TopicDetailView;
  setDetailView: (view: TopicDetailView) => void;
  onClose: () => void;
  onGenerateBrief: () => void;
  currentScope: any;
}) {
  const topicMentions = mentions.filter(m =>
    m.snippet.toLowerCase().includes(topic.name.toLowerCase())
  );
  const topicBills = billsByTopic[topic.topicId] || [];
  const topicPeople = peopleByTopic[topic.topicId] || [];
  const pythiaInsights =
    pythiaInsightsByRegionTopic[`${currentScope.id || 'California'}_${topic.topicId}`] ||
    pythiaInsightsByRegionTopic['California_t01'];

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
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
          Back to Topics
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
            onClick={onGenerateBrief}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white"
          >
            <FileText className="w-4 h-4" />
            Generate Brief
          </button>
        </div>
      </div>

      {/* Topic Title & Overview */}
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
              {topic.name}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {topic.descriptionShort}
            </p>
          </div>
          <div
            className={`px-3 py-2 rounded-xl text-lg font-bold ${
              topic.heatScore >= 80
                ? 'bg-red-600 text-white'
                : topic.heatScore >= 60
                ? 'bg-orange-600 text-white'
                : topic.heatScore >= 40
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-600 text-white'
            }`}
          >
            {topic.heatScore}
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                MENTIONS
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {topic.mentionCountLastWeek}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500 font-semibold">+{topic.momentumDelta}%</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-orange-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                SENTIMENT
              </span>
            </div>
            <div className="flex items-center gap-2">
              {topic.sentimentNetPercent > 0 ? (
                <ThumbsUp className="w-5 h-5 text-green-500" />
              ) : topic.sentimentNetPercent < 0 ? (
                <ThumbsDown className="w-5 h-5 text-red-500" />
              ) : (
                <Minus className="w-5 h-5 text-gray-500" />
              )}
              <span
                className={`text-2xl font-bold ${
                  topic.sentimentNetPercent > 0
                    ? 'text-green-500'
                    : topic.sentimentNetPercent < 0
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {topic.sentimentNetPercent > 0 ? '+' : ''}
                {topic.sentimentNetPercent}%
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Gavel className="w-4 h-4 text-purple-500" />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                BILLS
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {topicBills.length}
            </div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {topicBills.filter(b => b.status === 'active').length} active
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
                KEY PEOPLE
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {topicPeople.length}
            </div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {topicPeople.filter(p => p.relationshipMeter.tier === 'strong').length} strong
            </div>
          </div>
        </div>
      </motion.div>

      {/* View Selector */}
      <div className="flex items-center gap-2">
        {[
          { id: 'overview', icon: Activity, label: 'Overview' },
          { id: 'mentions', icon: MessageSquare, label: 'Mentions' },
          { id: 'legislative', icon: FileText, label: 'Legislative' },
          { id: 'people', icon: Users, label: 'People' },
          { id: 'strategy', icon: Lightbulb, label: 'Revere Strategy' },
        ].map(view => (
          <button
            key={view.id}
            onClick={() => setDetailView(view.id as TopicDetailView)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              detailView === view.id
                ? 'bg-orange-600 text-white'
                : isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <view.icon className="w-4 h-4" />
            {view.label}
          </button>
        ))}
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={detailView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {detailView === 'overview' && (
            <TopicOverviewView isDarkMode={isDarkMode} topic={topic} />
          )}
          {detailView === 'mentions' && (
            <TopicMentionsView isDarkMode={isDarkMode} mentions={topicMentions} />
          )}
          {detailView === 'legislative' && (
            <TopicLegislativeView isDarkMode={isDarkMode} bills={topicBills} />
          )}
          {detailView === 'people' && (
            <TopicPeopleView isDarkMode={isDarkMode} people={topicPeople} />
          )}
          {detailView === 'strategy' && (
            <TopicStrategyView isDarkMode={isDarkMode} insights={pythiaInsights} topic={topic} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Topic Overview Sub-view
function TopicOverviewView({ isDarkMode, topic }: { isDarkMode: boolean; topic: any }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Top Keywords
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['solar energy', 'renewable credits', 'grid modernization', 'tax incentives', 'job creation'].map(
            keyword => (
              <div
                key={keyword}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  isDarkMode
                    ? 'bg-orange-900/30 text-orange-300'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {keyword}
              </div>
            )
          )}
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
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            7-Day Activity Trend
          </h3>
        </div>
        <div className="flex items-end gap-2 h-32">
          {[65, 72, 68, 81, 78, 92, 95].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-orange-600 rounded-t"
                style={{ height: `${val}%` }}
              />
              <span
                className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}
              >
                D{i + 1}
              </span>
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
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-purple-500" />
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Intelligence
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div
              className={`text-xs font-semibold mb-1 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              MOST ACTIVE REGION
            </div>
            <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              California
            </div>
          </div>
          <div>
            <div
              className={`text-xs font-semibold mb-1 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              FASTEST GROWING
            </div>
            <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Texas (+34%)
            </div>
          </div>
          <div>
            <div
              className={`text-xs font-semibold mb-1 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              PRIMARY SOURCE
            </div>
            <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              News Media
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Topic Mentions Sub-view
function TopicMentionsView({
  isDarkMode,
  mentions,
}: {
  isDarkMode: boolean;
  mentions: any[];
}) {
  return (
    <div className="space-y-3">
      {mentions.slice(0, 10).map((mention, idx) => (
        <motion.div
          key={mention.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
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
              {mention.sentiment === 'pos' && <ThumbsUp className="w-3 h-3 text-green-500" />}
              {mention.sentiment === 'neg' && <ThumbsDown className="w-3 h-3 text-red-500" />}
              {mention.sentiment === 'neu' && <Minus className="w-3 h-3 text-gray-500" />}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
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
          <div className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
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
            <button
              className={`text-xs font-semibold ${
                isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'
              }`}
            >
              Read More →
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Topic Legislative Sub-view
function TopicLegislativeView({ isDarkMode, bills }: { isDarkMode: boolean; bills: any[] }) {
  return (
    <div className="space-y-4">
      {bills.map((bill, idx) => (
        <motion.div
          key={bill.billId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {bill.billId}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {bill.title}
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
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

          {/* Progress */}
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

          {/* Summary Bullets */}
          <ul className="space-y-1 mb-3">
            {bill.summaryBullets.slice(0, 2).map((bullet: string, i: number) => (
              <li
                key={i}
                className={`text-xs flex items-start gap-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}
              >
                <CheckCircle className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <button
            className={`w-full px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isDarkMode
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Generate Bill Review
          </button>
        </motion.div>
      ))}

      {bills.length === 0 && (
        <div
          className={`text-center py-12 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}
        >
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No bills related to this topic</p>
        </div>
      )}
    </div>
  );
}

// Topic People Sub-view
function TopicPeopleView({ isDarkMode, people }: { isDarkMode: boolean; people: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {people.map((person, idx) => (
        <motion.div
          key={person.personId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
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
              </div>
            </div>
          </div>

          {/* Relationship Meter */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                RELATIONSHIP
              </span>
              <span
                className={`text-xs font-bold ${
                  person.relationshipMeter.tier === 'strong'
                    ? 'text-green-500'
                    : person.relationshipMeter.tier === 'moderate'
                    ? 'text-yellow-500'
                    : 'text-gray-500'
                }`}
              >
                {person.relationshipMeter.tier.toUpperCase()}
              </span>
            </div>
            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
              <div
                className={`h-full rounded-full ${
                  person.relationshipMeter.tier === 'strong'
                    ? 'bg-green-500'
                    : person.relationshipMeter.tier === 'moderate'
                    ? 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}
                style={{ width: `${person.relationshipMeter.score0to100}%` }}
              />
            </div>
          </div>

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
        </motion.div>
      ))}

      {people.length === 0 && (
        <div
          className={`col-span-2 text-center py-12 ${
            isDarkMode ? 'text-slate-500' : 'text-gray-500'
          }`}
        >
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No key people for this topic</p>
        </div>
      )}
    </div>
  );
}

// Topic Strategy Sub-view (Revere Insights)
function TopicStrategyView({
  isDarkMode,
  insights,
  topic,
}: {
  isDarkMode: boolean;
  insights: any;
  topic: any;
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
            <Zap className="w-6 h-6 text-purple-500" />
            <div>
              <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Revere Strategic Analysis
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {topic.name}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Confidence
            </div>
            <div className="text-2xl font-bold text-purple-500">
              {insights.confidence0to100}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Narrative Shift */}
      {insights.narrativeShift && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-5 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span
              className={`text-sm font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              NARRATIVE SHIFT DETECTED
            </span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {insights.narrativeShift}
          </p>
        </motion.div>
      )}

      {/* Key Patterns */}
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
      </motion.div>

      {/* Risk Flags */}
      {insights.riskFlags.length > 0 && (
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
        </motion.div>
      )}

      {/* Recommended Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div
          className={`text-sm font-semibold mb-3 ${
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
      </motion.div>

      {/* Action Button */}
      <button
        className={`w-full px-6 py-3 rounded-xl font-bold transition-all ${
          isDarkMode
            ? 'bg-purple-600 hover:bg-purple-500 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        Create Task Bundle from Strategy
      </button>
    </div>
  );
}

// Brief Generation Modal
function BriefGenerationModal({
  isDarkMode,
  onClose,
  selectedIssue,
  topics,
}: {
  isDarkMode: boolean;
  onClose: () => void;
  selectedIssue: string;
  topics: any[];
}) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [briefFormat, setBriefFormat] = useState<'executive' | 'detailed' | 'presentation'>(
    'executive'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<any>(null);

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleGenerateBrief = () => {
    setIsGenerating(true);
    
    // Simulate brief generation with a delay
    setTimeout(() => {
      const selectedTopicData = topics.filter(t => selectedTopics.includes(t.topicId));
      const brief = generateBriefData(selectedIssue, selectedTopicData, briefFormat);
      setGeneratedBrief(brief);
      setIsGenerating(false);
    }, 1500);
  };

  if (generatedBrief) {
    return (
      <BriefViewerModal
        isDarkMode={isDarkMode}
        brief={generatedBrief}
        onClose={onClose}
        onBack={() => setGeneratedBrief(null)}
      />
    );
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Generate Brief
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Select topics and format for your intelligence brief
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
        <div className="p-6 space-y-6 max-h-[60vh] overflow-auto">
          {/* Brief Format */}
          <div>
            <div
              className={`text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              BRIEF FORMAT
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'executive', label: 'Executive Summary', desc: '2-page overview' },
                { id: 'detailed', label: 'Detailed Report', desc: 'Full analysis' },
                { id: 'presentation', label: 'Presentation', desc: 'Slide deck' },
              ].map(format => (
                <button
                  key={format.id}
                  onClick={() => setBriefFormat(format.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    briefFormat === format.id
                      ? 'border-orange-500 bg-orange-600/10'
                      : isDarkMode
                      ? 'border-white/10 hover:border-white/20 bg-white/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div
                    className={`font-semibold mb-1 ${
                      briefFormat === format.id
                        ? 'text-orange-500'
                        : isDarkMode
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}
                  >
                    {format.label}
                  </div>
                  <div
                    className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}
                  >
                    {format.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Selection */}
          <div>
            <div
              className={`text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              SELECT TOPICS ({selectedTopics.length}/{topics.length})
            </div>
            <div className="space-y-2">
              {topics.map(topic => (
                <button
                  key={topic.topicId}
                  onClick={() => toggleTopic(topic.topicId)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    selectedTopics.includes(topic.topicId)
                      ? 'border-orange-500 bg-orange-600/10'
                      : isDarkMode
                      ? 'border-white/10 hover:border-white/20 bg-white/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedTopics.includes(topic.topicId)
                        ? 'border-orange-500 bg-orange-500'
                        : isDarkMode
                        ? 'border-slate-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedTopics.includes(topic.topicId) && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {topic.name}
                    </div>
                    <div
                      className={`text-xs ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}
                    >
                      {topic.descriptionShort}
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      topic.heatScore >= 80
                        ? 'bg-red-600 text-white'
                        : topic.heatScore >= 60
                        ? 'bg-orange-600 text-white'
                        : 'bg-yellow-600 text-white'
                    }`}
                  >
                    {topic.heatScore}
                  </div>
                </button>
              ))}
            </div>
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
              disabled={selectedTopics.length === 0}
              className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                selectedTopics.length === 0
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-500 text-white'
              }`}
              onClick={handleGenerateBrief}
            >
              {isGenerating ? (
                <div className="animate-spin">
                  <Zap className="w-4 h-4" />
                </div>
              ) : (
                <Download className="w-4 h-4" />
              )}
              Generate Brief ({selectedTopics.length} topics)
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

// Function to simulate brief generation
function generateBriefData(issue: string, topics: any[], format: 'executive' | 'detailed' | 'presentation') {
  // Simulate brief data
  const brief = {
    issue: issue,
    topics: topics.map(topic => ({
      name: topic.name,
      description: topic.descriptionShort,
      heatScore: topic.heatScore,
      mentionCountLastWeek: topic.mentionCountLastWeek,
      sentimentNetPercent: topic.sentimentNetPercent,
      momentumDelta: topic.momentumDelta,
      bills: billsByTopic[topic.topicId] || [],
      people: peopleByTopic[topic.topicId] || [],
      pythiaInsights:
        pythiaInsightsByRegionTopic[`${'California'}_${topic.topicId}`] ||
        pythiaInsightsByRegionTopic['California_t01'],
    })),
    format: format,
    generatedAt: new Date().toISOString(),
  };

  return brief;
}

// PDF Generation Function
function downloadBriefAsPDF(brief: any) {
  const doc = new jsPDF();
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin, yPos);
      yPos += fontSize * 0.5;
    });
    yPos += 3;
  };

  // Header
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('REVERE INTELLIGENCE BRIEF', margin, 20);
  
  yPos = 45;

  // Issue Title
  addText(`ISSUE: ${brief.issue.toUpperCase()}`, 14, true, [220, 38, 38]);
  yPos += 3;

  // Format & Date
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.text(`Format: ${brief.format.charAt(0).toUpperCase() + brief.format.slice(1)}`, margin, yPos);
  doc.text(`Generated: ${new Date(brief.generatedAt).toLocaleString()}`, pageWidth - margin - 80, yPos);
  yPos += 10;

  // Divider
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Topics
  brief.topics.forEach((topic: any, index: number) => {
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    // Topic Header
    addText(`${index + 1}. ${topic.name}`, 14, true, [0, 0, 0]);
    addText(topic.description, 10, false, [71, 85, 105]);
    
    // Heat Score Badge
    const heatScore = topic.heatScore;
    const heatColor = heatScore >= 80 ? [220, 38, 38] : heatScore >= 60 ? [234, 88, 12] : [202, 138, 4];
    doc.setFillColor(heatColor[0], heatColor[1], heatColor[2]);
    doc.roundedRect(margin, yPos, 30, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Heat: ${heatScore}`, margin + 3, yPos + 5.5);
    yPos += 12;

    // Metrics
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Mentions: ${topic.mentionCountLastWeek}`, margin, yPos);
    doc.text(`Sentiment: ${topic.sentimentNetPercent > 0 ? '+' : ''}${topic.sentimentNetPercent}%`, margin + 60, yPos);
    doc.text(`Momentum: ${topic.momentumDelta > 0 ? '+' : ''}${topic.momentumDelta}%`, margin + 120, yPos);
    yPos += 8;

    // Legislative Section
    if (topic.bills && topic.bills.length > 0) {
      yPos += 3;
      addText('Legislative Activity:', 11, true, [88, 28, 135]);
      topic.bills.slice(0, 3).forEach((bill: any) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(`• ${bill.billId}: ${bill.title}`, margin + 5, yPos);
        yPos += 5;
      });
      yPos += 3;
    }

    // Key People
    if (topic.people && topic.people.length > 0) {
      yPos += 3;
      addText('Key People:', 11, true, [88, 28, 135]);
      topic.people.slice(0, 3).forEach((person: any) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(`• ${person.name} (${person.officeTitle})`, margin + 5, yPos);
        yPos += 5;
      });
      yPos += 3;
    }

    // Revere Strategy
    if (topic.pythiaInsights) {
      yPos += 3;
      addText('Revere Strategic Intelligence:', 11, true, [147, 51, 234]);
      
      doc.setFontSize(10);
      doc.setTextColor(147, 51, 234);
      doc.text(`Confidence: ${topic.pythiaInsights.confidence0to100}%`, margin + 5, yPos);
      yPos += 6;

      if (topic.pythiaInsights.keyPatterns && topic.pythiaInsights.keyPatterns.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        topic.pythiaInsights.keyPatterns.slice(0, 2).forEach((pattern: string) => {
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }
          const lines = doc.splitTextToSize(`• ${pattern}`, contentWidth - 10);
          lines.forEach((line: string) => {
            doc.text(line, margin + 5, yPos);
            yPos += 5;
          });
        });
      }
      
      yPos += 3;
    }

    // Divider between topics
    if (index < brief.topics.length - 1) {
      yPos += 5;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
    }
  });

  // Footer on last page
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Revere Intelligence Platform • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Download
  const fileName = `Revere-Brief-${brief.issue.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// Brief Viewer Modal
function BriefViewerModal({
  isDarkMode,
  brief,
  onClose,
  onBack,
}: {
  isDarkMode: boolean;
  brief: any;
  onClose: () => void;
  onBack: () => void;
}) {
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Generated Brief
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {brief.format === 'executive' ? 'Executive Summary' : 'Detailed Report'}
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
        <div className="p-6 space-y-6 max-h-[60vh] overflow-auto">
          {/* Issue Title */}
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {brief.issue}
            </h3>
          </div>

          {/* Topics */}
          {brief.topics.map((topic: any, idx: number) => (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 rounded-2xl border ${
                isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {topic.name}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {topic.description}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    topic.heatScore >= 80
                      ? 'bg-red-600 text-white'
                      : topic.heatScore >= 60
                      ? 'bg-orange-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}
                >
                  {topic.heatScore}
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    <MessageSquare className="w-3 h-3 text-blue-500" />
                    <span
                      className={`text-xs font-semibold ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}
                    >
                      Mentions
                    </span>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {topic.mentionCountLastWeek}
                  </div>
                </div>
                <div
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    <Scale className="w-3 h-3 text-orange-500" />
                    <span
                      className={`text-xs font-semibold ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}
                    >
                      Sentiment
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {topic.sentimentNetPercent > 0 ? (
                      <ThumbsUp className="w-3 h-3 text-green-500" />
                    ) : topic.sentimentNetPercent < 0 ? (
                      <ThumbsDown className="w-3 h-3 text-red-500" />
                    ) : (
                      <Minus className="w-3 h-3 text-gray-500" />
                    )}
                    <span
                      className={`text-sm font-bold ${
                        topic.sentimentNetPercent > 0
                          ? 'text-green-500'
                          : topic.sentimentNetPercent < 0
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}
                    >
                      {topic.sentimentNetPercent > 0 ? '+' : ''}
                      {topic.sentimentNetPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Momentum with Sparkline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {topic.momentumDelta > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      topic.momentumDelta > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {topic.momentumDelta > 0 ? '+' : ''}
                    {topic.momentumDelta}%
                  </span>
                </div>
                {/* Sparkline */}
                <div className="flex items-end gap-0.5 h-6">
                  {generateSparkline().map((val, i) => (
                    <div
                      key={i}
                      className="w-1 bg-orange-600 rounded-t"
                      style={{ height: `${(val / 80) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Legislative */}
              {topic.bills.length > 0 && (
                <div className="mt-4">
                  <div
                    className={`text-sm font-semibold mb-3 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}
                  >
                    LEGISLATIVE
                  </div>
                  <ul className="space-y-2">
                    {topic.bills.map((bill: any, idx: number) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 text-sm ${
                          isDarkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}
                      >
                        <FileText className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>{bill.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* People */}
              {topic.people.length > 0 && (
                <div className="mt-4">
                  <div
                    className={`text-sm font-semibold mb-3 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}
                  >
                    KEY PEOPLE
                  </div>
                  <ul className="space-y-2">
                    {topic.people.map((person: any, idx: number) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 text-sm ${
                          isDarkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}
                      >
                        <Users className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>{person.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Revere Strategy */}
              {topic.pythiaInsights && (
                <div className="mt-4">
                  <div
                    className={`text-sm font-semibold mb-3 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}
                  >
                    REVERE STRATEGY
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div
                        className={`text-xs font-semibold mb-1 ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}
                      >
                        CONFIDENCE
                      </div>
                      <div className="text-2xl font-bold text-purple-500">
                        {topic.pythiaInsights.confidence0to100}%
                      </div>
                    </div>
                    <div>
                      <div
                        className={`text-xs font-semibold mb-1 ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}
                      >
                        KEY PATTERNS
                      </div>
                      <ul className="space-y-2">
                        {topic.pythiaInsights.keyPatterns.map((pattern: string, idx: number) => (
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
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t ${
            isDarkMode ? 'border-white/10 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200'
              }`}
            >
              Back
            </button>
            <button
              onClick={() => downloadBriefAsPDF(brief)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              Download Brief
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}