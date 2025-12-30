import React, { createContext, useContext, useState, useEffect } from 'react';

export type ModuleSize = 'small' | 'medium' | 'large';
export type ModuleType = 
  | 'war-room'
  | 'tasks'
  | 'deliverables'
  | 'bills-watchlist'
  | 'legislator-touchpoints'
  | 'legislator-watchlist'
  | 'client-pulse'
  | 'door-tracker'
  | 'budget-snapshot'
  | 'records-compliance'
  | 'notifications'
  | 'media-narrative'
  | 'stakeholder-map'
  | 'issues-watchlist'
  | 'committee-calendar';

export type DepartmentSilo = 'all' | 'lobbying' | 'campaign-services' | 'public-affairs';

export interface ModuleFilters {
  department?: DepartmentSilo;
  clientId?: string;
  topicId?: string;
  timeRange?: '7d' | '30d' | '90d';
  showOnlyMine?: boolean;
}

export interface DashboardModule {
  id: string;
  type: ModuleType;
  title: string;
  size: ModuleSize;
  position: { x: number; y: number; w: number; h: number };
  filters: ModuleFilters;
  pinned: boolean;
}

export interface DashboardLayout {
  userId: string;
  preset?: 'executive' | 'lobbying' | 'campaign-services' | 'public-affairs';
  modules: DashboardModule[];
}

interface LayoutPosition {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DashboardContextType {
  layout: DashboardLayout;
  isEditMode: boolean;
  setEditMode: (enabled: boolean) => void;
  addModule: (module: Omit<DashboardModule, 'id' | 'position'>) => void;
  updateModule: (id: string, updates: Partial<DashboardModule>) => void;
  removeModule: (id: string) => void;
  duplicateModule: (id: string) => void;
  updateModulePositions: (positions: LayoutPosition[]) => void;
  resetToPreset: (preset: DashboardLayout['preset']) => void;
  saveLayout: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

// Default preset layouts
const PRESET_LAYOUTS: Record<string, DashboardModule[]> = {
  executive: [
    {
      id: 'war-room-all',
      type: 'war-room',
      title: 'War Room (All)',
      size: 'large',
      position: { x: 0, y: 0, w: 12, h: 2 },
      filters: { department: 'all' },
      pinned: true,
    },
    {
      id: 'alerts',
      type: 'notifications',
      title: 'Critical Alerts',
      size: 'medium',
      position: { x: 0, y: 2, w: 6, h: 2 },
      filters: {},
      pinned: false,
    },
    {
      id: 'tasks',
      type: 'tasks',
      title: 'Tasks Due Soon',
      size: 'medium',
      position: { x: 6, y: 2, w: 6, h: 2 },
      filters: { showOnlyMine: true },
      pinned: false,
    },
    {
      id: 'bills',
      type: 'bills-watchlist',
      title: 'Bills Watchlist',
      size: 'medium',
      position: { x: 0, y: 4, w: 6, h: 2 },
      filters: {},
      pinned: false,
    },
    {
      id: 'door-tracker',
      type: 'door-tracker',
      title: 'Door Tracker Snapshot',
      size: 'medium',
      position: { x: 6, y: 4, w: 6, h: 2 },
      filters: { department: 'campaign-services' },
      pinned: false,
    },
    {
      id: 'client-pulse',
      type: 'client-pulse',
      title: 'Client Pulse (All)',
      size: 'large',
      position: { x: 0, y: 6, w: 12, h: 2 },
      filters: { department: 'all' },
      pinned: false,
    },
  ],
  lobbying: [
    {
      id: 'war-room-lobby',
      type: 'war-room',
      title: 'War Room (Lobbying)',
      size: 'large',
      position: { x: 0, y: 0, w: 12, h: 2 },
      filters: { department: 'lobbying' },
      pinned: true,
    },
    {
      id: 'bills-lobby',
      type: 'bills-watchlist',
      title: 'Bills Watchlist',
      size: 'large',
      position: { x: 0, y: 2, w: 12, h: 2 },
      filters: { department: 'lobbying' },
      pinned: false,
    },
    {
      id: 'legislator-touchpoints',
      type: 'legislator-touchpoints',
      title: 'Legislator Touchpoints',
      size: 'medium',
      position: { x: 0, y: 4, w: 6, h: 2 },
      filters: {},
      pinned: false,
    },
    {
      id: 'committee-calendar',
      type: 'committee-calendar',
      title: 'Committee Calendar Peek',
      size: 'medium',
      position: { x: 6, y: 4, w: 6, h: 2 },
      filters: { timeRange: '7d' },
      pinned: false,
    },
    {
      id: 'client-pulse-lobby',
      type: 'client-pulse',
      title: 'Client Pulse (Lobbying)',
      size: 'medium',
      position: { x: 0, y: 6, w: 6, h: 2 },
      filters: { department: 'lobbying' },
      pinned: false,
    },
    {
      id: 'records-compliance',
      type: 'records-compliance',
      title: 'Records & Compliance',
      size: 'medium',
      position: { x: 6, y: 6, w: 6, h: 2 },
      filters: {},
      pinned: false,
    },
  ],
  'campaign-services': [
    {
      id: 'war-room-campaign',
      type: 'war-room',
      title: 'War Room (Campaign Services)',
      size: 'large',
      position: { x: 0, y: 0, w: 12, h: 2 },
      filters: { department: 'campaign-services' },
      pinned: true,
    },
    {
      id: 'door-tracker-main',
      type: 'door-tracker',
      title: 'Door Tracker Snapshot',
      size: 'large',
      position: { x: 0, y: 2, w: 12, h: 2 },
      filters: {},
      pinned: false,
    },
    {
      id: 'deliverables-campaign',
      type: 'deliverables',
      title: 'Project Deliverables',
      size: 'medium',
      position: { x: 0, y: 4, w: 6, h: 2 },
      filters: {},
      pinned: false,
    },
    {
      id: 'budget-campaign',
      type: 'budget-snapshot',
      title: 'Budget Snapshot',
      size: 'medium',
      position: { x: 6, y: 4, w: 6, h: 2 },
      filters: {},
      pinned: false,
    },
    {
      id: 'tasks-ops',
      type: 'tasks',
      title: 'Tasks (Ops)',
      size: 'medium',
      position: { x: 0, y: 6, w: 6, h: 2 },
      filters: { showOnlyMine: true },
      pinned: false,
    },
  ],
  'public-affairs': [
    {
      id: 'war-room-pa',
      type: 'war-room',
      title: 'War Room (Public Affairs)',
      size: 'large',
      position: { x: 0, y: 0, w: 12, h: 2 },
      filters: { department: 'public-affairs' },
      pinned: true,
    },
    {
      id: 'media-narrative',
      type: 'media-narrative',
      title: 'Media & Narrative Monitor',
      size: 'large',
      position: { x: 0, y: 2, w: 12, h: 2 },
      filters: {},
      pinned: false,
    },
    {
      id: 'stakeholder-map',
      type: 'stakeholder-map',
      title: 'Stakeholder Map Peek',
      size: 'medium',
      position: { x: 0, y: 4, w: 6, h: 2 },
      filters: {},
      pinned: false,
    },
    {
      id: 'deliverables-pa',
      type: 'deliverables',
      title: 'Client Deliverables Due',
      size: 'medium',
      position: { x: 6, y: 4, w: 6, h: 2 },
      filters: {},
      pinned: false,
    },
    {
      id: 'issues-pa',
      type: 'issues-watchlist',
      title: 'Issues Watchlist',
      size: 'medium',
      position: { x: 0, y: 6, w: 6, h: 2 },
      filters: {},
      pinned: false,
    },
    {
      id: 'records-briefings',
      type: 'records-compliance',
      title: 'Records & Briefings',
      size: 'medium',
      position: { x: 6, y: 6, w: 6, h: 2 },
      filters: {},
      pinned: false,
    },
  ],
};

const STORAGE_KEY = 'pythia-dashboard-layout';

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layout, setLayout] = useState<DashboardLayout>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved layout:', e);
      }
    }
    // Default to executive preset
    return {
      userId: 'user-001',
      preset: 'executive',
      modules: PRESET_LAYOUTS.executive,
    };
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Save to localStorage whenever layout changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [layout]);

  const setEditMode = (enabled: boolean) => {
    setIsEditMode(enabled);
  };

  const addModule = (module: Omit<DashboardModule, 'id' | 'position'>) => {
    const newId = `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Find the first available position
    const occupiedPositions = layout.modules.map(m => m.position);
    let x = 0;
    let y = 0;
    
    // Simple algorithm: find first available spot in grid
    const maxY = Math.max(...occupiedPositions.map(p => p.y + p.h), 0);
    
    const newModule: DashboardModule = {
      ...module,
      id: newId,
      position: { x, y: maxY, w: getSizeWidth(module.size), h: 2 },
    };

    setLayout(prev => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
  };

  const updateModule = (id: string, updates: Partial<DashboardModule>) => {
    setLayout(prev => ({
      ...prev,
      modules: prev.modules.map(m => (m.id === id ? { ...m, ...updates } : m)),
    }));
  };

  const removeModule = (id: string) => {
    setLayout(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== id),
    }));
  };

  const duplicateModule = (id: string) => {
    const module = layout.modules.find(m => m.id === id);
    if (!module) return;

    const newModule: DashboardModule = {
      ...module,
      id: `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${module.title} (Copy)`,
      position: {
        ...module.position,
        y: module.position.y + module.position.h,
      },
    };

    setLayout(prev => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
  };

  const updateModulePositions = (positions: LayoutPosition[]) => {
    setLayout(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        const pos = positions.find(p => p.i === module.id);
        if (pos) {
          return {
            ...module,
            position: { x: pos.x, y: pos.y, w: pos.w, h: pos.h },
          };
        }
        return module;
      }),
    }));
  };

  const resetToPreset = (preset: DashboardLayout['preset']) => {
    if (!preset || !PRESET_LAYOUTS[preset]) return;

    setLayout({
      userId: layout.userId,
      preset,
      modules: PRESET_LAYOUTS[preset],
    });
  };

  const saveLayout = () => {
    // Already auto-saving via useEffect, but this can trigger a toast or confirmation
    setIsEditMode(false);
  };

  return (
    <DashboardContext.Provider
      value={{
        layout,
        isEditMode,
        setEditMode,
        addModule,
        updateModule,
        removeModule,
        duplicateModule,
        updateModulePositions,
        resetToPreset,
        saveLayout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Helper function to convert size to grid width
function getSizeWidth(size: ModuleSize): number {
  switch (size) {
    case 'small':
      return 4;
    case 'medium':
      return 6;
    case 'large':
      return 12;
    default:
      return 6;
  }
}