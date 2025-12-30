import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { TrendingUp, TrendingDown, Activity, Sparkles, ExternalLink, FileText } from 'lucide-react';

interface StateData {
  state: string;
  name: string;
  activity: number;
  mentions: number;
  sentiment: number;
  insight: string;
  topHeadlines?: string[];
  topSources?: string[];
  topKeywords?: string[];
  topBills?: string[];
}

interface USMapProps {
  stateData: StateData[];
}

// Known-good U.S. TopoJSON (states shapes)
const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Map state names to USPS (needed because this topojson gives state names)
const NAME_TO_USPS: Record<string, string> = {
  "Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO",
  "Connecticut":"CT","Delaware":"DE","District of Columbia":"DC","Florida":"FL","Georgia":"GA",
  "Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY",
  "Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN",
  "Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH",
  "New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND",
  "Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC",
  "South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA",
  "Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY"
};

// Get color based on activity score (6-step scale)
function colorForScore(score: number = 0): string {
  if (score >= 85) return "#c2410c"; // orange-700
  if (score >= 70) return "#ea580c"; // orange-600
  if (score >= 55) return "#f97316"; // orange-500
  if (score >= 40) return "#fb923c"; // orange-400
  if (score >= 25) return "#fdba74"; // orange-300
  return "#fed7aa"; // orange-200
}

export function USMap({ stateData }: USMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getStateData = (usps: string): StateData | undefined => {
    return stateData.find(s => s.state === usps);
  };

  const getScore = (usps: string): number => {
    const data = getStateData(usps);
    return data?.activity || 0;
  };

  const hoveredStateData = hoveredState ? getStateData(hoveredState) : null;

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Map Container */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="text-center mb-4">
          <div className="text-sm font-semibold text-gray-900 mb-1">Interactive U.S. Map</div>
          <div className="text-xs text-gray-500">Hover over any state for detailed metrics and Pythia insights</div>
        </div>

        <div className="relative">
          <ComposableMap projection="geoAlbersUsa" style={{ width: '100%', height: 'auto', maxHeight: '500px' }}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geo.properties?.name;
                  const usps = NAME_TO_USPS[name] || name;
                  const score = getScore(usps);
                  const isHovered = hoveredState === usps;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredState(usps)}
                      onMouseLeave={() => setHoveredState(null)}
                      style={{
                        default: {
                          fill: colorForScore(score),
                          stroke: 'rgba(0,0,0,0.25)',
                          strokeWidth: 0.7,
                          outline: 'none',
                          transition: 'all 250ms ease'
                        },
                        hover: {
                          fill: colorForScore(score),
                          stroke: '#c2410c',
                          strokeWidth: 1.5,
                          outline: 'none',
                          cursor: 'pointer',
                          filter: 'brightness(1.1)'
                        },
                        pressed: {
                          fill: colorForScore(score),
                          outline: 'none'
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Hover Detail Panel - Positioned to the right side of the map */}
          <AnimatePresence>
            {hoveredStateData && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 -right-[26rem] z-50 pointer-events-none"
              >
                <div className="w-96 bg-white rounded-2xl shadow-2xl border-2 border-orange-300 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-5 text-white">
                    <div className="mb-2">
                      <h3 className="text-xl font-bold mb-1">{hoveredStateData.name}</h3>
                      <div className="text-orange-100 text-xs">Media Trend Analysis</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold">{hoveredStateData.activity}%</div>
                      <div className="flex items-center gap-1">
                        {hoveredStateData.sentiment > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-300" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-300" />
                        )}
                        <span className="text-sm">
                          {hoveredStateData.sentiment > 0 ? '+' : ''}{(hoveredStateData.sentiment * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
                    {/* Activity Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-1 mb-1">
                          <Activity className="w-3 h-3 text-orange-600" />
                          <span className="text-xs font-medium text-orange-700">MENTIONS</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{hoveredStateData.mentions}</div>
                      </div>
                      <div className={`p-2.5 rounded-lg border ${
                        hoveredStateData.sentiment > 0.3 
                          ? 'bg-green-50 border-green-200' 
                          : hoveredStateData.sentiment < 0 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center gap-1 mb-1">
                          {hoveredStateData.sentiment > 0 ? (
                            <TrendingUp className={`w-3 h-3 ${
                              hoveredStateData.sentiment > 0.3 ? 'text-green-600' : 'text-gray-600'
                            }`} />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          )}
                          <span className={`text-xs font-medium ${
                            hoveredStateData.sentiment > 0.3 
                              ? 'text-green-700' 
                              : hoveredStateData.sentiment < 0 
                              ? 'text-red-700' 
                              : 'text-gray-700'
                          }`}>
                            SENTIMENT
                          </span>
                        </div>
                        <div className={`text-lg font-bold ${
                          hoveredStateData.sentiment > 0.3 
                            ? 'text-green-600' 
                            : hoveredStateData.sentiment < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`}>
                          {hoveredStateData.sentiment > 0 ? '+' : ''}{(hoveredStateData.sentiment * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Top Sources */}
                    {hoveredStateData.topSources && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 mb-1.5">Top Media Sources</h4>
                        <div className="space-y-1.5">
                          {hoveredStateData.topSources.map((source, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                              <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                              {source}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top Keywords */}
                    {hoveredStateData.topKeywords && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 mb-1.5">Trending Keywords</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {hoveredStateData.topKeywords.map((keyword, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top Bills */}
                    {hoveredStateData.topBills && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 mb-1.5">Bills Referenced</h4>
                        <div className="space-y-1.5">
                          {hoveredStateData.topBills.map((bill, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700 p-1.5 bg-gray-50 rounded-lg">
                              <FileText className="w-2.5 h-2.5 text-gray-400" />
                              {bill}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pythia Insight */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-200">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span className="text-xs font-bold text-purple-900">PYTHIA INSIGHT</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {hoveredStateData.insight}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">Activity Level:</span>
            <div className="flex items-center gap-0.5">
              {[
                { label: 'Low', color: '#fed7aa' },
                { label: '', color: '#fdba74' },
                { label: '', color: '#fb923c' },
                { label: '', color: '#f97316' },
                { label: '', color: '#ea580c' },
                { label: 'High', color: '#c2410c' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-8 h-5 border border-gray-300 rounded" 
                    style={{ backgroundColor: step.color }}
                  />
                  {step.label && (
                    <span className="text-xs text-gray-600 mt-0.5">{step.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}