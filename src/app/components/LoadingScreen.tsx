import React from 'react';
import { Server, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import pythiaLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';

interface LoadingScreenProps {
  step: 1 | 2 | 3;
  title: string;
  subtext: string;
  orgName?: string;
  userRole?: string;
  isDarkMode?: boolean;
}

export function LoadingScreen({ 
  step, 
  title, 
  subtext, 
  orgName, 
  userRole, 
  isDarkMode: propIsDarkMode 
}: LoadingScreenProps) {
  // Use prop if provided, otherwise fall back to context (useful if used outside context)
  const theme = useTheme();
  const isDarkMode = propIsDarkMode ?? theme.isDarkMode;

  const steps = [
    { number: 1, label: 'Signal', icon: ShieldCheck },
    { number: 2, label: 'Synthesis', icon: Server },
    { number: 3, label: 'Ready', icon: UserCheck },
  ];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-colors duration-700 ${
      isDarkMode 
        ? 'bg-[#030712] text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-[0.08]' : 'opacity-[0.03]'}`}
          style={{
            backgroundImage: `
              linear-gradient(${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
          }}
        />
        
        {/* Scanline Animation */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1] animate-scanline" 
             style={{
               background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 255, 255, 0.5) 50%)',
               backgroundSize: '100% 4px'
             }} 
        />
        
        {/* Glow Orbs */}
        <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000 animate-pulse-slow ${
          isDarkMode ? 'bg-blue-600/10' : 'bg-blue-400/10'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000 animate-pulse-slow delay-1000 ${
          isDarkMode ? 'bg-purple-600/10' : 'bg-purple-400/10'
        }`} />
      </div>

      {/* Main Card */}
      <div className={`relative z-10 w-full max-w-md p-1 rounded-2xl overflow-hidden transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-white/10 to-transparent shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]' 
          : 'bg-gradient-to-b from-white/80 to-white/40 shadow-2xl shadow-blue-900/5'
      }`}>
        <div className={`relative rounded-xl p-8 backdrop-blur-xl border transition-all duration-500 ${
          isDarkMode 
            ? 'bg-slate-950/80 border-white/10' 
            : 'bg-white/90 border-white/60'
        }`}>
          
          {/* Header Branding */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className={`mb-3 relative group`}>
              <div className={`absolute inset-0 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity ${
                isDarkMode ? 'bg-blue-500' : 'bg-blue-400'
              }`} />
              
              {/* Star Logo */}
              <img 
                src={pythiaLogo} 
                alt="Revere Logo" 
                className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-110"
                style={{
                  filter: isDarkMode 
                    ? 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' 
                    : 'brightness(0) invert(1) drop-shadow(0 0 5px rgba(37, 99, 235, 0.5)) opacity(0.8) sepia(1) hue-rotate(200deg) saturate(5)',
                }}
              />
              
              {/* Pulse Ring */}
              <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
              }`} />
            </div>
            <h1 className={`text-sm font-bold tracking-[0.2em] ${
              isDarkMode ? 'text-white/90' : 'text-gray-900/90'
            }`}>
              PYTHIA
            </h1>
          </div>

          {/* Dynamic Content */}
          <div className="text-center mb-10 min-h-[100px] flex flex-col justify-center">
            <h2 className={`text-xl font-medium mb-2 tracking-tight transition-all duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h2>
            <p className={`text-sm transition-all duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {subtext}
            </p>

            {/* Step 3 Extra Info */}
            {step === 3 && orgName && (
              <div className={`mt-4 pt-4 border-t w-full animate-in fade-in slide-in-from-bottom-2 duration-500 ${
                isDarkMode ? 'border-white/5' : 'border-gray-100'
              }`}>
                <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider opacity-70">
                  <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
                    {userRole || 'Member'}
                  </span>
                  <span className={isDarkMode ? 'text-slate-600' : 'text-slate-300'}>|</span>
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                    {orgName}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="relative flex justify-between items-center w-full px-4">
            {/* Connecting Line */}
            <div className={`absolute top-3 left-4 right-4 h-[1px] -z-10 ${
              isDarkMode ? 'bg-white/10' : 'bg-gray-200'
            }`} />
            
            {/* Progress Fill */}
            <div 
              className={`absolute top-3 left-4 h-[1px] -z-10 transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 to-purple-500`}
              style={{ width: `calc(${(step - 1) / 2 * 100}% - 32px)` }}
            />

            {steps.map((s) => {
              const isActive = s.number === step;
              const isCompleted = s.number < step;
              const Icon = s.icon;

              return (
                <div key={s.number} className="flex flex-col items-center gap-2">
                  <div className={`
                    relative w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500
                    ${isActive 
                      ? (isDarkMode ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-110' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110') 
                      : isCompleted 
                        ? (isDarkMode ? 'bg-slate-800 text-blue-400 border border-blue-500/30' : 'bg-white text-blue-600 border border-blue-200')
                        : (isDarkMode ? 'bg-slate-900 text-slate-600 border border-white/5' : 'bg-gray-100 text-gray-400')
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isActive ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    ) : (
                      <span>{s.number}</span>
                    )}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-medium transition-colors duration-300 ${
                    isActive 
                      ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                      : isCompleted
                        ? (isDarkMode ? 'text-slate-400' : 'text-slate-500')
                        : (isDarkMode ? 'text-slate-700' : 'text-gray-300')
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
