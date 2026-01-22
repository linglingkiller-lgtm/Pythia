import React, { useState } from 'react';
import { RefreshCcw, Play, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { GlassPanel } from '../shared/ElectionsSharedComponents';
import { Button } from '../../ui/Button';

export const ForecastSimulator = () => {
  const { isDarkMode } = useTheme();
  
  const [params, setParams] = useState({
    nationalEnv: 0, // -10 (R wave) to +10 (D wave)
    turnout: 0, // -5 to +5
    fundraising: 0, // -20% to +20%
    youthVote: 0 // -5 to +5
  });

  // Derived outcomes (mock)
  const predictedSeatChange = Math.round(params.nationalEnv * 0.8 + params.turnout * 0.5 + params.fundraising * 0.1);
  const confidence = Math.max(50, 90 - Math.abs(params.nationalEnv) * 2);

  const Slider = ({ label, value, min, max, onChange, unit = '' }: any) => (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-medium mb-2 text-gray-500">
        <span>{label}</span>
        <span className={value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : ''}>
          {value > 0 ? '+' : ''}{value}{unit}
        </span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Controls */}
      <GlassPanel className="p-6 col-span-1">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Play size={20} />
          </div>
          <div>
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Scenario Builder</h3>
            <p className="text-xs text-gray-500">Adjust variables to forecast outcomes</p>
          </div>
        </div>

        <Slider 
          label="National Environment (Generic Ballot)" 
          value={params.nationalEnv} 
          min={-10} max={10} 
          unit=" pts"
          onChange={(v: number) => setParams(p => ({ ...p, nationalEnv: v }))} 
        />
        <Slider 
          label="Voter Turnout Variance" 
          value={params.turnout} 
          min={-5} max={5} 
          unit="%"
          onChange={(v: number) => setParams(p => ({ ...p, turnout: v }))} 
        />
        <Slider 
          label="Fundraising Advantage" 
          value={params.fundraising} 
          min={-20} max={20} 
          unit="%"
          onChange={(v: number) => setParams(p => ({ ...p, fundraising: v }))} 
        />
        <Slider 
          label="Youth Vote Share Shift" 
          value={params.youthVote} 
          min={-5} max={5} 
          unit="%"
          onChange={(v: number) => setParams(p => ({ ...p, youthVote: v }))} 
        />

        <div className="mt-8 flex gap-2">
           <Button variant="primary" className="w-full justify-center">Run Simulation</Button>
           <Button variant="secondary" onClick={() => setParams({ nationalEnv: 0, turnout: 0, fundraising: 0, youthVote: 0 })}>
             <RefreshCcw size={16} />
           </Button>
        </div>
      </GlassPanel>

      {/* Results */}
      <div className="col-span-2 space-y-6">
        {/* Top line prediction */}
        <div className="grid grid-cols-3 gap-4">
           <GlassPanel className="p-4 text-center">
             <div className="text-xs font-bold uppercase text-gray-500 mb-2">Net Seat Change</div>
             <div className={`text-4xl font-black ${predictedSeatChange > 0 ? 'text-blue-500' : predictedSeatChange < 0 ? 'text-red-500' : 'text-gray-500'}`}>
               {predictedSeatChange > 0 ? '+' : ''}{predictedSeatChange}
             </div>
             <div className="text-xs mt-1 text-gray-400">Seats</div>
           </GlassPanel>

           <GlassPanel className="p-4 text-center">
             <div className="text-xs font-bold uppercase text-gray-500 mb-2">Chamber Control</div>
             <div className="text-xl font-bold text-gray-900 dark:text-white mt-2">
               {predictedSeatChange > 2 ? 'Strong Dem' : predictedSeatChange < -2 ? 'Strong Rep' : 'Split / Tossup'}
             </div>
           </GlassPanel>

           <GlassPanel className="p-4 text-center">
             <div className="text-xs font-bold uppercase text-gray-500 mb-2">Model Confidence</div>
             <div className="relative w-24 h-24 mx-auto mt-2 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                   <circle cx="48" cy="48" r="40" fill="none" stroke={isDarkMode ? '#334155' : '#e2e8f0'} strokeWidth="8" />
                   <circle 
                     cx="48" cy="48" r="40" 
                     fill="none" 
                     stroke="#6366f1" 
                     strokeWidth="8" 
                     strokeDasharray={`${2 * Math.PI * 40}`} 
                     strokeDashoffset={`${2 * Math.PI * 40 * (1 - confidence / 100)}`}
                     strokeLinecap="round"
                   />
                </svg>
                <span className="text-xl font-bold text-indigo-500">{confidence}%</span>
             </div>
           </GlassPanel>
        </div>

        {/* Impact Breakdown Chart (Mock) */}
        <GlassPanel className="p-6 flex-1">
           <h4 className={`text-sm font-bold uppercase mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Impact Distribution by Region</h4>
           <div className="h-48 flex items-end gap-2">
              {[45, 60, 30, 80, 55, 40, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <div 
                     className="w-full bg-indigo-500/50 rounded-t transition-all group-hover:bg-indigo-500" 
                     style={{ height: `${h}%` }} 
                   />
                   <span className="text-[10px] text-gray-500">Reg {i+1}</span>
                </div>
              ))}
           </div>
        </GlassPanel>
      </div>
    </div>
  );
};
