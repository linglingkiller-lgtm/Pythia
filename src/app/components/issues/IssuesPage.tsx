import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
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
  ChevronLeft,
  X,
  Pin,
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
  Maximize2,
  Minimize2,
  Map,
  Search,
  LayoutGrid,
} from 'lucide-react';
import {
  stateScores,
  countyScores,
  districtScores,
  stateKeywords,
  countyKeywords,
  districtKeywords,
  mediaMentionsByState,
  mediaMentionsByCounty,
  mediaMentionsByDistrict,
  repByCounty,
  repByDistrict,
  repsByCounty,
  revereInsightsByState,
  revereInsightsByCounty,
  revereInsightsByDistrict,
  topStatesByScore,
  biggestMovers,
  MediaMention,
  Representative,
} from '../../data/issuesData';

// US Atlas CDN URLs
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const countiesUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

type GeoMode = 'states' | 'counties' | 'districts';
type TimeWindow = '7d' | '30d' | 'session';
type Issue = 'clean-energy' | 'education' | 'healthcare' | 'tech';
type TabType = 'overview' | 'media' | 'people' | 'bills' | 'insights';

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

const getTierLabel = (score: number): { label: string; color: string } => {
  if (score >= 70) return { label: 'Hot', color: 'text-green-500' };
  if (score >= 40) return { label: 'Warm', color: 'text-yellow-500' };
  return { label: 'Cold', color: 'text-slate-400' };
};

export function IssuesPage() {
  const { isDarkMode } = useTheme();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [geoMode, setGeoMode] = React.useState<GeoMode>('states');
  const [timeWindow, setTimeWindow] = React.useState<TimeWindow>('30d');
  const [selectedIssue, setSelectedIssue] = React.useState<Issue>('clean-energy');
  const [selectedState, setSelectedState] = React.useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = React.useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<TabType>('overview');
  const [tooltipContent, setTooltipContent] = React.useState<{ name: string; score: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([-96, 38]);
  const [mapZoom, setMapZoom] = React.useState<number>(1);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleClearSelection = () => {
    setSelectedState(null);
    setSelectedCounty(null);
    setSelectedDistrict(null);
    setGeoMode('states');
    setActiveTab('overview');
  };

  const handleBreadcrumbClick = (level: 'us' | 'state') => {
    if (level === 'us') {
      handleClearSelection();
    } else if (level === 'state') {
      setSelectedCounty(null);
      setSelectedDistrict(null);
      setGeoMode('states');
      setActiveTab('overview');
    }
  };

  const getCurrentSelection = () => {
    if (selectedDistrict) return { type: 'district', id: selectedDistrict };
    if (selectedCounty) return { type: 'county', id: selectedCounty };
    if (selectedState) return { type: 'state', id: selectedState };
    return { type: 'national', id: null };
  };

  const getIntelligenceData = () => {
    const selection = getCurrentSelection();

    if (selection.type === 'district' && selection.id) {
      return {
        score: districtScores[selection.id] || 0,
        keywords: districtKeywords[selection.id] || [],
        media: mediaMentionsByDistrict[selection.id] || [],
        rep: repByDistrict[selection.id],
        reps: undefined, // Districts use single rep for now
        insights: revereInsightsByDistrict[selection.id],
      };
    }

    if (selection.type === 'county' && selection.id) {
      return {
        score: countyScores[selection.id] || 0,
        keywords: countyKeywords[selection.id] || [],
        media: mediaMentionsByCounty[selection.id] || [],
        rep: undefined, // For backwards compatibility, but we'll use reps instead
        reps: repsByCounty[selection.id], // Multiple officials
        insights: revereInsightsByCounty[selection.id],
      };
    }

    if (selection.type === 'state' && selection.id) {
      return {
        score: stateScores[selection.id] || 0,
        keywords: stateKeywords[selection.id] || [],
        media: mediaMentionsByState[selection.id] || [],
        rep: undefined,
        reps: undefined,
        insights: revereInsightsByState[selection.id],
      };
    }

    return {
      score: 0,
      keywords: [],
      media: [],
      rep: undefined,
      reps: undefined,
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
          : 'bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30'
        }
      `}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Header */}
      <div
        className={`
          sticky top-0 z-30 border-b transition-colors duration-500
          ${isDarkMode 
            ? 'bg-slate-900/95 backdrop-blur-xl border-white/10' 
            : 'bg-white/95 backdrop-blur-xl border-gray-200'
          }
        `}
      >
        <div className="px-8 py-5">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-6">
            <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Issues</h1>
            
            <div className="flex items-center gap-3">
              {/* Issue Selector */}
              <select
                value={selectedIssue}
                onChange={(e) => setSelectedIssue(e.target.value as Issue)}
                className={`
                  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium
                  ${isDarkMode 
                    ? 'bg-slate-800/80 border-white/10 text-white hover:bg-slate-800' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <option value="clean-energy">Clean Energy</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="tech">Tech Policy</option>
              </select>

              {/* Demo Data Badge */}
              <span
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold border
                  ${isDarkMode 
                    ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                  }
                `}
              >
                Demo Data
              </span>

              {/* Clear Selection Button */}
              {(selectedState || selectedCounty || selectedDistrict) && (
                <button
                  onClick={() => {
                    handleClearSelection();
                    setMapCenter([-96, 38]);
                    setMapZoom(1);
                  }}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2
                    ${isDarkMode 
                      ? 'bg-white/10 hover:bg-white/15 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }
                  `}
                >
                  <X size={16} />
                  Clear Selection
                </button>
              )}

              {/* Generate Brief Button */}
              <button
                className={`
                  px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2
                  ${isDarkMode 
                    ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20' 
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20'
                  }
                `}
              >
                <FileDown size={16} />
                Generate Brief
              </button>
            </div>
          </div>

          {/* Tabs + Filters Row */}
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex gap-1">
              {([
                { id: 'overview' as TabType, label: 'Overview', icon: <LayoutGrid size={16} /> },
                { id: 'media' as TabType, label: 'Media', icon: <Newspaper size={16} /> },
                { id: 'people' as TabType, label: 'People', icon: <Users size={16} /> },
                { id: 'bills' as TabType, label: 'Bills', icon: <FileText size={16} /> },
                { id: 'insights' as TabType, label: 'Revere', icon: <Sparkles size={16} /> },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all rounded-lg
                    ${activeTab === tab.id 
                      ? isDarkMode 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-orange-600 text-white'
                      : isDarkMode 
                        ? 'text-slate-400 hover:text-white hover:bg-white/5' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              {/* Time Window Filter */}
              <div className="flex items-center gap-1">
                {(['7d', '30d', 'session'] as TimeWindow[]).map((window) => (
                  <button
                    key={window}
                    onClick={() => setTimeWindow(window)}
                    className={`
                      px-3 py-1.5 text-xs font-semibold rounded-md transition-all
                      ${timeWindow === window
                        ? isDarkMode
                          ? 'bg-slate-700 text-white border border-white/20'
                          : 'bg-gray-200 text-gray-900 border border-gray-300'
                        : isDarkMode
                          ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-white/5'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }
                    `}
                  >
                    {window === '7d' ? '7 Days' : window === '30d' ? '30 Days' : 'Session'}
                  </button>
                ))}
              </div>

              {/* Geo Mode Filter */}
              <div className="flex items-center gap-1">
                {(['states', 'counties', 'districts'] as GeoMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setGeoMode(mode)}
                    disabled={mode === 'districts'}
                    className={`
                      px-3 py-1.5 text-xs font-semibold rounded-md transition-all
                      ${geoMode === mode
                        ? isDarkMode
                          ? 'bg-slate-700 text-white border border-white/20'
                          : 'bg-gray-200 text-gray-900 border border-gray-300'
                        : isDarkMode
                          ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed'
                      }
                    `}
                    title={mode === 'districts' ? 'District boundaries dataset not installed' : ''}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search region..."
                  className={`
                    pl-9 pr-4 py-1.5 border rounded-md font-medium text-xs transition-all focus:outline-none focus:ring-2 focus:ring-orange-500
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-white/10 text-white placeholder-slate-500' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                    }
                  `}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-8 overflow-hidden relative z-10">
        {/* Map Card - Larger to fit full US map */}
        <div className="flex-[2] flex flex-col">
          <div
            className={`
              flex-1 rounded-2xl border shadow-xl backdrop-blur-xl overflow-hidden transition-all duration-500 flex flex-col
              ${isDarkMode 
                ? 'bg-slate-900/60 border-white/10' 
                : 'bg-white/80 border-gray-200/50'
              }
            `}
          >
            <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    className={`
                      text-2xl font-bold mb-1 transition-colors duration-500
                      ${isDarkMode ? 'text-white' : 'text-gray-900'}
                    `}
                  >
                    Issue Heat Map
                  </h2>
                  <p
                    className={`
                      text-sm transition-colors duration-500
                      ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}
                    `}
                  >
                    Media intensity + narrative shifts by geography
                  </p>
                </div>

                {(selectedState || selectedCounty || selectedDistrict) && (
                  <button
                    onClick={() => {
                      handleClearSelection();
                      setMapCenter([-96, 38]);
                      setMapZoom(1);
                    }}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2
                      ${isDarkMode 
                        ? 'bg-white/10 hover:bg-white/15 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }
                    `}
                  >
                    <X size={16} />
                    Clear Selection
                  </button>
                )}
              </div>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm font-medium">
                <button
                  onClick={() => {
                    handleBreadcrumbClick('us');
                    setMapCenter([-96, 38]);
                    setMapZoom(1);
                  }}
                  className={`
                    transition-colors duration-300
                    ${selectedState || selectedCounty || selectedDistrict
                      ? isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      : isDarkMode ? 'text-white' : 'text-gray-900'
                    }
                  `}
                >
                  U.S.
                </button>
                {selectedState && (
                  <>
                    <span className={isDarkMode ? 'text-slate-600' : 'text-gray-400'}>/</span>
                    <button
                      onClick={() => {
                        handleBreadcrumbClick('state');
                        if (selectedState) {
                          const center = stateCenters[selectedState];
                          if (center) {
                            setMapCenter(center);
                            setMapZoom(4);
                          }
                        }
                      }}
                      className={`
                        transition-colors duration-300
                        ${selectedCounty || selectedDistrict
                          ? isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                          : isDarkMode ? 'text-white' : 'text-gray-900'
                        }
                      `}
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
                {selectedDistrict && (
                  <>
                    <span className={isDarkMode ? 'text-slate-600' : 'text-gray-400'}>/</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>District {selectedDistrict}</span>
                  </>
                )}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-2">
                <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Low
                </span>
                {[0, 25, 40, 55, 70, 85].map((threshold) => (
                  <div
                    key={threshold}
                    className="w-8 h-4 rounded"
                    style={{ backgroundColor: getColorForScore(threshold + 1, isDarkMode) }}
                  />
                ))}
                <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  High
                </span>
              </div>
            </div>

            {/* Map - Larger with scroll and zoom animation */}
            <div className="flex-1 relative min-h-[700px] overflow-auto">
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
                  height={800}
                  className="w-full h-full"
                >
                  <Geographies geography={geoMode === 'counties' ? countiesUrl : geoUrl}>
                  {({ geographies }) =>
                    geographies
                      .filter((geo) => {
                        // When viewing counties and a state is selected, filter to that state's counties
                        if (geoMode === 'counties' && selectedState) {
                          // Get the state FIPS code (first 2 digits of county FIPS)
                          const stateAbbrev = selectedState;
                          // Map state abbreviations to FIPS codes
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
                          
                          const stateFips = stateFipsMap[stateAbbrev];
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
                              hover: { outline: 'none', fill: isDarkMode ? '#fb923c' : '#f97316', cursor: 'pointer' },
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
                                setActiveTab('overview');
                                
                                // Animate zoom to state center
                                const center = stateCenters[stateId];
                                if (center) {
                                  setMapCenter(center);
                                  setMapZoom(4);
                                }
                              } else if (countyFips) {
                                setSelectedCounty(countyFips.toString());
                                setActiveTab('overview');
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
                    className={`
                      fixed z-50 px-3 py-2 rounded-lg shadow-xl text-sm font-medium border
                      ${isDarkMode 
                        ? 'bg-slate-800 border-white/10 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                      }
                    `}
                  >
                    <div className="font-semibold">{tooltipContent.name}</div>
                    <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                      Score: {tooltipContent.score}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Intelligence Panel */}
        <div className="w-[480px] flex flex-col">
          <div
            className={`
              flex-1 rounded-2xl border shadow-xl backdrop-blur-xl overflow-hidden flex flex-col transition-all duration-500
              ${isDarkMode 
                ? 'bg-slate-900/60 border-white/10' 
                : 'bg-white/80 border-gray-200/50'
              }
            `}
          >
            {/* Panel Header */}
            <div className={`p-6 border-b flex-shrink-0 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <h2
                className={`
                  text-xl font-bold mb-4 transition-colors duration-500
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}
                `}
              >
                Intelligence Panel
              </h2>

              {/* Actions */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  className={`
                    flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2
                    ${isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }
                  `}
                >
                  <FileDown size={16} />
                  Generate Brief
                </button>
                <button
                  className={`
                    px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2
                    ${isDarkMode 
                      ? 'bg-white/10 hover:bg-white/15 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }
                  `}
                >
                  <Pin size={16} />
                  Pin Region
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1">
                {([
                  { key: 'overview', label: 'Overview', icon: MapPin },
                  { key: 'media', label: 'Media', icon: Newspaper },
                  { key: 'people', label: 'People', icon: Users },
                  { key: 'bills', label: 'Bills', icon: FileText },
                  { key: 'insights', label: 'Revere', icon: Sparkles },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5
                      ${activeTab === tab.key
                        ? isDarkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : isDarkMode
                          ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }
                    `}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <OverviewTab
                  selection={getCurrentSelection()}
                  score={data.score}
                  keywords={data.keywords}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'media' && (
                <MediaTab media={data.media} isDarkMode={isDarkMode} />
              )}

              {activeTab === 'people' && (
                <PeopleTab rep={data.rep} reps={data.reps} isDarkMode={isDarkMode} />
              )}

              {activeTab === 'bills' && (
                <BillsTab isDarkMode={isDarkMode} />
              )}

              {activeTab === 'insights' && (
                <InsightsTab insights={data.insights} isDarkMode={isDarkMode} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({
  selection,
  score,
  keywords,
  isDarkMode,
}: {
  selection: { type: string; id: string | null };
  score: number;
  keywords: string[];
  isDarkMode: boolean;
}) {
  if (selection.type === 'national') {
    return (
      <div>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Select a state to view issue intelligence
        </p>

        <div className="mb-6">
          <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Top 5 States by Score
          </h3>
          <div className="space-y-2">
            {topStatesByScore.map((item, idx) => (
              <div
                key={item.state}
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    #{idx + 1}
                  </span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.state}
                  </span>
                </div>
                <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Biggest Movers (30d)
          </h3>
          <div className="space-y-2">
            {biggestMovers.map((mover) => (
              <div
                key={mover.state}
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}
                `}
              >
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {mover.state}
                </span>
                <div className="flex items-center gap-2">
                  {mover.change > 0 ? (
                    <ArrowUp size={16} className="text-green-500" />
                  ) : (
                    <ArrowDown size={16} className="text-red-500" />
                  )}
                  <span
                    className={`font-bold ${mover.change > 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {mover.change > 0 ? '+' : ''}
                    {mover.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`
          p-4 rounded-lg mb-6
          ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Media Intensity Score
          </span>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-500">+8 (30d)</span>
          </div>
        </div>
        <div className="text-4xl font-bold mb-1" style={{ color: getColorForScore(score, isDarkMode) }}>
          {score}
        </div>
        <div className={`text-xs ${getTierLabel(score).color}`}>
          {getTierLabel(score).label} Relationship
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="mb-6">
          <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Top Narratives
          </h3>
          <div className="space-y-2">
            {keywords.map((keyword, idx) => (
              <div
                key={idx}
                className={`
                  flex items-start gap-2 p-3 rounded-lg
                  ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}
                `}
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {keyword}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MediaTab({ media, isDarkMode }: { media: MediaMention[]; isDarkMode: boolean }) {
  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (sentiment === 'negative') return isDarkMode ? 'text-red-400' : 'text-red-600';
    return isDarkMode ? 'text-slate-400' : 'text-gray-600';
  };

  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <Newspaper size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-300'}`} />
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          No media mentions available for this selection
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {media.map((mention, idx) => (
        <div
          key={idx}
          className={`
            p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]
            ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}
          `}
        >
          <div className="flex items-start justify-between mb-2">
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {mention.source}
            </span>
            <span
              className={`
                px-2 py-0.5 rounded-full text-xs font-medium capitalize
                ${getSentimentColor(mention.sentiment)}
              `}
            >
              {mention.sentiment}
            </span>
          </div>
          <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {mention.title}
          </h4>
          <p className={`text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {mention.snippet}
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
              {mention.date}
            </span>
            <button
              className={`
                text-xs font-medium transition-colors duration-300
                ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}
              `}
            >
              Read More →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PeopleTab({ rep, reps, isDarkMode }: { rep?: Representative; reps?: Representative[]; isDarkMode: boolean }) {
  if (!rep && (!reps || reps.length === 0)) {
    return (
      <div className="text-center py-12">
        <Users size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-300'}`} />
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          No representative data available for this selection
        </p>
      </div>
    );
  }

  const getPartyColor = (party: string) => {
    if (party === 'R') return 'bg-red-500';
    if (party === 'D') return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const tier = rep?.relationshipMeter ? getTierLabel(rep.relationshipMeter.score) : null;

  return (
    <div>
      {rep && !reps && (
        <div
          className={`
            p-4 rounded-lg mb-6 border
            ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}
          `}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {rep.name}
                </h3>
                <span className={`w-2 h-2 rounded-full ${getPartyColor(rep.party)}`} />
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {rep.officeTitle}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Mail size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-600'} />
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {rep.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-600'} />
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {rep.phone}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Briefcase size={14} className={`mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
              <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {rep.committees.join(', ')}
              </div>
            </div>
          </div>

          {rep.relationshipMeter && tier && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Relationship Meter
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${tier.color}`}>
                    {rep.relationshipMeter.score}
                  </span>
                  <span className={`text-xs font-medium ${tier.color}`}>
                    {tier.label}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Recency', value: rep.relationshipMeter.recency, max: 30 },
                  { label: 'Frequency', value: rep.relationshipMeter.frequency, max: 20 },
                  { label: 'Responsiveness', value: rep.relationshipMeter.responsiveness, max: 15 },
                  { label: 'Issue Alignment', value: rep.relationshipMeter.issueAlignment, max: 15 },
                  { label: 'Strategic Relevance', value: rep.relationshipMeter.strategicRelevance, max: 20 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.value}/{item.max}
                      </span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                        style={{ width: `${(item.value / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              className={`
                flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                ${isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              View Profile
            </button>
            <button
              className={`
                flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                ${isDarkMode 
                  ? 'bg-white/10 hover:bg-white/15 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
            >
              Email
            </button>
          </div>
        </div>
      )}

      {reps && reps.length > 0 && (
        <div className="space-y-4">
          <div className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Showing {reps.length} official{reps.length !== 1 ? 's' : ''}
          </div>
          
          {reps.map((currentRep, idx) => {
            const currentTier = currentRep.relationshipMeter ? getTierLabel(currentRep.relationshipMeter.score) : null;
            
            return (
              <div
                key={idx}
                className={`
                  p-4 rounded-lg border transition-all duration-300 hover:scale-[1.01]
                  ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {currentRep.name}
                      </h3>
                      <span className={`w-2 h-2 rounded-full ${getPartyColor(currentRep.party)}`} />
                    </div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {currentRep.officeTitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-600'} />
                    <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentRep.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-600'} />
                    <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentRep.phone}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Briefcase size={14} className={`mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                    <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentRep.committees.join(', ')}
                    </div>
                  </div>
                </div>

                {currentRep.relationshipMeter && currentTier && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        Relationship Meter
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${currentTier.color}`}>
                          {currentRep.relationshipMeter.score}
                        </span>
                        <span className={`text-xs font-medium ${currentTier.color}`}>
                          {currentTier.label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { label: 'Recency', value: currentRep.relationshipMeter.recency, max: 30 },
                        { label: 'Frequency', value: currentRep.relationshipMeter.frequency, max: 20 },
                        { label: 'Responsiveness', value: currentRep.relationshipMeter.responsiveness, max: 15 },
                        { label: 'Issue Alignment', value: currentRep.relationshipMeter.issueAlignment, max: 15 },
                        { label: 'Strategic Relevance', value: currentRep.relationshipMeter.strategicRelevance, max: 20 },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {item.label}
                            </span>
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {item.value}/{item.max}
                            </span>
                          </div>
                          <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                              style={{ width: `${(item.value / item.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    className={`
                      flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                      ${isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }
                    `}
                  >
                    View Profile
                  </button>
                  <button
                    className={`
                      flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                      ${isDarkMode 
                        ? 'bg-white/10 hover:bg-white/15 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }
                    `}
                  >
                    Email
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BillsTab({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="text-center py-12">
      <FileText size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-300'}`} />
      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
        Bills trending in this region (coming soon)
      </p>
    </div>
  );
}

function InsightsTab({ insights, isDarkMode }: { insights?: any; isDarkMode: boolean }) {
  if (!insights) {
    return (
      <div className="text-center py-12">
        <Sparkles size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-300'}`} />
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Select a region to view Revere insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Narrative Shift
        </h3>
        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {insights.narrativeShift}
        </p>
      </div>

      <div>
        <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          <Target size={14} />
          Key Patterns
        </h3>
        <div className="space-y-2">
          {insights.keyPatterns.map((pattern: string, idx: number) => (
            <div
              key={idx}
              className={`
                flex items-start gap-2 p-3 rounded-lg
                ${isDarkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}
              `}
            >
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {pattern}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          <AlertCircle size={14} />
          Risk Flags
        </h3>
        <div className="space-y-2">
          {insights.riskFlags.map((flag: string, idx: number) => (
            <div
              key={idx}
              className={`
                flex items-start gap-2 p-3 rounded-lg
                ${isDarkMode ? 'bg-red-900/20 border border-red-500/20' : 'bg-red-50 border border-red-200'}
              `}
            >
              <AlertCircle size={14} className={`mt-0.5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {flag}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          <Lightbulb size={14} />
          Recommended Actions
        </h3>
        <div className="space-y-2">
          {insights.recommendedActions.map((action: string, idx: number) => (
            <div
              key={idx}
              className={`
                flex items-start gap-2 p-3 rounded-lg
                ${isDarkMode ? 'bg-green-900/20 border border-green-500/20' : 'bg-green-50 border border-green-200'}
              `}
            >
              <Lightbulb size={14} className={`mt-0.5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {action}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`
          p-3 rounded-lg border
          ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Confidence Score
          </span>
          <span className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {insights.confidence}%
          </span>
        </div>
      </div>
    </div>
  );
}