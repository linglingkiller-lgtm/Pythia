import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { ExternalLink, FileText, UserPlus } from 'lucide-react';
import { GenerateBriefModal, BriefFormData } from '../brief/GenerateBriefModal';
import { BriefViewer } from '../brief/BriefViewer';

interface WatchlistItem {
  billId: string;
  title: string;
  nextAction: string;
  nextDate: string;
  stance: 'Support' | 'Oppose' | 'Monitor';
  riskScore: number;
}

export function WatchlistSnapshot() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedBill, setSelectedBill] = React.useState<WatchlistItem | null>(null);
  const [showBriefViewer, setShowBriefViewer] = React.useState(false);
  const [briefData, setBriefData] = React.useState<BriefFormData | null>(null);

  const watchlist: WatchlistItem[] = [
    { billId: 'HB 2847', title: 'Clean Energy Act', nextAction: 'Committee Vote', nextDate: '10/28', stance: 'Support', riskScore: 3 },
    { billId: 'SB 567', title: 'Tax Reform Bill', nextAction: 'Hearing', nextDate: '11/02', stance: 'Oppose', riskScore: 8 },
    { billId: 'HB 890', title: 'Healthcare Access', nextAction: 'Floor Vote', nextDate: '11/15', stance: 'Support', riskScore: 5 },
    { billId: 'SB 234', title: 'Education Funding', nextAction: 'Amendment Period', nextDate: '10/30', stance: 'Monitor', riskScore: 4 },
    { billId: 'HB 456', title: 'Infrastructure Investment', nextAction: 'Committee Hearing', nextDate: '11/05', stance: 'Support', riskScore: 2 },
    { billId: 'SB 789', title: 'Labor Rights Act', nextAction: 'Markup', nextDate: '11/08', stance: 'Oppose', riskScore: 7 },
  ];
  
  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-green-400';
    if (score <= 6) return 'text-amber-400';
    return 'text-red-400';
  };

  const handleBriefClick = (item: WatchlistItem) => {
    setSelectedBill(item);
    setIsModalOpen(true);
  };

  const handleGenerateBrief = (data: BriefFormData) => {
    setBriefData(data);
    setShowBriefViewer(true);
    setIsModalOpen(false);
  };

  const handleCloseBriefViewer = () => {
    setShowBriefViewer(false);
    setBriefData(null);
  };

  if (showBriefViewer && briefData) {
    return <BriefViewer briefData={briefData} onClose={handleCloseBriefViewer} />;
  }
  
  return (
    <>
      <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 tracking-tight">Watchlist Snapshot</h3>
          <span className="text-xs text-gray-500 font-medium">Updated just now</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-gray-500 pb-2 font-medium">Bill</th>
                <th className="text-left text-xs text-gray-500 pb-2 font-medium">Next</th>
                <th className="text-left text-xs text-gray-500 pb-2 font-medium">Stance</th>
                <th className="text-left text-xs text-gray-500 pb-2 font-medium">Risk</th>
                <th className="text-right text-xs text-gray-500 pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <td className="py-3">
                    <div>
                      <div className="text-gray-900 font-medium">{item.billId}</div>
                      <div className="text-xs text-gray-500">{item.title}</div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div>
                      <div className="text-sm text-gray-900">{item.nextAction}</div>
                      <div className="text-xs text-gray-500">{item.nextDate}</div>
                    </div>
                  </td>
                  <td className="py-3">
                    <Chip variant={item.stance === 'Support' ? 'support' : item.stance === 'Oppose' ? 'oppose' : 'monitor'}>
                      {item.stance}
                    </Chip>
                  </td>
                  <td className="py-3">
                    <span className={`text-sm font-semibold ${getRiskColor(item.riskScore)}`}>
                      {item.riskScore}/10
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Open">
                        <ExternalLink size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Brief" onClick={() => handleBriefClick(item)}>
                        <FileText size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Assign">
                        <UserPlus size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {isModalOpen && selectedBill && (
        <GenerateBriefModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bill={selectedBill}
          onGenerateBrief={handleGenerateBrief}
        />
      )}
    </>
  );
}