import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Search, Filter, Layout, Download, Maximize2, Minimize2,
  TrendingUp, GitBranch, Activity, Zap, X, ChevronRight, ChevronLeft,
  Users, Building, FileText, Flag, Tag, UserCircle, Settings, Eye, EyeOff,
  ZoomIn, ZoomOut, Locate, RotateCcw, Play, Pause, Calendar, MapPin
} from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import { useTheme } from '@/app/contexts/ThemeContext';
import { 
  demoNetworkNodes, 
  demoNetworkEdges,
  demoNetworkMetrics,
  findShortestPaths,
  type NetworkNode,
  type NetworkEdge,
  type PathResult
} from '@/app/data/constellationData';
import { PathFinderModal } from '@/app/components/constellation/PathFinderModal';
import { NodeDetailPanel } from '@/app/components/constellation/NodeDetailPanel';
import { NetworkControls } from '@/app/components/constellation/NetworkControls';
import { ReportGenerator } from '@/app/components/constellation/ReportGenerator';
import { NetworkAnalytics } from '@/app/components/constellation/NetworkAnalytics';
import { ScenarioBuilder } from '@/app/components/constellation/ScenarioBuilder';

export default function ConstellationPage() {
  const { isDarkMode } = useTheme();
  const graphRef = useRef<any>();
  
  // State
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [showPathFinder, setShowPathFinder] = useState(false);
  const [showReportGen, setShowReportGen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showScenario, setShowScenario] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(true);
  
  // Filters
  const [activeFilters, setActiveFilters] = useState({
    bills: true,
    legislators: true,
    clients: true,
    committees: true,
    issues: true,
    stakeholders: true,
    staff: true,
    sponsors: true,
    supporters: true,
    opponents: true,
    neutral: true
  });
  
  const [layoutMode, setLayoutMode] = useState<'force' | 'hierarchical' | 'circular' | 'cluster'>('force');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | '30' | '60' | '90'>('all');
  
  // Graph data with filters applied
  const filteredData = useMemo(() => {
    const filteredNodes = demoNetworkNodes.filter(node => {
      // Type filter
      if (!activeFilters[node.type + 's' as keyof typeof activeFilters]) return false;
      
      // Search filter
      if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Time range filter
      if (timeRange !== 'all') {
        const daysAgo = parseInt(timeRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        if (node.lastUpdated < cutoffDate) return false;
      }
      
      return true;
    });
    
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = demoNetworkEdges.filter(edge => {
      // Only include edges where both nodes are visible
      if (!filteredNodeIds.has(edge.source) || !filteredNodeIds.has(edge.target)) {
        return false;
      }
      
      // Relationship type filter
      if (edge.type === 'support' && !activeFilters.supporters) return false;
      if (edge.type === 'oppose' && !activeFilters.opponents) return false;
      if (edge.type === 'neutral' && !activeFilters.neutral) return false;
      if (edge.type === 'sponsor' && !activeFilters.sponsors) return false;
      
      return true;
    });
    
    return {
      nodes: filteredNodes,
      links: filteredEdges.map(e => ({
        source: e.source,
        target: e.target,
        type: e.type,
        weight: e.weight,
        sentiment: e.sentiment
      }))
    };
  }, [activeFilters, searchQuery, timeRange]);
  
  // Node color based on type
  const getNodeColor = (node: NetworkNode) => {
    const colors = {
      bill: isDarkMode ? '#3b82f6' : '#2563eb',
      legislator: isDarkMode ? '#10b981' : '#059669',
      client: isDarkMode ? '#8b5cf6' : '#7c3aed',
      committee: isDarkMode ? '#f59e0b' : '#d97706',
      issue: isDarkMode ? '#ec4899' : '#db2777',
      stakeholder: isDarkMode ? '#06b6d4' : '#0891b2',
      staff: isDarkMode ? '#6366f1' : '#4f46e5'
    };
    return colors[node.type];
  };
  
  // Node size based on influence score
  const getNodeSize = (node: NetworkNode) => {
    return 3 + (node.influenceScore * 0.8);
  };
  
  // Link color based on sentiment
  const getLinkColor = (link: any) => {
    if (link.sentiment === 'positive') return isDarkMode ? '#10b981' : '#059669';
    if (link.sentiment === 'negative') return isDarkMode ? '#ef4444' : '#dc2626';
    return isDarkMode ? '#64748b' : '#94a3b8';
  };
  
  // Link width based on weight
  const getLinkWidth = (link: any) => {
    return link.weight / 5;
  };
  
  // Handle node click
  const handleNodeClick = useCallback((node: any) => {
    const fullNode = demoNetworkNodes.find(n => n.id === node.id);
    if (fullNode) {
      setSelectedNode(fullNode);
      setIsDetailPanelOpen(true);
    }
  }, []);
  
  // Handle node hover
  const handleNodeHover = useCallback((node: any) => {
    // Force graph library doesn't support dynamic nodeColor updates this way
    // Just update state if needed
  }, []);
  
  // Center on node
  const centerOnNode = (nodeId: string) => {
    const node = filteredData.nodes.find(n => n.id === nodeId);
    if (node && graphRef.current) {
      graphRef.current.centerAt(node.position?.x || 0, node.position?.y || 0, 1000);
      graphRef.current.zoom(1.5, 1000);
    }
  };
  
  // Reset view
  const resetView = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  };
  
  // Toggle filter
  const toggleFilter = (filterKey: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };
  
  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Constellation
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Stakeholder Intelligence Network
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Quick Stats */}
              <div className={`hidden lg:flex items-center gap-4 px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-purple-500" />
                  <div className="text-xs">
                    <div className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>Health</div>
                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {demoNetworkMetrics.healthScore}/100
                    </div>
                  </div>
                </div>
                <div className={`w-px h-8 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-500" />
                  <div className="text-xs">
                    <div className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>Connections</div>
                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {demoNetworkMetrics.totalConnections}
                    </div>
                  </div>
                </div>
                <div className={`w-px h-8 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-blue-500" />
                  <div className="text-xs">
                    <div className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>Density</div>
                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {Math.round(demoNetworkMetrics.networkDensity * 100)}%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showAnalytics
                    ? 'bg-purple-600 text-white'
                    : isDarkMode 
                      ? 'bg-slate-700 text-white hover:bg-slate-600' 
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                <Activity size={18} />
              </button>
              
              <button
                onClick={() => setShowPathFinder(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <GitBranch size={18} className="mr-2 inline" />
                Find Path
              </button>
              
              <button
                onClick={() => setShowReportGen(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Download size={18} className="mr-2 inline" />
                Generate Report
              </button>
              
              <button
                onClick={() => setIsPresentationMode(!isPresentationMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-slate-700 text-slate-300' 
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
                title={isPresentationMode ? "Exit Presentation Mode" : "Enter Presentation Mode"}
              >
                {isPresentationMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        {!isPresentationMode && (
          <NetworkControls
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            layoutMode={layoutMode}
            setLayoutMode={setLayoutMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            isDarkMode={isDarkMode}
            onResetView={resetView}
          />
        )}
        
        {/* Center - Network Visualization */}
        <div className="flex-1 relative">
          <ForceGraph2D
            ref={graphRef}
            graphData={filteredData}
            nodeLabel={(node: any) => node.label}
            nodeColor={(node: any) => {
              const fullNode = demoNetworkNodes.find(n => n.id === node.id);
              if (!fullNode) return '#gray';
              
              // Highlight selected node
              if (selectedNode?.id === node.id) {
                return '#fbbf24';
              }
              
              // Highlight path
              if (highlightedPath.includes(node.id)) {
                return '#f59e0b';
              }
              
              return getNodeColor(fullNode);
            }}
            nodeVal={(node: any) => {
              const fullNode = demoNetworkNodes.find(n => n.id === node.id);
              return fullNode ? getNodeSize(fullNode) : 5;
            }}
            linkColor={(link: any) => {
              // Highlight links in path
              const isInPath = highlightedPath.length > 1 && 
                highlightedPath.some((nodeId, i) => {
                  if (i === highlightedPath.length - 1) return false;
                  const nextId = highlightedPath[i + 1];
                  return (link.source.id === nodeId && link.target.id === nextId) ||
                         (link.source.id === nextId && link.target.id === nodeId);
                });
              
              if (isInPath) return '#fbbf24';
              
              return getLinkColor(link);
            }}
            linkWidth={(link: any) => getLinkWidth(link)}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={(link: any) => highlightedPath.length > 0 ? 2 : 0}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            d3VelocityDecay={0.3}
            cooldownTime={3000}
            backgroundColor={isDarkMode ? '#0f172a' : '#f8fafc'}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.15}
          />
          
          {/* Floating Controls */}
          {!isPresentationMode && (
            <div className="absolute bottom-6 left-6 flex flex-col gap-2">
              <button
                onClick={() => graphRef.current?.zoom(1.5, 500)}
                className={`p-3 rounded-lg shadow-lg ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
                }`}
                title="Zoom In"
              >
                <ZoomIn size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
              </button>
              <button
                onClick={() => graphRef.current?.zoom(0.5, 500)}
                className={`p-3 rounded-lg shadow-lg ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
                }`}
                title="Zoom Out"
              >
                <ZoomOut size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
              </button>
              <button
                onClick={resetView}
                className={`p-3 rounded-lg shadow-lg ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
                }`}
                title="Reset View"
              >
                <Locate size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
              </button>
            </div>
          )}
          
          {/* Legend */}
          {!isPresentationMode && (
            <div className={`absolute top-6 left-6 p-4 rounded-lg shadow-lg max-w-xs ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h3 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Network Legend
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Bills</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Legislators</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-600" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Committees</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-600" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Issues</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-600" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Stakeholders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Staff</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Sidebar - Node Details */}
        {!isPresentationMode && isDetailPanelOpen && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={() => {
              setIsDetailPanelOpen(false);
              setSelectedNode(null);
            }}
            onFindPath={(nodeId) => {
              setShowPathFinder(true);
            }}
            isDarkMode={isDarkMode}
            edges={demoNetworkEdges}
            allNodes={demoNetworkNodes}
          />
        )}
        
        {/* Toggle detail panel button */}
        {!isPresentationMode && !isDetailPanelOpen && selectedNode && (
          <button
            onClick={() => setIsDetailPanelOpen(true)}
            className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-l-lg shadow-lg ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <ChevronLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
          </button>
        )}
      </div>
      
      {/* Modals */}
      <AnimatePresence>
        {showPathFinder && (
          <PathFinderModal
            isOpen={showPathFinder}
            onClose={() => {
              setShowPathFinder(false);
              setHighlightedPath([]);
            }}
            nodes={demoNetworkNodes}
            onPathSelected={(path) => {
              setHighlightedPath(path);
              setShowPathFinder(false);
            }}
            isDarkMode={isDarkMode}
          />
        )}
        
        {showReportGen && (
          <ReportGenerator
            isOpen={showReportGen}
            onClose={() => setShowReportGen(false)}
            networkData={{
              nodes: filteredData.nodes,
              edges: demoNetworkEdges,
              metrics: demoNetworkMetrics
            }}
            selectedNode={selectedNode}
            isDarkMode={isDarkMode}
          />
        )}
        
        {showAnalytics && (
          <NetworkAnalytics
            isOpen={showAnalytics}
            onClose={() => setShowAnalytics(false)}
            metrics={demoNetworkMetrics}
            nodes={demoNetworkNodes}
            edges={demoNetworkEdges}
            isDarkMode={isDarkMode}
          />
        )}
        
        {showScenario && (
          <ScenarioBuilder
            isOpen={showScenario}
            onClose={() => setShowScenario(false)}
            nodes={demoNetworkNodes}
            edges={demoNetworkEdges}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}