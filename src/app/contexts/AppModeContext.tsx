import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppMode = 'demo' | 'prod';

interface AppModeContextType {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  orgLabel: string;
  setOrgLabel: (label: string) => void;
}

const defaultContextValue: AppModeContextType = {
  appMode: 'demo',
  setAppMode: () => {},
  orgLabel: 'Echo Canyon Consulting (Demo)',
  setOrgLabel: () => {}
};

const AppModeContext = createContext<AppModeContextType>(defaultContextValue);

const LOCAL_STORAGE_KEY = 'pythia_app_mode_v2'; // v2 forces reset to demo default
const ORG_LABEL_KEY = 'pythia_org_label_v2';

export function AppModeProvider({ children }: { children: React.ReactNode }) {
  // Default to 'demo' for safety
  const [appMode, setAppModeState] = useState<AppMode>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return (stored === 'prod' || stored === 'demo') ? stored : 'demo';
    } catch {
      return 'demo';
    }
  });

  const [orgLabel, setOrgLabelState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(ORG_LABEL_KEY);
      return stored || 'Echo Canyon Consulting (Demo)';
    } catch {
      return 'Echo Canyon Consulting (Demo)';
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, appMode);
    } catch (e) {
      console.warn('Failed to save app mode to localStorage:', e);
    }
  }, [appMode]);

  useEffect(() => {
    try {
      localStorage.setItem(ORG_LABEL_KEY, orgLabel);
    } catch (e) {
      console.warn('Failed to save org label to localStorage:', e);
    }
  }, [orgLabel]);

  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
    // Update org label when switching modes
    if (mode === 'demo') {
      setOrgLabelState('Echo Canyon Consulting (Demo)');
    } else {
      setOrgLabelState('Echo Canyon Consulting');
    }
  };

  const setOrgLabel = (label: string) => {
    setOrgLabelState(label);
  };

  return (
    <AppModeContext.Provider value={{ appMode, setAppMode, orgLabel, setOrgLabel }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const context = useContext(AppModeContext);
  // Context now has a default value, so this will always return something
  return context;
}