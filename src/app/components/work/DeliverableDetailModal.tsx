import React from 'react';
import { createPortal } from 'react-dom';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { X, Download, Mail, Edit, CheckCircle, Clock, AlertTriangle, Calendar, FileText, Users, Sparkles, TrendingUp, ArrowRight, ExternalLink } from 'lucide-react';
import { type Deliverable } from '../../data/workHubData';
import { mockClientBills, mockEngagementRecords } from '../../data/clientsData';

interface DeliverableDetailModalProps {
  deliverable: Deliverable;
  onClose: () => void;
  onNavigateToBill?: (billId: string) => void;
}

export function DeliverableDetailModal({ deliverable, onClose, onNavigateToBill }: DeliverableDetailModalProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedTone, setSelectedTone] = React.useState<'neutral' | 'assertive' | 'cautious'>('neutral');

  // Keyboard support for ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Get related data for the deliverable
  const clientBills = mockClientBills[deliverable.clientId] || [];
  const clientEngagements = mockEngagementRecords[deliverable.clientId] || [];
  
  // Filter engagements from the past week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentEngagements = clientEngagements.filter(e => new Date(e.date) >= oneWeekAgo);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'neutral';
      case 'internal-review': return 'warning';
      case 'client-ready': return 'info';
      case 'sent': return 'success';
      default: return 'neutral';
    }
  };

  const handleAdvanceWorkflow = () => {
    // Simulate advancing to next workflow stage
    console.log('Advancing workflow from', deliverable.status);
  };

  const handleExport = () => {
    console.log('Exporting deliverable as PDF');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(deliverable.title);
    const body = encodeURIComponent(`Please see attached: ${deliverable.title}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-6" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-start justify-between flex-shrink-0">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={24} />
              <div>
                <h2 className="text-xl font-bold">{deliverable.title}</h2>
                <p className="text-blue-100 text-sm">{deliverable.clientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <Chip variant={getStatusVariant(deliverable.status)} size="sm" className="bg-white/20 text-white border-white/30">
                {deliverable.status.replace('-', ' ')}
              </Chip>
              {deliverable.dueDate && (
                <div className="flex items-center gap-1 text-sm">
                  <Calendar size={14} />
                  Due {new Date(deliverable.dueDate).toLocaleDateString()}
                </div>
              )}
              {deliverable.approverName && (
                <div className="flex items-center gap-1 text-sm">
                  <Users size={14} />
                  Approver: {deliverable.approverName}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="border-b border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit size={14} />
              {isEditing ? 'Preview' : 'Edit'}
            </Button>

            {/* Tone Selector */}
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs text-gray-600 font-medium">Tone:</span>
              <div className="flex gap-1">
                {(['neutral', 'assertive', 'cautious'] as const).map(tone => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      selectedTone === tone
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {deliverable.status === 'draft' && (
              <Button variant="primary" size="sm" onClick={handleAdvanceWorkflow}>
                <ArrowRight size={14} />
                Send for Review
              </Button>
            )}
            {deliverable.status === 'internal-review' && (
              <Button variant="primary" size="sm" onClick={handleAdvanceWorkflow}>
                <CheckCircle size={14} />
                Approve for Client
              </Button>
            )}
            {deliverable.status === 'client-ready' && (
              <>
                <Button variant="secondary" size="sm" onClick={handleExport}>
                  <Download size={14} />
                  Export PDF
                </Button>
                <Button variant="primary" size="sm" onClick={handleSendEmail}>
                  <Mail size={14} />
                  Send to Client
                </Button>
              </>
            )}
            {deliverable.status === 'sent' && (
              <Button variant="secondary" size="sm" onClick={handleExport}>
                <Download size={14} />
                Download Copy
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6 pb-8">
            {/* Pythia Auto-Compile Banner */}
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-purple-600">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Pythia Auto-Compiled Content</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    This update was automatically generated from your records, bills, and engagement data from the past 7 days.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Chip variant="neutral" size="sm">{clientBills.length} bills tracked</Chip>
                    <Chip variant="neutral" size="sm">{recentEngagements.length} recent activities</Chip>
                    <Chip variant="neutral" size="sm">Last updated: {new Date().toLocaleString()}</Chip>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <Sparkles size={14} />
                  Regenerate
                </Button>
              </div>
            </Card>

            {/* Weekly Update Content */}
            <div className="space-y-6">
              {/* Executive Summary */}
              <section className="bg-white rounded border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  Executive Summary
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="mb-3">
                    <strong>Week of December 16-20, 2025</strong>
                  </p>
                  <p className="mb-3">
                    This week saw significant progress on clean energy legislation with HB 1234 advancing through committee 
                    and SB 456 moving to the Senate floor. Our team engaged with 3 legislators and submitted testimony supporting 
                    the Renewable Energy Standards Act.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
                    <p className="font-semibold text-blue-900 mb-1">Key Highlight</p>
                    <p className="text-blue-800 text-sm">
                      HB 1234 passed House Energy Committee with amendments we recomended. Floor vote expected next week.
                    </p>
                  </div>
                  <p>
                    <strong>Next Week's Focus:</strong> HB 1234 floor vote preparation, SB 456 amendment strategy, 
                    and continued opposition research on HB 789.
                  </p>
                </div>
              </section>

              {/* Bill Status Updates */}
              <section className="bg-white rounded border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-600 rounded"></div>
                  Bill Status Updates
                </h3>
                <div className="space-y-4">
                  {clientBills.slice(0, 3).map(bill => (
                    <div key={bill.id} className="border-l-4 border-gray-300 pl-4 py-2">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <button
                            onClick={() => onNavigateToBill?.(bill.billId)}
                            className="font-semibold text-gray-900 hover:text-blue-600 flex items-center gap-1 group"
                          >
                            {bill.billNumber}: {bill.billTitle}
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <div className="flex items-center gap-3 mt-1">
                            <Chip
                              variant={bill.stance === 'support' ? 'success' : 'danger'}
                              size="sm"
                            >
                              {bill.stance.toUpperCase()}
                            </Chip>
                            <span className="text-sm text-gray-600">{bill.status}</span>
                            <Chip variant={bill.impactRating === 'high' ? 'warning' : 'neutral'} size="sm">
                              {bill.impactRating} impact
                            </Chip>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Legislative Progress</span>
                          <span>{bill.statusProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              bill.stance === 'support' ? 'bg-green-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${bill.statusProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Movement This Week */}
                      <div className="text-sm text-gray-700">
                        <strong>This Week:</strong> {
                          bill.billNumber === 'HB 1234' 
                            ? 'Passed House Energy Committee with favorable amendments. Moved to House floor calendar. Expected floor vote Dec 22-23.'
                            : bill.billNumber === 'SB 456'
                            ? 'Advanced to Senate floor. Secured commitments from 3 additional sponsors. Floor debate scheduled for Dec 22.'
                            : 'Committee hearing scheduled. Preparing opposition testimony and alternative proposals.'
                        }
                      </div>

                      {/* Next Action */}
                      {bill.nextActionDate && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600 font-medium">
                          <Calendar size={14} />
                          Next Action: {new Date(bill.nextActionDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Engagement Activity */}
              <section className="bg-white rounded border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 rounded"></div>
                  Engagement Activity
                </h3>
                <div className="space-y-3">
                  {recentEngagements.map(engagement => {
                    const getEngagementIcon = (type: string) => {
                      switch (type) {
                        case 'meeting': return <Users size={16} className="text-blue-600" />;
                        case 'testimony': return <FileText size={16} className="text-purple-600" />;
                        case 'call': return <Clock size={16} className="text-green-600" />;
                        case 'brief': return <FileText size={16} className="text-orange-600" />;
                        case 'amendment': return <Edit size={16} className="text-red-600" />;
                        default: return <FileText size={16} className="text-gray-600" />;
                      }
                    };

                    return (
                      <div key={engagement.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                        <div className="p-2 bg-white rounded border border-gray-200">
                          {getEngagementIcon(engagement.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-medium text-gray-900 capitalize">{engagement.type}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(engagement.date).toLocaleDateString()} • {engagement.time}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{engagement.summary}</p>
                          {engagement.linkedPersonNames.length > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                              <Users size={12} />
                              {engagement.linkedPersonNames.join(', ')}
                            </div>
                          )}
                          {engagement.linkedBillNumbers.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {engagement.linkedBillNumbers.map(billNum => (
                                <Chip key={billNum} variant="neutral" size="sm" className="text-xs">
                                  {billNum}
                                </Chip>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Upcoming Events & Deadlines */}
              <section className="bg-white rounded border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-orange-600 rounded"></div>
                  Upcoming Events & Deadlines
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border border-orange-200 bg-orange-50 rounded">
                    <Calendar size={20} className="text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">HB 1234 Committee Hearing</div>
                      <div className="text-sm text-gray-600 mt-1">Friday, December 20, 2025 • 10:00 AM</div>
                      <div className="text-sm text-gray-700 mt-2">
                        House Energy Committee hearing. Testimony submitted. Rep. Martinez presenting our amendments.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                    <Calendar size={20} className="text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">SB 456 Floor Vote (Expected)</div>
                      <div className="text-sm text-gray-600 mt-1">Monday-Tuesday, December 22-23, 2025</div>
                      <div className="text-sm text-gray-700 mt-2">
                        Senate floor vote anticipated. We have 18 confirmed yes votes (14 needed for passage).
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                    <Users size={20} className="text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Coalition Strategy Session</div>
                      <div className="text-sm text-gray-600 mt-1">Thursday, December 26, 2025 • 2:00 PM</div>
                      <div className="text-sm text-gray-700 mt-2">
                        Clean Energy Alliance coordination meeting to align on 2026 legislative priorities.
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Risks & Opportunities */}
              <section className="bg-white rounded border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-600 rounded"></div>
                  Risks & Opportunities
                </h3>

                <div className="space-y-4">
                  {/* Risks */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={18} className="text-red-600" />
                      <h4 className="font-semibold text-gray-900">Risks</h4>
                    </div>
                    <ul className="space-y-2 ml-7">
                      <li className="text-sm text-gray-700">
                        <strong>HB 789 gaining momentum:</strong> Opposition bill adding restrictions to solar development 
                        has picked up 3 new co-sponsors. Recommend accelerating counter-messaging.
                      </li>
                      <li className="text-sm text-gray-700">
                        <strong>Timeline concern for SB 456:</strong> If floor vote delayed past Dec 23, bill may miss 
                        session deadline. Monitoring closely.
                      </li>
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={18} className="text-green-600" />
                      <h4 className="font-semibold text-gray-900">Opportunities</h4>
                    </div>
                    <ul className="space-y-2 ml-7">
                      <li className="text-sm text-gray-700">
                        <strong>Bipartisan support building:</strong> Rep. Johnson (R) indicated interest in co-sponsoring 
                        clean energy workforce provisions. Recommend scheduling meeting in January.
                      </li>
                      <li className="text-sm text-gray-700">
                        <strong>Media interest:</strong> State Journal reached out for interview on HB 1234 passage. 
                        Coordinating with your communications team for response.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Next Week Preview */}
              <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowRight size={20} className="text-blue-600" />
                  Next Week's Priorities
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Monitor HB 1234 floor vote timing and vote count</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Prepare SB 456 floor amendments and sponsor talking points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Draft opposition strategy memo for HB 789</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Schedule January meetings with potential new coalition partners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Prepare year-end legislative summary and 2026 outlook</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        {/* Footer - Workflow Status */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {deliverable.status === 'draft' && (
                  <>
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Draft in progress</span>
                  </>
                )}
                {deliverable.status === 'internal-review' && (
                  <>
                    <Clock size={16} className="text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Awaiting internal review</span>
                  </>
                )}
                {deliverable.status === 'client-ready' && (
                  <>
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Ready to send to client</span>
                  </>
                )}
                {deliverable.status === 'sent' && (
                  <>
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Sent to client {deliverable.sentToClient && `on ${new Date(deliverable.sentToClient).toLocaleDateString()}`}
                    </span>
                  </>
                )}
              </div>

              <div className="text-xs text-gray-500">
                Last updated: {new Date(deliverable.updatedAt).toLocaleString()}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Press ESC to close
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}