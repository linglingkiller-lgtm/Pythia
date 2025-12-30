import React from 'react';
import { X, Search, Link2, FileText, AlertCircle, Plus, Play, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';

export interface BillImportItem {
  id: string;
  billNumber: string;
  session: string;
  title?: string;
  sponsor?: string;
  status: 'queued' | 'resolving' | 'scraping-overview' | 'scraping-votes' | 'scraping-docs' | 'generating-ai' | 'complete' | 'error';
  currentStep: 'resolver' | 'overview' | 'votes' | 'docs' | 'ai' | 'done';
  error?: string;
  progress: number; // 0-100
  billStatusId?: string;
  overviewUrl?: string;
}

interface AddBillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBills: (items: BillImportItem[]) => void;
}

const CURRENT_SESSION = '57th-1st-regular';
const SESSIONS = [
  { value: '57th-1st-regular', label: '57th Legislature - 1st Regular (2025)' },
  { value: '56th-2nd-special', label: '56th Legislature - 2nd Special (2024)' },
  { value: '56th-2nd-regular', label: '56th Legislature - 2nd Regular (2024)' },
  { value: '56th-1st-regular', label: '56th Legislature - 1st Regular (2023)' },
];

// Mock bill search results for autocomplete
const MOCK_BILL_SEARCH_RESULTS = [
  { billNumber: 'HB 2001', title: 'Budget Reconciliation Act', sponsor: 'Rep. Smith (R-12)' },
  { billNumber: 'HB 2005', title: 'Education Funding Reform', sponsor: 'Rep. Johnson (D-8)' },
  { billNumber: 'HB 2010', title: 'Tax Credit Expansion', sponsor: 'Rep. Martinez (R-15)' },
  { billNumber: 'SB 1001', title: 'Arizona Border Security Constitutional Amendment', sponsor: 'Sen. Kavanagh (R-3)' },
  { billNumber: 'SB 1010', title: 'Healthcare Access Act', sponsor: 'Sen. Chen (D-24)' },
  { billNumber: 'SB 1015', title: 'Water Rights Modernization', sponsor: 'Sen. Davis (R-7)' },
];

export function AddBillsModal({ isOpen, onClose, onAddBills }: AddBillsModalProps) {
  const [activeTab, setActiveTab] = React.useState('search');
  const [importQueue, setImportQueue] = React.useState<BillImportItem[]>([]);
  const [selectedQueueItem, setSelectedQueueItem] = React.useState<string | null>(null);

  // Search Tab State
  const [searchSession, setSearchSession] = React.useState(CURRENT_SESSION);
  const [searchBillNumber, setSearchBillNumber] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);

  // Quick Add Tab State
  const [quickAddUrl, setQuickAddUrl] = React.useState('');
  const [quickAddError, setQuickAddError] = React.useState('');

  // Bulk Add Tab State
  const [bulkAddText, setBulkAddText] = React.useState('');
  const [bulkSession, setBulkSession] = React.useState(CURRENT_SESSION);

  // Auto-process queued items
  React.useEffect(() => {
    const processQueue = async () => {
      const queuedItems = importQueue.filter(item => item.status === 'queued');
      
      for (const item of queuedItems) {
        await simulateBillScraping(item.id);
      }
    };

    if (importQueue.some(item => item.status === 'queued')) {
      processQueue();
    }
  }, [importQueue]);

  const simulateBillScraping = async (itemId: string) => {
    const steps: Array<{
      status: BillImportItem['status'];
      step: BillImportItem['currentStep'];
      progress: number;
      delay: number;
    }> = [
      { status: 'resolving', step: 'resolver', progress: 10, delay: 800 },
      { status: 'scraping-overview', step: 'overview', progress: 30, delay: 1200 },
      { status: 'scraping-votes', step: 'votes', progress: 50, delay: 1000 },
      { status: 'scraping-docs', step: 'docs', progress: 70, delay: 1000 },
      { status: 'generating-ai', step: 'ai', progress: 90, delay: 1500 },
      { status: 'complete', step: 'done', progress: 100, delay: 0 },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      
      setImportQueue(prev => prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              status: step.status,
              currentStep: step.step,
              progress: step.progress,
              // Add mock data on completion
              ...(step.status === 'complete' ? {
                title: `${item.billNumber} - Mock Bill Title`,
                sponsor: 'Sen. Example (R-1)',
                billStatusId: '12345',
              } : {})
            }
          : item
      ));
    }
  };

  // Search as you type
  React.useEffect(() => {
    if (searchBillNumber.length >= 2) {
      const filtered = MOCK_BILL_SEARCH_RESULTS.filter(bill =>
        bill.billNumber.toLowerCase().includes(searchBillNumber.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchBillNumber]);

  const handleAddToQueue = (billNumber: string, session: string, title?: string, sponsor?: string) => {
    const newItem: BillImportItem = {
      id: `import-${Date.now()}-${Math.random()}`,
      billNumber,
      session,
      title,
      sponsor,
      status: 'queued',
      currentStep: 'resolver',
      progress: 0,
    };
    setImportQueue(prev => [...prev, newItem]);
  };

  const handleQuickAdd = () => {
    setQuickAddError('');
    
    // Validate URL pattern
    const urlPattern = /azleg\.gov.*billstatus\/billOverview\/(\d+)/i;
    const idPattern = /^\d+$/;
    
    let billStatusId = '';
    
    if (urlPattern.test(quickAddUrl)) {
      const match = quickAddUrl.match(urlPattern);
      billStatusId = match ? match[1] : '';
    } else if (idPattern.test(quickAddUrl)) {
      billStatusId = quickAddUrl;
    } else {
      setQuickAddError('Invalid AZLeg bill overview link or ID.');
      return;
    }

    // Mock: In real implementation, would fetch bill details from billStatusId
    handleAddToQueue(
      'HB 2XXX', // Would be fetched
      CURRENT_SESSION,
      'Bill title pending...',
      'Sponsor pending...'
    );
    setQuickAddUrl('');
  };

  const handleBulkAdd = () => {
    const lines = bulkAddText.split(/[\n,]+/).map(l => l.trim()).filter(Boolean);
    const billNumbers = lines.filter(line => /^[HS][BRC]\s*\d+/i.test(line));
    
    billNumbers.forEach(billNumber => {
      const normalized = billNumber.replace(/\s+/g, ' ').toUpperCase();
      handleAddToQueue(normalized, bulkSession);
    });
    
    setBulkAddText('');
  };

  const handleRemoveFromQueue = (id: string) => {
    setImportQueue(prev => prev.filter(item => item.id !== id));
    if (selectedQueueItem === id) {
      setSelectedQueueItem(null);
    }
  };

  const handleStartTracking = () => {
    // Filter complete items
    const completeItems = importQueue.filter(item => item.status === 'complete');
    if (completeItems.length > 0) {
      onAddBills(completeItems);
      setImportQueue(prev => prev.filter(item => item.status !== 'complete'));
    }
    onClose();
  };

  const handleRetry = (id: string) => {
    setImportQueue(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: 'queued', currentStep: 'resolver', progress: 0, error: undefined }
        : item
    ));
  };

  const selectedItem = importQueue.find(item => item.id === selectedQueueItem);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Bills</DialogTitle>
          <DialogDescription>
            Add bills to your tracking list by searching, quickly adding a URL or ID, or bulk adding multiple bills.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-[1fr,400px] gap-6 overflow-hidden">
          {/* Left Column: Input Methods */}
          <div className="flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="quick">Quick Add</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Add</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4">
                {/* Tab 1: Search */}
                <TabsContent value="search" className="mt-0 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session
                    </label>
                    <select
                      value={searchSession}
                      onChange={(e) => setSearchSession(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {SESSIONS.map(session => (
                        <option key={session.value} value={session.value}>
                          {session.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bill Number
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Type bill number (e.g., HB2001, SB1010)..."
                        value={searchBillNumber}
                        onChange={(e) => setSearchBillNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="border border-gray-200 rounded divide-y max-h-96 overflow-y-auto">
                      {searchResults.map((result, idx) => (
                        <div
                          key={idx}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                          onClick={() => {
                            handleAddToQueue(result.billNumber, searchSession, result.title, result.sponsor);
                            setSearchBillNumber('');
                            setSearchResults([]);
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900">{result.billNumber}</div>
                            <div className="text-sm text-gray-600 truncate">{result.title}</div>
                            <div className="text-xs text-gray-500">{result.sponsor}</div>
                          </div>
                          <Plus size={18} className="text-red-600 flex-shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  )}

                  {searchBillNumber && searchResults.length === 0 && (
                    <div className="text-sm text-gray-500 italic">
                      No matching bills found. Try a different search term.
                    </div>
                  )}
                </TabsContent>

                {/* Tab 2: Quick Add */}
                <TabsContent value="quick" className="mt-0 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bill Overview URL or ID
                    </label>
                    <input
                      type="text"
                      placeholder="Paste URL or billStatusId..."
                      value={quickAddUrl}
                      onChange={(e) => {
                        setQuickAddUrl(e.target.value);
                        setQuickAddError('');
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Example: https://www.azleg.gov/legtext/57leg/1R/bills/HB2001.htm or just the bill ID
                    </p>
                  </div>

                  {quickAddError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <AlertCircle size={16} />
                      {quickAddError}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    onClick={handleQuickAdd}
                    disabled={!quickAddUrl}
                    className="w-full"
                  >
                    <Link2 size={16} />
                    Fetch & Add to Queue
                  </Button>
                </TabsContent>

                {/* Tab 3: Bulk Add */}
                <TabsContent value="bulk" className="mt-0 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session
                    </label>
                    <select
                      value={bulkSession}
                      onChange={(e) => setBulkSession(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {SESSIONS.map(session => (
                        <option key={session.value} value={session.value}>
                          {session.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bill Numbers
                    </label>
                    <textarea
                      placeholder="Paste bill numbers (one per line or comma-separated)&#10;Example:&#10;HB2001&#10;HB2005, SB1010&#10;SB1015"
                      value={bulkAddText}
                      onChange={(e) => setBulkAddText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 h-48 font-mono text-sm"
                    />
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleBulkAdd}
                    disabled={!bulkAddText.trim()}
                    className="w-full"
                  >
                    <FileText size={16} />
                    Queue All Bills
                  </Button>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Column: Import Queue & Preview */}
          <div className="flex flex-col border-l border-gray-200 pl-6 overflow-hidden">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Import Queue</h3>
              <Badge variant="secondary">
                {importQueue.length} {importQueue.length === 1 ? 'bill' : 'bills'}
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {importQueue.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-8">
                  <FileText size={32} className="mx-auto mb-2 opacity-50" />
                  No bills in queue
                </div>
              ) : (
                importQueue.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedQueueItem(item.id)}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedQueueItem === item.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">
                          {item.billNumber}
                        </div>
                        {item.title && (
                          <div className="text-xs text-gray-600 truncate">{item.title}</div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromQueue(item.id);
                        }}
                        className="text-gray-400 hover:text-red-600 ml-2 flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {item.status === 'error' ? (
                        <>
                          <Badge variant="destructive" className="text-xs">Error</Badge>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetry(item.id);
                            }}
                            className="text-red-600 hover:underline"
                          >
                            Retry
                          </button>
                        </>
                      ) : item.status === 'complete' ? (
                        <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                          <CheckCircle2 size={12} className="mr-1" />
                          Complete
                        </Badge>
                      ) : item.status === 'queued' ? (
                        <Badge variant="secondary" className="text-xs">Waiting</Badge>
                      ) : (
                        <>
                          <Loader2 size={12} className="animate-spin text-blue-600" />
                          <span className="text-gray-600 capitalize">
                            {item.status.replace(/-/g, ' ')}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {item.status !== 'queued' && item.status !== 'error' && (
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Live Preview */}
            {selectedItem && (
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <h4 className="font-semibold text-sm text-gray-900">Preview</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Bill:</span>{' '}
                    <span className="font-medium">{selectedItem.billNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Session:</span>{' '}
                    <span className="font-medium">{selectedItem.session}</span>
                  </div>
                  {selectedItem.title && (
                    <div>
                      <span className="text-gray-600">Title:</span>{' '}
                      <span className="font-medium">{selectedItem.title}</span>
                    </div>
                  )}
                  {selectedItem.sponsor && (
                    <div>
                      <span className="text-gray-600">Sponsor:</span>{' '}
                      <span className="font-medium">{selectedItem.sponsor}</span>
                    </div>
                  )}
                  {selectedItem.status === 'complete' && (
                    <div className="pt-2 space-y-1">
                      <div className="text-xs font-medium text-gray-700">Attach to:</div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" className="text-xs">
                          Add to Watchlist
                        </Button>
                        <Button variant="secondary" size="sm" className="text-xs">
                          Link to Client
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-gray-200 pt-4 mt-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartTracking}
                disabled={importQueue.filter(i => i.status === 'complete').length === 0}
                className="flex-1"
              >
                <Play size={16} />
                Add & Track
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}