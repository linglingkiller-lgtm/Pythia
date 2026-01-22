import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigation } from './NavigationContext';
import { parseVoiceCommand } from '../utils/voiceCommandParser';
import { toast } from 'sonner';

// Define SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export type VoiceMode = 'command' | 'meeting';

interface VoiceContextType {
  isListening: boolean;
  transcript: string; // Current transient transcript
  meetingTranscript: string; // Accumulated transcript for meetings
  mode: VoiceMode;
  startListening: (mode?: VoiceMode) => void;
  stopListening: () => void;
  isSupported: boolean;
  lastCommand: string | null;
  lastIntent: any | null;
  resetTranscript: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [meetingTranscript, setMeetingTranscript] = useState('');
  const [mode, setMode] = useState<VoiceMode>('command');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [lastIntent, setLastIntent] = useState<any | null>(null); // Using any to avoid circular dependency issues for now, or import type
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { navigateToPage, navigateToLegislator } = useNavigation();

  // Create a ref for the command handler
  const handleCommandRef = useRef<(text: string) => void>(() => {});

  useEffect(() => {
    handleCommandRef.current = (text: string) => {
      console.log("Processing voice command:", text);
      setLastCommand(text);
      const intent = parseVoiceCommand(text);
      setLastIntent(intent);
      
      switch (intent.type) {
        case 'NAVIGATE_PAGE':
          navigateToPage(intent.page as any);
          toast.success(`Navigating to ${intent.page}`);
          break;
        case 'NAVIGATE_LEGISLATOR':
          navigateToPage('Legislators' as any);
          setTimeout(() => {
            navigateToLegislator(intent.legislatorId);
          }, 100);
          toast.success("Found Legislator");
          break;
        case 'FILTER_LEGISLATORS':
          navigateToPage('Legislators' as any, { filters: intent.filters });
          toast.success(`Filtering ${intent.filters.party || ''} ${intent.filters.chamber || ''}`);
          break;
        case 'DRAFT_MESSAGE':
          navigateToPage('Chat' as any, { draftRecipient: intent.recipient });
          toast.info(`Drafting message to ${intent.recipient}...`);
          break;
        case 'CREATE_ALERT':
          navigateToPage('Dashboard' as any, { createAlert: intent.topic });
          toast.success(`Opening Alert Creator for "${intent.topic}"`);
          break;
        case 'UNKNOWN':
          console.log("Unknown command");
          break;
      }
    };
  }, [navigateToPage, navigateToLegislator]);

  const initRecognition = useCallback((currentMode: VoiceMode) => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        
        recognition.continuous = currentMode === 'meeting';
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = '';
          
          if (currentMode === 'meeting') {
             // For meeting mode, we need to handle continuous results
             // We'll update the transient transcript with the latest result
             // And append finalized results to meetingTranscript
             
             let interim = '';
             let final = '';

             for (let i = event.resultIndex; i < event.results.length; ++i) {
               if (event.results[i].isFinal) {
                 final += event.results[i][0].transcript + ' ';
               } else {
                 interim += event.results[i][0].transcript;
               }
             }
             
             if (final) {
               setMeetingTranscript(prev => prev + final);
             }
             setTranscript(interim);
          } else {
             // Command mode
             for (let i = event.resultIndex; i < event.results.length; ++i) {
               currentTranscript += event.results[i][0].transcript;
             }
             setTranscript(currentTranscript);
             
             if (event.results[0].isFinal) {
               handleCommandRef.current(currentTranscript);
               try { recognition.stop(); } catch(e) {}
             }
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech error', event.error);
          if (event.error === 'not-allowed') {
             setIsListening(false);
             // FALLBACK: If microphone is blocked (common in iframes/demos), 
             // we simulate the experience so the user can still test the UI.
             console.log("Microphone blocked. Falling back to simulation mode.");
             toast.error("Microphone access blocked. Using Demo Simulation Mode.");
             
             // Simulate a command flow
             setIsListening(true);
             const mockPhrases = [
                "Summarize the latest bill...",
                "Draft a message to Senator...",
                "What is the status of the whip count?",
                "Remind me to call the Chief of Staff."
             ];
             const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
             
             let charIndex = 0;
             const interval = setInterval(() => {
                charIndex++;
                const currentText = randomPhrase.substring(0, charIndex);
                setTranscript(currentText);
                
                if (charIndex >= randomPhrase.length) {
                   clearInterval(interval);
                   setTimeout(() => {
                     setLastCommand(randomPhrase);
                     handleCommandRef.current(randomPhrase);
                     setIsListening(false);
                   }, 1000);
                }
             }, 50);
             
          } else if (event.error !== 'no-speech') {
             toast.error(`Voice error: ${event.error}`);
             setIsListening(false);
          } else if (currentMode === 'command') {
             setIsListening(false);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startListening = useCallback((targetMode: VoiceMode = 'command') => {
    // If same mode and already listening, do nothing
    if (isListening && mode === targetMode) return;

    // stop any existing recognition first
    if (recognitionRef.current) {
       try { recognitionRef.current.abort(); } catch(e) {}
       recognitionRef.current = null;
    }

    setMode(targetMode);
    
    // Slight delay to ensure previous instance is fully cleared
    setTimeout(() => {
      // Create new instance
      initRecognition(targetMode);

      if (recognitionRef.current) {
        try {
          if (targetMode === 'command') setTranscript('');
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error("Start error:", e);
          setIsListening(false);
          // If actual start fails, we don't want to leave the user hanging
          // but we can't force the browser to listen.
          // We can show a toast.
          if ((e as any)?.message?.includes('not-allowed') || (e as any)?.name === 'NotAllowedError') {
             toast.error("Microphone access blocked. Please check browser permissions.");
          } else {
             toast.error("Could not start voice. Please try again.");
          }
        }
      }
    }, 100);
  }, [isListening, mode, initRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      // Force state update immediately
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setMeetingTranscript('');
    setTranscript('');
  }, []);

  return (
    <VoiceContext.Provider value={{ 
      isListening, 
      transcript,
      meetingTranscript,
      mode,
      startListening, 
      stopListening, 
      isSupported,
      lastCommand,
      lastIntent,
      resetTranscript
    }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    // Fallback for when component is used outside of provider (e.g. isolated previews)
    console.warn('useVoice used outside VoiceProvider. Using fallback mock.');
    return {
      isListening: false,
      transcript: '',
      meetingTranscript: '',
      mode: 'command' as VoiceMode,
      startListening: () => console.warn('Voice not available (no provider)'),
      stopListening: () => {},
      isSupported: false,
      lastCommand: null,
      lastIntent: null,
      resetTranscript: () => {}
    };
  }
  return context;
}
