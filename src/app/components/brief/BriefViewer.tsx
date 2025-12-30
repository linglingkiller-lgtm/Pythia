import React, { useState } from 'react';
import { X, Download, Share2, Copy, CheckCircle, Sparkles, User, Building } from 'lucide-react';
import { Brief } from '../../data/briefData';
import { useTheme } from '../../contexts/ThemeContext';
import { copyToClipboard } from '../../utils/clipboard';

interface BriefViewerProps {
  briefData: Brief;
  onClose: () => void;
}

export function BriefViewer({ briefData, onClose }: BriefViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedQA, setExpandedQA] = useState<number | null>(0);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return 'TBD';
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleSaveToRecords = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
  };

  const qaItems = [
    {
      question: 'Will this raise utility rates?',
      answer: `${briefData.billId} is designed to reduce friction and uncertainty—those hidden administrative costs show up somewhere. It also adds consumer protections that prevent market abuses.`,
    },
    {
      question: "Does this weaken utilities' ability to manage the grid?",
      answer: `No—${briefData.billId} explicitly ties solar growth to grid planning and reliability. The goal is coordination, not surprise.`,
    },
    {
      question: 'Is this a mandate?',
      answer: `${briefData.billId} doesn't force anyone to install solar. It modernizes the rules for people who choose it and protects consumers.`,
    },
    {
      question: 'Why now?',
      answer: 'The current system is inconsistent and unpredictable. This bill lowers conflict and creates clear, enforceable expectations.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-hidden">
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top">
          <Save size={16} />
          <span>Saved to Records ✓ <button className="underline ml-2">View record</button></span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              <X size={20} />
              Back
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="text-sm text-gray-500">
              Bills &gt; {briefData.billId} &gt; Briefs &gt; <span className="text-gray-900">Meeting Brief</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 border rounded text-sm transition-colors flex items-center gap-2 ${
                isEditing
                  ? 'border-red-600 bg-red-50 text-red-900'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Edit3 size={14} />
              {isEditing ? 'Editing' : 'Edit'}
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download size={14} />
              Export PDF
            </button>
            <button
              onClick={handleSaveToRecords}
              className="px-4 py-2 bg-red-900 text-white rounded text-sm hover:bg-red-800 transition-colors flex items-center gap-2"
            >
              <Save size={14} />
              Save to Records
            </button>
            <button className="p-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-gray-900">{briefData.meetingTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">Generated 2 minutes ago</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Column: The Brief */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 1. Executive Summary */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Executive Summary</h2>
                <button
                  onClick={() => handleCopy('Executive Summary content')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div
                className={`space-y-4 ${isEditing ? 'border-2 border-dashed border-blue-300 p-3 rounded' : ''}`}
              >
                <p className="text-sm text-gray-700">
                  Align Rep. Ramirez's office on {briefData.billId}'s provisions, address concerns
                  about implementation and impacts, and request support (or targeted amendment
                  support if needed).
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p className="text-sm font-semibold text-amber-900">
                    Primary Ask: Secure Rep. Ramirez's support for {briefData.billId}.
                  </p>
                </div>
              </div>
            </Card>

            {/* 2. Meeting Objectives */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Meeting Objectives</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>
                    <strong>Must-have:</strong> Secure a clear position from the office (Support /
                    Lean support / Needs changes / Oppose)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>
                    <strong>Nice-to-have:</strong> Identify the staffer who owns this policy area for
                    follow-ups
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>
                    <strong>Nice-to-have:</strong> Establish next touchpoint before the committee
                    hearing
                  </span>
                </li>
              </ul>
            </Card>

            {/* 3. Bill Snapshot */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Bill Snapshot: {briefData.billId}
                </h2>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Copy size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <Chip variant="monitor" size="sm">
                    Assigned to Committee
                  </Chip>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Next Action</div>
                  <div className="text-sm font-medium text-red-600">Hearing Feb 7</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Sponsor</div>
                  <div className="text-sm text-gray-900">Rep. Johnson</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Committees</div>
                  <div className="text-sm text-gray-900">Energy & Env, Commerce</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">What it does</div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">1.</span>
                    Standardizes timelines and requirements for clarity
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">2.</span>
                    Adds consumer protections and transparency requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">3.</span>
                    Requires coordination with grid planning for reliability
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">4.</span>
                    Phased implementation to reduce operational shock
                  </li>
                </ul>
              </div>
            </Card>

            {/* 4. Legislator Snapshot */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Legislator Snapshot</h2>
              <div className="flex items-start gap-4 bg-gradient-to-r from-red-50 to-blue-50 p-4 rounded mb-4">
                <img
                  src="https://images.unsplash.com/photo-1580643375398-5174902ebcec?w=400"
                  alt="Rep. Jordan Ramirez"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Rep. Jordan Ramirez</h3>
                  <p className="text-sm text-gray-600">State Representative • LD-12</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Chip variant="neutral" size="sm">
                      Energy & Env
                    </Chip>
                    <Chip variant="neutral" size="sm">
                      Commerce
                    </Chip>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Last Interaction</div>
                  <div className="text-gray-900">Oct 27 (hallway)</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Birthday</div>
                  <div className="text-gray-900">May 14</div>
                </div>
              </div>
            </Card>

            {/* 5. Talking Points */}
            {briefData.includeTalkingPoints && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Talking Points</h2>
                  <button
                    onClick={() => handleCopy('Talking points content')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <div
                  className={`space-y-4 ${isEditing ? 'border-2 border-dashed border-blue-300 p-3 rounded' : ''}`}
                >
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 bg-red-100 px-3 py-2 rounded">
                      Opening (30 seconds)
                    </h4>
                    <div className="bg-gray-50 border-l-4 border-red-600 p-3 rounded">
                      <p className="text-sm text-gray-900 italic">
                        "Rep. Ramirez, thanks for meeting. We're here because {briefData.billId}{' '}
                        creates practical, reliable guardrails—clear rules, stronger protections,
                        and better planning. We'd love to understand what you need to feel
                        comfortable supporting it."
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 bg-amber-100 px-3 py-2 rounded">
                      Core Points (pick 3)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Copy size={14} className="text-gray-400 mt-0.5 cursor-pointer hover:text-gray-600" />
                        <span>
                          {briefData.billId} reduces uncertainty and administrative friction
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Copy size={14} className="text-gray-400 mt-0.5 cursor-pointer hover:text-gray-600" />
                        <span>{briefData.billId} strengthens consumer protection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Copy size={14} className="text-gray-400 mt-0.5 cursor-pointer hover:text-gray-600" />
                        <span>{briefData.billId} respects operational reliability</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 bg-emerald-100 px-3 py-2 rounded flex items-center gap-2">
                      <span className="text-emerald-700">✓</span> Close/Ask
                    </h4>
                    <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded">
                      <p className="text-sm text-gray-900 italic">
                        "Will you support {briefData.billId} in committee?"
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 6. Anticipated Q&A */}
            {briefData.includeQA && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Anticipated Questions (Q&A)
                  </h2>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Copy size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {qaItems.map((qa, index) => (
                    <div key={index} className="border border-gray-200 rounded overflow-hidden">
                      <button
                        onClick={() => setExpandedQA(expandedQA === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-900 text-left">{qa.question}</span>
                        {expandedQA === index ? (
                          <ChevronUp size={16} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-500" />
                        )}
                      </button>
                      {expandedQA === index && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <p className="text-sm text-gray-700">{qa.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 7. Follow-up Tasks */}
            {briefData.includeFollowUpTasks && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Tasks</h2>
                <div className="space-y-3">
                  {[
                    { task: 'Email staff one-page leave-behind', due: 'Due 2/5 (next day)' },
                    { task: 'Schedule follow-up call with Energy LA', due: 'Due 2/9' },
                    { task: 'Log meeting notes + tag bill', due: 'Due 2/4 (same day)' },
                  ].map((item, index) => (
                    <label
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{item.task}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.due}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column: Context Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6 sticky top-6">
            {/* Meeting Details */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Meeting Details</h4>
                <button className="text-xs text-red-600 hover:text-red-700">Edit</button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-gray-700">
                  <Calendar size={14} className="text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{formatDateTime(briefData.dateTime)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin size={14} className="text-gray-500 mt-0.5" />
                  <div>{briefData.location}</div>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <Users size={14} className="text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Attendees</div>
                    {briefData.attendees.split(',').map((attendee, i) => (
                      <div key={i} className="text-gray-900">
                        {attendee.trim()}
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Plus size={14} />
                  Add Attendee
                </button>
              </div>
            </Card>

            {/* Key Risks */}
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-red-900 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Key Risks
                </h4>
                <button className="text-red-600 hover:text-red-700">
                  <MoreVertical size={14} />
                </button>
              </div>
              <ul className="space-y-2 text-sm text-gray-900">
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  Utility pushback
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>
                    Grid reliability <span className="w-2 h-2 bg-red-500 rounded-full inline-block ml-1"></span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  Mandate vs. Choice
                </li>
              </ul>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={14} />
                </button>
              </div>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-cyan-500 text-white rounded text-sm hover:bg-cyan-600 transition-colors">
                  Log Interaction
                </button>
                <button className="w-full px-3 py-2 border border-cyan-500 text-cyan-700 rounded text-sm hover:bg-cyan-50 transition-colors">
                  Add Task
                </button>
              </div>
            </Card>

            {/* Sources */}
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Sources</h4>
              <div className="space-y-2 text-sm">
                {['Bill Text', 'Committee Agenda', 'Press Release'].map((source, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <FileText size={14} className="text-gray-500" />
                    <span>{source}</span>
                    <ExternalLink size={12} className="ml-auto" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}