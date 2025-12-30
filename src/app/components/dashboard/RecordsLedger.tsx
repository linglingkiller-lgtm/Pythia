import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ExternalLink, Tag } from 'lucide-react';

interface Record {
  type: string;
  reference: string;
  party: string;
  timestamp: string;
}

export function RecordsLedger() {
  const records: Record[] = [
    { type: 'Meeting Note', reference: 'HB1234', party: 'Chair\'s Office', timestamp: '10/28 2:30 PM' },
    { type: 'Call Log', reference: 'SB567', party: 'Coalition Partner', timestamp: '10/27 11:00 AM' },
    { type: 'Email Log', reference: 'HB890', party: 'Stakeholder Group', timestamp: '10/27 9:15 AM' },
    { type: 'Meeting Note', reference: 'Education', party: 'Committee Staff', timestamp: '10/26 3:45 PM' },
    { type: 'Attachment', reference: 'HB456', party: 'Industry Association', timestamp: '10/26 1:20 PM' },
    { type: 'Call Log', reference: 'SB789', party: 'Labor Union Rep', timestamp: '10/25 4:00 PM' },
    { type: 'Email Log', reference: 'HB234', party: 'Agency Director', timestamp: '10/25 10:30 AM' },
    { type: 'Meeting Note', reference: 'Energy', party: 'Subcommittee Chair', timestamp: '10/24 2:00 PM' },
  ];
  
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">Records Ledger</h3>
        <span className="text-xs text-gray-500">All logged interactions</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-sm">
            <tr className="border-b border-white/10">
              <th className="text-left text-xs text-gray-500 pb-3 pt-1 font-medium">Type</th>
              <th className="text-left text-xs text-gray-500 pb-3 pt-1 font-medium">Reference</th>
              <th className="text-left text-xs text-gray-500 pb-3 pt-1 font-medium">Party</th>
              <th className="text-left text-xs text-gray-500 pb-3 pt-1 font-medium">Timestamp</th>
              <th className="text-right text-xs text-gray-500 pb-3 pt-1 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr 
                key={index} 
                className="border-b border-white/5 hover:bg-white/5 transition-all group"
              >
                <td className="py-3 text-sm text-gray-300">{record.type}</td>
                <td className="py-3 text-sm text-cyan-400 font-medium">{record.reference}</td>
                <td className="py-3 text-sm text-gray-400">{record.party}</td>
                <td className="py-3 text-sm text-gray-500">{record.timestamp}</td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors" title="Open">
                      <ExternalLink size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors" title="Tag">
                      <Tag size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}