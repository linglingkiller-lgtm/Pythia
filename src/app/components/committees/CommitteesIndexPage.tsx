import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'motion/react';
import { committeesDemoData, Committee, searchCommittees } from '../../../demo/committeesDemoData';
import { Search, Filter, GitBranch, Users, Calendar, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

interface CommitteesIndexPageProps {
  initialCommitteeId?: string | null;
  onNavigateToCommittee?: (committeeId: string) => void;
  onNavigateToLegislator?: (legislatorId: string) => void;
}

export function CommitteesIndexPage({
  initialCommitteeId,
  onNavigateToCommittee,
  onNavigateToLegislator
}: CommitteesIndexPageProps) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedChamber, setSelectedChamber] = React.useState<'All' | 'House' | 'Senate' | 'Joint'>('All');
  const [selectedCommittee, setSelectedCommittee] = React.useState<Committee | null>(null);

  // Load selected committee from localStorage or initialCommitteeId
  React.useEffect(() => {
    if (initialCommitteeId) {
      const committee = committeesDemoData.find(c => c.id === initialCommitteeId);
      if (committee) {
        setSelectedCommittee(committee);
        return;
      }
    }
    
    const savedId = localStorage.getItem('pythia_selected_committee_id');
    if (savedId) {
      const committee = committeesDemoData.find(c => c.id === savedId);
      if (committee) {
        setSelectedCommittee(committee);
        return;
      }
    }
    
    // Default to first committee
    if (committeesDemoData.length > 0) {
      setSelectedCommittee(committeesDemoData[0]);
    }
  }, [initialCommitteeId]);

  // Filter committees
  const filteredCommittees = React.useMemo(() => {
    let results = searchCommittees(searchQuery, {
      chamber: selectedChamber === 'All' ? undefined : selectedChamber
    });
    
    // Sort by activity score
    return results.sort((a, b) => b.activityScore - a.activityScore);
  }, [searchQuery, selectedChamber]);

  const handleSelectCommittee = (committee: Committee) => {
    setSelectedCommittee(committee);
    localStorage.setItem('pythia_selected_committee_id', committee.id);
    if (onNavigateToCommittee) {
      onNavigateToCommittee(committee.id);
    }
  };

  const getChamberColor = (chamber: string) => {
    if (chamber === 'House') return 'text-blue-500';
    if (chamber === 'Senate') return 'text-red-500';
    return 'text-purple-500';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <GitBranch size={32} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            <h1 className={`text-4xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              Committees
            </h1>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track committee activity, predicted focus areas, and legislative intelligence
          </p>
        </motion.div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Committee List */}
          <div className="col-span-3">
            <div className={`rounded-lg border backdrop-blur-sm sticky top-6 ${
              isDarkMode
                ? 'bg-slate-800/40 border-white/10'
                : 'bg-white/80 border-gray-200'
            }`}>
              {/* Search & Filter */}
              <div className="p-4 border-b border-white/10">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <Search size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <input
                    type="text"
                    placeholder="Search committees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                  />
                </div>
                
                <div className="flex gap-2 mt-3">
                  {['All', 'House', 'Senate', 'Joint'].map(chamber => (
                    <button
                      key={chamber}
                      onClick={() => setSelectedChamber(chamber as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedChamber === chamber
                          ? isDarkMode
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                          : isDarkMode
                            ? 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {chamber}
                    </button>
                  ))}
                </div>
              </div>

              {/* Committee List */}
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                {filteredCommittees.map((committee) => (
                  <button
                    key={committee.id}
                    onClick={() => handleSelectCommittee(committee)}
                    className={`w-full text-left p-4 border-b transition-all ${
                      selectedCommittee?.id === committee.id
                        ? isDarkMode
                          ? 'bg-blue-500/10 border-blue-400/20'
                          : 'bg-blue-50 border-blue-200'
                        : isDarkMode
                          ? 'border-white/5 hover:bg-slate-700/30'
                          : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {committee.name}
                      </h3>
                      <span className={`text-xs font-bold ${getChamberColor(committee.chamber)}`}>
                        {committee.chamber === 'House' ? 'H' : committee.chamber === 'Senate' ? 'S' : 'J'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Users size={12} />
                      <span>{committee.members.length} members</span>
                      <span className="mx-1">•</span>
                      <TrendingUp size={12} />
                      <span className={committee.activityScore >= 85 ? 'text-red-500 font-semibold' : ''}>
                        {committee.activityScore} activity
                      </span>
                    </div>

                    {committee.nextMeeting && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={12} />
                        <span>
                          {new Date(committee.nextMeeting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Committee Overview */}
          <div className="col-span-6 space-y-6">
            {selectedCommittee && (
              <>
                {/* Committee Header */}
                <motion.div
                  key={selectedCommittee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg border backdrop-blur-sm p-6 ${
                    isDarkMode
                      ? 'bg-slate-800/40 border-white/10'
                      : 'bg-white/80 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedCommittee.name}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          selectedCommittee.chamber === 'House'
                            ? 'bg-blue-500/20 text-blue-400'
                            : selectedCommittee.chamber === 'Senate'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {selectedCommittee.chamber}
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedCommittee.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1.5 rounded-lg ${
                        selectedCommittee.activityScore >= 90
                          ? 'bg-red-500/20 text-red-400'
                          : selectedCommittee.activityScore >= 80
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        <div className="text-xs font-semibold">Activity</div>
                        <div className="text-2xl font-bold">{selectedCommittee.activityScore}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedCommittee.tags.map(tag => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isDarkMode
                            ? 'bg-slate-700/50 text-gray-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Focus Forecast */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`rounded-lg border backdrop-blur-sm p-6 ${
                    isDarkMode
                      ? 'bg-slate-800/40 border-white/10'
                      : 'bg-white/80 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={20} className="text-purple-500" />
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Session Focus Forecast
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {selectedCommittee.predictedFocus.map((focus, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          isDarkMode
                            ? 'bg-slate-700/30 border-white/10'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {focus.topic}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-24 rounded-full overflow-hidden ${
                              isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                            }`}>
                              <div
                                className={`h-full ${
                                  focus.confidence >= 90
                                    ? 'bg-green-500'
                                    : focus.confidence >= 80
                                      ? 'bg-blue-500'
                                      : 'bg-yellow-500'
                                }`}
                                style={{ width: `${focus.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold">{focus.confidence}%</span>
                          </div>
                        </div>
                        <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {focus.summary}
                        </p>
                        <div className="text-xs">
                          <div className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Key Signals:
                          </div>
                          <ul className={`space-y-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                            {focus.evidenceSignals.slice(0, 3).map((signal, i) => (
                              <li key={i}>• {signal}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Right Column - Intel Panel */}
          <div className="col-span-3">
            {selectedCommittee && (
              <div className={`rounded-lg border backdrop-blur-sm p-6 sticky top-6 ${
                isDarkMode
                  ? 'bg-slate-800/40 border-white/10'
                  : 'bg-white/80 border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Committee Intel
                </h3>

                {/* Quick Stats */}
                <div className="space-y-3 mb-6">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                    <div className="text-xs text-gray-500 mb-1">Members</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedCommittee.members.length}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                    <div className="text-xs text-gray-500 mb-1">Next Meeting</div>
                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(selectedCommittee.nextMeeting).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                    <div className="text-xs text-gray-500 mb-1">Bills in Pipeline</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedCommittee.billsPipeline.length}
                    </div>
                  </div>
                </div>

                {/* Leadership */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Leadership
                  </h4>
                  {selectedCommittee.members
                    .filter(m => m.roleInCommittee === 'Chair' || m.roleInCommittee === 'Vice Chair')
                    .map(member => (
                      <button
                        key={member.legislatorId}
                        onClick={() => onNavigateToLegislator && onNavigateToLegislator(member.legislatorId)}
                        className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                          isDarkMode
                            ? 'bg-slate-700/30 hover:bg-slate-700/50'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {member.photoUrl && (
                            <img
                              src={member.photoUrl}
                              alt={member.legislatorName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {member.legislatorName}
                            </div>
                            <div className="text-xs text-gray-500">{member.roleInCommittee}</div>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </button>
                    ))}
                </div>

                {/* Recent Intel */}
                <div>
                  <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Recent Intel
                  </h4>
                  <div className="space-y-3">
                    {selectedCommittee.mediaIntel.slice(0, 3).map(intel => (
                      <div
                        key={intel.id}
                        className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'}`}
                      >
                        <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {intel.headline}
                        </div>
                        <div className="text-xs text-gray-500">
                          {intel.source} • {new Date(intel.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
