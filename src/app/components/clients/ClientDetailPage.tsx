import React from 'react';
import { mockClientIssues, mockClientBills, mockEngagementRecords, mockWorkstreams, mockOpportunities, mockAIInsights, mockClientContacts, mockWeeklyChanges, type Client } from '../../data/clientsData';
import { useClient } from '../../hooks/useClients';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Sparkles, ArrowLeft, DollarSign, Calendar, AlertTriangle, FileText, TrendingUp, Users, Settings, BarChart } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ClientPulseHeader } from './ClientPulseHeader';
import { WeeklyChangeDigest } from './WeeklyChangeDigest';
import { ClientIssueMap } from './ClientIssueMap';
import { ClientBillRoster } from './ClientBillRoster';
import { EngagementLedger } from './EngagementLedger';
import { WorkstreamsBoard } from './WorkstreamsBoard';
import { TeamAssignmentsCard } from './TeamAssignmentsCard';
import { ClientContactsCard } from './ClientContactsCard';
import { ContractBillingPanel } from './ContractBillingPanel';
import { ReportsDeliverablesHub } from './ReportsDeliverablesHub';
import { OpportunitiesPipeline } from './OpportunitiesPipeline';
import { AIRecommendationsPanel } from './AIRecommendationsPanel';
import { LoadingScreen } from '../LoadingScreen';
import { ClientUpdateGenerator } from '../client-updates/ClientUpdateGenerator';
import { useAskPythia } from '../../contexts/AskPythiaContext';
import { PageLayout } from '../ui/PageLayout';
import { getPageTheme } from '../../config/pageThemes';

type SectionType = 'overview' | 'issues' | 'bills' | 'projects' | 'team' | 'contract' | 'reports' | 'opportunities';

interface ClientDetailPageProps {
  clientId: string;
  onNavigateBack: () => void;
  onNavigateToBill?: (billId: string) => void;
}

export function ClientDetailPage({ clientId, onNavigateBack, onNavigateToBill }: ClientDetailPageProps) {
  const { isDarkMode } = useTheme();
  const { openPythia } = useAskPythia();
  const [activeSection, setActiveSection] = React.useState<SectionType>('overview');
  const [isGeneratorOpen, setIsGeneratorOpen] = React.useState(false);
  
  const { client, loading, error } = useClient(clientId);
  
  const clientsTheme = getPageTheme('Clients');

  if (loading) {
    return (
       <div className={`h-full flex items-center justify-center ${
         isDarkMode ? 'bg-slate-950' : 'bg-white'
       }`}>
         <div className="flex flex-col items-center gap-3">
           <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
           <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
             Loading client data...
           </p>
         </div>
       </div>
    );
  }

  if (error || !client) {
    return (
      <div className={`h-full flex items-center justify-center ${
         isDarkMode ? 'bg-slate-950' : 'bg-white'
       }`}>
        <div className="text-center">
           <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
             Client not found
           </h3>
           <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
             {error || "The requested client could not be loaded."}
           </p>
           <Button variant="secondary" onClick={onNavigateBack}>
             Return to List
           </Button>
        </div>
      </div>
    );
  }

  // In Live mode, these will be empty arrays for now unless we wire them up.
  // In Demo mode, they will populate if clientId matches a mock ID.
  const issues = mockClientIssues[clientId] || [];
  const bills = mockClientBills[clientId] || [];
  const engagementRecords = mockEngagementRecords[clientId] || [];
  const workstreams = mockWorkstreams[clientId] || [];
  const opportunities = mockOpportunities[clientId] || [];
  const aiInsights = mockAIInsights[clientId] || [];
  const contacts = mockClientContacts[clientId] || [];
  const weeklyChanges = mockWeeklyChanges[clientId] || [];

  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart },
    { id: 'issues' as const, label: 'Issues & Strategy', icon: AlertTriangle },
    { id: 'bills' as const, label: 'Bills & Engagement', icon: FileText },
    { id: 'projects' as const, label: 'Projects & Tasks', icon: Settings },
    { id: 'team' as const, label: 'Team & Contacts', icon: Users },
    { id: 'contract' as const, label: 'Contract & Billing', icon: DollarSign },
    { id: 'reports' as const, label: 'Reports & Deliverables', icon: FileText },
    { id: 'opportunities' as const, label: 'Opportunities', icon: TrendingUp },
  ];

  const headerIcon = (
    <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={onNavigateBack}>
            <ArrowLeft size={16} />
        </Button>
        {/* Placeholder for Client Logo if available */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {client.name.charAt(0)}
        </div>
    </div>
  );

  const headerContent = (
    <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" className="h-8" onClick={() => openPythia({ type: 'client', id: client.id, label: `Client: ${client.name}` })}>
            <Sparkles size={14} className={isDarkMode ? 'text-yellow-400' : 'text-purple-600'} />
            Ask Intelligence
        </Button>
        {client.tags.map(tag => (
            <Chip key={tag} variant="neutral" size="sm">{tag}</Chip>
        ))}
    </div>
  );

  const pageActions = (
    <Button variant="primary" onClick={() => setIsGeneratorOpen(true)}>
        Generate Client Update
    </Button>
  );

  return (
    <PageLayout
      title={client.name}
      subtitle="Client Detail"
      accentColor={clientsTheme.accent}
      headerIcon={headerIcon}
      headerContent={headerContent}
      pageActions={pageActions}
      backgroundImage={
        <BarChart 
            size={450} 
            color={isDarkMode ? "white" : clientsTheme.accent} 
            strokeWidth={0.5}
        />
      }
      contentClassName="flex-1 overflow-hidden flex"
    >
      <ClientUpdateGenerator 
        isOpen={isGeneratorOpen} 
        onClose={() => setIsGeneratorOpen(false)} 
        client={client} 
      />

      {/* 3-Zone Layout */}
        {/* Left Navigation */}
        <div className={`w-64 border-r overflow-y-auto backdrop-blur-xl transition-colors ${
          isDarkMode
            ? 'bg-slate-900/40 border-white/10'
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className="p-4 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? isDarkMode
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-slate-800/50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <ClientPulseHeader client={client} />
              <WeeklyChangeDigest changes={weeklyChanges} />
            </div>
          )}

          {activeSection === 'issues' && (
            <div className="space-y-6">
              <ClientIssueMap issues={issues} />
              <Card className="p-6">
                <h3 className={`font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Revere Strategy Memo</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className={`font-semibold mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Top priorities right now</div>
                    <ul className={`list-disc list-inside space-y-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <li>Secure HB 2847 passage through House Energy Committee</li>
                      <li>Build coalition support for SB 456 floor vote</li>
                      <li>Monitor and prepare defense against HB 789 utility rate changes</li>
                    </ul>
                  </div>
                  <div>
                    <div className={`font-semibold mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Where we can win</div>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Strong bipartisan support exists for renewable energy incentives. Chair Martinez is a proven champion and Vice Chair Patterson is persuadable on economic development framing.</p>
                  </div>
                  <div>
                    <div className={`font-semibold mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Where we might get hit</div>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Rural district concerns about rate impacts. Opposition from utility companies well-funded. Need to shore up votes in Agriculture Committee crossover members.</p>
                  </div>
                  <div>
                    <div className={`font-semibold mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Recommended moves next 14 days</div>
                    <ul className={`list-disc list-inside space-y-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <li>Schedule individual meetings with 3 swing votes before hearing</li>
                      <li>Coordinate coalition testimony and messaging</li>
                      <li>Prepare amendment language for timeline flexibility</li>
                    </ul>
                  </div>
                  <div>
                    <div className={`font-semibold mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Messaging themes</div>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Reliability + consumer choice + job creation. Avoid "mandate" language. Emphasize market-based solutions and local control.</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'bills' && (
            <div className="space-y-6">
              <ClientBillRoster bills={bills} onNavigateToBill={onNavigateToBill} />
              <EngagementLedger records={engagementRecords} />
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="space-y-6">
              <WorkstreamsBoard workstreams={workstreams} />
            </div>
          )}

          {activeSection === 'team' && (
            <div className="space-y-6">
              <TeamAssignmentsCard client={client} />
              <ClientContactsCard contacts={contacts} />
            </div>
          )}

          {activeSection === 'contract' && (
            <div className="space-y-6">
              <ContractBillingPanel client={client} />
            </div>
          )}

          {activeSection === 'reports' && (
            <div className="space-y-6">
              <ReportsDeliverablesHub 
                client={client} 
                onOpenGenerator={() => setIsGeneratorOpen(true)}
              />
            </div>
          )}

          {activeSection === 'opportunities' && (
            <div className="space-y-6">
              <OpportunitiesPipeline opportunities={opportunities} />
            </div>
          )}
        </div>

        {/* Right Sticky Rail */}
        <div className={`w-80 border-l overflow-y-auto backdrop-blur-xl transition-colors ${
          isDarkMode
            ? 'bg-slate-900/40 border-white/10'
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className="p-4 space-y-4 sticky top-0">
            <AIRecommendationsPanel insights={aiInsights} />
            
            {/* Contract Summary */}
            <Card className="p-4">
              <h4 className={`font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Contract Summary</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Monthly Retainer</div>
                  <div className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>${client.contractValueMonthly.toLocaleString()}</div>
                </div>
                <div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>YTD Revenue</div>
                  <div className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>${client.contractValueYTD.toLocaleString()}</div>
                </div>
                <div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Contract End</div>
                  <div className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{new Date(client.contractEnd).toLocaleDateString()}</div>
                </div>
                <div className={`pt-2 border-t ${
                  isDarkMode ? 'border-white/10' : 'border-gray-200'
                }`}>
                  <div className={`text-xs mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Scope</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{client.scopeSummary}</div>
                </div>
              </div>
            </Card>

            {/* Top Opportunities */}
            {opportunities.length > 0 && (
              <Card className="p-4">
                <h4 className={`font-semibold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Top Opportunities</h4>
                <div className="space-y-3">
                  {opportunities.slice(0, 2).map(opp => (
                    <div key={opp.id} className={`pb-3 border-b last:border-0 last:pb-0 ${
                      isDarkMode ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <div className={`text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{opp.title}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <Chip variant="info" size="sm">{opp.stage}</Chip>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{opp.probability}% likely</span>
                      </div>
                      <div className={`text-xs font-semibold ${
                        isDarkMode ? 'text-green-400' : 'text-green-700'
                      }`}>
                        ${opp.valueEstimate.toLocaleString()} {opp.valueType === 'recurring' ? '/mo' : 'one-time'}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
    </PageLayout>
  );
}
