import React, { useState, useEffect } from 'react';
import { X, LayoutDashboard, Users, DollarSign, Map, MessageSquare, Megaphone, Link2, BrainCircuit, Sparkles } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Race, Candidate, Opportunity, Filing, FieldProject, mockElectionsHub } from '../../../data/electionsHubData';
import { StatusChip } from '../shared/ElectionsSharedComponents';
import { SnapshotTab, CandidatesTab, AILabTab, MoneyTab, DistrictTab, FieldTab, IntegrationsTab } from './RaceDossierTabs';

interface RaceDossierDrawerProps {
  race: Race | null;
  candidates: Candidate[];
  opportunities: Opportunity[];
  isOpen: boolean;
  onClose: () => void;
  onActivatePlaybook: (key: string) => void;
}

export const RaceDossierDrawer: React.FC<RaceDossierDrawerProps> = ({ 
  race, candidates, opportunities, isOpen, onClose, onActivatePlaybook 
}) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('snapshot');

  // Reset tab when race changes
  useEffect(() => {
    if (isOpen) setActiveTab('snapshot');
  }, [race, isOpen]);

  if (!isOpen || !race) return null;

  const tabs = [
    { id: 'snapshot', label: 'Snapshot', icon: LayoutDashboard },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'money', label: 'Money & Filings', icon: DollarSign },
    { id: 'district', label: 'District', icon: Map },
    { id: 'field', label: 'Field', icon: Megaphone },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'insights', label: 'Insights', icon: Sparkles },
  ];

  const raceCandidates = candidates.filter(c => c.raceId === race.id);
  const raceOpportunities = opportunities.filter(o => o.raceId === race.id);
  const raceFilings = mockElectionsHub.filings.filter(f => f.raceId === race.id);
  const raceProjects = mockElectionsHub.fieldProjects.filter(p => p.raceId === race.id);

  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`w-full max-w-4xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ${
          isDarkMode ? 'bg-slate-900 border-l border-white/10' : 'bg-white border-l border-gray-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex-shrink-0 p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {race.office}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(race.electionDate).getFullYear()} Cycle
                </span>
              </div>
              <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {race.office === 'State Senate' || race.office === 'State House' ? race.district : race.office}
              </h2>
            </div>
            <div className="flex items-center gap-3">
               <StatusChip status={race.lean} size="lg" variant="lean" />
               <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                 <X size={24} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
               </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${isActive 
                      ? isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                      : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto p-6 ${isDarkMode ? 'bg-slate-950/50' : 'bg-gray-50/50'}`}>
          {activeTab === 'snapshot' && <SnapshotTab race={race} candidates={raceCandidates} opportunities={raceOpportunities} />}
          {activeTab === 'candidates' && <CandidatesTab candidates={raceCandidates} />}
          {activeTab === 'money' && <MoneyTab candidates={raceCandidates} filings={raceFilings} outsideSpendSeries={race.outsideSpendSeries} />}
          {activeTab === 'district' && <DistrictTab profile={race.districtProfile} />}
          {activeTab === 'field' && <FieldTab projects={raceProjects} />}
          {activeTab === 'integrations' && <IntegrationsTab />}
          {activeTab === 'insights' && <AILabTab race={race} opportunities={raceOpportunities} onActivatePlaybook={onActivatePlaybook} />}
          
          {/* Fallback */}
          {['issues'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
               <div className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-white/5">
                 {tabs.find(t => t.id === activeTab)?.icon({ size: 32 })}
               </div>
               <p className="font-medium">Tab content coming soon</p>
               <p className="text-sm">This module is part of the full Elections Suite.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
