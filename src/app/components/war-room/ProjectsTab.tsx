import React, { useState } from 'react';
import { LayoutGrid, List, Calendar as CalendarIcon, Users as UsersIcon, AlertTriangle, CheckCircle2, Clock, DollarSign, TrendingUp, Briefcase, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { campaignProjects } from '../../data/campaignData';
import type { CampaignProject } from '../../data/campaignData';
import { ProjectDrawer } from './ProjectDrawer';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'motion/react';

interface ProjectsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: any;
  setFilters: (filters: any) => void;
  onNewProject?: () => void;
}

type ViewMode = 'board' | 'list' | 'timeline' | 'workload';

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ searchQuery, setSearchQuery, filters, setFilters, onNewProject }) => {
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [selectedProject, setSelectedProject] = useState<CampaignProject | null>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const stages = ['drafting', 'proposal', 'build', 'launch', 'review', 'completed', 'on-hold'] as const;

  const getProjectsByStage = (stage: typeof stages[number]) => {
    return campaignProjects.filter(p => p.stage === stage);
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const ProjectCard: React.FC<{ project: CampaignProject }> = ({ project }) => (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedProject(project)}
    >
      {/* Header */}
      <div className="mb-3">
        <h4 className="text-gray-900 mb-1">{project.title}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>{project.clientName}</span>
          <span>•</span>
          <span>{project.districtName}</span>
        </div>
      </div>

      {/* Type badge */}
      <div className="mb-3">
        <span className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
          {project.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </span>
      </div>

      {/* Owners */}
      <div className="flex items-center gap-2 mb-3">
        {project.owners.map((owner, idx) => (
          <div 
            key={owner.id}
            className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-medium"
            title={owner.name}
          >
            {owner.name.split(' ').map(n => n[0]).join('')}
          </div>
        ))}
      </div>

      {/* Deadlines */}
      <div className="mb-3 space-y-1">
        {project.deadlines.slice(0, 2).map((deadline) => (
          <div key={deadline.id} className="flex items-center gap-2 text-xs">
            {deadline.completed ? (
              <CheckCircle2 size={12} className="text-green-600" />
            ) : (
              <Clock size={12} className="text-gray-400" />
            )}
            <span className={deadline.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
              {deadline.name}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{new Date(deadline.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        ))}
        {project.deadlines.length > 2 && (
          <div className="text-xs text-gray-500 ml-5">+{project.deadlines.length - 2} more</div>
        )}
      </div>

      {/* Progress bars */}
      <div className="mb-3 space-y-2">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Tasks</span>
            <span>{project.progress.tasks}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full" 
              style={{ width: `${project.progress.tasks}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Deliverables</span>
            <span>{project.progress.deliverables}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full" 
              style={{ width: `${project.progress.deliverables}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPIs snapshot */}
      {project.kpis && (
        <div className="mb-3 p-2 bg-gray-50 rounded-md">
          {project.kpis.field && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Doors / Convos</span>
              <span className="font-medium text-gray-900">
                {project.kpis.field.doorsKnocked} / {project.kpis.field.conversations}
              </span>
            </div>
          )}
          {project.kpis.digital && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">CTR</span>
                <span className="font-medium text-gray-900">{project.kpis.digital.ctr}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">CPA</span>
                <span className="font-medium text-gray-900">${project.kpis.digital.cpa}</span>
              </div>
            </div>
          )}
          {project.kpis.fundraising && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Pledges / Avg</span>
              <span className="font-medium text-gray-900">
                {project.kpis.fundraising.pledges} / ${project.kpis.fundraising.avgDonation}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Budget */}
      {project.budget && (
        <div className="mb-3 flex items-center gap-2 text-xs">
          <DollarSign size={12} className="text-gray-400" />
          <span className="text-gray-600">
            ${(project.budget.spent / 1000).toFixed(0)}K / ${(project.budget.allocated / 1000).toFixed(0)}K
          </span>
          <span className={`ml-auto px-1.5 py-0.5 rounded ${
            project.budget.spent > project.budget.allocated ? 'bg-red-100 text-red-700' :
            project.budget.spent / project.budget.allocated > 0.8 ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {Math.round((project.budget.spent / project.budget.allocated) * 100)}%
          </span>
        </div>
      )}

      {/* Risk flags */}
      {project.riskFlags.length > 0 && (
        <div className="space-y-1">
          {project.riskFlags.map((risk, idx) => (
            <div key={idx} className={`flex items-center gap-2 px-2 py-1 rounded-md border text-xs ${getRiskColor(risk.severity)}`}>
              <AlertTriangle size={12} />
              <span>{risk.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`h-full flex flex-col relative overflow-hidden transition-colors duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-purple-50/30 via-white to-gray-50/30'
    }`}>
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Gradient overlay at top */}
      <div className={`absolute top-0 left-0 right-0 h-40 pointer-events-none transition-opacity duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-b from-purple-900/20 to-transparent'
          : 'bg-gradient-to-b from-purple-50/40 to-transparent'
      }`} />

      {/* Header - Sticky with Glassmorphism */}
      <motion.div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-900/40 border-b border-white/[0.08]'
            : 'bg-white/40 border-b border-gray-200/50'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        animate={{
          paddingTop: isScrolled ? '12px' : '24px',
          paddingBottom: isScrolled ? '12px' : '16px',
        }}
      >
        {/* Subtle gradient accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        <div className="px-8">
          {/* Top Header Row */}
          <div className="flex items-center justify-between mb-5">
            {/* Left: Badge + Title + Subtitle */}
            <div className="flex items-center gap-4">
              {/* Badge Capsule - Project Management */}
              <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium
                ${isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-slate-300' 
                  : 'bg-white border-gray-200 text-gray-600 shadow-sm'
                }
              `}>
                <Briefcase size={12} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                <span>Project Management</span>
              </div>

              {/* Vertical divider */}
              <div
                className={`h-8 w-px ${
                  isDarkMode ? 'bg-white/10' : 'bg-gray-300'
                }`}
              />

              {/* Title + Subtitle */}
              <div>
                <motion.h1
                  className={`font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  animate={{
                    fontSize: isScrolled ? '20px' : '28px',
                    marginBottom: isScrolled ? '0px' : '4px',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  Projects
                </motion.h1>
                <motion.p
                  className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}
                  animate={{
                    opacity: isScrolled ? 0 : 1,
                    height: isScrolled ? 0 : 'auto',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {campaignProjects.length} Active Projects • Campaign Workflow & Deliverables
                </motion.p>
              </div>
            </div>

            {/* Middle: Search Bar (Added) */}
            <div className="flex-1 max-w-md px-8">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    w-full pl-9 pr-4 py-1.5 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                    }
                  `}
                />
              </div>
            </div>

            {/* Right: View Mode Toggles */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center rounded-xl p-1 ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setViewMode('board')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'board'
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-white text-purple-700 shadow-md'
                      : isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid size={16} />
                  <span className="text-sm font-medium">Board</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-white text-purple-700 shadow-md'
                      : isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={16} />
                  <span className="text-sm font-medium">List</span>
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'timeline'
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-white text-purple-700 shadow-md'
                      : isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CalendarIcon size={16} />
                  <span className="text-sm font-medium">Timeline</span>
                </button>
                <button
                  onClick={() => setViewMode('workload')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'workload'
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-white text-purple-700 shadow-md'
                      : isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <UsersIcon size={16} />
                  <span className="text-sm font-medium">Workload</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 relative z-10">
        {/* Board View */}
        {viewMode === 'board' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map((stage) => {
              const stageProjects = getProjectsByStage(stage);
              return (
                <div key={stage} className="flex-shrink-0 w-80">
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <h3 className={`capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stage.replace('-', ' ')}</h3>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        isDarkMode
                          ? 'bg-slate-700 text-gray-300'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {stageProjects.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`space-y-3 rounded-lg p-3 min-h-[400px] ${
                    isDarkMode ? 'bg-slate-800/40' : 'bg-gray-50'
                  }`}>
                    {stageProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                    
                    {stageProjects.length === 0 && (
                      <div className={`text-center py-8 text-sm ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        No projects in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {campaignProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{project.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{project.clientName}</span>
                      <span>•</span>
                      <span>{project.districtName}</span>
                      <span>•</span>
                      <span className="capitalize">{project.stage.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Owners */}
                    <div className="flex -space-x-2">
                      {project.owners.map((owner) => (
                        <div 
                          key={owner.id}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                          title={owner.name}
                        >
                          {owner.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                    </div>

                    {/* Progress */}
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((project.progress.tasks + project.progress.deliverables) / 2)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${(project.progress.tasks + project.progress.deliverables) / 2}%` }}
                        />
                      </div>
                    </div>

                    {/* Next deadline */}
                    <div className="w-40 text-sm text-gray-600">
                      {project.deadlines.find(d => !d.completed) && (
                        <>
                          <div className="font-medium text-gray-900">
                            {new Date(project.deadlines.find(d => !d.completed)!.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs truncate">
                            {project.deadlines.find(d => !d.completed)!.name}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Risk badge */}
                    {project.riskFlags.length > 0 && (
                      <AlertTriangle size={20} className="text-orange-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline and Workload views placeholder */}
        {(viewMode === 'timeline' || viewMode === 'workload') && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <CalendarIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2 capitalize">{viewMode} View</h3>
            <p className="text-gray-600">Gantt-style timeline and workload distribution coming soon</p>
          </div>
        )}

        {/* Project Drawer */}
        {selectedProject && (
          <ProjectDrawer 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </div>
    </div>
  );
};