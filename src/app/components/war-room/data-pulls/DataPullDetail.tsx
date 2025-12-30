import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Download, 
  Copy, 
  Calendar, 
  User, 
  Filter, 
  CheckCircle2, 
  Clock, 
  CheckSquare, 
  AlertCircle, 
  Sparkles, 
  FileSpreadsheet, 
  GitBranch, 
  MessageSquare, 
  Share2, 
  ChevronRight, 
  Plus 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Chip } from '../../ui/Chip';
import { copyToClipboard } from '../../../utils/clipboard';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  DataPull, 
  DataPullOutput, 
  CountyRow, 
  ActivityEntry 
} from './types';
import { 
  updateDataPull, 
  addActivityEntry, 
  generateCriteriaSummary 
} from './dataPullsKV';

interface DataPullDetailProps {
  pull: DataPull;
  onUpdate: (updated: DataPull) => void;
  onClose: () => void;
}

export function DataPullDetail({ pull, onUpdate, onClose }: DataPullDetailProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'output' | 'counties' | 'revisions' | 'distribution'>('overview');
  const [editingStatus, setEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState(pull.status);

  // Output form state
  const [showOutputForm, setShowOutputForm] = useState(false);
  const [outputTitle, setOutputTitle] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [outputType, setOutputType] = useState<'sheet' | 'file'>('sheet');

  // Stats form
  const [editingStats, setEditingStats] = useState(false);
  const [statsForm, setStatsForm] = useState(pull.stats || {});

  // County table
  const [countyTableInput, setCountyTableInput] = useState('');
  const [editingCounties, setEditingCounties] = useState(false);

  const bgColor = isDarkMode ? 'bg-slate-800/40' : 'bg-white/40';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-slate-800/60' : 'bg-white/60';

  const statusConfig = {
    'requested': { label: 'Requested', color: isDarkMode ? 'bg-blue-950/40 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-300' },
    'in-progress': { label: 'In Progress', color: isDarkMode ? 'bg-amber-950/40 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-300' },
    'delivered': { label: 'Delivered', color: isDarkMode ? 'bg-green-950/40 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-300' },
    'revised': { label: 'Revised', color: isDarkMode ? 'bg-purple-950/40 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-300' },
    'archived': { label: 'Archived', color: isDarkMode ? 'bg-gray-700/40 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-600 border-gray-300' },
  };

  async function handleStatusChange() {
    const updated = await updateDataPull(pull.id, { status: tempStatus });
    if (updated) {
      await addActivityEntry(pull.id, {
        type: 'status-changed',
        byUserId: 'current-user',
        byUserName: 'Current User',
        meta: { from: pull.status, to: tempStatus },
      });
      onUpdate(updated);
      setEditingStatus(false);
    }
  }

  async function handleAddOutput() {
    if (!outputTitle.trim() || !outputUrl.trim()) {
      alert('Please fill in title and URL');
      return;
    }

    const newOutput: DataPullOutput = {
      id: `out_${Date.now()}`,
      type: outputType,
      title: outputTitle,
      url: outputUrl,
      uploadedBy: 'Current User',
      createdAt: new Date().toISOString(),
    };

    const outputs = [...(pull.outputs || []), newOutput];
    const updated = await updateDataPull(pull.id, { outputs });
    
    if (updated) {
      await addActivityEntry(pull.id, {
        type: 'output-attached',
        byUserId: 'current-user',
        byUserName: 'Current User',
        meta: { outputTitle },
      });
      onUpdate(updated);
      setShowOutputForm(false);
      setOutputTitle('');
      setOutputUrl('');
    }
  }

  async function handleSaveStats() {
    const updated = await updateDataPull(pull.id, { stats: statsForm });
    if (updated) {
      onUpdate(updated);
      setEditingStats(false);
    }
  }

  async function handleImportCounties() {
    // Parse CSV format: County,Voters,HH
    const lines = countyTableInput.trim().split('\n');
    const countyTable: CountyRow[] = [];

    for (let i = 1; i < lines.length; i++) { // Skip header
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length >= 3) {
        countyTable.push({
          countyName: parts[0],
          voterCount: parseInt(parts[1]) || 0,
          hhCount: parseInt(parts[2]) || 0,
        });
      }
    }

    const updated = await updateDataPull(pull.id, { countyTable });
    if (updated) {
      onUpdate(updated);
      setCountyTableInput('');
      setEditingCounties(false);
    }
  }

  async function copyCriteriaSummary() {
    const summary = generateCriteriaSummary(pull);
    const success = await copyToClipboard(summary);
    if (success) {
      alert('Criteria summary copied to clipboard!');
    } else {
      alert('Failed to copy to clipboard');
    }
  }

  async function markAsDelivered() {
    const updated = await updateDataPull(pull.id, { status: 'delivered' });
    if (updated) {
      await addActivityEntry(pull.id, {
        type: 'delivered',
        byUserId: 'current-user',
        byUserName: 'Current User',
      });
      onUpdate(updated);
    }
  }

  const criteriaSummary = generateCriteriaSummary(pull);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className={`p-2 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
            >
              <X size={20} className={textMuted} />
            </button>
            <div>
              <h1 
                className={`text-2xl font-black ${textColor} mb-2`}
                style={{ fontFamily: '"Corpline", sans-serif' }}
              >
                {pull.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                {editingStatus ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={tempStatus}
                      onChange={(e) => setTempStatus(e.target.value as any)}
                      className={`px-3 py-1 text-sm ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded`}
                    >
                      <option value="requested">Requested</option>
                      <option value="in-progress">In Progress</option>
                      <option value="delivered">Delivered</option>
                      <option value="revised">Revised</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      onClick={handleStatusChange}
                      className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingStatus(false)}
                      className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingStatus(true)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[pull.status].color}`}
                  >
                    {statusConfig[pull.status].label}
                  </button>
                )}
                {pull.projectName && (
                  <span className={`text-xs ${textMuted}`}>
                    Project: {pull.projectName}
                  </span>
                )}
                <span className={`text-xs ${textMuted}`}>
                  {pull.state}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyCriteriaSummary}
              className={`px-4 py-2 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${textColor} rounded-lg text-sm font-semibold transition-colors flex items-center gap-2`}
            >
              <Copy size={16} />
              Copy Criteria
            </button>
            <button
              onClick={markAsDelivered}
              disabled={pull.status === 'delivered'}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              Log Delivery
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
          >
            Overview
          </TabButton>
          <TabButton
            active={activeTab === 'output'}
            onClick={() => setActiveTab('output')}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
          >
            Output
          </TabButton>
          <TabButton
            active={activeTab === 'counties'}
            onClick={() => setActiveTab('counties')}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
          >
            Counties Summary
          </TabButton>
          <TabButton
            active={activeTab === 'revisions'}
            onClick={() => setActiveTab('revisions')}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
          >
            Revisions
          </TabButton>
          <TabButton
            active={activeTab === 'distribution'}
            onClick={() => setActiveTab('distribution')}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
          >
            Distribution
          </TabButton>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          pull={pull} 
          criteriaSummary={criteriaSummary}
          isDarkMode={isDarkMode}
          bgColor={bgColor}
          cardBg={cardBg}
          borderColor={borderColor}
          textColor={textColor}
          textMuted={textMuted}
        />
      )}

      {activeTab === 'output' && (
        <OutputTab
          pull={pull}
          showOutputForm={showOutputForm}
          setShowOutputForm={setShowOutputForm}
          outputTitle={outputTitle}
          setOutputTitle={setOutputTitle}
          outputUrl={outputUrl}
          setOutputUrl={setOutputUrl}
          outputType={outputType}
          setOutputType={setOutputType}
          handleAddOutput={handleAddOutput}
          editingStats={editingStats}
          setEditingStats={setEditingStats}
          statsForm={statsForm}
          setStatsForm={setStatsForm}
          handleSaveStats={handleSaveStats}
          isDarkMode={isDarkMode}
          bgColor={bgColor}
          cardBg={cardBg}
          borderColor={borderColor}
          textColor={textColor}
          textMuted={textMuted}
        />
      )}

      {activeTab === 'counties' && (
        <CountiesTab
          pull={pull}
          editingCounties={editingCounties}
          setEditingCounties={setEditingCounties}
          countyTableInput={countyTableInput}
          setCountyTableInput={setCountyTableInput}
          handleImportCounties={handleImportCounties}
          isDarkMode={isDarkMode}
          bgColor={bgColor}
          cardBg={cardBg}
          borderColor={borderColor}
          textColor={textColor}
          textMuted={textMuted}
        />
      )}

      {activeTab === 'revisions' && (
        <RevisionsTab
          pull={pull}
          isDarkMode={isDarkMode}
          bgColor={bgColor}
          cardBg={cardBg}
          borderColor={borderColor}
          textColor={textColor}
          textMuted={textMuted}
        />
      )}

      {activeTab === 'distribution' && (
        <DistributionTab
          pull={pull}
          isDarkMode={isDarkMode}
          bgColor={bgColor}
          cardBg={cardBg}
          borderColor={borderColor}
          textColor={textColor}
          textMuted={textMuted}
        />
      )}
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, children, isDarkMode, textColor, textMuted }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-semibold transition-colors ${
        active
          ? `${textColor} border-b-2 ${isDarkMode ? 'border-red-500' : 'border-blue-600'}`
          : `${textMuted} hover:${textColor}`
      }`}
    >
      {children}
    </button>
  );
}

// Overview Tab
function OverviewTab({ pull, criteriaSummary, isDarkMode, bgColor, cardBg, borderColor, textColor, textMuted }: any) {
  return (
    <div className="space-y-6">
      {/* Universe Summary */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-red-950/30 to-blue-950/30 border-red-500/30' : 'bg-gradient-to-r from-red-50 to-blue-50 border-red-200'} backdrop-blur-md border rounded-xl p-6`}>
        <div className="flex items-start gap-3">
          <Sparkles className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} mt-1`} size={24} />
          <div className="flex-1">
            <div className={`text-sm font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'} uppercase tracking-wide mb-2`}>
              Universe Summary
            </div>
            <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {criteriaSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Key Fields Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
          <div className={`text-xs ${textMuted} font-semibold uppercase tracking-wide mb-2`}>Priority</div>
          <div className={`text-2xl font-black ${textColor}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
            {pull.priority.toUpperCase()}
          </div>
        </div>
        <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
          <div className={`text-xs ${textMuted} font-semibold uppercase tracking-wide mb-2`}>Due Date</div>
          <div className={`text-lg font-bold ${textColor}`}>
            {pull.deliverable.dropDate 
              ? new Date(pull.deliverable.dropDate).toLocaleDateString()
              : 'Not set'
            }
          </div>
        </div>
        <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
          <div className={`text-xs ${textMuted} font-semibold uppercase tracking-wide mb-2`}>Requester</div>
          <div className={`text-lg font-bold ${textColor}`}>
            {pull.requesterUserName || 'Unknown'}
          </div>
        </div>
      </div>

      {/* Criteria Chips */}
      <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <h3 className={`text-lg font-bold ${textColor} mb-4`}>Criteria Details</h3>
        <div className="flex flex-wrap gap-2">
          {pull.criteria.partisanshipModel && (
            <span className={`px-3 py-1 ${isDarkMode ? 'bg-red-950/40 text-red-400' : 'bg-red-100 text-red-700'} rounded-full text-sm font-semibold`}>
              {pull.criteria.partisanshipModel}
            </span>
          )}
          {pull.criteria.pvfSegment && (
            <span className={`px-3 py-1 ${isDarkMode ? 'bg-blue-950/40 text-blue-400' : 'bg-blue-100 text-blue-700'} rounded-full text-sm font-semibold`}>
              PVF {pull.criteria.pvfSegment}
            </span>
          )}
          {pull.criteria.turnoutRule && (
            <span className={`px-3 py-1 ${isDarkMode ? 'bg-green-950/40 text-green-400' : 'bg-green-100 text-green-700'} rounded-full text-sm font-semibold`}>
              {pull.criteria.turnoutRule}
            </span>
          )}
          {pull.criteria.religionTag && (
            <span className={`px-3 py-1 ${isDarkMode ? 'bg-purple-950/40 text-purple-400' : 'bg-purple-100 text-purple-700'} rounded-full text-sm font-semibold`}>
              {pull.criteria.religionTag}
            </span>
          )}
          {pull.geography.counties && pull.geography.counties.length > 0 && pull.geography.counties.map(county => (
            <span key={county} className={`px-3 py-1 ${isDarkMode ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-100 text-amber-700'} rounded-full text-sm font-semibold`}>
              {county}
            </span>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <h3 className={`text-lg font-bold ${textColor} mb-4`}>Activity Timeline</h3>
        <div className="space-y-4">
          {pull.activity && pull.activity.length > 0 ? (
            pull.activity.map((entry, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-950/30' : 'bg-blue-50'}`}>
                  <Clock size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${textColor}`}>
                    {entry.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className={`text-xs ${textMuted}`}>
                    by {entry.byUserName || entry.byUserId} • {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={`text-sm ${textMuted}`}>No activity yet</p>
          )}
        </div>
      </div>

      {/* QA Checklist */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-green-950/20 to-emerald-950/20 border-green-500/30' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'} backdrop-blur-md border rounded-xl p-6`}>
        <h3 className={`text-lg font-bold ${textColor} mb-4 flex items-center gap-2`}>
          <CheckSquare size={20} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
          QA Checklist
        </h3>
        <div className="space-y-2">
          <ChecklistItem
            label="Counties or geography selected"
            checked={pull.geography.mode === 'statewide' || (pull.geography.counties && pull.geography.counties.length > 0)}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
          />
          <ChecklistItem
            label="Turnout rule specified"
            checked={!!pull.criteria.turnoutRule}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
          />
          <ChecklistItem
            label="Output preferences configured"
            checked={!!pull.criteria.outputPrefs}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
          />
          <ChecklistItem
            label="Output link attached"
            checked={!!(pull.outputs && pull.outputs.length > 0)}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
          />
          <ChecklistItem
            label="Delivery logged"
            checked={pull.status === 'delivered'}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
          />
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ label, checked, isDarkMode, textColor, textMuted }: any) {
  return (
    <div className="flex items-center gap-3">
      {checked ? (
        <CheckCircle2 size={18} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
      ) : (
        <AlertCircle size={18} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
      )}
      <span className={`text-sm ${checked ? textColor : textMuted}`}>
        {label}
      </span>
    </div>
  );
}

// Output Tab
function OutputTab({ 
  pull, 
  showOutputForm, 
  setShowOutputForm,
  outputTitle,
  setOutputTitle,
  outputUrl,
  setOutputUrl,
  outputType,
  setOutputType,
  handleAddOutput,
  editingStats,
  setEditingStats,
  statsForm,
  setStatsForm,
  handleSaveStats,
  isDarkMode, 
  cardBg, 
  borderColor, 
  textColor, 
  textMuted 
}: any) {
  return (
    <div className="space-y-6">
      {/* Add Output Button */}
      <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${textColor}`}>Output Attachments</h3>
          <button
            onClick={() => setShowOutputForm(!showOutputForm)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            Attach Output
          </button>
        </div>

        {showOutputForm && (
          <div className={`p-4 ${isDarkMode ? 'bg-slate-900/40' : 'bg-gray-50'} rounded-lg mb-4`}>
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="sheet"
                      checked={outputType === 'sheet'}
                      onChange={(e) => setOutputType(e.target.value as any)}
                      className="text-blue-600"
                    />
                    <span className={`text-sm ${textColor}`}>Spreadsheet Link</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="file"
                      checked={outputType === 'file'}
                      onChange={(e) => setOutputType(e.target.value as any)}
                      className="text-blue-600"
                    />
                    <span className={`text-sm ${textColor}`}>File Upload</span>
                  </label>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Title</label>
                <input
                  type="text"
                  value={outputTitle}
                  onChange={(e) => setOutputTitle(e.target.value)}
                  placeholder="e.g., Final Universe Export"
                  className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                  {outputType === 'sheet' ? 'Google Sheets URL' : 'File URL'}
                </label>
                <input
                  type="text"
                  value={outputUrl}
                  onChange={(e) => setOutputUrl(e.target.value)}
                  placeholder="https://..."
                  className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddOutput}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Output
                </button>
                <button
                  onClick={() => setShowOutputForm(false)}
                  className={`px-4 py-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} ${textColor} rounded-lg hover:opacity-80 transition-opacity`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Outputs */}
        <div className="space-y-3">
          {pull.outputs && pull.outputs.length > 0 ? (
            pull.outputs.map((output: DataPullOutput) => (
              <div key={output.id} className={`p-4 ${isDarkMode ? 'bg-slate-900/40' : 'bg-gray-50'} rounded-lg`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-950/30' : 'bg-blue-100'}`}>
                      <FileSpreadsheet size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                    </div>
                    <div>
                      <div className={`font-semibold ${textColor} mb-1`}>{output.title}</div>
                      <div className={`text-sm ${textMuted} mb-2`}>
                        Uploaded by {output.uploadedBy} • {new Date(output.createdAt).toLocaleDateString()}
                      </div>
                      {output.url && (
                        <a
                          href={output.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 underline"
                        >
                          Open Link →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={`text-sm ${textMuted} text-center py-8`}>
              No outputs attached yet
            </p>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${textColor}`}>Summary Stats</h3>
          <button
            onClick={() => setEditingStats(!editingStats)}
            className={`px-4 py-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} ${textColor} rounded-lg text-sm font-semibold transition-colors`}
          >
            {editingStats ? 'Cancel' : 'Edit Stats'}
          </button>
        </div>

        {editingStats ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Total Voters</label>
                <input
                  type="number"
                  value={statsForm.totalVoters || ''}
                  onChange={(e) => setStatsForm({ ...statsForm, totalVoters: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Total HH</label>
                <input
                  type="number"
                  value={statsForm.totalHH || ''}
                  onChange={(e) => setStatsForm({ ...statsForm, totalHH: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Counties Count</label>
                <input
                  type="number"
                  value={statsForm.countiesCount || ''}
                  onChange={(e) => setStatsForm({ ...statsForm, countiesCount: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg`}
                />
              </div>
            </div>
            <button
              onClick={handleSaveStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Stats
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className={`text-xs ${textMuted} font-semibold uppercase tracking-wide mb-2`}>Total Voters</div>
              <div className={`text-3xl font-black ${textColor}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                {pull.stats?.totalVoters?.toLocaleString() || '—'}
              </div>
            </div>
            <div>
              <div className={`text-xs ${textMuted} font-semibold uppercase tracking-wide mb-2`}>Total HH</div>
              <div className={`text-3xl font-black ${textColor}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                {pull.stats?.totalHH?.toLocaleString() || '—'}
              </div>
            </div>
            <div>
              <div className={`text-xs ${textMuted} font-semibold uppercase tracking-wide mb-2`}>Counties</div>
              <div className={`text-3xl font-black ${textColor}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                {pull.stats?.countiesCount || '—'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Counties Tab
function CountiesTab({ 
  pull, 
  editingCounties, 
  setEditingCounties,
  countyTableInput,
  setCountyTableInput,
  handleImportCounties,
  isDarkMode, 
  cardBg, 
  borderColor, 
  textColor, 
  textMuted 
}: any) {
  function exportCsv() {
    if (!pull.countyTable || pull.countyTable.length === 0) return;
    
    const csv = 'County,Voter Count,HH Count\n' + 
      pull.countyTable.map((row: CountyRow) => 
        `${row.countyName},${row.voterCount},${row.hhCount}`
      ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pull.name}_counties.csv`;
    a.click();
  }

  return (
    <div className="space-y-6">
      <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${textColor}`}>County Breakdown</h3>
          <div className="flex gap-2">
            {pull.countyTable && pull.countyTable.length > 0 && (
              <button
                onClick={exportCsv}
                className={`px-4 py-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} ${textColor} rounded-lg text-sm font-semibold transition-colors flex items-center gap-2`}
              >
                <Download size={16} />
                Download CSV
              </button>
            )}
            <button
              onClick={() => setEditingCounties(!editingCounties)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
            >
              {editingCounties ? 'Cancel' : 'Import Data'}
            </button>
          </div>
        </div>

        {editingCounties && (
          <div className="mb-6">
            <label className={`block text-sm font-semibold ${textColor} mb-2`}>
              Paste CSV Data (County, Voter Count, HH Count)
            </label>
            <textarea
              value={countyTableInput}
              onChange={(e) => setCountyTableInput(e.target.value)}
              placeholder="County,Voter Count,HH Count&#10;Fulton,25000,10000&#10;Gwinnett,18000,7500"
              rows={8}
              className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg font-mono text-sm`}
            />
            <button
              onClick={handleImportCounties}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Import Counties
            </button>
          </div>
        )}

        {pull.countyTable && pull.countyTable.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${borderColor}`}>
                  <th className={`text-left py-3 px-4 text-sm font-bold ${textColor} uppercase tracking-wide`}>County</th>
                  <th className={`text-right py-3 px-4 text-sm font-bold ${textColor} uppercase tracking-wide`}>Voter Count</th>
                  <th className={`text-right py-3 px-4 text-sm font-bold ${textColor} uppercase tracking-wide`}>HH Count</th>
                </tr>
              </thead>
              <tbody>
                {pull.countyTable.map((row: CountyRow, idx: number) => (
                  <tr key={idx} className={`border-b ${borderColor} ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-gray-50'}`}>
                    <td className={`py-3 px-4 ${textColor} font-semibold`}>{row.countyName}</td>
                    <td className={`py-3 px-4 ${textColor} text-right`}>{row.voterCount.toLocaleString()}</td>
                    <td className={`py-3 px-4 ${textColor} text-right`}>{row.hhCount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={`text-sm ${textMuted} text-center py-8`}>
            No county data yet. Import CSV data to get started.
          </p>
        )}
      </div>

      {/* Insights Panel */}
      {pull.countyTable && pull.countyTable.length > 0 && (
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-purple-950/20 to-blue-950/20 border-purple-500/30' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'} backdrop-blur-md border rounded-xl p-6`}>
          <div className="flex items-start gap-3">
            <Sparkles className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mt-1`} size={24} />
            <div>
              <div className={`text-sm font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} uppercase tracking-wide mb-2`}>
                County Insights
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="mb-2">
                  <strong>Top County:</strong> {pull.countyTable[0].countyName} with {pull.countyTable[0].voterCount.toLocaleString()} voters
                </p>
                <p>
                  <strong>Suggestion:</strong> Focus field operations on top 3 counties which represent approximately {
                    Math.round((pull.countyTable.slice(0, 3).reduce((sum: number, c: CountyRow) => sum + c.voterCount, 0) / 
                    pull.countyTable.reduce((sum: number, c: CountyRow) => sum + c.voterCount, 0)) * 100)
                  }% of the universe.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Revisions Tab
function RevisionsTab({ pull, isDarkMode, cardBg, borderColor, textColor, textMuted }: any) {
  return (
    <div className="space-y-6">
      <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${textColor}`}>Version History</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <GitBranch size={16} />
            Create Revision
          </button>
        </div>

        <div className="space-y-4">
          <div className={`p-4 ${isDarkMode ? 'bg-slate-900/40' : 'bg-gray-50'} rounded-lg border-2 ${isDarkMode ? 'border-blue-500/30' : 'border-blue-300'}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 ${isDarkMode ? 'bg-blue-950/40 text-blue-400' : 'bg-blue-100 text-blue-700'} rounded text-xs font-bold`}>
                  v{pull.version} (Current)
                </span>
                <span className={`text-sm font-semibold ${textColor}`}>{pull.name}</span>
              </div>
            </div>
            <div className={`text-xs ${textMuted}`}>
              Created {new Date(pull.createdAt).toLocaleString()}
            </div>
          </div>

          {pull.parentPullId && (
            <div className={`p-4 ${isDarkMode ? 'bg-slate-900/40' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 ${isDarkMode ? 'bg-gray-700/40 text-gray-400' : 'bg-gray-100 text-gray-600'} rounded text-xs font-bold`}>
                  v{pull.version - 1}
                </span>
                <span className={`text-sm ${textMuted}`}>Previous version</span>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-700 underline">
                View Changes
              </button>
            </div>
          )}

          {(!pull.revisionIds || pull.revisionIds.length === 0) && !pull.parentPullId && (
            <p className={`text-sm ${textMuted} text-center py-8`}>
              No revisions yet. Create a revision to track changes over time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Distribution Tab
function DistributionTab({ pull, isDarkMode, cardBg, borderColor, textColor, textMuted }: any) {
  return (
    <div className="space-y-6">
      <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <h3 className={`text-lg font-bold ${textColor} mb-4`}>Share Package</h3>
        <div className="space-y-3">
          <button className="w-full p-4 ${isDarkMode ? 'bg-slate-900/40 hover:bg-slate-800/60' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-950/30' : 'bg-blue-100'}`}>
                <MessageSquare size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${textColor}`}>Create Chat Message</div>
                <div className={`text-xs ${textMuted}`}>Post to team chat with attachment card</div>
              </div>
            </div>
            <ChevronRight size={20} className={textMuted} />
          </button>

          <button className="w-full p-4 ${isDarkMode ? 'bg-slate-900/40 hover:bg-slate-800/60' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-950/30' : 'bg-purple-100'}`}>
                <Share2 size={20} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${textColor}`}>Create Distribution Task</div>
                <div className={`text-xs ${textMuted}`}>Assign to field lead or staff member</div>
              </div>
            </div>
            <ChevronRight size={20} className={textMuted} />
          </button>
        </div>
      </div>

      <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <h3 className={`text-lg font-bold ${textColor} mb-4`}>Field-Ready Notes</h3>
        <textarea
          placeholder="Add notes for field teams: how to use the list, exclusions, date cutoffs, etc..."
          rows={6}
          className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    </div>
  );
}