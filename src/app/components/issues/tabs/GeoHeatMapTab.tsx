import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { motion, AnimatePresence } from 'motion/react';
import { geoAlbersUsa, geoPath, geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  TrendingUp,
  Activity,
  Scale,
  FileText,
  Users,
  Gavel,
  Flame,
  GitCompare,
  Clock,
} from 'lucide-react';
import {
  stateScores,
  countyScores,
  districtScores,
  topicsByIssue,
  billsByTopic,
  peopleByTopic,
  narrativesByIssue,
  stateKeywords,
} from '../../../data/issuesMockData';

const geoUrlStates = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const geoUrlCounties = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';
const geoUrlAzHouse = '/assets/maps/az_sldl.topojson';
const geoUrlAzSenate = '/assets/maps/az_sldu.topojson';

type GeoMode = 'states' | 'counties' | 'districts' | 'az-leg-districts';
type AzLegChamber = 'house' | 'senate';
type OverlayMetric = 'volume' | 'sentiment' | 'momentum' | 'legislative';
type CompareRegion = { type: string; id: string; name: string; score: number };

// Helper to get county display name
function getCountyDisplayName(geo: any): string {
  const baseName = geo?.properties?.name; // e.g., "Maricopa"
  const fips = String(geo?.id ?? geo?.properties?.GEOID ?? '').padStart(5, '0');
  if (baseName) return `${baseName} County`;
  return `County ${fips}`; // fallback only
}

// Helper to normalize AZ district number to 2-digit format
function normalizeToTwoDigitDistrict(raw: any): string {
  if (!raw) return '00';
  const str = String(raw).trim();
  const match = str.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    return num.toString().padStart(2, '0');
  }
  return '00';
}

// Helper to extract AZ district number from geography
function getAzDistrictNumber(feature: any): string {
  const raw = feature.properties?.DISTRICT
    ?? feature.properties?.SLDLST
    ?? feature.properties?.SLDUST
    ?? feature.properties?.GEOID
    ?? feature.id;
  return normalizeToTwoDigitDistrict(raw);
}

interface AzDistrictProfile {
  districtLabel: string;
  demographics: {
    population: string;
    urbanRural: string;
    medianIncome: string;
    keyIndustries: string[];
    competitiveness: string;
    notes: string;
  };
  house: Array<{
    name: string;
    party: string;
    email: string;
    committees: string[];
  }>;
  senate: {
    name: string;
    party: string;
    email: string;
    committees: string[];
  };
}

interface Props {
  isDarkMode: boolean;
  selectedIssue: string;
  timeWindow: string;
  selectedState: string | null;
  setSelectedState: (state: string | null) => void;
  selectedCounty: string | null;
  setSelectedCounty: (county: string | null) => void;
  selectedDistrict: string | null;
  setSelectedDistrict: (district: string | null) => void;
  clearSelection: () => void;
}

const stateCenters: Record<string, [number, number]> = {
  California: [-119.4179, 36.7783],
  Texas: [-99.9018, 31.9686],
  'New York': [-75.0, 43.0],
  Florida: [-81.5158, 27.6648],
  Pennsylvania: [-77.1945, 41.2033],
  Ohio: [-82.9071, 40.4173],
  Illinois: [-89.3985, 40.6331],
  Michigan: [-84.5361, 44.3148],
  Georgia: [-83.5002, 32.1656],
  'North Carolina': [-79.0193, 35.7596],
  Arizona: [-111.0937, 34.0489],
  Washington: [-120.7401, 47.7511],
  Massachusetts: [-71.3824, 42.4072],
  Virginia: [-78.6569, 37.4316],
  Wisconsin: [-89.6165, 43.7844],
  Colorado: [-105.7821, 39.5501],
  Minnesota: [-94.6859, 46.7296],
  Nevada: [-116.4194, 39.8494],
  Tennessee: [-86.5804, 35.5175],
  Oregon: [-120.5542, 43.8041],
};

// Mock data for different overlay metrics
const getScoreForMetric = (
  regionName: string,
  metric: OverlayMetric
): number => {
  const baseScore = stateScores[regionName] || 50;
  switch (metric) {
    case 'sentiment':
      return Math.min(100, baseScore + 5);
    case 'momentum':
      return Math.min(100, baseScore - 10);
    case 'legislative':
      return Math.min(100, baseScore + 15);
    default:
      return baseScore;
  }
};

export function GeoHeatMapTab({
  isDarkMode,
  selectedIssue,
  timeWindow,
  selectedState,
  setSelectedState,
  selectedCounty,
  setSelectedCounty,
  selectedDistrict,
  setSelectedDistrict,
  clearSelection,
}: Props) {
  const [geoMode, setGeoMode] = useState<GeoMode>('states');
  const [overlayMetric, setOverlayMetric] = useState<OverlayMetric>('volume');
  const [compareMode, setCompareMode] = useState(false);
  const [compareRegions, setCompareRegions] = useState<CompareRegion[]>([]);
  const [timeSnapshot, setTimeSnapshot] = useState(4); // 0-4 for Week 1-5
  const [tooltipContent, setTooltipContent] = useState<{
    name: string;
    score: number;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mapZoom, setMapZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-96, 38]);
  const [selectedCountyName, setSelectedCountyName] = useState<string | null>(null);
  const [azLegChamber, setAzLegChamber] = useState<AzLegChamber>('house');
  const [azDistrictProfiles, setAzDistrictProfiles] = useState<Record<string, AzDistrictProfile> | null>(null);
  const [selectedAzDistrictNumber, setSelectedAzDistrictNumber] = useState<string | null>(null);
  const [azDistrictsAvailable, setAzDistrictsAvailable] = useState(false);
  
  // Container dimensions for proper projection fitting
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 1000, height: 600 });
  
  // Topojson data
  const [statesTopojson, setStatesTopojson] = useState<any>(null);
  const [countiesTopojson, setCountiesTopojson] = useState<any>(null);
  const [azHouseTopojson, setAzHouseTopojson] = useState<any>(null);
  const [azSenateTopojson, setAzSenateTopojson] = useState<any>(null);

  // Observe container size
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setMapDimensions({ width: width || 1000, height: height || 600 });
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  
  // Load topojson data
  useEffect(() => {
    fetch(geoUrlStates)
      .then(res => res.json())
      .then(data => setStatesTopojson(data))
      .catch(err => console.error('Failed to load states:', err));
      
    fetch(geoUrlCounties)
      .then(res => res.json())
      .then(data => setCountiesTopojson(data))
      .catch(err => console.error('Failed to load counties:', err));
  }, []);

  // Load AZ district data only when Arizona is selected
  useEffect(() => {
    if (selectedState !== 'Arizona') {
      setAzDistrictsAvailable(false);
      return;
    }

    // Try to load AZ district profiles
    fetch('/assets/data/az_district_profiles.json')
      .then(res => {
        if (!res.ok) throw new Error('District profiles not found');
        // Check if response is actually JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return res.json();
      })
      .then(data => setAzDistrictProfiles(data))
      .catch(err => {
        // Silently handle - this is optional data
        setAzDistrictProfiles(null);
      });

    // Try to load AZ House boundaries
    fetch(geoUrlAzHouse)
      .then(res => {
        if (!res.ok) throw new Error('House boundaries not found');
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return res.json();
      })
      .then(data => {
        setAzHouseTopojson(data);
        setAzDistrictsAvailable(true);
      })
      .catch(err => {
        // Silently handle - this is optional data
        setAzHouseTopojson(null);
      });

    // Try to load AZ Senate boundaries
    fetch(geoUrlAzSenate)
      .then(res => {
        if (!res.ok) throw new Error('Senate boundaries not found');
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return res.json();
      })
      .then(data => setAzSenateTopojson(data))
      .catch(err => {
        // Silently handle - this is optional data
        setAzSenateTopojson(null);
      });
  }, [selectedState]);

  // Compute projection based on selected state
  const projection = useMemo(() => {
    if (!statesTopojson) return undefined;
    
    const PAD = 32;
    const { width, height } = mapDimensions;
    
    try {
      if (!selectedState || geoMode === 'states') {
        // US view: use geoAlbersUsa
        const allStates = feature(statesTopojson, statesTopojson.objects.states);
        const proj = geoAlbersUsa();
        proj.fitExtent([[PAD, PAD], [width - PAD, height - PAD]], allStates);
        return proj;
      } else {
        // State view: use geoMercator for better state centering
        const allStates = feature(statesTopojson, statesTopojson.objects.states);
        const stateFeature = allStates.features.find(
          (f: any) => f.properties.name === selectedState
        );
        
        if (stateFeature) {
          const proj = geoAlbersUsa(); // Try AlbersUsa first
          proj.fitExtent([[PAD, PAD], [width - PAD, height - PAD]], stateFeature);
          return proj;
        }
      }
    } catch (error) {
      console.error('Projection error:', error);
    }
    
    return undefined;
  }, [selectedState, geoMode, statesTopojson, mapDimensions]);

  const getColorForScore = (score: number | undefined): string => {
    if (!score) return isDarkMode ? '#1e293b' : '#f1f5f9';
    if (score >= 85) return isDarkMode ? '#c2410c' : '#ea580c';
    if (score >= 70) return isDarkMode ? '#ea580c' : '#f97316';
    if (score >= 55) return isDarkMode ? '#f97316' : '#fb923c';
    if (score >= 40) return isDarkMode ? '#fb923c' : '#fdba74';
    if (score >= 25) return isDarkMode ? '#fdba74' : '#ffedd5';
    return isDarkMode ? '#ffedd5' : '#fff7ed';
  };

  const handleStateClick = (stateName: string) => {
    if (compareMode) {
      // Add to compare list
      if (compareRegions.length < 3 && !compareRegions.find(r => r.id === stateName)) {
        setCompareRegions([
          ...compareRegions,
          {
            type: 'state',
            id: stateName,
            name: stateName,
            score: getScoreForMetric(stateName, overlayMetric),
          },
        ]);
      }
    } else {
      setSelectedState(stateName);
      setGeoMode('counties');
      
      // Compute centroid and zoom using topojson data
      if (statesTopojson) {
        try {
          const allStates = feature(statesTopojson, statesTopojson.objects.states);
          const stateFeature = allStates.features.find(
            (f: any) => f.properties.name === stateName
          );
          
          if (stateFeature) {
            // Calculate centroid
            const [lon, lat] = geoCentroid(stateFeature);
            
            // Calculate zoom based on bounds
            const projection = geoAlbersUsa();
            projection.scale(1300); // Match ComposableMap scale
            const path = geoPath().projection(projection);
            const bounds = path.bounds(stateFeature);
            const [[x0, y0], [x1, y1]] = bounds;
            const dx = x1 - x0;
            const dy = y1 - y0;
            
            const PAD = 40;
            const mapW = 1400;
            const mapH = 600;
            
            let calculatedZoom = Math.min((mapW - PAD * 2) / dx, (mapH - PAD * 2) / dy);
            calculatedZoom = Math.max(1, Math.min(8, calculatedZoom)); // Clamp between 1 and 8
            
            setMapCenter([lon, lat]);
            setMapZoom(calculatedZoom);
          }
        } catch (error) {
          console.error('Error calculating state center:', error);
          // Fallback to manual centers
          const center = stateCenters[stateName];
          if (center) {
            setMapCenter(center);
            setMapZoom(4);
          }
        }
      } else {
        // Fallback to manual centers if topojson not loaded
        const center = stateCenters[stateName];
        if (center) {
          setMapCenter(center);
          setMapZoom(4);
        }
      }
    }
  };

  const handleCountyClick = (geo: any) => {
    const countyFips = geo.id?.toString() || '';
    const countyName = getCountyDisplayName(geo);
    setSelectedCounty(countyFips);
    setSelectedCountyName(countyName);
  };

  const resetMapView = () => {
    clearSelection();
    setGeoMode('states');
    setMapCenter([-96, 38]);
    setMapZoom(1);
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setCompareRegions([]);
    }
  };

  const removeCompareRegion = (id: string) => {
    setCompareRegions(compareRegions.filter(r => r.id !== id));
  };

  // Get current region for Local Pulse
  const getCurrentRegion = () => {
    if (selectedDistrict) return selectedDistrict;
    if (selectedCountyName) return selectedCountyName;
    if (selectedState) return selectedState;
    return 'U.S.';
  };

  // Calculate pan offset for centering states (in pixels)
  const getStateOffsetX = (stateName: string): number => {
    const offsets: Record<string, number> = {
      California: 1200,
      Texas: 700,
      'New York': -900,
      Florida: -400,
      Pennsylvania: -800,
      Arizona: 1300,
      Washington: 1200,
      Oregon: 1300,
      Nevada: 1280,
      Colorado: 800,
      'New Mexico': 900,
      'North Carolina': -700,
      Georgia: -400,
      Ohio: -750,
      Illinois: -400,
      Michigan: -750,
      Indiana: -550,
      Wisconsin: -600,
      Minnesota: -480,
      Iowa: -320,
      Missouri: -320,
      Kansas: 260,
      Nebraska: 130,
      'South Dakota': -130,
      'North Dakota': -320,
      Montana: 550,
      Wyoming: 550,
      Idaho: 950,
      Utah: 1000,
      Alabama: -260,
      Mississippi: -210,
      Louisiana: 0,
      Arkansas: 0,
      Tennessee: -400,
      Kentucky: -550,
      'West Virginia': -750,
      Virginia: -750,
      'South Carolina': -600,
      Maryland: -850,
      Delaware: -950,
      'New Jersey': -960,
      Connecticut: -1000,
      'Rhode Island': -1050,
      Massachusetts: -1000,
      Vermont: -960,
      'New Hampshire': -990,
      Maine: -1080,
      Oklahoma: 400,
    };
    return offsets[stateName] || 0;
  };

  const getStateOffsetY = (stateName: string): number => {
    const offsets: Record<string, number> = {
      California: -130,
      Texas: 260,
      'New York': -550,
      Florida: 650,
      Pennsylvania: -480,
      Arizona: -400,
      Washington: -750,
      Oregon: -580,
      Nevada: -350,
      Colorado: -290,
      'New Mexico': -130,
      'North Carolina': 130,
      Georgia: 310,
      Ohio: -420,
      Illinois: -260,
      Michigan: -640,
      Indiana: -350,
      Wisconsin: -550,
      Minnesota: -670,
      Iowa: -400,
      Missouri: -160,
      Kansas: -210,
      Nebraska: -350,
      'South Dakota': -480,
      'North Dakota': -620,
      Montana: -580,
      Wyoming: -450,
      Idaho: -560,
      Utah: -320,
      Alabama: 230,
      Mississippi: 210,
      Louisiana: 340,
      Arkansas: 50,
      Tennessee: 0,
      Kentucky: -210,
      'West Virginia': -260,
      Virginia: -130,
      'South Carolina': 230,
      Maryland: -320,
      Delaware: -320,
      'New Jersey': -370,
      Connecticut: -480,
      'Rhode Island': -500,
      Massachusetts: -550,
      Vermont: -620,
      'New Hampshire': -580,
      Maine: -750,
      Oklahoma: 30,
    };
    return offsets[stateName] || 0;
  };

  return (
    <div className="space-y-6">
      {/* Controls Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <button
            onClick={resetMapView}
            className={`transition-colors ${
              selectedState || selectedCounty || selectedDistrict
                ? isDarkMode
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
                : isDarkMode
                ? 'text-white'
                : 'text-gray-900'
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
                  setSelectedDistrict(null);
                  setGeoMode('counties');
                }}
                className={`transition-colors ${
                  selectedCounty || selectedDistrict
                    ? isDarkMode
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-700'
                    : isDarkMode
                    ? 'text-white'
                    : 'text-gray-900'
                }`}
              >
                {selectedState}
              </button>
            </>
          )}
          {selectedCounty && (
            <>
              <span className={isDarkMode ? 'text-slate-600' : 'text-gray-400'}>/</span>
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {selectedCountyName || `County ${selectedCounty}`}
              </span>
            </>
          )}
        </div>

        {/* Mode Selector */}
        {selectedState && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setGeoMode('counties')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                geoMode === 'counties'
                  ? 'bg-orange-600 text-white'
                  : isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                  : 'bg-white hover:bg-orange-50 text-gray-600 border border-gray-200'
              }`}
            >
              Counties
            </button>
            <button
              onClick={() => setGeoMode('districts')}
              disabled={!azDistrictsAvailable}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                geoMode === 'districts'
                  ? 'bg-orange-600 text-white'
                  : isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-40'
                  : 'bg-white hover:bg-orange-50 text-gray-600 border border-gray-200 disabled:opacity-40'
              }`}
              title={!azDistrictsAvailable ? 'District boundaries dataset not installed' : ''}
            >
              Districts
            </button>
          </div>
        )}

        {/* Map Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMapZoom(Math.min(mapZoom + 1, 8))}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMapZoom(Math.max(mapZoom - 1, 1))}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetMapView}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overlay Metric Selector */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Overlay:
        </span>
        {[
          { id: 'volume', icon: Activity, label: 'Media Volume' },
          { id: 'sentiment', icon: Scale, label: 'Sentiment' },
          { id: 'momentum', icon: TrendingUp, label: 'Momentum' },
          { id: 'legislative', icon: Gavel, label: 'Legislative Heat' },
        ].map(metric => (
          <button
            key={metric.id}
            onClick={() => setOverlayMetric(metric.id as OverlayMetric)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              overlayMetric === metric.id
                ? 'bg-orange-600 text-white shadow-lg'
                : isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                : 'bg-white hover:bg-orange-50 text-gray-700 border border-gray-200'
            }`}
          >
            <metric.icon className="w-4 h-4" />
            {metric.label}
          </button>
        ))}
      </div>

      {/* Compare Mode Toggle & Time Slider Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Compare Mode */}
        <button
          onClick={toggleCompareMode}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            compareMode
              ? 'bg-blue-600 text-white shadow-lg'
              : isDarkMode
              ? 'bg-white/5 hover:bg-white/10 text-slate-300'
              : 'bg-white hover:bg-blue-50 text-gray-700 border border-gray-200'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          Compare Mode {compareMode && `(${compareRegions.length}/3)`}
        </button>

        {/* Time Slider */}
        <div className="flex items-center gap-3">
          <Clock className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Week {timeSnapshot + 1}
          </span>
          <input
            type="range"
            min="0"
            max="4"
            value={timeSnapshot}
            onChange={e => setTimeSnapshot(Number(e.target.value))}
            className="w-48 accent-orange-600"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Low Activity
        </span>
        {[0, 25, 40, 55, 70, 85].map(threshold => (
          <div
            key={threshold}
            className="w-10 h-4 rounded"
            style={{ backgroundColor: getColorForScore(threshold + 1) }}
          />
        ))}
        <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          High Activity
        </span>
      </div>

      {/* Compare Regions Pills */}
      {compareMode && compareRegions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Comparing:
          </span>
          {compareRegions.map(region => (
            <div
              key={region.id}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-blue-900/20 border-blue-500/30 text-blue-300'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}
            >
              <span className="text-sm font-medium">{region.name}</span>
              <button
                onClick={() => removeCompareRegion(region.id)}
                className="hover:bg-white/10 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Map Container */}
      <motion.div
        className={`rounded-2xl border overflow-hidden ${
          isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
        }`}
        style={{ height: '700px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <div 
            style={{ width: '100%', height: '100%', touchAction: 'none' }} 
            onWheel={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onWheelCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{
                scale: 1300,
              }}
              width={1400}
              height={700}
            >
              <ZoomableGroup 
                center={mapCenter} 
                zoom={mapZoom} 
                minZoom={1} 
                maxZoom={8}
                onMoveEnd={(position) => {
                  setMapCenter(position.coordinates);
                  setMapZoom(position.zoom);
                }}
              >
            {geoMode === 'states' && (
              <Geographies geography={geoUrlStates}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const stateName = geo.properties.name;
                    const score = getScoreForMetric(stateName, overlayMetric);
                    const isCompared = compareRegions.find(r => r.id === stateName);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getColorForScore(score)}
                        stroke={
                          isCompared
                            ? '#3b82f6'
                            : isDarkMode
                            ? '#1e293b'
                            : '#e2e8f0'
                        }
                        strokeWidth={isCompared ? 2 : 0.5}
                        style={{
                          default: { outline: 'none', transition: 'fill 250ms ease' },
                          hover: {
                            outline: 'none',
                            fill: '#f97316',
                            cursor: 'pointer',
                          },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={e => {
                          setTooltipContent({ name: stateName, score: score || 0 });
                          setTooltipPosition({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseLeave={() => setTooltipContent(null)}
                        onClick={() => handleStateClick(stateName)}
                      />
                    );
                  })
                }
              </Geographies>
            )}

            {geoMode === 'counties' && selectedState && (
              <Geographies geography={geoUrlCounties}>
                {({ geographies }) =>
                  geographies
                    .filter(geo => {
                      const stateFipsMap: Record<string, string> = {
                        Alabama: '01',
                        Alaska: '02',
                        Arizona: '04',
                        Arkansas: '05',
                        California: '06',
                        Colorado: '08',
                        Connecticut: '09',
                        Delaware: '10',
                        Florida: '12',
                        Georgia: '13',
                        Hawaii: '15',
                        Idaho: '16',
                        Illinois: '17',
                        Indiana: '18',
                        Iowa: '19',
                        Kansas: '20',
                        Kentucky: '21',
                        Louisiana: '22',
                        Maine: '23',
                        Maryland: '24',
                        Massachusetts: '25',
                        Michigan: '26',
                        Minnesota: '27',
                        Mississippi: '28',
                        Missouri: '29',
                        Montana: '30',
                        Nebraska: '31',
                        Nevada: '32',
                        'New Hampshire': '33',
                        'New Jersey': '34',
                        'New Mexico': '35',
                        'New York': '36',
                        'North Carolina': '37',
                        'North Dakota': '38',
                        Ohio: '39',
                        Oklahoma: '40',
                        Oregon: '41',
                        Pennsylvania: '42',
                        'Rhode Island': '44',
                        'South Carolina': '45',
                        'South Dakota': '46',
                        Tennessee: '47',
                        Texas: '48',
                        Utah: '49',
                        Vermont: '50',
                        Virginia: '51',
                        Washington: '53',
                        'West Virginia': '54',
                        Wisconsin: '55',
                        Wyoming: '56',
                      };
                      const stateFips = stateFipsMap[selectedState];
                      if (!stateFips) return false;
                      const countyId = geo.id?.toString() || '';
                      return countyId.startsWith(stateFips);
                    })
                    .map(geo => {
                      const countyFips = geo.id?.toString() || '';
                      const score = countyScores[countyFips];
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getColorForScore(score)}
                          stroke={isDarkMode ? '#1e293b' : '#e2e8f0'}
                          strokeWidth={0.5}
                          style={{
                            default: {
                              outline: 'none',
                              transition: 'fill 250ms ease',
                            },
                            hover: {
                              outline: 'none',
                              fill: '#f97316',
                              cursor: 'pointer',
                            },
                            pressed: { outline: 'none' },
                          }}
                          onMouseEnter={e => {
                            setTooltipContent({
                              name: getCountyDisplayName(geo),
                              score: score || 0,
                            });
                            setTooltipPosition({ x: e.clientX, y: e.clientY });
                          }}
                          onMouseLeave={() => setTooltipContent(null)}
                          onClick={() => handleCountyClick(geo)}
                        />
                      );
                    })
                }
              </Geographies>
            )}

            {geoMode === 'districts' && (
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                className={isDarkMode ? 'fill-slate-400' : 'fill-gray-600'}
                style={{ fontSize: '18px' }}
              >
                District boundaries dataset not installed
              </text>
            )}
              </ZoomableGroup>
          </ComposableMap>
          </div>

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

      {/* Compare Mode Table */}
      {compareMode && compareRegions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border overflow-hidden ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="p-6">
            <h3
              className={`text-lg font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Regional Comparison
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Metric
              </div>
              {compareRegions.map(region => (
                <div key={region.id} className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {region.name}
                </div>
              ))}
              
              <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Score</div>
              {compareRegions.map(region => (
                <div key={region.id} className="text-orange-600 font-bold">
                  {region.score}
                </div>
              ))}
              
              <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Momentum</div>
              {compareRegions.map(region => (
                <div key={region.id} className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                  +{Math.floor(Math.random() * 15 + 5)}%
                </div>
              ))}
              
              <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Top Topic</div>
              {compareRegions.map(region => (
                <div key={region.id} className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                  {topicsByIssue['clean-energy']?.[0]?.name || 'Solar Energy'}
                </div>
              ))}
              
              <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Fastest Rising</div>
              {compareRegions.map(region => (
                <div key={region.id} className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                  {narrativesByIssue['clean-energy']?.[0]?.name || 'Economic Opportunity'}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Local Pulse Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Top Narratives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl border p-6 ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Narratives
            </h3>
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <div className={`text-xs font-semibold mb-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {getCurrentRegion()}
          </div>
          <div className="space-y-3">
            {(narrativesByIssue[selectedIssue as keyof typeof narrativesByIssue] || narrativesByIssue['clean-energy']).slice(0, 3).map((narrative, idx) => (
              <div key={narrative.narrativeId} className="flex items-start gap-3">
                <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                  idx === 0 ? 'bg-orange-600 text-white' : isDarkMode ? 'bg-white/10 text-slate-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {narrative.name}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {narrative.descriptionShort}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className={`w-full mt-4 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
          }`}>
            View All
          </button>
        </motion.div>

        {/* Most-Mentioned Bills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl border p-6 ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Most-Mentioned Bills
            </h3>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className={`text-xs font-semibold mb-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {getCurrentRegion()}
          </div>
          <div className="space-y-3">
            {Object.values(billsByTopic).flat().slice(0, 3).map((bill, idx) => (
              <div key={bill.billId} className="flex items-start gap-3">
                <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                  idx === 0 ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-white/10 text-slate-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {bill.billId}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {bill.title.slice(0, 50)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className={`w-full mt-4 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
          }`}>
            View All
          </button>
        </motion.div>

        {/* Most-Mentioned Lawmakers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl border p-6 ${
            isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Most-Mentioned Lawmakers
            </h3>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div className={`text-xs font-semibold mb-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {getCurrentRegion()}
          </div>
          <div className="space-y-3">
            {Object.values(peopleByTopic).flat().slice(0, 3).map((person, idx) => (
              <div key={person.personId} className="flex items-start gap-3">
                <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                  idx === 0 ? 'bg-green-600 text-white' : isDarkMode ? 'bg-white/10 text-slate-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {person.name}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {person.officeTitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className={`w-full mt-4 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
          }`}>
            View All
          </button>
        </motion.div>
      </div>
    </div>
  );
}