import React from 'react';
import { X, ChevronDown, ChevronUp, Clock, CheckCircle2, AlertCircle, RotateCcw, FileText } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';

export interface ImportHistoryItem {
  id: string;
  timestamp: string;
  billNumber: string;
  status: 'success' | 'failed' | 'syncing';
  errorMessage?: string;
}

interface ImportsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  imports: ImportHistoryItem[];
  onRetryAll: () => void;
  onRetry: (id: string) => void;
}

export function ImportsPanel({ isOpen, onClose, imports, onRetryAll, onRetry }: ImportsPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const failedImports = imports.filter(i => i.status === 'failed');
  const successfulImports = imports.filter(i => i.status === 'success');
  const syncingImports = imports.filter(i => i.status === 'syncing');

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-6 w-96 bg-white border border-gray-300 rounded-t-lg shadow-2xl z-50 max-h-[500px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={18} />
          <span className="font-semibold">Recent Imports</span>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {imports.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <>
          {/* Summary Stats */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs text-gray-600">Syncing</div>
              <div className="text-lg font-semibold text-blue-600">{syncingImports.length}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Success</div>
              <div className="text-lg font-semibold text-green-600">{successfulImports.length}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Failed</div>
              <div className="text-lg font-semibold text-red-600">{failedImports.length}</div>
            </div>
          </div>

          {/* Actions */}
          {failedImports.length > 0 && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={onRetryAll}
                className="w-full text-xs"
              >
                <RotateCcw size={14} />
                Retry All Failed ({failedImports.length})
              </Button>
            </div>
          )}

          {/* Import List */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {imports.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <div className="text-sm">No recent imports</div>
              </div>
            ) : (
              imports.map(item => (
                <div
                  key={item.id}
                  className={`p-3 rounded border ${
                    item.status === 'failed'
                      ? 'bg-red-50 border-red-200'
                      : item.status === 'syncing'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900">
                        {item.billNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {item.status === 'success' && (
                        <CheckCircle2 size={16} className="text-green-600" />
                      )}
                      {item.status === 'failed' && (
                        <>
                          <AlertCircle size={16} className="text-red-600" />
                          <button
                            onClick={() => onRetry(item.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Retry
                          </button>
                        </>
                      )}
                      {item.status === 'syncing' && (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </div>
                  {item.errorMessage && (
                    <div className="text-xs text-red-700 mt-1">
                      {item.errorMessage}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
