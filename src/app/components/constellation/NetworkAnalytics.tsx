import React from 'react';
import { motion } from 'motion/react';
import { X, Activity, TrendingUp, Users, Zap, AlertCircle, CheckCircle2, Target } from 'lucide-react';
import type { NetworkMetrics, NetworkNode, NetworkEdge } from '@/app/data/constellationData';

interface NetworkAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: NetworkMetrics;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  isDarkMode: boolean;
}

export function NetworkAnalytics({
  isOpen,
  onClose,
  metrics,
  nodes,
  edges,
  isDarkMode
}: NetworkAnalyticsProps) {
  if (!isOpen) return null;
  
  // Calculate top influencers
  const topInfluencers = [...nodes]
    .sort((a, b) => b.influenceScore - a.influenceScore)
    .slice(0, 5);
  
  // Health score color
  const getHealthColor = (score: number) => {
    if (score >= 75) return 'green';
    if (score >= 50) return 'yellow';
    return 'red';
  };
  
  const healthColor = getHealthColor(metrics.healthScore);
  
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
        animate={{ opacity: 1, scale: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Network Analytics
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Performance metrics and insights
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
            {/* Network Health Score */}
            <div className={`p-6 rounded-xl border-2 ${
              healthColor === 'green' 
                ? 'bg-green-600/10 border-green-500/30' 
                : healthColor === 'yellow'
                ? 'bg-yellow-600/10 border-yellow-500/30'
                : 'bg-red-600/10 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Network Health
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Overall network effectiveness
                  </p>
                </div>
                <div className={`text-5xl font-bold text-${healthColor}-600`}>
                  {metrics.healthScore}
                  <span className="text-2xl">/100</span>
                </div>
              </div>
              
              <div className={`w-full h-3 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
              }`}>
                <div
                  className={`h-full bg-${healthColor}-600 transition-all`}
                  style={{ width: `${metrics.healthScore}%` }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Strong Core
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      12 key relationships
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Limited Opposition
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Only 2 opponent contacts
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Recommendation
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Add 3 bridge connections
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-600/10">
                    <Zap size={20} className="text-blue-600" />
                  </div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Network Density
                  </h4>
                </div>
                <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.round(metrics.networkDensity * 100)}%
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {metrics.networkDensity >= 0.4 ? 'Good' : 'Needs improvement'} - {metrics.totalConnections} total connections
                </p>
              </div>
              
              <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-600/10">
                    <Users size={20} className="text-purple-600" />
                  </div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Clustering
                  </h4>
                </div>
                <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.round(metrics.clusteringCoefficient * 100)}%
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Network interconnectedness level
                </p>
              </div>
              
              <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-600/10">
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Avg Path Length
                  </h4>
                </div>
                <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metrics.averagePathLength.toFixed(1)}
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Steps to reach any entity
                </p>
              </div>
              
              <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-600/10">
                    <Activity size={20} className="text-amber-600" />
                  </div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                  </h4>
                </div>
                <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metrics.recentActivity}
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Interactions in last 30 days
                </p>
              </div>
            </div>
            
            {/* Connection Strength */}
            <div>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Connection Strength Distribution
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      Strong Connections (8-10)
                    </span>
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {metrics.strongConnections} ({Math.round((metrics.strongConnections / metrics.totalConnections) * 100)}%)
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full rounded-full bg-green-600"
                      style={{ width: `${(metrics.strongConnections / metrics.totalConnections) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      Weak Connections (1-7)
                    </span>
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {metrics.weakConnections} ({Math.round((metrics.weakConnections / metrics.totalConnections) * 100)}%)
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full rounded-full bg-yellow-600"
                      style={{ width: `${(metrics.weakConnections / metrics.totalConnections) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Top Influencers */}
            <div>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Top 5 Network Influencers
              </h3>
              <div className="space-y-2">
                {topInfluencers.map((node, idx) => (
                  <div
                    key={node.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          idx === 0 ? 'bg-yellow-600 text-white' :
                          idx === 1 ? 'bg-gray-400 text-white' :
                          idx === 2 ? 'bg-amber-700 text-white' :
                          'bg-slate-600 text-white'
                        }`}>
                          #{idx + 1}
                        </div>
                        <div>
                          <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {node.label}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {node.influenceScore.toFixed(1)}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Influence
                        </div>
                      </div>
                    </div>
                    <div className={`w-full h-1.5 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full rounded-full bg-purple-600"
                        style={{ width: `${(node.influenceScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}