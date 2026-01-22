import React from 'react';
import { motion } from 'motion/react';
import { 
  X, User, Building2, FileText, Hash, Users, Briefcase, Clock, TrendingUp, 
  Link2, Calendar, Phone, Mail, MapPin, ExternalLink, Star, GitBranch,
  MessageCircle
} from 'lucide-react';
import type { NetworkNode, NetworkEdge } from '@/app/data/constellationData';
import { format } from 'date-fns';

interface NodeDetailPanelProps {
  node: NetworkNode | null;
  onClose: () => void;
  onFindPath: (nodeId: string) => void;
  isDarkMode: boolean;
  edges: NetworkEdge[];
  allNodes: NetworkNode[];
}

export function NodeDetailPanel({
  node,
  onClose,
  onFindPath,
  isDarkMode,
  edges,
  allNodes
}: NodeDetailPanelProps) {
  if (!node) {
    return (
      <div className={`w-96 border-l p-6 ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        <div className="text-center py-12">
          <Users size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Select a node to view details
          </p>
        </div>
      </div>
    );
  }
  
  // Get connections
  const connections = edges.filter(e => e.source === node.id || e.target === node.id);
  const connectedNodes = connections.map(conn => {
    const connectedId = conn.source === node.id ? conn.target : conn.source;
    return {
      node: allNodes.find(n => n.id === connectedId),
      edge: conn
    };
  }).filter(c => c.node);
  
  // Get recent interactions
  const recentInteractions = connections
    .flatMap(c => c.interactionHistory || [])
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
  
  // Node type icon and color
  const getTypeIcon = () => {
    switch (node.type) {
      case 'bill': return <FileText size={20} />;
      case 'legislator': return <Users size={20} />;
      case 'client': return <Building2 size={20} />;
      case 'committee': return <Users size={20} />;
      case 'issue': return <Hash size={20} />;
      case 'stakeholder': return <Users size={20} />;
      case 'staff': return <Users size={20} />;
    }
  };
  
  const getTypeColor = () => {
    const colors = {
      bill: 'blue',
      legislator: 'green',
      client: 'purple',
      committee: 'amber',
      issue: 'pink',
      stakeholder: 'cyan',
      staff: 'indigo'
    };
    return colors[node.type];
  };
  
  const typeColor = getTypeColor();
  
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`w-96 border-l overflow-y-auto ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg bg-${typeColor}-600/10`}>
                {getTypeIcon()}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${typeColor}-600/10 text-${typeColor}-600`}>
                {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
              </span>
            </div>
            <h2 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {node.label}
            </h2>
            {node.metadata.name && node.metadata.name !== node.label && (
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {node.metadata.name}
              </p>
            )}
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
        
        {/* Influence Score */}
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Influence Score
            </span>
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {node.influenceScore.toFixed(1)}
            </span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
          }`}>
            <div
              className={`h-full bg-${typeColor}-600 transition-all`}
              style={{ width: `${(node.influenceScore / 10) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Metadata */}
        {Object.keys(node.metadata).length > 0 && (
          <div className="space-y-3">
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Details
            </h3>
            <div className="space-y-2">
              {node.metadata.party && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                    {node.metadata.party}
                  </span>
                </div>
              )}
              {node.metadata.district && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                    {node.metadata.district}
                  </span>
                </div>
              )}
              {node.metadata.committee && (
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                    {node.metadata.committee}
                  </span>
                </div>
              )}
              {node.metadata.status && (
                <div className="flex items-center gap-2 text-sm">
                  <Star size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                    {node.metadata.status}
                  </span>
                </div>
              )}
              {node.metadata.tier && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                    Tier {node.metadata.tier}
                  </span>
                </div>
              )}
              {node.metadata.title && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                    {node.metadata.title}
                  </span>
                </div>
              )}
              {node.metadata.organization && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                    {node.metadata.organization}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                  Updated {format(node.lastUpdated, 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Connections */}
        <div>
          <h3 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Connections ({connectedNodes.length})
          </h3>
          <div className="space-y-2">
            {connectedNodes.slice(0, 8).map(({ node: connNode, edge }) => (
              <div
                key={connNode!.id}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {connNode!.label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    edge.sentiment === 'positive' 
                      ? 'bg-green-600/10 text-green-600'
                      : edge.sentiment === 'negative'
                      ? 'bg-red-600/10 text-red-600'
                      : 'bg-gray-600/10 text-gray-600'
                  }`}>
                    {edge.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex-1 h-1.5 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                    <div
                      className={`h-full rounded-full ${
                        edge.sentiment === 'positive' 
                          ? 'bg-green-600'
                          : edge.sentiment === 'negative'
                          ? 'bg-red-600'
                          : 'bg-gray-600'
                      }`}
                      style={{ width: `${(edge.weight / 10) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {edge.weight}/10
                  </span>
                </div>
              </div>
            ))}
            {connectedNodes.length > 8 && (
              <p className={`text-xs text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                +{connectedNodes.length - 8} more connections
              </p>
            )}
          </div>
        </div>
        
        {/* Recent Interactions */}
        {recentInteractions.length > 0 && (
          <div>
            <h3 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h3>
            <div className="space-y-2">
              {recentInteractions.map((interaction, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    <Clock size={14} className={`mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                        </span>
                        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          {format(interaction.date, 'MMM d')}
                        </span>
                      </div>
                      {interaction.notes && (
                        <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                          {interaction.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-slate-700">
          <button
            onClick={() => onFindPath(node.id)}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <GitBranch size={16} />
            Find Path To...
          </button>
          {node.type === 'legislator' && (
            <div className="grid grid-cols-2 gap-2">
              <button className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}>
                <Mail size={14} />
                Email
              </button>
              <button className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}>
                <Phone size={14} />
                Call
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}