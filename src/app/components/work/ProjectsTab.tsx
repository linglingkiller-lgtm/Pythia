import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { LayoutGrid, List, Calendar as CalendarIcon, Users as UsersIcon, Plus, Filter, TrendingUp, Clock, AlertTriangle, CheckCircle, Sparkles, BarChart3, Target } from 'lucide-react';
import { mockProjects, type ProjectStage } from '../../data/workHubData';
import { ProjectsBoard } from './ProjectsBoard';
import { useTheme } from '../../contexts/ThemeContext';

interface ProjectsTabProps {
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToBill?: (billId: string) => void;
}

export function ProjectsTab({ onNavigateToClient, onNavigateToBill }: ProjectsTabProps) {
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = React.useState<'board' | 'list' | 'timeline' | 'workload'>('board');

  // Calculate project statistics
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => ['intake', 'discovery', 'strategy', 'execution', 'review'].includes(p.stage)).length;
  const deliveredProjects = mockProjects.filter(p => p.stage === 'delivered').length;
  const onHoldProjects = mockProjects.filter(p => p.stage === 'on-hold').length;
  const atRiskProjects = mockProjects.filter(p => p.status === 'at-risk' || p.status === 'overdue').length;
  const onTrackProjects = mockProjects.filter(p => p.status === 'on-track').length;

  // Calculate completion stats
  const totalTasks = mockProjects.reduce((sum, p) => sum + p.totalTasks, 0);
  const completedTasks = mockProjects.reduce((sum, p) => sum + p.completedTasks, 0);
  const totalDeliverables = mockProjects.reduce((sum, p) => sum + p.totalDeliverables, 0);
  const completedDeliverables = mockProjects.reduce((sum, p) => sum + p.completedDeliverables, 0);

  // Get projects by stage
  const projectsByStage = (stage: ProjectStage) => 
    mockProjects.filter(p => p.stage === stage).length;

  return (
    <div className="pb-32 w-full overflow-x-hidden">
      <div className="p-6 w-full">
        {/* Projects Board - Moved to Top */}
        <div className="mb-6">
          <div className={`rounded-xl backdrop-blur-xl border px-6 py-4 mb-4 transition-all ${
            isDarkMode
              ? 'bg-slate-800/40 border-white/10'
              : 'bg-white/80 border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Projects Pipeline
                </h2>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({mockProjects.length} total)
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* View Switcher */}
                <div className={`flex items-center gap-1 rounded p-1 ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                }`}>
                  <button
                    onClick={() => setViewMode('board')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'board' 
                        ? (isDarkMode ? 'bg-slate-600 text-white shadow-sm' : 'bg-white shadow-sm')
                        : (isDarkMode ? 'text-gray-400 hover:bg-slate-600/50 hover:text-gray-300' : 'hover:bg-gray-200')
                    }`}
                    title="Board View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list'
                        ? (isDarkMode ? 'bg-slate-600 text-white shadow-sm' : 'bg-white shadow-sm')
                        : (isDarkMode ? 'text-gray-400 hover:bg-slate-600/50 hover:text-gray-300' : 'hover:bg-gray-200')
                    }`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'timeline'
                        ? (isDarkMode ? 'bg-slate-600 text-white shadow-sm' : 'bg-white shadow-sm')
                        : (isDarkMode ? 'text-gray-400 hover:bg-slate-600/50 hover:text-gray-300' : 'hover:bg-gray-200')
                    }`}
                    title="Timeline View"
                  >
                    <CalendarIcon size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('workload')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'workload'
                        ? (isDarkMode ? 'bg-slate-600 text-white shadow-sm' : 'bg-white shadow-sm')
                        : (isDarkMode ? 'text-gray-400 hover:bg-slate-600/50 hover:text-gray-300' : 'hover:bg-gray-200')
                    }`}
                    title="Workload View"
                  >
                    <UsersIcon size={16} />
                  </button>
                </div>

                <Button variant="secondary">
                  <Filter size={16} />
                  Filter
                </Button>

                <Button variant="primary">
                  <Plus size={16} />
                  New Project
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'board' && (
            <ProjectsBoard
              projects={mockProjects}
              onNavigateToBill={onNavigateToBill}
            />
          )}

          {viewMode === 'list' && (
            <div className={`p-12 rounded-xl backdrop-blur-xl border transition-all ${
              isDarkMode
                ? 'bg-slate-800/40 border-white/10'
                : 'bg-white/80 border-gray-200'
            } shadow-lg`}>
              <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <List size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  List View
                </p>
                <p className="text-sm">Coming soon - comprehensive project list with sorting and filtering</p>
              </div>
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className={`p-12 rounded-xl backdrop-blur-xl border transition-all ${
              isDarkMode
                ? 'bg-slate-800/40 border-white/10'
                : 'bg-white/80 border-gray-200'
            } shadow-lg`}>
              <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <CalendarIcon size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Timeline View
                </p>
                <p className="text-sm">Coming soon - Gantt-style project timeline</p>
              </div>
            </div>
          )}

          {viewMode === 'workload' && (
            <div className={`p-12 rounded-xl backdrop-blur-xl border transition-all ${
              isDarkMode
                ? 'bg-slate-800/40 border-white/10'
                : 'bg-white/80 border-gray-200'
            } shadow-lg`}>
              <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <UsersIcon size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Workload View
                </p>
                <p className="text-sm">Coming soon - team capacity and project allocation</p>
              </div>
            </div>
          )}
        </div>

        {/* Header Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {/* Total Projects */}
          <div className={`p-5 rounded-lg backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-white/10'
              : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
          } shadow-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <LayoutGrid className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} size={20} />
              </div>
              <TrendingUp className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`} size={16} />
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {totalProjects}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Projects
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              {activeProjects} active
            </div>
          </div>

          {/* On Track */}
          <div className={`p-5 rounded-lg backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-white/10'
              : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
          } shadow-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
              }`}>
                <CheckCircle className={isDarkMode ? 'text-green-300' : 'text-green-600'} size={20} />
              </div>
              <Chip variant="success" size="sm">
                {Math.round((onTrackProjects / totalProjects) * 100)}%
              </Chip>
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {onTrackProjects}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              On Track
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
              Meeting deadlines
            </div>
          </div>

          {/* At Risk */}
          <div className={`p-5 rounded-lg backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-white/10'
              : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
          } shadow-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
              }`}>
                <AlertTriangle className={isDarkMode ? 'text-yellow-300' : 'text-yellow-600'} size={20} />
              </div>
              {atRiskProjects > 0 && (
                <Chip variant="warning" size="sm">
                  Alert
                </Chip>
              )}
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {atRiskProjects}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              At Risk
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
              Needs attention
            </div>
          </div>

          {/* Delivered */}
          <div className={`p-5 rounded-lg backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-white/10'
              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
          } shadow-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <Target className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} size={20} />
              </div>
              <Chip variant="success" size="sm">
                Done
              </Chip>
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {deliveredProjects}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Delivered
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              Successfully completed
            </div>
          </div>
        </div>

        {/* Progress Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tasks Progress */}
          <div className={`p-6 rounded-lg backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-slate-800/40 border-white/10'
              : 'bg-white/80 border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <CheckCircle className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} size={20} />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Overall Task Progress
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                </div>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.round((completedTasks / totalTasks) * 100)}%
              </div>
            </div>
            <div className={`w-full rounded-full h-3 ${
              isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
          </div>

          {/* Deliverables Progress */}
          <div className={`p-6 rounded-lg backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-slate-800/40 border-white/10'
              : 'bg-white/80 border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                  <BarChart3 className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} size={20} />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Deliverables Progress
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {completedDeliverables} of {totalDeliverables} deliverables
                  </p>
                </div>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.round((completedDeliverables / totalDeliverables) * 100)}%
              </div>
            </div>
            <div className={`w-full rounded-full h-3 ${
              isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <div
                className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                style={{ width: `${(completedDeliverables / totalDeliverables) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Revere Project Insights */}
        <div className={`p-6 rounded-lg backdrop-blur-xl border mb-6 transition-all ${
          isDarkMode
            ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'
            : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
        } shadow-lg`}>
          <div className="flex items-start gap-3 mb-4">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Sparkles className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} size={20} />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Revere Project Insights
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-powered recommendations for project optimization
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'
            }`}>
              <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Resource Optimization
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                3 projects could benefit from team reallocation based on workload analysis
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'
            }`}>
              <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Timeline Risks
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                2 projects may miss deadlines without intervention in the next 7 days
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'
            }`}>
              <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Client Satisfaction
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                All client deliverables on track for delivery within SLA commitments
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar - Removed (now at top with board) */}

        {/* Content - Removed (now at top with board) */}
      </div>
    </div>
  );
}