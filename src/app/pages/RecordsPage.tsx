import React from 'react';
import { Button } from '../components/ui/Button';
import { Search, Plus, Download, FileText, Archive, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { RecordsSidebar } from '../components/records/RecordsSidebar';
import { RecordsList } from '../components/records/RecordsList';
import { RecordPreviewPanel } from '../components/records/RecordPreviewPanel';
import { RecordsFilterBar } from '../components/records/RecordsFilterBar';
import { NewRecordModal } from '../components/records/NewRecordModal';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { 
  type Record, 
  type RecordFilters,
  type SavedView,
  mockSavedViews,
  searchRecords // Kept for client-side search on fetched data
} from '../data/recordsData';
import { useRecords, useRecordMutations } from '../hooks/useRecords';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';
import { getPageTheme, hexToRgba } from '../config/pageThemes';
import { toast } from 'sonner';

type SortOption = 'recent' | 'relevance' | 'client' | 'type' | 'owner' | 'most-used';

export function RecordsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<RecordFilters>({});
  
  // Use the hook for data fetching
  const { records, loading, error, refresh } = useRecords(filters);
  const { create, remove } = useRecordMutations();
  
  const [selectedRecord, setSelectedRecord] = React.useState<Record | null>(null);
  const [selectedRecords, setSelectedRecords] = React.useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = React.useState<SortOption>('recent');
  const [showNewRecordModal, setShowNewRecordModal] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [activeCollection, setActiveCollection] = React.useState<string>('all');
  const [savedViews] = React.useState<SavedView[]>(mockSavedViews);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState<Record | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { isDarkMode } = useTheme();

  // Get Records page theme
  const recordsTheme = getPageTheme('Records');

  // Scroll detection
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 20);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Search and filter records (client-side for now, on top of fetched records)
  // Note: searchRecords utility was designed for mockRecords, we adapt it to work on `records` array
  // We need to modify searchRecords or implement local logic here.
  // Since searchRecords imports mockRecords directly in the original file, we should COPY the logic 
  // or implement a local filter to avoid dependency on the static mock array.
  
  const filterRecordsLocally = (allRecords: Record[], query: string, currentFilters: RecordFilters) => {
    let results = [...allRecords];

    // Apply text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(r =>
        r.title.toLowerCase().includes(lowerQuery) ||
        r.summary?.toLowerCase().includes(lowerQuery) ||
        r.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        r.clientName?.toLowerCase().includes(lowerQuery) ||
        r.linkedBillNumbers.some(bill => bill.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply filters
    if (currentFilters) {
      if (currentFilters.types && currentFilters.types.length > 0) {
        results = results.filter(r => currentFilters.types!.includes(r.type));
      }
      if (currentFilters.statuses && currentFilters.statuses.length > 0) {
        results = results.filter(r => currentFilters.statuses!.includes(r.status));
      }
      if (currentFilters.clientIds && currentFilters.clientIds.length > 0) {
        results = results.filter(r => r.clientId && currentFilters.clientIds!.includes(r.clientId));
      }
      if (currentFilters.departments && currentFilters.departments.length > 0) {
        results = results.filter(r => r.department && currentFilters.departments!.includes(r.department));
      }
      if (currentFilters.owners && currentFilters.owners.length > 0) {
        results = results.filter(r => currentFilters.owners!.includes(r.createdBy));
      }
      if (currentFilters.tags && currentFilters.tags.length > 0) {
        results = results.filter(r => r.tags.some(tag => currentFilters.tags!.includes(tag)));
      }
      if (currentFilters.isAIGenerated !== undefined) {
        results = results.filter(r => r.isAIGenerated === currentFilters.isAIGenerated);
      }
      if (currentFilters.isStarred) {
        results = results.filter(r => r.isStarred);
      }
      if (currentFilters.dateFrom) {
        results = results.filter(r => new Date(r.createdAt) >= new Date(currentFilters.dateFrom!));
      }
      if (currentFilters.dateTo) {
        results = results.filter(r => new Date(r.createdAt) <= new Date(currentFilters.dateTo!));
      }
    }
    return results;
  };

  const filteredRecords = React.useMemo(() => {
    let results = filterRecordsLocally(records, searchQuery, filters);

    // Apply collection filters
    if (activeCollection === 'recent') {
      results = results.slice(0, 10);
    } else if (activeCollection === 'starred') {
      results = results.filter(r => r.isStarred);
    } else if (activeCollection === 'my-records') {
      results = results.filter(r => r.createdBy === 'user-001'); // TODO: Use real user ID
    } else if (activeCollection === 'client-deliverables') {
      results = results.filter(r => ['deliverable', 'brief', 'weekly-update', 'qbr-summary'].includes(r.type));
    } else if (activeCollection === 'budgets') {
      results = results.filter(r => r.type === 'budget');
    } else if (activeCollection === 'canvassing-reports') {
      results = results.filter(r => r.type === 'canvassing-report' || r.tags.includes('canvassing'));
    } else if (activeCollection === 'legislative-briefs') {
      results = results.filter(r => ['legislative-brief', 'testimony', 'amendment-memo'].includes(r.type));
    } else if (activeCollection === 'compliance-logs') {
      results = results.filter(r => r.type === 'compliance-log');
    } else if (activeCollection === 'exports-snapshots') {
      results = results.filter(r => ['export', 'snapshot'].includes(r.type));
    }

    // Apply saved view filter
    const activeView = savedViews.find(v => activeCollection === `view-${v.id}`);
    if (activeView) {
      results = filterRecordsLocally(records, searchQuery, activeView.filters);
      setSortBy(activeView.sortBy as SortOption);
    }

    // Sort results
    if (sortBy === 'recent') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'client') {
      results.sort((a, b) => (a.clientName || '').localeCompare(b.clientName || ''));
    } else if (sortBy === 'type') {
      results.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortBy === 'owner') {
      results.sort((a, b) => a.createdByName.localeCompare(b.createdByName));
    } else if (sortBy === 'most-used') {
      results.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    }

    return results;
  }, [records, searchQuery, filters, activeCollection, sortBy, savedViews]);

  const handleSelectRecord = (recordId: string) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId);
    } else {
      newSelected.add(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRecords.size === filteredRecords.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(filteredRecords.map(r => r.id)));
    }
  };

  const handleCreateRecord = async (recordData: any) => {
    try {
      await create(recordData, recordData.file);
      toast.success('Record created successfully');
      setShowNewRecordModal(false);
      refresh(); // Refresh list
    } catch (err: any) {
      console.error('Failed to create record:', err);
      toast.error('Failed to create record: ' + err.message);
    }
  };

  const handleBulkDownload = () => {
    console.log('Bulk download:', Array.from(selectedRecords));
    toast.info('Bulk download started');
    // TODO: Implement bulk download
  };

  const handleBulkArchive = () => {
    console.log('Bulk archive:', Array.from(selectedRecords));
    toast.info('Records archived');
    // TODO: Implement bulk archive
  };

  const handleExportIndex = () => {
    console.log('Export index of filtered records');
    toast.success('Export started');
    // TODO: Implement CSV export
  };

  const handleUpdateFilters = (newFilters: Partial<RecordFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const handleDeleteRequest = (record: Record) => {
    setRecordToDelete(record);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    
    setIsDeleting(true);
    try {
      await remove(recordToDelete.id);
      toast.success('Record deleted');
      if (selectedRecord?.id === recordToDelete.id) {
        setSelectedRecord(null); // Close panel if open
      }
      setRecordToDelete(null);
      refresh();
    } catch (err: any) {
      console.error('Failed to delete record:', err);
      toast.error('Failed to delete record: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof RecordFilters];
    return value !== undefined && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  // Dynamic subtitle based on filters and stats
  const getSubtitle = () => {
    const total = filteredRecords.length;
    const starred = filteredRecords.filter(r => r.isStarred).length;
    return `${total} records • ${starred} starred • ${activeCollection === 'all' ? 'All records' : activeCollection.replace(/-/g, ' ')}`;
  };


  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-orange-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Sticky Header */}
      <motion.div
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
              : 'bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg'
            : isDarkMode
            ? 'bg-slate-900/40 backdrop-blur-sm'
            : 'bg-white/40 backdrop-blur-sm'
        }`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Records" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(recordsTheme.gradientFrom, 0.12)}, ${hexToRgba(recordsTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(recordsTheme.gradientFrom, 0.08)}, ${hexToRgba(recordsTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(recordsTheme.accent, 0.25)
                    : hexToRgba(recordsTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(recordsTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(recordsTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(recordsTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(recordsTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <Archive
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? recordsTheme.glow : recordsTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: recordsTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? recordsTheme.glow : recordsTheme.accent,
                  }}
                >
                  Records
                </span>
              </motion.div>

              {/* Subtle breadcrumb-style divider */}
              <span
                className="text-sm font-medium"
                style={{
                  color: isDarkMode
                    ? hexToRgba('#FFFFFF', 0.2)
                    : hexToRgba('#000000', 0.15),
                }}
              >
                /
              </span>

              {/* Title + Subtitle */}
              <div>
                <motion.h1
                  className={`font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: '"Corpline", sans-serif' }}
                  animate={{
                    fontSize: isScrolled ? '20px' : '28px',
                    marginBottom: isScrolled ? '0px' : '4px',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  Document Archive
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
                  {getSubtitle()}
                </motion.p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNewRecordModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-white/10'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                } shadow-sm hover:shadow-md`}
              >
                <Plus size={16} />
                New Record
              </button>
              <button
                onClick={() => {/* TODO: Generate menu */}}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-white/10'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                } shadow-sm hover:shadow-md`}
              >
                <FileText size={16} />
                Generate
              </button>
              <button
                onClick={handleExportIndex}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all shadow-md hover:shadow-lg ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                }`}
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Gradient Accent Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mb-4" />

          {/* Global Search Bar */}
          <div className="relative mb-4">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, bill, project, legislator, keyword…"
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all ${
                isDarkMode
                  ? 'bg-slate-800/50 border border-white/10 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  : 'bg-white/80 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
              } focus:outline-none`}
            />
          </div>

          {/* Filter Chips */}
          {(activeFilterCount > 0 || searchQuery) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {searchQuery && (
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.types && filters.types.length > 0 && (
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1">
                  Type: {filters.types.length} selected
                  <button
                    onClick={() => handleUpdateFilters({ types: [] })}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.clientIds && filters.clientIds.length > 0 && (
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
                  Client: {filters.clientIds.length} selected
                  <button
                    onClick={() => handleUpdateFilters({ clientIds: [] })}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </div>
              )}
              <button
                onClick={handleClearFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Filters Toggle */}
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              {showFilters ? '− Hide' : '+ Show'} Advanced Filters
              {activeFilterCount > 0 && !showFilters && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="text-sm text-gray-600">
              {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Filter Bar */}
          {showFilters && (
            <RecordsFilterBar
              filters={filters}
              onUpdateFilters={handleUpdateFilters}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
      </motion.div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 overflow-hidden flex" ref={containerRef}>
        {/* Left Sidebar: Collections */}
        <RecordsSidebar
          activeCollection={activeCollection}
          onSelectCollection={setActiveCollection}
          savedViews={savedViews}
          recordCounts={{
            all: records.length,
            recent: 10, // Placeholder
            starred: records.filter(r => r.isStarred).length,
            myRecords: records.filter(r => r.createdBy === 'user-001').length,
            clientDeliverables: records.filter(r => ['deliverable', 'brief', 'weekly-update', 'qbr-summary'].includes(r.type)).length,
            budgets: records.filter(r => r.type === 'budget').length,
            canvassingReports: records.filter(r => r.type === 'canvassing-report' || r.tags.includes('canvassing')).length,
            legislativeBriefs: records.filter(r => ['legislative-brief', 'testimony', 'amendment-memo'].includes(r.type)).length,
            complianceLogs: records.filter(r => r.type === 'compliance-log').length,
            exportsSnapshots: records.filter(r => ['export', 'snapshot'].includes(r.type)).length,
          }}
        />

        {/* Middle Column: Records List */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading records...</p>
            </div>
          ) : error ? (
            <div className="p-4 m-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium">Failed to load records</h3>
                <p className="text-sm opacity-90">{error}</p>
              </div>
              <Button size="sm" variant="secondary" onClick={refresh}>Retry</Button>
            </div>
          ) : (
            <RecordsList
              records={filteredRecords}
              selectedRecords={selectedRecords}
              selectedRecord={selectedRecord}
              onSelectRecord={setSelectedRecord}
              onToggleSelect={handleSelectRecord}
              onSelectAll={handleSelectAll}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onBulkDownload={handleBulkDownload}
              onBulkArchive={handleBulkArchive}
              onDelete={handleDeleteRequest}
            />
          )}
        </div>

        {/* Right Column: Preview Panel */}
        {selectedRecord && (
          <RecordPreviewPanel
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            onDelete={handleDeleteRequest}
          />
        )}
      </div>

      {/* New Record Modal */}
      {showNewRecordModal && (
        <NewRecordModal
          onClose={() => setShowNewRecordModal(false)}
          onSave={handleCreateRecord}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!recordToDelete} onOpenChange={(open) => !open && setRecordToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{recordToDelete?.title}" and all attached files. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); // Prevent closing immediately to show loading state if needed, though usually we want to control open state
                handleDeleteConfirm();
              }} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}