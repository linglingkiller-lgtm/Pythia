import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Calendar, FileText, Download, Mail, Eye } from 'lucide-react';
import { type Deliverable } from '../../data/workHubData';
import { DeliverableDetailModal } from './DeliverableDetailModal';
import { useTheme } from '../../contexts/ThemeContext';

interface DeliverablesQueueProps {
  deliverables: Deliverable[];
  onNavigateToBill?: (billId: string) => void;
}

export function DeliverablesQueue({ deliverables, onNavigateToBill }: DeliverablesQueueProps) {
  const { isDarkMode } = useTheme();
  const [selectedDeliverable, setSelectedDeliverable] = React.useState<Deliverable | null>(null);
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'neutral';
      case 'internal-review': return 'warning';
      case 'client-ready': return 'info';
      case 'sent': return 'success';
      default: return 'neutral';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'weekly-update': return 'Weekly Update';
      case 'bill-tracker': return 'Bill Tracker';
      case 'meeting-brief': return 'Meeting Brief';
      case 'hearing-prep': return 'Hearing Prep';
      case 'amendment-memo': return 'Amendment Memo';
      case 'qbr-summary': return 'QBR Summary';
      case 'custom': return 'Custom';
      default: return type;
    }
  };

  // Sort by due date
  const sortedDeliverables = [...deliverables].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className={`p-6 rounded-xl backdrop-blur-xl border transition-all ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    } shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Deliverables Queue
        </h3>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {deliverables.length} {deliverables.length === 1 ? 'deliverable' : 'deliverables'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <th className={`text-left text-xs font-semibold uppercase tracking-wide pb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Deliverable
              </th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wide pb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Type
              </th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wide pb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Due Date
              </th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wide pb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Status
              </th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wide pb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Approver
              </th>
              <th className={`text-right text-xs font-semibold uppercase tracking-wide pb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDeliverables.map((deliverable) => {
              const isOverdue = deliverable.dueDate && new Date(deliverable.dueDate) < new Date() && deliverable.status !== 'sent';
              
              return (
                <tr key={deliverable.id} className={`border-b transition-colors ${
                  isDarkMode
                    ? 'border-white/5 hover:bg-slate-700/30'
                    : 'border-gray-100 hover:bg-gray-50'
                }`}>
                  <td className="py-3">
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {deliverable.title}
                    </div>
                    {deliverable.projectTitle && (
                      <div className={`text-xs mt-0.5 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        Project: {deliverable.projectTitle}
                      </div>
                    )}
                  </td>
                  <td className="py-3">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {getTypeLabel(deliverable.type)}
                    </div>
                  </td>
                  <td className="py-3">
                    {deliverable.dueDate ? (
                      <div className={`text-sm ${
                        isOverdue 
                          ? (isDarkMode ? 'text-red-400 font-semibold' : 'text-red-600 font-semibold')
                          : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                      }`}>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(deliverable.dueDate).toLocaleDateString()}
                        </div>
                        {isOverdue && (
                          <div className={`text-xs mt-0.5 ${
                            isDarkMode ? 'text-red-400' : 'text-red-600'
                          }`}>
                            Overdue
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        No date
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <Chip variant={getStatusVariant(deliverable.status)} size="sm">
                      {deliverable.status.replace('-', ' ')}
                    </Chip>
                  </td>
                  <td className="py-3">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {deliverable.approverName || '—'}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setSelectedDeliverable(deliverable)}>
                        <Eye size={14} />
                      </Button>
                      {deliverable.status === 'client-ready' && (
                        <>
                          <Button variant="secondary" size="sm">
                            <Download size={14} />
                          </Button>
                          <Button variant="primary" size="sm">
                            <Mail size={14} />
                            Send
                          </Button>
                        </>
                      )}
                      {deliverable.status === 'sent' && (
                        <Button variant="secondary" size="sm">
                          <Download size={14} />
                          Export
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {deliverables.length === 0 && (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <FileText size={32} className={`mx-auto mb-2 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p className="text-sm">No deliverables for this client</p>
          </div>
        )}
      </div>

      {/* Deliverable Detail Modal */}
      {selectedDeliverable && (
        <DeliverableDetailModal
          deliverable={selectedDeliverable}
          onClose={() => setSelectedDeliverable(null)}
          onNavigateToBill={onNavigateToBill}
        />
      )}
    </div>
  );
}