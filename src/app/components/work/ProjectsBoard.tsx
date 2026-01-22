import React, { useState } from 'react';
import { Chip } from '../ui/Chip';
import { FileText, Users, Layers, AlertTriangle, MoreHorizontal, Calendar, Zap, CheckCircle2 } from 'lucide-react';
import { type Project, type ProjectStage } from '../../data/workHubData';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsBoardProps {
  projects: Project[];
  onNavigateToBill?: (billId: string) => void;
  onProjectClick: (project: Project) => void;
}

export function ProjectsBoard({ projects, onNavigateToBill, onProjectClick }: ProjectsBoardProps) {
  const { isDarkMode } = useTheme();
  
  const stages: { id: ProjectStage; label: string; color: string }[] = [
    { id: 'intake', label: 'Concept', color: 'bg-gray-500' },
    { id: 'discovery', label: 'Drafting', color: 'bg-blue-500' },
    { id: 'strategy', label: 'Proposal', color: 'bg-purple-500' },
    { id: 'execution', label: 'Execution', color: 'bg-indigo-500' },
    { id: 'review', label: 'Review', color: 'bg-orange-500' },
    { id: 'delivered', label: 'Delivered', color: 'bg-emerald-500' },
  ];

  const getProjectsByStage = (stage: ProjectStage) => {
    return projects.filter(p => p.stage === stage);
  };

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-6 min-h-[600px] w-full px-2">
          {stages.map(stage => {
              const stageProjects = getProjectsByStage(stage.id);
              
              return (
                  <div key={stage.id} className="flex flex-col w-[320px] flex-shrink-0 group">
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-4 px-1">
                          <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                              <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                  {stage.label}
                              </span>
                              <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                                  isDarkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-500'
                              }`}>
                                  {stageProjects.length}
                              </span>
                          </div>
                          <button className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              <MoreHorizontal size={14} />
                          </button>
                      </div>

                      {/* Draggable Area (Visual only for now) */}
                      <div className="flex flex-col gap-3 h-full">
                          {stageProjects.map((project, index) => (
                              <SmartProjectCard
                                  key={project.id}
                                  project={project}
                                  onClick={() => onProjectClick(project)}
                                  isDarkMode={isDarkMode}
                                  index={index}
                              />
                          ))}
                          
                          {/* Empty State / Drop Zone */}
                          <div className={`
                              flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-transparent transition-all
                              ${stageProjects.length === 0 ? 'opacity-50' : 'opacity-0'}
                              group-hover:border-gray-200 dark:group-hover:border-white/5
                          `}>
                              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                  Drop here
                              </span>
                          </div>
                      </div>
                  </div>
              );
          })}
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// Smart Project Card (V2)
// ----------------------------------------------------------------------

interface SmartProjectCardProps {
  project: Project;
  onClick: () => void;
  isDarkMode: boolean;
  index: number;
}

function SmartProjectCard({ project, onClick, isDarkMode, index }: SmartProjectCardProps) {
  
  // Status Logic
  const isAtRisk = project.status === 'at-risk' || project.status === 'overdue';
  const progressColor = project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500';
  const confidence = project.confidenceScore || 0;

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -4 }}
        onClick={onClick}
        className={`
            relative p-4 rounded-xl border transition-all duration-300 cursor-pointer group shadow-sm
            ${isDarkMode 
                ? 'bg-[#121214] border-white/5 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/10' 
                : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5'
            }
        `}
    >
        {/* Top Label: Client & Pythia Score */}
        <div className="flex items-start justify-between mb-3">
             <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {project.clientName}
             </div>
             {confidence > 0 && (
                 <div className="relative group/score">
                    <svg width="24" height="24" viewBox="0 0 36 36" className="transform -rotate-90">
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={isDarkMode ? '#333' : '#eee'}
                            strokeWidth="4"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={confidence > 80 ? '#10b981' : '#f59e0b'}
                            strokeWidth="4"
                            strokeDasharray={`${confidence}, 100`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap size={10} className={confidence > 80 ? 'text-emerald-500' : 'text-amber-500'} fill="currentColor" />
                    </div>
                 </div>
             )}
        </div>

        {/* Title & Alert */}
        <div className="flex items-start justify-between gap-3 mb-4">
            <h4 className={`font-bold text-sm leading-snug ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {project.title}
            </h4>
        </div>

        {/* Micro-Metrics Row */}
        <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {project.completedTasks}/{project.totalTasks}
                </span>
            </div>
            {project.budgetUsed && (
                <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>$</span>
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {Math.round((project.budgetUsed / (project.budgetTotal || 1)) * 100)}%
                    </span>
                </div>
            )}
             {project.dueDate && (
                <div className={`flex items-center gap-1.5 ml-auto text-xs ${
                    isAtRisk 
                        ? (isDarkMode ? 'text-red-400' : 'text-red-600') 
                        : (isDarkMode ? 'text-gray-500' : 'text-gray-500')
                }`}>
                    <Calendar size={12} />
                    <span>{new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
            )}
        </div>

        {/* Progress Line */}
        <div className="relative h-1 w-full rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden mb-4">
            <div 
                className={`absolute left-0 top-0 bottom-0 rounded-full ${progressColor}`} 
                style={{ width: `${project.progress}%` }}
            />
        </div>

        {/* Footer: Ecosystem Tags */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-dashed border-gray-100 dark:border-white/5">
            {/* Owner Avatar + Tag */}
            <div className="flex items-center gap-1 pr-2 border-r border-gray-100 dark:border-white/5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white bg-gradient-to-br from-blue-500 to-purple-500`}>
                    {project.ownerName[0]}
                </div>
            </div>

            {/* Bill Tags */}
            {project.linkedBillNumbers.slice(0, 2).map(bill => (
                <span key={bill} className={`
                    text-[10px] font-semibold px-2 py-0.5 rounded-md border
                    ${isDarkMode 
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                        : 'bg-blue-50 border-blue-100 text-blue-600'
                    }
                `}>
                    {bill}
                </span>
            ))}
            
            {/* Custom Tags */}
            {project.tags?.slice(0, 1).map(tag => (
                <span key={tag} className={`
                    text-[10px] font-medium px-2 py-0.5 rounded-md border
                    ${isDarkMode 
                        ? 'bg-white/5 border-white/10 text-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }
                `}>
                    {tag}
                </span>
            ))}
        </div>
    </motion.div>
  );
}
