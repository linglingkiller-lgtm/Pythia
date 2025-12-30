import React from 'react';
import { Search, Plus, Calendar, Filter } from 'lucide-react';
import { LegislatorList } from './LegislatorList';
import { LegislatorProfilePanel } from './LegislatorProfilePanel';
import { mockLegislators } from '../legislators/legislatorData';

export interface Legislator {
  id: number;
  name: string;
  photo: string;
  title: string;
  district: string;
  chamber: 'House' | 'Senate';
  party?: string;
  relationship: 'Priority' | 'Watch' | 'Neutral';
  lastInteraction: string;
  nextAction?: string;
  committees: string[];
  topCommittee: string;
  birthday?: string;
  phone?: string;
  email?: string;
  issueInterests: string[];
  caucuses: string[];
  billsSponsored: number;
  recentActivity: Array<{
    type: string;
    date: string;
    description: string;
  }>;
  staffContacts: Array<{
    name: string;
    title: string;
    email: string;
    phone: string;
  }>;
  interactions: Array<{
    type: 'Call' | 'Meeting' | 'Email' | 'Event';
    date: string;
    summary: string;
    outcome: string;
  }>;
}

interface LegislatorDatabaseProps {
  watchedLegislatorIds?: Set<string>;
  onNavigateToLegislator?: (legislatorId: string) => void;
}

export function LegislatorDatabase({ watchedLegislatorIds, onNavigateToLegislator }: LegislatorDatabaseProps) {
  const [selectedLegislator, setSelectedLegislator] = React.useState<Legislator | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [chamberFilter, setChamberFilter] = React.useState<'All' | 'House' | 'Senate'>('All');
  const [relationshipFilter, setRelationshipFilter] = React.useState<'All' | 'Priority' | 'Watch' | 'Neutral'>('All');

  // Map new legislator data to old interface format and filter by watched status
  const legislators: Legislator[] = mockLegislators
    .filter(leg => watchedLegislatorIds ? watchedLegislatorIds.has(leg.id) : leg.watched)
    .map((leg) => ({
      id: leg.id as any, // Store original ID for navigation
      name: leg.name,
      photo: leg.photoUrl || 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=400',
      title: leg.title,
      district: leg.district,
      chamber: leg.chamber as 'House' | 'Senate',
      party: leg.party === 'R' ? 'Republican' : 'Democrat',
      relationship: leg.priority === 'A' ? 'Priority' : 'Watch',
      lastInteraction: leg.lastInteraction,
      nextAction: leg.nextRecommendedTouch ? `Follow up ${leg.nextRecommendedTouch}` : undefined,
      committees: leg.committees.map(c => c.name),
      topCommittee: leg.committees[0]?.name || '',
      birthday: undefined,
      phone: leg.phone,
      email: leg.email,
      issueInterests: leg.keyIssues || [],
      caucuses: [],
      billsSponsored: leg.billsSponsored || 0,
      recentActivity: leg.recentVotes?.slice(0, 2).map(vote => ({
        type: 'Vote',
        date: vote.date,
        description: `Voted ${vote.vote} on ${vote.bill}`
      })) || [],
      staffContacts: leg.staff?.map(s => ({
        name: s.name,
        title: s.title,
        email: s.email,
        phone: s.phone
      })) || [],
      interactions: []
    }));

  const filteredLegislators = legislators.filter(leg => {
    const matchesSearch = leg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leg.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leg.committees.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesChamber = chamberFilter === 'All' || leg.chamber === chamberFilter;
    const matchesRelationship = relationshipFilter === 'All' || leg.relationship === relationshipFilter;
    return matchesSearch && matchesChamber && matchesRelationship;
  });

  React.useEffect(() => {
    if (filteredLegislators.length > 0 && !selectedLegislator) {
      setSelectedLegislator(filteredLegislators[0]);
    }
  }, []);

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-1">Legislators</h2>
            <p className="text-sm text-gray-500">Search, filter, and manage relationships</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Plus size={16} />
              Add Legislator
            </button>
            <button className="px-4 py-2 bg-red-900 text-white rounded text-sm hover:bg-red-800 transition-colors flex items-center gap-2">
              <Calendar size={16} />
              Log Interaction
            </button>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search name, district, committee, staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            <option>Chamber</option>
            <option>House</option>
            <option>Senate</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            <option>Session</option>
            <option>2024 Regular</option>
            <option>2023 Special</option>
          </select>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: List */}
        <div className="col-span-5">
          <LegislatorList
            legislators={filteredLegislators}
            selectedLegislator={selectedLegislator}
            onSelectLegislator={setSelectedLegislator}
            chamberFilter={chamberFilter}
            onChamberFilterChange={setChamberFilter}
            relationshipFilter={relationshipFilter}
            onRelationshipFilterChange={setRelationshipFilter}
          />
        </div>

        {/* Right: Profile Panel */}
        <div className="col-span-7">
          {selectedLegislator && (
            <LegislatorProfilePanel 
              legislator={selectedLegislator}
              onNavigateToLegislator={onNavigateToLegislator}
            />
          )}
        </div>
      </div>
    </div>
  );
}