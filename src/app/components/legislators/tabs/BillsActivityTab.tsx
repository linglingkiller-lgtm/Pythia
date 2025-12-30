import React from 'react';
import { Legislator, Bill } from '../legislatorData';
import { FileText, ExternalLink, Briefcase, Calendar, Pin, AlertCircle } from 'lucide-react';
import { LegislatorBillBriefModal } from '../LegislatorBillBriefModal';
import { useTheme } from '../../../contexts/ThemeContext';

interface BillsActivityTabProps {
  legislator: Legislator;
  onNavigateToBill?: (billId: string) => void;
}

export function BillsActivityTab({ legislator, onNavigateToBill }: BillsActivityTabProps) {
  const { isDarkMode } = useTheme();
  const [briefModalData, setBriefModalData] = React.useState<{ legislator: Legislator; bill: Bill } | null>(null);

  return (
    <div className="space-y-6">
      {/* Sponsored/Co-sponsored Bills */}
      <div>
        <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Sponsored/Co-sponsored Bills ({legislator.sponsoredBills.length})
        </h3>
        {legislator.sponsoredBills.length > 0 ? (
          <div className="space-y-3">
            {legislator.sponsoredBills.map((bill) => (
              <BillCard 
                key={bill.id} 
                bill={bill} 
                legislator={legislator}
                onNavigateToBill={onNavigateToBill}
                onGenerateBrief={(bill) => setBriefModalData({ legislator, bill })}
              />
            ))}
          </div>
        ) : (
          <div className={`text-sm p-4 rounded text-center ${
            isDarkMode
              ? 'text-gray-400 bg-slate-800/40'
              : 'text-gray-500 bg-gray-50'
          }`}>
            No sponsored bills this session
          </div>
        )}
      </div>

      {/* Relevant to Tracked Issues */}
      <div>
        <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Relevant to Tracked Issues ({legislator.relevantBills.length})
        </h3>
        {legislator.relevantBills.length > 0 ? (
          <div className="space-y-3">
            {legislator.relevantBills.map((bill) => (
              <BillCard 
                key={bill.id} 
                bill={bill} 
                legislator={legislator}
                onNavigateToBill={onNavigateToBill}
                onGenerateBrief={(bill) => setBriefModalData({ legislator, bill })}
              />
            ))}
          </div>
        ) : (
          <div className={`text-sm p-4 rounded text-center ${
            isDarkMode
              ? 'text-gray-400 bg-slate-800/40'
              : 'text-gray-500 bg-gray-50'
          }`}>
            No relevant bills found
          </div>
        )}
      </div>

      {/* Brief Modal */}
      {briefModalData && (
        <LegislatorBillBriefModal
          legislator={briefModalData.legislator}
          bill={briefModalData.bill}
          onClose={() => setBriefModalData(null)}
        />
      )}
    </div>
  );
}

interface BillCardProps {
  bill: Bill;
  legislator: Legislator;
  onNavigateToBill?: (billId: string) => void;
  onGenerateBrief?: (bill: Bill) => void;
}

function BillCard({ bill, legislator, onNavigateToBill, onGenerateBrief }: BillCardProps) {
  const { isDarkMode } = useTheme();
  
  const getStatusColor = (status: string) => {
    if (isDarkMode) {
      switch (status.toLowerCase()) {
        case 'committee':
          return 'bg-blue-500/20 text-blue-300';
        case 'floor':
          return 'bg-purple-500/20 text-purple-300';
        case 'passed house':
        case 'passed senate':
          return 'bg-green-500/20 text-green-300';
        case 'draft':
          return 'bg-gray-500/20 text-gray-300';
        default:
          return 'bg-gray-500/20 text-gray-300';
      }
    }
    switch (status.toLowerCase()) {
      case 'committee':
        return 'bg-blue-100 text-blue-700';
      case 'floor':
        return 'bg-purple-100 text-purple-700';
      case 'passed house':
      case 'passed senate':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStanceColor = (stance?: string) => {
    if (isDarkMode) {
      switch (stance) {
        case 'support':
          return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'oppose':
          return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'neutral':
          return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        default:
          return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      }
    }
    switch (stance) {
      case 'support':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'oppose':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'neutral':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRiskColor = (score?: number) => {
    if (!score) return isDarkMode ? 'text-gray-500' : 'text-gray-500';
    if (score >= 7) return isDarkMode ? 'text-red-400' : 'text-red-600';
    if (score >= 4) return isDarkMode ? 'text-amber-400' : 'text-amber-600';
    return isDarkMode ? 'text-green-400' : 'text-green-600';
  };

  const getSponsorshipBadge = (type: string) => {
    if (isDarkMode) {
      return type === 'primary' 
        ? 'bg-red-500/20 text-red-300' 
        : 'bg-blue-500/20 text-blue-300';
    }
    return type === 'primary' 
      ? 'bg-red-100 text-red-700' 
      : 'bg-blue-100 text-blue-700';
  };

  return (
    <div className={`p-4 border rounded transition-colors ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10 hover:border-white/20'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{bill.number}</h4>
            <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(bill.status)}`}>
              {bill.status}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${getSponsorshipBadge(bill.sponsorshipType)}`}>
              {bill.sponsorshipType === 'primary' ? 'Primary' : 'Co-sponsor'}
            </span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{bill.title}</p>
        </div>
      </div>

      {/* Meta Info Row */}
      <div className={`flex items-center gap-4 mb-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {bill.nextActionDate && (
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            Next: {bill.nextActionDate}
          </span>
        )}
        {bill.stance && (
          <span className={`px-2 py-0.5 rounded border ${getStanceColor(bill.stance)}`}>
            {bill.stance.charAt(0).toUpperCase() + bill.stance.slice(1)}
          </span>
        )}
        {bill.riskScore !== undefined && (
          <span className={`flex items-center gap-1 font-medium ${getRiskColor(bill.riskScore)}`}>
            <AlertCircle size={12} />
            Risk: {bill.riskScore}/10
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onNavigateToBill && onNavigateToBill(bill.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded transition-colors text-sm ${
            isDarkMode
              ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-600/50'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <ExternalLink size={14} />
          Open Bill
        </button>
        <button 
          onClick={() => onGenerateBrief && onGenerateBrief(bill)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
        >
          <Briefcase size={14} />
          Generate Brief
        </button>
        <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded transition-colors text-sm ${
          isDarkMode
            ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-600/50'
            : 'bg-white border-gray-300 hover:bg-gray-50'
        }`}>
          <Calendar size={14} />
          Add to Calendar
        </button>
        <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded transition-colors text-sm ${
          isDarkMode
            ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-600/50'
            : 'bg-white border-gray-300 hover:bg-gray-50'
        }`}>
          <Pin size={14} />
          Pin to Issue
        </button>
      </div>
    </div>
  );
}