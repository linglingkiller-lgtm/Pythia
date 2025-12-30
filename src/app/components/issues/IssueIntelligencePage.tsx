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
  const [activeTab, setActiveTab] = React.useState<'news' | 'press' | 'social'>('news');
  const [pinnedBills, setPinnedBills] = React.useState<Set<string>>(new Set(['HB90']));
  const [billStatusFilter, setBillStatusFilter] = React.useState('All');
  const [billChamberFilter, setBillChamberFilter] = React.useState('All');
  const [billSearchQuery, setBillSearchQuery] = React.useState('');

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
    // Map bills with pinned status for the brief
    const billsForBrief = bills.map((bill) => ({ ...bill, isPinned: pinnedBills.has(bill.billId) }));
    
    // Calculate sentiment stats
    const positiveMentions = mentions.filter(m => m.sentiment === 'Positive').length;
    const negativeMentions = mentions.filter(m => m.sentiment === 'Negative').length;
    const neutralMentions = mentions.filter(m => m.sentiment === 'Neutral').length;
    
    // Generate Pythia insights based on data
    const pythiaInsights = [];
    
    // Critical timing insight
    const upcomingBills = billsForBrief.filter(b => {
      const actionDate = new Date(b.nextActionDate);
      const today = new Date();
      const daysUntil = Math.floor((actionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 7 && daysUntil >= 0;
    });
    if (upcomingBills.length > 0) {
      pythiaInsights.push(`<strong>Critical Timing:</strong> ${upcomingBills.length} bill${upcomingBills.length > 1 ? 's' : ''} require${upcomingBills.length === 1 ? 's' : ''} action within 7 days (${upcomingBills.map(b => b.billId).join(', ')})`);
    }
    
    // High-risk bills
    const highRiskBills = billsForBrief.filter(b => b.riskScore >= 7);
    if (highRiskBills.length > 0) {
      pythiaInsights.push(`<strong>High-Risk Alert:</strong> ${highRiskBills.length} bill${highRiskBills.length > 1 ? 's' : ''} with risk score ≥7 (${highRiskBills.map(b => b.billId).join(', ')})`);
    }
    
    // Engagement opportunities
    const unopposedBills = billsForBrief.filter(b => b.stance === 'Support' && b.relevanceScore >= 80);
    if (unopposedBills.length > 0) {
      pythiaInsights.push(`<strong>Advocacy Opportunity:</strong> ${unopposedBills.length} high-relevance support bill${unopposedBills.length > 1 ? 's' : ''} with no identified opposition`);
    }
    
    // Key legislator engagement
    const recentlyInteracted = keyLegislators.filter(l => l.lastInteractionDate).length;
    const totalKeyPlayers = keyLegislators.length;
    if (recentlyInteracted < totalKeyPlayers) {
      pythiaInsights.push(`<strong>Outreach Gap:</strong> ${totalKeyPlayers - recentlyInteracted} of ${totalKeyPlayers} key legislators have no recent interaction logged`);
    }
    
    // Media momentum
    if (positiveMentions > negativeMentions * 2) {
      pythiaInsights.push(`<strong>Media Momentum:</strong> Positive media sentiment is ${Math.round((positiveMentions / mentions.length) * 100)}% of coverage - opportunity for amplification`);
    }
    
    const briefContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${currentIssue.name} Issue Brief - ${new Date().toLocaleDateString()}</title>
  <style>
    @media print {
      @page { margin: 0.5in; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1f2937;
      background: white;
      padding: 40px;
      max-width: 8.5in;
      margin: 0 auto;
    }
    .header {
      border-bottom: 4px solid #f59e0b;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .issue-name {
      font-size: 28pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 8px;
    }
    .date-line {
      font-size: 10pt;
      color: #6b7280;
      font-weight: 600;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 10pt;
      color: white;
      margin-top: 12px;
      background: ${currentIssue.status === 'hot' ? '#dc2626' : currentIssue.status === 'watch' ? '#f59e0b' : '#059669'};
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin: 24px 0;
      page-break-inside: avoid;
    }
    .stat-box {
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .stat-value {
      font-size: 28pt;
      font-weight: 900;
      color: #111827;
      display: block;
      margin-bottom: 4px;
    }
    .stat-label {
      font-size: 9pt;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section {
      margin-bottom: 28px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 14pt;
      font-weight: 800;
      color: #f59e0b;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #fbbf24;
      padding-bottom: 6px;
    }
    .bill-row {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-left: 4px solid #6b7280;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .bill-row.pinned {
      border-left-color: #f59e0b;
      background: #fffbeb;
    }
    .bill-row.support {
      border-left-color: #059669;
    }
    .bill-row.oppose {
      border-left-color: #dc2626;
    }
    .bill-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 6px;
    }
    .bill-id {
      font-size: 13pt;
      font-weight: 800;
      color: #111827;
    }
    .bill-title {
      font-size: 11pt;
      font-weight: 700;
      color: #374151;
      margin-bottom: 6px;
    }
    .bill-meta {
      font-size: 9pt;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 700;
      margin-right: 6px;
    }
    .badge.support { background: #d1fae5; color: #065f46; }
    .badge.oppose { background: #fee2e2; color: #991b1b; }
    .badge.monitor { background: #e0e7ff; color: #3730a3; }
    .badge.pinned { background: #fef3c7; color: #92400e; }
    .score-row {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }
    .score-item {
      font-size: 9pt;
      font-weight: 600;
      color: #374151;
    }
    .score-value {
      font-weight: 800;
      color: #111827;
    }
    .mention-row {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .mention-title {
      font-size: 10pt;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }
    .mention-snippet {
      font-size: 9pt;
      color: #4b5563;
      margin-bottom: 6px;
      line-height: 1.4;
    }
    .mention-meta {
      font-size: 8pt;
      color: #6b7280;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sentiment-positive { color: #059669; font-weight: 700; }
    .sentiment-negative { color: #dc2626; font-weight: 700; }
    .sentiment-neutral { color: #6b7280; font-weight: 700; }
    .legislator-row {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .legislator-name {
      font-size: 11pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 4px;
    }
    .legislator-party-R { color: #dc2626; }
    .legislator-party-D { color: #2563eb; }
    .legislator-info {
      font-size: 9pt;
      color: #6b7280;
      margin-bottom: 6px;
    }
    .signal-list {
      list-style: none;
      margin-top: 6px;
    }
    .signal-list li {
      font-size: 9pt;
      color: #374151;
      padding-left: 12px;
      position: relative;
      margin-bottom: 2px;
    }
    .signal-list li:before {
      content: "→";
      position: absolute;
      left: 0;
      color: #f59e0b;
      font-weight: 800;
    }
    .insight-box {
      background: #eff6ff;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .insight-title {
      font-size: 11pt;
      font-weight: 800;
      color: #1e40af;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .insight-list {
      list-style: none;
      margin: 0;
    }
    .insight-list li {
      font-size: 10pt;
      color: #1e3a8a;
      padding: 6px 0;
      border-bottom: 1px solid #bfdbfe;
    }
    .insight-list li:last-child {
      border-bottom: none;
    }
    .opportunity-box {
      background: #f0fdf4;
      border: 2px solid #059669;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
      page-break-inside: avoid;
    }
    .opportunity-title {
      font-size: 11pt;
      font-weight: 800;
      color: #065f46;
      margin-bottom: 10px;
    }
    .opportunity-list {
      list-style: none;
      margin: 0;
    }
    .opportunity-list li {
      font-size: 10pt;
      color: #064e3b;
      padding: 6px 12px;
      background: white;
      border-radius: 4px;
      margin-bottom: 6px;
      border-left: 3px solid #10b981;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 2px solid #e5e7eb;
      font-size: 8pt;
      color: #9ca3af;
      text-align: center;
    }
    .sentiment-stats {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    .sentiment-stat {
      flex: 1;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 10px;
      text-align: center;
    }
    .sentiment-stat-value {
      font-size: 20pt;
      font-weight: 900;
      display: block;
      margin-bottom: 2px;
    }
    .sentiment-stat-label {
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="issue-name">${currentIssue.name} Issue Brief</div>
    <div class="date-line">Generated ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
    <span class="status-badge">${currentIssue.status.toUpperCase()} ISSUE</span>
  </div>

  <div class="stats-grid">
    <div class="stat-box">
      <span class="stat-value">${currentIssue.activeBills}</span>
      <span class="stat-label">Active Bills</span>
    </div>
    <div class="stat-box">
      <span class="stat-value">${currentIssue.newThisWeek}</span>
      <span class="stat-label">New This Week</span>
    </div>
    <div class="stat-box">
      <span class="stat-value">${mentions.length}</span>
      <span class="stat-label">Media Mentions</span>
    </div>
    <div class="stat-box">
      <span class="stat-value">${keyLegislators.length}</span>
      <span class="stat-label">Key Players</span>
    </div>
  </div>

  <div class="insight-box">
    <div class="insight-title">
      ⚡ Pythia Intelligence Insights
    </div>
    <ul class="insight-list">
      ${pythiaInsights.map(insight => `<li>${insight}</li>`).join('')}
      ${pythiaInsights.length === 0 ? '<li>No critical alerts at this time. Continue monitoring key bills and legislator activity.</li>' : ''}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Legislative Activity</div>
    ${billsForBrief.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.relevanceScore - a.relevanceScore;
    }).map(bill => `
      <div class="bill-row ${bill.isPinned ? 'pinned' : ''} ${bill.stance.toLowerCase()}">
        <div class="bill-header">
          <div>
            <div class="bill-id">${bill.billId}${bill.isPinned ? ' ⭐' : ''}</div>
          </div>
          <div>
            <span class="badge ${bill.stance.toLowerCase()}">${bill.stance.toUpperCase()}</span>
            ${bill.isPinned ? '<span class="badge pinned">PRIORITY</span>' : ''}
          </div>
        </div>
        <div class="bill-title">${bill.title}</div>
        <div class="bill-meta"><strong>${bill.chamber}</strong> • <strong>Status:</strong> ${bill.status} • <strong>Next Action:</strong> ${bill.nextActionDate}</div>
        <div class="bill-meta"><strong>Match Keywords:</strong> ${bill.matchReason}</div>
        <div class="score-row">
          <div class="score-item">Relevance: <span class="score-value">${bill.relevanceScore}%</span></div>
          <div class="score-item">Risk Score: <span class="score-value">${bill.riskScore}/10</span></div>
        </div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">Media & Public Coverage</div>
    <div class="sentiment-stats">
      <div class="sentiment-stat">
        <span class="stat-value sentiment-positive">${positiveMentions}</span>
        <span class="sentiment-stat-label">Positive</span>
      </div>
      <div class="sentiment-stat">
        <span class="stat-value sentiment-neutral">${neutralMentions}</span>
        <span class="sentiment-stat-label">Neutral</span>
      </div>
      <div class="sentiment-stat">
        <span class="stat-value sentiment-negative">${negativeMentions}</span>
        <span class="sentiment-stat-label">Negative</span>
      </div>
    </div>
    ${mentions.map(mention => `
      <div class="mention-row">
        <div class="mention-title">${mention.title}</div>
        <div class="mention-snippet">${mention.snippet}</div>
        <div class="mention-meta">
          <span><strong>${mention.source}</strong> • ${mention.timestamp}</span>
          <span class="sentiment-${mention.sentiment.toLowerCase()}">${mention.sentiment}</span>
        </div>
        ${mention.relatedBills.length > 0 ? `<div class="bill-meta" style="margin-top: 4px;"><strong>Related Bills:</strong> ${mention.relatedBills.join(', ')}</div>` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">Key Legislators</div>
    ${keyLegislators.map(leg => `
      <div class="legislator-row">
        <div class="legislator-name legislator-party-${leg.party?.charAt(0) || 'I'}">${leg.name} (${leg.party?.charAt(0) || 'I'}-${leg.district})</div>
        <div class="legislator-info"><strong>${leg.chamber}</strong> • ${leg.committees.join(', ')}</div>
        ${leg.lastInteractionDate ? `<div class="legislator-info"><strong>Last Contact:</strong> ${leg.lastInteractionDate}</div>` : '<div class="legislator-info" style="color: #dc2626;"><strong>⚠ No recent interaction logged</strong></div>'}
        <ul class="signal-list">
          ${leg.involvementSignals.map(signal => `<li>${signal}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>

  <div class="opportunity-box">
    <div class="opportunity-title">📋 Identified Opportunities & Recommendations</div>
    <ul class="opportunity-list">
      ${upcomingBills.length > 0 ? `<li><strong>Immediate Action Required:</strong> Schedule meetings/testimony for ${upcomingBills.map(b => b.billId).join(', ')} before ${upcomingBills[0].nextActionDate}</li>` : ''}
      ${unopposedBills.length > 0 ? `<li><strong>Advocacy Push:</strong> Amplify support for ${unopposedBills.map(b => b.billId).join(', ')} - high relevance with favorable positioning</li>` : ''}
      ${highRiskBills.length > 0 ? `<li><strong>Risk Mitigation:</strong> Develop counter-strategy for ${highRiskBills.map(b => b.billId).join(', ')} (high risk scores)</li>` : ''}
      ${recentlyInteracted < totalKeyPlayers ? `<li><strong>Outreach Priority:</strong> Schedule meetings with ${totalKeyPlayers - recentlyInteracted} key legislators with no recent contact</li>` : ''}
      ${positiveMentions > negativeMentions ? `<li><strong>Media Strategy:</strong> Leverage positive media momentum (${Math.round((positiveMentions / mentions.length) * 100)}% positive) for coalition building</li>` : ''}
      <li><strong>Monitoring:</strong> Continue daily tracking of ${currentIssue.name.toLowerCase()} bills and set alerts for committee assignments and hearing schedules</li>
    </ul>
  </div>

  <div class="footer">
    Generated by Pythia Intelligence Platform • Confidential & Proprietary • ${new Date().toLocaleDateString()}
  </div>
</body>
</html>`;

    // Create a blob and download
    const blob = new Blob([briefContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentIssue.name.replace(/\s+/g, '_')}_Issue_Brief_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3 transition-colors"
        >
          <ChevronLeft size={18} />
          Back to Issues
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-gray-900">{currentIssue.name}</h1>
              <Chip
                variant={
                  currentIssue.status === 'hot'
                    ? 'alert'
                    : currentIssue.status === 'watch'
                    ? 'warning'
                    : 'success'
                }
                size="md"
              >
                {currentIssue.status === 'hot'
                  ? 'Hot'
                  : currentIssue.status === 'watch'
                  ? 'Watch'
                  : 'Good'}
              </Chip>
            </div>
            {/* Metrics Row */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <span className="text-gray-900 font-medium">{currentIssue.activeBills}</span>
                <span className="text-gray-500">Active Bills</span>
              </div>
              <div className="flex items-center gap-2">
                <Plus size={16} className="text-green-600" />
                <span className="text-gray-900 font-medium">{currentIssue.newThisWeek}</span>
                <span className="text-gray-500">New This Week</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-gray-900 font-medium">{currentIssue.nextHearing}</span>
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
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Bell size={14} />
              Create Alert
            </Button>
            <Button variant="secondary" size="sm">
              <Download size={14} />
              Export Report
            </Button>
            <Button variant="accent" size="sm">
              <StickyNote size={14} />
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Pinned Bills Section */}
            {pinnedBillsList.length > 0 && (
              <Card className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star size={18} className="text-amber-500 fill-amber-500" />
                  Pinned Bills
                </h3>
                <div className="space-y-3">
                  {pinnedBillsList.map((bill) => (
                    <BillRow key={bill.id} bill={bill} onTogglePin={handleTogglePinBill} />
                  ))}
                </div>
              </Card>
            )}

            {/* Recent & Trending Bills */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent & Trending Bills</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search bills..."
                      value={billSearchQuery}
                      onChange={(e) => setBillSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <select
                    value={billChamberFilter}
                    onChange={(e) => setBillChamberFilter(e.target.value)}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="All">All Chambers</option>
                    <option value="House">House</option>
                    <option value="Senate">Senate</option>
                  </select>
                  <select
                    value={billStatusFilter}
                    onChange={(e) => setBillStatusFilter(e.target.value)}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Introduced">Introduced</option>
                    <option value="Committee">Committee</option>
                    <option value="Floor Vote">Floor Vote</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {unpinnedBillsList.map((bill) => (
                  <BillRow key={bill.id} bill={bill} onTogglePin={handleTogglePinBill} />
                ))}
              </div>
            </Card>

            {/* Media & Social Mentions */}
            <Card className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media & Social Mentions</h3>

              {/* Narrative Tracker */}
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-purple-900 mb-2">
                      Top Phrases Rising
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['cost-shift', 'reliability', 'consumer protection'].map((phrase) => (
                        <span
                          key={phrase}
                          className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded"
                        >
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-purple-900 mb-2">Sentiment Trend</div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-600" />
                      <span className="text-sm text-gray-900">Positive momentum</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 border-b border-gray-200 mb-4">
                {(['news', 'press', 'social'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-red-600 text-red-900'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Mentions Feed */}
              <div className="space-y-3">
                {mentions
                  .filter((m) => m.sourceType === activeTab)
                  .map((mention) => (
                    <MentionCard key={mention.id} mention={mention} />
                  ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar: Sticky */}
          <div className="col-span-4">
            <div className="sticky top-6 space-y-4">
              {/* Pythia Overview */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-600" />
                  Pythia Overview
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Issue Pulse</div>
                    <p className="text-gray-700 leading-relaxed">
                      HB90 gaining momentum ahead of committee vote. Utility opposition intensifying
                      around cost-shift narrative. Sen. Shah's endorsement shifted Senate dynamics.
                      Window for stakeholder alignment closing.
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      Key Legislation to Watch
                    </div>
                    <div className="space-y-2">
                      {[
                        { bill: 'HB90', reason: 'Committee vote imminent' },
                        { bill: 'SB211', reason: 'Floor vote scheduled' },
                        { bill: 'SB456', reason: 'Opposition leverage point' },
                      ].map((item) => (
                        <div key={item.bill} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5"></div>
                          <div>
                            <span className="font-medium text-gray-900">{item.bill}:</span>
                            <span className="text-gray-600"> {item.reason}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">Suggested Next Steps</div>
                    <div className="space-y-1.5">
                      {[
                        "Brief Chair's LA before Nov 22 hearing",
                        'Prepare 2-min testimony on reliability',
                        'Coordinate coalition letter by Nov 20',
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckSquare size={12} className="text-green-600 mt-0.5 flex-shrink-0" />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <Chip variant="success" size="sm">
                      High Confidence
                    </Chip>
                    <button className="text-xs text-blue-600 hover:underline">Show sources</button>
                  </div>
                </div>
              </Card>

              {/* Key Legislators */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users size={16} className="text-red-600" />
                  Key Legislators
                </h3>
                <div className="space-y-3">
                  {keyLegislators.map((legislator) => (
                    <LegislatorCard key={legislator.id} legislator={legislator} />
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="accent" size="sm" className="w-full" onClick={handleGenerateIssueBrief}>
                    <FileText size={14} />
                    Generate Issue Brief
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    <CheckSquare size={14} />
                    Create Task Template
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    <MessageSquare size={14} />
                    Log Interaction
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    <Calendar size={14} />
                    Add Event to Calendar
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Bill Row Component
function BillRow({
  bill,
  onTogglePin,
}: {
  bill: IssueBill;
  onTogglePin: (billId: string) => void;
}) {
  const getStanceColor = (stance: string) => {
    if (stance === 'Support') return 'support';
    if (stance === 'Oppose') return 'oppose';
    return 'monitor';
  };

  return (
    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded hover:border-red-500 hover:bg-gray-50 transition-all group">
      <button
        onClick={() => onTogglePin(bill.billId)}
        className="mt-1 flex-shrink-0"
        title={bill.isPinned ? 'Unpin' : 'Pin'}
      >
        <Star
          size={18}
          className={bill.isPinned ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}
        />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{bill.billId}</span>
              <Chip variant="neutral" size="sm">
                {bill.chamber}
              </Chip>
              <Chip variant="info" size="sm">
                {bill.status}
              </Chip>
              <Chip variant={getStanceColor(bill.stance)} size="sm">
                {bill.stance}
              </Chip>
            </div>
            <h4 className="text-sm text-gray-900 mb-1">{bill.title}</h4>
            {bill.matchReason && (
              <div className="text-xs text-gray-500 mb-2">
                Matched on: {bill.matchReason}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
          <div>
            Next: <span className="font-medium text-gray-900">{bill.nextActionDate}</span>
          </div>
          <div>
            Relevance: <span className="font-medium text-gray-900">{bill.relevanceScore}%</span>
          </div>
          <div className="flex items-center gap-1">
            Risk:
            <span
              className={`font-medium ${
                bill.riskScore >= 7
                  ? 'text-red-600'
                  : bill.riskScore >= 4
                  ? 'text-amber-600'
                  : 'text-green-600'
              }`}
            >
              {bill.riskScore}/10
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="sm">
            <FileText size={12} />
            Generate Brief
          </Button>
          <Button variant="secondary" size="sm">
            <Calendar size={12} />
            Add to Calendar
          </Button>
          <Button variant="secondary" size="sm">
            <CheckSquare size={12} />
            Create Task
          </Button>
          <Button variant="secondary" size="sm">
            <Bell size={12} />
            Set Alert
          </Button>
        </div>
      </div>
    </div>
  );
}

// Mention Card Component
function MentionCard({ mention }: { mention: Mention }) {
  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'Positive') return 'success';
    if (sentiment === 'Negative') return 'alert';
    return 'neutral';
  };

  return (
    <div className="p-4 border border-gray-200 rounded hover:border-red-500 hover:bg-gray-50 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 flex-1">{mention.title}</h4>
        <Chip variant={getSentimentColor(mention.sentiment)} size="sm">
          {mention.sentiment}
        </Chip>
      </div>
      <p className="text-sm text-gray-600 mb-3">{mention.snippet}</p>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{mention.source}</span>
          <span>•</span>
          <span>{mention.timestamp}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {mention.relatedBills.map((bill) => (
            <span key={bill} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
              {bill}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="sm">
            <ExternalLink size={12} />
            Open
          </Button>
          <Button variant="secondary" size="sm">
            <FileText size={12} />
            Add to Brief
          </Button>
          <Button variant="secondary" size="sm">
            <Save size={12} />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

// Legislator Card Component
function LegislatorCard({ legislator }: { legislator: KeyLegislator }) {
  const getPartyColor = (party?: string) => {
    if (party === 'Democrat') return 'text-blue-600';
    if (party === 'Republican') return 'text-red-600';
    return 'text-gray-900';
  };

  return (
    <div className="p-3 border border-gray-200 rounded hover:border-red-500 transition-all group">
      <div className="flex items-start gap-3 mb-2">
        <img
          src={legislator.photo}
          alt={legislator.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${getPartyColor(legislator.party)}`}>
            {legislator.name}
          </div>
          <div className="text-xs text-gray-600">
            {legislator.chamber} • {legislator.district}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-700 mb-2">
        {legislator.committees.map((committee, i) => (
          <div key={i} className="mb-1">
            • {committee}
          </div>
        ))}
      </div>
      <div className="mb-3">
        {legislator.involvementSignals.map((signal, i) => (
          <div key={i} className="text-xs text-gray-600 flex items-start gap-1 mb-1">
            <div className="w-1 h-1 rounded-full bg-green-600 mt-1.5"></div>
            {signal}
          </div>
        ))}
      </div>
      {legislator.lastInteractionDate && (
        <div className="text-xs text-gray-500 mb-2">Last contact: {legislator.lastInteractionDate}</div>
      )}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="secondary" size="sm">
          <Eye size={10} />
          Profile
        </Button>
        <Button variant="secondary" size="sm">
          <FileText size={10} />
          Brief
        </Button>
        <Button variant="secondary" size="sm">
          <CheckSquare size={10} />
          Task
        </Button>
      </div>
    </div>
  );
}