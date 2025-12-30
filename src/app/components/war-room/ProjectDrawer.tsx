import React, { useState } from 'react';
import { X, FileText, Calendar, DollarSign, Sparkles, BarChart2 } from 'lucide-react';
import { Button } from '../ui/button';
import type { CampaignProject } from '../../data/campaignData';
import { StatsTab } from './StatsTab';

interface ProjectDrawerProps {
  project: CampaignProject;
  onClose: () => void;
}

type DrawerTab = 'overview' | 'field' | 'stats' | 'budget' | 'insights';

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('overview');

  const tabs = [
    { id: 'overview' as DrawerTab, label: 'Overview', icon: <FileText size={14} /> },
    { id: 'field' as DrawerTab, label: 'Field Plan', icon: <Calendar size={14} /> },
    { id: 'stats' as DrawerTab, label: 'Stats', icon: <BarChart2 size={14} /> },
    { id: 'budget' as DrawerTab, label: 'Budget', icon: <DollarSign size={14} /> },
    { id: 'insights' as DrawerTab, label: 'Pythia Insights', icon: <Sparkles size={14} /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[800px] h-full bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-gray-900 mb-2">{project.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{project.clientName}</span>
                <span>•</span>
                <span>{project.districtName}</span>
                <span>•</span>
                <span className="capitalize">{project.stage.replace('-', ' ')}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-t border-gray-200 -mx-6 px-6 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md
                  ${activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Project details */}
              <div>
                <h3 className="text-gray-900 mb-3">Project Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {project.type.split('-').join(' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Stage</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {project.stage.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Created</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(project.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div>
                <h3 className="text-gray-900 mb-3">Team</h3>
                <div className="space-y-2">
                  {project.owners.map((owner) => (
                    <div key={owner.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                        {owner.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{owner.name}</div>
                        <div className="text-sm text-gray-600 capitalize">{owner.role.replace('-', ' ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deadlines */}
              <div>
                <h3 className="text-gray-900 mb-3">Deadlines</h3>
                <div className="space-y-2">
                  {project.deadlines.map((deadline) => (
                    <div 
                      key={deadline.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        deadline.completed ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex-1">
                        <div className={`font-medium ${deadline.completed ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                          {deadline.name}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {deadline.type} • {new Date(deadline.date).toLocaleDateString()}
                        </div>
                      </div>
                      {deadline.completed && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Complete
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div>
                <h3 className="text-gray-900 mb-3">Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Tasks Completion</span>
                      <span className="text-sm font-medium text-gray-900">{project.progress.tasks}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${project.progress.tasks}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Deliverables Completion</span>
                      <span className="text-sm font-medium text-gray-900">{project.progress.deliverables}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full" 
                        style={{ width: `${project.progress.deliverables}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* KPIs */}
              {project.kpis && (
                <div>
                  <h3 className="text-gray-900 mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {project.kpis.field && (
                      <>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Doors Knocked</p>
                          <p className="text-2xl font-bold text-gray-900">{project.kpis.field.doorsKnocked}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Conversations</p>
                          <p className="text-2xl font-bold text-gray-900">{project.kpis.field.conversations}</p>
                        </div>
                        {project.kpis.field.persuasionRate && (
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Persuasion Rate</p>
                            <p className="text-2xl font-bold text-gray-900">{project.kpis.field.persuasionRate}%</p>
                          </div>
                        )}
                      </>
                    )}
                    {project.kpis.digital && (
                      <>
                        <div className="p-4 bg-indigo-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">CTR</p>
                          <p className="text-2xl font-bold text-gray-900">{project.kpis.digital.ctr}%</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">CPA</p>
                          <p className="text-2xl font-bold text-gray-900">${project.kpis.digital.cpa}</p>
                        </div>
                        {project.kpis.digital.conversions && (
                          <div className="p-4 bg-teal-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Conversions</p>
                            <p className="text-2xl font-bold text-gray-900">{project.kpis.digital.conversions}</p>
                          </div>
                        )}
                      </>
                    )}
                    {project.kpis.fundraising && (
                      <>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Call Time (hrs)</p>
                          <p className="text-2xl font-bold text-gray-900">{project.kpis.fundraising.callTime}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Pledges</p>
                          <p className="text-2xl font-bold text-gray-900">{project.kpis.fundraising.pledges}</p>
                        </div>
                        {project.kpis.fundraising.avgDonation && (
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Avg Donation</p>
                            <p className="text-2xl font-bold text-gray-900">${project.kpis.fundraising.avgDonation}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Budget */}
              {project.budget && (
                <div>
                  <h3 className="text-gray-900 mb-3">Budget</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Allocated</p>
                        <p className="text-lg font-bold text-gray-900">${project.budget.allocated.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Spent</p>
                        <p className="text-lg font-bold text-gray-900">${project.budget.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Forecast</p>
                        <p className="text-lg font-bold text-gray-900">${project.budget.forecast.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          project.budget.spent > project.budget.allocated ? 'bg-red-600' :
                          project.budget.spent / project.budget.allocated > 0.8 ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${Math.min((project.budget.spent / project.budget.allocated) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <StatsTab projectId={project.id} projectName={project.title} />
          )}

          {/* Other tabs - placeholder */}
          {activeTab !== 'overview' && activeTab !== 'stats' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                {tabs.find(t => t.id === activeTab)?.icon}
              </div>
              <h3 className="text-gray-900 mb-2 capitalize">{activeTab} Content</h3>
              <p className="text-gray-600">Detailed {activeTab} view coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
