import React from 'react';
import { Chip } from '../ui/Chip';
import { Calendar, FileText, Users, CheckCircle, Clock, AlertTriangle, TrendingUp, ArrowRight, ExternalLink, Edit } from 'lucide-react';
import { type Deliverable } from '../../data/workHubData';

interface DeliverableContentProps {
  deliverable: Deliverable;
  clientBills: any[];
  recentEngagements: any[];
  onNavigateToBill?: (billId: string) => void;
}

export function DeliverableContent({ deliverable, clientBills, recentEngagements, onNavigateToBill }: DeliverableContentProps) {
  // Render content based on deliverable type
  const renderContent = () => {
    switch (deliverable.id) {
      case 'deliv-001':
        return renderHearingPrepPacket();
      case 'deliv-003':
        return renderCoalitionStrategyBrief();
      case 'deliv-004':
        return renderWorkforceBillsReport();
      default:
        return renderGenericWeeklyUpdate();
    }
  };

  // HB 2847 Committee Hearing Prep Packet
  const renderHearingPrepPacket = () => (
    <>
      {/* Executive Summary */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded"></div>
          Executive Summary
        </h3>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="mb-3">
            <strong>HB 2847 Committee Hearing - December 20, 2025</strong>
          </p>
          <p className="mb-3">
            This comprehensive hearing preparation package includes testimony, talking points, Q&A responses, and
            strategic guidance for the House Energy Committee hearing on HB 2847 (Renewable Energy Standards Act).
          </p>
          <div className="bg-green-50 border-l-4 border-green-600 p-4 my-4">
            <p className="font-semibold text-green-900 mb-1">Current Status</p>
            <p className="text-green-800 text-sm">
              HB 2847 is scheduled for House Energy Committee hearing on Dec 20 at 10:00 AM. Rep. Martinez
              will present our recommended amendments. We have secured 8 of 11 committee votes needed for passage.
            </p>
          </div>
        </div>
      </section>

      {/* Testimony */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600 rounded"></div>
          Prepared Testimony
        </h3>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Chair Thompson and members of the House Energy Committee,</strong>
          </p>
          <p className="text-sm text-gray-700 mb-3">
            Thank you for the opportunity to testify in support of HB 2847, the Renewable Energy Standards Act.
            I am here today representing the SolarTech Alliance, a coalition of 47 clean energy companies employing
            over 12,000 Arizonans.
          </p>
          <p className="text-sm text-gray-700 mb-3">
            HB 2847 represents a balanced approach to expanding Arizona's renewable energy portfolio while
            protecting ratepayers and maintaining grid reliability. The bill's key provisions include:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 mb-3 ml-4 space-y-1">
            <li>Increasing the Renewable Energy Standard to 35% by 2030, creating an estimated 8,500 new jobs</li>
            <li>Protecting rural electric cooperatives under 50MW from new mandates</li>
            <li>Establishing rate protection mechanisms to ensure no ratepayer sees increases above 2% annually</li>
            <li>Requiring annual progress reports to ensure accountability and transparency</li>
          </ul>
          <p className="text-sm text-gray-700 mb-3">
            The amendments we've worked with Rep. Martinez to develop address concerns raised by committee members
            in the Dec 15 stakeholder session, particularly regarding the implementation timeline for rural areas
            and enhanced grid reliability standards.
          </p>
          <p className="text-sm text-gray-700">
            We respectfully urge your support for HB 2847 and look forward to working with this committee
            to ensure Arizona leads the nation in clean energy development.
          </p>
        </div>
      </section>

      {/* Talking Points */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-orange-600 rounded"></div>
          Key Talking Points
        </h3>
        <div className="space-y-3">
          <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
            <p className="font-semibold text-gray-900 mb-1">Economic Impact</p>
            <p className="text-sm text-gray-700">
              HB 2847 will create 8,500 new clean energy jobs by 2030, with average salaries of $58,000 - 
              significantly above Arizona's median income. JEDI economic modeling shows $1.2B in economic activity.
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
            <p className="font-semibold text-gray-900 mb-1">Rural Protection</p>
            <p className="text-sm text-gray-700">
              The rural cooperative exemption ensures small utilities aren't burdened with unmanageable mandates.
              Co-ops under 50MW can participate voluntarily, protecting rural ratepayers.
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
            <p className="font-semibold text-gray-900 mb-1">Grid Reliability</p>
            <p className="text-sm text-gray-700">
              Enhanced grid reliability standards require 20% capacity reserves and modernized transmission infrastructure.
              This exceeds FERC guidelines and ensures Arizona's grid remains stable as we transition.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
            <p className="font-semibold text-gray-900 mb-1">Rate Protection</p>
            <p className="text-sm text-gray-700">
              The 2% annual rate cap provides ironclad protection for ratepayers. If compliance costs exceed this threshold,
              the implementation timeline automatically extends - putting families first.
            </p>
          </div>
        </div>
      </section>

      {/* Q&A Preparation */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-red-600 rounded"></div>
          Anticipated Questions & Responses
        </h3>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-900 mb-2">Q: What happens if renewable energy costs increase dramatically?</p>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              <strong>A:</strong> The bill includes automatic timeline adjustments if rate impacts exceed 2% annually.
              Additionally, the Corporation Commission retains full authority to modify implementation schedules.
              We've also included a hardship provision allowing utilities to request temporary relief during economic downturns.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-2">Q: How do we ensure grid reliability with intermittent renewable sources?</p>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              <strong>A:</strong> HB 2847 requires 20% capacity reserves (above FERC standards) and mandates transmission
              infrastructure improvements. The bill also allows battery storage and other reliability technologies to count
              toward compliance, ensuring 24/7 grid stability.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-2">Q: Why exempt rural cooperatives?</p>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              <strong>A:</strong> Rural co-ops under 50MW serve Arizona's most economically vulnerable communities.
              Imposing mandates on small utilities would create disproportionate compliance costs passed to rural ratepayers.
              The exemption protects these communities while larger utilities drive statewide progress.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-2">Q: How does this compare to other states?</p>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              <strong>A:</strong> 29 states have renewable energy standards. Arizona's current 15% target lags behind
              California (60%), Nevada (50%), and New Mexico (80%). HB 2847's 35% target is moderate and achievable,
              positioning Arizona competitively for clean energy investment and jobs.
            </p>
          </div>
        </div>
      </section>

      {/* Amendment Summary */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-indigo-600 rounded"></div>
          Recommended Amendments
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-indigo-50 rounded border border-indigo-200">
            <p className="font-semibold text-indigo-900 mb-1">Amendment 1: Timeline Extension for Rural Areas</p>
            <p className="text-sm text-gray-700 mb-2">
              Extends compliance timeline by 3 years for utilities serving counties with population density below 50 per square mile.
            </p>
            <p className="text-xs text-gray-600"><strong>Status:</strong> Agreed to by sponsor • Addresses Rep. Johnson concerns</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded border border-indigo-200">
            <p className="font-semibold text-indigo-900 mb-1">Amendment 2: Enhanced Grid Reliability Standards</p>
            <p className="text-sm text-gray-700 mb-2">
              Requires 20% capacity reserves and quarterly grid stability reports to the Corporation Commission.
            </p>
            <p className="text-xs text-gray-600"><strong>Status:</strong> Requested by Chair Thompson • We support</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded border border-indigo-200">
            <p className="font-semibold text-indigo-900 mb-1">Amendment 3: Annual Progress Reporting</p>
            <p className="text-sm text-gray-700 mb-2">
              Mandates annual reports to legislature on job creation, rate impacts, and emissions reductions.
            </p>
            <p className="text-xs text-gray-600"><strong>Status:</strong> Bipartisan request • Enhances accountability</p>
          </div>
        </div>
      </section>

      {/* Vote Count & Strategy */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-green-600 rounded"></div>
          Committee Vote Count & Strategy
        </h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Votes Secured</span>
            <span className="text-sm font-semibold text-gray-900">8 of 11 needed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-green-600 h-3 rounded-full" style={{ width: '73%' }}></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <p className="font-semibold text-green-700 mb-1">Yes (8)</p>
            <ul className="space-y-0.5 text-gray-600">
              <li>• Martinez (D) - Sponsor</li>
              <li>• Chen (D)</li>
              <li>• Rodriguez (D)</li>
              <li>• Thompson (D) - Chair</li>
              <li>• Williams (D)</li>
              <li>• Garcia (D)</li>
              <li>• Johnson (R)</li>
              <li>• Peterson (R)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-yellow-700 mb-1">Lean Yes (2)</p>
            <ul className="space-y-0.5 text-gray-600">
              <li>• Anderson (R)</li>
              <li>• Lee (I)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-red-700 mb-1">No (1)</p>
            <ul className="space-y-0.5 text-gray-600">
              <li>• Davis (R)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-sm font-semibold text-yellow-900 mb-1">Final Push Targets</p>
          <p className="text-sm text-gray-700">
            Need 3 more votes to ensure passage. Focus on Rep. Anderson (concerns about rural impacts - address with
            Amendment 1) and Rep. Lee (wants stronger accountability - emphasize Amendment 3).
          </p>
        </div>
      </section>
    </>
  );

  // Coalition Strategy Session Brief
  const renderCoalitionStrategyBrief = () => (
    <>
      {/* Meeting Overview */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded"></div>
          Meeting Overview
        </h3>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="mb-3">
            <strong>Clean Energy Alliance - Coalition Strategy Session</strong><br />
            December 26, 2025 • 2:00 PM - 4:00 PM • Virtual (Zoom)
          </p>
          <p className="mb-3">
            This strategy session brings together the 12 member organizations of the Clean Energy Alliance to align
            on 2026 legislative priorities, coordinate advocacy efforts, and plan coalition activities for the upcoming session.
          </p>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 my-4">
            <p className="font-semibold text-purple-900 mb-1">Meeting Objectives</p>
            <ul className="text-purple-800 text-sm space-y-1 list-disc list-inside">
              <li>Finalize 2026 legislative priorities and bill rankings</li>
              <li>Assign lead organizations for each priority bill</li>
              <li>Establish communications protocol and messaging consistency</li>
              <li>Plan joint advocacy events and grassroots mobilization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Coalition Members */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-green-600 rounded"></div>
          Coalition Member Organizations
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'SolarTech Alliance', role: 'Lead Organization', members: '47 companies' },
            { name: 'Arizona Wind Energy Association', role: 'Co-Lead', members: '23 companies' },
            { name: 'Environmental Defense Arizona', role: 'Advocacy Partner', members: '15K members' },
            { name: 'Clean Energy Future Fund', role: 'Research Partner', members: 'Foundation' },
            { name: 'Arizona Green Building Council', role: 'Industry Partner', members: '89 companies' },
            { name: 'Southwest Energy Efficiency Alliance', role: 'Technical Partner', members: '34 orgs' },
            { name: 'Citizens for Solar Choice', role: 'Grassroots Partner', members: '8.5K members' },
            { name: 'Arizona Labor Climate Jobs Coalition', role: 'Labor Partner', members: '12 unions' },
            { name: 'Faith Alliance for Climate Action', role: 'Faith Partner', members: '67 congregations' },
            { name: 'Rural Arizona Coalition', role: 'Rural Advocate', members: '19 communities' },
            { name: 'Arizona Business for Clean Energy', role: 'Business Voice', members: '156 businesses' },
            { name: 'Youth Climate Action Network', role: 'Youth Mobilization', members: '3.2K youth' },
          ].map((org, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="font-semibold text-gray-900 text-sm">{org.name}</p>
              <p className="text-xs text-blue-600 mt-1">{org.role}</p>
              <p className="text-xs text-gray-600 mt-0.5">{org.members}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proposed 2026 Priorities */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-orange-600 rounded"></div>
          Proposed 2026 Legislative Priorities
        </h3>
        <div className="space-y-3">
          <div className="border-l-4 border-green-600 pl-4 py-3 bg-green-50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">Tier 1: Top Priority</p>
                <p className="text-sm text-gray-700 mt-1">Community Solar Expansion Act</p>
              </div>
              <Chip variant="success" size="sm">Consensus</Chip>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Lead: SolarTech Alliance • Support: 12/12 orgs • Estimated cost: $125K advocacy campaign
            </p>
          </div>
          
          <div className="border-l-4 border-green-600 pl-4 py-3 bg-green-50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">Tier 1: Top Priority</p>
                <p className="text-sm text-gray-700 mt-1">Clean Energy Workforce Development Fund</p>
              </div>
              <Chip variant="success" size="sm">Consensus</Chip>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Lead: AZ Labor Climate Jobs Coalition • Support: 12/12 orgs • Estimated cost: $90K advocacy campaign
            </p>
          </div>

          <div className="border-l-4 border-yellow-600 pl-4 py-3 bg-yellow-50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">Tier 2: Secondary Priority</p>
                <p className="text-sm text-gray-700 mt-1">Grid Modernization & Storage Incentives</p>
              </div>
              <Chip variant="warning" size="sm">Discussion Needed</Chip>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Lead: TBD • Support: 9/12 orgs (3 need more details) • Scope and cost under review
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4 py-3 bg-blue-50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">Tier 3: Monitoring/Support</p>
                <p className="text-sm text-gray-700 mt-1">Building Electrification Standards</p>
              </div>
              <Chip variant="info" size="sm">Support Only</Chip>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Lead: AZ Green Building Council • Coalition will support but not lead advocacy
            </p>
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600 rounded"></div>
          Meeting Agenda
        </h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
            <div className="text-xs font-semibold text-gray-500 w-20">2:00-2:15</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Welcome & 2025 Wins Review</p>
              <p className="text-xs text-gray-600 mt-1">
                Celebrate HB 2847 passage and other coalition successes. Set positive tone for 2026.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
            <div className="text-xs font-semibold text-gray-500 w-20">2:15-2:45</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">2026 Priority Bills Discussion & Ranking</p>
              <p className="text-xs text-gray-600 mt-1">
                Review proposed bills, discuss resource allocation, finalize Tier 1/2/3 classifications.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
            <div className="text-xs font-semibold text-gray-500 w-20">2:45-3:15</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Lead Organization Assignments</p>
              <p className="text-xs text-gray-600 mt-1">
                Assign lead and support roles for each priority. Confirm capacity and resource commitments.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
            <div className="text-xs font-semibold text-gray-500 w-20">3:15-3:45</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Communications & Messaging Strategy</p>
              <p className="text-xs text-gray-600 mt-1">
                Align on key messages, establish spokesperson protocols, plan joint media opportunities.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
            <div className="text-xs font-semibold text-gray-500 w-20">3:45-4:00</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Action Items & Next Meeting</p>
              <p className="text-xs text-gray-600 mt-1">
                Confirm action items, assign owners, schedule February follow-up meeting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discussion Questions */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-red-600 rounded"></div>
          Key Discussion Questions for Session
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-red-50 rounded border border-red-200">
            <p className="font-semibold text-red-900 text-sm mb-2">Resource Allocation</p>
            <p className="text-xs text-gray-700">
              Should we concentrate resources on 2 Tier 1 bills or spread across 2-3 priorities? What's our total
              available budget for 2026 advocacy across all members?
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded border border-orange-200">
            <p className="font-semibold text-orange-900 text-sm mb-2">Grid Modernization Scope</p>
            <p className="text-xs text-gray-700">
              Do we pursue comprehensive grid modernization bill or narrower battery storage incentives? What's
              achievable in current political environment?
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="font-semibold text-yellow-900 text-sm mb-2">Opposition Strategy</p>
            <p className="text-xs text-gray-700">
              How do we proactively address utility opposition? Should we seek pre-session meetings with APS and TEP
              to find common ground?
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <p className="font-semibold text-blue-900 text-sm mb-2">Grassroots Mobilization</p>
            <p className="text-xs text-gray-700">
              What joint grassroots events can we coordinate? How do we leverage Youth Climate Action Network's
              3,200 members and Faith Alliance's 67 congregations?
            </p>
          </div>
        </div>
      </section>

      {/* Pre-Meeting Action Items */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded border border-blue-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRight size={20} className="text-blue-600" />
          Pre-Meeting Action Items
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>By Dec 23:</strong> All members submit 2026 budget allocations for coalition work</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>By Dec 24:</strong> Lead candidates for each priority bill confirm capacity</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>By Dec 25:</strong> Review shared Google Drive folder with all proposed bill drafts</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>Meeting Day:</strong> Come prepared to commit resources and finalize decisions</span>
          </li>
        </ul>
      </section>
    </>
  );

  // Workforce Bills Status Report
  const renderWorkforceBillsReport = () => (
    <>
      {/* Executive Summary */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded"></div>
          Executive Summary
        </h3>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="mb-3">
            <strong>Workforce Development Legislation - December 2025 Status Report</strong>
          </p>
          <p className="mb-3">
            This monthly report tracks 8 workforce development bills currently under consideration in the Arizona
            Legislature. Three bills are advancing favorably, two face challenges, and three remain in committee review.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
            <p className="font-semibold text-blue-900 mb-1">December Highlights</p>
            <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
              <li>HB 567 (Advanced Manufacturing Training) passed House Committee 9-2</li>
              <li>SB 223 (Apprenticeship Expansion) gained 3 new co-sponsors</li>
              <li>HB 892 (Community College Funding) facing budget concerns - needs strategy adjustment</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bill Tracking Table */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-green-600 rounded"></div>
          Tracked Bills Overview
        </h3>
        <div className="space-y-3">
          {[
            {
              number: 'HB 567',
              title: 'Advanced Manufacturing Training Program',
              sponsor: 'Rep. Kim (D-LD12)',
              status: 'Passed House Labor Committee',
              progress: 45,
              stance: 'Support',
              priority: 'High',
              nextAction: 'House Floor Vote - Jan 8',
              color: 'green'
            },
            {
              number: 'SB 223',
              title: 'Apprenticeship Expansion Act',
              sponsor: 'Sen. Torres (D-LD19)',
              status: 'Senate Commerce Committee',
              progress: 30,
              stance: 'Support',
              priority: 'High',
              nextAction: 'Committee Hearing - Jan 15',
              color: 'green'
            },
            {
              number: 'HB 892',
              title: 'Community College Workforce Funding',
              sponsor: 'Rep. Johnson (R-LD23)',
              status: 'House Appropriations',
              progress: 25,
              stance: 'Support',
              priority: 'Medium',
              nextAction: 'Waiting on fiscal analysis',
              color: 'yellow'
            },
            {
              number: 'SB 445',
              title: 'Job Training Tax Credit',
              sponsor: 'Sen. Martinez (D-LD08)',
              status: 'Senate Finance Committee',
              progress: 20,
              stance: 'Support',
              priority: 'Medium',
              nextAction: 'Stakeholder meeting - Jan 12',
              color: 'green'
            },
            {
              number: 'HB 334',
              title: 'Career Pathways in High Schools',
              sponsor: 'Rep. Chen (D-LD14)',
              status: 'House Education Committee',
              progress: 35,
              stance: 'Support',
              priority: 'Low',
              nextAction: 'Markup session - Jan 20',
              color: 'green'
            },
            {
              number: 'SB 556',
              title: 'Industrial Training Equipment Grants',
              sponsor: 'Sen. Williams (R-LD21)',
              status: 'Senate Commerce',
              progress: 15,
              stance: 'Monitor',
              priority: 'Low',
              nextAction: 'Committee review ongoing',
              color: 'gray'
            },
            {
              number: 'HB 778',
              title: 'Youth Employment Restrictions',
              sponsor: 'Rep. Davis (R-LD27)',
              status: 'House Labor Committee',
              progress: 40,
              stance: 'Oppose',
              priority: 'High',
              nextAction: 'Oppose in committee - Dec 28',
              color: 'red'
            },
            {
              number: 'SB 667',
              title: 'Workforce Development Board Restructure',
              sponsor: 'Sen. Anderson (R-LD18)',
              status: 'Senate Government Committee',
              progress: 10,
              stance: 'Monitor',
              priority: 'Medium',
              nextAction: 'Waiting for sponsor amendments',
              color: 'gray'
            },
          ].map((bill, idx) => (
            <div key={idx} className={`border-l-4 border-${bill.color}-500 pl-4 py-3 bg-${bill.color}-50`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{bill.number}</p>
                    <Chip 
                      variant={bill.stance === 'Support' ? 'success' : bill.stance === 'Oppose' ? 'danger' : 'neutral'} 
                      size="sm"
                    >
                      {bill.stance}
                    </Chip>
                    <Chip variant={bill.priority === 'High' ? 'warning' : 'neutral'} size="sm">
                      {bill.priority} Priority
                    </Chip>
                  </div>
                  <p className="text-sm text-gray-700">{bill.title}</p>
                  <p className="text-xs text-gray-600 mt-1">Sponsor: {bill.sponsor}</p>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>{bill.status}</span>
                  <span>{bill.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      bill.stance === 'Support' ? 'bg-green-600' : 
                      bill.stance === 'Oppose' ? 'bg-red-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${bill.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar size={12} />
                <span>Next: {bill.nextAction}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Priority Bill Deep Dive - HB 567 */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600 rounded"></div>
          Priority Bill Spotlight: HB 567
        </h3>
        <div className="space-y-3">
          <div className="bg-purple-50 p-4 rounded border border-purple-200">
            <p className="font-semibold text-purple-900 mb-2">Advanced Manufacturing Training Program Act</p>
            <p className="text-sm text-gray-700 mb-3">
              Creates $15M grant program for community colleges and industry partnerships to develop advanced
              manufacturing training programs. Targets semiconductors, aerospace, and clean energy sectors.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-gray-700 mb-1">Why We Support</p>
                <ul className="space-y-1 text-gray-600 list-disc list-inside">
                  <li>Addresses critical skilled worker shortage</li>
                  <li>Aligns with coalition members' hiring needs</li>
                  <li>Includes 3,000 new training slots annually</li>
                  <li>Bi-partisan sponsor support</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Current Challenges</p>
                <ul className="space-y-1 text-gray-600 list-disc list-inside">
                  <li>Budget appropriation timing uncertain</li>
                  <li>Need to secure Republican votes in House</li>
                  <li>Industry match requirement concerns some</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <p className="font-semibold text-green-900 text-sm mb-1">Recent Win</p>
            <p className="text-xs text-gray-700">
              House Labor Committee passed HB 567 on Dec 18 with 9-2 vote. Picked up 2 Republican votes through
              our targeted outreach emphasizing rural job creation. Floor vote expected Jan 8-12.
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <p className="font-semibold text-blue-900 text-sm mb-1">Next Steps</p>
            <p className="text-xs text-gray-700">
              • Secure 5 more House Republican votes before floor vote<br />
              • Coordinate testimony from coalition members for Senate hearing<br />
              • Draft op-ed for Arizona Republic highlighting job creation impact
            </p>
          </div>
        </div>
      </section>

      {/* Challenges & Risks */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-red-600 rounded"></div>
          Challenges & Mitigation Strategies
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-red-50 rounded border border-red-200">
            <p className="font-semibold text-red-900 text-sm mb-2">Challenge: HB 892 Budget Concerns</p>
            <p className="text-xs text-gray-700 mb-2">
              Community College funding bill facing pushback due to $45M price tag. House Appropriations Chair
              signaled reluctance to advance without offsets.
            </p>
            <p className="text-xs font-semibold text-gray-900 mb-1">Mitigation Strategy:</p>
            <p className="text-xs text-gray-700">
              Working with sponsor to introduce phased implementation reducing Year 1 cost to $15M. Identifying
              potential offset from unused workforce development funds. Scheduling meeting with Appropriations Chair
              week of Jan 6.
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded border border-orange-200">
            <p className="font-semibold text-orange-900 text-sm mb-2">Challenge: HB 778 Opposition</p>
            <p className="text-xs text-gray-700 mb-2">
              Youth Employment Restrictions bill would limit hours for 16-17 year olds in manufacturing, harming
              apprenticeship programs. Sponsor has strong committee support.
            </p>
            <p className="text-xs font-semibold text-gray-900 mb-1">Mitigation Strategy:</p>
            <p className="text-xs text-gray-700">
              Coordinating opposition testimony with AZ Chamber and manufacturing industry groups. Proposing amendment
              to exempt registered apprenticeship programs. If amendment fails, will oppose on House floor.
            </p>
          </div>
        </div>
      </section>

      {/* Advocacy Activity Summary */}
      <section className="bg-white rounded border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-orange-600 rounded"></div>
          December Advocacy Activity
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded border border-blue-200 text-center">
            <p className="text-3xl font-bold text-blue-600">14</p>
            <p className="text-sm text-gray-700 mt-1">Legislator Meetings</p>
          </div>
          <div className="bg-green-50 p-4 rounded border border-green-200 text-center">
            <p className="text-3xl font-bold text-green-600">3</p>
            <p className="text-sm text-gray-700 mt-1">Committee Testimonies</p>
          </div>
          <div className="bg-purple-50 p-4 rounded border border-purple-200 text-center">
            <p className="text-3xl font-bold text-purple-600">127</p>
            <p className="text-sm text-gray-700 mt-1">Coalition Member Contacts</p>
          </div>
          <div className="bg-orange-50 p-4 rounded border border-orange-200 text-center">
            <p className="text-3xl font-bold text-orange-600">2</p>
            <p className="text-sm text-gray-700 mt-1">Op-Eds Published</p>
          </div>
        </div>
        <div className="text-xs text-gray-600">
          <p className="mb-2"><strong>Key Meetings:</strong></p>
          <ul className="space-y-1 list-disc list-inside ml-2">
            <li>Dec 12: Rep. Kim (HB 567 sponsor) - secured floor vote commitment</li>
            <li>Dec 14: House Labor Committee Chair - discussed HB 778 opposition strategy</li>
            <li>Dec 15: Senate Commerce members - briefed on SB 223 apprenticeship bill</li>
            <li>Dec 18: House Appropriations Chair - negotiated HB 892 phased implementation</li>
          </ul>
        </div>
      </section>

      {/* January Outlook */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded border border-blue-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRight size={20} className="text-blue-600" />
          January Priorities & Action Items
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>Week of Jan 6:</strong> Secure 5 House Republican votes for HB 567 floor passage</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>Jan 12:</strong> Stakeholder meeting on SB 445 tax credit - finalize coalition position</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>Jan 15:</strong> Senate Commerce hearing on SB 223 - coordinate member testimony</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>Mid-Jan:</strong> Draft and circulate opposition testimony for HB 778</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>End-Jan:</strong> Quarterly coalition meeting to review progress and adjust strategy</span>
          </li>
        </ul>
      </section>
    </>
  );

  // Generic Weekly Update (fallback for other deliverables)
  const renderGenericWeeklyUpdate = () => (
    <>
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
            This week saw significant progress on clean energy legislation with HB 2847 advancing through committee 
            and SB 456 moving to the Senate floor. Our team engaged with 3 legislators and submitted testimony supporting 
            the Renewable Energy Standards Act.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
            <p className="font-semibold text-blue-900 mb-1">Key Highlight</p>
            <p className="text-blue-800 text-sm">
              HB 2847 passed House Energy Committee with amendments we recommended. Floor vote expected next week.
            </p>
          </div>
          <p>
            <strong>Next Week's Focus:</strong> HB 2847 floor vote preparation, SB 456 amendment strategy, 
            and continued opposition research on HB 789.
          </p>
        </div>
      </section>

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

              <div className="text-sm text-gray-700">
                <strong>This Week:</strong> {
                  bill.billNumber === 'HB 2847' 
                    ? 'Passed House Energy Committee with favorable amendments. Moved to House floor calendar. Expected floor vote Dec 22-23.'
                    : bill.billNumber === 'SB 456'
                    ? 'Advanced to Senate floor. Secured commitments from 3 additional sponsors. Floor debate scheduled for Dec 22.'
                    : 'Committee hearing scheduled. Preparing opposition testimony and alternative proposals.'
                }
              </div>

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
    </>
  );

  return <div className="space-y-6">{renderContent()}</div>;
}
