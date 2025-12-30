import React, { useState } from 'react';
import { X, Rocket, DollarSign, Target, Mail, Users, Shield, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { projectTemplates } from '../../data/campaignData';
import type { ProjectTemplate } from '../../data/campaignData';

interface TemplateLibraryModalProps {
  onClose: () => void;
  onCreate: (templateData: any) => void;
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({ onClose, onCreate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'candidate-launch': return <Rocket size={24} className="text-blue-600" />;
      case 'fundraising': return <DollarSign size={24} className="text-green-600" />;
      case 'persuasion-digital': return <Target size={24} className="text-purple-600" />;
      case 'mail': return <Mail size={24} className="text-orange-600" />;
      case 'field-gotv': return <Users size={24} className="text-indigo-600" />;
      case 'debate-prep': return <Shield size={24} className="text-red-600" />;
      case 'ballot-chase': return <CheckCircle2 size={24} className="text-teal-600" />;
      default: return <FileText size={24} className="text-gray-600" />;
    }
  };

  const getTemplateColor = (type: string) => {
    switch (type) {
      case 'candidate-launch': return 'bg-blue-50 border-blue-200';
      case 'fundraising': return 'bg-green-50 border-green-200';
      case 'persuasion-digital': return 'bg-purple-50 border-purple-200';
      case 'mail': return 'bg-orange-50 border-orange-200';
      case 'field-gotv': return 'bg-indigo-50 border-indigo-200';
      case 'debate-prep': return 'bg-red-50 border-red-200';
      case 'ballot-chase': return 'bg-teal-50 border-teal-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-5xl h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-gray-900 mb-2">Campaign Project Templates</h2>
              <p className="text-sm text-gray-600">
                Pre-built project kits with stages, deliverables, and task bundles
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {!selectedTemplate ? (
            /* Template Grid */
            <div className="grid grid-cols-2 gap-4">
              {projectTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`rounded-lg border-2 p-5 cursor-pointer hover:shadow-lg transition-all ${getTemplateColor(template.type)}`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      {getTemplateIcon(template.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-gray-600">{template.estimatedDuration} days</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText size={14} className="text-gray-400" />
                      <span className="text-gray-600">{template.defaultDeliverables.length} deliverables</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{template.stages.length} stages</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{template.defaultTasks.length} tasks</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{template.defaultOwners.length} roles</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Template Detail */
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTemplate(null)}
                className="mb-4"
              >
                ← Back to Templates
              </Button>

              <div className={`rounded-lg border-2 p-6 mb-6 ${getTemplateColor(selectedTemplate.type)}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    {getTemplateIcon(selectedTemplate.type)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-gray-900 mb-2">{selectedTemplate.name}</h2>
                    <p className="text-gray-700">{selectedTemplate.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-lg font-bold text-gray-900">{selectedTemplate.estimatedDuration} days</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Deliverables</p>
                    <p className="text-lg font-bold text-gray-900">{selectedTemplate.defaultDeliverables.length}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Tasks</p>
                    <p className="text-lg font-bold text-gray-900">{selectedTemplate.defaultTasks.length}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Stages */}
                <div>
                  <h3 className="text-gray-900 mb-3">Project Stages</h3>
                  <div className="space-y-2">
                    {selectedTemplate.stages.map((stage, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{stage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Default Owners */}
                <div>
                  <h3 className="text-gray-900 mb-3">Default Team Roles</h3>
                  <div className="space-y-2">
                    {selectedTemplate.defaultOwners.map((owner, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {owner.replace('-', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h3 className="text-gray-900 mb-3">Deliverables</h3>
                  <div className="space-y-2">
                    {selectedTemplate.defaultDeliverables.map((deliverable, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{deliverable.name}</span>
                          <span className="text-xs text-gray-500">Day {deliverable.daysFromStart}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600 capitalize">{deliverable.type}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{deliverable.stage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <h3 className="text-gray-900 mb-3">Task Bundles</h3>
                  <div className="space-y-2">
                    {selectedTemplate.defaultTasks.map((task, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{task.name}</span>
                          <span className="text-xs text-gray-500">{task.estimatedHours}h</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600 capitalize">{task.owner.replace('-', ' ')}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{task.stage}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">Day {task.daysFromStart}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedTemplate && (
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                This template will create a complete project structure with all stages, deliverables, and tasks.
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={() => onCreate(selectedTemplate)}>
                  Create Project from Template
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};