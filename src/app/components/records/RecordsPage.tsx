import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, Plus, Download, FileText, Archive, AlertTriangle, RefreshCw, Loader2,
  Bell, Settings, User, Sparkles, Menu, ChevronDown, LogOut, Star, FolderOpen
} from 'lucide-react';
import { Button } from '../components/ui/Button';
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
} from '../data/recordsData';
import { useRecords, useRecordMutations } from '../hooks/useRecords';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { getPageTheme, hexToRgba } from '../config/pageThemes';
import { toast } from 'sonner';
import { PageLayout } from '../components/ui/PageLayout';

type SortOption = 'recent' | 'relevance' | 'client' | 'type' | 'owner' | 'most-used';

export function RecordsPage() {
  const { isDarkMode } = useTheme();
  
  // Page State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<RecordFilters>({});
  const { records, loading, error, refresh } = useRecords(filters);
  const { create, remove } = useRecordMutations();
  
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const [savedViews] = useState<SavedView[]>(mockSavedViews);
  const [recordToDelete, setRecordToDelete] = useState<Record | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination & Performance
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, filters, activeCollection, sortBy]);

  // Get Records page theme
  const recordsTheme = getPageTheme('Records');

  const filteredRecords = useMemo(() => {
    let results = [...records];

    // Filter Logic
    if (debouncedSearchQuery) {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      results = results.filter(r =>
        r.title.toLowerCase().includes(lowerQuery) ||
        r.summary?.toLowerCase().includes(lowerQuery) ||
        r.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        r.clientName?.toLowerCase().includes(lowerQuery) ||
        r.linkedBillNumbers.some(bill => bill.toLowerCase().includes(lowerQuery))
      );
    }

    if (filters) {
      if (filters.types && filters.types.length > 0) {
        results = results.filter(r => filters.types!.includes(r.type));
      }
      if (filters.statuses && filters.statuses.length > 0) {
        results = results.filter(r => filters.statuses!.includes(r.status));
      }
      if (filters.clientIds && filters.clientIds.length > 0) {
        results = results.filter(r => r.clientId && filters.clientIds!.includes(r.clientId));
      }
    }

    // Apply collection filters
    if (activeCollection === 'recent') {
      results = results.slice(0, 10);
    } else if (activeCollection === 'starred') {
      results = results.filter(r => r.isStarred);
    } else if (activeCollection === 'my-records') {
      results = results.filter(r => r.createdBy === 'user-001');
    }

    // Sort results
    if (sortBy === 'recent') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'client') {
      results.sort((a, b) => (a.clientName || '').localeCompare(b.clientName || ''));
    }

    return results;
  }, [records, debouncedSearchQuery, filters, activeCollection, sortBy, savedViews]);

  const displayedRecords = filteredRecords.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = displayedRecords.length < filteredRecords.length;

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
      refresh();
    } catch (err: any) {
      console.error('Failed to create record:', err);
      toast.error('Failed to create record: ' + err.message);
    }
  };

  const handleExportIndex = () => {
    toast.success('Export started');
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
        setSelectedRecord(null);
      }
      setRecordToDelete(null);
      refresh();
    } catch (err: any) {
      toast.error('Failed to delete record: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const starredCount = filteredRecords.filter(r => r.isStarred).length;

  return (
    <PageLayout
      title="Document Archive"
      subtitle={activeCollection === 'all' ? 'All records' : activeCollection.replace(/-/g, ' ')}
      headerIcon={<Archive size={28} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />}
      backgroundImage={<Archive size={450} color={isDarkMode ? 'white' : recordsTheme.accent} strokeWidth={0.5} />}
      accentColor={recordsTheme.accent}
      contentClassName="flex-1 overflow-hidden flex"
      headerContent={
        <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                <FolderOpen size={14} strokeWidth={2.5} />
                <span className="text-xs font-bold">{filteredRecords.length} Documents</span>
            </div>
            {starredCount > 0 && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                    <Star size={14} strokeWidth={2.5} />
                    <span className="text-xs font-bold">{starredCount} Starred</span>
                </div>
            )}
        </div>
      }
      pageActions={
        <div className="flex items-center gap-3">
            <button
                onClick={() => setShowNewRecordModal(true)}
                className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg
                ${isDarkMode 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }
                `}
            >
                <Plus size={16} />
                New Record
            </button>
            <button
                onClick={handleExportIndex}
                className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
                ${isDarkMode 
                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' 
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }
                `}
            >
                <Download size={16} />
                Export
            </button>
        </div>
      }
    >
        {/* Left Sidebar: Collections */}
        <div className={`
          w-64 border-r overflow-y-auto flex-shrink-0 transition-colors duration-500
          ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}
        `}>
          <RecordsSidebar
            activeCollection={activeCollection}
            onSelectCollection={setActiveCollection}
            savedViews={savedViews}
            recordCounts={{
              all: records.length,
              recent: 10,
              starred: records.filter(r => r.isStarred).length,
              myRecords: records.filter(r => r.createdBy === 'user-001').length,
              clientDeliverables: records.filter(r => ['deliverable', 'brief', 'weekly-update', 'qbr-summary'].includes(r.type)).length,
              budgets: records.filter(r => r.type === 'budget').length,
              canvassingReports: records.filter(r => r.type === 'canvassing-report' || r.tags.includes('canvassing')).length,
              legislativeBriefs: records.filter(r => ['legislative-brief', 'testimony', 'amendment-memo'].includes(r.type)).length,
              complianceLogs: records.filter(r => r.type === 'compliance-report').length,
            }}
          />
        </div>

        {/* Main Content Area: List + Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <RecordsFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onClearFilters={handleClearFilters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode="list"
            onViewModeChange={() => {}}
            selectedCount={selectedRecords.size}
            onBulkAction={() => {}}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Records List */}
            <div className={`flex-1 overflow-y-auto transition-all duration-300 ${selectedRecord ? 'border-r' : ''} ${
              isDarkMode ? 'border-white/10' : 'border-gray-200'
            }`}>
              <RecordsList
                records={displayedRecords}
                loading={loading}
                selectedRecordId={selectedRecord?.id || null}
                onSelectRecord={setSelectedRecord}
                selectedRecordIds={selectedRecords}
                onToggleSelectRecord={handleSelectRecord}
                onSelectAll={handleSelectAll}
                sortBy={sortBy}
              />
              {hasMore && (
                <div className="flex justify-center pt-6 pb-4">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className={`
                      px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm
                      ${isDarkMode 
                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                        : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    Load More Documents
                  </button>
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <AnimatePresence mode="wait">
              {selectedRecord && (
                <RecordPreviewPanel
                  record={selectedRecord}
                  onClose={() => setSelectedRecord(null)}
                  onDelete={() => handleDeleteRequest(selectedRecord)}
                  onEdit={() => {}}
                  onShare={() => {}}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

      {/* New Record Modal */}
      {showNewRecordModal && (
        <NewRecordModal
          isOpen={showNewRecordModal}
          onClose={() => setShowNewRecordModal(false)}
          onCreate={handleCreateRecord}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!recordToDelete} onOpenChange={(open) => !open && setRecordToDelete(null)}>
        <AlertDialogContent className={isDarkMode ? 'bg-slate-900 border-white/10 text-white' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
              This action cannot be undone. This will permanently delete the record
              "{recordToDelete?.title}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700 border-white/10' : ''}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
}