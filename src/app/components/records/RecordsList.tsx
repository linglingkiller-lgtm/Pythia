import React from 'react';
import { 
  Star, 
  Pin, 
  Download, 
  MoreVertical, 
  Check,
  FileText,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { Chip } from '../ui/Chip';
import { type Record, getRecordTypeLabel, getRecordTypeColor } from '../../data/recordsData';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';

type SortOption = 'recent' | 'relevance' | 'client' | 'type' | 'owner' | 'most-used';

interface RecordsListProps {
  records: Record[];
  selectedRecords: Set<string>;
  selectedRecord: Record | null;
  onSelectRecord: (record: Record) => void;
  onToggleSelect: (recordId: string) => void;
  onSelectAll: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onBulkDownload: () => void;
  onBulkArchive: () => void;
  onDelete: (record: Record) => void;
}

export function RecordsList({
  records,
  selectedRecords,
  selectedRecord,
  onSelectRecord,
  onToggleSelect,
  onSelectAll,
  sortBy,
  onSortChange,
  onBulkDownload,
  onBulkArchive,
  onDelete
}: RecordsListProps) {
  const [hoveredRecord, setHoveredRecord] = React.useState<string | null>(null);
  const { isDarkMode } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-blue-600 bg-blue-50';
      case 'final': return 'text-green-600 bg-green-50';
      case 'sent': return 'text-purple-600 bg-purple-50';
      case 'archived': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleStarRecord = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Toggle star:', recordId);
    // TODO: Implement star toggle
  };

  const handlePinRecord = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Toggle pin:', recordId);
    // TODO: Implement pin toggle
  };

  const handleDownloadRecord = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Download record:', recordId);
    // TODO: Implement download
  };

  const handleDeleteClick = (record: Record, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(record);
  };

  return (
    <div className={`flex-1 flex flex-col border-r ${
      isDarkMode
        ? 'bg-slate-900/20 border-white/10'
        : 'bg-white border-gray-200'
    }`}>
      {/* List Header */}
      <div className={`px-4 py-3 border-b flex-shrink-0 ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Select All Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedRecords.size === records.length && records.length > 0}
                onChange={onSelectAll}
                className="rounded border-gray-300"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className={`text-sm rounded-lg focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-800 border-white/10 text-white focus:ring-amber-500/50'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="recent">Most Recent</option>
              <option value="relevance">Relevance</option>
              <option value="client">Client</option>
              <option value="type">Type</option>
              <option value="owner">Owner</option>
              <option value="most-used">Most Used</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedRecords.size > 0 && (
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedRecords.size} selected
              </span>
              <Button variant="secondary" size="sm" onClick={onBulkDownload}>
                <Download size={14} />
                Download
              </Button>
              <Button variant="secondary" size="sm" onClick={onBulkArchive}>
                Archive
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Records List */}
      <div className="flex-1 overflow-y-auto">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FileText size={48} className={isDarkMode ? 'text-gray-600' : 'text-gray-300'} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No records found</h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your search or filters
            </p>
            <Button variant="secondary" size="sm">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
            {records.map(record => {
              const isSelected = selectedRecords.has(record.id);
              const isActive = selectedRecord?.id === record.id;
              const isHovered = hoveredRecord === record.id;
              const typeColor = getRecordTypeColor(record.type);

              return (
                <div
                  key={record.id}
                  onClick={() => onSelectRecord(record)}
                  onMouseEnter={() => setHoveredRecord(record.id)}
                  onMouseLeave={() => setHoveredRecord(null)}
                  className={`px-4 py-4 cursor-pointer transition-colors ${
                    isActive 
                      ? isDarkMode
                        ? 'bg-amber-500/10 border-l-4 border-amber-500'
                        : 'bg-blue-50 border-l-4 border-blue-600'
                      : isHovered 
                      ? isDarkMode ? 'bg-slate-800/30' : 'bg-gray-50'
                      : isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(record.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title & Type Badge */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={`font-semibold text-sm line-clamp-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {record.isPinned && (
                            <Pin size={14} className="inline text-orange-500 mr-1" />
                          )}
                          {record.title}
                        </h3>
                        <Chip 
                          variant={typeColor === 'blue' ? 'info' : typeColor === 'green' ? 'success' : typeColor === 'purple' ? 'warning' : 'neutral'} 
                          size="sm"
                          className="flex-shrink-0"
                        >
                          {getRecordTypeLabel(record.type)}
                        </Chip>
                      </div>

                      {/* Summary */}
                      {record.summary && (
                        <p className={`text-sm line-clamp-2 mb-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {record.summary}
                        </p>
                      )}

                      {/* Metadata Row */}
                      <div className={`flex items-center gap-3 text-xs mb-2 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {record.clientName && (
                          <span className="flex items-center gap-1">
                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{record.clientName}</span>
                          </span>
                        )}
                        {record.projectTitle && (
                          <span className="flex items-center gap-1">
                            • {record.projectTitle}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          • {record.createdByName}
                        </span>
                        <span className="flex items-center gap-1">
                          • {new Date(record.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Related Objects & Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>

                        {/* AI Generated Badge */}
                        {record.isAIGenerated && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isDarkMode
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            Revere
                          </span>
                        )}

                        {/* Bill Tags */}
                        {record.linkedBillNumbers.slice(0, 2).map(billNum => (
                          <span 
                            key={billNum}
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              isDarkMode
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {billNum}
                          </span>
                        ))}
                        {record.linkedBillNumbers.length > 2 && (
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            isDarkMode
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            +{record.linkedBillNumbers.length - 2}
                          </span>
                        )}

                        {/* Person Tags */}
                        {record.linkedPersonNames.slice(0, 1).map(name => (
                          <span 
                            key={name}
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              isDarkMode
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {name}
                          </span>
                        ))}

                        {/* Top Tags */}
                        {record.tags.slice(0, 2).map(tag => (
                          <span 
                            key={tag}
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              isDarkMode
                                ? 'bg-slate-800 text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {record.tags.length > 2 && (
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            +{record.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => handleStarRecord(record.id, e)}
                        className={`p-1.5 rounded transition-colors ${
                          record.isStarred 
                            ? 'text-yellow-500' 
                            : isDarkMode ? 'text-gray-500 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-200'
                        }`}
                        title="Star"
                      >
                        <Star size={16} fill={record.isStarred ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={(e) => handlePinRecord(record.id, e)}
                        className={`p-1.5 rounded transition-colors ${
                          record.isPinned 
                            ? 'text-orange-500' 
                            : isDarkMode ? 'text-gray-500 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-200'
                        }`}
                        title="Pin"
                      >
                        <Pin size={16} fill={record.isPinned ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={(e) => handleDownloadRecord(record.id, e)}
                        className={`p-1.5 rounded transition-colors ${
                          isDarkMode ? 'text-gray-500 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-200'
                        }`}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className={`p-1.5 rounded transition-colors ${
                              isDarkMode ? 'text-gray-500 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-200'
                            }`}
                            title="More"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={isDarkMode ? 'dark bg-slate-800 border-white/10' : ''}>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); console.log('Edit'); }}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); console.log('Duplicate'); }}>
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => handleDeleteClick(record, e)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete Record...
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* View/Download Count Indicator */}
                  {(record.viewCount || record.downloadCount) && (
                    <div className={`flex items-center gap-3 text-xs mt-2 ml-9 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {record.viewCount && (
                        <span>{record.viewCount} views</span>
                      )}
                      {record.downloadCount && (
                        <span>{record.downloadCount} downloads</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}