import React from 'react';
import { ChamberSummary } from './chamberData';
import { TrendingUp, TrendingDown, Clock, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

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

  // Theme-aware colors
  const bgColor = isDarkMode ? 'bg-slate-800/40' : 'bg-white/40';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  
  return (
    <div 
      className={`relative overflow-hidden border ${borderColor} ${bgColor} backdrop-blur-md rounded-lg hover:shadow-2xl transition-all duration-300 group`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top Border Accent */}
      <div 
        className="h-1 transition-all duration-500"
        style={{ 
          backgroundColor: controlPartyData?.color,
          opacity: isHovered ? 1 : 0.6
        }}
      />
      
      <div className="relative p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h3 
              className={`text-2xl font-bold ${textColor} tracking-tight`}
              style={{ fontFamily: '"Corpline", sans-serif' }}
            >
              {chamber.chamberName}
            </h3>
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'} group-hover:scale-110 transition-transform duration-300`}>
              <Shield 
                size={24} 
                className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}
              />
            </div>
          </div>
          <div className={`flex items-center gap-2 text-xs ${textMuted}`}>
            <Clock size={12} className="opacity-60" />
            <span className="font-medium">{chamber.lastUpdated}</span>
          </div>
        </div>

        {/* Control Badge - Modern Glassmorphic */}
        <div className={`relative overflow-hidden mb-8 p-6 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
          controlPartyData?.party === 'Republican' 
            ? isDarkMode 
              ? 'bg-red-950/30 border-red-500/30' 
              : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/50'
            : isDarkMode
              ? 'bg-blue-950/30 border-blue-500/30'
              : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="w-3 h-3 rounded-full animate-slow-pulse shadow-lg"
              style={{ backgroundColor: controlPartyData?.color }}
            />
            <div 
              className="text-sm font-bold tracking-wide uppercase" 
              style={{ color: controlPartyData?.color }}
            >
              {controlPartyData?.party}s Control
            </div>
          </div>
          <div 
            className="text-5xl font-black tracking-tight mb-2" 
            style={{ 
              color: controlPartyData?.color,
              fontFamily: '"Corpline", sans-serif'
            }}
          >
            {controlPartyData?.count}
          </div>
          <div className={`text-sm ${textMuted} font-semibold`}>
            of {chamber.totalSeats} seats • Majority: {chamber.majorityThreshold}
          </div>
        </div>

        {/* Seat Breakdown Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 text-sm">
            <span className={`font-bold ${textColor} uppercase tracking-wide text-xs`}>Seat Distribution</span>
            <span className={`${textMuted} font-semibold text-xs`}>{chamber.totalSeats} total</span>
          </div>
          
          <div className={`relative h-14 ${isDarkMode ? 'bg-slate-900/60' : 'bg-gray-100'} rounded-xl overflow-hidden shadow-lg border ${borderColor}`}>
            {chamber.seatsByParty.map((partyData, idx) => (
              <div
                key={idx}
                className="absolute top-0 bottom-0 flex items-center justify-center text-white font-bold text-sm transition-all duration-700 ease-out hover:brightness-110 cursor-pointer group/seat"
                style={{
                  left: `${chamber.seatsByParty.slice(0, idx).reduce((sum, p) => sum + (p.count / chamber.totalSeats) * 100, 0)}%`,
                  width: `${(partyData.count / chamber.totalSeats) * 100}%`,
                  backgroundColor: partyData.color,
                  transitionDelay: `${idx * 150}ms`,
                }}
                title={`${partyData.party}: ${partyData.count} seats`}
              >
                <span className="drop-shadow-lg text-base font-black group-hover/seat:scale-110 transition-transform">{partyData.count}</span>
              </div>
            ))}
            
            {/* Majority Threshold Line */}
            <div
              className={`absolute top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-white' : 'bg-gray-900'} z-10 transition-all duration-300 opacity-80`}
              style={{ left: `${(chamber.majorityThreshold / chamber.totalSeats) * 100}%` }}
              title={`Majority threshold: ${chamber.majorityThreshold}`}
            >
              <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-5 ${isDarkMode ? 'bg-white' : 'bg-gray-900'} rounded-full shadow-lg border-2 ${isDarkMode ? 'border-slate-800' : 'border-white'}`} />
              <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 ${isDarkMode ? 'bg-white' : 'bg-gray-900'} rounded-full shadow-lg border-2 ${isDarkMode ? 'border-slate-800' : 'border-white'}`} />
            </div>
          </div>
          
          {/* Threshold Label */}
          <div className="mt-3 text-center">
            <span className={`inline-block px-3 py-1.5 ${isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} text-xs font-bold rounded-full shadow-md`}>
              MAJORITY LINE
            </span>
          </div>
        </div>

        {/* Party Details */}
        <div className={`space-y-3 pt-6 border-t ${borderColor}`}>
          {chamber.seatsByParty.map((partyData, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-4 rounded-xl border ${borderColor} ${
                isDarkMode ? 'bg-slate-800/40 hover:bg-slate-700/60' : 'bg-white/40 hover:bg-white/80'
              } backdrop-blur-sm transition-all duration-200 hover:shadow-lg group/party`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full shadow-lg ring-2 ring-white/20"
                  style={{ backgroundColor: partyData.color }}
                />
                <span className={`font-bold ${textColor} text-lg`}>{partyData.party}</span>
              </div>
              <div className="flex items-center gap-4">
                <span 
                  className={`text-3xl font-black ${textColor} group-hover/party:scale-110 transition-transform`}
                  style={{ fontFamily: '"Corpline", sans-serif' }}
                >
                  {partyData.count}
                </span>
                {chamber.netChange && (
                  <NetChangeIndicator
                    party={partyData.party}
                    netChange={chamber.netChange}
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
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