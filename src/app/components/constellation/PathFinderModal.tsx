import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, GitBranch, TrendingUp, Clock, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import type { NetworkNode } from '@/app/data/constellationData';
import { findShortestPaths } from '@/app/data/constellationData';

interface PathFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: NetworkNode[];
  onPathSelected: (path: string[]) => void;
  isDarkMode: boolean;
}

export function PathFinderModal({
  isOpen,
  onClose,
  nodes,
  onPathSelected,
  isDarkMode
}: PathFinderModalProps) {
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [paths, setPaths] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = () => {
    if (!sourceNode || !targetNode) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      const results = findShortestPaths(sourceNode, targetNode, 5);
      setPaths(results);
      setIsSearching(false);
    }, 800);
  };
  
  const handleSelectPath = (path: string[]) => {
    onPathSelected(path);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Find Path To...
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Discover connection pathways between stakeholders
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              }`}
            >
              <X size={20} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Search Form */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  From
                </label>
                <select
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select source...</option>
                  {nodes.filter(n => n.type === 'client' || n.type === 'legislator').map(node => (
                    <option key={node.id} value={node.id}>
                      {node.label} ({node.type})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  To
                </label>
                <select
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select target...</option>
                  {nodes.filter(n => n.type === 'legislator' && n.id !== sourceNode).map(node => (
                    <option key={node.id} value={node.id}>
                      {node.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={!sourceNode || !targetNode || isSearching}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                !sourceNode || !targetNode || isSearching
                  ? isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculating paths...
                </>
              ) : (
                <>
                  <GitBranch size={18} />
                  Find Paths
                </>
              )}
            </button>
            
            {/* Results */}
            {paths.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Top {paths.length} Paths
                  </h3>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Sorted by success probability
                  </span>
                </div>
                
                {paths.map((pathResult, idx) => {
                  const sourceLabel = nodes.find(n => n.id === pathResult.path[0])?.label || '';
                  const targetLabel = nodes.find(n => n.id === pathResult.path[pathResult.path.length - 1])?.label || '';
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-5 rounded-xl border ${
                        idx === 0
                          ? isDarkMode 
                            ? 'bg-blue-600/10 border-blue-500/30' 
                            : 'bg-blue-50 border-blue-200'
                          : isDarkMode 
                            ? 'bg-slate-900 border-slate-700' 
                            : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {/* Path Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {idx === 0 && (
                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-600 text-white">
                              BEST PATH
                            </span>
                          )}
                          <span className={`text-sm font-medium ${
                            isDarkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>
                            Path {idx + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${
                              pathResult.score >= 80 
                                ? 'text-green-600' 
                                : pathResult.score >= 60 
                                ? 'text-yellow-600' 
                                : 'text-orange-600'
                            }`}>
                              {pathResult.score}%
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                              Success
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Path Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <GitBranch size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                              Steps
                            </span>
                          </div>
                          <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {pathResult.length}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                              Timeline
                            </span>
                          </div>
                          <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {pathResult.estimatedTimeline}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                              Rating
                            </span>
                          </div>
                          <div className={`text-lg font-bold ${
                            pathResult.score >= 80 ? 'text-green-600' : pathResult.score >= 60 ? 'text-yellow-600' : 'text-orange-600'
                          }`}>
                            {pathResult.score >= 80 ? 'Excellent' : pathResult.score >= 60 ? 'Good' : 'Fair'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Path Visualization */}
                      <div className="mb-4">
                        <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Connection Path
                        </div>
                        <div className="space-y-2">
                          {pathResult.intermediateConnections.map((conn: any, connIdx: number) => (
                            <div key={connIdx} className="flex items-start gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  connIdx === 0 
                                    ? 'bg-purple-600 text-white'
                                    : connIdx === pathResult.intermediateConnections.length - 1
                                    ? 'bg-green-600 text-white'
                                    : 'bg-blue-600 text-white'
                                }`}>
                                  {connIdx + 1}
                                </div>
                                {connIdx < pathResult.intermediateConnections.length - 1 && (
                                  <div className={`w-0.5 h-12 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
                                )}
                              </div>
                              <div className="flex-1 pt-1">
                                <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {conn.from} → {conn.to}
                                </div>
                                <div className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                  {conn.context}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className={`flex-1 h-1.5 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                    <div
                                      className="h-full rounded-full bg-blue-600"
                                      style={{ width: `${(conn.relationshipStrength / 10) * 100}%` }}
                                    />
                                  </div>
                                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                    {conn.relationshipStrength}/10
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Recommendations */}
                      {pathResult.recommendations.length > 0 && (
                        <div className={`p-4 rounded-lg ${
                          isDarkMode ? 'bg-blue-600/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                        }`}>
                          <div className="flex items-start gap-2 mb-3">
                            <Lightbulb size={16} className="text-blue-600 mt-0.5" />
                            <h4 className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>
                              Recommended Actions
                            </h4>
                          </div>
                          <ol className="space-y-2">
                            {pathResult.recommendations.map((rec: string, recIdx: number) => (
                              <li key={recIdx} className={`text-sm flex gap-2 ${
                                isDarkMode ? 'text-blue-300' : 'text-blue-900'
                              }`}>
                                <span className="font-bold">{recIdx + 1}.</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <button
                        onClick={() => handleSelectPath(pathResult.path)}
                        className={`w-full mt-4 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                          idx === 0
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : isDarkMode
                              ? 'bg-slate-700 hover:bg-slate-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        }`}
                      >
                        <CheckCircle2 size={16} />
                        Highlight This Path
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {/* Empty State */}
            {paths.length === 0 && !isSearching && sourceNode && targetNode && (
              <div className="text-center py-12">
                <GitBranch size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Click "Find Paths" to discover connection pathways
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}