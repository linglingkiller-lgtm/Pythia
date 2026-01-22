import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { NetworkNode, NetworkEdge } from '@/app/data/constellationData';

interface ScenarioBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  isDarkMode: boolean;
}

export function ScenarioBuilder({
  isOpen,
  onClose,
  nodes,
  edges,
  isDarkMode
}: ScenarioBuilderProps) {
  const [scenarioType, setScenarioType] = useState<'lose' | 'gain' | 'bill' | 'switch'>('lose');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const scenarios = [
    { id: 'lose', label: 'Lose Support', icon: TrendingDown, color: 'red' },
    { id: 'gain', label: 'Add Partner', icon: TrendingUp, color: 'green' },
    { id: 'bill', label: 'Bill Passes', icon: CheckCircle2, color: 'blue' },
    { id: 'switch', label: 'Position Switch', icon: AlertTriangle, color: 'amber' }
  ];
  
  const handleRun = () => {
    // Mock scenario results
    setResult({
      healthChange: scenarioType === 'lose' ? -16 : scenarioType === 'gain' ? +12 : -8,
      affectedNodes: scenarioType === 'lose' ? 3 : 5,
      recommendations: scenarioType === 'lose' 
        ? [
          'Activate backup path through Rep. Chen',
          'Schedule emergency coalition call',
          'Strengthen relationship with Sen. Davis'
        ]
        : [
          'Leverage new connection for committee access',
          'Coordinate joint advocacy campaign',
          'Share contact with aligned partners'
        ]
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Scenario Builder
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Model "what-if" scenarios
                </p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Scenario Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setScenarioType(scenario.id as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    scenarioType === scenario.id
                      ? `border-${scenario.color}-600 bg-${scenario.color}-600/10`
                      : isDarkMode ? 'border-slate-700 hover:border-slate-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <scenario.icon size={24} className={`mb-2 ${scenarioType === scenario.id ? `text-${scenario.color}-600` : isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {scenario.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Select Entity
            </label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Choose entity...</option>
              {nodes.filter(n => n.type === 'legislator').map(node => (
                <option key={node.id} value={node.id}>{node.label}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleRun}
            disabled={!selectedEntity}
            className={`w-full px-6 py-3 rounded-lg font-medium ${
              selectedEntity ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Run Scenario
          </button>
          
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}
            >
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Scenario Impact
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Health Score Change
                  </div>
                  <div className={`text-2xl font-bold ${result.healthChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {result.healthChange > 0 ? '+' : ''}{result.healthChange}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Affected Entities
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {result.affectedNodes}
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-600/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>
                  Recommended Response
                </h4>
                <ol className="space-y-1">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                      {idx + 1}. {rec}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}