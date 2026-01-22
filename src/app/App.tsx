import React, { Suspense } from 'react';
import { AuthProvider, useAuth } from '@/app/contexts/AuthContext';
import { SupabaseAuthProvider, useSupabaseAuth } from './contexts/SupabaseAuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { AskPythiaProvider } from './contexts/AskPythiaContext';
import { SmartStructuringProvider } from './contexts/SmartStructuringContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { OrgProvider, useOrg } from './contexts/OrgContext';
import { AppModeProvider, useAppMode } from './contexts/AppModeContext';
import { DataInitializer } from './components/DataInitializer';
import { LoadingScreen } from './components/LoadingScreen';
import { AskPythiaModal } from './components/ask-pythia/AskPythiaModal';
import { StructuringDrawer } from './components/smart-structuring/StructuringDrawer';
import { SignInPage } from './components/auth/SignInPage';
import { InviteAcceptPage } from './components/auth/InviteAcceptPage';
import { OnboardingPage } from './components/auth/OnboardingPage';
import { Sidebar } from './components/Sidebar';
import { WatchlistSnapshot } from './components/dashboard/WatchlistSnapshot';
import { IssueHeatTiles } from './components/dashboard/IssueHeatTiles';
import { LiveLegislativeFeed } from './components/dashboard/LiveLegislativeFeed';
import { AlertsRedFlags } from './components/dashboard/AlertsRedFlags';
import { RecommendedActions } from './components/dashboard/RecommendedActions';
import { ActionQueue } from './components/dashboard/ActionQueue';
import { CalendarEventIntel } from './components/dashboard/CalendarEventIntel';
import { RecordsComplianceWidget } from './components/dashboard/RecordsComplianceWidget';
import { RecordsLedger } from './components/dashboard/RecordsLedger';
import { LegislatorDatabase } from './components/legislator/LegislatorDatabase';
import { SmartStructuringDemo } from './components/smart-structuring/SmartStructuringDemo';
import { ModularDashboard } from './components/dashboard-modules/ModularDashboard';

// Lazy Loaded Components for Performance
const CalendarPage = React.lazy(() => import('./components/calendar/CalendarPage').then(module => ({ default: module.CalendarPage })));
const IssuesHub = React.lazy(() => import('./components/issues/IssuesHub').then(module => ({ default: module.IssuesHub })));
const IssueIntelligencePage = React.lazy(() => import('./components/issues/IssueIntelligencePage').then(module => ({ default: module.IssueIntelligencePage })));
const LegislatorsPage = React.lazy(() => import('./components/legislators/LegislatorsPage').then(module => ({ default: module.LegislatorsPage })));
const BillsPage = React.lazy(() => import('./components/bills/BillsPage').then(module => ({ default: module.BillsPage })));
const BillDetailPage = React.lazy(() => import('./components/bills/BillDetailPage').then(module => ({ default: module.BillDetailPage })));
const ClientsIndexPage = React.lazy(() => import('./components/clients/ClientsIndexPage').then(module => ({ default: module.ClientsIndexPage })));
const ClientDetailPage = React.lazy(() => import('./components/clients/ClientDetailPage').then(module => ({ default: module.ClientDetailPage })));
const CommitteesIndexPage = React.lazy(() => import('./components/committees/CommitteesIndexPage').then(module => ({ default: module.CommitteesIndexPage })));
const WorkHubPage = React.lazy(() => import('./components/work/WorkHubPage').then(module => ({ default: module.WorkHubPage })));
const WarRoom = React.lazy(() => import('./components/WarRoom').then(module => ({ default: module.WarRoom })));
const UsersManagementPage = React.lazy(() => import('./components/admin/UsersManagementPage').then(module => ({ default: module.UsersManagementPage })));
const RecordsPage = React.lazy(() => import('./pages/RecordsPage').then(module => ({ default: module.RecordsPage })));
const ManagerConsolePage = React.lazy(() => import('./pages/ManagerConsolePage').then(module => ({ default: module.ManagerConsolePage })));
const ElectionsHubPage = React.lazy(() => import('./pages/ElectionsHubPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })));
const LegislatorElectionsPage = React.lazy(() => import('./pages/LegislatorElectionsPage').then(module => ({ default: module.LegislatorElectionsPage })));
const SuitePage = React.lazy(() => import('./pages/SuitePage'));
const ChatPage = React.lazy(() => import('./components/chat/ChatPage').then(module => ({ default: module.ChatPage })));
const SettingsPage = React.lazy(() => import('./components/settings/SettingsPage').then(module => ({ default: module.SettingsPage })));
const ConstellationPage = React.lazy(() => import('./pages/ConstellationPage').then(module => ({ default: module.default })));

import { mockLegislators } from './components/legislators/legislatorData';
import { AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import pythiaLogoWatermark from 'figma:asset/58e907a41a4f196b9f20552a2d411f1e34960e14.png';
import { DbSmokeTest } from './components/debug/DbSmokeTest';
import { CelestialCompassBackground } from './components/ui/CelestialCompassBackground';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from './config/msalConfig';

const pca = new PublicClientApplication(msalConfig);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Demo Loading Wrapper - Shows loading screens after demo sign-in
function DemoLoadingWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();
  const [loadingStep, setLoadingStep] = React.useState<1 | 2 | 3 | null>(null);
  const [showContent, setShowContent] = React.useState(false);

  // Track previous auth state to detect when user just logged in
  const prevAuthRef = React.useRef(isAuthenticated);

  React.useEffect(() => {
    // Only run loading sequence in demo mode
    if (appMode !== 'demo') {
      setShowContent(true);
      return;
    }

    // Detect when user just authenticated
    if (!prevAuthRef.current && isAuthenticated) {
      console.log('🎬 [DemoLoading] Starting demo loading sequence');
      setLoadingStep(1);
      setShowContent(false);

      // Step 1: Establishing workspace
      setTimeout(() => {
        setLoadingStep(2);
      }, 1500);

      // Step 2: Synchronizing intel
      setTimeout(() => {
        setLoadingStep(3);
      }, 3000);

      // Step 3: Ready - then show content
      setTimeout(() => {
        setLoadingStep(null);
        setShowContent(true);
        console.log('✅ [DemoLoading] Loading sequence complete');
      }, 4500);
    } else if (isAuthenticated) {
      // Already authenticated (e.g., from localStorage), skip loading
      setShowContent(true);
    } else {
      // Not authenticated
      setShowContent(true);
    }

    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, appMode]);

  // Show loading screen if we're in a loading step
  if (loadingStep) {
    const titles = {
      1: 'Establishing your workspace…',
      2: 'Synchronizing your intel…',
      3: 'Finalizing access…',
    };
    const subtexts = {
      1: 'Confirming identity and permissions.',
      2: 'Loading tasks, records, and dashboards.',
      3: 'Preparing your command center.',
    };

    return (
      <LoadingScreen
        step={loadingStep}
        title={titles[loadingStep]}
        subtext={subtexts[loadingStep]}
        orgName={currentUser ? 'Echo Canyon Consulting (Demo)' : undefined}
        userRole={currentUser ? 'Admin' : undefined}
        isDarkMode={isDarkMode}
      />
    );
  }

  // Show content once loading is complete
  return showContent ? <>{children}</> : null;
}

// Main App with Auth and Org
function AppWithOrg() {
  const { currentUser, isAuthenticated: legacyIsAuthenticated } = useAuth();
  const { 
    session: supabaseSession, 
    user: supabaseUser, 
    orgMemberships,
    membershipsLoading,
    membershipsLoaded
  } = useSupabaseAuth();
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();
  
  // Demo Mode: Use legacy auth (requires sign-in)
  // Prod Mode: Use MSAL (AuthContext)
  const isAuthed = legacyIsAuthenticated;

  console.log('🚪 [AppWithOrg] Auth Gate Check:', {
    appMode,
    isAuthed,
    legacyIsAuthenticated,
    membershipsLoading,
    membershipsLoaded,
    membershipsCount: orgMemberships.length,
    sessionUser: supabaseUser?.email
  });

  // If not authed, let MainApp handle showing SignInPage
  if (!isAuthed) {
    return <MainApp />;
  }

  // DEMO MODE: Show loading screens, then go to MainApp
  if (appMode === 'demo') {
    return (
      <DemoLoadingWrapper>
        <MainApp />
      </DemoLoadingWrapper>
    );
  }

  // PROD MODE: Continue with org membership checks
  // LOADING ORGANIZATIONS
  // Skip org check for now as we transition to MSAL
  // if (membershipsLoading) { ... }

  // AUTHENTICATED -> Proceed to App
  // Use currentUser from AuthContext (MSAL)
  const userId = currentUser?.id;
  const userEmail = currentUser?.email;

  if (userId && userEmail) {
    console.log('✅ [AppWithOrg] Authenticated & Has User Data - wrapping in OrgProvider');
    return (
      <OrgProvider userId={userId} userEmail={userEmail}>
        <OrgBootstrapWrapper />
      </OrgProvider>
    );
  } else {
    console.warn('⚠️ [AppWithOrg] Auth indicates logged in but missing user data');
    return <MainApp />;
  }
}

// Wrapper to handle org bootstrap states (loading, onboarding, or main app)
function OrgBootstrapWrapper() {
  const { isBootstrapping, bootstrapError, retryBootstrap } = useOrg(); // Removed needsOnboarding check as it's handled upstream
  const { isDarkMode } = useTheme();

  // Show loading during bootstrap
  if (isBootstrapping) {
    return (
      <LoadingScreen
        step={2}
        title="Synchronizing your intel…"
        subtext="Loading tasks, records, and dashboards."
        isDarkMode={isDarkMode}
      />
    );
  }

  // Show error with retry option
  if (bootstrapError) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border p-6 text-center`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} mb-4`}>
            <svg className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className={`text-xl mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Error Loading Organization
          </h2>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {bootstrapError}
          </p>
          <button
            onClick={retryBootstrap}
            className={`px-6 py-2 ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // All good - show main app
  return <MainApp />;
}

// Main App with Auth
function MainApp() {
  const authContext = useAuth();
  const { isAuthenticated, currentUser, getUserRole, isAuthInProgress } = authContext;
  const { isDarkMode } = useTheme();
  const { 
    membershipError, 
    retryMembershipFetch, 
    signOut: supabaseSignOut, 
    session: supabaseSession,
    authReady // Use new authReady flag
  } = useSupabaseAuth();
  const { appMode } = useAppMode();
  
  // Navigation Context
  const {
    currentPage,
    currentIssueSlug,
    currentBillId,
    currentLegislatorId,
    currentClientId,
    currentChatMessageId,
    pageParams,
    navigateToPage: setCurrentPage,
    navigateToIssue,
    navigateToBill,
    navigateToLegislator,
    navigateToLegislatorElections,
    navigateToClient,
    navigateToChat,
  } = useNavigation();

  const [authView, setAuthView] = React.useState<'signin' | 'invite' | 'app'>('signin');
  // DEMO MODE: Skip data initialization check
  const [dataInitialized, setDataInitialized] = React.useState(true);
  const [inviteToken, setInviteToken] = React.useState('');
  const [showMembershipError, setShowMembershipError] = React.useState(true);
  
  // Track watched legislators - initialize from legislator data
  const [watchedLegislatorIds, setWatchedLegislatorIds] = React.useState<Set<string>>(() => {
    const initialWatched = new Set<string>();
    mockLegislators.forEach(leg => {
      if (leg.watched) {
        initialWatched.add(leg.id);
      }
    });
    return initialWatched;
  });

  // Toggle watch status for a legislator
  const toggleWatchLegislator = (legislatorId: string) => {
    setWatchedLegislatorIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(legislatorId)) {
        newSet.delete(legislatorId);
      } else {
        newSet.add(legislatorId);
      }
      return newSet;
    });
  };

  // Check URL for invite token (simulated routing)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invite');
    const page = params.get('page');
    
    if (token) {
      setInviteToken(token);
      setAuthView('invite');
    } else if (page === 'suite') {
      setCurrentPage('Suite');
    }
  }, []);

  // Track if we've already redirected on this session
  const hasRedirectedRef = React.useRef(false);

  // Determine initial page based on user role - ONLY RUN ONCE when auth is ready
  React.useEffect(() => {
    if (isAuthenticated && currentUser && !hasRedirectedRef.current) {
      // Always set to Dashboard on successful auth in Live mode
      if (appMode === 'prod' || !currentPage) {
        setCurrentPage('Dashboard');
      }
      hasRedirectedRef.current = true;
    }
  }, [isAuthenticated, currentUser, currentPage, appMode, setCurrentPage]);

  // Sidebar Collapse State
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarCollapsed', String(newState));
      return newState;
    });
  };

  // Keyboard shortcut for sidebar toggle
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset auth view when user logs out
  React.useEffect(() => {
    if (!isAuthenticated) {
      setAuthView('signin');
    }
  }, [isAuthenticated]);

  // Handle sign in success
  const handleSignInSuccess = () => {
    setAuthView('app');
  };

  // Handle invite accept success
  const handleInviteAcceptSuccess = () => {
    setAuthView('signin');
    setInviteToken('');
  };

  // ROUTE GUARD: Use MSAL (AuthContext)
  const isAuthedForRouting = isAuthenticated;

  // GATE LOGGING
  console.log('🚪 [MainApp] Route Guard Check:', {
    appMode,
    authReady,
    sessionExists: !!supabaseSession,
    legacyIsAuthenticated: isAuthenticated,
    isAuthedForRouting,
    renderingComponent: isAuthedForRouting ? 'Authenticated App' : 'SignInPage',
  });
  
  // CHECKING AUTHENTICATION
  // Only show "Checking authentication..." if MSAL is actively working (startup/handleRedirect) AND we don't have a user yet.
  // We no longer wait for Supabase authReady as Supabase auth is deprecated.
  
  const isMsalInteraction = isAuthInProgress && !isAuthenticated;
  
  if (isMsalInteraction) {
    console.log('⏳ [MainApp] Auth check in progress...', { 
      isAuthInProgress, 
      isAuthenticated,
      msalStatus: 'Blocking'
    });
    
    // Using Step 1 for auth check as well
    return (
      <LoadingScreen
        step={1}
        title="Establishing your workspace…"
        subtext="Confirming identity and permissions."
        isDarkMode={isDarkMode}
      />
    );
  }
  
  if (!isAuthedForRouting) {
    console.log('🔓 [MainApp] Not authenticated, rendering SignInPage. Reason:', {
      prodMode: appMode === 'prod',
      hasSession: !!supabaseSession,
      legacyAuth: isAuthenticated,
    });
    
    // Check if we should show the Suite page
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'suite' || currentPage === 'Suite') {
      return <SuitePage />;
    }
    
    if (authView === 'invite' && inviteToken) {
      return <InviteAcceptPage token={inviteToken} onAcceptSuccess={handleInviteAcceptSuccess} />;
    }
    return <SignInPage onSignInSuccess={handleSignInSuccess} onInviteClick={(token) => { setInviteToken(token); setAuthView('invite'); }} />;
  }

  console.log('✅ [MainApp] Authenticated, rendering app shell');

  // Show data initializer if data hasn't been initialized yet
  if (!dataInitialized && appMode !== 'demo') {
    return <DataInitializer isDarkMode={isDarkMode} onComplete={() => setDataInitialized(true)} />;
  }

  const renderPage = () => {
    if (currentPage === 'Calendar') {
      return <CalendarPage />;
    }

    if (currentPage === 'Issues') {
      if (currentIssueSlug) {
        return (
          <IssueIntelligencePage
            issueSlug={currentIssueSlug}
            onBack={() => navigateToPage('Issues')}
          />
        );
      }
      return <IssuesHub />;
    }

    if (currentPage === 'Legislators') {
      return <LegislatorsPage 
        initialLegislatorId={currentLegislatorId} 
        onNavigateToBill={navigateToBill}
        onNavigateToElections={navigateToLegislatorElections}
        watchedLegislatorIds={watchedLegislatorIds}
        onToggleWatch={toggleWatchLegislator}
        initialFilters={pageParams?.filters}
      />;
    }

    if (currentPage === 'Bills') {
      if (currentBillId) {
        return (
          <BillDetailPage
            billId={currentBillId}
            onBack={() => navigateToPage('Bills')} 
            onNavigateToLegislator={navigateToLegislator}
          />
        );
      }
      return <BillsPage onNavigateToBill={navigateToBill} />;
    }

    if (currentPage === 'Clients') {
      if (currentClientId) {
        return (
          <ClientDetailPage
            clientId={currentClientId}
            onNavigateBack={() => navigateToPage('Clients')}
            onNavigateToBill={navigateToBill}
          />
        );
      }
      return <ClientsIndexPage onNavigateToClient={navigateToClient} />
    }

    if (currentPage === 'Projects') {
      return (
        <WorkHubPage
          onNavigateToClient={navigateToClient}
          onNavigateToBill={navigateToBill}
          onNavigateToChat={navigateToChat}
        />
      );
    }

    if (currentPage === 'War Room') {
      return <WarRoom />;
    }

    if (currentPage === 'Chat') {
      return <ChatPage 
        initialMessageId={currentChatMessageId} 
        draftRecipient={pageParams?.draftRecipient}
      />;
    }

    if (currentPage === 'Settings') {
      return <SettingsPage />;
    }

    if (currentPage === 'User Management') {
      return <UsersManagementPage />;
    }

    if (currentPage === 'Records') {
      return <RecordsPage />;
    }

    if (currentPage === 'Team') {
      return <ManagerConsolePage />;
    }

    if (currentPage === 'Manager Console') {
      return <ManagerConsolePage />;
    }

    if (currentPage === 'Elections') {
      return <ElectionsHubPage />;
    }

    if (currentPage === 'Analytics') {
      return <AnalyticsPage />;
    }

    if (currentPage === 'LegislatorElections') {
      return <LegislatorElectionsPage onNavigateToProfile={() => setCurrentPage('Legislators')} />;
    }

    if (currentPage === 'Constellation') {
      return <ConstellationPage />;
    }

    // Default Dashboard view
    return <ModularDashboard 
      watchedLegislatorIds={watchedLegislatorIds}
      onNavigateToLegislator={navigateToLegislator}
      createAlertTopic={pageParams?.createAlert}
    />;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Background - Celestial Compass (Constellations + Rings) */}
      <CelestialCompassBackground />
      
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'ml-20' : 'ml-72'} relative z-10 min-w-0`}>
        {/* Membership Error Banner */}
        {membershipError && showMembershipError && isAuthenticated && (
          <div className={`${isDarkMode ? 'bg-red-900/30 border-b border-red-500/30' : 'bg-red-50 border-b border-red-200'} px-6 py-4`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className={`font-medium ${isDarkMode ? 'text-red-200' : 'text-red-900'}`}>
                    Failed to Load Organization Membership
                  </h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-300/90' : 'text-red-700'}`}>
                    {membershipError}
                  </p>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-red-300/70' : 'text-red-600/70'}`}>
                    The application may not function correctly until this is resolved.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    await retryMembershipFetch();
                  }}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                    ${isDarkMode
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30'
                      : 'bg-white hover:bg-red-50 text-red-700 border border-red-200'
                    }
                  `}
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
                <button
                  onClick={async () => {
                    await supabaseSignOut();
                  }}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                    ${isDarkMode
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                    }
                  `}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
                <button
                  onClick={() => setShowMembershipError(false)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isDarkMode
                      ? 'hover:bg-red-500/20 text-red-300'
                      : 'hover:bg-red-100 text-red-600'
                    }
                  `}
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
        
        <main className="flex-1 overflow-hidden">
          <Suspense fallback={<LoadingScreen step={null} title="Loading..." subtext="Fetching resources" isDarkMode={isDarkMode} />}>
            {renderPage()}
          </Suspense>
        </main>
      </div>
      
      {/* Ask Pythia Modal (Global) */}
      <AskPythiaModal />
      
      {/* Dev-Only DB Smoke Test (Hidden by default, enabled via URL param) */}
      <DbSmokeTest />
    </div>
  );
}

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster position="top-center" richColors />
      <QueryClientProvider client={queryClient}>
        <MsalProvider instance={pca}>
          <AuthProvider>
            <ToastProvider>
            <NavigationProvider>
              <VoiceProvider>
                <AskPythiaProvider>
                  <SmartStructuringProvider>
                    <DashboardProvider>
                      <ThemeProvider>
                        <AppModeProvider>
                          <SupabaseAuthProvider>
                            {/* AuthBridge removed */}
                            <AppWithOrg />
                            <AskPythiaModal />
                            <StructuringDrawer />
                          </SupabaseAuthProvider>
                        </AppModeProvider>
                      </ThemeProvider>
                    </DashboardProvider>
                  </SmartStructuringProvider>
                </AskPythiaProvider>
              </VoiceProvider>
            </NavigationProvider>
          </ToastProvider>
        </AuthProvider>
        </MsalProvider>
      </QueryClientProvider>
    </DndProvider>
  );
}