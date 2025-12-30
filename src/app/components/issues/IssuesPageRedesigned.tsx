import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  MapPin,
  Newspaper,
  Users,
  FileText,
  Sparkles,
  X,
  FileDown,
  ArrowUp,
  ArrowDown,
  User,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  Lightbulb,
  Target,
  TrendingDown,
  Radio,
  Globe,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Hash,
  Activity,
  Eye,
  Zap,
  MessageSquare,
  BarChart3,
  CheckCircle,
} from 'lucide-react';
import {
  stateScores,
  countyScores,
  stateKeywords,
  countyKeywords,
  mediaMentionsByState,
  mediaMentionsByCounty,
  repByCounty,
  revereInsightsByState,
  revereInsightsByCounty,
  topStatesByScore,
  biggestMovers,
  MediaMention,
  Representative,
} from '../../data/issuesData';

// US Atlas CDN URLs
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const countiesUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

type GeoMode = 'states' | 'counties';
type TimeWindow = '7d' | '30d' | 'session';
type Issue = 'clean-energy' | 'education' | 'healthcare' | 'tech';
type TabView = 'dashboard' | 'media' | 'heatmap' | 'sentiment';

// State center coordinates for zoom animation
const stateCenters: Record<string, [number, number]> = {
  'Alabama': [-86.9023, 32.8067],
  'Alaska': [-152.4044, 61.3707],
  'Arizona': [-111.4312, 33.7298],
  'Arkansas': [-92.3731, 34.9697],
  'California': [-119.6816, 36.1162],
  'Colorado': [-105.3111, 39.0598],
  'Connecticut': [-72.7554, 41.5978],
  'Delaware': [-75.5071, 39.3185],
  'Florida': [-81.5158, 27.7663],
  'Georgia': [-83.6431, 33.0406],
  'Hawaii': [-157.4983, 21.0943],
  'Idaho': [-114.4788, 44.2405],
  'Illinois': [-88.9861, 40.3495],
  'Indiana': [-86.2816, 39.8494],
  'Iowa': [-93.2105, 42.0115],
  'Kansas': [-96.7265, 38.5266],
  'Kentucky': [-84.6701, 37.6681],
  'Louisiana': [-91.8749, 31.1695],
  'Maine': [-69.3819, 44.6939],
  'Maryland': [-76.6413, 39.0639],
  'Massachusetts': [-71.5301, 42.2302],
  'Michigan': [-84.5361, 43.3266],
  'Minnesota': [-93.9196, 45.6945],
  'Mississippi': [-89.6787, 32.7416],
  'Missouri': [-92.2896, 38.4561],
  'Montana': [-110.4544, 46.9219],
  'Nebraska': [-98.2681, 41.1254],
  'Nevada': [-117.0554, 38.3135],
  'New Hampshire': [-71.5639, 43.4525],
  'New Jersey': [-74.5210, 40.2989],
  'New Mexico': [-106.2371, 34.8405],
  'New York': [-74.9481, 42.1657],
  'North Carolina': [-79.8064, 35.6301],
  'North Dakota': [-99.7840, 47.5289],
  'Ohio': [-82.7647, 40.3888],
  'Oklahoma': [-96.9289, 35.5653],
  'Oregon': [-122.0709, 44.5720],
  'Pennsylvania': [-77.2098, 40.5908],
  'Rhode Island': [-71.5110, 41.6809],
  'South Carolina': [-80.9066, 33.8569],
  'South Dakota': [-99.4388, 44.2998],
  'Tennessee': [-86.6923, 35.7478],
  'Texas': [-97.5631, 31.0545],
  'Utah': [-111.8910, 40.1500],
  'Vermont': [-72.7107, 44.0459],
  'Virginia': [-78.1690, 37.7693],
  'Washington': [-121.4906, 47.4009],
  'West Virginia': [-80.9545, 38.4912],
  'Wisconsin': [-89.6165, 44.2685],
  'Wyoming': [-107.3025, 42.7559],
};

const getColorForScore = (score: number | undefined, isDarkMode: boolean): string => {
  if (!score) return isDarkMode ? '#1e293b' : '#f1f5f9';

  // 6-bin color scale
  if (score >= 85) return isDarkMode ? '#c2410c' : '#ea580c';
  if (score >= 70) return isDarkMode ? '#ea580c' : '#f97316';
  if (score >= 55) return isDarkMode ? '#f97316' : '#fb923c';
  if (score >= 40) return isDarkMode ? '#fb923c' : '#fdba74';
  if (score >= 25) return isDarkMode ? '#fdba74' : '#ffedd5';
  return isDarkMode ? '#ffedd5' : '#fff7ed';
};

// Media mentions mock data
const RECENT_MEDIA = [
  {
    source: 'The Hill',
    headline: 'Senate Democrats push clean energy reform package',
    sentiment: 'neutral',
    timestamp: '2 hours ago',
    reach: '2.4M',
  },
  {
    source: 'Twitter/X',
    headline: '@SenatorGreen: "We need comprehensive clean energy reform now"',
    sentiment: 'positive',
    timestamp: '4 hours ago',
    reach: '487K',
  },
  {
    source: 'Fox News',
    headline: 'Republican leaders question clean energy timeline',
    sentiment: 'negative',
    timestamp: '6 hours ago',
    reach: '3.1M',
  },
  {
    source: 'Bloomberg',
    headline: 'Energy industry braces for major policy shift',
    sentiment: 'neutral',
    timestamp: '8 hours ago',
    reach: '1.8M',
  },
];

export function IssuesPageRedesigned() {
  const { isDarkMode } = useTheme();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [activeView, setActiveView] = useState<TabView>('dashboard');
  const [geoMode, setGeoMode] = useState<GeoMode>('states');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('30d');
  const [selectedIssue, setSelectedIssue] = useState<Issue>('clean-energy');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<{ name: string; score: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mapCenter, setMapCenter] = useState<[number, number]>([-96, 38]);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Handle scroll to hide/show header
  React.useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollY = scrollContainerRef.current.scrollTop;
      
      if (currentScrollY < 10) {
        // Always show header at the top
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide header
        setShowHeader(false);
      } else {
        // Scrolling up - show header
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  const handleClearSelection = () => {
    setSelectedState(null);
    setSelectedCounty(null);
    setGeoMode('states');
    setMapCenter([-96, 38]);
    setMapZoom(1);
  };

  const getCurrentSelection = () => {
    if (selectedCounty) return { type: 'county', id: selectedCounty };
    if (selectedState) return { type: 'state', id: selectedState };
    return { type: 'national', id: null };
  };

  const getIntelligenceData = () => {
    const selection = getCurrentSelection();

    if (selection.type === 'county' && selection.id) {
      return {
        score: countyScores[selection.id] || 0,
        keywords: countyKeywords[selection.id] || [],
        media: mediaMentionsByCounty[selection.id] || [],
        rep: repByCounty[selection.id],
        insights: revereInsightsByCounty[selection.id],
      };
    }

    if (selection.type === 'state' && selection.id) {
      return {
        score: stateScores[selection.id] || 0,
        keywords: stateKeywords[selection.id] || [],
        media: mediaMentionsByState[selection.id] || [],
        rep: undefined,
        insights: revereInsightsByState[selection.id],
      };
    }

    return {
      score: 0,
      keywords: [],
      media: [],
      rep: undefined,
      insights: undefined,
    };
  };

  const data = getIntelligenceData();

  return (
    <div
      className={`
        h-full flex flex-col relative overflow-hidden transition-colors duration-500
        ${isDarkMode 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
          : 'bg-gradient-to-b from-white to-gray-50'
        }
      `}
    >
      {/* Background Orbs - Only in dark mode */}
      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] animate-slow-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-red-500/10 rounded-full blur-[130px] animate-slow-pulse" />
        </div>
      )}

      {/* Light mode gradient overlays */}
      {!isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-orange-100/70 via-orange-50/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-red-100/60 via-red-50/40 to-transparent" />
        </div>
      )}

      {/* Main Content - Scrollable Container */}
      <div className="flex-1 overflow-auto relative z-10" ref={scrollContainerRef}>
        {/* Header - Sticky Position */}
        <motion.div
          animate={{
            y: showHeader ? 0 : -100,
            opacity: showHeader ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={`
            sticky top-0 z-50 border-b px-8 py-6 transition-all duration-500
            ${isDarkMode 
              ? 'bg-slate-900/60 backdrop-blur-xl border-white/10' 
              : 'bg-white/80 backdrop-blur-xl border-gray-200'
            }
          `}
        >
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-3">
                  <Hash className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Issues Intelligence</span>
                </div>
                <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Know When Your Issues Are Moving.
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Real-time media monitoring, geographic heat mapping, sentiment analysis, and stakeholder tracking—all powered by Revere.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap mb-6">
              <select
                value={selectedIssue}
                onChange={(e) => setSelectedIssue(e.target.value as Issue)}
                className={`
                  px-4 py-2 rounded-xl border font-medium text-sm transition-all duration-500
                  ${isDarkMode 
                    ? 'bg-slate-800/50 border-white/10 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="clean-energy">Clean Energy</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="tech">Tech Policy</option>
              </select>

              <div className="flex items-center gap-1">
                {(['7d', '30d', 'session'] as TimeWindow[]).map((window) => (
                  <button
                    key={window}
                    onClick={() => setTimeWindow(window)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                      ${timeWindow === window
                        ? 'bg-orange-600 text-white shadow-lg'
                        : isDarkMode
                          ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                          : 'bg-white hover:bg-orange-50 text-gray-700 border border-gray-200'
                      }
                    `}
                  >
                    {window === '7d' ? '7 Days' : window === '30d' ? '30 Days' : 'Session'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeView === 'dashboard'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : isDarkMode
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                      : 'bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                Issue Dashboard
              </button>
              <button
                onClick={() => setActiveView('media')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeView === 'media'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : isDarkMode
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                      : 'bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                <Radio className="w-4 h-4" />
                Media Tracking
              </button>
              <button
                onClick={() => setActiveView('heatmap')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeView === 'heatmap'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : isDarkMode
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                      : 'bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Heat Map
              </button>
              <button
                onClick={() => setActiveView('sentiment')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeView === 'sentiment'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : isDarkMode
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                      : 'bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Sentiment Analysis
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="container mx-auto max-w-7xl p-8">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <DashboardView 
                key="dashboard" 
                isDarkMode={isDarkMode}
                prefersReducedMotion={prefersReducedMotion}
              />
            )}
            {activeView === 'media' && (
              <MediaTrackingView 
                key="media" 
                isDarkMode={isDarkMode}
                prefersReducedMotion={prefersReducedMotion}
              />
            )}
            {activeView === 'heatmap' && (
              <HeatMapView
                key="heatmap"
                isDarkMode={isDarkMode}
                prefersReducedMotion={prefersReducedMotion}
                geoMode={geoMode}
                setGeoMode={setGeoMode}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                selectedCounty={selectedCounty}
                setSelectedCounty={setSelectedCounty}
                tooltipContent={tooltipContent}
                setTooltipContent={setTooltipContent}
                tooltipPosition={tooltipPosition}
                setTooltipPosition={setTooltipPosition}
                mapCenter={mapCenter}
                setMapCenter={setMapCenter}
                mapZoom={mapZoom}
                setMapZoom={setMapZoom}
                handleClearSelection={handleClearSelection}
                data={data}
              />
            )}
            {activeView === 'sentiment' && (
              <SentimentView 
                key="sentiment" 
                isDarkMode={isDarkMode}
                prefersReducedMotion={prefersReducedMotion}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Dashboard View
function DashboardView({ isDarkMode, prefersReducedMotion }: { isDarkMode: boolean; prefersReducedMotion: boolean }) {
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`p-8 rounded-[28px] backdrop-blur-xl border shadow-2xl ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white/80 border-gray-200/50'}`}>
        {/* Header Section with Taglines */}
        <div className={`mb-8 pb-6 border-b -m-8 p-8 rounded-t-[28px] ${isDarkMode ? 'bg-gradient-to-br from-orange-900/20 to-red-900/20 border-white/10' : 'bg-gradient-to-br from-orange-50/30 to-red-50/30 border-gray-200'}`}>
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Revere doesn't just track issues. It measures momentum.
            </h3>
            <p className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Real-time scoring combines media mentions, stakeholder activity, sentiment, and geographic spread.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Clean Energy Reform - Live Tracking</h3>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Comprehensive view of issue momentum, coverage, and stakeholder activity</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">MOMENTUM SCORE</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">78/100</div>
            <div className="text-xs text-orange-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +12 points this week
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">MEDIA MENTIONS</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">2,847</div>
            <div className="text-xs text-gray-600 mt-1">
              Last 7 days
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-green-700">SENTIMENT</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">+42%</div>
            <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              Majority positive
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">TOTAL REACH</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">42.8M</div>
            <div className="text-xs text-gray-600 mt-1">
              Estimated impressions
            </div>
          </motion.div>
        </div>

        {/* Trending Topics */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="mb-8"
        >
          <h4 className={`font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Hash className="w-5 h-5 text-orange-600" />
            Trending Narratives
          </h4>
          <div className="space-y-3">
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Solar energy expansion</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +34%
                </span>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                487 mentions • Driven by Sen. Johnson press conference
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Grid modernization</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  +18%
                </span>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                312 mentions • Infrastructure bill discussion
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cost concerns</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                  <TrendingDown className="w-3 h-3 inline mr-1" />
                  -8%
                </span>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                189 mentions • Opposition talking points fading
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revere Momentum Alert */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Revere Momentum Alert</h4>
              <div className="text-sm text-gray-700 mb-4">
                <strong>Narrative Shift Detected:</strong> "Solar energy expansion" jumped 34% in the last 24 hours. Senator Johnson's press conference drove 487 new mentions across major outlets. Momentum is accelerating.
              </div>
              <div className="text-sm text-gray-700 mb-4 space-y-1">
                <div><strong>Recommended Actions:</strong></div>
                <div>• Brief your allied legislators on coordinated messaging</div>
                <div>• Prep stakeholder talking points before opposition responds</div>
                <div>• Schedule media hits within 48 hours to ride momentum</div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                View Full Analysis
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Media Tracking View
function MediaTrackingView({ isDarkMode, prefersReducedMotion }: { isDarkMode: boolean; prefersReducedMotion: boolean }) {
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`p-8 rounded-[28px] backdrop-blur-xl border shadow-2xl ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white/80 border-gray-200/50'}`}>
        {/* Header Section */}
        <div className={`mb-8 pb-6 border-b -m-8 p-8 rounded-t-[28px] ${isDarkMode ? 'bg-gradient-to-br from-orange-900/20 to-red-900/20 border-white/10' : 'bg-gradient-to-br from-orange-50/30 to-red-50/30 border-gray-200'}`}>
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Revere doesn't just scan headlines. It reads the entire narrative.
            </h3>
            <p className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Real-time monitoring across news, social media, blogs, and press releases—with sentiment scoring.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Real-Time Media Monitoring</h3>
            <div className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live
            </div>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Tracking mentions across news, social media, blogs, and press releases</p>
        </div>

        {/* Media Source Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
          >
            <Newspaper className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1,247</div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>News Articles</div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
          >
            <MessageSquare className="w-6 h-6 text-sky-600 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1,092</div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Social Posts</div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
          >
            <Radio className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>342</div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Broadcast</div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
          >
            <Globe className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>166</div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Blogs & Opinion</div>
          </motion.div>
        </div>

        {/* Recent Mentions Feed */}
        <div className="mb-6">
          <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Mentions</h4>
          <div className="space-y-3">
            {RECENT_MEDIA.map((mention, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 + index * 0.1 }}
                className={`p-4 rounded-xl border hover:border-orange-300 hover:shadow-lg transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{mention.source}</span>
                      <span className={`text-xs ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>•</span>
                      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{mention.timestamp}</span>
                    </div>
                    <div className={`text-sm mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{mention.headline}</div>
                    <div className={`flex items-center gap-3 text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {mention.reach} reach
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    mention.sentiment === 'positive' 
                      ? 'bg-green-100 text-green-700'
                      : mention.sentiment === 'negative'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {mention.sentiment === 'positive' && <ThumbsUp className="w-3 h-3 inline mr-1" />}
                    {mention.sentiment === 'negative' && <ThumbsDown className="w-3 h-3 inline mr-1" />}
                    {mention.sentiment.toUpperCase()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alert Configuration */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
          className="p-4 rounded-xl bg-blue-50 border border-blue-200"
        >
          <div className="flex items-center gap-2 text-sm text-blue-900">
            <Zap className="w-4 h-4" />
            <span><strong>Custom Alerts Active:</strong> Email + Slack notifications for spikes &gt;20%, negative sentiment from major outlets, mentions by key legislators</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Heat Map View
function HeatMapView({
  isDarkMode,
  prefersReducedMotion,
  geoMode,
  setGeoMode,
  selectedState,
  setSelectedState,
  selectedCounty,
  setSelectedCounty,
  tooltipContent,
  setTooltipContent,
  tooltipPosition,
  setTooltipPosition,
  mapCenter,
  setMapCenter,
  mapZoom,
  setMapZoom,
  handleClearSelection,
  data,
}: any) {
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`p-8 rounded-[28px] backdrop-blur-xl border shadow-2xl ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white/80 border-gray-200/50'}`}
    >
      {/* Header Section */}
      <div className={`mb-8 pb-6 border-b -m-8 p-8 rounded-t-[28px] ${isDarkMode ? 'bg-gradient-to-br from-orange-900/20 to-red-900/20 border-white/10' : 'bg-gradient-to-br from-orange-50/30 to-red-50/30 border-gray-200'}`}>
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Revere doesn't just monitor nationwide. It pinpoints where to act.
          </h3>
          <p className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Real-time state-level heat mapping shows momentum, identifies opportunities, and guides resource deployment—strategically.
          </p>
        </div>
      </div>

      {/* Controls and Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Geographic Intelligence</h3>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <button
              onClick={() => {
                handleClearSelection();
                setMapCenter([-96, 38]);
                setMapZoom(1);
              }}
              className={`transition-colors duration-300 ${
                selectedState || selectedCounty
                  ? isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  : isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              U.S.
            </button>
            {selectedState && (
              <>
                <span className={isDarkMode ? 'text-slate-600' : 'text-gray-400'}>/</span>
                <button
                  onClick={() => {
                    setSelectedCounty(null);
                    setGeoMode('states');
                    if (selectedState) {
                      const center = stateCenters[selectedState];
                      if (center) {
                        setMapCenter(center);
                        setMapZoom(4);
                      }
                    }
                  }}
                  className={`transition-colors duration-300 ${
                    selectedCounty
                      ? isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      : isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {selectedState}
                </button>
              </>
            )}
            {selectedCounty && (
              <>
                <span className={isDarkMode ? 'text-slate-600' : 'text-gray-400'}>/</span>
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>County {selectedCounty}</span>
              </>
            )}
          </div>
        </div>

        {(selectedState || selectedCounty) && (
          <button
            onClick={() => {
              handleClearSelection();
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white"
          >
            <X size={16} />
            Clear Selection
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="mb-6 flex items-center gap-3">
        <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Low Activity</span>
        {[0, 25, 40, 55, 70, 85].map((threshold) => (
          <div
            key={threshold}
            className="w-10 h-4 rounded"
            style={{ backgroundColor: getColorForScore(threshold + 1, isDarkMode) }}
          />
        ))}
        <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>High Activity</span>
      </div>

      {/* Interactive US Heat Map */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="mb-8 overflow-hidden rounded-2xl border"
        style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc' }}
      >
        <div className="relative" style={{ height: '600px' }}>
          <motion.div
            className="w-full h-full flex items-center justify-center"
            animate={{
              scale: mapZoom,
            }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{ transformOrigin: 'center center' }}
          >
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{
                scale: 1300,
              }}
              width={1400}
              height={600}
              className="w-full h-full"
            >
              <Geographies geography={geoMode === 'counties' ? countiesUrl : geoUrl}>
                {({ geographies }) =>
                  geographies
                    .filter((geo) => {
                      if (geoMode === 'counties' && selectedState) {
                        const stateFipsMap: Record<string, string> = {
                          'Alabama': '01', 'Alaska': '02', 'Arizona': '04', 'Arkansas': '05',
                          'California': '06', 'Colorado': '08', 'Connecticut': '09', 'Delaware': '10',
                          'Florida': '12', 'Georgia': '13', 'Hawaii': '15', 'Idaho': '16',
                          'Illinois': '17', 'Indiana': '18', 'Iowa': '19', 'Kansas': '20',
                          'Kentucky': '21', 'Louisiana': '22', 'Maine': '23', 'Maryland': '24',
                          'Massachusetts': '25', 'Michigan': '26', 'Minnesota': '27', 'Mississippi': '28',
                          'Missouri': '29', 'Montana': '30', 'Nebraska': '31', 'Nevada': '32',
                          'New Hampshire': '33', 'New Jersey': '34', 'New Mexico': '35', 'New York': '36',
                          'North Carolina': '37', 'North Dakota': '38', 'Ohio': '39', 'Oklahoma': '40',
                          'Oregon': '41', 'Pennsylvania': '42', 'Rhode Island': '44', 'South Carolina': '45',
                          'South Dakota': '46', 'Tennessee': '47', 'Texas': '48', 'Utah': '49',
                          'Vermont': '50', 'Virginia': '51', 'Washington': '53', 'West Virginia': '54',
                          'Wisconsin': '55', 'Wyoming': '56'
                        };
                        const stateFips = stateFipsMap[selectedState];
                        if (!stateFips) return false;
                        const countyId = geo.id?.toString() || '';
                        return countyId.startsWith(stateFips);
                      }
                      return true;
                    })
                    .map((geo) => {
                      const isState = geoMode === 'states';
                      const stateId = isState ? geo.properties.name : null;
                      const countyFips = !isState ? geo.id : null;
                      const score = isState ? stateScores[stateId as string] : countyScores[countyFips as string];

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getColorForScore(score, isDarkMode)}
                          stroke={isDarkMode ? '#1e293b' : '#e2e8f0'}
                          strokeWidth={0.5}
                          style={{
                            default: { outline: 'none' },
                            hover: { outline: 'none', fill: '#f97316', cursor: 'pointer' },
                            pressed: { outline: 'none' },
                          }}
                          onMouseEnter={(e) => {
                            const name = isState ? stateId : `County ${countyFips}`;
                            setTooltipContent({ name: name as string, score: score || 0 });
                            setTooltipPosition({ x: e.clientX, y: e.clientY });
                          }}
                          onMouseLeave={() => {
                            setTooltipContent(null);
                          }}
                          onClick={() => {
                            if (isState && stateId) {
                              setSelectedState(stateId);
                              setGeoMode('counties');
                              const center = stateCenters[stateId];
                              if (center) {
                                setMapCenter(center);
                                setMapZoom(4);
                              }
                            } else if (countyFips) {
                              setSelectedCounty(countyFips.toString());
                              setMapZoom(6);
                            }
                          }}
                        />
                      );
                    })
                }
              </Geographies>
            </ComposableMap>
          </motion.div>

          {/* Tooltip */}
          <AnimatePresence>
            {tooltipContent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  left: tooltipPosition.x + 10,
                  top: tooltipPosition.y + 10,
                  pointerEvents: 'none',
                }}
                className={`fixed z-50 px-3 py-2 rounded-lg shadow-xl text-sm font-medium border ${
                  isDarkMode 
                    ? 'bg-slate-800 border-white/10 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <div className="font-semibold">{tooltipContent.name}</div>
                <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                  Score: {tooltipContent.score}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Key Insights Grid */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs font-bold text-green-700">STRONGEST MOMENTUM</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">California</div>
          <div className="text-sm text-gray-700 mb-3">92% activity • 847 mentions</div>
          <div className="text-xs text-gray-600 leading-relaxed">
            Strong grassroots support in major metros. Clean energy providers driving positive coverage.
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-bold text-orange-700">OPPORTUNITY ZONE</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">Pennsylvania</div>
          <div className="text-sm text-gray-700 mb-3">68% activity • 489 mentions</div>
          <div className="text-xs text-gray-600 leading-relaxed">
            Moderate positive sentiment in key metros. Deploy field teams to swing districts for maximum impact.
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-xs font-bold text-red-700">NEEDS ATTENTION</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">Texas</div>
          <div className="text-sm text-gray-700 mb-3">78% activity • 621 mentions</div>
          <div className="text-xs text-gray-600 leading-relaxed">
            Conservative media pushing cost concerns. Deploy economic impact studies to counter narratives.
          </div>
        </div>
      </motion.div>

      {/* Top States Leaderboard */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className={`rounded-2xl p-8 border ${isDarkMode ? 'bg-slate-800/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Top 10 States by Activity</h4>
        </div>
        
        <div className="space-y-3">
          {topStatesByScore.slice(0, 10).map((state, index) => (
            <div
              key={state.state}
              className={`group p-4 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'bg-slate-900/40 border-white/10 hover:bg-orange-900/20 hover:border-orange-500/30' 
                  : 'bg-white border-gray-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                  index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400' :
                  'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}>
                  #{index + 1}
                </div>

                {/* State Info */}
                <div className="flex-1">
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{state.state}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {state.score} mentions
                  </div>
                </div>

                {/* Activity Score */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{state.score}</div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>SCORE</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Sentiment View
function SentimentView({ isDarkMode, prefersReducedMotion }: { isDarkMode: boolean; prefersReducedMotion: boolean }) {
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`p-8 rounded-[28px] backdrop-blur-xl border shadow-2xl ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white/80 border-gray-200/50'}`}>
        <div className="text-center py-20">
          <MessageSquare size={64} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-300'}`} />
          <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Sentiment Analysis
          </h3>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Detailed sentiment breakdown coming soon
          </p>
        </div>
      </div>
    </motion.div>
  );
}