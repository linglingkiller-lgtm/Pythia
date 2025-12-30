import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Filter, X } from 'lucide-react';
import { Legislator } from './LegislatorDatabase';

interface LegislatorListProps {
  legislators: Legislator[];
  selectedLegislator: Legislator | null;
  onSelectLegislator: (legislator: Legislator) => void;
  chamberFilter: 'All' | 'House' | 'Senate';
  onChamberFilterChange: (filter: 'All' | 'House' | 'Senate') => void;
  relationshipFilter: 'All' | 'Priority' | 'Watch' | 'Neutral';
  onRelationshipFilterChange: (filter: 'All' | 'Priority' | 'Watch' | 'Neutral') => void;
  onNavigateToLegislator?: (legislatorId: string) => void;
}

export function LegislatorList({
  legislators,
  selectedLegislator,
  onSelectLegislator,
  chamberFilter,
  onChamberFilterChange,
  relationshipFilter,
  onRelationshipFilterChange,
  onNavigateToLegislator,
}: LegislatorListProps) {
  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'Priority': return 'bg-emerald-500';
      case 'Watch': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  const getPartyColor = (party?: string) => {
    if (party === 'Democrat') return 'text-blue-600';
    if (party === 'Republican') return 'text-red-600';
    return 'text-gray-900';
  };

  return (
    <Card className="p-5">
      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <button
            onClick={() => onChamberFilterChange('All')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              chamberFilter === 'All'
                ? 'bg-red-100 text-red-900 border border-red-300'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            All Chambers
          </button>
          <button
            onClick={() => onChamberFilterChange('House')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              chamberFilter === 'House'
                ? 'bg-red-100 text-red-900 border border-red-300'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            House
          </button>
          <button
            onClick={() => onChamberFilterChange('Senate')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              chamberFilter === 'Senate'
                ? 'bg-red-100 text-red-900 border border-red-300'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Senate
          </button>
          
          <div className="w-px h-4 bg-gray-300"></div>
          
          <button
            onClick={() => onRelationshipFilterChange('All')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              relationshipFilter === 'All'
                ? 'bg-red-100 text-red-900 border border-red-300'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onRelationshipFilterChange('Priority')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              relationshipFilter === 'Priority'
                ? 'bg-red-100 text-red-900 border border-red-300'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Priority
          </button>
          <button
            onClick={() => onRelationshipFilterChange('Watch')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              relationshipFilter === 'Watch'
                ? 'bg-red-100 text-red-900 border border-red-300'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Watch
          </button>
        </div>
        
        {(chamberFilter !== 'All' || relationshipFilter !== 'All') && (
          <button
            onClick={() => {
              onChamberFilterChange('All');
              onRelationshipFilterChange('All');
            }}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            Clear <X size={12} />
          </button>
        )}
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Showing {legislators.length} legislators</span>
      </div>

      {/* Legislator Rows */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {legislators.map((legislator) => (
          <button
            key={legislator.id}
            onClick={() => onSelectLegislator(legislator)}
            className={`w-full text-left p-3 rounded border transition-all ${
              selectedLegislator?.id === legislator.id
                ? 'bg-red-50 border-red-300 border-l-4 border-l-red-600'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Relationship Indicator Dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getRelationshipColor(legislator.relationship)}`}></div>
              
              {/* Photo */}
              <img
                src={legislator.photo}
                alt={legislator.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${getPartyColor(legislator.party)}`}>
                  {legislator.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {legislator.title} • {legislator.district}
                </div>
                
                {/* Chips */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                    {legislator.chamber}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    {legislator.topCommittee}
                  </span>
                  {legislator.committees.length > 1 && (
                    <span className="text-xs text-gray-500">+{legislator.committees.length - 1}</span>
                  )}
                </div>
              </div>
              
              {/* Last Interaction */}
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-gray-500">Last: {legislator.lastInteraction}</div>
                {legislator.nextAction && (
                  <div className="text-xs text-red-600 mt-0.5">{legislator.nextAction}</div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}