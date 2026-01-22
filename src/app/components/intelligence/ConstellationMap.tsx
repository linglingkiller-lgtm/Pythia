import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { mockConstellationData, LegacyNetworkNode, NetworkLink } from '../../data/constellationData';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Building2, FileText, Users, DollarSign, ArrowRight } from 'lucide-react';

export function ConstellationMap() {
  const { isDarkMode } = useTheme();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { nodes, links } = mockConstellationData;

  const activeNodeId = hoveredNode || selectedNode;

  // Helper to determine if a link or node is connected to the active node
  const isConnected = (id: string) => {
    if (!activeNodeId) return true; // Show all if nothing selected
    if (id === activeNodeId) return true;
    return links.some(l => 
      (l.source === activeNodeId && l.target === id) || 
      (l.target === activeNodeId && l.source === id)
    );
  };

  const getLinkState = (link: NetworkLink) => {
    if (!activeNodeId) return 'default';
    if (link.source === activeNodeId || link.target === activeNodeId) return 'active';
    return 'dimmed';
  };

  const getNodeColor = (type: LegacyNetworkNode['type']) => {
    switch (type) {
      case 'legislator': return 'bg-blue-500';
      case 'bill': return 'bg-purple-500';
      case 'client': return 'bg-emerald-500';
      case 'interest-group': return 'bg-orange-500';
      case 'donor': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const getNodeIcon = (type: LegacyNetworkNode['type']) => {
    switch (type) {
      case 'legislator': return <User size={14} className="text-white" />;
      case 'bill': return <FileText size={14} className="text-white" />;
      case 'client': return <Building2 size={14} className="text-white" />;
      case 'interest-group': return <Users size={14} className="text-white" />;
      case 'donor': return <DollarSign size={14} className="text-white" />;
      default: return null;
    }
  };

  return (
    <div className={`relative w-full h-[600px] overflow-hidden rounded-xl border ${isDarkMode ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-gray-200'}`}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Title */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Influence Constellation</h3>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Visualizing legislative relationships</p>
      </div>

      {/* SVG Layer for Links */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {links.map((link, i) => {
          const source = nodes.find(n => n.id === link.source);
          const target = nodes.find(n => n.id === link.target);
          if (!source || !target) return null;

          const state = getLinkState(link);
          const opacity = state === 'dimmed' ? 0.1 : state === 'active' ? 1 : 0.4;
          const width = state === 'active' ? 2 : 1;
          const color = isDarkMode ? 'white' : 'black';

          return (
            <g key={i}>
              <motion.line
                x1={source.x} y1={source.y}
                x2={target.x} y2={target.y}
                stroke={color}
                strokeWidth={width}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity }}
                transition={{ duration: 1, delay: i * 0.05 }}
              />
              {/* Interaction labels on hover could go here */}
            </g>
          );
        })}
      </svg>

      {/* Nodes Layer */}
      {nodes.map((node) => {
        const isActive = isConnected(node.id);
        const isSelected = selectedNode === node.id;
        
        return (
          <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: node.x, top: node.y }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isActive ? 1 : 0.8, 
              opacity: isActive ? 1 : 0.3,
              zIndex: isSelected ? 50 : 10
            }}
            whileHover={{ scale: 1.1, zIndex: 40 }}
            onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
            onHoverStart={() => setHoveredNode(node.id)}
            onHoverEnd={() => setHoveredNode(null)}
          >
            <div className="relative flex flex-col items-center">
              {/* Node Circle */}
              <div 
                className={`
                  flex items-center justify-center rounded-full shadow-lg border-2 
                  ${getNodeColor(node.type)} 
                  ${isSelected ? 'border-white ring-2 ring-blue-400' : 'border-transparent'}
                `}
                style={{ width: node.radius * 2, height: node.radius * 2 }}
              >
                {getNodeIcon(node.type)}
              </div>
              
              {/* Label */}
              <div className={`
                mt-2 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors
                ${isSelected 
                  ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white')
                  : (isDarkMode ? 'bg-black/50 text-white/80' : 'bg-white/80 text-black/80')
                }
              `}>
                {node.label}
              </div>
            </div>
            
            {/* Info Popover when selected */}
            {isSelected && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`
                   absolute top-full mt-2 w-48 p-3 rounded-lg shadow-xl z-50 text-xs
                   ${isDarkMode ? 'bg-slate-800 border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900'}
                 `}
               >
                 <div className="font-bold mb-1 border-b pb-1 opacity-80 uppercase tracking-wider">{node.type}</div>
                 <div className="space-y-1">
                   <p>Connections: {links.filter(l => l.source === node.id || l.target === node.id).length}</p>
                   {node.group && <p>Group: {node.group}</p>}
                 </div>
               </motion.div>
            )}
          </motion.div>
        );
      })}
      
      {/* Legend / Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button 
          onClick={() => setSelectedNode(null)} 
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? 'bg-slate-900 border-white/10 text-white hover:bg-white/5' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
        >
          Reset View
        </button>
      </div>
    </div>
  );
}