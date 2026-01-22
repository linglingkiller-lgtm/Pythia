import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Calendar, DollarSign, Sparkles, BarChart2 } from 'lucide-react';
import { Button } from '../ui/button';
import type { CampaignProject } from '../../data/campaignData';
import { StatsTab } from './StatsTab';
import { useTheme } from '../../contexts/ThemeContext';

interface ProjectDrawerProps {
  project: CampaignProject;
  onClose: () => void;
}

type DrawerTab = 'overview' | 'field' | 'stats' | 'budget' | 'insights';

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('overview');
  const { isDarkMode } = useTheme();

  const tabs = [
    { id: 'overview' as DrawerTab, label: 'Overview', icon: <FileText size={14} /> },
    { id: 'field' as DrawerTab, label: 'Field Plan', icon: <Calendar size={14} /> },
    { id: 'stats' as DrawerTab, label: 'Stats', icon: <BarChart2 size={14} /> },
    { id: 'budget' as DrawerTab, label: 'Budget', icon: <DollarSign size={14} /> },
    { id: 'insights' as DrawerTab, label: 'Pythia Insights', icon: <Sparkles size={14} /> }
  ];

  return createPortal(
    <div className="fixed inset-0 z-[101] flex items-center justify-end">
      {/* Overlay */}
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-black/30'}`} onClick={onClose} />

      {/* Drawer - positioned below header */}
      <div 
        className={`relative w-[800px] flex flex-col shadow-2xl ${
          isDarkMode
            ? 'bg-slate-900'
            : 'bg-white'
        }`}
        style={{ 
          height: 'calc(100vh - 4rem)', // Full height minus header (4rem = 64px)
          marginTop: '4rem' // Offset by header height
        }}
      >
        {/* Header */}
        <div className={`border-b p-6 ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
              <div className={`flex items-center gap-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
          <div className={`flex gap-1 border-t -mx-6 px-6 pt-4 ${
            isDarkMode ? 'border-white/10' : 'border-gray-200'
          }`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md
                  ${activeTab === tab.id 
                    ? isDarkMode
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-blue-50 text-blue-600'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-slate-800'
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
                <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Project Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Type</p>
                    <p className={`text-sm font-medium capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {project.type.split('-').join(' ')}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Stage</p>
                    <p className={`text-sm font-medium capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {project.stage.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Created</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {new Date(project.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Last Updated</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div>
                <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Team</h3>
                <div className="space-y-2">
                  {project.owners.map((owner) => (
                    <div key={owner.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                      isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'
                    }`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                        {owner.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{owner.name}</div>
                        <div className={`text-sm capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{owner.role.replace('-', ' ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deadlines */}
              <div>
                <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Deadlines</h3>
                <div className="space-y-2">
                  {project.deadlines.map((deadline) => (
                    <div 
                      key={deadline.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        deadline.completed 
                          ? isDarkMode ? 'bg-green-500/10' : 'bg-green-50' 
                          : isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex-1">
                        <div className={`font-medium ${
                          deadline.completed 
                            ? isDarkMode ? 'text-green-400 line-through' : 'text-green-900 line-through' 
                            : isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {deadline.name}
                        </div>
                        <div className={`text-sm capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {deadline.type} • {new Date(deadline.date).toLocaleDateString()}
                        </div>
                      </div>
                      {deadline.completed && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                        }`}>
                          Complete
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div>
                <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Completion</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.progress.tasks}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${project.progress.tasks}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deliverables Completion</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.progress.deliverables}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
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
                  <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {project.kpis.field && (
                      <>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Doors Knocked</p>
                          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.kpis.field.doorsKnocked}</p>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Conversations</p>
                          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.kpis.field.conversations}</p>
                        </div>
                        {project.kpis.field.persuasionRate && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Persuasion Rate</p>
                            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.kpis.field.persuasionRate}%</p>
                          </div>
                        )}
                      </>
                    )}
                    {project.kpis.digital && (
                      <>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>CTR</p>
                          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.kpis.digital.ctr}%</p>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>CPA</p>
                          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${project.kpis.digital.cpa}</p>
                        </div>
                        {project.kpis.digital.conversions && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-teal-500/10' : 'bg-teal-50'}`}>
                            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Conversions</p>
                            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.kpis.digital.conversions}</p>
                          </div>
                        )}
                      </>
                    )}
                    {project.kpis.fundraising && (
                      <>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Call Time (hrs)</p>
                          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.kpis.fundraising.callTime}</p>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pledges</p>
                          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.kpis.fundraising.pledges}</p>
                        </div>
                        {project.kpis.fundraising.avgDonation && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Donation</p>
                            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${project.kpis.fundraising.avgDonation}</p>
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
                  <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Budget</h3>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Allocated</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${project.budget.allocated.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Spent</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${project.budget.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Forecast</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${project.budget.forecast.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={`h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
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
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
              }`}>
                {tabs.find(t => t.id === activeTab)?.icon}
              </div>
              <h3 className={`mb-2 capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activeTab} Content</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Detailed {activeTab} view coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};