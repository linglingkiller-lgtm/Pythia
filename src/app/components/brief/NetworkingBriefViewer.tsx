import React from 'react';
import {
  FileText,
  Download,
  Share2,
  Save,
  ChevronLeft,
  Edit3,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Target,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  Calendar,
  TrendingUp,
  Sparkles,
  Building,
  Eye,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { CalendarEvent } from '../calendar/CalendarPage';
import { useTheme } from '../../contexts/ThemeContext';

interface NetworkingBriefViewerProps {
  event: CalendarEvent;
  onClose: () => void;
}

export function NetworkingBriefViewer({ event, onClose }: NetworkingBriefViewerProps) {
  const { isDarkMode } = useTheme();
  const [activeSection, setActiveSection] = React.useState<string>('executive');

  const formatDateTime = () => {
    return event.date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const generatedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-100'
    }`}>
      {/* Top Header */}
      <div className={`border-b px-6 py-4 ${
        isDarkMode
          ? 'bg-slate-800/95 backdrop-blur-xl border-white/10'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onClose}
            className={`flex items-center gap-2 text-sm transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ChevronLeft size={18} />
            Back to Calendar
          </button>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <Edit3 size={14} />
              Edit
            </Button>
            <Button variant="secondary" size="sm">
              <Download size={14} />
              Export PDF
            </Button>
            <Button variant="accent" size="sm">
              <Save size={14} />
              Save to Records
            </Button>
          </div>
        </div>
        <div>
          <h1 className={`text-2xl mb-1 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Brief — {event.title}</h1>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Networking Brief • Prepared for: Will Deiley • Generated: {generatedDate}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-[calc(100vh-120px)] overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Brief Sections */}
            <div className="col-span-8 space-y-6">
              {/* Section 1: Executive Summary */}
              <Card className="p-6">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Target size={20} className="text-red-600" />
                  1. Executive Summary
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Purpose
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Attend the Clean Energy Town Hall to build relationships with district energy
                      stakeholders, test messaging around solar/grid reliability, and identify opportunities
                      to advance HB90 and related clean energy priorities.
                    </p>
                  </div>

                  <div>
                    <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Primary Outcome Target
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Leave with one staff follow-up, one coalition contact, and one insight into the
                      room's dominant narrative (rate impact vs reliability vs jobs).
                    </p>
                  </div>

                  <div className={`p-4 border-l-4 border-red-600 rounded-lg ${
                    isDarkMode ? 'bg-red-500/10' : 'bg-red-50'
                  }`}>
                    <div className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-red-400' : 'text-red-900'
                    }`}>Primary Ask</div>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-red-300' : 'text-red-900'
                    }`}>
                      "Can we schedule a short follow-up with your office to walk through reliability
                      and consumer protection guardrails in HB90?"
                    </p>
                  </div>
                </div>
              </Card>

              {/* Section 2: Event Objectives */}
              <Card className="p-6">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <CheckCircle size={20} className="text-red-600" />
                  2. Event Objectives
                </h2>

                <div className="space-y-3">
                  {[
                    "Introduce yourself to Rep. Ramirez's staff and confirm who owns energy/utility policy.",
                    'Identify 1–2 supportive local stakeholders to partner with (installers, business groups, civic orgs).',
                    'Collect intelligence on the strongest opposition narrative (e.g., "cost shift," "grid instability") and which messengers are driving it.',
                  ].map((objective, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
                        isDarkMode
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {i + 1}
                      </div>
                      <p className={`text-sm flex-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{objective}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Section 3: Event Snapshot */}
              <Card className="p-6">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Eye size={20} className="text-red-600" />
                  3. Event Snapshot
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Event</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>{event.title}</div>
                  </div>
                  <div>
                    <div className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Host</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>{event.host || 'N/A'}</div>
                  </div>
                  <div>
                    <div className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Format</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>Panel Q&A + open networking</div>
                  </div>
                  <div>
                    <div className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Audience</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      Constituents, local business owners, city staff, advocacy groups
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className={`text-xs font-medium mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Likely Discussion Themes</div>
                  <div className="flex flex-wrap gap-2">
                    {['Solar adoption', 'Grid reliability', 'Utility rates', 'Permitting delays'].map(
                      (theme) => (
                        <Chip key={theme} variant="info" size="sm">
                          {theme}
                        </Chip>
                      )
                    )}
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                  <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>
                    Suggested Positioning
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    Non-ideological, solutions-forward: 'clarity + consumer protection + reliability.'
                  </p>
                </div>
              </Card>

              {/* Section 4: Relevant Legislation */}
              <Card className="p-6">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <FileText size={20} className="text-red-600" />
                  4. Relevant Legislation (Quick View)
                </h2>

                <div className="space-y-4">
                  {/* HB90 */}
                  <div className={`border rounded-lg p-4 ${
                    isDarkMode ? 'border-white/10' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className={`font-semibold mb-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          HB90 — Solar Modernization
                        </div>
                        <Chip variant="monitor" size="sm">
                          Tracked
                        </Chip>
                      </div>
                      <Chip variant="warning" size="sm">
                        Introduced
                      </Chip>
                    </div>
                    <div className={`space-y-2 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div>
                        <strong>Why it matters:</strong> Sets predictable solar rules and strengthens
                        consumer transparency.
                      </div>
                      <div className={isDarkMode ? 'text-red-400' : 'text-red-600'}>
                        <strong>Risk narrative:</strong> Opponents may frame it as raising rates or
                        weakening utility control.
                      </div>
                    </div>
                  </div>

                  {/* HB1234 */}
                  <div className={`border rounded-lg p-4 ${
                    isDarkMode ? 'border-white/10' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className={`font-semibold mb-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          HB1234 — Clean Air Modernization
                        </div>
                        <Chip variant="neutral" size="sm">
                          Secondary
                        </Chip>
                      </div>
                      <Chip variant="info" size="sm">
                        Committee Scheduled
                      </Chip>
                    </div>
                    <div className={`space-y-2 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div>
                        <strong>Why it matters:</strong> Provides modernization hooks; can be referenced
                        as broader policy context.
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-amber-400' : 'text-amber-900'
                    }`}>
                      <Lightbulb size={14} className="inline mr-1" />
                      Quick Action Note
                    </div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-amber-300' : 'text-amber-800'
                    }`}>
                      Don't over-legislate the conversation. Use bills as anchors, not rabbit holes.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Section 5: Key People to Identify */}
              <Card className="p-6">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Users size={20} className="text-red-600" />
                  5. Key People to Identify
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className={`text-xs font-medium mb-2 flex items-center gap-1 ${
                      isDarkMode ? 'text-green-400' : 'text-green-700'
                    }`}>
                      <Target size={12} />
                      Priority Targets (try to meet)
                    </div>
                    <div className="space-y-2">
                      {[
                        'Rep. Jordan Ramirez (LD-12) — or Chief of Staff / Energy LA',
                        'Sen. Priya Shah (LD-10) — policy aide',
                        'East Valley Clean Energy Coalition director (host contact)',
                      ].map((person, i) => (
                        <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${
                          isDarkMode ? 'bg-green-500/10' : 'bg-green-50'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            isDarkMode ? 'bg-green-400' : 'bg-green-600'
                          }`}></div>
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>{person}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className={`text-xs font-medium mb-2 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-700'
                    }`}>Secondary Targets</div>
                    <div className="space-y-2">
                      {[
                        'Local chamber representative',
                        'City sustainability staffer',
                        'Utility/community relations rep (if present)',
                      ].map((person, i) => (
                        <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${
                          isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'
                        }`}>
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>{person}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 border rounded-lg ${
                    isDarkMode
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-purple-50 border-purple-200'
                  }`}>
                    <div className={`text-xs font-medium mb-2 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-900'
                    }`}>
                      Conversation Opener Lines
                    </div>
                    <div className="space-y-1.5">
                      {[
                        '"What\'s the biggest concern you\'re hearing on solar right now—rates or reliability?"',
                        '"If HB90 included stronger reliability language, would that change the temperature in the room?"',
                        '"Who should we talk to if we want to sanity-check bill language before committee?"',
                      ].map((line, i) => (
                        <div key={i} className={`text-sm ${
                          isDarkMode ? 'text-purple-300' : 'text-purple-800'
                        }`}>
                          • {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Section 6: Talking Points */}
              <Card className="p-6">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <MessageSquare size={20} className="text-red-600" />
                  6. Talking Points (Networking-friendly)
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      title: '1) Keep it practical',
                      text: '"Everyone wants reliability and affordability. The question is how we set clear rules so solar growth doesn\'t become chaos."',
                    },
                    {
                      title: '2) Consumer protection angle',
                      text: '"Good guardrails protect consumers and keep bad actors from poisoning the market."',
                    },
                    {
                      title: '3) Reliability reassurance',
                      text: '"Nothing here is about weakening the grid—planning and clarity reduce surprise and conflict."',
                    },
                    {
                      title: '4) Local benefits',
                      text: '"Predictable policy helps local jobs and small business stability."',
                    },
                  ].map((point, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${
                      isDarkMode
                        ? 'bg-slate-700/30 border-white/10'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{point.title}</div>
                      <p className={`text-sm italic ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{point.text}</p>
                    </div>
                  ))}

                  <div className={`p-4 border-l-4 border-red-600 rounded-lg mt-4 ${
                    isDarkMode ? 'bg-red-500/10' : 'bg-red-50'
                  }`}>
                    <div className={`text-xs font-medium mb-2 ${
                      isDarkMode ? 'text-red-400' : 'text-red-900'
                    }`}>Close / Ask</div>
                    <p className={`text-sm italic ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                      Could I send you a one-page summary and get 15 minutes next week to walk through the reliability provisions?
                    </p>
                  </div>
                </div>
              </Card>

              {/* Section 7: Anticipated Questions */}
              <Card className="p-6">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <MessageSquare size={20} className="text-red-600" />
                  7. Anticipated Questions & Replies
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      q: "Isn't solar shifting costs to non-solar customers?",
                      a: "That's the concern people cite, and it's exactly why policy needs clear guardrails and transparency. The goal is predictable rules and consumer protections—so the market behaves and the grid stays stable.",
                    },
                    {
                      q: "Won't this make the grid less reliable?",
                      a: 'Modernization is about coordination and planning, not surprise. Reliability is a feature, not an afterthought.',
                    },
                    {
                      q: 'Why are you involved?',
                      a: "I'm tracking energy policy and working with stakeholders who want reliable, clear, consumer-friendly rules.",
                    },
                  ].map((qa, i) => (
                    <div key={i} className={`border rounded-lg overflow-hidden ${
                      isDarkMode ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <div className={`p-4 border-b ${
                        isDarkMode
                          ? 'bg-amber-500/10 border-white/10'
                          : 'bg-amber-50 border-gray-200'
                      }`}>
                        <div className={`text-xs font-medium mb-1 ${
                          isDarkMode ? 'text-amber-400' : 'text-amber-900'
                        }`}>Q:</div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-amber-300' : 'text-amber-900'
                        }`}>{qa.q}</div>
                      </div>
                      <div className="p-4">
                        <div className={`text-xs font-medium mb-1 ${
                          isDarkMode ? 'text-green-400' : 'text-green-700'
                        }`}>A:</div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>{qa.a}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Section 8: Intel to Capture */}
              <Card className="p-6">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Eye size={20} className="text-red-600" />
                  8. "Intel to Capture" Checklist
                </h2>

                <div className="space-y-2">
                  {[
                    'Which narrative dominates: rate impact / reliability / jobs / ideology',
                    'Who gets applauded (which messengers are persuasive)',
                    'Any mention of HB90 or similar bills',
                    'Specific concerns repeated by multiple attendees',
                    'Names + orgs of attendees worth following up with',
                  ].map((item, i) => (
                    <label key={i} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ${
                      isDarkMode
                        ? 'hover:bg-slate-700/30'
                        : 'hover:bg-gray-50'
                    }`}>
                      <input type="checkbox" className="mt-1 rounded" />
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{item}</span>
                    </label>
                  ))}
                </div>
              </Card>

              {/* Section 9: Follow-Up Tasks */}
              <Card className="p-6">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <CheckCircle size={20} className="text-red-600" />
                  9. Follow-Up Tasks
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      task: 'Create record: "Town Hall Notes" tagged Energy + HB90',
                      priority: 'High',
                      due: 'Same day',
                    },
                    {
                      task: 'Email Rep. Ramirez staff: 1-page summary + request follow-up',
                      priority: 'High',
                      due: 'Next day',
                    },
                    {
                      task: 'Add 2 new contacts to People CRM',
                      priority: 'Medium',
                      due: 'Next day',
                    },
                    {
                      task: 'Draft "reliability-first" talking points variant for HB90 brief',
                      priority: 'Medium',
                      due: 'Within 3 days',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-4 border rounded-lg transition-colors ${
                        isDarkMode
                          ? 'border-white/10 hover:border-red-500/50'
                          : 'border-gray-200 hover:border-red-500'
                      }`}
                    >
                      <input type="checkbox" className="mt-1 rounded" />
                      <div className="flex-1">
                        <div className={`text-sm mb-1 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>{item.task}</div>
                        <div className="flex items-center gap-2">
                          <Chip
                            variant={item.priority === 'High' ? 'alert' : 'warning'}
                            size="sm"
                          >
                            {item.priority}
                          </Chip>
                          <span className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>Due: {item.due}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Sidebar: Sticky */}
            <div className="col-span-4">
              <div className="sticky top-6 space-y-4">
                {/* Event Details Card */}
                <Card className="p-4">
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Calendar size={16} className="text-red-600" />
                    Event Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className={`text-xs mb-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Date & Time</div>
                      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{formatDateTime()}</div>
                      <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{event.time}</div>
                    </div>
                    <div>
                      <div className={`text-xs mb-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Location</div>
                      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{event.location}</div>
                    </div>
                    <div>
                      <div className={`text-xs mb-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Host</div>
                      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{event.host || 'N/A'}</div>
                    </div>
                    <div>
                      <div className={`text-xs mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Attendees</div>
                      <div className="flex flex-wrap gap-2">
                        {event.linkedObjects.people?.map((person) => (
                          <Chip key={person} variant="neutral" size="sm">
                            {person}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`mt-3 pt-3 border-t space-y-2 ${
                    isDarkMode ? 'border-white/10' : 'border-gray-200'
                  }`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      <Users size={14} />
                      Add Attendee
                    </Button>
                    <Button variant="secondary" size="sm" className="w-full">
                      <Edit3 size={14} />
                      Add Note
                    </Button>
                  </div>
                </Card>

                {/* Key Risks Card */}
                <Card className="p-4">
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <AlertTriangle size={16} className="text-amber-600" />
                    Key Risks
                  </h3>
                  <div className="space-y-2">
                    {[
                      'Utility cost-shift framing may dominate Q&A',
                      'Panel may drift into ideological framing—keep responses practical',
                      'Avoid committing to specific bill language on the spot; offer follow-up',
                    ].map((risk, i) => (
                      <div key={i} className={`flex items-start gap-2 p-2 rounded-lg ${
                        isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'
                      }`}>
                        <div className={`w-1 h-1 rounded-full mt-2 ${
                          isDarkMode ? 'bg-amber-400' : 'bg-amber-600'
                        }`}></div>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-amber-300' : 'text-amber-900'
                        }`}>{risk}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions Card */}
                <Card className="p-4">
                  <h3 className={`font-semibold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="secondary" size="sm" className="w-full">
                      <FileText size={14} />
                      Log Interaction
                    </Button>
                    <Button variant="accent" size="sm" className="w-full">
                      <Save size={14} />
                      Save to Records
                    </Button>
                    <Button variant="secondary" size="sm" className="w-full">
                      <CheckCircle size={14} />
                      Create Follow-up Tasks
                    </Button>
                  </div>
                </Card>

                {/* Sources Card */}
                <Card className="p-4">
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <TrendingUp size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                    Sources
                  </h3>
                  <div className="space-y-2 text-xs">
                    {[
                      'Event listing (public)',
                      'HB90 bill text',
                      'Coalition site',
                      'Internal notes',
                    ].map((source, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          isDarkMode
                            ? 'bg-slate-700/30 hover:bg-slate-700/50'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isDarkMode ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}>{source}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}