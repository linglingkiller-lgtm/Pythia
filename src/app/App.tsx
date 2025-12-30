import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import { TopHeader } from './components/TopHeader';
import { Footer } from './components/Footer';
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
import { CalendarPage } from './components/calendar/CalendarPage';
import { IssuesHub } from './components/issues/IssuesHub';
import { IssueIntelligencePage } from './components/issues/IssueIntelligencePage';
import { LegislatorsPage } from './components/legislators/LegislatorsPage';
import { BillsPage } from './components/bills/BillsPage';
import { BillDetailPage } from './components/bills/BillDetailPage';
import { ClientsIndexPage } from './components/clients/ClientsIndexPage';
import { ClientDetailPage } from './components/clients/ClientDetailPage';
import { CommitteesIndexPage } from './components/committees/CommitteesIndexPage';
import { WorkHubPage } from './components/work/WorkHubPage';
import { WarRoom } from './components/WarRoom';
import { UsersManagementPage } from './components/admin/UsersManagementPage';
import { RecordsPage } from './pages/RecordsPage';
import { ManagerConsolePage } from './pages/ManagerConsolePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import SuitePage from './pages/SuitePage';
import { ChatPage } from './components/chat/ChatPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { mockLegislators } from './components/legislators/legislatorData';
import { AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import pythiaLogoWatermark from 'figma:asset/58e907a41a4f196b9f20552a2d411f1e34960e14.png';
import { AuthBridge } from './components/AuthBridge';
import { DbSmokeTest } from './components/debug/DbSmokeTest';

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
  
  // PROD MODE: Use Supabase session as source of truth
  const isAuthed = appMode === 'prod' 
    ? !!supabaseSession 
    : legacyIsAuthenticated; // Demo mode uses legacy auth

  console.log('🚪 [AppWithOrg] Auth Gate Check:', {
    appMode,
    isAuthed,
    membershipsLoading,
    membershipsLoaded,
    membershipsCount: orgMemberships.length,
    sessionUser: supabaseUser?.email
  });

  // If not authed (should be handled by MainApp but safety check)
  if (!isAuthed) {
    return <MainApp />;
  }

  // LOADING ORGANIZATIONS
  if (membershipsLoading) {
     return (
      <LoadingScreen
        step={1}
        title="Establishing your workspace…"
        subtext="Confirming membership and org permissions."
        isDarkMode={isDarkMode}
      />
    );
  }

  // NO ORGANIZATIONS -> CREATE ORG (Onboarding)
  // Only show this if strictly loaded AND empty
  if (membershipsLoaded && orgMemberships.length === 0) {
    console.log('⚠️ [AppWithOrg] No memberships found - routing to Onboarding');
    const userId = appMode === 'prod' ? supabaseUser?.id : currentUser?.id;
    const userEmail = appMode === 'prod' ? supabaseUser?.email : currentUser?.email;
    
    if (userId && userEmail) {
      return (
        <OnboardingPage
          userId={userId}
          userEmail={userEmail}
          isDarkMode={isDarkMode}
          onComplete={() => window.location.reload()} // Simple reload to re-check auth/memberships
        />
      );
    }
  }

  // AUTHENTICATED & HAS ORGS -> Proceed to App
  const userId = appMode === 'prod' ? supabaseUser?.id : currentUser?.id;
  const userEmail = appMode === 'prod' ? supabaseUser?.email : currentUser?.email;

  if (userId && userEmail) {
    console.log('✅ [AppWithOrg] Authenticated & Has Orgs - wrapping in OrgProvider');
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
  const { isAuthenticated, currentUser, getUserRole } = authContext;
  const { isDarkMode } = useTheme();
  const { 
    membershipError, 
    retryMembershipFetch, 
    signOut: supabaseSignOut, 
    session: supabaseSession,
    authReady // Use new authReady flag
  } = useSupabaseAuth();
  const { appMode } = useAppMode();
  const [authView, setAuthView] = React.useState<'signin' | 'invite' | 'app'>('signin');
  const [dataInitialized, setDataInitialized] = React.useState(false);
  const [inviteToken, setInviteToken] = React.useState('');
  const [showMembershipError, setShowMembershipError] = React.useState(true);
  
  const [currentPage, setCurrentPage] = React.useState<string>('War Room');
  const [currentIssueSlug, setCurrentIssueSlug] = React.useState<string | null>(null);
  const [currentBillId, setCurrentBillId] = React.useState<string | null>(null);
  const [currentLegislatorId, setCurrentLegislatorId] = React.useState<string | null>(null);
  const [currentClientId, setCurrentClientId] = React.useState<string | null>(null);
  const [currentCommitteeId, setCurrentCommitteeId] = React.useState<string | null>(null);

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

  // Determine initial page based on user role
  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      const role = getUserRole();
      if (role?.name.toLowerCase().includes('canvassing') && !role.name.toLowerCase().includes('lead')) {
        // Canvassing-only users go to War Room (canvassing planner)
        setCurrentPage('War Room');
      } else {
        // Everyone else goes to Dashboard by default
        setCurrentPage('Dashboard');
      }
    }
  }, [isAuthenticated, currentUser, getUserRole]);

  // Reset auth view when user logs out
  React.useEffect(() => {
    if (!isAuthenticated) {
      setAuthView('signin');
    }
  }, [isAuthenticated]);

  const handleNavigateToIssue = (slug: string) => {
    setCurrentPage('Issues');
    setCurrentIssueSlug(slug);
  };

  const handleNavigateToBill = (billId: string) => {
    setCurrentBillId(billId);
    setCurrentPage('Bills');
  };

  const handleNavigateToLegislator = (legislatorId: string) => {
    setCurrentPage('Legislators');
    setCurrentLegislatorId(legislatorId);
  };

  const handleNavigateToClient = (clientId: string) => {
    setCurrentPage('Clients');
    setCurrentClientId(clientId);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (page === 'Issues') {
      setCurrentIssueSlug(null);
    }
    if (page === 'Bills') {
      setCurrentBillId(null);
    }
    if (page === 'Legislators') {
      setCurrentLegislatorId(null);
    }
    if (page === 'Clients') {
      setCurrentClientId(null);
    }
    if (page === 'Committees') {
      setCurrentCommitteeId(null);
    }
  };

  // Handle sign in success
  const handleSignInSuccess = () => {
    setAuthView('app');
  };

  // Handle invite accept success
  const handleInviteAcceptSuccess = () => {
    setAuthView('signin');
    setInviteToken('');
  };

  // ROUTE GUARD: Use Supabase session as source of truth in prod mode
  // PROD MODE: Use Supabase session; DEMO MODE: Use legacy auth
  const isAuthedForRouting = appMode === 'prod' ? !!supabaseSession : isAuthenticated;

  // GATE LOGGING
  console.log('🚪 [MainApp] Route Guard Check:', {
    appMode,
    authReady,
    sessionExists: !!supabaseSession,
    legacyIsAuthenticated: isAuthenticated,
    isAuthedForRouting,
    renderingComponent: isAuthedForRouting ? 'Authenticated App' : 'SignInPage',
  });

  // CHECKING AUTHENTICATION LOOP FIX
  // Only show "Checking authentication..." if auth is NOT ready
  if (appMode === 'prod' && !authReady) {
    console.log('⏳ [MainApp] Auth not ready (initializing session), showing checking screen');
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
  if (!dataInitialized) {
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
            onBack={() => setCurrentIssueSlug(null)}
          />
        );
      }
      return <IssuesHub />;
    }

    if (currentPage === 'Legislators') {
      return <LegislatorsPage 
        initialLegislatorId={currentLegislatorId} 
        onNavigateToBill={handleNavigateToBill}
        watchedLegislatorIds={watchedLegislatorIds}
        onToggleWatch={toggleWatchLegislator}
      />;
    }

    if (currentPage === 'Bills') {
      if (currentBillId) {
        return (
          <BillDetailPage
            billId={currentBillId}
            onBack={() => setCurrentBillId(null)}
            onNavigateToLegislator={handleNavigateToLegislator}
          />
        );
      }
      return <BillsPage onNavigateToBill={handleNavigateToBill} />;
    }

    if (currentPage === 'Clients') {
      if (currentClientId) {
        return (
          <ClientDetailPage
            clientId={currentClientId}
            onNavigateBack={() => setCurrentClientId(null)}
            onNavigateToBill={handleNavigateToBill}
          />
        );
      }
      return <ClientsIndexPage onNavigateToClient={handleNavigateToClient} />
    }

    if (currentPage === 'Projects') {
      return (
        <WorkHubPage
          onNavigateToClient={handleNavigateToClient}
          onNavigateToBill={handleNavigateToBill}
        />
      );
    }

    if (currentPage === 'War Room') {
      return <WarRoom />;
    }

    if (currentPage === 'Chat') {
      return <ChatPage />;
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

    if (currentPage === 'Analytics') {
      return <AnalyticsPage />;
    }

    // Default Dashboard view
    return <ModularDashboard 
      watchedLegislatorIds={watchedLegislatorIds}
      onNavigateToLegislator={handleNavigateToLegislator}
    />;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Background with Dark Mode Support */}
      <div 
        className={`
          fixed inset-0 transition-colors duration-500
          ${isDarkMode 
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
            : 'bg-gradient-to-br from-red-50/20 via-white to-blue-50/20'
          }
        `}
      />
      
      {/* Falling Snowflakes - Subtle Winter Theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${isDarkMode ? 'bg-white/30' : 'bg-white/60'}`}
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}px`,
              animation: `snowfall ${Math.random() * 10 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: Math.random() * 0.6 + 0.2,
              boxShadow: isDarkMode 
                ? '0 0 8px rgba(255, 255, 255, 0.5)' 
                : '0 0 6px rgba(255, 255, 255, 0.8)',
            }}
          />
        ))}
      </div>
      
      {/* Snowfall animation */}
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(50vh) translateX(${Math.random() * 100 - 50}px) rotate(180deg);
          }
          100% {
            transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
          }
        }
      `}</style>
      
      {/* Grid Pattern */}
      <div 
        className={`fixed inset-0 transition-opacity duration-500 ${isDarkMode ? 'opacity-[0.15]' : 'opacity-[0.02]'}`}
        style={{
          backgroundImage: `
            linear-gradient(${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div 
              className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[120px] transition-all duration-1000"
              style={{ background: 'radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px] transition-all duration-1000"
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)' }}
            />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-red-500/8 rounded-full blur-[120px] transition-opacity duration-500" />
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[100px] transition-opacity duration-500" />
            <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-red-500/6 rounded-full blur-[130px] transition-opacity duration-500" />
          </>
        )}
      </div>
      
      {/* Noise Overlay */}
      <div className={`fixed inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-500 ${isDarkMode ? 'opacity-[0.02]' : 'opacity-[0.015]'}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Vignette */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${isDarkMode ? 'opacity-30' : 'opacity-100'}`}>
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-b from-transparent via-transparent to-black/30' : 'bg-radial-gradient from-transparent via-transparent to-gray-900/[0.03]'}`} />
      </div>

      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-72 relative z-10">
        <TopHeader />
        
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
        
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
          <Footer />
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
    <AuthProvider>
      <ToastProvider>
        <AskPythiaProvider>
          <SmartStructuringProvider>
            <DashboardProvider>
              <ThemeProvider>
                <AppModeProvider>
                  <SupabaseAuthProvider>
                    <AuthBridge />
                    <AppWithOrg />
                    <AskPythiaModal />
                    <StructuringDrawer />
                  </SupabaseAuthProvider>
                </AppModeProvider>
              </ThemeProvider>
            </DashboardProvider>
          </SmartStructuringProvider>
        </AskPythiaProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
