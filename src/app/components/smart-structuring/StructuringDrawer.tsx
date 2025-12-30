import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  TrendingUp, 
  Copy, 
  ChevronDown, 
  CheckCircle, 
  AlertTriangle,
  FolderKanban,
  Mail,
  Save,
  Plus,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { copyToClipboard } from '../../utils/clipboard';
import { useSmartStructuring } from '../../contexts/SmartStructuringContext';
import { useToast } from '../../contexts/ToastContext';
import type { ActionItem as ActionItemType } from '../../contexts/SmartStructuringContext';

type TabType = 'summary' | 'actions' | 'bundle' | 'drafts';

export function StructuringDrawer() {
  const { isOpen, closeStructuring, sourceText, sourceContext, result, isProcessing, processText } = useSmartStructuring();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [editedActionItems, setEditedActionItems] = useState<ActionItemType[]>([]);

  // Auto-process when drawer opens
  useEffect(() => {
    if (isOpen && !result && !isProcessing) {
      processText();
    }
  }, [isOpen]);

  // Update edited action items when result changes
  useEffect(() => {
    if (result) {
      setEditedActionItems(result.actionItems);
    }
  }, [result]);

  // Reset to summary tab when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab('summary');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSummary = () => {
    showToast('Summary saved to record', 'success');
  };

  const handleToggleActionItem = (id: string) => {
    setEditedActionItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleUpdateActionItem = (id: string, field: string, value: any) => {
    setEditedActionItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCreateTasks = () => {
    const selectedCount = editedActionItems.filter(item => item.selected).length;
    showToast(`${selectedCount} tasks created successfully`, 'success');
  };

  const handleCreateBundle = () => {
    showToast(`Task bundle "${result?.taskBundle.name}" created`, 'success');
  };

  const handleCopyDraft = async (content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      showToast('Draft copied to clipboard', 'success');
    } else {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleSaveDraft = (title: string) => {
    showToast(`"${title}" saved to Records`, 'success');
  };

  const handleCreateTaskFromDraft = (title: string) => {
    showToast(`Task created: Send "${title}"`, 'success');
  };

  const renderEntityChip = (entity: any) => {
    const colors = {
      bill: 'bg-blue-100 text-blue-700 border-blue-200',
      legislator: 'bg-purple-100 text-purple-700 border-purple-200',
      client: 'bg-green-100 text-green-700 border-green-200',
      committee: 'bg-orange-100 text-orange-700 border-orange-200',
      project: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    };

    return (
      <Chip
        key={entity.id}
        color={colors[entity.type as keyof typeof colors]}
        size="sm"
      >
        {entity.name}
      </Chip>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div
      className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-2xl z-[100000] flex flex-col border-l border-gray-200"
      style={{
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Smart Structuring</h2>
            <p className="text-xs text-gray-500">
              {sourceContext.type === 'bill' && `Bill: ${sourceContext.name}`}
              {sourceContext.type === 'client' && `Client: ${sourceContext.name}`}
              {sourceContext.type === 'record' && 'Record Notes'}
              {sourceContext.type === 'general' && 'Unstructured Text'}
            </p>
          </div>
        </div>
        <button
          onClick={closeStructuring}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'summary'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Summary
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'actions'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Action Items
        </button>
        <button
          onClick={() => setActiveTab('bundle')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'bundle'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          Task Bundle
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'drafts'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          Follow-Ups
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isProcessing && (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-slow-pulse mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">Processing text...</p>
            <p className="text-xs text-gray-500 mt-1">Extracting entities and generating structure</p>
          </div>
        )}

        {!isProcessing && result && (
          <>
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">Summary</h3>
                  <ul className="space-y-2">
                    {result.summary.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.summary.entities.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">Key Entities Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.summary.entities.map(entity => renderEntityChip(entity))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleSaveSummary}
                    color="purple"
                    size="sm"
                    className="w-full"
                  >
                    <Save className="w-4 h-4" />
                    Save Summary to Record
                  </Button>
                </div>
              </div>
            )}

            {/* Action Items Tab */}
            {activeTab === 'actions' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                    {editedActionItems.filter(item => item.selected).length} of {editedActionItems.length} selected
                  </h3>
                </div>

                <div className="space-y-3">
                  {editedActionItems.map(item => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 transition-all ${
                        item.selected ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleToggleActionItem(item.id)}
                          className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => handleUpdateActionItem(item.id, 'text', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-purple-500"
                          />

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                              <select
                                value={item.priority}
                                onChange={(e) => handleUpdateActionItem(item.id, 'priority', e.target.value)}
                                className={`w-full px-2 py-1.5 text-xs border rounded focus:outline-none focus:border-purple-500 ${getPriorityColor(item.priority)}`}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Owner</label>
                              <select
                                value={item.suggestedOwner}
                                onChange={(e) => handleUpdateActionItem(item.id, 'suggestedOwner', e.target.value)}
                                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-purple-500"
                              >
                                <option value="Current User">Current User</option>
                                <option value="Maria Garcia">Maria Garcia</option>
                                <option value="David Kim">David Kim</option>
                                <option value="Sarah Martinez">Sarah Martinez</option>
                                <option value="James Wilson">James Wilson</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
                              <input
                                type="date"
                                value={item.suggestedDueDate}
                                onChange={(e) => handleUpdateActionItem(item.id, 'suggestedDueDate', e.target.value)}
                                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          </div>

                          {item.linkedObjects.length > 0 && (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1.5">Linked Objects</label>
                              <div className="flex flex-wrap gap-1.5">
                                {item.linkedObjects.map(obj => renderEntityChip(obj))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Button
                    onClick={handleCreateTasks}
                    disabled={editedActionItems.filter(item => item.selected).length === 0}
                    color="purple"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4" />
                    Create {editedActionItems.filter(item => item.selected).length} Selected Tasks
                  </Button>
                  <Button
                    onClick={() => showToast('Adding tasks to existing project', 'info')}
                    color="gray"
                    size="sm"
                    className="w-full"
                  >
                    <FolderKanban className="w-4 h-4" />
                    Add to Existing Project
                  </Button>
                </div>
              </div>
            )}

            {/* Task Bundle Tab */}
            {activeTab === 'bundle' && (
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Bundle Name</label>
                  <input
                    type="text"
                    defaultValue={result.taskBundle.name}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-6">
                  {result.taskBundle.sections.map((section, sIdx) => (
                    <div key={sIdx}>
                      <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">{section.name}</h3>
                      <div className="space-y-2">
                        {section.tasks.map((task, tIdx) => (
                          <div
                            key={task.id}
                            className="border border-gray-200 rounded-lg p-3 bg-white hover:border-purple-300 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <p className="text-sm font-medium text-gray-900">{task.title}</p>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{task.owner}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            </div>

                            {task.dependency && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                                <AlertCircle className="w-3 h-3" />
                                <span>Depends on: {task.dependency}</span>
                              </div>
                            )}

                            {task.linkedObject && (
                              <div className="mt-2">
                                {renderEntityChip(task.linkedObject)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Button
                    onClick={handleCreateBundle}
                    color="purple"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4" />
                    Create Bundle
                  </Button>
                  <Button
                    onClick={() => showToast('Assigning collaborators...', 'info')}
                    color="gray"
                    size="sm"
                    className="w-full"
                  >
                    <User className="w-4 h-4" />
                    Assign Collaborators
                  </Button>
                  <Button
                    onClick={() => showToast('Bundle exported to Records', 'success')}
                    color="gray"
                    size="sm"
                    className="w-full"
                  >
                    <Save className="w-4 h-4" />
                    Export Bundle to Records
                  </Button>
                </div>
              </div>
            )}

            {/* Follow-Up Drafts Tab */}
            {activeTab === 'drafts' && (
              <div className="p-6 space-y-6">
                {result.followUpDrafts.map((draft, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">{draft.title}</h3>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans bg-gray-50 p-3 rounded border border-gray-200 mb-3">
                      {draft.content}
                    </pre>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopyDraft(draft.content)}
                        color="gray"
                        size="sm"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </Button>
                      <Button
                        onClick={() => handleSaveDraft(draft.title)}
                        color="gray"
                        size="sm"
                      >
                        <Save className="w-3 h-3" />
                        Save to Records
                      </Button>
                      <Button
                        onClick={() => handleCreateTaskFromDraft(draft.title)}
                        color="gray"
                        size="sm"
                      >
                        <Plus className="w-3 h-3" />
                        Create task: send this
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}