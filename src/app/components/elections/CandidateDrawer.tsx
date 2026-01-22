import React, { useState } from 'react';
import { X, ExternalLink, MessageSquare, DollarSign, Award, FileText, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ElectionCandidate, Endorsement, FinanceSnapshot } from '../../data/electionMockData';
import { StatusChip } from './ElectionSharedComponents';
import { Button } from '../ui/Button';

interface CandidateDrawerProps {
  candidate: ElectionCandidate | null;
  onClose: () => void;
  financeData: FinanceSnapshot[];
  endorsements: Endorsement[];
}

export const CandidateDrawer: React.FC<CandidateDrawerProps> = ({ candidate, onClose, financeData, endorsements }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'questionnaire' | 'finance' | 'endorsements'>('profile');

  if (!candidate) return null;

  // Filter data for this candidate
  const candidateFinance = financeData.filter(f => f.candidateId === candidate.id).sort((a, b) => new Date(a.periodEnd).getTime() - new Date(b.periodEnd).getTime());
  const candidateEndorsements = endorsements.filter(e => e.candidateId === candidate.id);

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === id
          ? isDarkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'
          : isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div 
        className={`w-full max-w-lg h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 ${
          isDarkMode ? 'bg-slate-900 border-l border-white/10' : 'bg-white border-l border-gray-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {candidate.fullName.charAt(0)}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {candidate.fullName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <StatusChip status={candidate.status} size="sm" />
                  {candidate.isIncumbent && <StatusChip status="Incumbent" size="sm" />}
                  {candidate.credibleChallengerFlag && <span className="text-xs font-semibold text-red-500">Credible Threat</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors`}>
              <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          </div>
          
          <div className="flex overflow-x-auto no-scrollbar border-b border-transparent">
            <TabButton id="profile" label="Profile" icon={User} />
            <TabButton id="questionnaire" label="Q&A" icon={MessageSquare} />
            <TabButton id="finance" label="Finance" icon={DollarSign} />
            <TabButton id="endorsements" label="Endorsements" icon={Award} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <section>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Bio Summary</h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {candidate.bioSummary}
                </p>
              </section>
              
              <section>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Links</h3>
                {candidate.websiteUrl ? (
                  <a href={candidate.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-500 hover:underline text-sm">
                    <ExternalLink size={14} />
                    Official Website
                  </a>
                ) : (
                  <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No website listed</span>
                )}
              </section>
            </div>
          )}

          {activeTab === 'questionnaire' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status:</span>
                <StatusChip status={candidate.questionnaireStatus} size="sm" />
              </div>

              {candidate.questionnaire.length > 0 ? (
                <div className="space-y-4">
                  {candidate.questionnaire.map((qa, idx) => (
                    <div key={idx} className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                      <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{qa.q}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{qa.a}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <FileText size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No questionnaire responses yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-6">
              {candidateFinance.length > 0 ? (
                <>
                  <div className={`p-4 rounded-lg mb-4 text-center ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <div className={`text-xs uppercase font-semibold mb-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Latest Cash on Hand</div>
                    <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${candidateFinance[candidateFinance.length - 1].cashOnHand.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {candidateFinance.map((snap) => (
                      <div key={snap.id} className={`p-3 rounded border flex justify-between items-center ${isDarkMode ? 'bg-slate-800/30 border-white/5' : 'bg-white border-gray-200'}`}>
                        <div>
                          <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Period Ending</div>
                          <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{new Date(snap.periodEnd).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Raised / Spent</div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className="text-green-500">+${snap.totalRaised.toLocaleString()}</span> / <span className="text-red-500">-${snap.totalSpent.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <DollarSign size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No financial data filed.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'endorsements' && (
            <div className="space-y-4">
              {candidateEndorsements.length > 0 ? (
                candidateEndorsements.map((end) => (
                  <div key={end.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800/30 border-white/5' : 'bg-white border-gray-200'}`}>
                    <div className={`p-2 rounded-full ${
                      end.stance === 'endorses' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <Award size={16} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{end.endorserName}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="capitalize">{end.endorserType}</span>
                        <span>•</span>
                        <span>{new Date(end.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Award size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No endorsements recorded.</p>
                </div>
              )}
              
              <Button variant="secondary" className="w-full mt-4">
                <ExternalLink size={14} className="mr-2" />
                Add Endorsement Record
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
