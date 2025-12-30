import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, CheckCircle, AlertCircle, Clock, Shield, GraduationCap } from 'lucide-react';
import { Button } from '../ui/button';
import { applicants } from '../../data/campaignData';
import type { Applicant } from '../../data/campaignData';
import { useTheme } from '../../contexts/ThemeContext';

interface ApplicantsTabProps {
  searchQuery: string;
  filters: any;
}

export const ApplicantsTab: React.FC<ApplicantsTabProps> = ({ searchQuery, filters }) => {
  const { isDarkMode } = useTheme();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const stages = [
    'new',
    'contacted',
    'interview-scheduled',
    'interviewed',
    'offer-sent',
    'accepted',
    'background-check',
    'cleared',
    'training-scheduled',
    'onboarded',
    'rejected'
  ] as const;

  const getApplicantsByStage = (stage: typeof stages[number]) => {
    return applicants.filter(a => a.stage === stage);
  };

  const getBackgroundCheckStatusColor = (status: string) => {
    switch (status) {
      case 'cleared': 
        return isDarkMode 
          ? 'bg-green-900/30 text-green-300 border-green-800' 
          : 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': 
        return isDarkMode 
          ? 'bg-blue-900/30 text-blue-300 border-blue-800' 
          : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'review-needed': 
        return isDarkMode 
          ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800' 
          : 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'not-eligible': 
        return isDarkMode 
          ? 'bg-red-900/30 text-red-300 border-red-800' 
          : 'bg-red-100 text-red-700 border-red-200';
      default: 
        return isDarkMode 
          ? 'bg-slate-800 text-gray-300 border-slate-700' 
          : 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'referral': return '👥';
      case 'ad': return '📱';
      case 'event': return '🎉';
      case 'website': return '🌐';
      default: return '📋';
    }
  };

  const ApplicantCard: React.FC<{ applicant: Applicant }> = ({ applicant }) => (
    <div 
      className={`
        rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer
        ${isDarkMode 
          ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' 
          : 'bg-white border-gray-200'
        }
      `}
      onClick={() => setSelectedApplicant(applicant)}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-blue-400 to-indigo-500'}`}>
          {applicant.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <h4 className={`mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{applicant.name}</h4>
          <div className={`flex items-center gap-2 text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{applicant.projectId}</span>
          </div>
        </div>
      </div>

      <div className={`space-y-2 mb-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className="flex items-center gap-2">
          <Mail size={12} />
          <span className="truncate">{applicant.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={12} />
          <span>{applicant.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={12} />
          <span>Applied {new Date(applicant.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="mb-3">
        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>MANAGER</p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{applicant.assignedRecruiterName}</p>
      </div>

      {/* Background check status - only shown for certain stages */}
      {['background-check', 'cleared', 'training-scheduled', 'onboarded'].includes(applicant.stage) && (
        <div className="mb-3">
          <p className={`text-xs mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Shield size={10} />
            BACKGROUND CHECK
          </p>
          <span className={`text-xs px-2 py-1 rounded-md border ${getBackgroundCheckStatusColor(applicant.backgroundCheckStatus)}`}>
            {applicant.backgroundCheckStatus.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        </div>
      )}

      {applicant.nextStep && (
        <div className={`p-2 rounded-md border ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>{applicant.nextStep}</p>
          {applicant.nextStepDate && (
            <p className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
              {new Date(applicant.nextStepDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Applicants & Onboarding Pipeline</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Canvasser recruitment and training tracker</p>
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[
          { stages: ['new', 'contacted', 'interview-scheduled'], title: 'Early Stage', color: 'gray' },
          { stages: ['interviewed', 'offer-sent', 'accepted'], title: 'Hiring', color: 'blue' },
          { stages: ['background-check', 'cleared'], title: 'Background Check', color: 'purple' },
          { stages: ['training-scheduled', 'onboarded'], title: 'Training & Active', color: 'green' },
          { stages: ['rejected'], title: 'Not Moving Forward', color: 'red' }
        ].map((group) => {
          const groupApplicants = group.stages.flatMap(stage => getApplicantsByStage(stage));
          
          return (
            <div key={group.title} className="flex-shrink-0 w-80">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>{group.title}</h3>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    {groupApplicants.length}
                  </span>
                </div>
              </div>
              
              <div className={`space-y-3 rounded-lg p-3 min-h-[500px] ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                {group.stages.map(stage => {
                  const stageApplicants = getApplicantsByStage(stage);
                  
                  if (stageApplicants.length === 0) return null;
                  
                  return (
                    <div key={stage}>
                      <div className={`text-xs font-semibold uppercase mb-2 px-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {stage.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ({stageApplicants.length})
                      </div>
                      {stageApplicants.map(applicant => (
                        <div key={applicant.id} className="mb-2">
                          <ApplicantCard applicant={applicant} />
                        </div>
                      ))}
                    </div>
                  );
                })}
                
                {groupApplicants.length === 0 && (
                  <div className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    No applicants
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className={`rounded-lg border p-5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <User size={24} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Applicants</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{applicants.length}</p>
            </div>
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} font-medium`}>
              {applicants.filter(a => ['cleared', 'training-scheduled', 'onboarded'].includes(a.stage)).length}
            </span> moving to training
          </div>
        </div>

        <div className={`rounded-lg border p-5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
              <Shield size={24} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Background Checks</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {applicants.filter(a => a.backgroundCheckStatus === 'in-progress').length}
              </p>
            </div>
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>in progress</div>
        </div>

        <div className={`rounded-lg border p-5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <CheckCircle size={24} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fully Onboarded</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {applicants.filter(a => a.stage === 'onboarded').length}
              </p>
            </div>
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ready for field</div>
        </div>
      </div>

      {/* Pythia Recommendation */}
      <div className={`
        mt-6 rounded-lg border p-5
        ${isDarkMode 
          ? 'bg-gradient-to-br from-blue-900/10 to-indigo-900/10 border-blue-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
        }
      `}>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
          <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Pythia Insight</h3>
        </div>
        <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Your bottleneck is interviews—only 60% of contacted applicants are being scheduled. 
          Add 1 more interview time block weekly to improve flow to background checks.
        </p>
        <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>Medium Confidence</span>
      </div>

      {/* Applicant Detail Drawer */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedApplicant(null)} />
          
          <div className={`relative w-[600px] h-full shadow-2xl flex flex-col ${isDarkMode ? 'bg-slate-900 border-l border-slate-800' : 'bg-white'}`}>
            <div className={`border-b p-6 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-blue-400 to-indigo-500'}`}>
                    {selectedApplicant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className={`mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApplicant.name}</h2>
                    <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedApplicant.stage.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedApplicant(null)}>×</Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{selectedApplicant.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{selectedApplicant.phone}</span>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Application Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Source</p>
                    <p className={`text-sm font-medium capitalize ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {getSourceIcon(selectedApplicant.source)} {selectedApplicant.source}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Applied Date</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {new Date(selectedApplicant.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Assigned Manager</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{selectedApplicant.assignedRecruiterName}</p>
                  </div>
                </div>
              </div>

              {/* Background Check - RESTRICTED ACCESS */}
              {['background-check', 'cleared', 'training-scheduled', 'onboarded'].includes(selectedApplicant.stage) && (
                <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-purple-900/10 border-purple-800' : 'bg-purple-50 border-purple-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={18} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                    <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Background Check Status</h3>
                  </div>
                  <div className="mb-3">
                    <span className={`text-sm px-3 py-1.5 rounded-md border font-medium ${getBackgroundCheckStatusColor(selectedApplicant.backgroundCheckStatus)}`}>
                      {selectedApplicant.backgroundCheckStatus.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </div>
                  <p className={`text-xs italic ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                    ⚠️ Restricted: Status only. No criminal details stored or displayed per compliance policy.
                  </p>
                </div>
              )}

              {/* Training Status */}
              {['cleared', 'training-scheduled', 'onboarded'].includes(selectedApplicant.stage) && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                    <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Training Checklist</h3>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(selectedApplicant.trainingStatus).map(([key, completed]) => (
                      <div key={key} className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                          completed ? 'bg-green-500' : (isDarkMode ? 'bg-slate-600' : 'bg-gray-300')
                        }`}>
                          {completed && <CheckCircle size={14} className="text-white" />}
                        </div>
                        <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notes</h3>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedApplicant.notes}</p>
                </div>
              </div>

              {/* Next Step */}
              {selectedApplicant.nextStep && (
                <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                  <p className={`text-xs font-semibold uppercase mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Next Step</p>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>{selectedApplicant.nextStep}</p>
                  {selectedApplicant.nextStepDate && (
                    <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      Due: {new Date(selectedApplicant.nextStepDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className={`border-t p-6 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
              <div className="flex gap-2">
                <Button variant="default" className="flex-1">Update Status</Button>
                <Button variant="secondary" className="flex-1">Add Note</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};