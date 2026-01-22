import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { 
  Search, Plus, AlertTriangle, TrendingUp, FileText, Calendar, Users, 
  Sparkles, ChevronRight, ArrowUpRight, BarChart3, PieChart, 
  ChevronDown, Maximize2, Minimize2, MoreHorizontal, Layout, LayoutList,
  Activity, Briefcase
} from 'lucide-react';
import { mockClients } from '../../data/clientsData';
import { mockProjects, mockDeliverables, mockWorkHubAIInsights, getProjectsByClient, getDeliverablesByClient, getOpportunitiesByClient } from '../../data/workHubData';
import { ProjectsBoard } from './ProjectsBoard';
import { DeliverablesQueue } from './DeliverablesQueue';
import { OpportunityPipelineModal } from './OpportunityPipelineModal';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface ClientWorkTabProps {
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToBill?: (billId: string) => void;
}

// ----------------------------------------------------------------------
// Collapsible Module Component
// ----------------------------------------------------------------------
type ColorTheme = 'blue' | 'orange' | 'purple' | 'emerald' | 'rose' | 'gray' | 'cyan';

interface ModuleProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  summary?: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
  headerAction?: React.ReactNode;
  variant?: 'default' | 'highlight';
  colorTheme?: ColorTheme;
}

const Module = ({ 
  title, 
  icon: Icon, 
  children, 
  summary, 
  isExpanded, 
  onToggle, 
  className = '',
  headerAction,
  variant = 'default',
  colorTheme = 'gray'
}: ModuleProps) => {
  const { isDarkMode } = useTheme();
  
  const isHighlight = variant === 'highlight';
  
  // Color Maps
  const colorStyles = {
    blue: {
      iconBg: isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100',
      iconColor: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      borderColor: isDarkMode ? 'border-blue-500/30' : 'border-blue-200',
      highlightBg: isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50/50'
    },
    cyan: {
      iconBg: isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-100',
      iconColor: isDarkMode ? 'text-cyan-400' : 'text-cyan-600',
      borderColor: isDarkMode ? 'border-cyan-500/30' : 'border-cyan-200',
      highlightBg: isDarkMode ? 'bg-cyan-900/10' : 'bg-cyan-50/50'
    },
    orange: {
      iconBg: isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100',
      iconColor: isDarkMode ? 'text-orange-400' : 'text-orange-600',
      borderColor: isDarkMode ? 'border-orange-500/30' : 'border-orange-200',
      highlightBg: isDarkMode ? 'bg-orange-900/10' : 'bg-orange-50/50'
    },
    purple: {
      iconBg: isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100',
      iconColor: isDarkMode ? 'text-purple-400' : 'text-purple-600',
      borderColor: isDarkMode ? 'border-purple-500/30' : 'border-purple-200',
      highlightBg: isDarkMode ? 'bg-purple-900/10' : 'bg-purple-50/50'
    },
    emerald: {
      iconBg: isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100',
      iconColor: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
      borderColor: isDarkMode ? 'border-emerald-500/30' : 'border-emerald-200',
      highlightBg: isDarkMode ? 'bg-emerald-900/10' : 'bg-emerald-50/50'
    },
    rose: {
      iconBg: isDarkMode ? 'bg-rose-500/20' : 'bg-rose-100',
      iconColor: isDarkMode ? 'text-rose-400' : 'text-rose-600',
      borderColor: isDarkMode ? 'border-rose-500/30' : 'border-rose-200',
      highlightBg: isDarkMode ? 'bg-rose-900/10' : 'bg-rose-50/50'
    },
    gray: {
      iconBg: isDarkMode ? 'bg-white/10' : 'bg-gray-100',
      iconColor: isDarkMode ? 'text-gray-400' : 'text-gray-500',
      borderColor: isDarkMode ? 'border-white/10' : 'border-gray-200',
      highlightBg: isDarkMode ? 'bg-white/5' : 'bg-gray-50'
    }
  };

  const theme = colorStyles[colorTheme];

  return (
    <div className={`
      rounded-xl border transition-all duration-300 overflow-hidden group
      ${isHighlight 
        ? `${theme.highlightBg} ${theme.borderColor}`
        : (isDarkMode ? 'bg-[#0F0F12] border-white/5' : 'bg-white border-gray-200 shadow-sm')
      }
      ${className}
    `}>
      {/* Header */}
      <div 
        onClick={onToggle}
        className={`
          flex items-center justify-between p-4 cursor-pointer select-none
          ${isHighlight ? '' : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50')}
          transition-colors
        `}
      >
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme.iconBg} ${theme.iconColor} transition-colors`}>
                <Icon size={18} />
            </div>
            <span className={`font-bold text-sm tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {title}
            </span>
            {!isExpanded && summary && (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden sm:flex items-center"
                >
                   <div className={`h-4 w-[1px] mx-3 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                   {summary}
                </motion.div>
            )}
        </div>
        
        <div className="flex items-center gap-2">
            {headerAction && (
                <div onClick={e => e.stopPropagation()}>
                    {headerAction}
                </div>
            )}
            <button className={`p-1.5 rounded-md transition-colors ${
                isDarkMode ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-black hover:bg-gray-100'
            }`}>
                {isExpanded ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
            </button>
        </div>
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className={`border-t ${isHighlight ? theme.borderColor : (isDarkMode ? 'border-white/5' : 'border-gray-100')}`}>
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export function ClientWorkTab({ onNavigateToClient, onNavigateToBill }: ClientWorkTabProps) {
  const { isDarkMode } = useTheme();
  const [selectedClientId, setSelectedClientId] = useState<string>(mockClients[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOpportunityPipeline, setShowOpportunityPipeline] = useState(false);
  const [viewMode, setViewMode] = useState<'default' | 'dense'>('default');

  // Module Expansion States
  const [expandedModules, setExpandedModules] = useState({
    projects: true,
    deliverables: true,
    insights: true,
    pulse: true,
    pipeline: false
  });

  const toggleModule = (module: keyof typeof expandedModules) => {
    setExpandedModules(prev => ({ ...prev, [module]: !prev[module] }));
  };

  const selectedClient = mockClients.find(c => c.id === selectedClientId);
  const clientProjects = getProjectsByClient(selectedClientId);
  const clientDeliverables = getDeliverablesByClient(selectedClientId);
  const clientOpportunities = getOpportunitiesByClient(selectedClientId);
  const clientInsights = mockWorkHubAIInsights.filter(i => 
    (i.scope === 'client' && i.scopeId === selectedClientId) ||
    (i.scope === 'project' && clientProjects.some(p => p.id === i.scopeId))
  );

  // Filter clients by search
  const filteredClients = mockClients.filter(c =>
    searchQuery === '' || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper for status badge
  const getStatusBadge = (status: 'green' | 'yellow' | 'red') => {
    if (status === 'green') return <span className="text-emerald-500 font-bold">HEALTHY</span>;
    if (status === 'yellow') return <span className="text-amber-500 font-bold">AT RISK</span>;
    return <span className="text-red-500 font-bold">CRITICAL</span>;
  };

  return (
    <div className="min-h-screen pb-32 relative" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* ---------------------------------------------------------------------- */}
      {/* Background Ambience & Texture */}
      {/* ---------------------------------------------------------------------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        
        {/* 1. Base Grid Texture */}
        <div 
            className="absolute inset-0"
            style={{
                opacity: isDarkMode ? 0.15 : 0.4,
                backgroundImage: isDarkMode 
                    ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`
                    : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }}
        />

        {/* 2. Animated Gradient Orbs */}
        {isDarkMode ? (
            <>
                {/* Top Left - Blue/Cyan */}
                <motion.div 
                    animate={{ 
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[120px]"
                />
                
                {/* Bottom Right - Purple/Pink */}
                <motion.div 
                    animate={{ 
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 -right-20 w-[700px] h-[700px] rounded-full bg-purple-600/15 blur-[120px]"
                />

                {/* Center - Subtle Pulse */}
                <motion.div 
                    animate={{ opacity: [0, 0.1, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 left-1/3 w-[800px] h-[400px] rounded-full bg-blue-900/10 blur-[100px]"
                />
            </>
        ) : (
            <>
                {/* Light Mode - Warm & Cool Mix */}
                <motion.div 
                    animate={{ 
                        y: [0, 30, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 right-0 w-[600px] h-[600px] rounded-full bg-blue-100/60 blur-[100px]"
                />
                <motion.div 
                    className="absolute top-40 -left-20 w-[500px] h-[500px] rounded-full bg-purple-100/50 blur-[100px]"
                />
            </>
        )}
      </div>

      {/* Top Bar - Client Context */}
      <div className={`sticky top-0 z-40 flex-shrink-0 border-b backdrop-blur-xl transition-all duration-200 -mx-8 md:-mx-12 -mt-10 mb-8 ${
        isDarkMode ? 'bg-[#0a0a0b]/80 border-white/5' : 'bg-gray-50/80 border-gray-200'
      }`}>
        <div className="px-8 md:px-12 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
               <div className="flex items-center gap-3">
                   <div className={`p-2.5 rounded-xl shadow-sm ${
                        isDarkMode 
                            ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400' 
                            : 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600'
                   }`}>
                        <Briefcase size={20} />
                   </div>
                   <div className="flex flex-col">
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Current Client</span>
                       <h2 className={`text-xl font-bold leading-none tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClient?.name}</h2>
                   </div>
               </div>
               
               <div className={`h-8 w-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} mx-2`} />
               
               <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Projects</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                        }`}>
                            {clientProjects.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Deliverables</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
                        }`}>
                            {clientDeliverables.length}
                        </span>
                    </div>
               </div>
           </div>

           <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" onClick={() => onNavigateToClient?.(selectedClientId)}>
                    View Details
                </Button>
                <Button variant="primary" size="sm">
                    <Plus size={16} />
                    New Project
                </Button>
           </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Client List (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                    isDarkMode ? 'text-gray-500 group-focus-within:text-cyan-400' : 'text-gray-400 group-focus-within:text-blue-500'
                }`} size={14} />
                <input 
                    type="text" 
                    placeholder="Search clients..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`
                        w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none border transition-all shadow-sm
                        ${isDarkMode 
                            ? 'bg-white/5 border-white/5 focus:border-cyan-500/50 text-white placeholder-gray-600 focus:bg-white/10' 
                            : 'bg-white border-gray-200 focus:border-blue-500 text-gray-900 placeholder-gray-400'
                        }
                    `}
                />
            </div>

            {/* List */}
            <div className="space-y-1 pr-1 custom-scrollbar max-h-[calc(100vh-200px)] overflow-y-auto">
                {filteredClients.map(client => {
                    const isSelected = selectedClientId === client.id;
                    return (
                        <button
                            key={client.id}
                            onClick={() => setSelectedClientId(client.id)}
                            className={`
                                w-full flex items-center justify-between p-3 rounded-lg text-left transition-all group relative overflow-hidden
                                ${isSelected 
                                    ? (isDarkMode ? 'bg-white/10' : 'bg-white border border-gray-200 shadow-sm') 
                                    : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50')
                                }
                            `}
                        >
                            {isSelected && (
                                <motion.div 
                                    layoutId="activeClientBar"
                                    className={`absolute left-0 top-0 bottom-0 w-1 ${isDarkMode ? 'bg-cyan-500' : 'bg-blue-600'}`}
                                />
                            )}
                            
                            <span className={`truncate flex-1 pl-2 text-sm font-medium ${
                                isSelected 
                                    ? (isDarkMode ? 'text-white' : 'text-gray-900')
                                    : (isDarkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-900')
                            }`}>
                                {client.name}
                            </span>
                            
                            <div className={`w-2 h-2 rounded-full shadow-sm ${
                                client.healthStatus === 'green' ? 'bg-emerald-500' : 
                                client.healthStatus === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                            }`} />
                        </button>
                    )
                })}
            </div>
        </div>

        {/* Middle Column: Main Work (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
            
            {/* Projects Module */}
            <Module
                title="Active Projects"
                icon={BarChart3}
                colorTheme="cyan"
                isExpanded={expandedModules.projects}
                onToggle={() => toggleModule('projects')}
                summary={
                    <div className="flex items-center gap-2 text-xs opacity-80">
                         <span className={isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}>{clientProjects.filter(p => p.stage !== 'delivered').length} Active</span>
                         <span className="opacity-50">•</span>
                         <span className="opacity-70">{clientProjects.length} Total</span>
                    </div>
                }
            >
                <ProjectsBoard
                    projects={clientProjects}
                    onNavigateToBill={onNavigateToBill}
                />
            </Module>

            {/* Deliverables Module */}
            <Module
                title="Deliverable Queue"
                icon={FileText}
                colorTheme="orange"
                isExpanded={expandedModules.deliverables}
                onToggle={() => toggleModule('deliverables')}
                summary={
                    <div className="flex items-center gap-2 text-xs opacity-80">
                         <span className={isDarkMode ? 'text-orange-400' : 'text-orange-700'}>{clientDeliverables.filter(d => d.status !== 'approved').length} Pending</span>
                    </div>
                }
            >
                <DeliverablesQueue
                    deliverables={clientDeliverables}
                    onNavigateToBill={onNavigateToBill}
                />
            </Module>

        </div>

        {/* Right Column: Insights & Stats (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
            
            {/* Revere Insights - Highlighted Variant */}
            {clientInsights.length > 0 && (
                <Module
                    title="Revere Insights"
                    icon={Sparkles}
                    variant="highlight"
                    colorTheme="purple"
                    isExpanded={expandedModules.insights}
                    onToggle={() => toggleModule('insights')}
                    summary={
                        <span className="text-xs text-purple-500 font-bold">{clientInsights.length} suggestions</span>
                    }
                >
                    <div className="space-y-3">
                        {clientInsights.map((insight, i) => (
                            <div key={insight.id} className={`p-3.5 rounded-lg border text-sm transition-colors ${
                                isDarkMode ? 'bg-black/20 border-white/5 hover:border-purple-500/30' : 'bg-white/50 border-purple-100 hover:border-purple-200'
                            }`}>
                                <p className={`mb-3 font-medium leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                    {insight.summary}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {insight.reasons.slice(0, 2).map((reason, idx) => (
                                        <span key={idx} className={`text-[10px] uppercase font-bold px-2 py-1 rounded border shadow-sm ${
                                            isDarkMode ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-white border-purple-100 text-purple-700'
                                        }`}>
                                            {reason}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Module>
            )}

            {/* Client Pulse */}
            <Module
                title="Client Pulse"
                icon={Activity}
                colorTheme="rose"
                isExpanded={expandedModules.pulse}
                onToggle={() => toggleModule('pulse')}
                summary={
                    <div className="flex items-center gap-2 text-xs">
                        {selectedClient && getStatusBadge(selectedClient.healthStatus)}
                    </div>
                }
            >
                {selectedClient && (
                    <div className="space-y-5">
                         {/* Health Indicator Large */}
                         <div className={`p-4 rounded-lg flex items-center justify-between ${
                             selectedClient.healthStatus === 'green' ? (isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100') :
                             selectedClient.healthStatus === 'yellow' ? (isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-100') :
                             (isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-100')
                         }`}>
                             <div className="flex flex-col">
                                 <span className="text-xs font-bold uppercase opacity-70 mb-1">Overall Health</span>
                                 <span className={`text-lg font-bold ${
                                     selectedClient.healthStatus === 'green' ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-700') :
                                     selectedClient.healthStatus === 'yellow' ? (isDarkMode ? 'text-amber-400' : 'text-amber-700') :
                                     (isDarkMode ? 'text-red-400' : 'text-red-700')
                                 }`}>
                                     {selectedClient.healthStatus === 'green' ? 'Excellent' : selectedClient.healthStatus === 'yellow' ? 'Attention Needed' : 'Critical'}
                                 </span>
                             </div>
                             <div className={`p-2 rounded-full ${
                                 selectedClient.healthStatus === 'green' ? 'bg-emerald-500 text-white' :
                                 selectedClient.healthStatus === 'yellow' ? 'bg-amber-500 text-white' :
                                 'bg-red-500 text-white'
                             }`}>
                                 <Activity size={20} />
                             </div>
                         </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                <div className="text-xs font-medium text-gray-500 mb-1">Monthly</div>
                                <div className={`text-sm font-mono font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    ${selectedClient.contractValueMonthly.toLocaleString()}
                                </div>
                            </div>
                            <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                <div className="text-xs font-medium text-gray-500 mb-1">YTD</div>
                                <div className={`text-sm font-mono font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    ${selectedClient.contractValueYTD.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Module>

            {/* Pipeline */}
            <Module
                title="Pipeline"
                icon={PieChart}
                colorTheme="emerald"
                isExpanded={expandedModules.pipeline}
                onToggle={() => toggleModule('pipeline')}
                summary={
                    <span className="text-xs text-gray-500">{clientOpportunities.length} opportunities</span>
                }
            >
                <div className="text-center py-2">
                    <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {clientOpportunities.length}
                    </div>
                    <div className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wide">Active Opportunities</div>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setShowOpportunityPipeline(true)}
                    >
                        View Details
                    </Button>
                </div>
            </Module>

        </div>

      </div>

      {/* Opportunity Pipeline Modal */}
      {showOpportunityPipeline && selectedClient && (
        <OpportunityPipelineModal
          clientId={selectedClientId}
          clientName={selectedClient.name}
          onClose={() => setShowOpportunityPipeline(false)}
        />
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
