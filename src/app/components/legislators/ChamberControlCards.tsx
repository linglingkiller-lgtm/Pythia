import React from 'react';
import { ChamberSummary } from './chamberData';
import { TrendingUp, TrendingDown, Clock, Shield, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ChamberControlCardsProps {
  chambers: ChamberSummary[];
}

export function ChamberControlCards({ chambers }: ChamberControlCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 animate-fadeIn">
      {chambers.map((chamber, idx) => (
        <ChamberCard key={chamber.chamberName} chamber={chamber} index={idx} />
      ))}
    </div>
  );
}

interface ChamberCardProps {
  chamber: ChamberSummary;
  index: number;
}

function ChamberCard({ chamber, index }: ChamberCardProps) {
  const { isDarkMode } = useTheme();
  const controlPartyData = chamber.seatsByParty.find(p => p.party === chamber.controlParty);
  const [isHovered, setIsHovered] = React.useState(false);
  
  const pageTheme = getPageTheme('Legislators');

  // Theme-aware colors
  const bgColor = isDarkMode ? 'bg-slate-800/40' : 'bg-white/60';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  
  return (
    <div 
      className={`relative overflow-hidden border ${borderColor} ${bgColor} backdrop-blur-xl transition-all duration-300 group`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Watermark Logo - Arizona House */}
      {chamber.chamberName.includes('House') && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] opacity-[0.03] pointer-events-none transition-all duration-500 group-hover:opacity-[0.06] group-hover:scale-105">
          <ImageWithFallback
            src="https://th.bing.com/th/id/R.50337d6395f4276163efcad9847efc7b?rik=HZhUdlDFy0q6sg&riu=http%3a%2f%2fimages.shoutwiki.com%2fkobol%2fthumb%2f4%2f40%2fUS-AZ_seal-Arizona_State_House_of_Representatives.svg%2f1200px-US-AZ_seal-Arizona_State_House_of_Representatives.svg.png&ehk=OXwUOCWGPomYVaGNPwr3szDKy2Ba9AtvmyqjRuv5wgU%3d&risl=&pid=ImgRaw&r=0"
            alt="Arizona House Seal"
            className="w-full h-full object-contain"
          />
        </div>
      )}
      
      {/* Watermark Logo - Arizona Senate */}
      {chamber.chamberName.includes('Senate') && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] opacity-[0.03] pointer-events-none transition-all duration-500 group-hover:opacity-[0.06] group-hover:scale-105">
          <ImageWithFallback
            src="https://images.shoutwiki.com/kobol/thumb/7/75/US-AZ_seal-Arizona_State_Senate.svg/1200px-US-AZ_seal-Arizona_State_Senate.svg.png"
            alt="Arizona Senate Seal"
            className="w-full h-full object-contain"
          />
        </div>
      )}
      
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isDarkMode
            ? `linear-gradient(135deg, ${hexToRgba(pageTheme.gradientFrom, 0.08)}, ${hexToRgba(pageTheme.gradientTo, 0.05)})`
            : `linear-gradient(135deg, ${hexToRgba(pageTheme.gradientFrom, 0.05)}, ${hexToRgba(pageTheme.gradientTo, 0.03)})`,
        }}
      />
      
      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-700/40' : 'bg-gray-100'} transition-transform duration-300 group-hover:scale-110`}>
                <Users 
                  size={20} 
                  className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                />
              </div>
              <h3 
                className={`text-2xl font-bold ${textColor} tracking-tight`}
                style={{ fontFamily: '"Corpline", sans-serif' }}
              >
                {chamber.chamberName}
              </h3>
            </div>
            <div className={`flex items-center gap-2 text-xs ${textMuted} ml-11`}>
              <Clock size={11} className="opacity-60" />
              <span className="font-medium">{chamber.lastUpdated}</span>
            </div>
          </div>
          
          {/* Control Badge */}
          <div 
            className={`px-4 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300`}
            style={{
              backgroundColor: isDarkMode 
                ? `${controlPartyData?.color}15`
                : `${controlPartyData?.color}10`,
              borderColor: isDarkMode
                ? `${controlPartyData?.color}40`
                : `${controlPartyData?.color}30`,
            }}
          >
            <div 
              className="text-xs font-bold uppercase tracking-wider mb-1" 
              style={{ color: controlPartyData?.color }}
            >
              Control
            </div>
            <div 
              className="text-lg font-black" 
              style={{ 
                color: controlPartyData?.color,
                fontFamily: '"Corpline", sans-serif'
              }}
            >
              {controlPartyData?.party}
            </div>
          </div>
        </div>

        {/* Legislative Semicircle Diagram */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-bold ${textColor} uppercase tracking-wider`}>
              Seat Distribution
            </span>
            <span className={`text-xs ${textMuted} font-semibold`}>
              {chamber.totalSeats} seats
            </span>
          </div>
          
          <LegislativeSemicircle 
            seatsByParty={chamber.seatsByParty}
            totalSeats={chamber.totalSeats}
            majorityThreshold={chamber.majorityThreshold}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Party Breakdown Cards */}
        <div className="space-y-3">
          {chamber.seatsByParty.map((partyData, idx) => {
            const percentage = ((partyData.count / chamber.totalSeats) * 100).toFixed(1);
            const isMajority = partyData.count >= chamber.majorityThreshold;
            
            return (
              <div 
                key={idx} 
                className={`relative overflow-hidden p-5 rounded-xl border ${borderColor} transition-all duration-300 backdrop-blur-sm group/party ${
                  isDarkMode ? 'bg-slate-800/30 hover:bg-slate-800/50' : 'bg-white/40 hover:bg-white/70'
                }`}
              >
                {/* Accent line */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                  style={{ 
                    backgroundColor: partyData.color,
                    opacity: isMajority ? 1 : 0.4
                  }}
                />
                
                <div className="flex items-center justify-between ml-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full shadow-lg"
                      style={{ backgroundColor: partyData.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${textColor} text-lg`}>
                          {partyData.party}
                        </span>
                        {isMajority && (
                          <span 
                            className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide"
                            style={{
                              backgroundColor: isDarkMode ? `${partyData.color}20` : `${partyData.color}15`,
                              color: partyData.color,
                            }}
                          >
                            Majority
                          </span>
                        )}
                      </div>
                      <div className={`text-xs ${textMuted} mt-0.5`}>
                        {percentage}% of chamber
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div 
                      className={`text-4xl font-black ${textColor} transition-transform duration-300 group-hover/party:scale-105`}
                      style={{ fontFamily: '"Corpline", sans-serif' }}
                    >
                      {partyData.count}
                    </div>
                    {chamber.netChange && (
                      <NetChangeIndicator
                        party={partyData.party}
                        netChange={chamber.netChange}
                        isDarkMode={isDarkMode}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Majority Threshold Indicator */}
        <div className={`mt-6 pt-6 border-t ${borderColor} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`} />
            <span className={`text-xs font-bold ${textColor} uppercase tracking-wide`}>
              Majority Threshold
            </span>
          </div>
          <span className={`text-lg font-black ${textColor}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
            {chamber.majorityThreshold}
          </span>
        </div>
      </div>
    </div>
  );
}

// Legislative Semicircle Component
interface LegislativeSemicircleProps {
  seatsByParty: { party: string; count: number; color: string }[];
  totalSeats: number;
  majorityThreshold: number;
  isDarkMode: boolean;
}

function LegislativeSemicircle({ seatsByParty, totalSeats, majorityThreshold, isDarkMode }: LegislativeSemicircleProps) {
  const svgWidth = 400;
  const svgHeight = 220;
  const centerX = svgWidth / 2;
  const centerY = svgHeight - 20;
  
  // Generate seat positions in concentric semicircular rows
  const seats: { x: number; y: number; party: string; color: string }[] = [];
  
  // Calculate rows (typically 4-6 rows for a legislative chamber)
  const numRows = Math.ceil(Math.sqrt(totalSeats / 2));
  const seatsPerRow: number[] = [];
  
  // Distribute seats across rows (inner rows have fewer seats)
  let remainingSeats = totalSeats;
  for (let row = 0; row < numRows; row++) {
    const rowSeats = Math.ceil(remainingSeats / (numRows - row));
    seatsPerRow.push(Math.min(rowSeats, Math.ceil((row + 1) * totalSeats / (numRows * 2))));
    remainingSeats -= seatsPerRow[row];
  }
  
  // Adjust to match total seats exactly
  const totalDistributed = seatsPerRow.reduce((sum, count) => sum + count, 0);
  if (totalDistributed !== totalSeats) {
    seatsPerRow[seatsPerRow.length - 1] += (totalSeats - totalDistributed);
  }
  
  // Position seats row by row
  let currentSeatIndex = 0;
  const baseRadius = 50;
  const rowSpacing = 28;
  const seatSize = 5;
  
  for (let rowIdx = 0; rowIdx < seatsPerRow.length; rowIdx++) {
    const rowRadius = baseRadius + (rowIdx * rowSpacing);
    const seatsInRow = seatsPerRow[rowIdx];
    
    for (let seatIdx = 0; seatIdx < seatsInRow; seatIdx++) {
      // Angle from 0 to π (180 degrees semicircle)
      const angle = Math.PI * (seatIdx / (seatsInRow - 1));
      
      const x = centerX + rowRadius * Math.cos(angle);
      const y = centerY - rowRadius * Math.sin(angle);
      
      // Find which party this seat belongs to
      let cumulativeCount = 0;
      let seatParty = seatsByParty[0];
      
      for (const partyData of seatsByParty) {
        if (currentSeatIndex < cumulativeCount + partyData.count) {
          seatParty = partyData;
          break;
        }
        cumulativeCount += partyData.count;
      }
      
      seats.push({
        x,
        y,
        party: seatParty.party,
        color: seatParty.color,
      });
      
      currentSeatIndex++;
    }
  }
  
  return (
    <div className="relative">
      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
        className="w-full h-auto"
        style={{ maxHeight: '220px' }}
      >
        {/* Background semicircle guide */}
        <path
          d={`M ${centerX - 180} ${centerY} A 180 180 0 0 1 ${centerX + 180} ${centerY}`}
          fill="none"
          stroke={isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
          strokeWidth="2"
        />
        
        {/* Majority threshold indicator line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX}
          y2={centerY - 200}
          stroke={isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        
        {/* Seats */}
        {seats.map((seat, idx) => (
          <circle
            key={idx}
            cx={seat.x}
            cy={seat.y}
            r={seatSize}
            fill={seat.color}
            className="transition-all duration-200 hover:opacity-70 cursor-pointer"
            style={{
              filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2))',
            }}
          >
            <title>{seat.party}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

interface NetChangeIndicatorProps {
  party: string;
  netChange: { party: string; change: number }[];
  isDarkMode: boolean;
}

function NetChangeIndicator({ party, netChange, isDarkMode }: NetChangeIndicatorProps) {
  const partyAbbrev = party.charAt(0).toUpperCase();
  const change = netChange.find(nc => nc.party === partyAbbrev)?.change || 0;
  
  if (change === 0) return null;
  
  return (
    <span className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg backdrop-blur-sm ${
      change > 0 
        ? isDarkMode
          ? 'bg-green-950/40 text-green-400 border border-green-500/30'
          : 'bg-green-100 text-green-700 border border-green-300' 
        : isDarkMode
          ? 'bg-red-950/40 text-red-400 border border-red-500/30'
          : 'bg-red-100 text-red-700 border border-red-300'
    }`}>
      {change > 0 ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />}
      {Math.abs(change)}
    </span>
  );
}