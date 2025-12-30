import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { TrendingUp, TrendingDown, Pin, Bell, BellOff, Eye, GraduationCap, Zap, Heart, Cpu } from 'lucide-react';

interface Issue {
  name: string;
  slug: string;
  activeBills: number;
  sentiment: string;
  trend: 'up' | 'down';
  status: 'good' | 'watch' | 'hot';
  weeklyDelta?: string;
  topBills?: string[];
  isPinned?: boolean;
  isMuted?: boolean;
}

interface IssueHeatTilesProps {
  onNavigateToIssue?: (slug: string) => void;
}

export function IssueHeatTiles({ onNavigateToIssue }: IssueHeatTilesProps) {
  const [pinnedIssues, setPinnedIssues] = React.useState<Set<string>>(new Set(['energy']));
  const [mutedIssues, setMutedIssues] = React.useState<Set<string>>(new Set());

  const issues: Issue[] = [
    { 
      name: 'Education', 
      slug: 'education',
      activeBills: 6, 
      sentiment: 'Sentiment rising', 
      trend: 'up', 
      status: 'good',
      weeklyDelta: '+1 new bill',
      topBills: ['HB234', 'SB156'],
    },
    { 
      name: 'Energy', 
      slug: 'energy',
      activeBills: 8, 
      sentiment: 'Narrative shifting', 
      trend: 'down', 
      status: 'hot',
      weeklyDelta: '+3 new bills • 1 hearing scheduled',
      topBills: ['HB90', 'SB211'],
    },
    { 
      name: 'Healthcare', 
      slug: 'healthcare',
      activeBills: 4, 
      sentiment: 'Active bills increasing', 
      trend: 'up', 
      status: 'watch',
      weeklyDelta: '+2 new bills',
      topBills: ['HB890'],
    },
    { 
      name: 'Technology', 
      slug: 'technology',
      activeBills: 5, 
      sentiment: 'Committee focus', 
      trend: 'up', 
      status: 'good',
      weeklyDelta: '+1 new bill',
      topBills: ['HB456'],
    },
  ];

  const handleTogglePin = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedIssues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  const handleToggleMute = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMutedIssues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  const handleIssueClick = (slug: string) => {
    if (onNavigateToIssue) {
      onNavigateToIssue(slug);
    }
  };

  // Icon mapping for each issue
  const getIssueIcon = (slug: string) => {
    switch(slug) {
      case 'education':
        return <GraduationCap size={80} className="absolute opacity-[0.05]" style={{ 
          top: '50%', 
          right: '10px',
          transform: 'translateY(-50%)',
          filter: 'drop-shadow(0 -1px 0px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(255, 255, 255, 0.9))',
          color: '#059669',
        }} />;
      case 'energy':
        return <Zap size={80} className="absolute opacity-[0.05]" style={{ 
          top: '50%', 
          right: '10px',
          transform: 'translateY(-50%)',
          filter: 'drop-shadow(0 -1px 0px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(255, 255, 255, 0.9))',
          color: '#dc2626',
        }} />;
      case 'healthcare':
        return <Heart size={80} className="absolute opacity-[0.05]" style={{ 
          top: '50%', 
          right: '10px',
          transform: 'translateY(-50%)',
          filter: 'drop-shadow(0 -1px 0px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(255, 255, 255, 0.9))',
          color: '#f59e0b',
        }} />;
      case 'technology':
        return <Cpu size={80} className="absolute opacity-[0.05]" style={{ 
          top: '50%', 
          right: '10px',
          transform: 'translateY(-50%)',
          filter: 'drop-shadow(0 -1px 0px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(255, 255, 255, 0.9))',
          color: '#059669',
        }} />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 tracking-tight">Issue Heat</h3>
        <button 
          onClick={() => onNavigateToIssue?.('')}
          className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline"
        >
          View all
        </button>
      </div>
      
      <div className="space-y-3">
        {issues.map((issue, index) => {
          const isPinned = pinnedIssues.has(issue.slug);
          const isMuted = mutedIssues.has(issue.slug);
          
          return (
            <div
              key={index}
              onClick={() => handleIssueClick(issue.slug)}
              className={`
                relative p-4 rounded border transition-all cursor-pointer group overflow-hidden
                ${issue.status === 'hot' ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50' : ''}
                ${issue.status === 'watch' ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50' : ''}
                ${issue.status === 'good' ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50' : ''}
                ${isMuted ? 'opacity-50' : ''}
                hover:scale-[1.02]
              `}
            >
              {/* Watermark Icon */}
              <div className="pointer-events-none">
                {getIssueIcon(issue.slug)}
              </div>

              {/* Pin Badge */}
              {isPinned && (
                <div className="absolute top-2 right-2 z-10">
                  <Pin size={12} className="text-red-600 fill-red-600" />
                </div>
              )}

              <div className="flex items-start justify-between mb-2 relative z-10">
                <h4 className="text-gray-900 font-medium">{issue.name}</h4>
                <Chip variant={issue.status} size="sm">{issue.status === 'good' ? 'Good' : issue.status === 'watch' ? 'Watch' : 'Hot'}</Chip>
              </div>
              <div className="text-sm text-gray-400 mb-2">Active bills: {issue.activeBills}</div>
              
              {/* Weekly Delta */}
              {issue.weeklyDelta && (
                <div className="text-xs text-gray-500 mb-2">{issue.weeklyDelta}</div>
              )}
              
              {/* Top Bills */}
              {issue.topBills && issue.topBills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {issue.topBills.map((bill) => (
                    <span
                      key={bill}
                      className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded"
                    >
                      {bill}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {issue.trend === 'up' ? <TrendingUp size={14} className="text-green-400" /> : <TrendingDown size={14} className="text-red-400" />}
                {issue.sentiment}
              </div>

              {/* Hover Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 right-2 flex items-center gap-1">
                <button
                  onClick={(e) => handleTogglePin(issue.slug, e)}
                  className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  title={isPinned ? 'Unpin' : 'Pin to Dashboard'}
                >
                  <Pin
                    size={12}
                    className={isPinned ? 'text-red-600 fill-red-600' : 'text-gray-600'}
                  />
                </button>
                <button
                  onClick={(e) => handleToggleMute(issue.slug, e)}
                  className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <BellOff size={12} className="text-gray-600" />
                  ) : (
                    <Bell size={12} className="text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}