import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, CheckCircle, ExternalLink, FileText, Calendar, User, Sparkles, Download, TrendingUp, Mail, Briefcase, DollarSign } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';
import { Button } from '../ui/Button';
import { Legislator, Bill } from './legislatorData';

interface LegislatorBillBriefModalProps {
  legislator: Legislator;
  bill: Bill;
  onClose: () => void;
}

export function LegislatorBillBriefModal({ legislator, bill, onClose }: LegislatorBillBriefModalProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = async (text: string, section: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const generateEmailTemplate = () => {
    return `Subject: Echo Canyon Consulting - Meeting Request Regarding ${bill.number}

Dear ${legislator.title} ${legislator.name.split(' ').pop()},

I hope this message finds you well. My name is [Your Name] from Echo Canyon Consulting, and I'm reaching out regarding ${bill.number} - ${bill.title}.

Given your leadership as ${bill.sponsorshipType === 'primary' ? 'primary sponsor' : 'co-sponsor'} of this legislation and your demonstrated commitment to ${legislator.expertise?.[0]?.toLowerCase() || 'key policy areas'}, I believe there may be opportunities for collaboration.

I would welcome the chance to discuss:
• Our analysis of the bill's potential impact
• Stakeholder perspectives we've gathered
• Potential strategic considerations for the committee process

Would you have 15-20 minutes available for a brief call in the coming week?

Thank you for your time and consideration.

Best regards,
[Your Name]
Echo Canyon Consulting`;
  };

  const getSponsorshipContext = () => {
    if (bill.sponsorshipType === 'primary') {
      return {
        role: 'Primary Sponsor',
        commitment: 'High - This is their legislation',
        influence: 'Direct control over bill amendments and strategy',
        approach: 'Position as ally supporting their legislative priorities'
      };
    } else {
      return {
        role: 'Co-Sponsor',
        commitment: 'Moderate - Supporting primary sponsor',
        influence: 'Advisory role, can influence amendments',
        approach: 'Emphasize alignment with their policy interests'
      };
    }
  };

  const sponsorshipContext = getSponsorshipContext();

  const strategicTalkingPoints = bill.number === 'HB 2847' ? [
    {
      point: 'Rural Cooperative Exemption',
      context: `Martinez represents LD-17 (Mesa/Gilbert), which includes suburban areas but has expressed support for rural energy access. The new exemption for rural co-ops under 50MW aligns with her broader energy equity focus.`,
      suggestion: 'Frame our support as ensuring equitable transition while protecting rural communities.'
    },
    {
      point: 'Extended Compliance Timeline',
      context: `The shift from 2030 to 2035 gives utilities more runway. Martinez's district has major utility infrastructure - she'll appreciate the practical timeline.`,
      suggestion: 'Highlight how the extended timeline allows for proper planning and workforce development.'
    },
    {
      point: 'Renewable Energy Credit Enhancement',
      context: `The 15% credit boost for economically distressed counties and community benefit agreements directly ties to Martinez's environmental justice priorities.`,
      suggestion: 'Emphasize job creation and economic development opportunities in underserved areas.'
    },
    {
      point: 'Grid Modernization Investment',
      context: `$2B infrastructure investment requirement aligns with her support for both renewable energy AND grid reliability.`,
      suggestion: 'Discuss how this creates immediate construction jobs while building long-term infrastructure.'
    }
  ] : [
    {
      point: 'Legislative Priority Alignment',
      context: `This bill aligns with ${legislator.expertise?.[0] || 'key policy areas'} - one of ${legislator.name.split(' ')[0]}'s core focus areas.`,
      suggestion: `Frame discussion around how this advances their stated policy goals.`
    },
    {
      point: 'District Impact',
      context: `${legislator.district} constituents will be directly affected by this legislation.`,
      suggestion: 'Prepare specific data on local impact and constituent benefits.'
    },
    {
      point: 'Committee Dynamics',
      context: `As ${sponsorshipContext.role.toLowerCase()}, ${legislator.name.split(' ')[0]} has ${sponsorshipContext.influence.toLowerCase()}.`,
      suggestion: `${sponsorshipContext.approach}.`
    }
  ];

  const campaignServicesOpportunities = legislator.id === 'leg-martinez' ? [
    {
      service: 'Policy Research & Messaging',
      relevance: 'High Priority',
      description: 'Martinez is building her profile as renewable energy leader. Provide rapid-response policy briefs and talking points for media appearances.',
      action: 'Offer quarterly energy policy briefings with district-specific data'
    },
    {
      service: 'Stakeholder Coalition Building',
      relevance: 'High Priority', 
      description: 'Help convene utility executives, environmental groups, and labor unions to build broad support coalition.',
      action: 'Facilitate roundtable with APS, TEP, and Building Trades Council'
    },
    {
      service: 'Opposition Research & Response',
      relevance: 'Medium Priority',
      description: 'Conservative groups may attack the bill as costly mandate. Prepare counter-messaging emphasizing jobs and energy independence.',
      action: 'Develop FAQ document addressing cost concerns with economic data'
    },
    {
      service: 'Media Training & Placement',
      relevance: 'Medium Priority',
      description: 'Position her as go-to expert on Arizona energy policy. Secure op-ed placements in Arizona Republic and Phoenix Business Journal.',
      action: 'Draft op-ed highlighting bipartisan aspects and economic benefits'
    }
  ] : [
    {
      service: 'Policy Research & Messaging',
      relevance: 'Medium Priority',
      description: `Provide analysis and talking points related to ${bill.title} and ${legislator.expertise?.[0] || 'key policy areas'}.`,
      action: 'Offer policy briefing materials tailored to district concerns'
    },
    {
      service: 'Stakeholder Coordination',
      relevance: 'Medium Priority',
      description: 'Connect with relevant interest groups and constituents affected by this legislation.',
      action: 'Facilitate stakeholder roundtable discussions'
    }
  ];

  return createPortal(
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-white/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-950/30 dark:to-blue-950/30">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Strategic Intelligence Brief</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {legislator.name} × {bill.number} - {bill.title}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => handleCopy(document.body.innerText, 'full')}>
              <Download size={16} />
              Export PDF
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Executive Summary */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white">Executive Summary</h3>
                <button
                  onClick={() => handleCopy(`${legislator.name} | ${bill.number}\\n\\nRole: ${sponsorshipContext.role}\\nStance: ${bill.stance?.toUpperCase()}\\nPriority Level: ${sponsorshipContext.commitment}`, 'summary')}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                >
                  {copiedSection === 'summary' ? <CheckCircle size={14} className="text-green-600 dark:text-green-500" /> : <Copy size={14} />}
                  {copiedSection === 'summary' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Legislator</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{legislator.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{legislator.party} • {legislator.district}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Bill</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{bill.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{bill.status}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-300 dark:border-white/10">
                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sponsorship Role</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{sponsorshipContext.role}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Their Stance</div>
                    <div className={`text-sm font-semibold ${bill.stance === 'support' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {bill.stance?.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Commitment Level</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{sponsorshipContext.commitment.split(' - ')[0]}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Legislator Profile Quick Reference */}
            <section>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Legislator Profile Quick Reference</h3>
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 rounded p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Key Expertise</div>
                    <div className="flex flex-wrap gap-1">
                      {(legislator.expertise || []).slice(0, 3).map((exp, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Committee Assignments</div>
                    <div className="text-sm text-blue-900 dark:text-blue-300">
                      {legislator.committees?.slice(0, 2).join(', ') || 'N/A'}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Preferred Contact Path</div>
                  <div className="text-sm text-blue-900 dark:text-blue-300">{legislator.preferredContactPath}</div>
                </div>
                {legislator.keyStaff && legislator.keyStaff[0] && (
                  <div>
                    <div className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Chief of Staff (Primary Gatekeeper)</div>
                    <div className="text-sm text-blue-900 dark:text-blue-300">
                      {legislator.keyStaff[0].name} • {legislator.keyStaff[0].email} • {legislator.keyStaff[0].phone}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Strategic Talking Points */}
            <section>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                <TrendingUp size={18} className="inline mr-2 text-red-600 dark:text-red-500" />
                Strategic Talking Points
              </h3>
              <div className="space-y-3">
                {strategicTalkingPoints.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.point}</h4>
                      <button
                        onClick={() => handleCopy(`${item.point}\\n\\nContext: ${item.context}\\n\\nSuggestion: ${item.suggestion}`, `talking-${index}`)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                      >
                        {copiedSection === `talking-${index}` ? <CheckCircle size={14} className="text-green-600 dark:text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <div className="mb-2">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Context:</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{item.context}</p>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Suggested Approach:</div>
                      <p className="text-sm text-green-700 dark:text-green-400 font-medium">{item.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Outreach Strategy */}
            <section>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                <Mail size={18} className="inline mr-2 text-red-600 dark:text-red-500" />
                Recommended Outreach Strategy
              </h3>
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-500/30 rounded p-4 space-y-3">
                <div>
                  <div className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">Immediate Actions (This Week)</div>
                  <ul className="space-y-1 text-sm text-green-900 dark:text-green-300">
                    <li>• Email {legislator.keyStaff?.[0]?.name || 'Chief of Staff'} to request 15-minute meeting</li>
                    <li>• Reference {bill.number} and {legislator.name.split(' ')[0]}'s {sponsorshipContext.role.toLowerCase()} role</li>
                    <li>• Offer to provide stakeholder perspectives and policy analysis</li>
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">Medium-Term (2-4 Weeks)</div>
                  <ul className="space-y-1 text-sm text-green-900 dark:text-green-300">
                    <li>• Schedule in-person meeting at district office ({legislator.districtOffice})</li>
                    <li>• Bring 1-page brief summarizing key provisions and district impact</li>
                    <li>• Discuss committee strategy and potential amendments</li>
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">Long-Term Relationship Building</div>
                  <ul className="space-y-1 text-sm text-green-900 dark:text-green-300">
                    <li>• Add to quarterly policy briefing distribution list</li>
                    <li>• Invite to stakeholder roundtables on {legislator.expertise?.[0]?.toLowerCase() || 'relevant policy topics'}</li>
                    <li>• Monitor for campaign contribution opportunities (if relevant)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Campaign Services Opportunities */}
            <section>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                <Briefcase size={18} className="inline mr-2 text-red-600 dark:text-red-500" />
                Campaign Services Opportunities
              </h3>
              <div className="space-y-3">
                {campaignServicesOpportunities.map((service, index) => (
                  <div key={index} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{service.service}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          service.relevance === 'High Priority'
                            ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                        }`}>
                          {service.relevance}
                        </span>
                      </div>
                      <DollarSign size={16} className="text-green-600 dark:text-green-500" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{service.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">Next Step:</span>
                      <span className="text-blue-600 dark:text-blue-400">{service.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Email Template */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  <Mail size={18} className="inline mr-2 text-red-600 dark:text-red-500" />
                  Draft Outreach Email
                </h3>
                <button
                  onClick={() => handleCopy(generateEmailTemplate(), 'email')}
                  className="text-sm text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1 font-medium"
                >
                  {copiedSection === 'email' ? (
                    <>
                      <CheckCircle size={16} className="text-green-600 dark:text-green-500" />
                      <span className="text-green-600 dark:text-green-500">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Template
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded p-4">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                  {generateEmailTemplate()}
                </pre>
              </div>
            </section>

            {/* Risk Factors & Considerations */}
            <section>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Risk Factors & Considerations</h3>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 rounded p-4">
                <ul className="space-y-2 text-sm text-amber-900 dark:text-amber-200">
                  <li>• <strong>Timing:</strong> Next action on {bill.nextActionDate} - coordinate outreach before committee hearing</li>
                  <li>• <strong>Internal Dynamics:</strong> {sponsorshipContext.influence}</li>
                  <li>• <strong>Political Climate:</strong> {legislator.party} legislator in {legislator.district} - consider district dynamics</li>
                  {bill.riskScore && bill.riskScore >= 5 && (
                    <li>• <strong>Risk Level:</strong> Bill has risk score of {bill.riskScore}/10 - prepare for potential complications</li>
                  )}
                </ul>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Generated by Pythia Intelligence Platform • Echo Canyon Consulting • {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary">
              <Calendar size={16} />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}