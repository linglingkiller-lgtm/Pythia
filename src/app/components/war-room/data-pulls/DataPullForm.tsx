import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { DataPull, DataPullCriteria, Geography, Deliverable, Approval } from './types';
import { createDataPull, generateCriteriaSummary } from './dataPullsKV';

interface DataPullFormProps {
  onSave: (pull: DataPull) => void;
  onCancel: () => void;
  existingPull?: DataPull;
}

export function DataPullForm({ onSave, onCancel, existingPull }: DataPullFormProps) {
  const { isDarkMode } = useTheme();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basics']));
  
  // Form state
  const [name, setName] = useState(existingPull?.name || '');
  const [projectId, setProjectId] = useState(existingPull?.projectId || '');
  const [projectName, setProjectName] = useState(existingPull?.projectName || '');
  const [clientId, setClientId] = useState(existingPull?.clientId || '');
  const [state, setState] = useState(existingPull?.state || 'GA');
  const [geography, setGeography] = useState<Geography>(existingPull?.geography || {
    mode: 'counties',
    counties: [],
  });
  const [criteria, setCriteria] = useState<DataPullCriteria>(existingPull?.criteria || {});
  const [deliverable, setDeliverable] = useState<Deliverable>(existingPull?.deliverable || {
    type: 'both',
    distributionToggles: {
      shareWithTeam: true,
      shareToRecords: true,
      createFollowUpTask: true,
    },
  });
  const [approval, setApproval] = useState<Approval>(existingPull?.approval || { required: false });
  const [priority, setPriority] = useState(existingPull?.priority || 'medium');
  const [status, setStatus] = useState(existingPull?.status || 'requested');

  // County selection
  const [countyInput, setCountyInput] = useState('');

  const bgColor = isDarkMode ? 'bg-slate-800/60' : 'bg-white/60';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  function toggleSection(section: string) {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  }

  function addCounty() {
    if (!countyInput.trim()) return;
    const counties = geography.counties || [];
    if (!counties.includes(countyInput.trim())) {
      setGeography({
        ...geography,
        counties: [...counties, countyInput.trim()],
      });
    }
    setCountyInput('');
  }

  function removeCounty(county: string) {
    setGeography({
      ...geography,
      counties: (geography.counties || []).filter(c => c !== county),
    });
  }

  function addCriteriaTag(field: keyof DataPullCriteria, value: any) {
    if (field === 'issueTags' || field === 'exclusions') {
      const existing = (criteria[field] as string[]) || [];
      if (!existing.includes(value)) {
        setCriteria({
          ...criteria,
          [field]: [...existing, value],
        });
      }
    }
  }

  function removeCriteriaTag(field: keyof DataPullCriteria, value: string) {
    if (field === 'issueTags' || field === 'exclusions') {
      setCriteria({
        ...criteria,
        [field]: ((criteria[field] as string[]) || []).filter(v => v !== value),
      });
    }
  }

  async function handleSubmit() {
    if (!name.trim() || !state) {
      alert('Please fill in required fields (Name, State)');
      return;
    }

    const pullData = {
      name,
      projectId: projectId || undefined,
      projectName: projectName || undefined,
      clientId: clientId || undefined,
      state,
      geography,
      criteria,
      deliverable,
      approval,
      status,
      priority: priority as 'low' | 'medium' | 'high',
      requesterUserId: 'current-user-id', // In production, get from auth
      requesterUserName: 'Current User',
      assigneeUserId: 'current-user-id',
      assigneeUserName: 'Current User',
      version: 1,
      outputs: [],
    };

    const saved = await createDataPull(pullData);
    onSave(saved);
  }

  const mockPull: DataPull = {
    id: 'preview',
    orgId: 'demo',
    name,
    state,
    geography,
    criteria,
    deliverable,
    status,
    priority: priority as any,
    requesterUserId: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  };

  const criteriaSummary = generateCriteriaSummary(mockPull);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className={`${bgColor} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className={`text-2xl font-black ${textColor} mb-1`}
              style={{ fontFamily: '"Corpline", sans-serif' }}
            >
              {existingPull ? 'EDIT DATA PULL REQUEST' : 'NEW DATA PULL REQUEST'}
            </h1>
            <p className={`text-sm ${textMuted}`}>
              Define universe criteria and deliverable requirements
            </p>
          </div>
          <button
            onClick={onCancel}
            className={`p-2 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
          >
            <X size={24} className={textMuted} />
          </button>
        </div>
      </div>

      {/* Generated Summary Preview */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-red-950/30 to-blue-950/30 border-red-500/30' : 'bg-gradient-to-r from-red-50 to-blue-50 border-red-200'} backdrop-blur-md border rounded-xl p-6`}>
        <div className="flex items-start gap-3">
          <Sparkles className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} mt-1`} size={20} />
          <div className="flex-1">
            <div className={`text-sm font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'} uppercase tracking-wide mb-2`}>
              Generated Universe Summary
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {criteriaSummary || 'Start filling out criteria to see a summary...'}
            </p>
          </div>
        </div>
      </div>

      {/* A) Basics Section */}
      <CollapsibleSection
        title="A) Basics"
        expanded={expandedSections.has('basics')}
        onToggle={() => toggleSection('basics')}
        isDarkMode={isDarkMode}
        bgColor={bgColor}
        borderColor={borderColor}
        textColor={textColor}
        textMuted={textMuted}
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold ${textColor} mb-2`}>
              Pull Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Lean-Hard R PVF 1 (3/4) – Catholics – Cobb+Fulton"
              className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Project
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Select or enter project name"
                className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="GA">Georgia</option>
                <option value="FL">Florida</option>
                <option value="NC">North Carolina</option>
                <option value="TX">Texas</option>
                <option value="PA">Pennsylvania</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textColor} mb-2`}>
              Geography
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={geography.mode === 'statewide'}
                    onChange={() => setGeography({ ...geography, mode: 'statewide' })}
                    className="text-blue-600"
                  />
                  <span className={`text-sm ${textColor}`}>Statewide</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={geography.mode === 'counties'}
                    onChange={() => setGeography({ ...geography, mode: 'counties' })}
                    className="text-blue-600"
                  />
                  <span className={`text-sm ${textColor}`}>Selected Counties</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={geography.mode === 'custom'}
                    onChange={() => setGeography({ ...geography, mode: 'custom' })}
                    className="text-blue-600"
                  />
                  <span className={`text-sm ${textColor}`}>Custom</span>
                </label>
              </div>

              {geography.mode === 'counties' && (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={countyInput}
                      onChange={(e) => setCountyInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCounty()}
                      placeholder="Type county name and press Enter"
                      className={`flex-1 px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      onClick={addCounty}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(geography.counties || []).map(county => (
                      <span
                        key={county}
                        className={`px-3 py-1 ${isDarkMode ? 'bg-blue-950/40 text-blue-400' : 'bg-blue-100 text-blue-700'} rounded-full text-sm flex items-center gap-2`}
                      >
                        {county}
                        <button onClick={() => removeCounty(county)}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {geography.mode === 'custom' && (
                <textarea
                  value={geography.notes || ''}
                  onChange={(e) => setGeography({ ...geography, notes: e.target.value })}
                  placeholder="Describe custom geography..."
                  rows={3}
                  className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Due Date
              </label>
              <input
                type="date"
                value={deliverable.dropDate || ''}
                onChange={(e) => setDeliverable({ ...deliverable, dropDate: e.target.value })}
                className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="requested">Requested</option>
                <option value="in-progress">In Progress</option>
                <option value="delivered">Delivered</option>
                <option value="revised">Revised</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* B) Universe Criteria */}
      <CollapsibleSection
        title="B) Universe Criteria"
        expanded={expandedSections.has('criteria')}
        onToggle={() => toggleSection('criteria')}
        isDarkMode={isDarkMode}
        bgColor={bgColor}
        borderColor={borderColor}
        textColor={textColor}
        textMuted={textMuted}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Party/Model
              </label>
              <select
                value={criteria.partisanshipModel || ''}
                onChange={(e) => setCriteria({ ...criteria, partisanshipModel: e.target.value })}
                className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select...</option>
                <option value="Lean R">Lean R</option>
                <option value="Hard R">Hard R</option>
                <option value="Lean D">Lean D</option>
                <option value="Hard D">Hard D</option>
                <option value="Independent">Independent</option>
                <option value="Persuadable">Persuadable</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                PVF Segment
              </label>
              <select
                value={criteria.pvfSegment || ''}
                onChange={(e) => setCriteria({ ...criteria, pvfSegment: e.target.value })}
                className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select...</option>
                <option value="1">PVF 1</option>
                <option value="2">PVF 2</option>
                <option value="3">PVF 3</option>
                <option value="4">PVF 4</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textColor} mb-2`}>
              Turnout Behavior
            </label>
            <input
              type="text"
              value={criteria.turnoutRule || ''}
              onChange={(e) => setCriteria({ ...criteria, turnoutRule: e.target.value })}
              placeholder="e.g., 3/4 last elections, voted in last 2 generals"
              className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Religion/Demographic
              </label>
              <input
                type="text"
                value={criteria.religionTag || ''}
                onChange={(e) => setCriteria({ ...criteria, religionTag: e.target.value })}
                placeholder="e.g., Catholic, Evangelical"
                className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Age Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={criteria.ageRange?.min || ''}
                  onChange={(e) => setCriteria({ 
                    ...criteria, 
                    ageRange: { ...criteria.ageRange, min: parseInt(e.target.value) || undefined }
                  })}
                  placeholder="Min"
                  className={`flex-1 px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <span className={textMuted}>to</span>
                <input
                  type="number"
                  value={criteria.ageRange?.max || ''}
                  onChange={(e) => setCriteria({ 
                    ...criteria, 
                    ageRange: { ...criteria.ageRange, max: parseInt(e.target.value) || undefined }
                  })}
                  placeholder="Max"
                  className={`flex-1 px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textColor} mb-2`}>
              Output Preferences
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.outputPrefs?.hhRollups || false}
                  onChange={(e) => setCriteria({
                    ...criteria,
                    outputPrefs: { ...criteria.outputPrefs, hhRollups: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm ${textColor}`}>Include HH rollups</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.outputPrefs?.includePhones || false}
                  onChange={(e) => setCriteria({
                    ...criteria,
                    outputPrefs: { ...criteria.outputPrefs, includePhones: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm ${textColor}`}>Include phone/email</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.outputPrefs?.includeWalkFields || false}
                  onChange={(e) => setCriteria({
                    ...criteria,
                    outputPrefs: { ...criteria.outputPrefs, includeWalkFields: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm ${textColor}`}>Include walk list fields</span>
              </label>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textColor} mb-2`}>
              Special Instructions / Notes
            </label>
            <textarea
              value={criteria.notes || ''}
              onChange={(e) => setCriteria({ ...criteria, notes: e.target.value })}
              placeholder="Any special requirements or notes..."
              rows={3}
              className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* C) Deliverable */}
      <CollapsibleSection
        title="C) Deliverable"
        expanded={expandedSections.has('deliverable')}
        onToggle={() => toggleSection('deliverable')}
        isDarkMode={isDarkMode}
        bgColor={bgColor}
        borderColor={borderColor}
        textColor={textColor}
        textMuted={textMuted}
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold ${textColor} mb-2`}>
              Deliverable Type
            </label>
            <select
              value={deliverable.type}
              onChange={(e) => setDeliverable({ ...deliverable, type: e.target.value as any })}
              className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="sheet-summary">Google Sheet summary (County / Voter Count / HH Count)</option>
              <option value="walk-list-csv">Walk list export (CSV)</option>
              <option value="universe-only">Universe file only</option>
              <option value="both">Both summary + walk list</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textColor} mb-2`}>
              Distribution
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliverable.distributionToggles?.shareWithTeam || false}
                  onChange={(e) => setDeliverable({
                    ...deliverable,
                    distributionToggles: { ...deliverable.distributionToggles, shareWithTeam: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm ${textColor}`}>Share with project team</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliverable.distributionToggles?.shareToRecords || false}
                  onChange={(e) => setDeliverable({
                    ...deliverable,
                    distributionToggles: { ...deliverable.distributionToggles, shareToRecords: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm ${textColor}`}>Share to Records archive</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliverable.distributionToggles?.createFollowUpTask || false}
                  onChange={(e) => setDeliverable({
                    ...deliverable,
                    distributionToggles: { ...deliverable.distributionToggles, createFollowUpTask: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm ${textColor}`}>Create follow-up task</span>
              </label>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className={`px-6 py-3 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${textColor} rounded-lg font-semibold transition-colors`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          {existingPull ? 'Update Data Pull' : 'Create Data Pull'}
        </button>
      </div>
    </div>
  );
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isDarkMode: boolean;
  bgColor: string;
  borderColor: string;
  textColor: string;
  textMuted: string;
}

function CollapsibleSection({ 
  title, 
  expanded, 
  onToggle, 
  children, 
  isDarkMode, 
  bgColor, 
  borderColor, 
  textColor, 
  textMuted 
}: CollapsibleSectionProps) {
  return (
    <div className={`${bgColor} ${borderColor} backdrop-blur-md border rounded-xl overflow-hidden`}>
      <button
        onClick={onToggle}
        className={`w-full px-6 py-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-slate-700/40' : 'hover:bg-white/60'} transition-colors`}
      >
        <h3 className={`text-lg font-bold ${textColor}`}>
          {title}
        </h3>
        {expanded ? <ChevronDown size={20} className={textMuted} /> : <ChevronRight size={20} className={textMuted} />}
      </button>
      {expanded && (
        <div className={`px-6 pb-6 border-t ${borderColor}`}>
          <div className="pt-6">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}