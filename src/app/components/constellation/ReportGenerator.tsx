import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, FileText, Mail, Eye, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import type { NetworkNode, NetworkEdge, NetworkMetrics } from '@/app/data/constellationData';
import { toast } from 'sonner';

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  networkData: {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
    metrics: NetworkMetrics;
  };
  selectedNode: NetworkNode | null;
  isDarkMode: boolean;
}

export function ReportGenerator({
  isOpen,
  onClose,
  networkData,
  selectedNode,
  isDarkMode
}: ReportGeneratorProps) {
  const [template, setTemplate] = useState<'executive' | 'deep' | 'dashboard' | 'coalition'>('executive');
  const [clientName, setClientName] = useState('Desert Solar Coalition');
  const [includeSections, setIncludeSections] = useState({
    overview: true,
    topRelationships: true,
    pathAnalysis: true,
    recommendations: true,
    oppositionResearch: false,
    historicalTimeline: false
  });
  const [brandColor, setBrandColor] = useState('#7c3aed');
  const [includeLogo, setIncludeLogo] = useState(true);
  const [whiteLabel, setWhiteLabel] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = (action: 'download' | 'email' | 'preview') => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      
      if (action === 'download') {
        toast.success('Report generated successfully!', {
          description: `${clientName}_Stakeholder_Report.pdf downloaded`
        });
      } else if (action === 'email') {
        toast.success('Report emailed!', {
          description: `Sent to client contact for ${clientName}`
        });
      } else {
        toast.success('Preview ready!', {
          description: 'Opening report preview...'
        });
      }
      
      onClose();
    }, 2000);
  };
  
  const toggleSection = (key: keyof typeof includeSections) => {
    setIncludeSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  if (!isOpen) return null;
  
  const templates = [
    {
      id: 'executive',
      name: 'Executive Brief',
      description: '2-4 pages, high-level overview',
      icon: FileText,
      estimatedPages: '2-4 pages'
    },
    {
      id: 'deep',
      name: 'Deep Analysis',
      description: '10-20 pages, comprehensive audit',
      icon: FileText,
      estimatedPages: '10-20 pages'
    },
    {
      id: 'dashboard',
      name: 'Live Dashboard',
      description: 'Interactive web export',
      icon: ImageIcon,
      estimatedPages: 'Web link'
    },
    {
      id: 'coalition',
      name: 'Coalition Report',
      description: '5-8 pages, partnership focus',
      icon: FileText,
      estimatedPages: '5-8 pages'
    }
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Generate Stakeholder Report
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Create professional client-ready documents
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              }`}
            >
              <X size={20} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Template Selection */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Report Template
              </label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplate(tmpl.id as any)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      template === tmpl.id
                        ? 'border-green-600 bg-green-600/10'
                        : isDarkMode
                          ? 'border-slate-700 hover:border-slate-600'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <tmpl.icon size={20} className={template === tmpl.id ? 'text-green-600' : isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                      <div className="flex-1">
                        <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {tmpl.name}
                        </div>
                        <div className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {tmpl.description}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                          {tmpl.estimatedPages}
                        </div>
                      </div>
                      {template === tmpl.id && (
                        <CheckCircle2 size={20} className="text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Client Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Client
              </label>
              <select
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option>Desert Solar Coalition</option>
                <option>Arizona Tech Alliance</option>
                <option>All Clients (Multi-client Report)</option>
              </select>
            </div>
            
            {/* Sections to Include */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Sections to Include
              </label>
              <div className="space-y-2">
                {Object.entries(includeSections).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleSection(key as keyof typeof includeSections)}
                      className="w-4 h-4 rounded"
                    />
                    <span className={`text-sm ${
                      isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Customization */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Customization
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="flex-1 text-sm">
                    <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                      Brand Color
                    </span>
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="ml-3 w-12 h-8 rounded cursor-pointer"
                    />
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLogo}
                      onChange={(e) => setIncludeLogo(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      Include Logo
                    </span>
                  </label>
                </div>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whiteLabel}
                    onChange={(e) => setWhiteLabel(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    White-label (remove Revere branding)
                  </span>
                </label>
              </div>
            </div>
            
            {/* Preview Stats */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {networkData.nodes.length}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Network Entities
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {networkData.metrics.totalConnections}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Relationships
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {networkData.metrics.healthScore}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Health Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode 
                ? 'hover:bg-slate-700 text-slate-300' 
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGenerate('preview')}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <Eye size={16} />
              Preview
            </button>
            
            <button
              onClick={() => handleGenerate('email')}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Mail size={16} />
              Email
            </button>
            
            <button
              onClick={() => handleGenerate('download')}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}