import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Menu, ChevronDown, Search, Plus, Settings, Bell, 
  Map as MapIcon, BarChart3, Users, TrendingUp, Vote, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { mockElectionsHub, Race } from '../data/electionsHubData';
import { getPageTheme, hexToRgba } from '../config/pageThemes';
import avatarImage from 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png';

// Components
import { ElectionsDashboard } from '../components/elections-hub/ElectionsDashboard';
import { RaceDossierDrawer } from '../components/elections-hub/dossier/RaceDossierDrawer';
import { CompareRacesModal } from '../components/elections-hub/races/CompareRacesModal';

// Header Functionality Imports
import { useAuth } from '../contexts/AuthContext';
import { useAskPythia } from '../contexts/AskPythiaContext';
import { PageLayout } from '../components/ui/PageLayout';

export default function ElectionsHubPage() {
  const { isDarkMode } = useTheme();
  const { openPythia } = useAskPythia();
  
  // Page State
  const [selectedCountyId, setSelectedCountyId] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareRaceIds, setCompareRaceIds] = useState<string[]>([]);
  const [mapLayer, setMapLayer] = useState('Control');
  
  // Customization State
  const [isEditMode, setIsEditMode] = useState(false);

  const electionsTheme = getPageTheme('Elections');
  
  const compareRaces = mockElectionsHub.races.filter(r => compareRaceIds.includes(r.id));

  // Handlers
  const handleOpenRace = (race: Race) => {
    setSelectedRace(race);
    setIsDossierOpen(true);
  };

  const handleCompareRaces = (raceIds: string[]) => {
    setCompareRaceIds(raceIds);
    setIsCompareOpen(true);
  };

  const handleActivatePlaybook = (key: string) => {
    alert(`Activated playbook: ${key}. Tasks generated in War Room.`);
  };

  // Stats for Header
  const totalRaces = mockElectionsHub.races.length;
  const tossUpCount = mockElectionsHub.races.filter(r => r.competitiveness === 'Toss-up').length;
  // Mock average polling
  const avgPolling = "D+2.4";

  const headerContent = (
    <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
            <MapIcon size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold">{totalRaces} Active Races</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            <AlertCircle size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold">{tossUpCount} Toss-ups</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
            <BarChart3 size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold">{avgPolling} Avg Polling</span>
        </div>
    </div>
  );

  return (
    <PageLayout
      title="Elections Hub"
      subtitle="Campaign Intelligence"
      accentColor={electionsTheme.accent}
      headerIcon={
        <Vote 
          size={28} 
          color={isDarkMode ? "white" : electionsTheme.accent} 
          strokeWidth={2.5}
          className={isDarkMode ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""}
        />
      }
      backgroundImage={
        <Vote 
          size={450} 
          color={isDarkMode ? "white" : electionsTheme.accent} 
          strokeWidth={0.5}
        />
      }
      headerContent={headerContent}
      contentClassName="flex-1 overflow-y-auto custom-scrollbar flex flex-col"

      // Customization Hooks
      onCustomize={() => setIsEditMode(true)}
      isCustomizing={isEditMode}
      onSaveCustomization={() => setIsEditMode(false)}
      onCancelCustomization={() => setIsEditMode(false)}
    >
      <div className="relative h-full flex flex-col">
        <ElectionsDashboard 
            selectedCountyId={selectedCountyId}
            onSelectCounty={setSelectedCountyId}
            onOpenRace={handleOpenRace}
            onCompareRaces={handleCompareRaces}
            mapLayer={mapLayer}
            setMapLayer={setMapLayer}
            isEditMode={isEditMode}
        />
      </div>

      <RaceDossierDrawer 
        isOpen={isDossierOpen} 
        onClose={() => setIsDossierOpen(false)}
        race={selectedRace}
        candidates={mockElectionsHub.candidates}
        opportunities={mockElectionsHub.opportunities}
        onActivatePlaybook={handleActivatePlaybook}
      />

      <CompareRacesModal 
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        races={compareRaces}
      />
    </PageLayout>
  );
}
