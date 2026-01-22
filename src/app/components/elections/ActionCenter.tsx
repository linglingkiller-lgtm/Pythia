import React, { useState } from 'react';
import { Sparkles, Play, Clock, X, ChevronRight, CheckCircle2, Zap, AlertCircle, FileText, Calendar, MessageSquare, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Opportunity, Playbook, TeamMember } from '../../data/electionMockData';
import { GlassCard } from './ElectionSharedComponents';
import { Button } from '../ui/Button';

interface ActionCenterProps {
  opportunities: Opportunity[];
  playbooks: Playbook[];
  onActivatePlaybook: (opportunityId: string, playbookKey: string) => void;
  onSnoozeOpportunity: (opportunityId: string) => void;
  onDismissOpportunity: (opportunityId: string) => void;
  runLog: any[]; // simplified for demo
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ 
  opportunities, 
  playbooks, 
  onActivatePlaybook, 
  onSnoozeOpportunity, 
  onDismissOpportunity,
  runLog 
}) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'opportunities' | 'playbooks' | 'log'>('opportunities');

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Tab Switcher */}
      <div className={`p-1 rounded-lg flex ${isDarkMode ? 'bg-slate-900/50' : 'bg-gray-100'}`}>
        <button 
          onClick={() => setActiveTab('opportunities')}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${activeTab === 'opportunities' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Opportunities ({opportunities.filter(o => o.status !== 'dismissed').length})
        </button>
        <button 
          onClick={() => setActiveTab('playbooks')}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${activeTab === 'playbooks' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Templates
        </button>
        <button 
          onClick={() => setActiveTab('log')}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${activeTab === 'log' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Run Log
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            {opportunities.filter(o => o.status === 'new' || o.status === 'active').map(opp => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp} 
                playbooks={playbooks}
                onActivate={onActivatePlaybook}
                onSnooze={onSnoozeOpportunity}
                onDismiss={onDismissOpportunity}
              />
            ))}
            {opportunities.filter(o => o.status === 'new' || o.status === 'active').length === 0 && (
              <div className="text-center py-8 opacity-50">
                <CheckCircle2 className="mx-auto mb-2 w-8 h-8 text-green-500" />
                <p className="text-sm">All caught up!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'playbooks' && (
          <div className="space-y-3">
            {playbooks.map(pb => (
              <GlassCard key={pb.key} className="p-3 cursor-pointer hover:border-indigo-400/50 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{pb.name}</h4>
                  <Play size={14} className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-1">
                  {pb.steps.slice(0, 3).map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-1 h-1 rounded-full bg-gray-400" />
                      {step}
                    </div>
                  ))}
                  {pb.steps.length > 3 && <div className="text-[10px] text-gray-400 pl-3">+{pb.steps.length - 3} more steps</div>}
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === 'log' && (
          <div className="space-y-4">
            {runLog.length === 0 ? (
              <div className="text-center py-8 opacity-50">
                <Clock className="mx-auto mb-2 w-8 h-8" />
                <p className="text-sm">No playbooks run yet</p>
              </div>
            ) : (
              [...runLog].reverse().map((run, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-indigo-500/20 pb-4 last:pb-0">
                  <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-slate-900" />
                  <div className="mb-1">
                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      Activated: {run.playbookName}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-2">{new Date(run.timestamp).toLocaleTimeString()}</span>
                  </div>
                  
                  {/* Generated Artifacts */}
                  <div className={`mt-2 p-2 rounded text-xs space-y-2 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    {run.artifacts.map((artifact: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition-colors">
                        {artifact.type === 'task' && <CheckCircle2 size={12} className="text-emerald-500" />}
                        {artifact.type === 'calendar' && <Calendar size={12} className="text-orange-500" />}
                        {artifact.type === 'chat' && <MessageSquare size={12} className="text-blue-500" />}
                        {artifact.type === 'record' && <FileText size={12} className="text-purple-500" />}
                        <span>{artifact.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const OpportunityCard = ({ opportunity, playbooks, onActivate, onSnooze, onDismiss }: any) => {
  const { isDarkMode } = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  const impactColor = opportunity.expectedImpact === 'high' ? 'text-red-400' : opportunity.expectedImpact === 'medium' ? 'text-yellow-400' : 'text-blue-400';
  const matchingPlaybook = playbooks.find((pb: Playbook) => pb.key === opportunity.playbookKey);

  return (
    <GlassCard className={`p-3 border-l-4 ${opportunity.expectedImpact === 'high' ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-500" />
          <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {opportunity.type.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs font-mono ${impactColor}`}>{opportunity.confidence}% conf</span>
          <button onClick={() => onDismiss(opportunity.id)} className="p-1 hover:bg-white/10 rounded"><X size={12} /></button>
        </div>
      </div>
      
      <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{opportunity.title}</h3>
      <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{opportunity.summary}</p>
      
      <div className="flex items-center gap-2 mb-3">
        {opportunity.evidence.map((ev: string, idx: number) => (
          <span key={idx} className={`px-1.5 py-0.5 rounded text-[10px] border ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
             Evid #{ev.split('-')[1]}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="primary" 
          size="sm" 
          className="w-full text-xs justify-center py-1.5 h-auto"
          onClick={() => onActivate(opportunity.id, opportunity.playbookKey)}
        >
          <Play size={10} className="mr-1.5" />
          Run Playbook
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full text-xs justify-center py-1.5 h-auto"
          onClick={() => onSnooze(opportunity.id)}
        >
          <Clock size={10} className="mr-1.5" />
          Snooze 7d
        </Button>
      </div>

      {matchingPlaybook && (
        <div className={`mt-2 pt-2 border-t text-[10px] flex items-center gap-1 ${isDarkMode ? 'border-white/5 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
          <Zap size={10} />
          <span>Recommended: {matchingPlaybook.name}</span>
        </div>
      )}
    </GlassCard>
  );
};
