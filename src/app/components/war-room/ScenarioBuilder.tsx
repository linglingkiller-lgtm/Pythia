import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { mockScenarios, ScenarioNode } from '../../data/warGamesData';
import { useTheme } from '../../contexts/ThemeContext';
import { GitBranch, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export function ScenarioBuilder() {
  const { isDarkMode } = useTheme();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('root');

  // Build tree structure
  const tree = useMemo(() => {
    const nodes = mockScenarios;
    const getChildren = (id: string) => nodes.filter(n => n.parentId === id);
    return { nodes, getChildren };
  }, []);

  const selectedNode = mockScenarios.find(n => n.id === selectedNodeId);

  const getNodeIcon = (type: ScenarioNode['type']) => {
    switch (type) {
      case 'root': return <GitBranch size={16} />;
      case 'event': return <AlertTriangle size={16} />;
      case 'outcome': return <CheckCircle size={16} />;
      default: return <GitBranch size={16} />;
    }
  };

  const getNodeColor = (type: ScenarioNode['type'], prob: number) => {
    if (type === 'root') return 'border-blue-500 bg-blue-500/10 text-blue-500';
    if (prob >= 70) return 'border-emerald-500 bg-emerald-500/10 text-emerald-500';
    if (prob <= 30) return 'border-red-500 bg-red-500/10 text-red-500';
    return 'border-amber-500 bg-amber-500/10 text-amber-500';
  };

  // Render a node and its children recursively
  const renderNode = (node: ScenarioNode, depth: number = 0) => {
    const children = tree.getChildren(node.id);
    const isSelected = selectedNodeId === node.id;

    return (
      <div key={node.id} className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: depth * 0.1 }}
          onClick={() => setSelectedNodeId(node.id)}
          className={`
            relative w-64 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
            ${isSelected ? 'ring-4 ring-blue-500/20 shadow-xl scale-105' : 'hover:shadow-md hover:scale-102'}
            ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
            ${getNodeColor(node.type, node.probability)}
          `}
        >
          {/* Probability Badge */}
          <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-slate-900 text-white text-xs font-bold border border-white/20 shadow-sm">
            {node.probability}% Prob
          </div>

          <div className="flex items-center gap-2 mb-2">
            {getNodeIcon(node.type)}
            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{node.label}</h4>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{node.description}</p>
        </motion.div>

        {children.length > 0 && (
          <div className="flex flex-col items-center">
            {/* Connector Line */}
            <div className={`h-8 w-0.5 ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
            
            {/* Branch Horizontal Line if multiple children */}
            {children.length > 1 && (
              <div className="relative h-px w-[calc(100%-4rem)] bg-transparent">
                 <div className={`absolute top-0 left-1/4 right-1/4 h-0.5 ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
              </div>
            )}

            {/* Children Container */}
            <div className="flex gap-8 mt-2">
              {children.map(child => renderNode(child, depth + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        <div className="min-w-max flex justify-center pb-20">
          {mockScenarios.find(n => n.type === 'root') && renderNode(mockScenarios.find(n => n.type === 'root')!)}
        </div>
      </div>

      {/* Impact Analysis Panel (Bottom Sheet style) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNodeId}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={`h-64 border-t p-6 ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'} shadow-[0_-10px_40px_rgba(0,0,0,0.1)]`}
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Projected Impacts: {selectedNode?.label}
            </h3>
            
            {selectedNode?.impacts && selectedNode.impacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedNode.impacts.map((impact, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{impact.entity}</span>
                      <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${
                        impact.impact === 'positive' ? 'bg-emerald-500/20 text-emerald-500' :
                        impact.impact === 'negative' ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-500'
                      }`}>
                        {impact.impact}
                      </span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{impact.description}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className={`h-1.5 flex-1 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                         <div 
                           className={`h-full rounded-full ${impact.severity === 'high' ? 'bg-red-500' : impact.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} 
                           style={{ width: impact.severity === 'high' ? '100%' : impact.severity === 'medium' ? '60%' : '30%' }} 
                         />
                      </div>
                      <span className="text-[10px] opacity-60 uppercase">{impact.severity} Severity</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-32 opacity-50">
                 <p>No specific impacts modeled for this node.</p>
               </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
