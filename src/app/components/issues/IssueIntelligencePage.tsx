import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Star,
  FileText,
  Calendar,
  CheckSquare,
  Bell,
  Download,
  Plus,
  StickyNote,
  Filter,
  Search,
  Users,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Save,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { PageLayout } from '../ui/PageLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { getPageTheme } from '../../config/pageThemes';

interface IssueBill {
  id: string;
  billId: string;
  title: string;
  status: string;
  nextActionDate: string;
  relevanceScore: number;
  riskScore: number;
  stance: 'Support' | 'Oppose' | 'Monitor';
  isPinned: boolean;
  chamber: 'House' | 'Senate';
  matchReason?: string;
}

interface Mention {
  id: string;
  sourceType: 'news' | 'social' | 'press';
  title: string;
  snippet: string;
  url: string;
  source: string;
  timestamp: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  relatedBills: string[];
}

interface KeyLegislator {
  id: string;
  name: string;
  chamber: 'House' | 'Senate';
  district: string;
  party?: string;
  photo: string;
  committees: string[];
  involvementSignals: string[];
  lastInteractionDate?: string;
}

interface IssueIntelligencePageProps {
  issueSlug: string;
  onBack: () => void;
}

export function IssueIntelligencePage({ issueSlug, onBack }: IssueIntelligencePageProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = React.useState<'news' | 'press' | 'social'>('news');
  const [pinnedBills, setPinnedBills] = React.useState<Set<string>>(new Set(['HB90']));
  const [billStatusFilter, setBillStatusFilter] = React.useState('All');
  const [billChamberFilter, setBillChamberFilter] = React.useState('All');
  const [billSearchQuery, setBillSearchQuery] = React.useState('');

  const issuesTheme = getPageTheme('Issues');

  // Mock data based on issue
  const issueData = {
    energy: {
      name: 'Energy',
      status: 'hot' as const,
      activeBills: 8,
      newThisWeek: 3,
      nextHearing: 'Nov 22',
      sentimentTrend: 'up' as const,
    },
    education: {
      name: 'Education',
      status: 'good' as const,
      activeBills: 6,
      newThisWeek: 1,
      nextHearing: 'Nov 28',
      sentimentTrend: 'up' as const,
    },
    healthcare: {
      name: 'Healthcare',
      status: 'watch' as const,
      activeBills: 4,
      newThisWeek: 2,
      nextHearing: 'Nov 20',
      sentimentTrend: 'down' as const,
    },
  };

  const currentIssue = issueData[issueSlug as keyof typeof issueData] || issueData.energy;

  const bills: IssueBill[] = [
    {
      id: '1',
      billId: 'HB90',
      title: 'Solar Modernization Act',
      status: 'Committee',
      nextActionDate: 'Nov 22, 2024',
      relevanceScore: 95,
      riskScore: 7,
      stance: 'Support',
      isPinned: true,
      chamber: 'House',
      matchReason: 'net metering, interconnection, solar consumer disclosure',
    },
    {
      id: '2',
      billId: 'SB211',
      title: 'Clean Energy Grid Reliability',
      status: 'Floor Vote',
      nextActionDate: 'Nov 25, 2024',
      relevanceScore: 88,
      riskScore: 6,
      stance: 'Support',
      isPinned: false,
      chamber: 'Senate',
      matchReason: 'grid reliability, renewable integration',
    },
    {
      id: '3',
      billId: 'HB1234',
      title: 'Clean Air Modernization',
      status: 'Introduced',
      nextActionDate: 'Dec 5, 2024',
      relevanceScore: 72,
      riskScore: 4,
      stance: 'Monitor',
      isPinned: false,
      chamber: 'House',
      matchReason: 'emissions standards, clean energy',
    },
    {
      id: '4',
      billId: 'SB456',
      title: 'Utility Rate Reform',
      status: 'Committee',
      nextActionDate: 'Nov 30, 2024',
      relevanceScore: 81,
      riskScore: 8,
      stance: 'Oppose',
      isPinned: false,
      chamber: 'Senate',
      matchReason: 'rate structures, utility regulation',
    },
  ];

  const mentions: Mention[] = [
    {
      id: '1',
      sourceType: 'news',
      title: 'Solar Industry Pushes for Modernization Bill Ahead of Committee Vote',
      snippet:
        'Industry advocates are rallying support for HB90, emphasizing consumer protection and grid reliability...',
      url: '#',
      source: 'Arizona Capitol Times',
      timestamp: '2 hours ago',
      sentiment: 'Positive',
      relatedBills: ['HB90'],
    },
    {
      id: '2',
      sourceType: 'news',
      title: 'Utilities Warn of Rate Impact from Solar Expansion',
      snippet:
        'Utility representatives testified that rapid solar growth could shift costs to non-solar customers...',
      url: '#',
      source: 'Phoenix Business Journal',
      timestamp: '5 hours ago',
      sentiment: 'Negative',
      relatedBills: ['HB90', 'SB211'],
    },
    {
      id: '3',
      sourceType: 'press',
      title: 'Sen. Shah Announces Support for Clean Energy Package',
      snippet:
        'Senator Priya Shah released a statement backing both HB90 and SB211, citing job growth and reliability...',
      url: '#',
      source: 'Sen. Shah Office',
      timestamp: '1 day ago',
      sentiment: 'Positive',
      relatedBills: ['HB90', 'SB211'],
    },
  ];

  const keyLegislators: KeyLegislator[] = [
    {
      id: '1',
      name: 'Rep. Jordan Ramirez',
      chamber: 'House',
      district: 'LD-12',
      party: 'Democrat',
      photo: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=400',
      committees: ['Energy & Resources (Chair)', 'Commerce'],
      involvementSignals: ['Sponsored HB90', 'Frequent energy votes', 'Recent town hall on solar'],
      lastInteractionDate: '3d ago',
    },
    {
      id: '2',
      name: 'Sen. Priya Shah',
      chamber: 'Senate',
      district: 'LD-10',
      party: 'Democrat',
      photo: 'https://images.unsplash.com/photo-1580643735948-c52d25d9c07d?w=400',
      committees: ['Environment (Vice Chair)', 'Energy'],
      involvementSignals: ['Co-sponsored SB211', 'Press statement on clean energy'],
      lastInteractionDate: '1w ago',
    },
    {
      id: '3',
      name: 'Rep. Sarah Martinez',
      chamber: 'House',
      district: 'LD-18',
      party: 'Republican',
      photo: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=400',
      committees: ['Energy & Resources', 'Utilities'],
      involvementSignals: ['Filed amendment to HB90', 'Vocal on utility rates'],
      lastInteractionDate: '1w ago',
    },
  ];

  const handleTogglePinBill = (billId: string) => {
    setPinnedBills((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(billId)) {
        newSet.delete(billId);
      } else {
        newSet.add(billId);
      }
      return newSet;
    });
  };

  const handleGenerateIssueBrief = () => {
    alert('Generating brief...');
  };

  const filteredBills = bills
    .map((bill) => ({ ...bill, isPinned: pinnedBills.has(bill.billId) }))
    .filter((bill) => {
      const matchesStatus = billStatusFilter === 'All' || bill.status === billStatusFilter;
      const matchesChamber = billChamberFilter === 'All' || bill.chamber === billChamberFilter;
      const matchesSearch =
        bill.billId.toLowerCase().includes(billSearchQuery.toLowerCase()) ||
        bill.title.toLowerCase().includes(billSearchQuery.toLowerCase());
      return matchesStatus && matchesChamber && matchesSearch;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const pinnedBillsList = filteredBills.filter((b) => b.isPinned);
  const unpinnedBillsList = filteredBills.filter((b) => !b.isPinned);

  const getPartyColor = (party?: string) => {
    if (party === 'Democrat') return 'text-blue-600';
    if (party === 'Republican') return 'text-red-600';
    return 'text-gray-900';
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'Positive') return 'success';
    if (sentiment === 'Negative') return 'alert';
    return 'neutral';
  };

  // Header content
  const headerContent = (
    <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
        <FileText size={16} className="text-gray-500" />
        <span className="text-gray-900 dark:text-white font-medium">{currentIssue.activeBills}</span>
        <span className="text-gray-500">Active Bills</span>
        </div>
        <div className="flex items-center gap-2">
        <Plus size={16} className="text-green-600" />
        <span className="text-gray-900 dark:text-white font-medium">{currentIssue.newThisWeek}</span>
        <span className="text-gray-500">New This Week</span>
        </div>
        <div className="flex items-center gap-2">
        <Calendar size={16} className="text-gray-500" />
        <span className="text-gray-900 dark:text-white font-medium">{currentIssue.nextHearing}</span>
        <span className="text-gray-500">Next Hearing</span>
        </div>
        <div className="flex items-center gap-2">
        {currentIssue.sentimentTrend === 'up' ? (
            <TrendingUp size={16} className="text-green-600" />
        ) : (
            <TrendingDown size={16} className="text-red-600" />
        )}
        <span className="text-gray-500">Sentiment Trend</span>
        </div>
    </div>
  );

  const pageActions = (
    <Button variant="primary" onClick={handleGenerateIssueBrief}>
        <Download size={16} className="mr-2" />
        Generate Brief
    </Button>
  );

  const headerIcon = (
    <div className="flex items-center gap-3">
        {onBack && (
            <button
                onClick={onBack}
                className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors`}
            >
                <ChevronLeft size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
        )}
        <Sparkles 
            size={28} 
            color={isDarkMode ? issuesTheme.glow : issuesTheme.accent} 
        />
    </div>
  );

  return (
    <PageLayout
      title={currentIssue.name}
      subtitle={`Issue Intelligence`}
      accentColor={issuesTheme.accent}
      headerIcon={headerIcon}
      backgroundImage={
        <Sparkles 
            size={450} 
            color={isDarkMode ? "white" : issuesTheme.accent} 
            strokeWidth={0.5}
        />
      }
      headerContent={headerContent}
      pageActions={pageActions}
    >
      <div className="bg-gray-50 dark:bg-slate-900 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Column: Bills (8 cols) */}
            <div className="col-span-8 space-y-6">
              
              {/* Bills Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Legislative Activity
                  </h2>
                  
                  {/* Filters */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="Search bills..." 
                        value={billSearchQuery}
                        onChange={(e) => setBillSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-white/10 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-48"
                      />
                    </div>
                    
                    <select 
                      value={billStatusFilter}
                      onChange={(e) => setBillStatusFilter(e.target.value)}
                      className="text-sm border border-gray-300 dark:border-white/10 rounded-md px-2 py-1.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value="All">All Status</option>
                      <option value="Introduced">Introduced</option>
                      <option value="Committee">Committee</option>
                      <option value="Floor Vote">Floor Vote</option>
                    </select>
                  </div>
                </div>

                {/* Pinned Bills */}
                {pinnedBillsList.length > 0 && (
                  <div className="mb-4 space-y-3">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority Watchlist</div>
                    {pinnedBillsList.map(bill => (
                      <Card key={bill.id} className="border-l-4 border-l-yellow-500">
                        <div className="p-4 flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-gray-900 dark:text-white">{bill.billId}</span>
                                <Chip variant="warning" size="sm">Priority</Chip>
                                <Chip 
                                  variant={bill.stance === 'Support' ? 'success' : bill.stance === 'Oppose' ? 'alert' : 'neutral'} 
                                  size="sm"
                                >
                                  {bill.stance}
                                </Chip>
                              </div>
                              <button onClick={() => handleTogglePinBill(bill.billId)} className="text-yellow-500">
                                <Star size={18} fill="currentColor" />
                              </button>
                            </div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{bill.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span><strong>Status:</strong> {bill.status}</span>
                              <span><strong>Next:</strong> {bill.nextActionDate}</span>
                              <span><strong>Chamber:</strong> {bill.chamber}</span>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded w-fit">
                              <Sparkles size={12} />
                              <strong>Match:</strong> {bill.matchReason}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Relevance</div>
                              <div className="text-lg font-bold text-blue-600">{bill.relevanceScore}%</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Risk</div>
                              <div className={`text-lg font-bold ${bill.riskScore >= 7 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                {bill.riskScore}/10
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Other Bills */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Other Bills</div>
                  {unpinnedBillsList.map(bill => (
                    <Card key={bill.id} hoverEffect>
                      <div className="p-4 flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 dark:text-white">{bill.billId}</span>
                              <Chip 
                                variant={bill.stance === 'Support' ? 'success' : bill.stance === 'Oppose' ? 'alert' : 'neutral'} 
                                size="sm"
                              >
                                {bill.stance}
                              </Chip>
                            </div>
                            <button onClick={() => handleTogglePinBill(bill.billId)} className="text-gray-400 hover:text-yellow-500 transition-colors">
                              <Star size={18} />
                            </button>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{bill.title}</h3>
                          <div className="text-xs text-gray-500">
                            {bill.status} • {bill.nextActionDate}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Intel & Players (4 cols) */}
            <div className="col-span-4 space-y-6">
              
              {/* Media & Chatter */}
              <Card>
                <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare size={18} className="text-purple-600" />
                    Media & Chatter
                  </h3>
                  <div className="flex bg-gray-100 dark:bg-slate-800 rounded p-0.5">
                    {(['news', 'social'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2 py-0.5 text-xs font-medium rounded ${
                          activeTab === tab 
                            ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-white/10">
                  {mentions.filter(m => m.sourceType === (activeTab === 'news' ? 'news' : 'social')).map(mention => (
                    <div key={mention.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase">{mention.source}</span>
                        <span className="text-xs text-gray-400">{mention.timestamp}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 leading-snug">
                        <a href={mention.url} className="hover:text-blue-600 hover:underline">{mention.title}</a>
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        "{mention.snippet}"
                      </p>
                      <div className="flex items-center gap-2">
                        <Chip variant={getSentimentColor(mention.sentiment)} size="sm">{mention.sentiment}</Chip>
                        {mention.relatedBills.map(b => (
                          <span key={b} className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {mentions.filter(m => m.sourceType === (activeTab === 'news' ? 'news' : 'social')).length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No recent {activeTab} mentions found.
                    </div>
                  )}
                </div>
              </Card>

              {/* Key Legislators */}
              <Card>
                <div className="p-4 border-b border-gray-100 dark:border-white/10">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users size={18} className="text-indigo-600" />
                    Key Legislators
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-white/10">
                  {keyLegislators.map(leg => (
                    <div key={leg.id} className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={leg.photo} alt={leg.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                        <div>
                          <div className={`font-bold text-sm ${getPartyColor(leg.party)}`}>
                            {leg.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {leg.chamber} • {leg.district}
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800 rounded p-2 text-xs mb-2">
                        <strong>Role:</strong> {leg.committees[0]}
                      </div>
                      <div className="space-y-1">
                        {leg.involvementSignals.map((sig, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                            <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-blue-500" />
                            {sig}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                          <Phone size={12} className="mr-1" /> Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                          <Mail size={12} className="mr-1" /> Email
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
