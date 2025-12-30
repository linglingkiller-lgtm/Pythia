import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'motion/react';
import {
  MapPin,
  Activity,
  Radio,
  MessageSquare,
  Lightbulb,
  Search,
  Bookmark,
  FileDown,
  Save,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { GeoHeatMapTab } from './tabs/GeoHeatMapTab';
import { TopicsHubTab } from './tabs/TopicsHubTab';
import { NarrativesTab } from './tabs/NarrativesTab';
import { OpportunitiesTab } from './tabs/OpportunitiesTab';
import { IntelligencePanel } from './panels/IntelligencePanel';
import { SmokeTestDebugPanel } from '../debug/SmokeTestDebugPanel';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';

type TimeWindow = '7d' | '30d' | 'session';
type Issue = 'clean-energy' | 'education' | 'healthcare' | 'tech';
type ActiveTab = 'heatmap' | 'topics' | 'narratives' | 'opportunities';
type MentionType = 'news' | 'social' | 'press' | 'committee';
type Sentiment = 'pos' | 'neu' | 'neg';

export function IssuesHub() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('heatmap');
  const [selectedIssue, setSelectedIssue] = useState<Issue>('clean-energy');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [sourcesFilter, setSourcesFilter] = useState<MentionType[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment[]>([]);
  
  // Geographic selections
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  
  // Live Mode (will be implemented in Phase 7)
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  // Scroll state for header compression
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      setIsScrolled(target.scrollTop > 20);
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const getCurrentScope = () => {
    if (selectedDistrict) return { type: 'district', id: selectedDistrict };
    if (selectedCounty) return { type: 'county', id: selectedCounty };
    if (selectedState) return { type: 'state', id: selectedState };
    return { type: 'national', id: null };
  };

  const clearSelection = () => {
    setSelectedState(null);
    setSelectedCounty(null);
    setSelectedDistrict(null);
  };

  const toggleSourceFilter = (source: MentionType) => {
    setSourcesFilter(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const toggleSentimentFilter = (sentiment: Sentiment) => {
    setSentimentFilter(prev =>
      prev.includes(sentiment) ? prev.filter(s => s !== sentiment) : [...prev, sentiment]
    );
  };

  // Get Issues page theme
  const issuesTheme = getPageTheme('Issues');

  // Dynamic title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'heatmap':
        return 'Heat Map';
      case 'topics':
        return 'Topics';
      case 'narratives':
        return 'Narratives';
      case 'opportunities':
        return 'Opportunities';
      default:
        return 'Issues';
    }
  };

  // Dynamic subtitle based on active tab
  const getSubtitle = () => {
    switch (activeTab) {
      case 'heatmap':
        return 'Geographic intensity & sentiment visualization';
      case 'topics':
        return 'Trending conversations & emerging themes';
      case 'narratives':
        return 'Story arcs & messaging frameworks';
      case 'opportunities':
        return 'Strategic openings & action moments';
      default:
        return 'Intelligence & tracking';
    }
  };

  return (
    <div
      className={`h-full flex flex-col relative transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-b from-white to-gray-50'
      }`}
    >
      {/* Background Orbs - Dark Mode Only */}
      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] animate-slow-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-red-500/10 rounded-full blur-[130px] animate-slow-pulse" />
        </div>
      )}

      {/* Light Mode Gradient Overlays */}
      {!isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-orange-100/70 via-orange-50/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-red-100/60 via-red-50/40 to-transparent" />
        </div>
      )}

      {/* Header - Sticky with Glassmorphism */}
      <motion.div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-900/40 border-b border-white/[0.08]'
            : 'bg-white/40 border-b border-gray-200/50'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        animate={{
          paddingTop: isScrolled ? '12px' : '24px',
          paddingBottom: isScrolled ? '12px' : '16px',
        }}
      >
        {/* Subtle gradient accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

        <div className="px-8">
          {/* Top Header Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Issues" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(issuesTheme.gradientFrom, 0.12)}, ${hexToRgba(issuesTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(issuesTheme.gradientFrom, 0.08)}, ${hexToRgba(issuesTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(issuesTheme.accent, 0.25)
                    : hexToRgba(issuesTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(issuesTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(issuesTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(issuesTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(issuesTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <Sparkles
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? issuesTheme.glow : issuesTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: issuesTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? issuesTheme.glow : issuesTheme.accent,
                  }}
                >
                  Issues
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
                <motion.h1
                  className={`font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  animate={{
                    fontSize: isScrolled ? '20px' : '28px',
                    marginBottom: isScrolled ? '0px' : '4px',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {getPageTitle()}
                </motion.h1>
                <motion.p
                  className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}
                  animate={{
                    opacity: isScrolled ? 0 : 1,
                    height: isScrolled ? 0 : 'auto',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {getSubtitle()}
                </motion.p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                Pin
              </button>
              <button
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'bg-orange-600/90 text-white hover:bg-orange-600 border border-orange-500/30'
                    : 'bg-orange-600 text-white hover:bg-orange-700 border border-orange-700/20'
                }`}
              >
                <FileDown className="w-3.5 h-3.5" />
                Generate Brief
              </button>
              <button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isLiveMode
                    ? 'bg-red-600 text-white hover:bg-red-700 border border-red-700/30'
                    : isDarkMode
                    ? 'bg-slate-700/80 text-white hover:bg-slate-700 border border-white/10'
                    : 'bg-gray-800 text-white hover:bg-gray-900 border border-gray-700/30'
                }`}
              >
                {isLiveMode && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
                <Radio className={`w-3.5 h-3.5 ${isLiveMode ? 'animate-pulse' : ''}`} />
                {isLiveMode ? 'Exit Live' : 'Go Live'}
              </button>
            </div>
          </div>

          {/* Control Panel Row - Compact, Inline */}
          <div className="flex items-center gap-3 pb-4">
            {/* Issue Selector */}
            <div className="relative">
              <select
                value={selectedIssue}
                onChange={e => setSelectedIssue(e.target.value as Issue)}
                className={`pl-3 pr-8 py-2 rounded-lg border text-xs font-semibold transition-all appearance-none cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800/60 border-white/10 text-white hover:bg-slate-800 hover:border-orange-500/30'
                    : 'bg-white/60 border-gray-200 text-gray-900 hover:bg-white hover:border-orange-300'
                }`}
              >
                <option value="clean-energy">🌱 Clean Energy</option>
                <option value="education">📚 Education</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="tech">💻 Tech Policy</option>
              </select>
              <ChevronRight
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 rotate-90 pointer-events-none ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}
              />
            </div>

            {/* Divider */}
            <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />

            {/* Time Window Pills */}
            <div className={`flex items-center gap-1 p-0.5 rounded-lg ${isDarkMode ? 'bg-slate-800/40' : 'bg-gray-100/60'}`}>
              {(['7d', '30d', 'session'] as TimeWindow[]).map(window => (
                <button
                  key={window}
                  onClick={() => setTimeWindow(window)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    timeWindow === window
                      ? 'bg-orange-600 text-white shadow-sm'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  {window === '7d' ? '7d' : window === '30d' ? '30d' : 'Session'}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />

            {/* Geographic Filter Badge */}
            {(selectedState || selectedCounty || selectedDistrict) && (
              <>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                    isDarkMode
                      ? 'bg-orange-600/10 border-orange-500/30'
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-orange-600" />
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-900'}`}>
                    {selectedDistrict
                      ? `District ${selectedDistrict}`
                      : selectedCounty
                      ? `County ${selectedCounty}`
                      : selectedState}
                  </span>
                  <button
                    onClick={clearSelection}
                    className={`ml-0.5 p-0.5 rounded hover:bg-orange-500/20 transition-colors`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />
              </>
            )}

            {/* Source Filter Chips */}
            <div className="flex items-center gap-1">
              {(['news', 'social', 'press', 'committee'] as MentionType[]).map(source => (
                <button
                  key={source}
                  onClick={() => toggleSourceFilter(source)}
                  className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    sourcesFilter.includes(source)
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isDarkMode
                      ? 'bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-700/60 border border-white/5'
                      : 'bg-white/60 text-gray-600 hover:text-gray-900 hover:bg-white border border-gray-200'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />

            {/* Sentiment Emoji Filters */}
            <div className="flex items-center gap-1">
              {(['pos', 'neu', 'neg'] as Sentiment[]).map(sentiment => (
                <button
                  key={sentiment}
                  onClick={() => toggleSentimentFilter(sentiment)}
                  className={`px-2 py-1.5 rounded-md text-sm transition-all ${
                    sentimentFilter.includes(sentiment)
                      ? sentiment === 'pos'
                        ? 'bg-green-600 shadow-sm scale-105'
                        : sentiment === 'neg'
                        ? 'bg-red-600 shadow-sm scale-105'
                        : 'bg-gray-600 shadow-sm scale-105'
                      : isDarkMode
                      ? 'bg-slate-800/40 hover:bg-slate-700/60 border border-white/5 hover:scale-105'
                      : 'bg-white/60 hover:bg-white border border-gray-200 hover:scale-105'
                  }`}
                >
                  {sentiment === 'pos' ? '👍' : sentiment === 'neg' ? '👎' : '😐'}
                </button>
              ))}
            </div>

            {/* Search - Compact */}
            <div className="flex-1 max-w-xs ml-auto">
              <div className="relative">
                <Search
                  className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                    isDarkMode ? 'text-slate-500' : 'text-gray-400'
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`w-full pl-8 pr-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    isDarkMode
                      ? 'bg-slate-800/40 border-white/10 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-orange-500/30'
                      : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-orange-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation - Prominent Full-Width Row */}
          <motion.div
            className={`flex items-center justify-start gap-2 pb-4 border-t pt-4 ${
              isDarkMode ? 'border-white/10' : 'border-gray-200'
            }`}
            animate={{
              opacity: isScrolled ? 0.7 : 1,
            }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'heatmap'
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/20'
                  : isDarkMode
                  ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-white/10 hover:border-white/20'
                  : 'bg-white/60 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Heat Map
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'topics'
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/20'
                  : isDarkMode
                  ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-white/10 hover:border-white/20'
                  : 'bg-white/60 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              Topics
            </button>
            <button
              onClick={() => setActiveTab('narratives')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'narratives'
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/20'
                  : isDarkMode
                  ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-white/10 hover:border-white/20'
                  : 'bg-white/60 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Narratives
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'opportunities'
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/20'
                  : isDarkMode
                  ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-white/10 hover:border-white/20'
                  : 'bg-white/60 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Opportunities
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area - Two Column Layout */}
      <div className="flex-1 overflow-hidden relative z-10" ref={scrollRef}>
        <div className="h-full flex">
          {/* Left: Tab Content */}
          <div className="flex-1 overflow-auto p-8">
            {activeTab === 'heatmap' && (
              <GeoHeatMapTab
                isDarkMode={isDarkMode}
                selectedIssue={selectedIssue}
                timeWindow={timeWindow}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                selectedCounty={selectedCounty}
                setSelectedCounty={setSelectedCounty}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                clearSelection={clearSelection}
              />
            )}
            {activeTab === 'topics' && (
              <TopicsHubTab
                isDarkMode={isDarkMode}
                selectedIssue={selectedIssue}
                currentScope={getCurrentScope()}
              />
            )}
            {activeTab === 'narratives' && (
              <NarrativesTab
                isDarkMode={isDarkMode}
                selectedIssue={selectedIssue}
                currentScope={getCurrentScope()}
              />
            )}
            {activeTab === 'opportunities' && (
              <OpportunitiesTab
                isDarkMode={isDarkMode}
                selectedIssue={selectedIssue}
                currentScope={getCurrentScope()}
              />
            )}
          </div>

          {/* Right: Intelligence Panel */}
          <IntelligencePanel
            isDarkMode={isDarkMode}
            currentScope={getCurrentScope()}
            selectedIssue={selectedIssue}
            timeWindow={timeWindow}
          />
        </div>
      </div>

      {/* Debug Panel - Bottom Left */}
      <SmokeTestDebugPanel />
    </div>
  );
}