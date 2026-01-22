import React, { createContext, useContext, useState, ReactNode } from 'react';

type PageType = 
  | 'Dashboard'
  | 'Calendar'
  | 'Issues'
  | 'Legislators'
  | 'Bills'
  | 'Clients'
  | 'Projects'
  | 'War Room'
  | 'Chat'
  | 'Settings'
  | 'User Management'
  | 'Records'
  | 'Team'
  | 'Manager Console'
  | 'Elections'
  | 'Analytics'
  | 'LegislatorElections'
  | 'Suite';

interface NavigationContextType {
  currentPage: string;
  currentIssueSlug: string | null;
  currentBillId: string | null;
  currentLegislatorId: string | null;
  currentClientId: string | null;
  currentCommitteeId: string | null;
  currentChatMessageId: string | null;
  pageParams: Record<string, any>; // Generic params for page-specific state (e.g. filters)
  
  navigateToPage: (page: PageType, params?: Record<string, any>) => void;
  navigateToIssue: (slug: string) => void;
  navigateToBill: (billId: string) => void;
  navigateToLegislator: (legislatorId: string) => void;
  navigateToLegislatorElections: (legislatorId: string) => void;
  navigateToClient: (clientId: string) => void;
  navigateToChat: (messageId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    return localStorage.getItem('currentPage') || 'Dashboard';
  });
  const [currentIssueSlug, setCurrentIssueSlug] = useState<string | null>(null);
  const [currentBillId, setCurrentBillId] = useState<string | null>(null);
  const [currentLegislatorId, setCurrentLegislatorId] = useState<string | null>(null);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [currentCommitteeId, setCurrentCommitteeId] = useState<string | null>(null);
  const [currentChatMessageId, setCurrentChatMessageId] = useState<string | null>(null);
  const [pageParams, setPageParams] = useState<Record<string, any>>({});

  // Persist currentPage to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const navigateToPage = (page: PageType, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setPageParams(params); // Set params
    
    // Reset specific IDs when switching top-level pages
    if (page === 'Issues') setCurrentIssueSlug(null);
    if (page === 'Bills') setCurrentBillId(null);
    if (page === 'Legislators') setCurrentLegislatorId(null);
    if (page === 'Clients') setCurrentClientId(null);
    if (page === 'Elections') setCurrentLegislatorId(null); // Assuming reset
  };

  const navigateToIssue = (slug: string) => {
    setCurrentPage('Issues');
    setCurrentIssueSlug(slug);
    setPageParams({});
  };

  const navigateToBill = (billId: string) => {
    setCurrentPage('Bills');
    setCurrentBillId(billId);
    setPageParams({});
  };

  const navigateToLegislator = (legislatorId: string) => {
    setCurrentPage('Legislators');
    setCurrentLegislatorId(legislatorId);
    setPageParams({});
  };

  const navigateToLegislatorElections = (legislatorId: string) => {
    setCurrentPage('LegislatorElections');
    setCurrentLegislatorId(legislatorId);
    setPageParams({});
  };

  const navigateToClient = (clientId: string) => {
    setCurrentPage('Clients');
    setCurrentClientId(clientId);
    setPageParams({});
  };

  const navigateToChat = (messageId: string) => {
    setCurrentPage('Chat');
    setCurrentChatMessageId(messageId);
    setPageParams({});
  };

  return (
    <NavigationContext.Provider value={{
      currentPage,
      currentIssueSlug,
      currentBillId,
      currentLegislatorId,
      currentClientId,
      currentCommitteeId,
      currentChatMessageId,
      pageParams,
      navigateToPage,
      navigateToIssue,
      navigateToBill,
      navigateToLegislator,
      navigateToLegislatorElections,
      navigateToClient,
      navigateToChat,
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
