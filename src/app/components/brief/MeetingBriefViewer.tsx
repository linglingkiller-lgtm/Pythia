import React from 'react';
import {
  FileText,
  Download,
  Share2,
  Save,
  ListChecks,
  ChevronLeft,
  Edit3,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Target,
  MessageSquare,
  Lightbulb,
  Award,
  TrendingUp,
  CheckCircle,
  Calendar,
  Mail,
  Phone,
  Cake,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { BriefFormData } from './GenerateBriefModal';

interface MeetingBriefViewerProps {
  briefData: BriefFormData;
  onClose: () => void;
}

export function MeetingBriefViewer({ briefData, onClose }: MeetingBriefViewerProps) {
  const [activeSection, setActiveSection] = React.useState<string>('executive');

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

  // Parse attendees string into team arrays
  const parseAttendees = (attendeesStr: string) => {
    const attendeesList = attendeesStr.split(',').map(a => a.trim());
    // Simple heuristic: names with "Rep." or titles go to legislator side
    const yourTeam = attendeesList.filter(a => !a.includes('Rep.') && !a.toLowerCase().includes('chief of staff'));
    const legislatorOffice = attendeesList.filter(a => a.includes('Rep.') || a.toLowerCase().includes('chief of staff') || a.toLowerCase().includes('staff'));
    
    return {
      yourTeam: yourTeam.length > 0 ? yourTeam : ['Your Team'],
      legislatorOffice: legislatorOffice.length > 0 ? legislatorOffice : ['Legislator Office']
    };
  };

  const attendees = parseAttendees(briefData.attendees || '');

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-hidden">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              Back to Dashboard
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Meeting Brief — HB90 (Solar)
              </h1>
              <p className="text-sm text-gray-500">
                Generated {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Edit3 size={14} />
              Edit
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download size={14} />
              Export PDF
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Share2 size={14} />
              Share
            </button>
            <button className="px-3 py-2 bg-red-900 text-white rounded text-sm hover:bg-red-800 flex items-center gap-2">
              <Save size={14} />
              Save to Records
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <ListChecks size={14} />
              Create Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left: Brief Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Information */}
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Meeting Type</div>
                  <div className="text-sm font-medium text-gray-900">{briefData.meetingType}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Date & Time</div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    {formatDateTime(briefData.dateTime)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Location</div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <MapPin size={14} className="text-gray-500" />
                    {briefData.location}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Confidentiality</div>
                  <div className="text-sm font-medium text-red-600">Internal Use Only</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Your Team</div>
                  <div className="flex flex-wrap gap-2">
                    {attendees.yourTeam.map((member, i) => (
                      <Chip key={i} variant="neutral" size="sm">
                        {member}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Legislator Office</div>
                  <div className="flex flex-wrap gap-2">
                    {attendees.legislatorOffice.map((member, i) => (
                      <Chip key={i} variant="neutral" size="sm">
                        {member}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 1. Executive Summary */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target size={20} className="text-red-600" />
                1. Executive Summary
              </h2>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Purpose</h4>
                  <p className="text-sm text-gray-900">
                    Align Rep. Ramirez's office on HB90's solar provisions, address concerns about
                    grid reliability + consumer costs, and request support (or targeted amendment
                    support if needed).
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    The 30-second version of HB90
                  </h4>
                  <p className="text-sm text-gray-900">
                    HB90 modernizes Arizona's solar policy by expanding interconnection clarity,
                    setting updated consumer protections, and creating a predictable framework for
                    distributed solar deployment while protecting grid stability.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded p-4">
                  <h4 className="text-sm font-semibold text-emerald-900 mb-2">
                    Today's Recommended Outcome
                  </h4>
                  <div className="space-y-2 text-sm text-gray-900">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-emerald-700">Primary ask:</span>
                      <span>
                        Rep. Ramirez to support HB90 in committee (or agree to co-sponsor if
                        politically feasible).
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-emerald-700">Fallback ask:</span>
                      <span>
                        Support a technical amendment addressing reliability language +
                        implementation timeline.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Risk Flags (watch these)
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-900">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      Utility pushback (cost-shift narrative)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      Rural district reliability concerns
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      "Mandate" framing vs "market certainty + consumer choice" framing
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 2. Meeting Objectives */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-red-600" />
                2. Meeting Objectives
              </h2>

              <div className="space-y-4">
                <div className="border-l-4 border-red-600 pl-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Primary objective (must-have)
                  </h4>
                  <p className="text-sm text-gray-700">
                    Secure a clear position from the office: Support / Lean support / Needs changes
                    / Oppose
                  </p>
                </div>

                <div className="border-l-4 border-amber-400 pl-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Secondary objectives (nice-to-have)
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Identify the staffer who owns energy/utility policy (for follow-ups)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Confirm what data the office trusts (utility filings, ACC reports, industry
                      studies)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Establish next touchpoint before the next HB90 action (committee hearing /
                      amendment deadline)
                    </li>
                  </ul>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded p-4">
                  <h4 className="text-sm font-semibold text-cyan-900 mb-2">Success Criteria</h4>
                  <p className="text-sm text-gray-900">
                    Commitment to vote, or commitment to negotiate specific amendment language +
                    timeline.
                  </p>
                </div>
              </div>
            </Card>

            {/* 3. HB90 Snapshot */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-red-600" />
                3. HB90 Snapshot
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Bill Number</div>
                    <div className="font-semibold text-gray-900">HB90</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Topic</div>
                    <div className="text-sm text-gray-900">
                      Distributed solar, interconnection, consumer protections
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Current Status</div>
                    <Chip variant="monitor" size="sm">
                      Assigned to House Energy & Environment
                    </Chip>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Next Action</div>
                    <div className="text-sm font-medium text-red-600">
                      Hearing scheduled - Nov 15
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Key Provisions (Plain English)
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        title: 'Interconnection clarity',
                        desc: 'Standardizes timelines and requirements so projects don\'t get stuck in limbo.',
                      },
                      {
                        title: 'Consumer transparency',
                        desc: 'Clear disclosures on contracts, fees, termination, and performance expectations.',
                      },
                      {
                        title: 'Grid reliability alignment',
                        desc: 'Requires coordination with distribution planning (utility + regulators).',
                      },
                      {
                        title: 'Implementation',
                        desc: 'Phased effective dates to reduce operational shock.',
                      },
                    ].map((provision, i) => (
                      <div key={i} className="flex gap-3 bg-gray-50 p-3 rounded">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {provision.title}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{provision.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 4. Legislator Profile */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} className="text-red-600" />
                4. Legislator Profile (Meeting-Relevant)
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-gradient-to-r from-red-50 to-blue-50 p-4 rounded">
                  <img
                    src="https://images.unsplash.com/photo-1580643375398-5174902ebcec?w=400"
                    alt="Rep. Jordan Ramirez"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Rep. Jordan Ramirez</h3>
                    <p className="text-sm text-gray-600">State Representative • LD-12</p>
                    <div className="flex gap-2 mt-2">
                      <Chip variant="neutral" size="sm">
                        House Energy & Environment
                      </Chip>
                      <Chip variant="neutral" size="sm">
                        Commerce Vice Chair
                      </Chip>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">District Context</h4>
                    <p className="text-sm text-gray-900">
                      Mix of suburban + light industrial; sensitivity to utility rates and
                      reliability messaging. Constituents include trades, small business owners, and
                      commuters.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">
                      Stated Priorities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Chip variant="neutral" size="sm">
                        Lower cost of living
                      </Chip>
                      <Chip variant="neutral" size="sm">
                        Reliable infrastructure
                      </Chip>
                      <Chip variant="neutral" size="sm">
                        Business-friendly
                      </Chip>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-cyan-400 bg-cyan-50 pl-4 py-3">
                  <h4 className="text-sm font-semibold text-cyan-900 mb-2">Relationship Context</h4>
                  <div className="space-y-2 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-cyan-600" />
                      <span>
                        <strong>Last interaction:</strong> Oct 27 — brief hallway conversation (2
                        min)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-cyan-600" />
                      <span>
                        <strong>Next recommended touch:</strong> within 7–10 days (before committee
                        vote)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cake size={14} className="text-cyan-600" />
                      <span>
                        <strong>Birthday:</strong> May 14
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 5. Stakeholder Map */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-red-600" />
                5. Stakeholder Map (Quick View)
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded p-4">
                  <h4 className="text-sm font-semibold text-emerald-900 mb-2">
                    Likely Supporters
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li>• Solar trade groups</li>
                    <li>• Consumer choice orgs</li>
                    <li>• Business associations</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h4 className="text-sm font-semibold text-red-900 mb-2">Likely Opponents</h4>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li>• Utilities (cost-shift)</li>
                    <li>• Municipal coalitions</li>
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded p-4">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">Persuadables</h4>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li>• Reliability-focused legislators</li>
                    <li>• Budget hawks</li>
                    <li>• Rural caucus</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 6. Recommended Strategy */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb size={20} className="text-red-600" />
                6. Recommended Strategy for This Meeting
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Tone</div>
                    <div className="text-sm font-medium text-gray-900">
                      Pragmatic, non-ideological, operational clarity
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Frame</div>
                    <div className="text-sm font-medium text-gray-900">
                      Not "solar ideology" — rules-of-the-road modernization
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded p-4">
                  <h4 className="text-sm font-semibold text-cyan-900 mb-3">
                    Narrative Anchors (use repeatedly)
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        anchor: 'Predictability',
                        message: 'Clear rules reduce disputes and delays.',
                      },
                      {
                        anchor: 'Protection',
                        message: 'Consumers deserve transparency and fair terms.',
                      },
                      {
                        anchor: 'Reliability',
                        message: 'We can grow solar while keeping the grid stable.',
                      },
                      {
                        anchor: 'Local benefit',
                        message: 'Jobs, small business growth, and rate knowability.',
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          {i + 1}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-cyan-900">{item.anchor}:</span>{' '}
                          <span className="text-gray-700">"{item.message}"</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 7. Talking Points */}
            {briefData.includeOptions.talkingPoints && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare size={20} className="text-red-600" />
                  7. Talking Points (Tiered)
                </h2>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 bg-red-100 text-red-900 px-3 py-2 rounded">
                      A) Opening (30 seconds)
                    </h4>
                    <div className="bg-gray-50 border-l-4 border-red-600 p-4 rounded">
                      <p className="text-sm text-gray-900 italic">
                        "Rep. Ramirez, thanks for meeting. We're here because HB90 creates
                        practical, reliable guardrails for solar—clear interconnection rules,
                        stronger consumer protections, and grid-aligned planning. We'd love to
                        understand what you and your team need to feel comfortable supporting it."
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 bg-amber-100 text-amber-900 px-3 py-2 rounded">
                      B) Core Points (pick 3, don't ramble)
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          title: 'HB90 reduces uncertainty and administrative friction',
                          desc: 'Predictable processes lower costs, reduce disputes, and keep projects compliant.',
                        },
                        {
                          title: 'HB90 strengthens consumer protection',
                          desc: 'Transparent terms prevent bad actors from poisoning the well for reputable businesses.',
                        },
                        {
                          title: 'HB90 respects grid reliability',
                          desc: 'Planning + phased implementation prevents "surprise loads" and supports stable service.',
                        },
                      ].map((point, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded border border-gray-200">
                          <div className="font-medium text-gray-900 mb-2">{point.title}</div>
                          <div className="text-sm text-gray-600">{point.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 bg-cyan-100 text-cyan-900 px-3 py-2 rounded">
                      C) District-Tailored Point (1 minute)
                    </h4>
                    <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded">
                      <p className="text-sm text-gray-900 italic">
                        "In LD-12, homeowners and small businesses care about reliability and bills.
                        HB90 is designed so solar adoption doesn't mean chaos—just clearer rules,
                        better oversight, and fewer disputes that end up hurting consumers."
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 8. Anticipated Q&A */}
            {briefData.includeOptions.qa && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare size={20} className="text-red-600" />
                  8. Anticipated Questions & Best Answers
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      q: 'Will this raise utility rates?',
                      a: 'HB90 is designed to reduce friction and uncertainty—those hidden administrative costs show up somewhere. It also adds consumer protections that prevent market abuses. If there\'s a rate-related concern, we\'re open to clarifying language that protects affordability while preserving predictable rules.',
                    },
                    {
                      q: 'Does this weaken utilities\' ability to manage the grid?',
                      a: 'No—HB90 explicitly ties solar growth to grid planning and reliability. The goal is coordination, not surprise.',
                    },
                    {
                      q: 'Is this a mandate?',
                      a: 'HB90 doesn\'t force anyone to install solar. It modernizes the rules for people who choose it and protects consumers.',
                    },
                    {
                      q: 'Why now?',
                      a: 'The current system is inconsistent and unpredictable. HB90 lowers conflict and creates clear, enforceable expectations.',
                    },
                  ].map((qa, i) => (
                    <div key={i} className="border border-gray-200 rounded overflow-hidden">
                      <div className="bg-amber-50 p-4 border-b border-gray-200">
                        <div className="font-medium text-gray-900 flex items-start gap-2">
                          <span className="text-amber-600 font-bold">Q:</span>
                          <span>"{qa.q}"</span>
                        </div>
                      </div>
                      <div className="bg-white p-4">
                        <div className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">A:</span>
                          <span>"{qa.a}"</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 9. The Ask */}
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-cyan-50 border-2 border-emerald-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award size={20} className="text-emerald-600" />
                9. The Ask (Make It Clear)
              </h2>

              <div className="space-y-4">
                <div className="bg-white rounded p-4 border-2 border-emerald-400">
                  <div className="font-semibold text-emerald-900 mb-2">
                    Primary Ask: "Will you support HB90 in Energy & Environment?"
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <strong>If yes:</strong> "Would you consider co-sponsoring or speaking briefly
                      in committee?"
                    </div>
                    <div>
                      <strong>If uncertain:</strong> "What exact change would you need to support
                      it?"
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded p-4 border border-amber-300">
                  <div className="font-semibold text-amber-900 mb-2">Fallback Ask</div>
                  <p className="text-sm text-gray-700">
                    "Will you support a targeted amendment that strengthens reliability language and
                    clarifies timelines?"
                  </p>
                </div>

                <div className="bg-white rounded p-4 border border-gray-300">
                  <div className="font-semibold text-gray-900 mb-2">Close</div>
                  <p className="text-sm text-gray-700">
                    Confirm next steps + who to follow up with + timeframe.
                  </p>
                </div>
              </div>
            </Card>

            {/* 10. Follow-Up Plan */}
            {briefData.includeOptions.taskChecklist && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ListChecks size={20} className="text-red-600" />
                  10. Follow-Up Plan (Auto-generated Tasks)
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      task: 'Email staff a one-page leave-behind + offer amendment language',
                      due: 'Next day',
                    },
                    {
                      task: 'Schedule 10-min follow-up call with Energy LA',
                      due: 'Within 5 days',
                    },
                    {
                      task: 'Prepare committee testimony outline',
                      due: '48 hours pre-hearing',
                    },
                    {
                      task: 'Log meeting notes + tag HB90 + "Solar" issue',
                      due: 'Same day',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{item.task}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          Due: {item.due}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 11. Sources & Confidence */}
            <Card className="p-6 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                11. Sources & Confidence (Internal Transparency)
              </h2>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Sources Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Bill text',
                      'Sponsor memo',
                      'Committee agenda',
                      'Press releases',
                      'Voting history',
                      'Interaction logs',
                    ].map((source, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Pythia Confidence Indicators
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Bill summary confidence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <span className="text-xs font-medium text-emerald-600">High</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Legislator issue alignment</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-xs font-medium text-amber-600">Medium</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Opposition likelihood</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                        <span className="text-xs font-medium text-red-600">Medium-High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right: Context Rail */}
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6 sticky top-6">
            {/* Meeting Details Card */}
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-red-600" />
                Meeting Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock size={14} className="text-gray-500" />
                  {formatDateTime(briefData.dateTime)}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={14} className="text-gray-500" />
                  {briefData.location}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={14} className="text-gray-500" />
                  {attendees.yourTeam.length + attendees.legislatorOffice.length}{' '}
                  attendees
                </div>
              </div>
            </Card>

            {/* Legislator Quick Card */}
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Legislator</h4>
              <div className="flex items-start gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1580643375398-5174902ebcec?w=400"
                  alt="Rep. Ramirez"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">Rep. Jordan Ramirez</div>
                  <div className="text-xs text-gray-500">LD-12</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={14} className="text-gray-500" />
                  Energy & Environment
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock size={14} className="text-gray-500" />
                  Last: Oct 27 (hallway)
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Cake size={14} className="text-gray-500" />
                  Birthday: May 14
                </div>
              </div>
            </Card>

            {/* Bill Quick Card */}
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Bill Overview</h4>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500">Bill Number</div>
                  <div className="font-semibold text-gray-900">HB90</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <Chip variant="monitor" size="sm">
                    In Committee
                  </Chip>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Next Action</div>
                  <div className="text-sm font-medium text-red-600">Hearing - Nov 15</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Your Stance</div>
                  <Chip variant="support" size="sm">
                    {briefData.stanceTarget}
                  </Chip>
                </div>
              </div>
            </Card>

            {/* Key Risks */}
            <Card className="p-4 bg-red-50 border-red-200">
              <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} />
                Key Risks
              </h4>
              <ul className="space-y-2 text-sm text-gray-900">
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  Utility pushback narrative
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  Rural reliability concerns
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  "Mandate" framing risk
                </li>
              </ul>
            </Card>

            {/* One-Liner Message */}
            <Card className="p-4 bg-emerald-50 border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2">One-Liner Message</h4>
              <textarea
                className="w-full px-3 py-2 border border-emerald-300 rounded bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
                placeholder="Clear rules, consumer protection, grid reliability"
                defaultValue="Clear rules reduce conflict. Consumer protection prevents abuse. Grid reliability stays strong."
              />
            </Card>

            {/* Attach Files */}
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Attach Files</h4>
              <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                <FileText size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">
                  Drop files here or click to upload
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}