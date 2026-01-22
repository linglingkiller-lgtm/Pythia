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
import { PageLayout } from '../ui/PageLayout';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';

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
        reps: undefined, 
        insights: revereInsightsByDistrict[selection.id],
      };
    }

    if (selection.type === 'county' && selection.id) {
      return {
        score: countyScores[selection.id] || 0,
        keywords: countyKeywords[selection.id] || [],
        media: mediaMentionsByCounty[selection.id] || [],
        rep: undefined, 
        reps: repsByCounty[selection.id], 
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
  const issuesTheme = getPageTheme('Issues');

  // Header Props
  const pageActions = (
    <div className="flex items-center gap-3">
        {/* Issue Selector */}
        <select
        value={selectedIssue}
        onChange={(e) => setSelectedIssue(e.target.value as Issue)}
        className={`
            px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium text-sm
            ${isDarkMode 
            ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
            : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            }
        `}
        >
        <option value="clean-energy">Clean Energy</option>
        <option value="education">Education</option>
        <option value="healthcare">Healthcare</option>
        <option value="tech">Tech Policy</option>
        </select>

        {/* Clear Selection Button */}
        {(selectedState || selectedCounty || selectedDistrict) && (
        <button
            onClick={() => {
            handleClearSelection();
            setMapCenter([-96, 38]);
            setMapZoom(1);
            }}
            className={`
            px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2
            ${isDarkMode 
                ? 'bg-white/10 hover:bg-white/15 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }
            `}
        >
            <X size={14} />
            Clear
        </button>
        )}

        {/* Generate Brief Button */}
        <button
        className={`
            px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2
            ${isDarkMode 
            ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20' 
            : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20'
            }
        `}
        >
        <FileDown size={14} />
        Brief
        </button>
    </div>
  );

  return (
    <PageLayout
      title="Issues"
      subtitle="Geospatial Intelligence"
      accentColor={issuesTheme.accent}
      headerIcon={
        <Map
          size={28}
          color={isDarkMode ? issuesTheme.glow : issuesTheme.accent}
        />
      }
      backgroundImage={
        <Map
            size={450} 
            color={isDarkMode ? "white" : issuesTheme.accent} 
            strokeWidth={0.5}
        />
      }
      pageActions={pageActions}
    >
      <div className="flex flex-col h-full">
        {/* Sticky Sub-Header for Tabs & Filters */}
        <div className={`sticky top-0 z-30 px-8 py-4 border-b transition-colors backdrop-blur-md ${isDarkMode ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
            <div className="flex items-center justify-between">
                {/* Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    {([
                        { id: 'overview' as TabType, label: 'Overview', icon: <LayoutGrid size={14} /> },
                        { id: 'media' as TabType, label: 'Media', icon: <Newspaper size={14} /> },
                        { id: 'people' as TabType, label: 'People', icon: <Users size={14} /> },
                        { id: 'bills' as TabType, label: 'Bills', icon: <FileText size={14} /> },
                        { id: 'insights' as TabType, label: 'Revere', icon: <Sparkles size={14} /> },
                    ]).map((tab) => (
                        <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all rounded-lg whitespace-nowrap
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
                    <div className="hidden md:flex items-center gap-1">
                        {(['7d', '30d', 'session'] as TimeWindow[]).map((window) => (
                        <button
                            key={window}
                            onClick={() => setTimeWindow(window)}
                            className={`
                            px-2 py-1 text-[10px] font-bold uppercase rounded transition-all
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
                            {window === '7d' ? '7D' : window === '30d' ? '30D' : 'Session'}
                        </button>
                        ))}
                    </div>

                    {/* Geo Mode Filter */}
                    <div className="hidden md:flex items-center gap-1">
                        {(['states', 'counties', 'districts'] as GeoMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setGeoMode(mode)}
                            disabled={mode === 'districts'}
                            className={`
                            px-2 py-1 text-[10px] font-bold uppercase rounded transition-all
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
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-6 p-8 overflow-hidden relative z-10">
            {/* Map Card */}
            <div className="flex-[2] flex flex-col min-h-[500px]">
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

                {/* Map */}
                <div className="flex-1 relative min-h-[500px] overflow-hidden">
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
                            if (geoMode === 'counties' && selectedState) {
                            const stateAbbrev = selectedState;
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
                                    
                                    const center = stateCenters[stateId];
                                    if (center) {
                                    setMapCenter(center);
                                    setMapZoom(4);
                                    }
                                } else if (!isState && countyFips) {
                                    setSelectedCounty(countyFips);
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
                {tooltipContent && (
                    <div
                    className="fixed z-50 px-3 py-2 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    }}
                    >
                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {tooltipContent.name}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Intensity: {tooltipContent.score}/100
                    </div>
                    </div>
                )}
                </div>
            </div>
            </div>
            {/* Right Panel (Details) */}
            <div className="flex-1 overflow-auto">
                {/* Placeholder for Details Panel if needed */}
            </div>
        </div>
      </div>
    </PageLayout>
  );
}
