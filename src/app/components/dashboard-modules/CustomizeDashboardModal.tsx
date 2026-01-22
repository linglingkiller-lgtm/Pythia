import React, { useState } from 'react';
import { X, Search, Target, FileText, CheckSquare, Scale, Users, DollarSign, Archive, Bell, Newspaper, Users2, Flame, Calendar, LayoutGrid, Edit3, Unlock, RotateCcw } from 'lucide-react';
import { useDashboard, ModuleType, ModuleSize, DepartmentSilo } from '../../contexts/DashboardContext';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';
import { createPortal } from 'react-dom';

interface CustomizeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModuleCategory = 'executive' | 'lobbying' | 'public-affairs' | 'campaign-services' | 'productivity' | 'compliance';

interface ModuleTemplate {
  type: ModuleType;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  category: ModuleCategory[];
  defaultSize: ModuleSize;
  defaultFilters: any;
}

const MODULE_TEMPLATES: ModuleTemplate[] = [
  {
    type: 'war-room',
    title: 'War Room',
    description: 'Real-time priority projects with status tracking and top actions',
    icon: Target,
    category: ['executive', 'lobbying', 'public-affairs', 'campaign-services'],
    defaultSize: 'large',
    defaultFilters: { department: 'all' },
  },
  {
    type: 'tasks',
    title: 'Tasks',
    description: 'Upcoming tasks, overdue items, and daily focus list',
    icon: CheckSquare,
    category: ['executive', 'productivity'],
    defaultSize: 'medium',
    defaultFilters: { showOnlyMine: true },
  },
  {
    type: 'deliverables',
    title: 'Deliverables',
    description: 'Client deliverables with status and due dates',
    icon: FileText,
    category: ['executive', 'public-affairs'],
    defaultSize: 'medium',
    defaultFilters: {},
  },
  {
    type: 'bills-watchlist',
    title: 'Bills Watchlist',
    description: 'Tracked bills with progress and next scheduled events',
    icon: Scale,
    category: ['executive', 'lobbying'],
    defaultSize: 'large',
    defaultFilters: {},
  },
  {
    type: 'legislator-touchpoints',
    title: 'Legislator Touchpoints',
    description: 'Recent interactions and follow-up needs',
    icon: Users,
    category: ['lobbying'],
    defaultSize: 'medium',
    defaultFilters: {},
  },
  {
    type: 'legislator-watchlist',
    title: 'Legislator Watchlist',
    description: 'Your watched legislators with quick contact info',
    icon: Users,
    category: ['executive', 'lobbying'],
    defaultSize: 'medium',
    defaultFilters: {},
  },
  {
    type: 'client-pulse',
    title: 'Client Pulse',
    description: 'Client activity, contract runway, and risk flags',
    icon: Users2,
    category: ['executive', 'lobbying', 'public-affairs'],
    defaultSize: 'large',
    defaultFilters: { department: 'all' },
  },
  {
    type: 'door-tracker',
    title: 'Door Tracker',
    description: 'Canvassing project progress and pace metrics',
    icon: Target,
    category: ['executive', 'campaign-services'],
    defaultSize: 'large',
    defaultFilters: {},
  },
  {
    type: 'budget-snapshot',
    title: 'Budget Snapshot',
    description: 'Burn rate, remaining budget, and risk indicators',
    icon: DollarSign,
    category: ['campaign-services'],
    defaultSize: 'medium',
    defaultFilters: {},
  },
  {
    type: 'records-compliance',
    title: 'Records & Compliance',
    description: 'Recent records and compliance reminders',
    icon: Archive,
    category: ['lobbying', 'compliance', 'public-affairs'],
    defaultSize: 'medium',
    defaultFilters: {},
  },
  {
    type: 'notifications',
    title: 'Notifications',
    description: 'High-priority alerts and reminders',
    icon: Bell,
    category: ['executive'],
    defaultSize: 'medium',
    defaultFilters: {},
  },
  {
    type: 'media-narrative',
    title: 'Media & Narrative Monitor',
    description: 'News mentions and sentiment tracking',
    icon: Newspaper,
    category: ['public-affairs'],
    defaultSize: 'large',
    defaultFilters: {},
  },
  {
    type: 'stakeholder-map',
    title: 'Stakeholder Map',
    description: 'Key stakeholders and outreach tracking',
    icon: Users2,
    category: ['public-affairs'],
    defaultSize: 'medium',
    defaultFilters: {},
  },
  {
    type: 'issues-watchlist',
    title: 'Issues Watchlist',
    description: 'Tracked issues with movement indicators',
    icon: Flame,
    category: ['public-affairs'],
    defaultSize: 'medium',
    defaultFilters: {},
  },
  {
    type: 'committee-calendar',
    title: 'Committee Calendar',
    description: 'Upcoming hearings and agenda items',
    icon: Calendar,
    category: ['lobbying'],
    defaultSize: 'medium',
    defaultFilters: { timeRange: '7d' },
  },
];

type TabType = 'modules' | 'presets' | 'edit';

export function CustomizeDashboardModal({ isOpen, onClose }: CustomizeDashboardModalProps) {
  const { addModule, resetToPreset, setEditMode } = useDashboard();
  const { showToast } = useToast();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<ModuleTemplate | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [size, setSize] = useState<ModuleSize>('medium');
  const [department, setDepartment] = useState<DepartmentSilo>('all');

  const filteredTemplates = MODULE_TEMPLATES.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: ModuleTemplate) => {
    setSelectedTemplate(template);
    setCustomTitle(template.title);
    setSize(template.defaultSize);
    setDepartment(template.defaultFilters.department || 'all');
  };

  const handleAddModule = () => {
    if (!selectedTemplate) return;

    addModule({
      type: selectedTemplate.type,
      title: customTitle || selectedTemplate.title,
      size,
      filters: {
        ...selectedTemplate.defaultFilters,
        department,
      },
      pinned: false,
    });

    showToast(`"${customTitle || selectedTemplate.title}" added to dashboard`, 'success');
    onClose();
    
    // Reset state
    setSelectedTemplate(null);
    setCustomTitle('');
    setSearchQuery('');
  };

  const handleResetToPreset = (preset: 'executive' | 'lobbying' | 'campaign-services' | 'public-affairs') => {
    resetToPreset(preset);
    showToast(`Dashboard reset to ${preset} preset`, 'success');
    onClose();
  };

  const handleEnterEditMode = () => {
    setEditMode(true);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Animated gradient background overlay */}
      <div className="fixed inset-0 z-[100] transition-opacity duration-500">
        {isDarkMode ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/40 to-blue-950/40 animate-gradient-shift">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-950/20 via-transparent to-indigo-950/30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/60 to-pink-50/40 animate-gradient-shift">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-100/30 via-transparent to-blue-100/40"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-200/30 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-transparent"></div>
          </div>
        )}
        
        {/* Backdrop blur overlay */}
        <div className="absolute inset-0 backdrop-blur-xl bg-black/30"></div>
      </div>

      {/* Modal content */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className={`
          rounded-2xl shadow-2xl w-full max-w-5xl h-[600px] flex flex-col transition-all duration-500 transform scale-100
          ${isDarkMode 
            ? 'bg-slate-900/95 backdrop-blur-xl shadow-purple-500/20 border border-white/10' 
            : 'bg-white/95 backdrop-blur-xl shadow-xl border border-gray-200/50'
          }
        `}>
          {/* Header */}
          <div className={`
            flex items-center justify-between px-6 py-4 border-b
            ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
          `}>
            <div>
              <h2 className={`
                text-2xl font-bold
                ${isDarkMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400' 
                  : 'text-gray-900'
                }
              `}>
                Customize Dashboard
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Add modules, apply presets, or edit your layout
              </p>
            </div>
            <button
              onClick={onClose}
              className={`
                transition-colors
                ${isDarkMode 
                  ? 'text-gray-400 hover:text-purple-300' 
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className={`
            flex gap-2 px-6 py-3 border-b
            ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
          `}>
            <button
              onClick={() => setActiveTab('modules')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                ${activeTab === 'modules'
                  ? isDarkMode
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-purple-100 text-purple-700 border border-purple-300'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <LayoutGrid size={16} />
              Add Modules
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                ${activeTab === 'presets'
                  ? isDarkMode
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-purple-100 text-purple-700 border border-purple-300'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <RotateCcw size={16} />
              Presets
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                ${activeTab === 'edit'
                  ? isDarkMode
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-purple-100 text-purple-700 border border-purple-300'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <Edit3 size={16} />
              Edit Layout
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {/* Modules Tab */}
            {activeTab === 'modules' && (
              <div className="flex h-full overflow-hidden">
                {/* Left Column - Module Catalog */}
                <div className={`
                  w-1/2 border-r flex flex-col
                  ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
                `}>
                  <div className={`
                    p-4 border-b
                    ${isDarkMode ? 'border-white/5' : 'border-gray-100'}
                  `}>
                    <div className="relative mb-3">
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        placeholder="Search modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`
                          w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-all duration-300
                          focus:outline-none
                          ${isDarkMode
                            ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-slate-750'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500'
                          }
                        `}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {(['all', 'executive', 'lobbying', 'campaign-services', 'public-affairs', 'productivity', 'compliance'] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 text-xs rounded-full font-medium transition-all duration-300 ${
                            selectedCategory === cat
                              ? isDarkMode
                                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                                : 'bg-purple-600 text-white'
                              : isDarkMode
                                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {cat === 'all' ? 'All' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredTemplates.map(template => {
                      const Icon = template.icon;
                      return (
                        <button
                          key={template.type}
                          onClick={() => handleSelectTemplate(template)}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                            selectedTemplate?.type === template.type
                              ? isDarkMode
                                ? 'border-purple-500 bg-purple-500/20 backdrop-blur-sm'
                                : 'border-purple-500 bg-purple-50'
                              : isDarkMode
                                ? 'border-slate-700 hover:border-purple-500/50 hover:bg-slate-800'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              selectedTemplate?.type === template.type
                                ? isDarkMode
                                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50'
                                  : 'bg-purple-600 text-white'
                                : isDarkMode
                                  ? 'bg-slate-700 text-gray-400'
                                  : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {template.title}
                              </h4>
                              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {filteredTemplates.length === 0 && (
                      <div className="text-center py-12">
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No modules found</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Try adjusting your search or filters
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Preview & Configuration */}
                <div className="w-1/2 flex flex-col">
                  {selectedTemplate ? (
                    <>
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div>
                          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Configuration
                          </h3>
                          
                          <div className="space-y-4">
                            <div>
                              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Module Title
                              </label>
                              <input
                                type="text"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                placeholder={selectedTemplate.title}
                                className={`
                                  w-full px-3 py-2 border rounded-lg text-sm transition-all duration-300
                                  focus:outline-none
                                  ${isDarkMode
                                    ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-slate-750'
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500'
                                  }
                                `}
                              />
                            </div>

                            <div>
                              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Size
                              </label>
                              <div className="flex gap-2">
                                {(['small', 'medium', 'large'] as const).map(s => (
                                  <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    className={`flex-1 px-3 py-2 text-sm rounded-lg border font-medium capitalize transition-all duration-300 ${
                                      size === s
                                        ? isDarkMode
                                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                          : 'border-purple-500 bg-purple-50 text-purple-700'
                                        : isDarkMode
                                          ? 'border-slate-600 text-gray-400 hover:border-slate-500 hover:bg-slate-800'
                                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                              <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Small: 4 cols | Medium: 6 cols | Large: 12 cols (full width)
                              </p>
                            </div>

                            <div>
                              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Department Scope
                              </label>
                              <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value as DepartmentSilo)}
                                className={`
                                  w-full px-3 py-2 border rounded-lg text-sm transition-all duration-300
                                  focus:outline-none
                                  ${isDarkMode
                                    ? 'bg-slate-800 border-slate-600 text-white focus:border-purple-500'
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500'
                                  }
                                `}
                              >
                                <option value="all">All Departments</option>
                                <option value="lobbying">Lobbying</option>
                                <option value="campaign-services">Campaign Services</option>
                                <option value="public-affairs">Public Affairs</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className={`border-t pt-6 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                          <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Preview
                          </h4>
                          <div className={`
                            border rounded-lg overflow-hidden
                            ${isDarkMode 
                              ? 'border-slate-700 bg-slate-800/50' 
                              : 'border-gray-200 bg-gray-50'
                            }
                          `}>
                            <div className={`
                              border-b px-4 py-3
                              ${isDarkMode 
                                ? 'bg-slate-800 border-white/5' 
                                : 'bg-white border-gray-100'
                              }
                            `}>
                              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {customTitle || selectedTemplate.title}
                              </h4>
                              {department !== 'all' && (
                                <span className={`text-xs capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {department.replace('-', ' ')}
                                </span>
                              )}
                            </div>
                            <div className="p-4">
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {selectedTemplate.description}
                              </p>
                              <div className="mt-3 flex items-center gap-2">
                                <span className={`
                                  px-2 py-1 text-xs rounded
                                  ${isDarkMode 
                                    ? 'bg-slate-700 text-gray-300' 
                                    : 'bg-gray-200 text-gray-600'
                                  }
                                `}>
                                  Demo Data
                                </span>
                                <span className={`
                                  px-2 py-1 text-xs rounded capitalize
                                  ${isDarkMode 
                                    ? 'bg-slate-700 text-gray-300' 
                                    : 'bg-gray-200 text-gray-600'
                                  }
                                `}>
                                  {size}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`p-6 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <button
                          onClick={handleAddModule}
                          className={`
                            w-full py-2.5 font-medium rounded-lg transition-all duration-300
                            ${isDarkMode
                              ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }
                          `}
                        >
                          Add to Dashboard
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-6">
                      <div className="text-center">
                        <div className={`
                          w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3
                          ${isDarkMode 
                            ? 'bg-gradient-to-br from-slate-800 to-slate-700' 
                            : 'bg-gray-100'
                          }
                        `}>
                          <Target className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-gray-400'}`} />
                        </div>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Select a module
                        </p>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Choose from the list to configure and preview
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Presets Tab */}
            {activeTab === 'presets' && (
              <div className="h-full overflow-y-auto p-8">
                <div className="max-w-2xl mx-auto">
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Dashboard Presets
                  </h3>
                  <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Reset your dashboard to a pre-configured layout optimized for specific roles
                  </p>

                  <div className="space-y-3">
                    {[
                      { id: 'executive', title: 'Executive', description: 'High-level overview with KPIs, war room, and client pulse' },
                      { id: 'lobbying', title: 'Lobbying', description: 'Bills watchlist, legislator tracking, and touchpoint management' },
                      { id: 'campaign-services', title: 'Campaign Services', description: 'Door tracker, budget snapshot, and campaign tasks' },
                      { id: 'public-affairs', title: 'Public Affairs', description: 'Media monitoring, stakeholder mapping, and issue tracking' }
                    ].map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => handleResetToPreset(preset.id as any)}
                        className={`
                          w-full p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02]
                          ${isDarkMode
                            ? 'border-slate-700 bg-slate-800/50 hover:border-purple-500/50 hover:bg-slate-800'
                            : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center
                            ${isDarkMode
                              ? 'bg-gradient-to-br from-purple-600 to-purple-700'
                              : 'bg-purple-600'
                            }
                          `}>
                            <LayoutGrid className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {preset.title}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {preset.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className={`
                    mt-6 p-4 rounded-lg border
                    ${isDarkMode
                      ? 'bg-yellow-500/10 border-yellow-500/20'
                      : 'bg-yellow-50 border-yellow-200'
                    }
                  `}>
                    <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                      ⚠️ Applying a preset will replace your current dashboard layout
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Layout Tab */}
            {activeTab === 'edit' && (
              <div className="h-full overflow-y-auto p-8">
                <div className="max-w-2xl mx-auto">
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Edit Dashboard Layout
                  </h3>
                  <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Enter edit mode to rearrange and resize your dashboard modules
                  </p>

                  <div className={`
                    p-6 rounded-xl border mb-6
                    ${isDarkMode
                      ? 'bg-slate-800/50 border-slate-700'
                      : 'bg-gray-50 border-gray-200'
                    }
                  `}>
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                        ${isDarkMode
                          ? 'bg-gradient-to-br from-purple-600 to-purple-700'
                          : 'bg-purple-600'
                        }
                      `}>
                        <Edit3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          What is Edit Mode?
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Edit mode allows you to drag modules to reposition them and drag the bottom-right corner to resize. Your changes are saved when you click "Save Layout".
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className={`w-1 rounded-full ${isDarkMode ? 'bg-purple-500' : 'bg-purple-600'}`}></div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Drag to Move
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Click and drag any module to reposition it
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className={`w-1 rounded-full ${isDarkMode ? 'bg-purple-500' : 'bg-purple-600'}`}></div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Resize Modules
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Drag the bottom-right corner to resize
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className={`w-1 rounded-full ${isDarkMode ? 'bg-purple-500' : 'bg-purple-600'}`}></div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Save Changes
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Click "Save Layout" when you're done editing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleEnterEditMode}
                    className={`
                      w-full py-3 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                      ${isDarkMode
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }
                    `}
                  >
                    <Unlock size={18} />
                    Enter Edit Mode
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}