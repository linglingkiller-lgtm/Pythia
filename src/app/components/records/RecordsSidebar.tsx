import React from 'react';
import { 
  FolderOpen, 
  Clock, 
  Star, 
  User, 
  FileText, 
  DollarSign,
  MapPin,
  Scale,
  AlertCircle,
  Database,
  Bookmark,
  Plus
} from 'lucide-react';
import { type SavedView } from '../../data/recordsData';
import { useTheme } from '../../contexts/ThemeContext';

interface RecordsSidebarProps {
  activeCollection: string;
  onSelectCollection: (collectionId: string) => void;
  savedViews: SavedView[];
  recordCounts: {
    all: number;
    recent: number;
    starred: number;
    myRecords: number;
    clientDeliverables: number;
    budgets: number;
    canvassingReports: number;
    legislativeBriefs: number;
    complianceLogs: number;
    exportsSnapshots: number;
  };
}

export function RecordsSidebar({ 
  activeCollection, 
  onSelectCollection, 
  savedViews, 
  recordCounts 
}: RecordsSidebarProps) {
  const [showSaveViewModal, setShowSaveViewModal] = React.useState(false);
  const { isDarkMode } = useTheme();

  const collections = [
    { id: 'all', label: 'All Records', icon: FolderOpen, count: recordCounts.all },
    { id: 'recent', label: 'Recent', icon: Clock, count: recordCounts.recent },
    { id: 'starred', label: 'Starred', icon: Star, count: recordCounts.starred },
    { id: 'my-records', label: 'My Records', icon: User, count: recordCounts.myRecords },
    { type: 'divider' as const },
    { type: 'header' as const, label: 'By Type' },
    { id: 'client-deliverables', label: 'Client Deliverables', icon: FileText, count: recordCounts.clientDeliverables },
    { id: 'budgets', label: 'Budgets', icon: DollarSign, count: recordCounts.budgets },
    { id: 'canvassing-reports', label: 'Canvassing Reports', icon: MapPin, count: recordCounts.canvassingReports },
    { id: 'legislative-briefs', label: 'Legislative Briefs', icon: Scale, count: recordCounts.legislativeBriefs },
    { id: 'compliance-logs', label: 'Compliance Logs', icon: AlertCircle, count: recordCounts.complianceLogs },
    { id: 'exports-snapshots', label: 'Exports & Snapshots', icon: Database, count: recordCounts.exportsSnapshots },
  ];

  return (
    <div className={`w-64 border-r overflow-y-auto flex-shrink-0 ${
      isDarkMode
        ? 'bg-slate-900/40 border-white/10'
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-4">
        {/* Quick Collections */}
        <div className="space-y-1">
          {collections.map((item, idx) => {
            if (item.type === 'divider') {
              return <div key={idx} className={`my-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`} />;
            }
            if (item.type === 'header') {
              return (
                <div key={idx} className={`px-2 py-2 text-xs font-semibold uppercase tracking-wider mt-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {item.label}
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = activeCollection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectCollection(item.id!)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? isDarkMode
                      ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30'
                      : 'bg-amber-50 text-amber-700 font-medium border border-amber-200'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-slate-800/50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} className={isActive 
                    ? isDarkMode ? 'text-amber-300' : 'text-amber-600' 
                    : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  } />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? isDarkMode
                        ? 'bg-amber-500/30 text-amber-200'
                        : 'bg-amber-100 text-amber-700'
                      : isDarkMode
                      ? 'bg-slate-800 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Saved Views */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-2 py-2 mb-2">
            <div className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Saved Views
            </div>
            <button
              onClick={() => setShowSaveViewModal(true)}
              className={`p-1 rounded ${
                isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-100'
              }`}
              title="Save current filters as view"
            >
              <Plus size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </button>
          </div>

          <div className="space-y-1">
            {savedViews.length === 0 ? (
              <div className={`px-3 py-2 text-xs italic ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                No saved views yet
              </div>
            ) : (
              savedViews.map(view => {
                const isActive = activeCollection === `view-${view.id}`;
                return (
                  <button
                    key={view.id}
                    onClick={() => onSelectCollection(`view-${view.id}`)}
                    className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? isDarkMode
                          ? 'bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30'
                          : 'bg-purple-50 text-purple-700 font-medium'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-slate-800/50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Bookmark size={16} className={`flex-shrink-0 mt-0.5 ${
                      isActive 
                        ? isDarkMode ? 'text-purple-300' : 'text-purple-600' 
                        : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{view.name}</div>
                      {view.description && (
                        <div className={`text-xs mt-0.5 line-clamp-1 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {view.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Save Current View Button */}
        {activeCollection === 'all' && (
          <button
            onClick={() => setShowSaveViewModal(true)}
            className={`w-full mt-4 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-2 border border-dashed ${
              isDarkMode
                ? 'text-amber-300 hover:bg-amber-500/10 border-amber-500/30'
                : 'text-amber-600 hover:bg-amber-50 border-amber-300'
            }`}
          >
            <Plus size={16} />
            Save Current View
          </button>
        )}
      </div>

      {/* Save View Modal */}
      {showSaveViewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`rounded-lg shadow-xl max-w-md w-full p-6 ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Save View</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  View Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., My High Priority Deliverables"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-slate-900 border-white/10 text-white placeholder-gray-500 focus:ring-amber-500/50'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description (optional)
                </label>
                <textarea
                  placeholder="What does this view show?"
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-slate-900 border-white/10 text-white placeholder-gray-500 focus:ring-amber-500/50'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="share-view"
                  className="rounded border-gray-300"
                />
                <label htmlFor="share-view" className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Share with team
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSaveViewModal(false)}
                className={`px-4 py-2 text-sm rounded-lg ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-slate-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Save view');
                  setShowSaveViewModal(false);
                }}
                className={`px-4 py-2 text-sm rounded-lg text-white ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Save View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}