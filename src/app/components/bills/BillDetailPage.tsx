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
import { useTheme } from '../../contexts/ThemeContext';

interface BillDetailPageProps {
  billId: string;
  onBack: () => void;
  onNavigateToLegislator?: (legislatorId: string) => void;
}

export function BillDetailPage({ billId, onBack, onNavigateToLegislator }: BillDetailPageProps) {
  const { isDarkMode } = useTheme();
  const bill = mockBills.find(b => b.id === billId);
  const aiReview = mockBillAIReviews[billId];
  const memberInsights = mockMemberInsights[billId] || [];
  const momentum = mockBillMomentum[billId];
  const mentions = mockMentions[billId] || [];

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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-shift-subtle'}`}>
      {/* Top Header Bar */}
      <div className={`border-b sticky top-0 z-10 shadow-sm backdrop-blur-xl ${
        isDarkMode
          ? 'bg-slate-800/95 border-white/10'
          : 'bg-white border-gray-200'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button variant="secondary" size="sm" onClick={onBack}>
              <ArrowLeft size={16} />
              Back to Bills
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <Eye size={16} />
                {bill.isPinned ? 'Watching' : 'Watch'}
              </Button>
              <Button variant="secondary" size="sm">
                <Bell size={16} />
                Add Note
              </Button>
              <Button variant="primary" size="sm">
                <FileText size={16} />
                Generate Brief
              </Button>
              <Button variant="secondary" size="sm">
                <Plus size={16} />
                Create Task
              </Button>
              <Button variant="secondary" size="sm">
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>

          {/* Bill Identity */}
          <div className="mb-3">
            <div className="flex items-center gap-3 mb-2">
              <h1 className={`text-2xl font-bold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{bill.billId}</h1>
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
            <h2 className={`text-lg font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>{bill.shortTitle}</h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>{bill.title}</p>
          </div>

          {/* Next Action */}
          <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${
            isDarkMode
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-red-50 border-red-200'
          }`}>
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-red-300' : 'text-red-900'
            }`}>Next Action:</span>
            <span className={`text-sm ${
              isDarkMode ? 'text-red-200' : 'text-red-700'
            }`}>{bill.nextActionDescription}</span>
            <span className={`text-sm font-semibold ${
              isDarkMode ? 'text-red-300' : 'text-red-900'
            }`}>{daysUntilAction()}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-6 pb-4">
          <BillTimeline bill={bill} />
        </div>
      </div>

      {/* Main Content: 3-Column Layout */}
      <div className="p-6">
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
      </div>
    </div>
  );
}