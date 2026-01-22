import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Filter, Download, ArrowLeft, ChevronDown, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  mockElectionIntel, 
  ElectionCandidate, 
  ElectionProfile,
  Opportunity,
  Playbook
} from '../data/electionMockData';
import { GlassCard } from '../components/elections/ElectionSharedComponents';
import { VulnerabilityEngine } from '../components/elections/VulnerabilityEngine';
import { ScenarioLab } from '../components/elections/ScenarioLab';
import { ElectionCenterDossier } from '../components/elections/ElectionCenterDossier';
import { ActionCenter } from '../components/elections/ActionCenter';
import { CandidateDrawer } from '../components/elections/CandidateDrawer';
import { PageLayout } from '../components/ui/PageLayout';
import { getPageTheme } from '../config/pageThemes';

interface LegislatorElectionsPageProps {
  onNavigateToProfile?: () => void;
}

export function LegislatorElectionsPage({ onNavigateToProfile }: LegislatorElectionsPageProps) {
  const { isDarkMode } = useTheme();
  
  // -- State --
  // Selection
  const [selectedRaceId, setSelectedRaceId] = useState(mockElectionIntel.races[1].id); // Default to General
  const [selectedCandidate, setSelectedCandidate] = useState<ElectionCandidate | null>(null);
  
  // Data State (with persistence simulation)
  const [profile, setProfile] = useState<ElectionProfile>(() => {
    const saved = localStorage.getItem('demo_election_profile');
    return saved ? JSON.parse(saved) : mockElectionIntel.electionProfile;
  });
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('demo_election_opps');
    return saved ? JSON.parse(saved) : mockElectionIntel.opportunities;
  });

  const [runLog, setRunLog] = useState<any[]>(() => {
    const saved = localStorage.getItem('demo_election_runlog');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Scenario Lab
  const [scenarioModifier, setScenarioModifier] = useState(0);

  const electionsTheme = getPageTheme('Elections');

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('demo_election_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('demo_election_opps', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('demo_election_runlog', JSON.stringify(runLog));
  }, [runLog]);

  // -- Derived Data --
  const selectedRace = mockElectionIntel.races.find(r => r.id === selectedRaceId) || mockElectionIntel.races[0];
  const raceCandidates = mockElectionIntel.candidates.filter(c => c.raceId === selectedRaceId);

  // -- Handlers --
  
  // Vulnerability Override
  const handleOverrideChange = (enabled: boolean, score: number, notes: string) => {
    setProfile(prev => ({
      ...prev,
      manualOverride: { enabled, score, notes }
    }));
  };

  // Opportunities
  const handleActivatePlaybook = (opportunityId: string, playbookKey: string) => {
    // 1. Update opportunity status
    setOpportunities(prev => prev.map(o => 
      o.id === opportunityId ? { ...o, status: 'converted' } : o
    ));

    // 2. Add to run log
    const playbook = mockElectionIntel.playbooks.find(p => p.key === playbookKey);
    if (playbook) {
      const newRun = {
        playbookName: playbook.name,
        timestamp: new Date().toISOString(),
        artifacts: [
          { type: 'task', name: 'Generated 12 pipeline tasks' },
          { type: 'calendar', name: 'Scheduled prep block' },
          { type: 'chat', name: 'Posted to #election-war-room' }
        ]
      };
      setRunLog(prev => [...prev, newRun]);
    }
  };

  const handleSnoozeOpportunity = (opportunityId: string) => {
    setOpportunities(prev => prev.map(o => 
      o.id === opportunityId ? { ...o, status: 'snoozed' } : o
    ));
  };

  const handleDismissOpportunity = (opportunityId: string) => {
    setOpportunities(prev => prev.map(o => 
      o.id === opportunityId ? { ...o, status: 'dismissed' } : o
    ));
  };

  // Export Brief
  const handleExportBrief = () => {
    alert("Generating PDF Brief... (Demo)");
  };

  // Header Props
  const headerIcon = (
    <div className="flex items-center gap-4">
        {onNavigateToProfile && (
            <button 
                onClick={onNavigateToProfile}
                className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors`}
            >
                <ArrowLeft size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
        )}
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-indigo-500">
            <img src={mockElectionIntel.legislator.photoUrl} alt="Legislator" className="w-full h-full object-cover" />
        </div>
    </div>
  );

  const headerContent = (
    <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-white/10">
        <button 
        onClick={onNavigateToProfile}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`}
        >
        Profile
        </button>
        <button className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors bg-white dark:bg-white/10 shadow-sm text-indigo-600 dark:text-indigo-400`}>
        Elections
        </button>
        <button className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`}>
        Activity
        </button>
    </div>
  );

  const pageActions = (
    <button 
        onClick={handleExportBrief}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
            isDarkMode ? 'border-gray-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'
        }`}
    >
        <Download size={16} />
        Export Brief
    </button>
  );

  return (
    <PageLayout
        title={mockElectionIntel.legislator.name}
        subtitle={`${mockElectionIntel.legislator.district} • ${mockElectionIntel.legislator.party}`}
        accentColor={electionsTheme.accent}
        headerIcon={headerIcon}
        backgroundImage={
            <User 
                size={450} 
                color={isDarkMode ? "white" : electionsTheme.accent} 
                strokeWidth={0.5}
            />
        }
        headerContent={headerContent}
        pageActions={pageActions}
    >
      <div className="max-w-7xl mx-auto w-full p-6 grid grid-cols-12 gap-6 relative z-10">
        
        {/* Left Rail (22%) */}
        <div className="col-span-3 space-y-6">
          <section>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 px-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Select Race</h3>
            <div className="space-y-3">
              {mockElectionIntel.races.map(race => (
                <GlassCard 
                  key={race.id} 
                  hoverEffect 
                  onClick={() => setSelectedRaceId(race.id)}
                  className={`p-4 cursor-pointer border-l-4 transition-all ${
                    selectedRaceId === race.id 
                      ? 'border-l-indigo-500 ring-1 ring-indigo-500/30 bg-indigo-500/5' 
                      : 'border-l-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {race.stage === 'general' ? 'General Election' : 'Primary Election'}
                    </span>
                    {selectedRaceId === race.id && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
                  </div>
                  <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(race.electionDate).toLocaleDateString()}
                  </div>
                  <div className={`text-xs font-mono px-2 py-0.5 rounded w-fit ${
                    race.competitiveness.rating === 'tossup' ? 'bg-red-500/20 text-red-400' :
                    race.competitiveness.rating === 'lean' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {race.competitiveness.rating.toUpperCase()}
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          <section>
             <div className="flex items-center justify-between mb-3 px-1">
               <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Timeline</h3>
               <button className="text-xs text-indigo-500 hover:underline">View All</button>
             </div>
             
             <div className="relative pl-4 border-l border-gray-200 dark:border-gray-800 space-y-6">
                {mockElectionIntel.events
                  .filter(e => e.raceId === selectedRaceId)
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(event => (
                  <div key={event.id} className="relative">
                    <div className={`absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                      event.severity === 'critical' ? 'bg-red-500' : event.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(event.date).toLocaleDateString()}</div>
                    <div className={`text-sm font-medium leading-snug mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{event.title}</div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Center Dossier (58%) */}
        <div className="col-span-6 space-y-6">
          <VulnerabilityEngine 
            profile={profile} 
            onOverrideChange={handleOverrideChange}
            scenarioModifier={scenarioModifier}
          />
          
          <ScenarioLab onModifierChange={setScenarioModifier} />

          <ElectionCenterDossier 
            race={selectedRace} 
            candidates={raceCandidates}
            linkedPolicy={mockElectionIntel.linkedPolicy}
            onCandidateClick={setSelectedCandidate}
          />

          <section>
             <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 px-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sources & Provenance</h3>
             <GlassCard className="p-4">
                <div className="space-y-2">
                  {mockElectionIntel.sources.slice(0, 3).map(src => (
                    <div key={src.id} className="flex items-start gap-2 text-sm group cursor-pointer">
                      <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-indigo-500" />
                      <a href={src.url || '#'} className={`truncate ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}`}>
                        {src.title}
                      </a>
                    </div>
                  ))}
                  <div className="pt-2 text-xs text-center text-gray-500 cursor-pointer hover:text-indigo-500">
                    View full source list
                  </div>
                </div>
             </GlassCard>
          </section>
        </div>

        {/* Right Rail (25%) */}
        <div className="col-span-3 h-[calc(100vh-140px)] sticky top-24">
           <ActionCenter 
              opportunities={opportunities} 
              playbooks={mockElectionIntel.playbooks}
              onActivatePlaybook={handleActivatePlaybook}
              onSnoozeOpportunity={handleSnoozeOpportunity}
              onDismissOpportunity={handleDismissOpportunity}
              runLog={runLog}
           />
        </div>

      </div>

      {/* Candidate Drawer Overlay */}
      {selectedCandidate && (
        <CandidateDrawer 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)}
          financeData={mockElectionIntel.financeSnapshots}
          endorsements={mockElectionIntel.endorsements}
        />
      )}
    </PageLayout>
  );
}
