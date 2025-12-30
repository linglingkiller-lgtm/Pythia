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
  Calendar as CalendarIcon,
  Users as UsersIcon,
  MapPin,
  Flag,
  Phone,
  Vote
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { DataPull, DataPullCriteria, Geography, Deliverable, Approval } from './types';
import { createDataPull, generateCriteriaSummary } from './dataPullsKV';
import { MultiSelect } from './MultiSelect';

interface DataPullFormEnhancedProps {
  onSave: (pull: DataPull) => void;
  onCancel: () => void;
  existingPull?: DataPull;
}

export function DataPullFormEnhanced({ onSave, onCancel, existingPull }: DataPullFormEnhancedProps) {
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
      requesterUserId: 'current-user-id',
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
    <div className="max-w-6xl mx-auto space-y-6">
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
        icon={<AlertCircle size={18} />}
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

      {/* B) Demographic Filters */}
      <CollapsibleSection
        title="B) Demographic Filters"
        icon={<UsersIcon size={18} />}
        expanded={expandedSections.has('demographic')}
        onToggle={() => toggleSection('demographic')}
        isDarkMode={isDarkMode}
        bgColor={bgColor}
        borderColor={borderColor}
        textColor={textColor}
        textMuted={textMuted}
      >
        <div className="grid grid-cols-2 gap-4">
          <MultiSelect
            label="Gender"
            options={['Male', 'Female', 'Other', 'Unknown']}
            selected={criteria.demographic?.gender || []}
            onChange={(val) => setCriteria({
              ...criteria,
              demographic: { ...criteria.demographic, gender: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
          />
          
          <MultiSelect
            label="Age Range"
            options={['18-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75+']}
            selected={criteria.demographic?.ageRange || []}
            onChange={(val) => setCriteria({
              ...criteria,
              demographic: { ...criteria.demographic, ageRange: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
          />

          <MultiSelect
            label="Wide Age Range"
            options={['18-29', '30-44', '45-64', '65+']}
            selected={criteria.demographic?.wideAgeRange || []}
            onChange={(val) => setCriteria({
              ...criteria,
              demographic: { ...criteria.demographic, wideAgeRange: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
          />

          <MultiSelect
            label="Reported Ethnicity"
            options={['White', 'Black/African American', 'Hispanic/Latino', 'Asian', 'Native American', 'Other', 'Unknown']}
            selected={criteria.demographic?.reportedEthnicity || []}
            onChange={(val) => setCriteria({
              ...criteria,
              demographic: { ...criteria.demographic, reportedEthnicity: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
          />

          <MultiSelect
            label="Religion"
            options={['Catholic', 'Protestant', 'Evangelical', 'Jewish', 'Muslim', 'Mormon', 'Other', 'None']}
            selected={criteria.demographic?.religion || []}
            onChange={(val) => setCriteria({
              ...criteria,
              demographic: { ...criteria.demographic, religion: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
            allowCustom
          />

          <MultiSelect
            label="Education"
            options={['High School or Less', 'Some College', 'Associate Degree', 'Bachelor Degree', 'Graduate Degree', 'Unknown']}
            selected={criteria.demographic?.education || []}
            onChange={(val) => setCriteria({
              ...criteria,
              demographic: { ...criteria.demographic, education: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={criteria.demographic?.educationCollegePlus || false}
              onChange={(e) => setCriteria({
                ...criteria,
                demographic: { ...criteria.demographic, educationCollegePlus: e.target.checked }
              })}
              className="text-blue-600"
            />
            <span className={`text-sm ${textColor}`}>College Plus Only (Bachelor's or higher)</span>
          </label>
        </div>
      </CollapsibleSection>

      {/* C) Geography Filters */}
      <CollapsibleSection
        title="C) Geography Filters"
        icon={<MapPin size={18} />}
        expanded={expandedSections.has('geography-filters')}
        onToggle={() => toggleSection('geography-filters')}
        isDarkMode={isDarkMode}
        bgColor={bgColor}
        borderColor={borderColor}
        textColor={textColor}
        textMuted={textMuted}
      >
        <div className="grid grid-cols-2 gap-4">
          <MultiSelect
            label="Congressional District"
            options={['CD-01', 'CD-02', 'CD-03', 'CD-04', 'CD-05', 'CD-06', 'CD-07', 'CD-08', 'CD-09', 'CD-10', 'CD-11', 'CD-12', 'CD-13', 'CD-14']}
            selected={criteria.geography?.congressionalDistrict || []}
            onChange={(val) => setCriteria({
              ...criteria,
              geography: { ...criteria.geography, congressionalDistrict: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
            allowCustom
          />

          <MultiSelect
            label="State Senate District"
            options={Array.from({ length: 56 }, (_, i) => `SD-${String(i + 1).padStart(2, '0')}`)}
            selected={criteria.geography?.stateSenateDistrict || []}
            onChange={(val) => setCriteria({
              ...criteria,
              geography: { ...criteria.geography, stateSenateDistrict: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
            allowCustom
          />

          <MultiSelect
            label="State House District"
            options={Array.from({ length: 180 }, (_, i) => `HD-${String(i + 1).padStart(3, '0')}`)}
            selected={criteria.geography?.stateHouseDistrict || []}
            onChange={(val) => setCriteria({
              ...criteria,
              geography: { ...criteria.geography, stateHouseDistrict: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
            allowCustom
          />

          <MultiSelect
            label="County"
            options={['Fulton', 'Gwinnett', 'Cobb', 'DeKalb', 'Clayton', 'Cherokee', 'Forsyth', 'Hall', 'Henry']}
            selected={criteria.geography?.county || []}
            onChange={(val) => setCriteria({
              ...criteria,
              geography: { ...criteria.geography, county: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
            allowCustom
          />

          <MultiSelect
            label="City"
            options={['Atlanta', 'Marietta', 'Alpharetta', 'Johns Creek', 'Roswell', 'Sandy Springs', 'Decatur']}
            selected={criteria.geography?.city || []}
            onChange={(val) => setCriteria({
              ...criteria,
              geography: { ...criteria.geography, city: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
            allowCustom
          />

          <MultiSelect
            label="ZIP Code"
            options={[]}
            selected={criteria.geography?.zipCode || []}
            onChange={(val) => setCriteria({
              ...criteria,
              geography: { ...criteria.geography, zipCode: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
            allowCustom
            placeholder="Add ZIP codes..."
          />

          <MultiSelect
            label="Metro Type"
            options={['Urban', 'Suburban', 'Rural', 'Exurban']}
            selected={criteria.geography?.metroType || []}
            onChange={(val) => setCriteria({
              ...criteria,
              geography: { ...criteria.geography, metroType: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
          />

          <MultiSelect
            label="Media Market"
            options={['Atlanta', 'Macon', 'Columbus', 'Savannah', 'Augusta']}
            selected={criteria.geography?.mediaMarket || []}
            onChange={(val) => setCriteria({
              ...criteria,
              geography: { ...criteria.geography, mediaMarket: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
            allowCustom
          />
        </div>
      </CollapsibleSection>

      {/* D) Political Filters */}
      <CollapsibleSection
        title="D) Political Filters"
        icon={<Flag size={18} />}
        expanded={expandedSections.has('political')}
        onToggle={() => toggleSection('political')}
        isDarkMode={isDarkMode}
        bgColor={bgColor}
        borderColor={borderColor}
        textColor={textColor}
        textMuted={textMuted}
      >
        <div className="grid grid-cols-3 gap-4">
          <MultiSelect
            label="Modeled Party"
            options={['Hard R', 'Lean R', 'Swing/Independent', 'Lean D', 'Hard D']}
            selected={criteria.political?.modeledParty || []}
            onChange={(val) => setCriteria({
              ...criteria,
              political: { ...criteria.political, modeledParty: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
          />

          <MultiSelect
            label="Reported Party"
            options={['Republican', 'Democrat', 'Independent', 'Libertarian', 'Green', 'Other', 'None']}
            selected={criteria.political?.reportedParty || []}
            onChange={(val) => setCriteria({
              ...criteria,
              political: { ...criteria.political, reportedParty: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
          />

          <MultiSelect
            label="Party Rollup"
            options={['Republican', 'Democrat', 'Independent', 'Third Party']}
            selected={criteria.political?.partyRollup || []}
            onChange={(val) => setCriteria({
              ...criteria,
              political: { ...criteria.political, partyRollup: val }
            })}
            isDarkMode={isDarkMode}
            textColor={textColor}
            textMuted={textMuted}
            borderColor={borderColor}
          />
        </div>
      </CollapsibleSection>

      {/* E) Contact Filters */}
      <CollapsibleSection
        title="E) Contact Filters"
        icon={<Phone size={18} />}
        expanded={expandedSections.has('contact')}
        onToggle={() => toggleSection('contact')}
        isDarkMode={isDarkMode}
        bgColor={bgColor}
        borderColor={borderColor}
        textColor={textColor}
        textMuted={textMuted}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.contact?.hasCellPhone || false}
                  onChange={(e) => setCriteria({
                    ...criteria,
                    contact: { ...criteria.contact, hasCellPhone: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm ${textColor}`}>Has Cell Phone</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.contact?.hasLandLine || false}
                  onChange={(e) => setCriteria({
                    ...criteria,
                    contact: { ...criteria.contact, hasLandLine: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm ${textColor}`}>Has Land Line</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.contact?.doNotCallCell || false}
                  onChange={(e) => setCriteria({
                    ...criteria,
                    contact: { ...criteria.contact, doNotCallCell: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm ${textColor}`}>Do Not Call Cell</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.contact?.doNotCallLandline || false}
                  onChange={(e) => setCriteria({
                    ...criteria,
                    contact: { ...criteria.contact, doNotCallLandline: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm ${textColor}`}>Do Not Call Landline</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MultiSelect
              label="Cell Phone Reliability"
              options={['High', 'Medium', 'Low', 'Unknown']}
              selected={criteria.contact?.cellPhoneReliability || []}
              onChange={(val) => setCriteria({
                ...criteria,
                contact: { ...criteria.contact, cellPhoneReliability: val }
              })}
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
              borderColor={borderColor}
            />

            <MultiSelect
              label="Land Line Reliability"
              options={['High', 'Medium', 'Low', 'Unknown']}
              selected={criteria.contact?.landLineReliability || []}
              onChange={(val) => setCriteria({
                ...criteria,
                contact: { ...criteria.contact, landLineReliability: val }
              })}
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
              borderColor={borderColor}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* F) Turnout Filters */}
      <CollapsibleSection
        title="F) Turnout & Vote History Filters"
        icon={<Vote size={18} />}
        expanded={expandedSections.has('turnout')}
        onToggle={() => toggleSection('turnout')}
        isDarkMode={isDarkMode}
        bgColor={bgColor}
        borderColor={borderColor}
        textColor={textColor}
        textMuted={textMuted}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <MultiSelect
              label="Voting Frequency - General"
              options={['Always (4/4)', 'Often (3/4)', 'Sometimes (2/4)', 'Rarely (1/4)', 'Never (0/4)']}
              selected={criteria.turnout?.votingFrequencyGeneral || []}
              onChange={(val) => setCriteria({
                ...criteria,
                turnout: { ...criteria.turnout, votingFrequencyGeneral: val }
              })}
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
              borderColor={borderColor}
            />

            <MultiSelect
              label="Voting Frequency - Primary"
              options={['Always (4/4)', 'Often (3/4)', 'Sometimes (2/4)', 'Rarely (1/4)', 'Never (0/4)']}
              selected={criteria.turnout?.votingFrequencyPrimary || []}
              onChange={(val) => setCriteria({
                ...criteria,
                turnout: { ...criteria.turnout, votingFrequencyPrimary: val }
              })}
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
              borderColor={borderColor}
            />

            <MultiSelect
              label="Voter Status"
              options={['Active', 'Inactive', 'Pending', 'Cancelled']}
              selected={criteria.turnout?.voterStatus || []}
              onChange={(val) => setCriteria({
                ...criteria,
                turnout: { ...criteria.turnout, voterStatus: val }
              })}
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
              borderColor={borderColor}
            />

            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={criteria.turnout?.permanentAbsentee || false}
                  onChange={(e) => setCriteria({
                    ...criteria,
                    turnout: { ...criteria.turnout, permanentAbsentee: e.target.checked }
                  })}
                  className="text-blue-600"
                />
                <span className={`text-sm font-semibold ${textColor}`}>Permanent Absentee</span>
              </label>
            </div>
          </div>

          {/* Vote History by Year */}
          <div>
            <h4 className={`text-sm font-bold ${textColor} mb-3`}>Vote History by Year</h4>
            <div className="grid grid-cols-6 gap-3">
              {[
                { year: 2024, label: '2024 General', key: 'general2024' },
                { year: 2024, label: '2024 Pres Primary', key: 'presidentialPrimary2024' },
                { year: 2024, label: '2024 Primary', key: 'primary2024' },
                { year: 2023, label: '2023 General', key: 'general2023' },
                { year: 2023, label: '2023 Primary', key: 'primary2023' },
                { year: 2022, label: '2022 General', key: 'general2022' },
                { year: 2022, label: '2022 Primary', key: 'primary2022' },
                { year: 2021, label: '2021 General', key: 'general2021' },
                { year: 2021, label: '2021 Primary', key: 'primary2021' },
                { year: 2020, label: '2020 General', key: 'general2020' },
                { year: 2020, label: '2020 Pres Primary', key: 'presidentialPrimary2020' },
                { year: 2020, label: '2020 Primary', key: 'primary2020' },
                { year: 2018, label: '2018 General', key: 'general2018' },
                { year: 2018, label: '2018 Primary', key: 'primary2018' },
                { year: 2016, label: '2016 General', key: 'general2016' },
                { year: 2016, label: '2016 Pres Primary', key: 'presidentialPrimary2016' },
                { year: 2016, label: '2016 Primary', key: 'primary2016' },
                { year: 2014, label: '2014 General', key: 'general2014' },
                { year: 2014, label: '2014 Primary', key: 'primary2014' },
                { year: 2012, label: '2012 General', key: 'general2012' },
                { year: 2012, label: '2012 Pres Primary', key: 'presidentialPrimary2012' },
                { year: 2012, label: '2012 Primary', key: 'primary2012' },
              ].map((election) => (
                <label key={election.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!criteria.turnout?.[election.key as keyof typeof criteria.turnout]}
                    onChange={(e) => setCriteria({
                      ...criteria,
                      turnout: { ...criteria.turnout, [election.key]: e.target.checked }
                    })}
                    className="text-blue-600"
                  />
                  <span className={`text-xs ${textColor}`}>{election.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Registration Date Range */}
          <div>
            <h4 className={`text-sm font-bold ${textColor} mb-3`}>Registration Date Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold ${textMuted} mb-2`}>From</label>
                <input
                  type="date"
                  value={criteria.turnout?.registrationDate?.from || ''}
                  onChange={(e) => setCriteria({
                    ...criteria,
                    turnout: { 
                      ...criteria.turnout, 
                      registrationDate: { ...criteria.turnout?.registrationDate, from: e.target.value }
                    }
                  })}
                  className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold ${textMuted} mb-2`}>To</label>
                <input
                  type="date"
                  value={criteria.turnout?.registrationDate?.to || ''}
                  onChange={(e) => setCriteria({
                    ...criteria,
                    turnout: { 
                      ...criteria.turnout, 
                      registrationDate: { ...criteria.turnout?.registrationDate, to: e.target.value }
                    }
                  })}
                  className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg`}
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* G) Output Preferences & Notes */}
      <CollapsibleSection
        title="G) Output Preferences & Notes"
        icon={<Sparkles size={18} />}
        expanded={expandedSections.has('output')}
        onToggle={() => toggleSection('output')}
        isDarkMode={isDarkMode}
        bgColor={bgColor}
        borderColor={borderColor}
        textColor={textColor}
        textMuted={textMuted}
      >
        <div className="space-y-4">
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
              Special Instructions / Notes
            </label>
            <textarea
              value={criteria.notes || ''}
              onChange={(e) => setCriteria({ ...criteria, notes: e.target.value })}
              placeholder="Any special requirements or notes..."
              rows={4}
              className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
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
  icon: React.ReactNode;
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
  icon,
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
        <div className="flex items-center gap-3">
          {icon}
          <h3 className={`text-lg font-bold ${textColor}`}>
            {title}
          </h3>
        </div>
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
