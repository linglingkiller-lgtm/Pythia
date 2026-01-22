import React from 'react';
import { 
  FileText, ShieldAlert, CheckCircle2, AlertTriangle, 
  TrendingUp, Users, Calendar, ArrowRight, User
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { DemoBill, DemoStakeholder } from '../../data/demoAssistantData';

// --- Types ---
interface CardProps {
  isDarkMode: boolean;
}

// --- Bill Summary Card ---
export const BillSummaryCard = ({ bill, isDarkMode }: { bill: DemoBill } & CardProps) => (
  <div className={`p-4 rounded-xl border mt-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
    <div className="flex items-start justify-between mb-3">
      <div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
          {bill.number}
        </span>
        <h4 className="font-bold text-sm mt-1">{bill.title}</h4>
      </div>
      <div className={`text-xs px-2 py-0.5 rounded-full border ${isDarkMode ? 'border-white/20' : 'border-gray-200'}`}>
        {bill.status}
      </div>
    </div>
    
    <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      {bill.summary}
    </p>
    
    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
      <div className="flex items-center gap-2 mb-2 text-red-500">
        <ShieldAlert size={14} />
        <span className="text-xs font-bold uppercase">Risk Analysis</span>
      </div>
      <ul className="space-y-1">
        {bill.risks.map((risk, idx) => (
          <li key={idx} className={`text-xs flex items-start gap-2 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
            <span className="mt-1 w-1 h-1 rounded-full bg-red-500 flex-none" />
            {risk}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// --- Vote Simulation Card ---
export const VoteSimulationCard = ({ scenario, isDarkMode }: { scenario: string } & CardProps) => (
  <div className={`p-4 rounded-xl border mt-2 overflow-hidden relative ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'}`}>
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-500">
        <TrendingUp size={16} />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">War Game Simulation</span>
    </div>

    <div className="mb-4">
      <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Scenario</div>
      <div className="font-medium text-sm italic">"{scenario}"</div>
    </div>

    <div className="space-y-3">
      {/* Visual Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1 font-medium">
          <span className="text-green-500">Yea: 215</span>
          <span className="text-red-500">Nay: 220</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex dark:bg-gray-700">
          <div className="h-full bg-green-500" style={{ width: '49%' }} />
          <div className="h-full bg-red-500" style={{ width: '51%' }} />
        </div>
        <div className="text-center mt-1.5">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
            FAILS BY 5 VOTES
          </span>
        </div>
      </div>
    </div>
  </div>
);

// --- Stakeholder Brief Card ---
export const StakeholderBriefCard = ({ stakeholder, isDarkMode }: { stakeholder: DemoStakeholder } & CardProps) => (
  <div className={`p-4 rounded-xl border mt-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
    <div className="flex items-center gap-3 mb-4">
      <img src={stakeholder.avatarUrl} className="w-12 h-12 rounded-full border-2 border-purple-500/30 object-cover" alt={stakeholder.name} />
      <div>
        <h4 className="font-bold text-sm">{stakeholder.name}</h4>
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {stakeholder.role}, {stakeholder.state} ({stakeholder.party?.charAt(0)})
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
        <div className="text-[10px] uppercase opacity-60">Influence</div>
        <div className="text-lg font-bold text-purple-500">{stakeholder.influence}</div>
      </div>
      <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
        <div className="text-[10px] uppercase opacity-60">Last Contact</div>
        <div className="text-xs font-medium mt-1">{stakeholder.lastInteraction.split(' ')[0]}</div>
      </div>
    </div>

    <div className="space-y-2">
      <div className="text-xs font-bold uppercase opacity-70">Top Donors</div>
      <div className="flex flex-wrap gap-1">
        {stakeholder.topDonors.map(d => (
          <span key={d} className={`text-[10px] px-2 py-0.5 rounded border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
            {d}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// --- Task Card ---
export const TaskCard = ({ task, isDarkMode }: { task: string } & CardProps) => (
  <div className={`p-3 rounded-xl border mt-2 flex items-center gap-3 ${isDarkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
    <div className="p-2 rounded-full bg-green-500 text-white">
      <CheckCircle2 size={16} />
    </div>
    <div className="flex-1">
      <div className={`text-xs font-bold uppercase mb-0.5 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Task Created</div>
      <div className="text-sm font-medium">{task}</div>
      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Due: Today (EOD)</div>
    </div>
  </div>
);

// --- Meeting Prep Card ---
export const MeetingPrepCard = ({ context, isDarkMode }: { context: string } & CardProps) => (
  <div className={`p-4 rounded-xl border mt-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-dashed border-gray-700/50">
      <Calendar size={16} className="text-purple-500" />
      <span className="font-bold text-sm">Meeting Prep Kit</span>
    </div>
    
    <div className="mb-3">
      <div className="text-xs opacity-60 mb-1">Context</div>
      <div className="text-sm font-medium">"{context}"</div>
    </div>

    <div className="space-y-2">
      <div className={`flex items-center gap-2 p-2 rounded border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
        <FileText size={14} className="opacity-50" />
        <span className="text-xs truncate flex-1">Q3 Strategy Deck.pdf</span>
        <ArrowRight size={12} className="opacity-50" />
      </div>
      <div className={`flex items-center gap-2 p-2 rounded border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
        <Users size={14} className="opacity-50" />
        <span className="text-xs truncate flex-1">Attendee Profiles (4)</span>
        <ArrowRight size={12} className="opacity-50" />
      </div>
    </div>
  </div>
);
