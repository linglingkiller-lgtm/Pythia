import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockDossiers, LegislatorDossier } from '../../data/dossierData';
import { useTheme } from '../../contexts/ThemeContext';
import { X, ShieldAlert, Download, Share2, Printer, AlertTriangle, Scale, DollarSign, MessageSquare } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  legislatorId: string;
}

export function OppositionDossierModal({ isOpen, onClose, legislatorId }: Props) {
  const { isDarkMode } = useTheme();
  const dossier = mockDossiers[legislatorId] || mockDossiers['leg-009']; // Fallback for demo

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale': return <Scale size={20} />;
      case 'DollarSign': return <DollarSign size={20} />;
      case 'MessageSquare': return <MessageSquare size={20} />;
      default: return <AlertTriangle size={20} />;
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] 
              rounded-xl shadow-2xl overflow-hidden z-[1001] flex flex-col
              ${isDarkMode ? 'bg-slate-900 border border-red-500/30' : 'bg-white border border-red-200'}
            `}
          >
            {/* Header - "Confidential" Style */}
            <div className={`
              p-6 border-b flex items-center justify-between
              ${isDarkMode ? 'bg-red-950/20 border-red-500/20' : 'bg-red-50 border-red-100'}
            `}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    Opposition Research Dossier
                  </h2>
                  <p className="text-xs font-mono text-red-500 uppercase tracking-widest mt-1">
                    Confidential • Internal Use Only
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg hover:bg-black/5 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900'}`}>
                  <Printer size={20} />
                </button>
                <button className={`p-2 rounded-lg hover:bg-black/5 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900'}`}>
                  <Download size={20} />
                </button>
                <button onClick={onClose} className={`p-2 rounded-lg hover:bg-black/5 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900'}`}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="space-y-8">
                {/* Executive Summary */}
                <div className={`p-4 rounded-lg border-l-4 border-red-500 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
                  <h3 className="font-bold text-red-500 mb-2 text-sm uppercase">Vulnerability Assessment</h3>
                  <p className={`text-lg font-medium leading-relaxed ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    Target shows high vulnerability on energy policy due to conflicting donor interests and recent voting record inconsistencies. Primary leverage point: <span className="underline decoration-red-500 decoration-2">Western Mining Corp contributions vs. District 16 polling data.</span>
                  </p>
                </div>

                {/* Sections */}
                {dossier.sections.map((section, idx) => (
                  <div key={idx} className={`pb-6 border-b last:border-0 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`p-1.5 rounded ${isDarkMode ? 'bg-slate-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                        {getIcon(section.icon)}
                      </div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {section.title}
                      </h3>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded uppercase font-bold ${
                        section.riskLevel === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {section.riskLevel} Risk
                      </span>
                    </div>
                    
                    <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert text-gray-300' : ''}`}>
                      <div dangerouslySetInnerHTML={{ 
                        __html: section.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') 
                      }} />
                    </div>

                    <div className="flex gap-2 mt-4">
                      {section.tags.map(tag => (
                        <span key={tag} className={`text-xs px-2 py-1 rounded border ${isDarkMode ? 'border-white/10 bg-slate-800 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t text-center ${isDarkMode ? 'bg-slate-950 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-xs font-mono opacity-50">
                Generated by Pythia Intelligence Engine • {dossier.generatedAt} • ID: {dossier.legislatorId.toUpperCase()}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
