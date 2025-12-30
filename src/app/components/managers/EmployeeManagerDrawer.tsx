import React from 'react';
import { X, User, FileText, Activity, ClipboardList, Sparkles, Download, Edit, Plus, UserPlus, Eye, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { printDocument, formatMetric, formatSection, formatStatusBadge } from '../../utils/exportUtils';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  type TeamMember, 
  mockEmployeeTasks, 
  mockEmployeeDeliverables,
  mockQuarterlyReviews,
  mockPythiaInsights,
  mockPerformanceGoals,
  mockTeamMembers
} from '../../data/teamData';

interface EmployeeManagerDrawerProps {
  employee: TeamMember;
  onClose: () => void;
}

export function EmployeeManagerDrawer({ employee, onClose }: EmployeeManagerDrawerProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'deliverables' | 'activity' | 'review' | 'insights'>('overview');

  const tasks = mockEmployeeTasks[employee.id] || [];
  const deliverables = mockEmployeeDeliverables[employee.id] || [];
  const review = mockQuarterlyReviews.find(r => r.userId === employee.id);
  const insights = mockPythiaInsights[employee.id] || [];
  const goals = mockPerformanceGoals[employee.id] || [];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'deliverables' as const, label: 'Deliverables', icon: FileText, count: deliverables.length },
    { id: 'activity' as const, label: 'Activity', icon: Activity },
    { id: 'review' as const, label: 'Quarterly Review', icon: ClipboardList },
    { id: 'insights' as const, label: 'Pythia Insights', icon: Sparkles, count: insights.length },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onClose}>
      <div 
        className={`w-full max-w-3xl h-full shadow-2xl flex flex-col animate-slide-in-right mt-16 ${
          isDarkMode ? 'bg-slate-900' : 'bg-white'
        }`}
        style={{ height: 'calc(100vh - 4rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex-shrink-0 ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                  {employee.name}
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {employee.role}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {employee.departments.map((dept, idx) => (
                    <Chip key={idx} variant="neutral" size="sm">
                      {dept === 'lobbying' ? 'Lobbying' : dept === 'public-affairs' ? 'Public Affairs' : 'Campaign Services'}
                    </Chip>
                  ))}
                  <Chip 
                    variant={
                      employee.status === 'overloaded' ? 'danger' : 
                      employee.status === 'on-track' ? 'success' : 
                      'warning'
                    } 
                    size="sm"
                  >
                    {employee.status === 'overloaded' ? 'Overloaded' : employee.status === 'on-track' ? 'On Track' : 'Underutilized'}
                  </Chip>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded transition-colors ${
                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              }`}
            >
              <X size={24} className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-b flex-shrink-0 overflow-x-auto ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? isDarkMode
                        ? 'border-blue-500 text-blue-400'
                        : 'border-blue-600 text-blue-600'
                      : isDarkMode
                      ? 'border-transparent text-gray-400 hover:text-gray-300'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isDarkMode
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && <OverviewTab employee={employee} tasks={tasks} deliverables={deliverables} isDarkMode={isDarkMode} />}
          {activeTab === 'deliverables' && <DeliverablesTab employee={employee} deliverables={deliverables} isDarkMode={isDarkMode} />}
          {activeTab === 'activity' && <ActivityTab employee={employee} isDarkMode={isDarkMode} />}
          {activeTab === 'review' && <QuarterlyReviewTab employee={employee} review={review} goals={goals} isDarkMode={isDarkMode} />}
          {activeTab === 'insights' && <PythiaInsightsTab employee={employee} insights={insights} isDarkMode={isDarkMode} />}
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Tab Components
function OverviewTab({ employee, tasks, deliverables, isDarkMode }: any) {
  return (
    <div className="space-y-6">
      {/* Workload Breakdown */}
      <section>
        <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
          Workload Breakdown
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className={`border rounded-lg p-4 ${
            isDarkMode 
              ? 'bg-blue-500/10 border-blue-400/20' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="text-3xl font-bold text-blue-500 mb-1">{employee.tasksDueThisWeek}</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tasks Due This Week</div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>of {employee.tasksCount} total</div>
          </div>
          <div className={`border rounded-lg p-4 ${
            isDarkMode 
              ? 'bg-purple-500/10 border-purple-400/20' 
              : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="text-3xl font-bold text-purple-500 mb-1">{employee.deliverablesDueThisWeek}</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Deliverables Due</div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>of {employee.deliverablesCount} total</div>
          </div>
          <div className={`border rounded-lg p-4 ${
            isDarkMode 
              ? 'bg-green-500/10 border-green-400/20' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="text-3xl font-bold text-green-500 mb-1">{employee.activeProjectsCount}</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Active Projects</div>
          </div>
          <div className={`border rounded-lg p-4 ${
            isDarkMode 
              ? 'bg-orange-500/10 border-orange-400/20' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="text-3xl font-bold text-orange-500 mb-1">{employee.meetingsToday}</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Meetings Today</div>
          </div>
        </div>
      </section>

      {/* This Week Timeline */}
      <section>
        <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
          This Week
        </h3>
        <div className="space-y-3">
          {deliverables.filter((d: any) => new Date(d.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).map((d: any) => (
            <div key={d.id} className={`flex items-start gap-3 p-3 border rounded-lg ${
              isDarkMode
                ? 'bg-purple-500/10 border-purple-400/20'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <FileText size={18} className="text-purple-500 mt-0.5" />
              <div className="flex-1">
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{d.title}</div>
                <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{d.clientName}</div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Due {new Date(d.dueDate).toLocaleDateString()}
                </div>
              </div>
              <Chip variant={d.status === 'final' ? 'success' : 'warning'} size="sm">
                {d.status}
              </Chip>
            </div>
          ))}
          {tasks.slice(0, 3).map((t: any) => (
            <div key={t.id} className={`flex items-start gap-3 p-3 border rounded-lg ${
              isDarkMode
                ? 'bg-blue-500/10 border-blue-400/20'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <Activity size={18} className="text-blue-500 mt-0.5" />
              <div className="flex-1">
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.title}</div>
                {t.clientName && <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.clientName}</div>}
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Due {new Date(t.dueDate).toLocaleDateString()}
                </div>
              </div>
              <Chip variant={t.priority === 'high' ? 'danger' : 'neutral'} size="sm">
                {t.priority}
              </Chip>
            </div>
          ))}
        </div>
      </section>

      {/* Top Clients */}
      <section>
        <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
          Current Focus
        </h3>
        <div className="space-y-2">
          {employee.currentTopClients.map((client: string, idx: number) => (
            <div key={idx} className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'
            }`}>
              <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{client}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DeliverablesTab({ employee, deliverables, isDarkMode }: any) {
  const [editingDeliverable, setEditingDeliverable] = React.useState<any>(null);
  const [reassigningDeliverable, setReassigningDeliverable] = React.useState<any>(null);
  const [viewingRecord, setViewingRecord] = React.useState<any>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
          Deliverables ({deliverables.length})
        </h3>
        <Button variant="primary" size="sm">
          <Plus size={16} />
          Add Deliverable
        </Button>
      </div>

      {deliverables.length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          <FileText size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p>No deliverables assigned</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deliverables.map((d: any) => (
            <div key={d.id} className={`border rounded-lg p-4 ${
              isDarkMode 
                ? 'bg-slate-800/50 border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{d.title}</h4>
                  <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>{d.clientName}</span>
                    <span>•</span>
                    <span>Due {new Date(d.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <Chip 
                  variant={
                    d.status === 'sent' ? 'success' : 
                    d.status === 'final' ? 'info' : 
                    d.status === 'in-review' ? 'warning' : 
                    'neutral'
                  } 
                  size="sm"
                >
                  {d.status}
                </Chip>
              </div>

              {d.collaborators && d.collaborators.length > 0 && (
                <div className="mb-3">
                  <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Collaborators:</div>
                  <div className="flex flex-wrap gap-1">
                    {d.collaborators.map((c: string, idx: number) => (
                      <Chip key={idx} variant="neutral" size="sm" className="text-xs">
                        User {c}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {d.blockers && d.blockers.length > 0 && (
                <div className={`p-2 border rounded mb-3 ${
                  isDarkMode 
                    ? 'bg-red-500/10 border-red-400/20' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-red-400' : 'text-red-900'}`}>Blockers:</div>
                  <ul className={`text-xs list-disc list-inside ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                    {d.blockers.map((b: string, idx: number) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setEditingDeliverable(d)}>
                  <Edit size={14} />
                  Edit
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setReassigningDeliverable(d)}>
                  <UserPlus size={14} />
                  Reassign
                </Button>
                {d.status === 'draft' && (
                  <Button variant="secondary" size="sm">
                    Mark for Review
                  </Button>
                )}
                {d.recordId && (
                  <Button variant="secondary" size="sm" onClick={() => setViewingRecord(d)}>
                    <Eye size={14} />
                    View Record
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Deliverable Modal */}
      {editingDeliverable && (
        <EditDeliverableModal 
          deliverable={editingDeliverable}
          onClose={() => setEditingDeliverable(null)}
          onSave={(updated) => {
            console.log('Save deliverable:', updated);
            setEditingDeliverable(null);
          }}
        />
      )}

      {/* Reassign Modal */}
      {reassigningDeliverable && (
        <ReassignModal
          deliverable={reassigningDeliverable}
          currentUser={employee}
          onClose={() => setReassigningDeliverable(null)}
          onReassign={(toUserId, reason) => {
            console.log('Reassign to:', toUserId, 'Reason:', reason);
            setReassigningDeliverable(null);
          }}
        />
      )}

      {/* View Record Modal */}
      {viewingRecord && (
        <ViewRecordModal
          deliverable={viewingRecord}
          onClose={() => setViewingRecord(null)}
        />
      )}
    </div>
  );
}

function ActivityTab({ employee, isDarkMode }: any) {
  return (
    <div className="space-y-6">
      {/* Activity Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`border rounded-lg p-4 text-center ${
          isDarkMode 
            ? 'bg-blue-500/10 border-blue-400/20' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="text-2xl font-bold text-blue-500">{employee.recordsCreatedThisWeek}</div>
          <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Records Created</div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>This Week</div>
        </div>
        <div className={`border rounded-lg p-4 text-center ${
          isDarkMode 
            ? 'bg-green-500/10 border-green-400/20' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="text-2xl font-bold text-green-500">{employee.deliverableCompletionRate}%</div>
          <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Completion Rate</div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>This Quarter</div>
        </div>
        <div className={`border rounded-lg p-4 text-center ${
          isDarkMode 
            ? 'bg-purple-500/10 border-purple-400/20' 
            : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="text-2xl font-bold text-purple-500">{employee.clientTouchpoints}</div>
          <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Client Touchpoints</div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>This Week</div>
        </div>
      </div>

      {/* Recent Activity */}
      <section>
        <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Created HB 2847 Hearing Prep Packet</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Dec 17, 2:30 PM</span>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deliverable • SolarTech Alliance</div>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Completed 3 tasks for HB 2847 project</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Dec 17, 4:15 PM</span>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks • SolarTech Alliance</div>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Meeting with Rep. Martinez</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Dec 15, 2:00 PM</span>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Engagement • SolarTech Alliance</div>
          </div>
        </div>
      </section>

      {/* Export Activity Log */}
      <div className="flex justify-center">
        <Button variant="secondary">
          <Download size={16} />
          Export Activity Log
        </Button>
      </div>
    </div>
  );
}

function QuarterlyReviewTab({ employee, review, goals, isDarkMode }: any) {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleExportPDF = () => {
    if (!review) return;

    const goalsHTML = goals.length > 0 ? `
      <h2>Performance Goals</h2>
      ${goals.map((g: any) => `
        <div style="margin-bottom: 15px;">
          <p><strong>${g.goal}</strong></p>
          <p>Progress: ${g.current} / ${g.target} ${g.unit} - ${formatStatusBadge(g.status, g.status === 'achieved' ? 'success' : g.status === 'on-track' ? 'info' : 'warning')}</p>
        </div>
      `).join('')}
    ` : '';

    const content = `
      ${formatSection('Employee Information', `
        <p><strong>Name:</strong> ${employee.name}</p>
        <p><strong>Role:</strong> ${employee.role}</p>
        <p><strong>Department:</strong> ${employee.departments.join(', ')}</p>
        <p><strong>Review Period:</strong> ${review.quarter} ${review.year}</p>
      `)}

      ${goalsHTML}

      ${formatSection('Outcomes', `
        <ul>
          ${review.outcomes.map((o: string) => `<li>${o}</li>`).join('')}
        </ul>
      `)}

      ${formatSection('Strengths', `
        <ul>
          ${review.strengths.map((s: string) => `<li>${s}</li>`).join('')}
        </ul>
      `)}

      ${formatSection('Growth Areas', `
        <ul>
          ${review.growthAreas.map((g: string) => `<li>${g}</li>`).join('')}
        </ul>
      `)}

      ${formatSection('Client Impact Highlights', `
        <ul>
          ${review.clientImpactHighlights.map((h: string) => `<li>${h}</li>`).join('')}
        </ul>
      `)}

      ${formatSection('Manager Notes', `
        <p style="white-space: pre-wrap;">${review.managerNotes}</p>
      `)}

      ${review.rating ? formatSection('Overall Rating', `
        <p><strong>${review.rating === 'exceeds' ? 'Exceeds Expectations' : review.rating === 'meets' ? 'Meets Expectations' : 'Needs Improvement'}</strong></p>
      `) : ''}
    `;

    printDocument({
      title: `Quarterly Review - ${employee.name}`,
      subtitle: `${review.quarter} ${review.year} Performance Review`,
      content,
      includeTimestamp: true,
      includeBranding: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className={`flex gap-3 p-4 rounded-lg border ${
        isDarkMode 
          ? 'bg-blue-900/20 border-blue-800/50 text-blue-200' 
          : 'bg-blue-50 border-blue-200 text-blue-800'
      }`}>
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">
          Disclaimer: Revere Quarterly Review Insights are intended to <strong>supplement—not replace—</strong>your organization’s formal performance review process. Do not rely on these insights as a substitute for a complete quarterly review, manager feedback, or documented evaluation.
        </div>
      </div>

      {/* Quarter Selector */}
      <div className="flex items-center justify-between">
        <select className={`px-4 py-2 border rounded-lg ${
          isDarkMode
            ? 'bg-slate-800/50 border-white/10 text-white'
            : 'border-gray-300 bg-white text-gray-900'
        }`}>
          <option>Q4 2025</option>
          <option>Q3 2025</option>
          <option>Q2 2025</option>
          <option>Q1 2025</option>
        </select>
        <div className="flex gap-2">
          {!review && (
            <Button variant="primary">
              Start Quarterly Review
            </Button>
          )}
          {review && !isEditing && (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              <Edit size={16} />
              Edit Review
            </Button>
          )}
          {review && (
            <Button variant="secondary" onClick={handleExportPDF}>
              <Download size={16} />
              Export PDF
            </Button>
          )}
        </div>
      </div>

      {!review ? (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          <ClipboardList size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className="mb-4">No quarterly review for Q4 2025</p>
          <Button variant="primary">Start Review</Button>
        </div>
      ) : (
        <>
          {/* Performance Goals */}
          {goals.length > 0 && (
            <section>
              <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                Performance Goals
              </h3>
              <div className="space-y-3">
                {goals.map((goal: any) => (
                  <div key={goal.id} className={`p-4 border rounded-lg ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-white/10' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{goal.goal}</div>
                      <Chip 
                        variant={
                          goal.status === 'achieved' ? 'success' : 
                          goal.status === 'on-track' ? 'info' : 
                          'warning'
                        }
                        size="sm"
                      >
                        {goal.status}
                      </Chip>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                          <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{goal.current} / {goal.target} {goal.unit}</span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-2 rounded-full ${goal.status === 'achieved' ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Review Sections */}
          <section>
            <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              Outcomes
            </h3>
            <ul className="space-y-2">
              {review.outcomes.map((outcome: string, idx: number) => (
                <li key={idx} className={`flex items-start gap-2 p-3 border rounded-lg ${
                  isDarkMode
                    ? 'bg-green-500/10 border-green-400/20'
                    : 'bg-green-50 border-green-200'
                }`}>
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              Strengths
            </h3>
            <ul className="space-y-2">
              {review.strengths.map((strength: string, idx: number) => (
                <li key={idx} className={`p-3 border rounded-lg text-sm ${
                  isDarkMode
                    ? 'bg-blue-500/10 border-blue-400/20 text-gray-300'
                    : 'bg-blue-50 border-blue-200 text-gray-700'
                }`}>
                  {strength}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              Growth Areas
            </h3>
            <ul className="space-y-2">
              {review.growthAreas.map((area: string, idx: number) => (
                <li key={idx} className={`p-3 border rounded-lg text-sm ${
                  isDarkMode
                    ? 'bg-yellow-500/10 border-yellow-400/20 text-gray-300'
                    : 'bg-yellow-50 border-yellow-200 text-gray-700'
                }`}>
                  {area}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              Client Impact Highlights
            </h3>
            <ul className="space-y-2">
              {review.clientImpactHighlights.map((highlight: string, idx: number) => (
                <li key={idx} className={`p-3 border rounded-lg text-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border-white/10 text-gray-300'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}>
                  {highlight}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              Manager Notes
            </h3>
            <div className={`p-4 border rounded-lg ${
              isDarkMode
                ? 'bg-slate-800/50 border-white/10'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <p className={`text-sm whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{review.managerNotes}</p>
            </div>
          </section>

          {review.rating && (
            <section>
              <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                Overall Rating
              </h3>
              <Chip 
                variant={
                  review.rating === 'exceeds' ? 'success' : 
                  review.rating === 'meets' ? 'info' : 
                  'warning'
                }
              >
                {review.rating === 'exceeds' ? 'Exceeds Expectations' : review.rating === 'meets' ? 'Meets Expectations' : 'Needs Improvement'}
              </Chip>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function PythiaInsightsTab({ employee, insights, isDarkMode }: any) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="space-y-4">
      <div className={`border rounded-lg p-4 mb-6 ${
        isDarkMode
          ? 'bg-purple-500/10 border-purple-400/20'
          : 'bg-purple-50 border-purple-200'
      }`}>
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="text-purple-500 mt-0.5" />
          <div>
            <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-900'}`}>About Revere Insights</h4>
            <p className={`text-sm ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>
              These insights are generated from system activity: tasks, deliverables, deadlines, and engagement logs. 
              All recommendations are explainable and based on observable data.
            </p>
          </div>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          <Sparkles size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p>No insights available</p>
          <p className="text-xs mt-1">System is gathering performance data</p>
        </div>
      ) : (
        insights.map((insight: any) => (
          <div key={insight.id} className={`border-2 rounded-lg p-5 ${
            isDarkMode
              ? 'bg-slate-800/50 border-white/10'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{insight.title}</h4>
                  <Chip variant={getSeverityColor(insight.severity)} size="sm">
                    {insight.severity}
                  </Chip>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{insight.summary}</p>
              </div>
            </div>

            {/* Evidence */}
            <details className="mb-4">
              <summary className={`text-sm font-medium cursor-pointer ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}>
                Why? (View evidence)
              </summary>
              <ul className="mt-2 space-y-1 ml-4 list-disc list-inside">
                {insight.evidence.map((ev: string, idx: number) => (
                  <li key={idx} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{ev}</li>
                ))}
              </ul>
            </details>

            {/* Recommendations */}
            <div>
              <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recommended Actions:</div>
              <div className="flex flex-wrap gap-2">
                {insight.recommendations.map((rec: any, idx: number) => (
                  <button
                    key={idx}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    onClick={() => console.log('Action:', rec.actionType)}
                  >
                    {rec.buttonLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Modal Components
function EditDeliverableModal({ deliverable, onClose, onSave }: any) {
  const [formData, setFormData] = React.useState({
    title: deliverable.title,
    dueDate: deliverable.dueDate.split('T')[0],
    status: deliverable.status,
    notes: ''
  });

  const handleSave = () => {
    onSave({ ...deliverable, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Edit Deliverable</h3>
            <p className="text-sm text-gray-600 mt-1">Update details for this deliverable</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
              {deliverable.clientName}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="in-review">In Review</option>
              <option value="final">Final</option>
              <option value="sent">Sent</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Add any notes about this update..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Pythia suggestion if applicable */}
          {formData.status !== deliverable.status && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Sparkles size={16} className="text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900 mb-1">Pythia suggests:</p>
                  <p className="text-xs text-purple-700">
                    {formData.status === 'in-review' ? 'Notify collaborators about review status' : 
                     formData.status === 'final' ? 'Create record in institutional memory' :
                     formData.status === 'sent' ? 'Log client touchpoint and schedule follow-up' :
                     'Update project timeline'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReassignModal({ deliverable, currentUser, onClose, onReassign }: any) {
  const [selectedUserId, setSelectedUserId] = React.useState<string>('');
  const [reason, setReason] = React.useState('');
  const [keepAsCollaborator, setKeepAsCollaborator] = React.useState(true);

  const availableUsers = mockTeamMembers.filter(m => m.id !== currentUser.id);

  const handleReassign = () => {
    if (!selectedUserId || !reason) {
      alert('Please select a team member and provide a reason');
      return;
    }
    onReassign(selectedUserId, reason);
  };

  const selectedUser = availableUsers.find(u => u.id === selectedUserId);

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Reassign Deliverable</h3>
            <p className="text-sm text-gray-600 mt-1">{deliverable.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Current Assignment */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-xs font-medium text-gray-500 mb-2">Currently Assigned To</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {currentUser.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <div className="font-medium text-gray-900">{currentUser.name}</div>
                <div className="text-sm text-gray-600">{currentUser.role}</div>
              </div>
            </div>
          </div>

          {/* Select New Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Reassign To
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`w-full p-3 border-2 rounded-lg transition-all text-left ${
                    selectedUserId === user.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600 truncate">{user.role}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <Chip 
                        variant={
                          user.workloadScore >= 80 ? 'danger' :
                          user.workloadScore >= 60 ? 'success' :
                          'warning'
                        }
                        size="sm"
                      >
                        {user.workloadScore}% load
                      </Chip>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pythia Recommendation */}
          {selectedUser && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles size={20} className="text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900 mb-1">Pythia Analysis</p>
                  <p className="text-xs text-purple-700">
                    {selectedUser.workloadScore >= 80 ? (
                      <>⚠️ {selectedUser.name} is currently overloaded ({selectedUser.workloadScore}% capacity). Consider adjusting their workload first.</>
                    ) : selectedUser.workloadScore < 50 ? (
                      <>✓ Good choice - {selectedUser.name} has capacity ({selectedUser.workloadScore}% load) and relevant expertise.</>
                    ) : (
                      <>✓ {selectedUser.name} has moderate capacity ({selectedUser.workloadScore}% load) and can handle this deliverable.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Reassignment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g., Workload rebalancing, subject matter expertise, capacity constraints..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Keep as Collaborator */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="keep-collaborator"
              checked={keepAsCollaborator}
              onChange={(e) => setKeepAsCollaborator(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="keep-collaborator" className="text-sm text-gray-700">
              Keep {currentUser.name.split(' ')[0]} as a collaborator on this deliverable
            </label>
          </div>

          {/* Warning if overloaded */}
          {selectedUser && selectedUser.workloadScore >= 80 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                <p className="text-xs text-red-700">
                  <strong>Warning:</strong> This will add work to an already overloaded team member. Consider workload rebalancing.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleReassign}
            disabled={!selectedUserId || !reason}
          >
            Reassign Deliverable
          </Button>
        </div>
      </div>
    </div>
  );
}

function ViewRecordModal({ deliverable, onClose }: any) {
  // Mock record data based on the deliverable
  const record = {
    id: deliverable.recordId,
    title: deliverable.title,
    type: 'Hearing Prep',
    version: '1.2',
    createdAt: '2025-12-17T14:30:00Z',
    createdBy: 'Jordan Davis',
    lastModified: '2025-12-17T16:45:00Z',
    status: 'Final',
    client: deliverable.clientName,
    relatedBills: ['HB 2847 - Clean Energy Act'],
    tags: ['hearing-prep', 'energy', 'committee', 'house'],
    summary: 'Comprehensive preparation packet for HB 2847 committee hearing including talking points, legislator profiles, opposition analysis, and strategic recommendations.',
    sections: [
      { name: 'Executive Summary', pages: '1-2' },
      { name: 'Bill Overview & Analysis', pages: '3-5' },
      { name: 'Committee Member Profiles', pages: '6-12' },
      { name: 'Strategic Talking Points', pages: '13-16' },
      { name: 'Opposition Analysis', pages: '17-19' },
      { name: 'Q&A Preparation', pages: '20-23' },
      { name: 'Recommendations', pages: '24-25' }
    ],
    accessLog: [
      { user: 'Jordan Davis', action: 'Created', timestamp: '2025-12-17T14:30:00Z' },
      { user: 'Matt Kenny', action: 'Reviewed', timestamp: '2025-12-17T15:15:00Z' },
      { user: 'Jordan Davis', action: 'Finalized', timestamp: '2025-12-17T16:45:00Z' }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Record Details</h3>
            <p className="text-sm text-gray-600 mt-1">Institutional Memory • {record.type}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Metadata */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{record.title}</h4>
                <div className="flex items-center gap-3 flex-wrap">
                  <Chip variant="info" size="sm">v{record.version}</Chip>
                  <Chip variant="success" size="sm">{record.status}</Chip>
                  <span className="text-sm text-gray-600">{record.client}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Created</div>
                <div className="text-sm text-gray-900">{new Date(record.createdAt).toLocaleString()}</div>
                <div className="text-xs text-gray-600">by {record.createdBy}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Last Modified</div>
                <div className="text-sm text-gray-900">{new Date(record.lastModified).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Summary</h5>
            <p className="text-sm text-gray-700">{record.summary}</p>
          </div>

          {/* Related Bills */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Related Bills</h5>
            <div className="flex flex-wrap gap-2">
              {record.relatedBills.map((bill, idx) => (
                <div key={idx} className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                  {bill}
                </div>
              ))}
            </div>
          </div>

          {/* Document Structure */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Document Structure</h5>
            <div className="space-y-2">
              {record.sections.map((section, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{section.name}</span>
                  <span className="text-xs text-gray-600">Pages {section.pages}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Tags</h5>
            <div className="flex flex-wrap gap-2">
              {record.tags.map((tag, idx) => (
                <Chip key={idx} variant="neutral" size="sm">
                  {tag}
                </Chip>
              ))}
            </div>
          </div>

          {/* Access Log */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Access & Version History</h5>
            <div className="space-y-2">
              {record.accessLog.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {log.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.user}</div>
                      <div className="text-xs text-gray-600">{log.action}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <Button variant="secondary" onClick={() => window.open('/records', '_blank')}>
            <FileText size={16} />
            Open in Records
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary">
              <Download size={16} />
              Download
            </Button>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}