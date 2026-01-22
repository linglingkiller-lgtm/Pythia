import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { mockWhipCounts, WhipCount } from '../../data/whipCountData';
import { mockLegislators } from './legislatorData';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, HelpCircle, AlertCircle, Minus, Trophy, TrendingUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../ui/card';

interface Props {
  billId?: string;
}

const COLUMNS = [
  { id: 'hardYes', label: 'Hard Yes', color: 'bg-emerald-500', icon: CheckCircle2 },
  { id: 'softYes', label: 'Soft Yes', color: 'bg-emerald-300', icon: TrendingUp },
  { id: 'undecided', label: 'Undecided', color: 'bg-gray-400', icon: HelpCircle },
  { id: 'softNo', label: 'Soft No', color: 'bg-red-300', icon: AlertCircle },
  { id: 'hardNo', label: 'Hard No', color: 'bg-red-500', icon: XCircle },
] as const;

export function WhipCountBoard({ billId = 'bill-001' }: Props) {
  const { isDarkMode } = useTheme();
  const [whipData, setWhipData] = useState<WhipCount>(mockWhipCounts[billId]);
  const [selectedLegislator, setSelectedLegislator] = useState<string | null>(null);

  const getLegislator = (id: string) => mockLegislators.find(l => l.id === id);

  const moveLegislator = (id: string, fromCol: string, toCol: string) => {
    setWhipData(prev => {
      const newData = { ...prev };
      // @ts-ignore
      newData.counts[fromCol] = newData.counts[fromCol].filter(x => x !== id);
      // @ts-ignore
      newData.counts[toCol] = [...newData.counts[toCol], id];
      return newData;
    });
  };

  const totalYes = whipData.counts.hardYes.length + whipData.counts.softYes.length;
  const totalNo = whipData.counts.hardNo.length + whipData.counts.softNo.length;
  const progress = (totalYes / whipData.targetVotes) * 100;

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header Stats */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-gray-200 bg-white/50'} backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className={totalYes >= whipData.targetVotes ? 'text-yellow-400' : 'text-gray-400'} />
              Vote Projection
            </h2>
            <p className="text-sm opacity-70">Target: {whipData.targetVotes} votes for passage</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold">
              <span className="text-emerald-500">{totalYes}</span>
              <span className="mx-2 opacity-30">/</span>
              <span className="text-red-500">{totalNo}</span>
            </div>
            <p className="text-xs uppercase tracking-wider opacity-60">Yes / No</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${(totalYes / whipData.totalVotes) * 100}%` }}
          />
          <div 
            className="absolute top-0 bottom-0 w-1 bg-black/50 z-10 border-l border-white/20"
            style={{ left: `${(whipData.targetVotes / whipData.totalVotes) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1 opacity-60">
          <span>0</span>
          <span style={{ paddingLeft: `${(whipData.targetVotes / whipData.totalVotes) * 100 - 5}%` }}>Threshold ({whipData.targetVotes})</span>
          <span>{whipData.totalVotes}</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-4 h-full min-w-[1000px]">
          {COLUMNS.map((col, colIndex) => (
            <div 
              key={col.id} 
              className={`flex-1 flex flex-col rounded-xl overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100/50'}`}
            >
              {/* Column Header */}
              <div className={`p-3 border-b-4 ${col.color.replace('bg-', 'border-')} ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <col.icon size={16} />
                    <span className="font-bold text-sm uppercase">{col.label}</span>
                  </div>
                  <span className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-xs font-mono">
                    {/* @ts-ignore */}
                    {whipData.counts[col.id].length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <AnimatePresence>
                  {/* @ts-ignore */}
                  {whipData.counts[col.id].map((legId) => {
                    const leg = getLegislator(legId);
                    if (!leg) return null;
                    return (
                      <motion.div
                        key={legId}
                        layoutId={legId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`
                          p-3 rounded-lg border shadow-sm cursor-pointer group relative
                          ${isDarkMode ? 'bg-slate-800 border-white/5 hover:border-white/20' : 'bg-white border-gray-200 hover:border-gray-300'}
                        `}
                        onClick={() => setSelectedLegislator(legId)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${leg.party === 'D' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {leg.party}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{leg.name}</h4>
                            <p className="text-xs opacity-60 truncate">{leg.district}</p>
                          </div>
                        </div>

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg backdrop-blur-[1px]">
                          {colIndex > 0 && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); moveLegislator(legId, col.id, COLUMNS[colIndex - 1].id); }}
                              className="p-1.5 bg-white text-black rounded-full hover:bg-gray-200"
                              title="Move Left"
                            >
                              <ChevronLeft size={16} />
                            </button>
                          )}
                          {colIndex < COLUMNS.length - 1 && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); moveLegislator(legId, col.id, COLUMNS[colIndex + 1].id); }}
                              className="p-1.5 bg-white text-black rounded-full hover:bg-gray-200"
                              title="Move Right"
                            >
                              <ChevronRight size={16} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
