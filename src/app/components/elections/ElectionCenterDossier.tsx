import React from 'react';
import { ChevronRight, ArrowRight, ShieldAlert, Target, ThumbsUp, ThumbsDown, User, DollarSign } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { GlassCard, StatusChip } from './ElectionSharedComponents';
import { ElectionRace, ElectionCandidate, LinkedPolicy, ElectionLegislator } from '../../data/electionMockData';

interface ElectionCenterDossierProps {
  race: ElectionRace;
  candidates: ElectionCandidate[];
  linkedPolicy: LinkedPolicy;
  onCandidateClick: (candidate: ElectionCandidate) => void;
}

export const ElectionCenterDossier: React.FC<ElectionCenterDossierProps> = ({ race, candidates, linkedPolicy, onCandidateClick }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      
      {/* Race Overview Card */}
      <GlassCard className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{race.officeName}</h2>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium uppercase tracking-wider ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {race.stage} Election
              </span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>•</span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date(race.electionDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          <StatusChip status={race.competitiveness.rating} />
        </div>
        
        <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {race.notes}
        </p>

        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
          <div>Filing: {new Date(race.filingDeadline).toLocaleDateString()}</div>
          <div>Early Voting: {new Date(race.earlyVotingStart).toLocaleDateString()}</div>
        </div>
      </GlassCard>

      {/* Candidate Field */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Candidate Field</h3>
          <span className="text-xs text-gray-500">{candidates.length} candidates</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {candidates.map(candidate => (
            <GlassCard 
              key={candidate.id} 
              hoverEffect 
              onClick={() => onCandidateClick(candidate)}
              className="p-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-lg font-bold text-white">
                    {candidate.fullName.charAt(0)}
                  </div>
                  {candidate.isIncumbent && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900">
                      INC
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {candidate.fullName}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusChip status={candidate.status} size="sm" />
                    {candidate.credibleChallengerFlag && (
                      <ShieldAlert size={12} className="text-red-500" />
                    )}
                  </div>
                </div>
                
                <ChevronRight size={16} className={`text-gray-500 transition-transform group-hover:translate-x-1`} />
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Incentive Lens */}
      <section>
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 px-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Incentive Lens Strategy</h3>
        <GlassCard className="p-0 overflow-hidden">
          <div className="grid grid-cols-3 divide-x dark:divide-white/10 divide-gray-200">
            <div className="p-4 bg-gradient-to-b from-green-500/5 to-transparent">
              <div className="flex items-center gap-2 mb-3 text-green-500">
                <ThumbsUp size={16} />
                <span className="text-xs font-bold uppercase">Needs</span>
              </div>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Fiscal narrative win</li>
                <li>• Public safety validator</li>
                <li>• District infrastructure</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gradient-to-b from-red-500/5 to-transparent">
              <div className="flex items-center gap-2 mb-3 text-red-500">
                <ThumbsDown size={16} />
                <span className="text-xs font-bold uppercase">Avoids</span>
              </div>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Abortion hardline</li>
                <li>• Tax increases</li>
                <li>• Education cuts</li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-b from-blue-500/5 to-transparent">
              <div className="flex items-center gap-2 mb-3 text-blue-500">
                <Target size={16} />
                <span className="text-xs font-bold uppercase">Messaging</span>
              </div>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• "Practical results"</li>
                <li>• "Community safety"</li>
                <li>• "Jobs first"</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Integrated Pythia Edge */}
      <section>
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 px-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Integrated Policy Risk</h3>
        <div className="grid grid-cols-1 gap-3">
          {linkedPolicy.bills.map(bill => (
            <GlassCard key={bill.id} className="p-3 flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{bill.number}</span>
                  <StatusChip status={bill.stance} size="sm" />
                </div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{bill.title}</div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  bill.sensitivity === 'high' ? 'bg-red-500/20 text-red-300' : bill.sensitivity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {bill.sensitivity} Risk
                </span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1 group-hover:text-indigo-400 transition-colors cursor-pointer">
                  View Detail <ArrowRight size={10} />
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
};
