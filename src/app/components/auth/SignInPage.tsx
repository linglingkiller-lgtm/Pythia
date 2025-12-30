import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';
import { Button } from '../ui/Button';
import pythiaStarLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';
import ecLogo from 'figma:asset/d7c67b108e959e20f7952a5cef5c10ce27199907.png';
import { Eye, EyeOff, AlertCircle, Loader2, X, Settings, Database, FileText, Activity, UserCheck, TestTube2, Zap, Wifi, WifiOff } from 'lucide-react';
import { SupabaseEnvCheck } from '../debug/SupabaseEnvCheck';
import { Phase1Report } from '../debug/Phase1Report';
import { Phase15Report } from '../debug/Phase15Report';
import { AuthOrgDiagnostics } from '../debug/AuthOrgDiagnostics';
import { LiveSignInReport } from '../debug/LiveSignInReport';
import { LiveAuthMembershipCheck } from '../debug/LiveAuthMembershipCheck';
import { LiveSignInSmokeTest } from '../debug/LiveSignInSmokeTest';

interface SignInPageProps {
  onSignInSuccess?: () => void;
  onInviteClick?: (token: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onSignInSuccess, onInviteClick }) => {
  const { login: legacyLogin } = useAuth();
  const { signIn: supabaseSignIn, connectionStatus, session: existingSession, authReady } = useSupabaseAuth();
  const { appMode, setAppMode, orgLabel } = useAppMode();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [showDemoDetails, setShowDemoDetails] = useState(false);
  
  // IN-FLIGHT LOCK: Prevent multiple simultaneous sign-in attempts
  const isSigningInRef = useRef(false);
  const signInAttemptCounter = useRef(0);
  
  // Debug menu state
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [showEnvCheck, setShowEnvCheck] = useState(false);
  const [showPhase1Report, setShowPhase1Report] = useState(false);
  const [showPhase15Report, setShowPhase15Report] = useState(false);
  const [showAuthOrgDiagnostics, setShowAuthOrgDiagnostics] = useState(false);
  const [showLiveSignInReport, setShowLiveSignInReport] = useState(false);
  const [showLiveAuthMembershipCheck, setShowLiveAuthMembershipCheck] = useState(false);
  const [showLiveSignInSmokeTest, setShowLiveSignInSmokeTest] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const debugButtonRef = useRef<HTMLButtonElement>(null);
  const debugMenuRef = useRef<HTMLDivElement>(null);

  // CHECK FOR EXISTING SESSION ON MOUNT - Navigate away if already authenticated
  useEffect(() => {
    if (appMode === 'prod' && existingSession && authReady) {
      console.log('✅ [SignInPage] Existing session detected, navigating to app...');
      onSignInSuccess?.();
    }
  }, [existingSession, authReady, appMode, onSignInSuccess]);

  // Open modal handler
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  // Focus email field when modal opens
  useEffect(() => {
    if (showModal && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [showModal]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        handleCloseModal();
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showModal]);

  // Focus trap inside modal
  useEffect(() => {
    if (!showModal || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [showModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // IN-FLIGHT LOCK: Prevent duplicate sign-in attempts
    if (isSigningInRef.current) {
      console.warn('⚠️ [SignInPage] Sign-in already in progress, ignoring duplicate submission');
      return;
    }
    
    // Generate unique attempt ID for logging
    signInAttemptCounter.current += 1;
    const attemptId = `attempt-${signInAttemptCounter.current}`;
    console.log(`🔐 [SignInPage] Starting sign-in ${attemptId} (caller: Submit button)`);
    
    isSigningInRef.current = true;
    setError('');
    setLoading(true);

    try {
      // Use Supabase auth in Live mode, legacy auth in Demo mode
      let result;
      if (appMode === 'prod') {
        console.log(`🔐 [SignInPage] ${attemptId}: Calling Supabase signInWithPassword...`);
        result = await supabaseSignIn(email, password);
      } else {
        console.log(`🔐 [SignInPage] ${attemptId}: Calling legacy login...`);
        result = await legacyLogin(email, password);
      }

      if (result.success) {
        console.log(`✅ [SignInPage] ${attemptId}: Sign-in successful`);
        handleCloseModal();
        onSignInSuccess?.();
      } else {
        console.error(`❌ [SignInPage] ${attemptId}: Sign-in failed:`, result.error);
        setError(result.error || 'Sign in failed');
      }
    } catch (err) {
      console.error(`❌ [SignInPage] ${attemptId}: Exception during sign-in:`, err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      isSigningInRef.current = false;
      console.log(`🔐 [SignInPage] ${attemptId}: Sign-in attempt complete (lock released)`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes textGradientFlow {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .modal-overlay,
          .modal-card {
            animation: fadeIn 150ms ease-out !important;
          }
          
          .mesh-gradient {
            animation: none !important;
          }

          .pythia-gradient-text {
            animation: none !important;
            background: linear-gradient(135deg, #dc2626 0%, #3b82f6 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }

        .modal-overlay {
          animation: fadeIn 200ms ease-out;
        }

        .modal-card {
          animation: modalSlideUp 350ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .hero-button {
          transition: all 200ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .hero-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.25);
        }

        .hero-button:active {
          transform: translateY(0px);
          box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.2);
        }

        /* Red/White/Blue Mesh gradient background */
        .mesh-gradient {
          position: fixed;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(220, 38, 38, 0.65) 0%,
            rgba(200, 35, 35, 0.6) 10%,
            rgba(185, 28, 28, 0.55) 20%,
            rgba(170, 25, 50, 0.5) 30%,
            rgba(150, 50, 100, 0.45) 40%,
            rgba(130, 90, 150, 0.4) 50%,
            rgba(100, 110, 180, 0.45) 60%,
            rgba(80, 130, 220, 0.5) 70%,
            rgba(59, 130, 246, 0.55) 80%,
            rgba(45, 120, 240, 0.6) 90%,
            rgba(37, 99, 235, 0.65) 100%
          );
          background-color: #fefefe;
          background-size: 400% 400%;
          animation: gradientShift 35s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          filter: blur(2px);
        }

        .mesh-gradient::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.015) 100%);
          pointer-events: none;
        }

        /* Text shadow for contrast */
        .hero-text-shadow {
          text-shadow: 0 1px 3px rgba(255, 255, 255, 0.6);
        }

        /* Gradient animated text for PYTHIA - Carved/Inset Effect */
        .pythia-gradient-text {
          background: linear-gradient(
            90deg,
            #ffffff 0%, 
            #fff5f5 25%,
            #f5f5ff 50%,
            #f5ffff 75%,
            #ffffff 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textGradientFlow 8s ease-in-out infinite;
          /* Inverted shadows for sunken/carved effect + reduced glow */
          filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.3)) 
                  drop-shadow(0 1px 2px rgba(255, 255, 255, 0.8))
                  drop-shadow(1px 0 1px rgba(0, 0, 0, 0.15))
                  drop-shadow(0 0 12px rgba(255, 255, 255, 0.54))
                  drop-shadow(0 0 24px rgba(255, 255, 255, 0.27));
        }

        /* Gradient animated logo - Carved/Inset Effect */
        .pythia-gradient-logo {
          /* Inverted shadows for sunken/carved effect + reduced glow */
          filter: brightness(0) invert(1)
                  drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.3)) 
                  drop-shadow(0 1px 2px rgba(255, 255, 255, 0.8))
                  drop-shadow(1px 0 1px rgba(0, 0, 0, 0.15))
                  drop-shadow(0 0 12px rgba(255, 255, 255, 0.54))
                  drop-shadow(0 0 24px rgba(255, 255, 255, 0.27));
        }
      `}</style>

      {/* Full-screen mesh gradient background */}
      <div className="mesh-gradient" />

      {/* Hero section */}
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        {/* Logo Icon - Larger and White */}
        <img 
          src={pythiaStarLogo} 
          alt="Revere" 
          className="pythia-gradient-logo"
          style={{ 
            height: '150px',
            width: '150px',
            marginBottom: '1.75rem',
          }}
        />

        {/* PYTHIA Wordmark */}
        <h1 
          className="hero-text-shadow pythia-gradient-text"
          style={{ 
            fontSize: '86px',
            fontFamily: '"Anta", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: '#1a1a1a',
            textTransform: 'uppercase',
            margin: '0 0 0.875rem 0',
            lineHeight: 1,
          }}
        >
          R e v e r e
        </h1>

        {/* Echo Canyon Consulting */}
        <p 
          className="hero-text-shadow"
          style={{ 
            fontSize: '18px',
            color: 'rgba(30, 30, 30, 0.68)',
            marginBottom: '2.25rem',
            fontWeight: 500,
            letterSpacing: '0.025em',
          }}
        >
          Echo Canyon Consulting
        </p>

        {/* Tagline */}
        <p 
          className="hero-text-shadow"
          style={{ 
            fontSize: '24px',
            color: 'rgba(30, 30, 30, 0.85)',
            marginBottom: '3.5rem',
            fontWeight: 600,
            letterSpacing: '-0.015em',
          }}
        >
          See Everything, Do Anything.
        </p>

        {/* Sign In Button */}
        <button
          onClick={handleOpenModal}
          className="hero-button"
          style={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '18px 64px',
            fontSize: '18px',
            fontWeight: 600,
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.2)',
            marginBottom: '1.5rem',
          }}
        >
          Sign In
        </button>

        {/* Suite Marketing Link */}
        <button
          onClick={() => window.location.href = '?page=suite'}
          className="hero-button"
          style={{
            background: 'linear-gradient(to right, rgba(37, 99, 235, 0.85), rgba(147, 51, 234, 0.85), rgba(220, 38, 38, 0.85))',
            color: 'white',
            padding: '14px 48px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '12px',
            border: '1px solid rgba(147, 51, 234, 0.4)',
            cursor: 'pointer',
            boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.2)',
            marginBottom: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span style={{ position: 'relative', zIndex: 10 }}>See What We Can Do</span>
        </button>

        {/* Helper link */}
        <p style={{ fontSize: '13px', color: 'rgba(30, 30, 30, 0.6)' }}>
          Need an invite?{' '}
          <a 
            href="#" 
            style={{ 
              color: '#b91c1c', 
              textDecoration: 'none',
              fontWeight: 500,
            }}
            onClick={(e) => e.preventDefault()}
          >
            Contact your administrator
          </a>
        </p>
      </div>

      {/* Modal Portal */}
      {showModal && (
        <div
          ref={overlayRef}
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
          }}
        >
          {/* Modal Card */}
          <div
            ref={modalRef}
            className="modal-card"
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.18)',
              width: '100%',
              maxWidth: '440px',
              padding: '2.5rem',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: '#6b7280',
                borderRadius: '0.375rem',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Logo combination */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1rem', 
              marginBottom: '1.75rem' 
            }}>
              {/* Pythia star logo in red */}
              <img 
                src={pythiaStarLogo} 
                alt="Pythia" 
                style={{ 
                  height: '48px',
                  width: '48px',
                  filter: 'brightness(0) saturate(100%) invert(14%) sepia(95%) saturate(6893%) hue-rotate(359deg) brightness(94%) contrast(115%)',
                }}
              />
              
              {/* Vertical divider */}
              <div style={{ 
                width: '1.5px', 
                height: '56px', 
                backgroundColor: '#d1d5db' 
              }} />
              
              {/* Echo Canyon logo */}
              <img 
                src={ecLogo} 
                alt="Echo Canyon Consulting" 
                style={{ 
                  height: '48px',
                  width: 'auto',
                }}
              />
            </div>

            {/* Modal header - centered */}
            <h2 style={{ color: '#111827', marginBottom: '0.5rem', fontSize: '28px', fontWeight: 700, textAlign: 'center' }}>
              Sign in
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2rem', textAlign: 'center' }}>
              Enter your credentials to access Revere
            </p>

            {/* Error message */}
            {error && (
              <div style={{ 
                marginBottom: '1.5rem', 
                padding: '0.875rem', 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: '0.5rem', 
                display: 'flex', 
                alignItems: 'start', 
                gap: '0.5rem' 
              }}>
                <AlertCircle style={{ width: '16px', height: '16px', color: '#dc2626', marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '14px', color: '#991b1b', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label 
                  htmlFor="email" 
                  style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}
                >
                  Email
                </label>
                <input
                  ref={emailInputRef}
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1.5px solid #e5e7eb', 
                    borderRadius: '0.5rem',
                    fontSize: '15px',
                    transition: 'border-color 150ms',
                  }}
                  placeholder="admin@echocanyonconsulting.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyDown}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      paddingRight: '3rem', 
                      border: '1.5px solid #e5e7eb', 
                      borderRadius: '0.5rem',
                      fontSize: '15px',
                      transition: 'border-color 150ms',
                    }}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: '0.875rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#6b7280', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      padding: '0.25rem',
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {capsLockOn && (
                  <p style={{ 
                    marginTop: '0.375rem', 
                    fontSize: '12px', 
                    color: '#d97706', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.25rem',
                    margin: '0.375rem 0 0 0'
                  }}>
                    <AlertCircle size={12} />
                    Caps lock is on
                  </p>
                )}
              </div>

              {/* Sign in button */}
              <Button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#7f1d1d',
                  color: 'white',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 150ms',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>

              {/* Forgot password */}
              <div style={{ textAlign: 'center' }}>
                <button 
                  type="button"
                  style={{ 
                    fontSize: '14px', 
                    color: '#b91c1c', 
                    fontWeight: 500, 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    padding: 0,
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </button>
              </div>
            </form>

            {/* Demo credentials */}
            <div style={{ marginTop: '1.75rem' }}>
              <button
                type="button"
                onClick={() => setShowDemoDetails(!showDemoDetails)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                Demo Credentials
                <span style={{ transform: showDemoDetails ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }}>
                  ▼
                </span>
              </button>
              
              {showDemoDetails && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  padding: '1rem', 
                  backgroundColor: '#eff6ff', 
                  border: '1px solid #bfdbfe', 
                  borderRadius: '0.5rem',
                }}
                >
                  <p style={{ fontSize: '13px', color: '#1e40af', margin: '0 0 0.25rem 0' }}>
                    <strong>Username:</strong> admin
                  </p>
                  <p style={{ fontSize: '13px', color: '#1e40af', margin: '0 0 0.75rem 0' }}>
                    <strong>Password:</strong> demo
                  </p>
                  <p style={{ fontSize: '12px', color: '#2563eb', margin: 0 }}>
                    To test invite flow, add <code style={{ backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '3px', fontFamily: 'monospace' }}>?invite=abc123xyz789</code> to URL
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Debug Menu Button */}
      <button
        ref={debugButtonRef}
        onClick={() => setShowDebugMenu(!showDebugMenu)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid rgba(220, 38, 38, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms',
          zIndex: 9990,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        title="Debug Menu"
      >
        <Settings style={{ width: '24px', height: '24px', color: '#dc2626' }} />
      </button>

      {/* Debug Menu Panel */}
      {showDebugMenu && (
        <div
          ref={debugMenuRef}
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '2rem',
            width: '280px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            padding: '1rem',
            zIndex: 9991,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                App Mode
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setAppMode('demo')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: appMode === 'demo' ? '#f97316' : '#f3f4f6',
                    color: appMode === 'demo' ? 'white' : '#374151',
                    transition: 'all 150ms',
                  }}
                >
                  Demo
                </button>
                <button
                  onClick={() => setAppMode('prod')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: appMode === 'prod' ? '#10b981' : '#f3f4f6',
                    color: appMode === 'prod' ? 'white' : '#374151',
                    transition: 'all 150ms',
                  }}
                >
                  Live
                </button>
              </div>
            </div>

            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Organization
              </label>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                {orgLabel}
              </div>
            </div>

            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Connection
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {connectionStatus === 'connected' && (
                  <>
                    <Wifi style={{ width: '16px', height: '16px', color: '#10b981' }} />
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#111827' }}>Connected</span>
                  </>
                )}
                {connectionStatus === 'disconnected' && (
                  <>
                    <WifiOff style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#111827' }}>Disconnected</span>
                  </>
                )}
                {connectionStatus === 'checking' && (
                  <>
                    <div style={{ width: '16px', height: '16px', border: '2px solid #9ca3af', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#111827' }}>Checking...</span>
                  </>
                )}
              </div>
            </div>

            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => setShowEnvCheck(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <Database style={{ width: '14px', height: '14px' }} />
                Supabase Environment Check
              </button>

              <button
                onClick={() => setShowPhase1Report(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <FileText style={{ width: '14px', height: '14px' }} />
                Phase 1 Report
              </button>

              <button
                onClick={() => setShowPhase15Report(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <FileText style={{ width: '14px', height: '14px' }} />
                Phase 1.5 Report
              </button>

              <button
                onClick={() => setShowAuthOrgDiagnostics(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <Activity style={{ width: '14px', height: '14px' }} />
                Auth/Org Diagnostics
              </button>

              <button
                onClick={() => setShowLiveSignInReport(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <UserCheck style={{ width: '14px', height: '14px' }} />
                Live Sign-In Report
              </button>

              <button
                onClick={() => setShowLiveAuthMembershipCheck(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <TestTube2 style={{ width: '14px', height: '14px' }} />
                Live Auth Membership Check
              </button>

              <button
                onClick={() => setShowLiveSignInSmokeTest(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <Zap style={{ width: '14px', height: '14px' }} />
                Live Sign-In Smoke Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug Modals */}
      <SupabaseEnvCheck 
        isOpen={showEnvCheck}
        onClose={() => setShowEnvCheck(false)}
      />

      <Phase1Report 
        isOpen={showPhase1Report}
        onClose={() => setShowPhase1Report(false)}
      />

      <Phase15Report 
        isOpen={showPhase15Report}
        onClose={() => setShowPhase15Report(false)}
      />

      <AuthOrgDiagnostics 
        isOpen={showAuthOrgDiagnostics}
        onClose={() => setShowAuthOrgDiagnostics(false)}
      />

      <LiveSignInReport 
        isOpen={showLiveSignInReport}
        onClose={() => setShowLiveSignInReport(false)}
      />

      <LiveAuthMembershipCheck 
        isOpen={showLiveAuthMembershipCheck}
        onClose={() => setShowLiveAuthMembershipCheck(false)}
      />

      <LiveSignInSmokeTest 
        isOpen={showLiveSignInSmokeTest}
        onClose={() => setShowLiveSignInSmokeTest(false)}
      />
    </>
  );
};