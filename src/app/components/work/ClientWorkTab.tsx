import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Search, Plus, AlertTriangle, TrendingUp, FileText, Calendar, Users, Sparkles } from 'lucide-react';
import { mockClients } from '../../data/clientsData';
import { mockProjects, mockDeliverables, mockWorkHubAIInsights, getProjectsByClient, getDeliverablesByClient, getOpportunitiesByClient, type Project, type Deliverable, type ProjectStage } from '../../data/workHubData';
import { ProjectsBoard } from './ProjectsBoard';
import { DeliverablesQueue } from './DeliverablesQueue';
import { OpportunityPipelineModal } from './OpportunityPipelineModal';
import { useTheme } from '../../contexts/ThemeContext';

interface ClientWorkTabProps {
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToBill?: (billId: string) => void;
}

export function ClientWorkTab({ onNavigateToClient, onNavigateToBill }: ClientWorkTabProps) {
  const { isDarkMode } = useTheme();
  const [selectedClientId, setSelectedClientId] = React.useState<string>(mockClients[0].id);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showOpportunityPipeline, setShowOpportunityPipeline] = React.useState(false);

  const selectedClient = mockClients.find(c => c.id === selectedClientId);
  const clientProjects = getProjectsByClient(selectedClientId);
  const clientDeliverables = getDeliverablesByClient(selectedClientId);
  const clientOpportunities = getOpportunitiesByClient(selectedClientId);
  const clientInsights = mockWorkHubAIInsights.filter(i => 
    (i.scope === 'client' && i.scopeId === selectedClientId) ||
    (i.scope === 'project' && clientProjects.some(p => p.id === i.scopeId))
  );

  // Filter clients by search
  const filteredClients = mockClients.filter(c =>
    searchQuery === '' || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Client Selector */}
        <div className="lg:col-span-1">
          <div className={`rounded-xl backdrop-blur-xl border transition-all sticky top-6 ${
            isDarkMode
              ? 'bg-slate-800/40 border-white/10'
              : 'bg-white/80 border-gray-200'
          } shadow-lg`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="relative mb-4">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} size={18} />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded text-sm focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-slate-900 border-white/10 text-white placeholder-gray-500 focus:ring-cyan-500/50'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              <Button variant="primary" className="w-full">
                <Plus size={16} />
                New Project
              </Button>
            </div>

            <div className="p-4 max-h-[calc(100vh-280px)] overflow-y-auto">
              <h4 className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>Clients</h4>
              <div className="space-y-1">
                {filteredClients.map(client => {
                  const clientProjs = getProjectsByClient(client.id);
                  const activeProjects = clientProjs.filter(p => p.stage !== 'delivered').length;
                  
                  return (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`w-full text-left p-3 rounded border transition-all ${
                        selectedClientId === client.id
                          ? isDarkMode
                            ? 'bg-cyan-500/20 border-cyan-500/30 shadow-sm'
                            : 'bg-blue-50 border-blue-200 shadow-sm'
                          : isDarkMode
                          ? 'border-white/10 hover:bg-slate-800/50 hover:border-white/20'
                          : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-medium mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{client.name}</div>
                      <div className={`flex items-center gap-2 text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <span>{activeProjects} active {activeProjects === 1 ? 'project' : 'projects'}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          client.healthStatus === 'green' ? 'bg-green-500' :
                          client.healthStatus === 'yellow' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      {/* Center Content - Projects Board + Deliverables */}
      <div className="lg:col-span-2 space-y-6">
        {/* Client Header */}
        <div className={`p-6 rounded-xl backdrop-blur-xl border transition-all ${
          isDarkMode
            ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30'
            : 'bg-gradient-to-br from-cyan-50/80 to-blue-50/80 border-cyan-200'
        } shadow-lg`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-xl font-bold mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{selectedClient?.name}</h2>
              <div className={`flex items-center gap-3 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span>{clientProjects.length} projects</span>
                <span>•</span>
                <span>{clientDeliverables.length} deliverables</span>
                <span>•</span>
                <button
                  onClick={() => onNavigateToClient?.(selectedClientId)}
                  className={isDarkMode ? 'text-cyan-400 hover:underline' : 'text-blue-600 hover:underline'}
                >
                  View client details →
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary">
                <Plus size={16} />
                New Deliverable
              </Button>
              <Button variant="primary">
                <Plus size={16} />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Board */}
        <ProjectsBoard
          projects={clientProjects}
          onNavigateToBill={onNavigateToBill}
        />

        {/* Deliverables Queue */}
        <DeliverablesQueue
          deliverables={clientDeliverables}
          onNavigateToBill={onNavigateToBill}
        />
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Client Pulse */}
        {selectedClient && (
          <div className={`p-4 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-slate-800/40 border-white/10'
              : 'bg-white/80 border-gray-200'
          } shadow-lg`}>
            <h4 className={`font-semibold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Client Pulse</h4>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Monthly Retainer</div>
                <div className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  ${selectedClient.contractValueMonthly.toLocaleString()}/mo
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">YTD Revenue</div>
                <div className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  ${selectedClient.contractValueYTD.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Health Status</div>
                <Chip
                  variant={
                    selectedClient.healthStatus === 'green' ? 'success' :
                    selectedClient.healthStatus === 'yellow' ? 'warning' :
                    'danger'
                  }
                  size="sm"
                >
                  {selectedClient.healthStatus.toUpperCase()}
                </Chip>
              </div>
            </div>
          </div>
        )}

        {/* Revere Recommendations */}
        {clientInsights.length > 0 && (
          <div className={`p-4 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-purple-500/10 border-purple-500/30'
              : 'bg-purple-50/80 border-purple-200'
          } shadow-lg`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
              <h4 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Revere Recommendations</h4>
            </div>
            <div className="space-y-3">
              {clientInsights.map(insight => (
                <div key={insight.id} className={`p-3 rounded border ${
                  isDarkMode
                    ? 'bg-slate-900/50 border-purple-500/30'
                    : 'bg-white/80 border-purple-200'
                }`}>
                  <div className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {insight.summary}
                  </div>
                  <div className={`text-xs mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {insight.reasons.slice(0, 2).map((reason, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span className="text-gray-400">•</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                  {insight.actionLabel && (
                    <Button variant="secondary" size="sm">
                      {insight.actionLabel}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunity Pipeline Preview */}
        <div className={`p-4 rounded-xl backdrop-blur-xl border transition-all ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-white/80 border-gray-200'
        } shadow-lg`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Opportunities</h4>
            <TrendingUp size={16} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
          </div>
          <div className={`text-sm mb-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {clientOpportunities.length} active opportunities
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full"
            onClick={() => setShowOpportunityPipeline(true)}
          >
            View Pipeline
          </Button>
        </div>
      </div>
      </div>

      {/* Opportunity Pipeline Modal */}
      {showOpportunityPipeline && selectedClient && (
        <OpportunityPipelineModal
          clientId={selectedClientId}
          clientName={selectedClient.name}
          onClose={() => setShowOpportunityPipeline(false)}
        />
      )}
    </div>
  );
}