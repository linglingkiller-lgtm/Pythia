import React from 'react';
import { 
  TrendingUp, Users, Calendar, CheckCircle, AlertCircle, Sparkles,
  Phone, Mail, MessageSquare, Clock, Target, Zap, Award, Activity,
  Eye, ChevronRight, TrendingDown, Minus, Briefcase
} from 'lucide-react';
import { Legislator } from './legislatorData';
import { LeadershipPosition } from './chamberData';
import { LeadershipSummary } from './LeadershipSummary';

// --- Types ---
export interface LegislatorOverviewModuleProps {
  legislators: Legislator[];
  watchedLegislatorIds?: Set<string>;
  onSelectLegislator: (legislatorId: string) => void;
  leadershipPositions?: LeadershipPosition[];
  isDarkMode: boolean;
}

// --- Components ---

export function HeroStatsModule({ legislators, watchedLegislatorIds, isDarkMode }: LegislatorOverviewModuleProps) {
  const priorityACount = legislators.filter(l => l.priority === 'A').length;
  const watchedCount = watchedLegislatorIds ? watchedLegislatorIds.size : legislators.filter(l => l.watched).length;
  const needsFollowUp = legislators.filter(l => l.relationshipStatus === 'needs-follow-up').length;
  const warmRelationships = legislators.filter(l => l.relationshipStatus === 'warm').length;

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-500' : 'text-gray-500';

  const StatItem = ({ count, label, colorClass }: any) => (
    <div className="flex flex-col items-center justify-center py-2">
       <span className={`text-3xl font-bold ${colorClass}`}>{count}</span>
       <span className={`text-[10px] uppercase font-bold tracking-wider ${textMuted} mt-1`}>{label}</span>
    </div>
  );

  return (
    <div className="h-full flex items-center justify-around px-4">
      <StatItem count={priorityACount} label="Priority A" colorClass={isDarkMode ? 'text-white' : 'text-gray-900'} />
      <div className={`h-8 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
      <StatItem count={watchedCount} label="Watching" colorClass={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
      <div className={`h-8 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
      <StatItem count={needsFollowUp} label="Follow Up" colorClass={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
      <div className={`h-8 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
      <StatItem count={warmRelationships} label="Warm" colorClass={isDarkMode ? 'text-green-400' : 'text-green-600'} />
    </div>
  );
}

export function IntelligenceModule({ isDarkMode }: { isDarkMode: boolean }) {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const items = [
     {
        type: 'opportunity',
        icon: Zap,
        color: 'text-blue-500',
        title: 'High-Priority',
        desc: '3 Priority A legislators have open calendar slots this week.'
     },
     {
        type: 'warning',
        icon: AlertCircle,
        color: 'text-amber-500',
        title: 'Engagement Gap',
        desc: '5 Energy Committee members haven\'t been contacted in 30+ days.'
     },
     {
        type: 'success',
        icon: TrendingUp,
        color: 'text-emerald-500',
        title: 'Momentum',
        desc: 'Outreach frequency is up 34% compared to last month.'
     },
     {
        type: 'strategic',
        icon: Target,
        color: 'text-purple-500',
        title: 'Strategy Update',
        desc: 'Speaker Johnson\'s CoS mentioned client favorably in committee.'
     }
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
       <div className="divide-y divide-gray-100 dark:divide-white/5">
          {items.map((item, idx) => (
             <div key={idx} className="p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                <div className="flex gap-3">
                   <div className={`mt-0.5 flex-shrink-0 ${item.color}`}>
                      <item.icon size={16} />
                   </div>
                   <div>
                      <div className={`text-xs font-bold uppercase mb-1 ${item.color}`}>{item.title}</div>
                      <p className={`text-sm leading-snug ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.desc}</p>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}

export function PriorityLegislatorsModule({ legislators, onSelectLegislator, isDarkMode }: LegislatorOverviewModuleProps) {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  
  const priorityLegislators = legislators.filter(l => l.priority === 'A').slice(0, 10);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
       <div className="divide-y divide-gray-100 dark:divide-white/5">
          {priorityLegislators.map(legislator => (
             <button
                key={legislator.id}
                onClick={() => onSelectLegislator(legislator.id)}
                className="w-full p-3 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
             >
                <div className="flex items-center gap-3 min-w-0">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                      legislator.party === 'R' 
                         ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                         : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                   }`}>
                      {legislator.party.charAt(0)}
                   </div>
                   <div className="min-w-0 truncate">
                      <div className={`text-sm font-semibold truncate ${textColor} group-hover:text-blue-500 transition-colors`}>
                         {legislator.name}
                      </div>
                      <div className={`text-xs ${textMuted} truncate`}>
                         {legislator.chamber} • {legislator.district}
                      </div>
                   </div>
                </div>
                <ChevronRight size={14} className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${textMuted}`} />
             </button>
          ))}
       </div>
    </div>
  );
}

export function CommitteeInfluenceModule({ isDarkMode }: { isDarkMode: boolean }) {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const Card = ({ name, score, count }: any) => (
    <div className="p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
      <div className="flex justify-between items-center mb-2">
         <span className={`text-sm font-medium ${textColor}`}>{name}</span>
         <span className={`text-[10px] uppercase font-bold tracking-wider ${textMuted}`}>{count} Members</span>
      </div>
      <div className="flex items-center gap-3">
         <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
               className={`h-full rounded-full transition-all duration-1000 ${score > 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
               style={{ width: `${score}%` }} 
            />
         </div>
         <span className={`text-xs font-bold w-8 text-right ${score > 75 ? 'text-emerald-500' : 'text-amber-500'}`}>
            {score}%
         </span>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar divide-y divide-gray-100 dark:divide-white/5">
       <Card name="Energy & Environment" score={87} count={8} />
       <Card name="Appropriations" score={72} count={12} />
       <Card name="Health & Human Services" score={64} count={6} />
       <Card name="Education" score={58} count={5} />
    </div>
  );
}

export function RecentActivityModule({ isDarkMode }: { isDarkMode: boolean }) {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const ActivityItem = ({ icon: Icon, action, time, colorClass, bgClass }: any) => (
    <div className="flex gap-3 items-start group p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
       <div className={`mt-0.5 p-1.5 rounded-md flex-shrink-0 ${bgClass}`}>
          <Icon size={14} className={colorClass} />
       </div>
       <div className="min-w-0 flex-1">
          <div className={`text-sm font-medium ${textColor} group-hover:text-blue-500 transition-colors`}>{action}</div>
          <div className={`text-xs ${textMuted} mt-0.5`}>{time}</div>
       </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar divide-y divide-gray-100 dark:divide-white/5">
       <ActivityItem 
          icon={Phone} 
          action="Call with Rep. Martinez" 
          time="2h ago"
          colorClass="text-blue-500"
          bgClass={isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}
       />
       <ActivityItem 
          icon={Mail} 
          action="Email to Sen. Wilson" 
          time="Yesterday"
          colorClass="text-purple-500"
          bgClass={isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}
       />
       <ActivityItem 
          icon={CheckCircle} 
          action="Added Rep. Thompson" 
          time="2d ago"
          colorClass="text-emerald-500"
          bgClass={isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}
       />
        <ActivityItem 
          icon={Calendar} 
          action="Meeting: Rep. Garcia" 
          time="3d ago"
          colorClass="text-amber-500"
          bgClass={isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'}
       />
    </div>
  );
}

export function LeadershipModuleWrapper({ leadershipPositions, onSelectLegislator }: any) {
  return (
     <LeadershipSummary 
        positions={leadershipPositions} 
        onSelectLegislator={onSelectLegislator} 
        isEmbedded={true}
     />
  );
}
