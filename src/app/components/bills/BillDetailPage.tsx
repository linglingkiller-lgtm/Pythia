import React from 'react';
import { ArrowLeft, FileText, Plus, Eye, Download, Pin, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { mockBills, mockBillAIReviews, mockMemberInsights, mockBillMomentum, mockMentions } from '../../data/billsData';
import { BillTimeline } from './BillTimeline';
import { AIBillReview } from './AIBillReview';
import { VersionTracking } from './VersionTracking';
import { KeyActors } from './KeyActors';
import { VotingPatterns } from './VotingPatterns';
import { BillMomentumCard } from './BillMomentumCard';
import { MediaNarrative } from './MediaNarrative';
import { ActionPlan } from './ActionPlan';
import { WhipCountBoard } from '../legislators/WhipCountBoard';
import { useTheme } from '../../contexts/ThemeContext';
import { PageLayout } from '../ui/PageLayout';
import { getPageTheme } from '../../config/pageThemes';

import { useAskPythia } from '../../contexts/AskPythiaContext';

interface BillDetailPageProps {
  billId: string;
  onBack: () => void;
  onNavigateToLegislator?: (legislatorId: string) => void;
}

export function BillDetailPage({ billId, onBack, onNavigateToLegislator }: BillDetailPageProps) {
  const { isDarkMode } = useTheme();
  const { openPythia } = useAskPythia();
  const bill = mockBills.find(b => b.id === billId);
  const aiReview = mockBillAIReviews[billId];
  const memberInsights = mockMemberInsights[billId] || [];
  const momentum = mockBillMomentum[billId];
  const mentions = mockMentions[billId] || [];

  const [activeTab, setActiveTab] = React.useState<'overview' | 'whip-count'>('overview');
  
  const billsTheme = getPageTheme('Bills');

  if (!bill) {
    return (
      <div className={`p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-shift-subtle'}`}>
        <div className="text-center py-12">
          <h2 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Bill not found</h2>
          <Button variant="primary" onClick={onBack}>
            <ArrowLeft size={16} />
            Back to Bills
          </Button>
        </div>
      </div>
    );
  }

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'support': return 'green';
      case 'oppose': return 'red';
      case 'monitor': return 'amber';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'introduced': 'Introduced',
      'committee': 'In Committee',
      'floor': 'Floor',
      'passed-chamber': 'Passed Chamber',
      'second-chamber': 'Second Chamber',
      'governor': 'Governor',
      'signed': 'Signed',
      'vetoed': 'Vetoed',
    };
    return labels[status] || status;
  };

  const daysUntilAction = () => {
    const actionDate = new Date(bill.nextActionDate);
    const today = new Date();
    const diffTime = actionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `in ${diffDays} days`;
  };

  // Header Props
  const headerIcon = (
    <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={onBack}>
            <ArrowLeft size={16} />
        </Button>
        <span className="font-bold text-2xl">{bill.billId}</span>
    </div>
  );

  const headerContent = (
    <div className="flex items-center gap-2">
        {bill.isPinned && <Pin size={18} className="text-red-600 fill-red-600" />}
        <Chip variant="neutral" size="sm">{getStatusLabel(bill.status)}</Chip>
        <Chip variant={getStanceColor(bill.stance) as any} size="sm">
        {bill.stance.charAt(0).toUpperCase() + bill.stance.slice(1)}
        </Chip>
        {bill.flags.map(flag => (
        <Chip key={flag.label} variant="warning" size="sm">
            {flag.label}
        </Chip>
        ))}
    </div>
  );

  const pageActions = (
    <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm">
        <Eye size={16} />
        {bill.isPinned ? 'Watching' : 'Watch'}
        </Button>
        <Button variant="primary" size="sm" onClick={() => openPythia({ type: 'bill', id: bill.id, label: `Bill: ${bill.billId}` })}>
        <FileText size={16} />
        Generate Brief
        </Button>
        <Button variant="secondary" size="sm">
        <Download size={16} />
        Export
        </Button>
    </div>
  );

  return (
    <PageLayout
      title={bill.shortTitle}
      subtitle={bill.title}
      accentColor={billsTheme.accent}
      headerIcon={headerIcon}
      headerContent={headerContent}
      pageActions={pageActions}
      backgroundImage={
        <FileText 
            size={450} 
            color={isDarkMode ? "white" : billsTheme.accent} 
            strokeWidth={0.5}
        />
      }
      contentClassName="flex-1 overflow-y-auto"
    >
        <div className="p-6">
            {/* Next Action & Timeline */}
            <div className="mb-6 flex flex-col md:flex-row gap-6">
                <div className={`flex-1 flex items-center gap-4 px-6 py-4 border rounded-xl ${
                    isDarkMode
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-red-50 border-red-200'
                }`}>
                    <div className="flex-1">
                        <span className={`text-sm font-medium block mb-1 ${
                        isDarkMode ? 'text-red-300' : 'text-red-900'
                        }`}>Next Action Required</span>
                        <span className={`text-lg font-bold ${
                        isDarkMode ? 'text-red-200' : 'text-red-700'
                        }`}>{bill.nextActionDescription}</span>
                    </div>
                    <div className={`text-right`}>
                        <span className={`text-2xl font-bold block ${
                        isDarkMode ? 'text-red-300' : 'text-red-900'
                        }`}>{daysUntilAction()}</span>
                    </div>
                </div>
                
                <div className="flex-1">
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-6 border-b border-gray-200 dark:border-white/10 h-full px-4">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`h-full pb-4 border-b-2 font-medium text-sm transition-all ${activeTab === 'overview' ? (isDarkMode ? 'border-white text-white' : 'border-blue-600 text-blue-600') : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Overview & Analysis
                        </button>
                        <button 
                            onClick={() => setActiveTab('whip-count')}
                            className={`h-full pb-4 border-b-2 font-medium text-sm transition-all ${activeTab === 'whip-count' ? (isDarkMode ? 'border-white text-white' : 'border-blue-600 text-blue-600') : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Whip Count & Votes
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="mb-8">
                    <BillTimeline bill={bill} />
                </div>
            )}

            {activeTab === 'whip-count' ? (
                <div className="h-[calc(100vh-350px)]">
                    <WhipCountBoard billId={billId} />
                </div>
            ) : (
            /* Main Content: 3-Column Layout */
            <div className="grid grid-cols-12 gap-6">
                {/* Left Main Column */}
                <div className="col-span-8 space-y-6">
                    {/* Revere Bill Review */}
                    {aiReview && <AIBillReview billId={billId} review={aiReview} />}

                    {/* Version Tracking */}
                    <VersionTracking bill={bill} />

                    {/* Media & Narrative */}
                    <MediaNarrative mentions={mentions} billId={billId} />
                </div>

                {/* Right Rail */}
                <div className="col-span-4 space-y-6">
                    {/* Bill Momentum */}
                    {momentum && <BillMomentumCard momentum={momentum} />}

                    {/* Key Actors */}
                    <KeyActors
                    sponsorIds={bill.sponsorIds}
                    sponsorNames={bill.sponsorNames}
                    committeeName={bill.committeeName}
                    memberInsights={memberInsights}
                    onNavigateToLegislator={onNavigateToLegislator}
                    />

                    {/* Voting Patterns */}
                    {memberInsights.length > 0 && (
                    <VotingPatterns memberInsights={memberInsights} />
                    )}

                    {/* Action Plan */}
                    <ActionPlan billId={billId} />
                </div>
            </div>
            )}
        </div>
    </PageLayout>
  );
}
