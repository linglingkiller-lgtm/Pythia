import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Users,
  FileText,
  Sparkles,
  Clock,
  Cake,
  Award,
  MessageSquare,
  User,
  Activity,
  BookOpen,
  FolderOpen,
} from 'lucide-react';
import { Legislator } from './LegislatorDatabase';

interface LegislatorProfilePanelProps {
  legislator: Legislator;
  onNavigateToLegislator?: (legislatorId: string) => void;
}

export function LegislatorProfilePanel({ legislator, onNavigateToLegislator }: LegislatorProfilePanelProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'committees' | 'contacts' | 'interactions' | 'bills' | 'notes'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'committees', label: 'Committees', icon: Users },
    { id: 'contacts', label: 'Staff & Contacts', icon: User },
    { id: 'interactions', label: 'Interactions', icon: MessageSquare },
    { id: 'bills', label: 'Bills & Activity', icon: FileText },
    { id: 'notes', label: 'Notes & Files', icon: FolderOpen },
  ];

  const getPartyColor = (party?: string) => {
    if (party === 'Democrat') return 'text-blue-600';
    if (party === 'Republican') return 'text-red-600';
    return 'text-gray-900';
  };

  return (
    <Card className="p-0 overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-red-50 to-blue-50 p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <img
              src={legislator.photo}
              alt={legislator.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div>
              <h3 
                onClick={() => onNavigateToLegislator?.(legislator.id as unknown as string)}
                className={`text-xl font-semibold flex items-center gap-2 ${getPartyColor(legislator.party)} ${
                  onNavigateToLegislator ? 'cursor-pointer hover:underline' : ''
                }`}
              >
                {legislator.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {legislator.title} • {legislator.district}
              </p>
              <div className="flex items-center gap-2">
                <Chip variant="neutral" size="sm">{legislator.chamber}</Chip>
                {legislator.party && <Chip variant="neutral" size="sm">{legislator.party}</Chip>}
                <Chip 
                  variant={legislator.relationship === 'Priority' ? 'support' : legislator.relationship === 'Watch' ? 'monitor' : 'neutral'} 
                  size="sm"
                >
                  {legislator.relationship}
                </Chip>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-red-900 text-white rounded text-sm hover:bg-red-800 transition-colors flex items-center gap-2">
              <Calendar size={14} />
              Log Interaction
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Clock size={14} />
              Set Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200 bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">{legislator.lastInteraction}</div>
          <div className="text-xs text-gray-500 mt-1">Last Interaction</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-red-600">
            {legislator.nextAction ? legislator.nextAction.match(/\d+/)?.[0] || 'N/A' : 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Next Touch (days)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">{legislator.committees.length}</div>
          <div className="text-xs text-gray-500 mt-1">Committees</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">{legislator.billsSponsored}</div>
          <div className="text-xs text-gray-500 mt-1">Bills Sponsored</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex gap-1 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 max-h-[500px] overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Facts */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award size={16} className="text-red-600" />
                Key Facts
              </h4>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                {legislator.birthday && (
                  <div className="flex items-center gap-2">
                    <Cake size={14} className="text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Birthday</div>
                      <div className="text-sm text-gray-900">{legislator.birthday}</div>
                    </div>
                  </div>
                )}
                {legislator.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Office Phone</div>
                      <div className="text-sm text-gray-900">{legislator.phone}</div>
                    </div>
                  </div>
                )}
                {legislator.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm text-gray-900 truncate">{legislator.email}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">District</div>
                    <div className="text-sm text-gray-900">{legislator.district}</div>
                  </div>
                </div>
              </div>
              
              {legislator.issueInterests.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-2">Top Issue Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {legislator.issueInterests.map((interest, i) => (
                      <Chip key={i} variant="neutral" size="sm">{interest}</Chip>
                    ))}
                  </div>
                </div>
              )}
              
              {legislator.caucuses.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-2">Caucus Memberships</div>
                  <div className="flex flex-wrap gap-2">
                    {legislator.caucuses.map((caucus, i) => (
                      <Chip key={i} variant="neutral" size="sm">{caucus}</Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Committee Assignments */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users size={16} className="text-red-600" />
                Committee Assignments
              </h4>
              <div className="space-y-2">
                {legislator.committees.slice(0, 3).map((committee, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">{committee}</div>
                      {i === 0 && <Chip variant="support" size="sm" className="mt-1">Chair</Chip>}
                      {i > 0 && <span className="text-xs text-gray-500">Member</span>}
                    </div>
                  </div>
                ))}
                {legislator.committees.length > 3 && (
                  <button className="text-sm text-red-600 hover:text-red-700">
                    View all {legislator.committees.length} committees →
                  </button>
                )}
              </div>
            </div>

            {/* Relationship Intelligence */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-red-600" />
                Relationship Intelligence
              </h4>
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 p-4 rounded border border-emerald-200">
                <div className="mb-3">
                  <div className="text-xs text-gray-600 mb-1">Relationship Warmth</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">Warm</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-xs text-gray-600 mb-2">Recent Talking Points</div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">1.</span>
                      Net-zero goals, bill 3, Community solar
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">2.</span>
                      Suggested Outreach Window
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">3.</span>
                      5 days before committee vote
                    </li>
                  </ul>
                </div>
                
                <div className="pt-3 border-t border-emerald-200">
                  <div className="text-xs text-gray-600 mb-1">Strategic Outreach Window</div>
                  <div className="text-sm font-medium text-gray-900">2-5 days before committee vote</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {legislator.recentActivity.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity size={16} className="text-red-600" />
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  {legislator.recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <FileText size={14} className="text-gray-500 mt-1" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{activity.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'committees' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">All Committee Assignments</h4>
            </div>
            {legislator.committees.map((committee, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{committee}</div>
                  {i === 0 && <Chip variant="support" size="sm">Chair</Chip>}
                  {i === 1 && <Chip variant="monitor" size="sm">Vice Chair</Chip>}
                  {i > 1 && <Chip variant="neutral" size="sm">Member</Chip>}
                </div>
                <div className="text-xs text-gray-500">Meeting: Tuesdays, 10:00 AM</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Staff Contacts</h4>
              <button className="text-sm text-red-600 hover:text-red-700">+ Add Contact</button>
            </div>
            {legislator.staffContacts.length > 0 ? (
              legislator.staffContacts.map((contact, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="font-medium text-gray-900">{contact.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{contact.title}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={12} className="text-gray-500" />
                      {contact.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={12} className="text-gray-500" />
                      {contact.phone}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No staff contacts recorded yet
              </div>
            )}
          </div>
        )}

        {activeTab === 'interactions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Interaction Timeline</h4>
              <button className="px-3 py-1.5 bg-red-900 text-white rounded text-sm hover:bg-red-800">
                + Log Interaction
              </button>
            </div>
            {legislator.interactions.length > 0 ? (
              legislator.interactions.map((interaction, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    {interaction.type === 'Meeting' && <Users size={14} className="text-red-600" />}
                    {interaction.type === 'Call' && <Phone size={14} className="text-red-600" />}
                    {interaction.type === 'Email' && <Mail size={14} className="text-red-600" />}
                    {interaction.type === 'Event' && <Calendar size={14} className="text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-gray-900">{interaction.type}</div>
                      <div className="text-xs text-gray-500">{interaction.date}</div>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{interaction.summary}</div>
                    <Chip 
                      variant={interaction.outcome === 'Positive' ? 'support' : interaction.outcome === 'Needs follow-up' ? 'monitor' : 'neutral'} 
                      size="sm"
                    >
                      {interaction.outcome}
                    </Chip>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No interactions recorded yet
              </div>
            )}
          </div>
        )}

        {activeTab === 'bills' && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Sponsored & Co-sponsored Bills</h4>
            <div className="space-y-2">
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">HB 77 - Clean Energy Expansion</div>
                  <Chip variant="support" size="sm">Sponsored</Chip>
                </div>
                <div className="text-sm text-gray-600 mb-2">Status: In Committee</div>
                <div className="text-xs text-gray-500">Next: Committee Vote on Nov 15</div>
              </div>
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">SB 234 - Education Funding Reform</div>
                  <Chip variant="neutral" size="sm">Co-sponsored</Chip>
                </div>
                <div className="text-sm text-gray-600 mb-2">Status: Floor Vote Scheduled</div>
                <div className="text-xs text-gray-500">Next: Floor Vote on Nov 20</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Notes & Files</h4>
              <div className="flex gap-2">
                <button className="text-sm text-red-600 hover:text-red-700">+ Add Note</button>
                <button className="text-sm text-red-600 hover:text-red-700">+ Attach File</button>
              </div>
            </div>
            <div className="text-center py-8 text-gray-500">
              No notes or files yet
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}