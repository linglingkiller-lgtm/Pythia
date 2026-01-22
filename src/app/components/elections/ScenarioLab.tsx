import React, { useState } from 'react';
import { RefreshCcw, Save, Play } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { GlassCard } from './ElectionSharedComponents';
import { Button } from '../ui/Button';

interface ScenarioLabProps {
  onModifierChange: (score: number) => void;
}

export const ScenarioLab: React.FC<ScenarioLabProps> = ({ onModifierChange }) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Scenario Sliders
  const [timePressure, setTimePressure] = useState(50);
  const [fundraisingGap, setFundraisingGap] = useState(50);
  const [opponentCred, setOpponentCred] = useState(30);
  const [narrativeHeat, setNarrativeHeat] = useState(20);
  const [volatility, setVolatility] = useState(40);

  // Simple modifier logic
  const calculateModifier = () => {
    let mod = 0;
    mod += (timePressure - 50) * 0.1;
    mod += (fundraisingGap - 50) * 0.2;
    mod += (opponentCred - 30) * 0.2;
    mod += (narrativeHeat - 20) * 0.3;
    mod += (volatility - 40) * 0.1;
    return Math.round(mod);
  };

  React.useEffect(() => {
    onModifierChange(calculateModifier());
  }, [timePressure, fundraisingGap, opponentCred, narrativeHeat, volatility]);

  const resetScenarios = () => {
    setTimePressure(50);
    setFundraisingGap(50);
    setOpponentCred(30);
    setNarrativeHeat(20);
    setVolatility(40);
  };

  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
          isOpen 
            ? isDarkMode ? 'bg-indigo-900/30 border-indigo-500/50' : 'bg-indigo-50 border-indigo-200'
            : isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
            <Play size={14} fill="currentColor" />
          </div>
          <span className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Scenario Lab
          </span>
        </div>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {isOpen ? 'Close Simulator' : 'Simulate What-Ifs'}
        </span>
      </button>

      {isOpen && (
        <GlassCard className="mt-3 p-4 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SliderControl 
                label="Time-to-Election Pressure" 
                value={timePressure} 
                onChange={setTimePressure} 
                minLabel="Far out" 
                maxLabel="Imminent"
                isDarkMode={isDarkMode}
              />
              <SliderControl 
                label="Fundraising Gap" 
                value={fundraisingGap} 
                onChange={setFundraisingGap} 
                minLabel="Ahead" 
                maxLabel="Behind"
                isDarkMode={isDarkMode}
              />
              <SliderControl 
                label="Opponent Credibility" 
                value={opponentCred} 
                onChange={setOpponentCred} 
                minLabel="Low" 
                maxLabel="High"
                isDarkMode={isDarkMode}
              />
            </div>
            <div className="space-y-4">
              <SliderControl 
                label="Narrative Heat Spike" 
                value={narrativeHeat} 
                onChange={setNarrativeHeat} 
                minLabel="Quiet" 
                maxLabel="Crisis"
                isDarkMode={isDarkMode}
              />
              <SliderControl 
                label="Ballot Volatility" 
                value={volatility} 
                onChange={setVolatility} 
                minLabel="Stable" 
                maxLabel="Volatile"
                isDarkMode={isDarkMode}
              />
              
              <div className="flex items-end justify-between pt-2">
                <Button variant="secondary" size="sm" onClick={resetScenarios}>
                  <RefreshCcw size={14} className="mr-1.5" />
                  Reset
                </Button>
                <Button variant="primary" size="sm">
                  <Save size={14} className="mr-1.5" />
                  Save Scenario
                </Button>
              </div>
            </div>
          </div>
          
          <div className={`mt-4 pt-3 border-t text-xs text-center ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            Adjusting sliders updates vulnerability score and re-ranks opportunity feed in real-time.
          </div>
        </GlassCard>
      )}
    </div>
  );
};

const SliderControl = ({ label, value, onChange, minLabel, maxLabel, isDarkMode }: any) => (
  <div>
    <div className="flex justify-between text-xs mb-1.5">
      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>{value}%</span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
      } accent-indigo-500`}
    />
    <div className="flex justify-between text-[10px] mt-1 text-gray-500">
      <span>{minLabel}</span>
      <span>{maxLabel}</span>
    </div>
  </div>
);
