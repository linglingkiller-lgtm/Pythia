import React, { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoAlbersUsa, geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';
import { useTheme } from '../../../contexts/ThemeContext';
import { County } from '../../../data/electionsHubData';

interface ArizonaMapProps {
  counties: County[];
  selectedCountyId: string | null;
  onSelectCounty: (id: string) => void;
  layer: string;
}

const geoUrlCounties = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';
const geoUrlStates = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

export const ArizonaMap: React.FC<ArizonaMapProps> = ({ counties, selectedCountyId, onSelectCounty, layer }) => {
  const { isDarkMode } = useTheme();
  const [geoData, setGeoData] = useState<any>(null);
  const [stateGeo, setStateGeo] = useState<any>(null);

  useEffect(() => {
    // Fetch counties
    fetch(geoUrlCounties)
      .then(res => res.json())
      .then(data => {
        const allCounties = feature(data, data.objects.counties);
        // Filter for Arizona (FIPS 04)
        const azCounties = {
          ...allCounties,
          features: allCounties.features.filter((f: any) => f.id.startsWith('04'))
        };
        setGeoData(azCounties);
      });

    // Fetch states to get Arizona boundary for projection fitting
    fetch(geoUrlStates)
      .then(res => res.json())
      .then(data => {
        const allStates = feature(data, data.objects.states);
        const azFeature = allStates.features.find((f: any) => f.properties.name === 'Arizona');
        setStateGeo(azFeature);
      });
  }, []);

  const projection = useMemo(() => {
    if (!stateGeo) return null;
    const proj = geoAlbersUsa();
    // Fit projection to Arizona
    // Standard width/height for the container
    proj.fitExtent([[20, 20], [780, 580]], stateGeo);
    return proj;
  }, [stateGeo]);

  const getCountyColor = (countyName: string) => {
    const county = counties.find(c => c.name.toLowerCase() === countyName.toLowerCase().replace(' county', ''));
    
    if (!county) return isDarkMode ? '#1e293b' : '#f1f5f9';

    if (layer === 'Control') {
      switch (county.lean) {
        case 'strong_dem': return '#2563eb';
        case 'lean_dem': return '#60a5fa';
        case 'swing': return '#a855f7';
        case 'lean_rep': return '#f87171';
        case 'strong_rep': return '#dc2626';
        default: return isDarkMode ? '#334155' : '#cbd5e1';
      }
    }
    
    // Mock heat maps
    if (layer === 'Competitiveness') return county.lean === 'swing' ? '#ef4444' : '#fee2e2';
    if (layer === 'Money') return county.lean === 'swing' ? '#10b981' : '#d1fae5';

    return isDarkMode ? '#334155' : '#cbd5e1';
  };

  if (!geoData || !projection) return <div className="flex items-center justify-center h-full">Loading Map...</div>;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <ComposableMap
        projection={projection}
        width={800}
        height={600}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map(geo => {
              const countyName = geo.properties.name;
              const isSelected = selectedCountyId && 
                counties.find(c => c.id === selectedCountyId)?.name.toLowerCase() === countyName.toLowerCase();
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getCountyColor(countyName)}
                  stroke={isDarkMode ? '#0f172a' : '#ffffff'}
                  strokeWidth={isSelected ? 2 : 0.5}
                  style={{
                    default: { outline: 'none', transition: 'all 250ms' },
                    hover: { fill: isDarkMode ? '#4f46e5' : '#818cf8', outline: 'none', cursor: 'pointer' },
                    pressed: { outline: 'none' },
                  }}
                  onClick={() => {
                    const found = counties.find(c => c.name.toLowerCase() === countyName.toLowerCase());
                    if (found) onSelectCounty(found.id);
                  }}
                />
              );
            })
          }
        </Geographies>
        {/* Labels */}
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map(geo => {
              const centroid = geoCentroid(geo);
              const countyName = geo.properties.name;
              return (
                <g key={geo.rsmKey + "-name"}>
                   {/* Only show label if large enough area or important */}
                   <text
                     x={centroid[0]}
                     y={centroid[1]}
                     textAnchor="middle"
                     style={{
                       fontFamily: 'system-ui',
                       fontSize: 10,
                       fill: isDarkMode ? 'white' : 'black',
                       pointerEvents: 'none',
                       textShadow: isDarkMode ? '0 1px 2px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.8)'
                     }}
                   >
                     {countyName}
                   </text>
                </g>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};
