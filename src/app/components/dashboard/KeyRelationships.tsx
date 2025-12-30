import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, Users } from 'lucide-react';
import { mockLegislators } from '../legislators/legislatorData';

interface KeyRelationshipsProps {
  onNavigateToLegislator?: (legislatorId: string) => void;
  watchedLegislatorIds?: Set<string>;
}

export function KeyRelationships({ onNavigateToLegislator, watchedLegislatorIds }: KeyRelationshipsProps) {
  // Get watched legislators only
  const watchedLegislators = mockLegislators.filter(leg => 
    watchedLegislatorIds ? watchedLegislatorIds.has(leg.id) : leg.watched
  );
  
  const getPartyColor = (party: 'R' | 'D') => {
    return party === 'R' ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600';
  };
  
  return (
    <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 tracking-tight">Watching</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{watchedLegislators.length} legislators</span>
          <Users size={16} className="text-gray-500" />
        </div>
      </div>
      
      {watchedLegislators.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No legislators being watched</p>
          <p className="text-xs mt-1">Click the watch button on a legislator to add them here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {watchedLegislators.map((legislator) => (
            <div
              key={legislator.id}
              className="flex items-center gap-3 p-3 rounded bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all cursor-pointer group"
              onClick={() => onNavigateToLegislator?.(legislator.id)}
            >
              <div className={`w-10 h-10 rounded bg-gradient-to-br ${getPartyColor(legislator.party)} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                {legislator.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 font-medium truncate">{legislator.name}</div>
                <div className="text-xs text-gray-500 truncate">{legislator.title}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  {legislator.lastInteraction}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Could trigger log interaction modal
                  }}
                >
                  Log
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}