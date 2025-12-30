import React from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { type RecordType } from '../../data/recordsData';
import { mockClients } from '../../data/clientsData';
import { useAppMode } from '../../contexts/AppModeContext';
import { useTheme } from '../../contexts/ThemeContext';

interface NewRecordModalProps {
  onClose: () => void;
  onSave: (record: any) => void;
}

export function NewRecordModal({ onClose, onSave }: NewRecordModalProps) {
  const { appMode } = useAppMode();
  const { isDarkMode } = useTheme();
  const [mode, setMode] = React.useState<'upload' | 'note'>('upload');
  const [title, setTitle] = React.useState('');
  // Default to 'brief' for prod compliance
  const [type, setType] = React.useState<RecordType>('brief');
  const [clientId, setClientId] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [occurredAt, setOccurredAt] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);

  const prodRecordTypes: { value: RecordType; label: string }[] = [
    { value: 'brief', label: 'Brief' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'weekly_update', label: 'Weekly Update' },
  ];

  const demoRecordTypes: { value: RecordType; label: string }[] = [
    { value: 'brief', label: 'Brief' },
    { value: 'budget', label: 'Budget' },
    { value: 'weekly-update', label: 'Weekly Update' },
    { value: 'deliverable', label: 'Deliverable' },
    { value: 'note', label: 'Note' },
    { value: 'snapshot', label: 'Snapshot' },
    { value: 'legislative-brief', label: 'Legislative Brief' },
    { value: 'meeting-minutes', label: 'Meeting Minutes' },
    { value: 'testimony', label: 'Testimony' },
    { value: 'compliance-log', label: 'Compliance Log' },
  ];

  const recordTypes = appMode === 'prod' ? prodRecordTypes : demoRecordTypes;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!title) {
        setTitle(e.target.files[0].name);
      }
    }
  };

  const handleSave = () => {
    const newRecord = {
      title,
      type,
      clientId,
      department,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      description, // Maps to contentText
      contentText: description, // Explicit map
      occurredAt, // New field
      file
    };
    onSave(newRecord);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col ${
        isDarkMode ? 'bg-slate-900 border border-white/10' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b flex-shrink-0 ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>New Record</h2>
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Upload a file or create a text note
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded transition-colors ${
                isDarkMode ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setMode('upload')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'upload'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Upload size={16} className="inline mr-2" />
              Upload File
            </button>
            <button
              onClick={() => setMode('note')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'note'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText size={16} className="inline mr-2" />
              Create Note
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* File Upload (if mode is upload) */}
            {mode === 'upload' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  File
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-blue-400' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload size={32} className={`mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    {file ? (
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, Word, Excel, or images
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter record title"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-white/10 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                }`}
              />
            </div>

            {/* Type */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Record Type <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RecordType)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-white/10 text-white focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                }`}
              >
                {recordTypes.map(rt => (
                  <option key={rt.value} value={rt.value}>
                    {rt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Client */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Client (optional)
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-white/10 text-white focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                }`}
              >
                <option value="">Select a client</option>
                {mockClients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-white/10 text-white focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                }`}
              >
                <option value="">Select department</option>
                <option value="public-affairs">Public Affairs</option>
                <option value="lobbying">Lobbying</option>
                <option value="campaign-services">Campaign Services</option>
              </select>
            </div>

            {/* Date Occurred */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Date Occurred
              </label>
              <input
                type="date"
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-white/10 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                }`}
              />
            </div>

            {/* Description (for notes) */}
            {mode === 'note' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Content
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter note content..."
                  rows={8}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode 
                      ? 'bg-slate-800 border-white/10 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500/20' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                  }`}
                />
              </div>
            )}

            {/* Tags */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tags (optional)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-white/10 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">
                e.g., urgent, client-deliverable, draft
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-end gap-2 flex-shrink-0 ${
          isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <Button 
            variant="secondary" 
            onClick={onClose}
            className={!isDarkMode ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900" : ""}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={!title || !type || !department}
            className={`px-8 shadow-lg shadow-blue-500/20 ${
              !isDarkMode 
                ? "bg-blue-600 hover:bg-blue-700 text-white border-transparent hover:border-transparent" 
                : "bg-blue-600/80 hover:bg-blue-600 text-white border-blue-500/30 hover:border-blue-400/50"
            }`}
          >
            Create Record
          </Button>
        </div>
      </div>
    </div>
  );
}
