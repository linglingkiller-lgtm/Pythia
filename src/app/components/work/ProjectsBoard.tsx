import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { FileText, Users, Layers, Calendar, AlertTriangle } from 'lucide-react';
import { type Project, type ProjectStage } from '../../data/workHubData';
import { useTheme } from '../../contexts/ThemeContext';

interface ProjectsBoardProps {
  projects: Project[];
  onNavigateToBill?: (billId: string) => void;
}

export function ProjectsBoard({ projects, onNavigateToBill }: ProjectsBoardProps) {
  const { isDarkMode } = useTheme();
  const stages: { id: ProjectStage; label: string }[] = [
    { id: 'intake', label: 'Concept' },
    { id: 'discovery', label: 'Draft' },
    { id: 'strategy', label: 'Proposal' },
    { id: 'execution', label: 'Execution' },
    { id: 'review', label: 'Review' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'on-hold', label: 'On Hold' },
  ];

  const getProjectsByStage = (stage: ProjectStage) => {
    return projects.filter(p => p.stage === stage);
  };

  return (
    <div className={`p-6 rounded-xl backdrop-blur-xl border transition-all ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    } shadow-lg`}>
      <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Projects Board
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
        {stages.map(stage => {
          const stageProjects = getProjectsByStage(stage.id);
          
          return (
            <div key={stage.id} className="flex flex-col">
              <div className={`rounded-t px-3 py-2 border-b-2 ${
                isDarkMode
                  ? 'bg-slate-700/50 border-slate-600'
                  : 'bg-gray-100 border-gray-300'
              }`}>
                <div className={`font-semibold text-sm ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {stage.label}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stageProjects.length} {stageProjects.length === 1 ? 'project' : 'projects'}
                </div>
              </div>
              
              <div className={`rounded-b p-2 space-y-2 min-h-[300px] flex-1 ${
                isDarkMode ? 'bg-slate-800/30' : 'bg-gray-50'
              }`}>
                {stageProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onNavigateToBill={onNavigateToBill}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  onNavigateToBill?: (billId: string) => void;
  isDarkMode: boolean;
}

function ProjectCard({ project, onNavigateToBill, isDarkMode }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    if (isDarkMode) {
      switch (status) {
        case 'on-track': return 'bg-green-500/20 text-green-300 border border-green-500/30';
        case 'at-risk': return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
        case 'overdue': return 'bg-red-500/20 text-red-300 border border-red-500/30';
        default: return 'bg-slate-700/50 text-gray-300 border border-slate-600';
      }
    } else {
      switch (status) {
        case 'on-track': return 'bg-green-100 text-green-800';
        case 'at-risk': return 'bg-yellow-100 text-yellow-800';
        case 'overdue': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <div className={`p-3 rounded border transition-all cursor-pointer ${
      isDarkMode
        ? 'bg-slate-900/50 border-white/10 hover:shadow-md hover:border-cyan-500/50'
        : 'bg-white border-gray-200 hover:shadow-md hover:border-blue-500'
    }`}>
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className={`font-semibold text-sm line-clamp-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {project.title}
          </h4>
          {project.status !== 'on-track' && (
            <AlertTriangle
              size={16}
              className={project.status === 'overdue' 
                ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                : (isDarkMode ? 'text-yellow-400' : 'text-yellow-600')
              }
            />
          )}
        </div>
        
        <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {project.clientName}
        </div>
        
        <div className="flex items-center gap-2">
          <Chip variant="neutral" size="sm" className={getStatusColor(project.status)}>
            {project.status.replace('-', ' ')}
          </Chip>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className={`flex items-center justify-between text-xs mb-1 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className={`w-full rounded-full h-1.5 ${
          isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
        }`}>
          <div
            className={`h-1.5 rounded-full ${
              project.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Metadata */}
      <div className={`space-y-2 mb-3 pb-3 border-b ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        {project.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Calendar size={12} />
            Due {new Date(project.dueDate).toLocaleDateString()}
          </div>
        )}
        
        <div className={`flex items-center gap-1 text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Users size={12} />
          {project.ownerName}
        </div>

        <div className={`flex items-center gap-3 text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>{project.completedTasks}/{project.totalTasks} tasks</span>
          <span>{project.completedDeliverables}/{project.totalDeliverables} deliverables</span>
        </div>
      </div>

      {/* Linked Objects */}
      {(project.linkedBillNumbers.length > 0 || project.linkedIssueNames.length > 0 || project.linkedPersonNames.length > 0) && (
        <div className="flex flex-wrap gap-1">
          {project.linkedBillNumbers.slice(0, 2).map(billNum => (
            <button
              key={billNum}
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToBill?.(billNum);
              }}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                isDarkMode
                  ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <FileText size={10} className="inline mr-1" />
              {billNum}
            </button>
          ))}
          
          {project.linkedIssueNames.slice(0, 1).map(issue => (
            <div key={issue} className={`px-2 py-0.5 rounded text-xs ${
              isDarkMode
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-purple-50 text-purple-700'
            }`}>
              <Layers size={10} className="inline mr-1" />
              {issue}
            </div>
          ))}
          
          {project.linkedPersonNames.slice(0, 1).map(person => (
            <div key={person} className={`px-2 py-0.5 rounded text-xs ${
              isDarkMode
                ? 'bg-green-500/20 text-green-300'
                : 'bg-green-50 text-green-700'
            }`}>
              <Users size={10} className="inline mr-1" />
              {person}
            </div>
          ))}
          
          {(project.linkedBillNumbers.length + project.linkedIssueNames.length + project.linkedPersonNames.length > 4) && (
            <div className={`px-2 py-0.5 rounded text-xs ${
              isDarkMode
                ? 'bg-slate-700/50 text-gray-400'
                : 'bg-gray-100 text-gray-600'
            }`}>
              +{project.linkedBillNumbers.length + project.linkedIssueNames.length + project.linkedPersonNames.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
}