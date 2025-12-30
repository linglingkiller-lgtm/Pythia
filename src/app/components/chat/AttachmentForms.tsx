import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { AttachmentType, MessageAttachment } from './chatTypes';
import { getOrgMembers } from './chatUtils';

interface AttachmentFormProps {
  type: AttachmentType;
  draftText?: string;
  onConfirm: (attachment: Omit<MessageAttachment, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function AttachmentForm({ type, draftText = '', onConfirm, onCancel }: AttachmentFormProps) {
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const inputClass = `w-full px-3 py-2 rounded-lg border ${
    isDarkMode
      ? 'bg-slate-700 border-white/10 text-white placeholder-gray-500'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
  } focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const labelClass = `block text-sm font-medium ${textColor} mb-1.5`;

  // Render appropriate form based on type
  switch (type) {
    case 'file':
      return <FileForm inputClass={inputClass} labelClass={labelClass} textColor={textColor} onConfirm={onConfirm} onCancel={onCancel} />;
    case 'task':
      return <TaskForm inputClass={inputClass} labelClass={labelClass} textColor={textColor} textMuted={textMuted} draftText={draftText} onConfirm={onConfirm} onCancel={onCancel} />;
    case 'calendar_invite':
      return <CalendarForm inputClass={inputClass} labelClass={labelClass} textColor={textColor} textMuted={textMuted} onConfirm={onConfirm} onCancel={onCancel} />;
    case 'record':
      return <RecordForm inputClass={inputClass} labelClass={labelClass} textColor={textColor} draftText={draftText} onConfirm={onConfirm} onCancel={onCancel} />;
    case 'link':
      return <LinkForm inputClass={inputClass} labelClass={labelClass} textColor={textColor} onConfirm={onConfirm} onCancel={onCancel} />;
    case 'poll':
      return <PollForm inputClass={inputClass} labelClass={labelClass} textColor={textColor} textMuted={textMuted} onConfirm={onConfirm} onCancel={onCancel} />;
    case 'approval':
      return <ApprovalForm inputClass={inputClass} labelClass={labelClass} textColor={textColor} textMuted={textMuted} onConfirm={onConfirm} onCancel={onCancel} />;
    case 'pythia_brief':
      return <PythiaBriefForm inputClass={inputClass} labelClass={labelClass} textColor={textColor} textMuted={textMuted} onConfirm={onConfirm} onCancel={onCancel} />;
    default:
      return null;
  }
}

// FILE FORM
function FileForm({ inputClass, labelClass, textColor, onConfirm, onCancel }: any) {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('PDF');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (!fileName.trim()) return;

    onConfirm({
      type: 'file',
      title: fileName,
      subtitle: fileType,
      preview: { fileType, description },
      linked: {},
      payload: { fileName, fileType, description, url: url || 'https://example.com/file.pdf' },
    });
  };

  return (
    <FormWrapper title="Attach File" onCancel={onCancel}>
      <label className={labelClass}>File Name *</label>
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="Document.pdf"
        className={inputClass}
      />

      <label className={labelClass}>File Type</label>
      <select value={fileType} onChange={(e) => setFileType(e.target.value)} className={inputClass}>
        <option>PDF</option>
        <option>DOCX</option>
        <option>PNG</option>
        <option>XLSX</option>
        <option>OTHER</option>
      </select>

      <label className={labelClass}>Description (Optional)</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description..."
        rows={2}
        className={inputClass}
      />

      <label className={labelClass}>File URL (Demo)</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/file.pdf"
        className={inputClass}
      />

      <FormActions onConfirm={handleSubmit} onCancel={onCancel} confirmLabel="Attach File" disabled={!fileName.trim()} />
    </FormWrapper>
  );
}

// TASK FORM
function TaskForm({ inputClass, labelClass, textColor, textMuted, draftText, onConfirm, onCancel }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(draftText);
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');

  const members = getOrgMembers();

  const handleSubmit = () => {
    if (!title.trim()) return;

    const assigneeName = members.find(m => m.userId === assignee)?.name || 'Unassigned';

    onConfirm({
      type: 'task',
      title,
      subtitle: `Assigned to ${assigneeName}`,
      preview: { status, priority, dueDate, assigneeName },
      linked: { taskId: `task_${Date.now()}` },
      payload: { title, description, status, priority, dueDate, assignee },
    });
  };

  return (
    <FormWrapper title="Create Task" onCancel={onCancel}>
      <label className={labelClass}>Title *</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className={inputClass}
      />

      <label className={labelClass}>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description..."
        rows={3}
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <label className={labelClass}>Due Date</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className={inputClass}
      />

      <label className={labelClass}>Assignee</label>
      <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className={inputClass}>
        <option value="">Unassigned</option>
        {members.map(m => (
          <option key={m.userId} value={m.userId}>{m.name}</option>
        ))}
      </select>

      <FormActions onConfirm={handleSubmit} onCancel={onCancel} confirmLabel="Create Task" disabled={!title.trim()} />
    </FormWrapper>
  );
}

// CALENDAR FORM
function CalendarForm({ inputClass, labelClass, textColor, textMuted, onConfirm, onCancel }: any) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [attendees, setAttendees] = useState<string[]>([]);
  const [generateBrief, setGenerateBrief] = useState(true);

  const members = getOrgMembers();

  const handleSubmit = () => {
    if (!title.trim() || !date || !startTime || !endTime) return;

    const attendeeNames = members.filter(m => attendees.includes(m.userId)).map(m => m.name);

    onConfirm({
      type: 'calendar_invite',
      title,
      subtitle: `${date} at ${startTime}`,
      preview: { date, startTime, endTime, location, attendeeNames },
      linked: { eventId: `event_${Date.now()}` },
      payload: { title, date, startTime, endTime, location, description, attendees, generateBrief },
    });
  };

  return (
    <FormWrapper title="Create Calendar Invite" onCancel={onCancel}>
      <label className={labelClass}>Title *</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Meeting title..."
        className={inputClass}
      />

      <label className={labelClass}>Date *</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Start Time *</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>End Time *</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <label className={labelClass}>Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Conference Room A"
        className={inputClass}
      />

      <label className={labelClass}>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Meeting description..."
        rows={2}
        className={inputClass}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={generateBrief}
          onChange={(e) => setGenerateBrief(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className={`text-sm ${textColor}`}>Generate meeting brief</span>
      </label>

      <FormActions onConfirm={handleSubmit} onCancel={onCancel} confirmLabel="Create Invite" disabled={!title.trim() || !date || !startTime || !endTime} />
    </FormWrapper>
  );
}

// RECORD FORM
function RecordForm({ inputClass, labelClass, textColor, draftText, onConfirm, onCancel }: any) {
  const [recordType, setRecordType] = useState('brief');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(draftText);
  const [tags, setTags] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;

    onConfirm({
      type: 'record',
      title,
      subtitle: recordType,
      preview: { recordType, tags: tags.split(',').map(t => t.trim()).filter(Boolean) },
      linked: { recordId: `record_${Date.now()}` },
      payload: { recordType, title, content, tags },
    });
  };

  return (
    <FormWrapper title="Create Record" onCancel={onCancel}>
      <label className={labelClass}>Type</label>
      <select value={recordType} onChange={(e) => setRecordType(e.target.value)} className={inputClass}>
        <option value="brief">Brief</option>
        <option value="meeting_note">Meeting Note</option>
        <option value="weekly_update">Weekly Update</option>
        <option value="analysis">Analysis</option>
        <option value="export">Export</option>
      </select>

      <label className={labelClass}>Title *</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Record title..."
        className={inputClass}
      />

      <label className={labelClass}>Content</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Record content..."
        rows={4}
        className={inputClass}
      />

      <label className={labelClass}>Tags (comma-separated)</label>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="campaign, district-12, urgent"
        className={inputClass}
      />

      <FormActions onConfirm={handleSubmit} onCancel={onCancel} confirmLabel="Create Record" disabled={!title.trim()} />
    </FormWrapper>
  );
}

// LINK FORM
function LinkForm({ inputClass, labelClass, textColor, onConfirm, onCancel }: any) {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [previewStyle, setPreviewStyle] = useState('compact');

  const handleSubmit = () => {
    if (!url.trim()) return;

    onConfirm({
      type: 'link',
      title: label || url,
      subtitle: new URL(url).hostname,
      preview: { previewStyle },
      linked: {},
      payload: { url, label, previewStyle },
    });
  };

  return (
    <FormWrapper title="Add Link" onCancel={onCancel}>
      <label className={labelClass}>URL *</label>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className={inputClass}
      />

      <label className={labelClass}>Label (Optional)</label>
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Link label..."
        className={inputClass}
      />

      <label className={labelClass}>Preview Style</label>
      <select value={previewStyle} onChange={(e) => setPreviewStyle(e.target.value)} className={inputClass}>
        <option value="compact">Compact</option>
        <option value="large">Large</option>
      </select>

      <FormActions onConfirm={handleSubmit} onCancel={onCancel} confirmLabel="Add Link" disabled={!url.trim()} />
    </FormWrapper>
  );
}

// POLL FORM
function PollForm({ inputClass, labelClass, textColor, textMuted, onConfirm, onCancel }: any) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [duration, setDuration] = useState('24h');

  const handleSubmit = () => {
    const validOptions = options.filter(o => o.trim());
    if (!question.trim() || validOptions.length < 2) return;

    onConfirm({
      type: 'poll',
      title: question,
      subtitle: `${validOptions.length} options`,
      preview: { options: validOptions, allowMultiple, duration },
      linked: {},
      payload: { question, options: validOptions, allowMultiple, duration, votes: {} },
    });
  };

  const addOption = () => {
    if (options.length < 6) setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <FormWrapper title="Create Poll" onCancel={onCancel}>
      <label className={labelClass}>Question *</label>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What should we do?"
        className={inputClass}
      />

      <label className={labelClass}>Options (2-6)</label>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[i] = e.target.value;
                setOptions(newOpts);
              }}
              placeholder={`Option ${i + 1}`}
              className={inputClass}
            />
            {options.length > 2 && (
              <button
                onClick={() => removeOption(i)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        {options.length < 6 && (
          <button
            onClick={addOption}
            className={`flex items-center gap-2 text-sm ${textMuted} hover:text-blue-500`}
          >
            <Plus size={14} /> Add option
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass}>
            <option value="1h">1 hour</option>
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allowMultiple}
              onChange={(e) => setAllowMultiple(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className={`text-sm ${textColor}`}>Allow multiple</span>
          </label>
        </div>
      </div>

      <FormActions
        onConfirm={handleSubmit}
        onCancel={onCancel}
        confirmLabel="Create Poll"
        disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
      />
    </FormWrapper>
  );
}

// APPROVAL FORM
function ApprovalForm({ inputClass, labelClass, textColor, textMuted, onConfirm, onCancel }: any) {
  const [title, setTitle] = useState('');
  const [approver, setApprover] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');

  const members = getOrgMembers();

  const handleSubmit = () => {
    if (!title.trim() || !approver) return;

    const approverName = members.find(m => m.userId === approver)?.name || 'Unknown';

    onConfirm({
      type: 'approval',
      title,
      subtitle: `Awaiting ${approverName}`,
      preview: { approverName, deadline, status: 'pending' },
      linked: {},
      payload: { title, approver, deadline, notes, status: 'pending' },
    });
  };

  return (
    <FormWrapper title="Request Approval" onCancel={onCancel}>
      <label className={labelClass}>Approval Title *</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs approval?"
        className={inputClass}
      />

      <label className={labelClass}>Approver *</label>
      <select value={approver} onChange={(e) => setApprover(e.target.value)} className={inputClass}>
        <option value="">Select approver...</option>
        {members.map(m => (
          <option key={m.userId} value={m.userId}>{m.name}</option>
        ))}
      </select>

      <label className={labelClass}>Deadline</label>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className={inputClass}
      />

      <label className={labelClass}>Notes</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Additional context..."
        rows={3}
        className={inputClass}
      />

      <FormActions onConfirm={handleSubmit} onCancel={onCancel} confirmLabel="Request Approval" disabled={!title.trim() || !approver} />
    </FormWrapper>
  );
}

// PYTHIA BRIEF FORM
function PythiaBriefForm({ inputClass, labelClass, textColor, textMuted, onConfirm, onCancel }: any) {
  const [briefType, setBriefType] = useState('project_risk');
  const [includeChat, setIncludeChat] = useState(true);

  const handleSubmit = () => {
    const briefTitles: Record<string, string> = {
      project_risk: 'Project Risk Analysis',
      weekly_summary: 'Weekly Summary',
      meeting_prep: 'Meeting Prep Brief',
      issue_snapshot: 'Issue Snapshot',
    };

    const briefContent: Record<string, string> = {
      project_risk: '**Risk Assessment**: District 12 Campaign\n\n**Critical Issues**:\n- Door knocking pace 18% behind target\n- Budget utilization at 77% with 35% timeline remaining\n- Potential shortfall of 1,200 doors by deadline\n\n**Recommendations**:\n1. Add 2 canvassers to evening shift\n2. Extend hours to 8pm through weekend\n3. Reallocate $5k from digital to field ops',
      weekly_summary: '**Week of Dec 16-22, 2024**\n\n**Progress**:\n- 847 doors knocked (+12% from last week)\n- 3 volunteer recruitment events\n- $8,500 budget utilized\n\n**Blockers**:\n- Weather delays in District 12\n- 2 canvassers out sick\n\n**Next Week**:\n- Holiday volunteer surge expected\n- Final push before New Year',
      meeting_prep: '**Meeting Brief**: Smith for Senate Strategy Session\n\n**Attendees**: Campaign Manager, Field Director, Finance Lead\n\n**Agenda**:\n1. Review Q4 performance\n2. Discuss budget reallocation\n3. Plan January volunteer recruitment\n\n**Key Data Points**:\n- Current door count: 2,847 / 15,000\n- Budget: $34,500 / $45,000\n- Volunteer pool: 42 active',
      issue_snapshot: '**Issue Tracking Snapshot**\n\n**Active Issues** (8):\n- Healthcare access (priority: high)\n- Education funding (priority: high)\n- Infrastructure (priority: medium)\n- Tax reform (priority: low)\n\n**Trending Up**:\n- Climate policy (+15% mentions)\n\n**Trending Down**:\n- Trade policy (-8% mentions)',
    };

    onConfirm({
      type: 'pythia_brief',
      title: briefTitles[briefType],
      subtitle: 'Generated by Revere',
      preview: { briefType, includeChat },
      linked: { recordId: `brief_${Date.now()}` },
      payload: { briefType, includeChat, content: briefContent[briefType] },
    });
  };

  return (
    <FormWrapper title="Generate Revere Brief" onCancel={onCancel}>
      <label className={labelClass}>Brief Type</label>
      <select value={briefType} onChange={(e) => setBriefType(e.target.value)} className={inputClass}>
        <option value="project_risk">Project Risk Analysis</option>
        <option value="weekly_summary">Weekly Summary</option>
        <option value="meeting_prep">Meeting Prep Brief</option>
        <option value="issue_snapshot">Issue Snapshot</option>
      </select>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={includeChat}
          onChange={(e) => setIncludeChat(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className={`text-sm ${textColor}`}>Include last 10 chat messages in analysis</span>
      </label>

      <div className={`p-3 rounded-lg border ${
        isDarkMode ? 'bg-slate-700 border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <p className={`text-xs ${textMuted}`}>
          Revere will analyze the selected data and generate a comprehensive brief. This will also create a new Record that can be viewed in your Records page.
        </p>
      </div>

      <FormActions onConfirm={handleSubmit} onCancel={onCancel} confirmLabel="Generate Brief" />
    </FormWrapper>
  );
}

// Helper Components
function FormWrapper({ title, children, onCancel }: { title: string; children: React.ReactNode; onCancel: () => void }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        className={`
          w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200
          ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
        `}
      >
        <div className={`
          px-6 py-4 border-b flex items-center justify-between
          ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
        `}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
          >
            <X size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          </button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function FormActions({ onConfirm, onCancel, confirmLabel, disabled }: any) {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex gap-3 pt-4">
      <button
        onClick={onCancel}
        className={`
          flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors
          ${isDarkMode
            ? 'bg-slate-700 text-white hover:bg-slate-600'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }
        `}
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={disabled}
        className={`
          flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors
          ${disabled
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        {confirmLabel}
      </button>
    </div>
  );
}

function isDarkMode() {
  const { isDarkMode } = useTheme();
  return isDarkMode;
}