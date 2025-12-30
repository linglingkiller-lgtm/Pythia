import React from 'react';
import { type EngagementRecord } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Download, Phone, Mail, Users, FileText, Megaphone, Edit, Handshake } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface EngagementLedgerProps {
  records: EngagementRecord[];
}

export function EngagementLedger({ records }: EngagementLedgerProps) {
  const { isDarkMode } = useTheme();
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Users;
      case 'testimony': return Megaphone;
      case 'brief': return FileText;
      case 'memo': return Edit;
      case 'amendment': return FileText;
      case 'coalition': return Handshake;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    if (isDarkMode) {
      switch (type) {
        case 'meeting': return 'bg-blue-500/20 text-blue-300';
        case 'call': return 'bg-green-500/20 text-green-300';
        case 'email': return 'bg-purple-500/20 text-purple-300';
        case 'testimony': return 'bg-red-500/20 text-red-300';
        case 'brief': return 'bg-indigo-500/20 text-indigo-300';
        case 'amendment': return 'bg-yellow-500/20 text-yellow-300';
        default: return 'bg-gray-500/20 text-gray-300';
      }
    } else {
      switch (type) {
        case 'meeting': return 'bg-blue-100 text-blue-700';
        case 'call': return 'bg-green-100 text-green-700';
        case 'email': return 'bg-purple-100 text-purple-700';
        case 'testimony': return 'bg-red-100 text-red-700';
        case 'brief': return 'bg-indigo-100 text-indigo-700';
        case 'amendment': return 'bg-yellow-100 text-yellow-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`).getTime();
    const dateB = new Date(`${b.date} ${b.time}`).getTime();
    return dateB - dateA; // Most recent first
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Engagement Ledger</h3>
          <p className={`text-xs mt-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Proof of work • All client-related activity</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download size={14} />
          Export
        </Button>
      </div>

      <div className="space-y-3">
        {sortedRecords.map((record) => {
          const Icon = getTypeIcon(record.type);
          
          return (
            <div key={record.id} className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-slate-700/30 border-white/10'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTypeColor(record.type)}`}>
                  <Icon size={16} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className={`font-semibold text-sm ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{record.summary}</div>
                      <div className={`text-xs mt-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' • '}
                        {record.time}
                        {' • '}
                        {record.owner}
                      </div>
                    </div>
                    <Chip variant="neutral" size="sm">
                      {record.type}
                    </Chip>
                  </div>

                  {/* Linked Items */}
                  <div className="flex items-center gap-4 flex-wrap text-xs">
                    {record.linkedBillNumbers.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText size={12} className={
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } />
                        <span className={
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }>
                          Bills: {record.linkedBillNumbers.join(', ')}
                        </span>
                      </div>
                    )}
                    {record.linkedPersonNames.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users size={12} className={
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } />
                        <span className={
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }>
                          People: {record.linkedPersonNames.join(', ')}
                        </span>
                      </div>
                    )}
                    {record.linkedIssueNames.length > 0 && (
                      <div className={`flex items-center gap-1 ${
                        isDarkMode ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        <span className="font-medium">
                          {record.linkedIssueNames.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}