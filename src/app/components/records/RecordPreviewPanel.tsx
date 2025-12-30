import React from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Copy, 
  Edit, 
  Star,
  Clock,
  User,
  Eye,
  FileText,
  Calendar,
  Tag,
  Share2,
  Sparkles,
  Paperclip,
  Loader2,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { type Record, getRecordTypeLabel } from '../../data/recordsData';
import { useTheme } from '../../contexts/ThemeContext';
import { useRecordMutations } from '../../hooks/useRecords';

interface RecordPreviewPanelProps {
  record: Record;
  onClose: () => void;
  onDelete: (record: Record) => void;
}

export function RecordPreviewPanel({ record, onClose, onDelete }: RecordPreviewPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'preview' | 'metadata' | 'activity'>('preview');
  const [attachments, setAttachments] = React.useState<any[]>([]);
  const [loadingAttachments, setLoadingAttachments] = React.useState(false);
  const { isDarkMode } = useTheme();
  const { getAttachments, downloadAttachment } = useRecordMutations();

  React.useEffect(() => {
    async function loadAttachments() {
      if (record.id.startsWith('rec-') && !record.id.includes('-real-')) {
        // Mock record logic
        if (record.fileUrl) {
          setAttachments([{
            id: 'att-mock',
            file_name: record.fileUrl.split('/').pop(),
            file_type: record.fileType,
            file_path: record.fileUrl
          }]);
        } else {
          setAttachments([]);
        }
        return;
      }

      setLoadingAttachments(true);
      try {
        const data = await getAttachments(record.id);
        setAttachments(data);
      } catch (err) {
        console.error('Failed to load attachments', err);
      } finally {
        setLoadingAttachments(false);
      }
    }

    loadAttachments();
  }, [record.id]);

  const handleDownloadFile = (filePath: string) => {
    downloadAttachment(filePath);
  };

  const handleDownload = () => {
    if (attachments.length > 0) {
      handleDownloadFile(attachments[0].file_path);
    } else if (record.fileUrl) {
      console.log('Downloading mock file:', record.fileUrl);
    }
  };

  const handleOpenFull = () => {
    console.log('Open full view:', record.id);
    // TODO: Implement full view
  };

  const handleDuplicate = () => {
    console.log('Duplicate record:', record.id);
    // TODO: Implement duplicate
  };

  const handleRename = () => {
    console.log('Rename record:', record.id);
    // TODO: Implement rename
  };

  const handleGenerateFollowUp = () => {
    console.log('Generate follow-up:', record.id);
    // TODO: Implement AI follow-up generation
  };

  return (
    <div className={`w-96 border-l flex flex-col flex-shrink-0 ${
      isDarkMode
        ? 'bg-slate-900/40 border-white/10'
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex-shrink-0 ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Chip variant="info" size="sm">
                {getRecordTypeLabel(record.type)}
              </Chip>
              {record.isAIGenerated && (
                <Chip variant="warning" size="sm">
                  <Sparkles size={12} className="mr-1" />
                  Revere
                </Chip>
              )}
            </div>
            <h2 className={`text-lg font-bold leading-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {record.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors flex-shrink-0 ${
              isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleOpenFull}>
            <ExternalLink size={14} />
            Open
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <Download size={14} />
          </Button>
          <Button variant="secondary" size="sm">
            <Star size={14} />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => onDelete(record)}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete Record"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b flex-shrink-0 ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'preview'
                ? isDarkMode
                  ? 'border-amber-500 text-amber-300'
                  : 'border-blue-600 text-blue-600'
                : isDarkMode
                ? 'border-transparent text-gray-500 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'metadata'
                ? isDarkMode
                  ? 'border-amber-500 text-amber-300'
                  : 'border-blue-600 text-blue-600'
                : isDarkMode
                ? 'border-transparent text-gray-500 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'activity'
                ? isDarkMode
                  ? 'border-amber-500 text-amber-300'
                  : 'border-blue-600 text-blue-600'
                : isDarkMode
                ? 'border-transparent text-gray-500 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'preview' && (
          <div className="space-y-4">
            {/* Summary */}
            {record.summary && (
              <div className={`p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{record.summary}</p>
              </div>
            )}

            {/* Content Preview */}
            {record.contentText && (
              <div className="prose prose-sm max-w-none">
                <div className={`text-sm whitespace-pre-wrap ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {record.contentText.substring(0, 500)}...
                </div>
              </div>
            )}

            {/* Attachments Section */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Paperclip size={12} />
                Attachments
              </div>
              
              {loadingAttachments ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 size={14} className="animate-spin" /> Loading attachments...
                </div>
              ) : attachments.length > 0 ? (
                <div className="space-y-2">
                  {attachments.map((att: any) => (
                    <div key={att.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-white/10 hover:border-blue-500/50' 
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <FileText size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {att.file_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {att.file_size ? `${(att.file_size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleDownloadFile(att.file_path)}
                        className="flex-shrink-0 ml-2"
                      >
                        <Download size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-sm italic ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  No attachments
                </div>
              )}
            </div>

            {/* No Content Fallback */}
            {!record.contentText && attachments.length === 0 && (
              <div className={`text-center py-8 text-sm ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                No preview available
              </div>
            )}
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-4">
            {/* Client & Project */}
            {record.clientName && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Client
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{record.clientName}</div>
              </div>
            )}

            {record.projectTitle && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Project
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{record.projectTitle}</div>
              </div>
            )}

            {/* Related Bills */}
            {record.linkedBillNumbers.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Related Bills
                </div>
                <div className="flex flex-wrap gap-1">
                  {record.linkedBillNumbers.map(billNum => (
                    <Chip key={billNum} variant="info" size="sm">
                      {billNum}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Related People */}
            {record.linkedPersonNames.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Related Legislators
                </div>
                <div className="flex flex-wrap gap-1">
                  {record.linkedPersonNames.map(name => (
                    <Chip key={name} variant="success" size="sm">
                      {name}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {record.tags.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Tags
                </div>
                <div className="flex flex-wrap gap-1">
                  {record.tags.map(tag => (
                    <Chip key={tag} variant="neutral" size="sm">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Department */}
            {record.department && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Department
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {record.department === 'public-affairs' && 'Public Affairs'}
                  {record.department === 'lobbying' && 'Lobbying'}
                  {record.department === 'campaign-services' && 'Campaign Services'}
                </div>
              </div>
            )}

            {/* Created Info */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Created By
              </div>
              <div className={`text-sm flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <User size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                {record.createdByName}
                <span className="text-gray-500">
                  on {new Date(record.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Last Modified */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Last Modified
              </div>
              <div className={`text-sm flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Clock size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                {new Date(record.lastModifiedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Version */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Version
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>v{record.version}</div>
              {record.parentRecordId && (
                <button className={`text-xs mt-1 ${
                  isDarkMode ? 'text-amber-400 hover:text-amber-300' : 'text-blue-600 hover:text-blue-700'
                }`}>
                  View previous versions
                </button>
              )}
            </div>

            {/* Visibility */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Visibility
              </div>
              <div className={`text-sm capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{record.visibility}</div>
            </div>

            {/* Status */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Status
              </div>
              <Chip 
                variant={
                  record.status === 'final' ? 'success' : 
                  record.status === 'sent' ? 'info' : 
                  'neutral'
                }
                size="sm"
              >
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </Chip>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-3">
            {record.activityLog.length === 0 ? (
              <div className={`text-center py-8 text-sm ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                No activity yet
              </div>
            ) : (
              record.activityLog.map(activity => (
                <div key={activity.id} className={`flex items-start gap-3 pb-3 border-b last:border-0 ${
                  isDarkMode ? 'border-white/10' : 'border-gray-100'
                }`}>
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
                  }`}>
                    {activity.action === 'created' && <FileText size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />}
                    {activity.action === 'viewed' && <Eye size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />}
                    {activity.action === 'downloaded' && <Download size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />}
                    {activity.action === 'edited' && <Edit size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />}
                    {activity.action === 'sent' && <Share2 size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />}
                    {activity.action === 'starred' && <Star size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />}
                    {activity.action === 'version-created' && <Copy size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium capitalize ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {activity.action.replace('-', ' ')}
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {activity.userName}
                    </div>
                    {activity.details && (
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.details}
                      </div>
                    )}
                    <div className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className={`p-4 border-t space-y-2 flex-shrink-0 ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <Button variant="secondary" size="sm" onClick={handleDuplicate} className="w-full justify-center">
          <Copy size={14} />
          Duplicate
        </Button>
        <Button variant="secondary" size="sm" onClick={handleRename} className="w-full justify-center">
          <Edit size={14} />
          Rename
        </Button>
        {record.isAIGenerated && (
          <Button variant="primary" size="sm" onClick={handleGenerateFollowUp} className="w-full justify-center">
            <Sparkles size={14} />
            Generate Follow-up
          </Button>
        )}
      </div>
    </div>
  );
}