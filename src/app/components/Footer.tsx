import React from 'react';
import { createPortal } from 'react-dom';
import pythiaStarLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';
import { useTheme } from '../contexts/ThemeContext';
import { useAppMode } from '../contexts/AppModeContext';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { Database, Settings, Wifi, WifiOff, FileText, Activity, UserCheck, TestTube2, Zap, Mic } from 'lucide-react';
import { SupabaseEnvCheck } from './debug/SupabaseEnvCheck';
import { Phase1Report } from './debug/Phase1Report';
import { Phase15Report } from './debug/Phase15Report';
import { AuthOrgDiagnostics } from './debug/AuthOrgDiagnostics';
import { LiveSignInReport } from './debug/LiveSignInReport';
import { LiveAuthMembershipCheck } from './debug/LiveAuthMembershipCheck';
import { LiveSignInSmokeTest } from './debug/LiveSignInSmokeTest';
import { MsalAuthDebugger } from './debug/MsalAuthDebugger';
import { VoiceCommandsReference } from './debug/VoiceCommandsReference';

export const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { appMode, setAppMode, orgLabel } = useAppMode();
  const { connectionStatus } = useSupabaseAuth();
  const [showDebugMenu, setShowDebugMenu] = React.useState(false);
  const [showEnvCheck, setShowEnvCheck] = React.useState(false);
  const [showPhase1Report, setShowPhase1Report] = React.useState(false);
  const [showPhase15Report, setShowPhase15Report] = React.useState(false);
  const [showAuthOrgDiagnostics, setShowAuthOrgDiagnostics] = React.useState(false);
  const [showLiveSignInReport, setShowLiveSignInReport] = React.useState(false);
  const [showLiveAuthMembershipCheck, setShowLiveAuthMembershipCheck] = React.useState(false);
  const [showLiveSignInSmokeTest, setShowLiveSignInSmokeTest] = React.useState(false);
  const [showMsalDebugger, setShowMsalDebugger] = React.useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = React.useState(false);
  const debugButtonRef = React.useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = React.useState({ bottom: 0, right: 0 });
  const debugMenuRef = React.useRef<HTMLDivElement>(null);

  // Calculate menu position when opened
  React.useEffect(() => {
    if (showDebugMenu && debugButtonRef.current) {
      const rect = debugButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        bottom: window.innerHeight - rect.top + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [showDebugMenu]);

  // Close debug menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDebugMenu &&
        debugMenuRef.current &&
        !debugMenuRef.current.contains(event.target as Node) &&
        debugButtonRef.current &&
        !debugButtonRef.current.contains(event.target as Node)
      ) {
        setShowDebugMenu(false);
      }
    };

    if (showDebugMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDebugMenu]);

  return (
    <footer 
      className={`
        relative border-t px-8 py-8 mt-auto overflow-hidden transition-all duration-500
        ${isDarkMode 
          ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-white/10' 
          : 'bg-gradient-to-r from-gray-50 via-white to-gray-50 border-gray-200'
        }
      `}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isDarkMode ? (
          <>
            <div 
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20 blur-[100px]"
              style={{ background: 'radial-gradient(circle, rgba(220, 38, 38, 0.6) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-15 blur-[100px]"
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)' }}
            />
          </>
        ) : (
          <>
            <div 
              className="absolute -bottom-10 left-1/4 w-48 h-48 rounded-full opacity-5 blur-[60px]"
              style={{ background: 'radial-gradient(circle, rgba(139, 21, 56, 0.8) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute -bottom-10 right-1/4 w-48 h-48 rounded-full opacity-5 blur-[60px]"
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)' }}
            />
          </>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between">
        {/* Left Side - Branding and Links */}
        <div className="flex items-center gap-8">
          {/* Logo with glow effect */}
          <div className="relative group">
            
            <div 
              className="absolute inset-0 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"
              style={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #DC2626, #3B82F6)' 
                  : 'linear-gradient(135deg, #8B1538, #3B82F6)'
              }}
            />
            <img 
              src={pythiaStarLogo} 
              alt="Revere Logo" 
              className="relative h-12 w-12 transition-transform duration-500 group-hover:scale-110"
              style={{ 
                filter: isDarkMode 
                  ? 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))' 
                  : 'brightness(0) saturate(100%) invert(17%) sepia(71%) saturate(2799%) hue-rotate(336deg) brightness(92%) contrast(95%) drop-shadow(0 2px 8px rgba(139, 21, 56, 0.3))'
              }}
            />
          </div>
          
          {/* Text Content */}
          <div className="flex flex-col gap-2">
            <div 
              className={`
                font-bold uppercase tracking-wide transition-colors duration-300
                ${isDarkMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-blue-200' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-[#8B1538] via-red-800 to-blue-700'
                }
              `}
              style={{ 
                fontSize: '24px',
                fontFamily: '"Anta", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                letterSpacing: '0.12em'
              }}
            >
              Revere
            </div>
            
            {/* Links */}
            <div className={`flex items-center gap-3 text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              <button className={`transition-colors duration-200 ${isDarkMode ? 'hover:text-red-400' : 'hover:text-[#8B1538]'} font-medium`}>
                Privacy
              </button>
              <span className={isDarkMode ? 'text-slate-600' : 'text-gray-300'}>•</span>
              <button className={`transition-colors duration-200 ${isDarkMode ? 'hover:text-red-400' : 'hover:text-[#8B1538]'} font-medium`}>
                Terms
              </button>
              <span className={isDarkMode ? 'text-slate-600' : 'text-gray-300'}>•</span>
              <button className={`transition-colors duration-200 ${isDarkMode ? 'hover:text-red-400' : 'hover:text-[#8B1538]'} font-medium`}>
                Accessibility
              </button>
              <span className={isDarkMode ? 'text-slate-600' : 'text-gray-300'}>•</span>
              <button className={`transition-colors duration-200 ${isDarkMode ? 'hover:text-red-400' : 'hover:text-[#8B1538]'} font-medium`}>
                Status
              </button>
              <span className={isDarkMode ? 'text-slate-600' : 'text-gray-300'}>•</span>
              <button className={`transition-colors duration-200 ${isDarkMode ? 'hover:text-red-400' : 'hover:text-[#8B1538]'} font-medium`}>
                Support
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Side - Version and Copyright */}
        <div className="flex flex-col items-end gap-1">
          {/* Debug Menu Toggle */}
          <button
            ref={debugButtonRef}
            onClick={() => setShowDebugMenu(!showDebugMenu)}
            className={`
              mb-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5
              ${isDarkMode
                ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-300 border border-white/10'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700 border border-gray-300'
              }
            `}
            title="Debug Menu"
          >
            <Settings className="w-3 h-3" />
            Debug
          </button>

          {/* Debug Menu Panel */}
          {showDebugMenu && (
            createPortal(
              <div
                ref={debugMenuRef}
                className={`
                  fixed p-4 rounded-lg shadow-2xl border z-[99999]
                  ${isDarkMode
                    ? 'bg-slate-900 border-white/10'
                    : 'bg-white border-gray-200'
                  }
                `}
                style={{ 
                  minWidth: '280px', 
                  bottom: `${menuPosition.bottom}px`, 
                  right: `${menuPosition.right}px` 
                }}
              >
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      App Mode
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAppMode('demo')}
                        className={`
                          flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-all
                          ${appMode === 'demo'
                            ? 'bg-orange-500 text-white'
                            : isDarkMode
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }
                        `}
                      >
                        Demo
                      </button>
                      <button
                        onClick={() => setAppMode('prod')}
                        className={`
                          flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-all
                          ${appMode === 'prod'
                            ? 'bg-green-500 text-white'
                            : isDarkMode
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }
                        `}
                      >
                        Live
                      </button>
                    </div>
                  </div>

                  <div className={`pt-2 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Organization
                    </label>
                    <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {orgLabel}
                    </div>
                  </div>

                  <div className={`pt-2 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <label className={`block text-xs font-bold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Connection Status
                    </label>
                    <div className="flex items-center gap-2">
                      {connectionStatus === 'connected' && (
                        <>
                          <Wifi className="w-4 h-4 text-green-500" />
                          <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            Connected
                          </span>
                        </>
                      )}
                      {connectionStatus === 'disconnected' && (
                        <>
                          <WifiOff className="w-4 h-4 text-red-500" />
                          <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            Disconnected
                          </span>
                        </>
                      )}
                      {connectionStatus === 'checking' && (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            Checking...
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowEnvCheck(true)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold transition-all
                      ${isDarkMode
                        ? 'bg-blue-600/80 text-white hover:bg-blue-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }
                    `}
                  >
                    <Database className="w-3.5 h-3.5" />
                    Supabase Environment Check
                  </button>

                  <button
                    onClick={() => setShowPhase1Report(true)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold transition-all
                      ${isDarkMode
                        ? 'bg-green-600/80 text-white hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                      }
                    `}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Phase 1 Report
                  </button>

                  <button
                    onClick={() => setShowPhase15Report(true)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold transition-all
                      ${isDarkMode
                        ? 'bg-green-600/80 text-white hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                      }
                    `}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Phase 1.5 Report
                  </button>

                  <button
                    onClick={() => setShowAuthOrgDiagnostics(true)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold transition-all
                      ${isDarkMode
                        ? 'bg-green-600/80 text-white hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                      }
                    `}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Auth/Org Diagnostics
                  </button>

                  <button
                    onClick={() => setShowLiveSignInReport(true)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold transition-all
                      ${isDarkMode
                        ? 'bg-green-600/80 text-white hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                      }
                    `}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Live Sign-In Report
                  </button>

                  <button
                    onClick={() => setShowLiveAuthMembershipCheck(true)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold transition-all
                      ${isDarkMode
                        ? 'bg-green-600/80 text-white hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                      }
                    `}
                  >
                    <TestTube2 className="w-3.5 h-3.5" />
                    Live Auth Membership Check
                  </button>

                  <button
                    onClick={() => setShowLiveSignInSmokeTest(true)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold transition-all
                      ${isDarkMode
                        ? 'bg-green-600/80 text-white hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                      }
                    `}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Live Sign-In Smoke Test
                  </button>

                  <button
                    onClick={() => setShowMsalDebugger(true)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold transition-all
                      ${isDarkMode
                        ? 'bg-blue-600/80 text-white hover:bg-blue-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }
                    `}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    MSAL Auth Debugger
                  </button>

                  <div className={`my-2 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`} />

                  <button
                    onClick={() => setShowVoiceCommands(true)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold transition-all
                      ${isDarkMode
                        ? 'bg-purple-600/80 text-white hover:bg-purple-600'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                      }
                    `}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    Voice Commands Ref
                  </button>
                </div>
              </div>,
              document.body
            )
          )}
          
          <div 
            className={`
              px-4 py-1.5 rounded-full font-bold text-xs tracking-wider border transition-all duration-300
              ${isDarkMode 
                ? 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20' 
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300'
              }
            `}
          >
            v0.1.0-alpha.1
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} font-medium`}>
            © {new Date().getFullYear()} Revere Intelligence
          </div>
        </div>
      </div>
      
      {/* Supabase Environment Check Modal */}
      <SupabaseEnvCheck 
        isOpen={showEnvCheck}
        onClose={() => setShowEnvCheck(false)}
      />

      {/* Voice Commands Reference Modal */}
      <VoiceCommandsReference
        isOpen={showVoiceCommands}
        onClose={() => setShowVoiceCommands(false)}
      />

      {/* Phase 1 Report Modal */}
      <Phase1Report 
        isOpen={showPhase1Report}
        onClose={() => setShowPhase1Report(false)}
      />

      {/* Phase 1.5 Report Modal */}
      <Phase15Report 
        isOpen={showPhase15Report}
        onClose={() => setShowPhase15Report(false)}
      />

      {/* Auth/Org Diagnostics Modal */}
      <AuthOrgDiagnostics 
        isOpen={showAuthOrgDiagnostics}
        onClose={() => setShowAuthOrgDiagnostics(false)}
      />

      {/* Live Sign-In Report Modal */}
      <LiveSignInReport 
        isOpen={showLiveSignInReport}
        onClose={() => setShowLiveSignInReport(false)}
      />

      {/* Live Auth Membership Check Modal */}
      <LiveAuthMembershipCheck 
        isOpen={showLiveAuthMembershipCheck}
        onClose={() => setShowLiveAuthMembershipCheck(false)}
      />

      {/* Live Sign-In Smoke Test Modal */}
      <LiveSignInSmokeTest 
        isOpen={showLiveSignInSmokeTest}
        onClose={() => setShowLiveSignInSmokeTest(false)}
      />

      {/* MSAL Auth Debugger Modal */}
      <MsalAuthDebugger 
        isOpen={showMsalDebugger}
        onClose={() => setShowMsalDebugger(false)}
      />
    </footer>
  );
};