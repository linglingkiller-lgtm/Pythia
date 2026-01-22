import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, ArrowUpDown, Calendar, 
  AlertCircle, Briefcase, Eye, ChevronRight, ChevronDown 
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Race, Candidate } from '../../../data/electionsHubData';
import { StatusChip, TrendSparkline, TrendIndicator } from '../shared/ElectionsSharedComponents';
import { Button } from '../../ui/Button';

interface RacesTableProps {
  races: Race[];
  candidates: Candidate[];
  onOpenRace: (race: Race) => void;
  onCompare: (raceIds: string[]) => void;
}

export const RacesTable: React.FC<RacesTableProps> = ({ races, candidates, onOpenRace, onCompare }) => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRaceIds, setSelectedRaceIds] = useState<Set<string>>(new Set());
  const [selectedCandidateId, setSelectedCandidateId] = useState<Record<string, string>>({});
  const [expandedRaces, setExpandedRaces] = useState<Set<string>>(new Set());

  const filteredRaces = races.filter(r => 
    r.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.office.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedRaceIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRaceIds(newSet);
  };

  const toggleRaceExpansion = (raceId: string) => {
    const newSet = new Set(expandedRaces);
    if (newSet.has(raceId)) {
      newSet.delete(raceId);
    } else {
      newSet.add(raceId);
    }
    setExpandedRaces(newSet);
  };

  const selectCandidate = (raceId: string, candidateId: string) => {
    setSelectedCandidateId(prev => ({
      ...prev,
      [raceId]: candidateId
    }));
    // Collapse the dropdown after selection
    const newSet = new Set(expandedRaces);
    newSet.delete(raceId);
    setExpandedRaces(newSet);
  };

  const getCandidatesForRace = (raceId: string): Candidate[] => {
    return candidates.filter(c => c.raceId === raceId);
  };

  const getSelectedCandidate = (raceId: string): Candidate | undefined => {
    const candidateId = selectedCandidateId[raceId];
    return candidateId ? candidates.find(c => c.id === candidateId) : undefined;
  };

  const getTrendData = (race: Race): { direction: 'improving' | 'stable' | 'worsening'; series: number[] } => {
    const selectedCandidate = getSelectedCandidate(race.id);
    if (selectedCandidate) {
      return selectedCandidate.trend;
    }
    return race.trend;
  };

  const getTrendColor = (direction: 'improving' | 'stable' | 'worsening'): string => {
    switch (direction) {
      case 'improving': return 'green';
      case 'worsening': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
           <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
           <input
             type="text"
             placeholder="Search races, districts, candidates..."
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm transition-all ${
               isDarkMode 
                 ? 'bg-slate-800 border-white/10 text-white placeholder-gray-600 focus:border-indigo-500' 
                 : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
             }`}
           />
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="secondary" size="sm">
             <Filter size={14} className="mr-2" /> Filter
           </Button>
           <Button variant="secondary" size="sm">
             <Briefcase size={14} className="mr-2" /> Saved Views
           </Button>
           {selectedRaceIds.size > 0 && (
             <Button 
               variant="primary" 
               size="sm" 
               className="bg-indigo-600 hover:bg-indigo-700"
               onClick={() => onCompare(Array.from(selectedRaceIds))}
             >
               Compare ({selectedRaceIds.size})
             </Button>
           )}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-lg border overflow-hidden ${isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-gray-200 bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase font-bold ${isDarkMode ? 'bg-slate-900 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
              <tr>
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 dark:border-gray-700" />
                </th>
                <th className="p-4">Race / District</th>
                <th className="p-4">Candidate</th>
                <th className="p-4">Status</th>
                <th className="p-4 cursor-pointer hover:text-indigo-500">
                   <div className="flex items-center gap-1">Score <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4">Trend</th>
                <th className="p-4">Money Heat</th>
                <th className="p-4">Top Issue</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredRaces.map(race => {
                const raceCandidates = getCandidatesForRace(race.id);
                const selectedCandidate = getSelectedCandidate(race.id);
                const isExpanded = expandedRaces.has(race.id);
                const trendData = getTrendData(race);

                return (
                  <tr 
                    key={race.id} 
                    className={`group transition-colors ${
                      isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="p-4" onClick={e => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedRaceIds.has(race.id)}
                        onChange={() => toggleSelection(race.id)}
                        className="rounded border-gray-300 dark:border-gray-700 accent-indigo-500" 
                      />
                    </td>
                    <td className="p-4" onClick={() => onOpenRace(race)}>
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {race.district}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {race.office}
                      </div>
                    </td>
                    <td className="p-4 relative" onClick={e => e.stopPropagation()}>
                      {raceCandidates.length > 0 ? (
                        <div className="relative">
                          <button
                            onClick={() => toggleRaceExpansion(race.id)}
                            className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all min-w-[140px] ${
                              isDarkMode 
                                ? 'bg-slate-800 border-white/10 text-white hover:bg-slate-700' 
                                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <span className="truncate">
                              {selectedCandidate ? selectedCandidate.name : 'All Candidates'}
                            </span>
                            <ChevronDown 
                              size={14} 
                              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                            />
                          </button>

                          {/* Dropdown */}
                          {isExpanded && (
                            <div 
                              className={`absolute z-50 top-full left-0 mt-1 min-w-[200px] rounded-lg border shadow-lg ${
                                isDarkMode 
                                  ? 'bg-slate-800 border-white/10' 
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <button
                                onClick={() => selectCandidate(race.id, '')}
                                className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
                                } ${
                                  !selectedCandidate 
                                    ? isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                                    : isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}
                              >
                                All Candidates (Race View)
                              </button>
                              {raceCandidates.map(candidate => (
                                <button
                                  key={candidate.id}
                                  onClick={() => selectCandidate(race.id, candidate.id)}
                                  className={`w-full text-left px-3 py-2 text-xs transition-colors border-t ${
                                    isDarkMode 
                                      ? 'border-white/10 hover:bg-slate-700' 
                                      : 'border-gray-100 hover:bg-gray-50'
                                  } ${
                                    selectedCandidate?.id === candidate.id 
                                      ? isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                                      : isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}
                                >
                                  <div className="font-medium">{candidate.name}</div>
                                  <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {candidate.isIncumbent ? 'Incumbent' : 'Challenger'} • {candidate.status}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          No candidates
                        </span>
                      )}
                    </td>
                    <td className="p-4" onClick={() => onOpenRace(race)}>
                      <StatusChip status={race.lean} size="sm" variant="lean" />
                    </td>
                    <td className="p-4" onClick={() => onOpenRace(race)}>
                      <span className={`font-bold ${
                        race.competitivenessScore > 75 ? 'text-red-500' : 
                        race.competitivenessScore > 40 ? 'text-amber-500' : 'text-green-500'
                      }`}>
                        {race.competitivenessScore}
                      </span>
                    </td>
                    <td className="p-4" onClick={() => onOpenRace(race)}>
                      <div className="w-24">
                        <TrendSparkline 
                          data={trendData.series} 
                          color={getTrendColor(trendData.direction)} 
                        />
                        {selectedCandidate && (
                          <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {selectedCandidate.name.split(' ')[0]}'s trend
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4" onClick={() => onOpenRace(race)}>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-green-500" 
                            style={{ width: `${race.moneyHeat}%` }} 
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-500">{race.moneyHeat}</span>
                      </div>
                    </td>
                    <td className="p-4" onClick={() => onOpenRace(race)}>
                      {race.topIssues[0] && (
                        <span className={`inline-block px-2 py-0.5 rounded text-xs border ${
                          isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
                        }`}>
                          {race.topIssues[0].issue}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right" onClick={() => onOpenRace(race)}>
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                           <Eye size={14} />
                         </Button>
                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                           <ChevronRight size={14} />
                         </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
