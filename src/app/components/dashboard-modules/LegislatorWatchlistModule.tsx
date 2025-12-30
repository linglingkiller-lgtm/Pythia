import React from 'react';
import { Eye, Phone, Mail, Building2, ChevronRight, Bell, FileText, Newspaper, Activity } from 'lucide-react';
import { DashboardModule } from '../../contexts/DashboardContext';
import { mockLegislators } from '../legislators/legislatorData';
import { useTheme } from '../../contexts/ThemeContext';

interface LegislatorWatchlistModuleProps {
  module: DashboardModule;
  watchedLegislatorIds: Set<string>;
  onNavigateToLegislator: (id: string) => void;
}

// Helper function to check for new activity in the last 7 days
function hasRecentActivity(legislator: any) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  // Check recent bills (both sponsored and relevant bills)
  const allBills = [...(legislator.sponsoredBills || []), ...(legislator.relevantBills || [])];
  const recentBills = allBills.filter((bill: any) => {
    if (!bill.nextActionDate) return false;
    try {
      const billDate = new Date(bill.nextActionDate);
      return billDate > sevenDaysAgo;
    } catch {
      return false;
    }
  });
  
  // Check media mentions
  const recentMedia = (legislator.mediaMentions || []).filter((mention: any) => {
    try {
      const mentionDate = new Date(mention.timestamp);
      return mentionDate > sevenDaysAgo;
    } catch {
      return false;
    }
  });
  
  return {
    hasNewBills: recentBills.length > 0,
    newBillsCount: recentBills.length,
    hasNewMedia: recentMedia.length > 0,
    newMediaCount: recentMedia.length,
    hasAnyActivity: recentBills.length > 0 || recentMedia.length > 0,
    totalNewActivities: recentBills.length + recentMedia.length
  };
}

export function LegislatorWatchlistModule({ module, watchedLegislatorIds, onNavigateToLegislator }: LegislatorWatchlistModuleProps) {
  const { isDarkMode } = useTheme();
  const watchedLegislators = mockLegislators.filter(leg => watchedLegislatorIds.has(leg.id));

  // Debug logging
  console.log('LegislatorWatchlistModule - Watched IDs:', Array.from(watchedLegislatorIds));
  console.log('LegislatorWatchlistModule - Watched Legislators:', watchedLegislators.length);
  if (watchedLegislators.length > 0) {
    watchedLegislators.forEach(leg => {
      const activity = hasRecentActivity(leg);
      console.log(`${leg.name} activity:`, activity);
    });
  }

  if (watchedLegislators.length === 0) {
    return (
      <div className="text-center py-8">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3
          ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}
        `}>
          <Eye className={`w-6 h-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          No legislators watched
        </p>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Go to Legislators page and click the "Watch" button to track key contacts
        </p>
        <button
          onClick={() => onNavigateToLegislator('')}
          className={`
            mt-3 px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300
            ${isDarkMode
              ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/30'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
            }
          `}
        >
          Browse Legislators
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className={`
          text-xs font-bold uppercase tracking-wide mb-3
          ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}
        `}>
          Watched Legislators ({watchedLegislators.length})
        </h4>
        <div className="space-y-3">
          {watchedLegislators.slice(0, 5).map(legislator => {
            const activity = hasRecentActivity(legislator);
            return (
              <div
                key={legislator.id}
                className={`
                  border rounded-lg p-3 transition-all cursor-pointer duration-300
                  ${isDarkMode
                    ? 'border-slate-700 hover:border-purple-500/50 hover:bg-slate-700/50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                onClick={() => onNavigateToLegislator(legislator.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {legislator.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {legislator.name}
                      </h5>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        legislator.party === 'D'
                          ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                          : legislator.party === 'R'
                          ? isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                          : isDarkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {legislator.party}
                      </span>
                      
                      {/* New Activity Badge */}
                      {activity.hasAnyActivity && (
                        <div className="relative flex items-center">
                          <div className={`
                            flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse
                            ${isDarkMode 
                              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30' 
                              : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-300'
                            }
                          `}>
                            <Bell className="w-3 h-3" />
                            <span>{activity.totalNewActivities}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Building2 className="w-3 h-3" />
                      <span>{legislator.chamber} - {legislator.district}</span>
                    </div>
                    {legislator.committees && legislator.committees.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {legislator.committees.slice(0, 2).map((committee, idx) => (
                          <span 
                            key={idx} 
                            className={`
                              text-xs px-1.5 py-0.5 rounded
                              ${isDarkMode 
                                ? 'bg-slate-700 text-gray-400' 
                                : 'bg-gray-100 text-gray-600'
                              }
                            `}
                          >
                            {committee.name}
                          </span>
                        ))}
                        {legislator.committees.length > 2 && (
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            +{legislator.committees.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Contact Info */}
                <div className={`
                  mt-2 pt-2 border-t flex items-center gap-3 text-xs
                  ${isDarkMode 
                    ? 'border-white/5 text-gray-500' 
                    : 'border-gray-100 text-gray-500'
                  }
                `}>
                  {legislator.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{legislator.email}</span>
                    </div>
                  )}
                  {legislator.officePhone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{legislator.officePhone}</span>
                    </div>
                  )}
                </div>

                {/* Recent Activity Indicator */}
                {activity.hasAnyActivity && (
                  <div className={`
                    mt-2 pt-2 flex items-center flex-wrap gap-2 text-xs border-t
                    ${isDarkMode ? 'border-white/5' : 'border-gray-100'}
                  `}>
                    {activity.hasNewBills && (
                      <div className={`
                        flex items-center gap-1 px-2 py-1 rounded-full
                        ${isDarkMode 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }
                      `}>
                        <FileText className="w-3 h-3" />
                        <span className="font-semibold">{activity.newBillsCount}</span>
                        <span>new {activity.newBillsCount > 1 ? 'bills' : 'bill'}</span>
                      </div>
                    )}
                    {activity.hasNewMedia && (
                      <div className={`
                        flex items-center gap-1 px-2 py-1 rounded-full
                        ${isDarkMode 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }
                      `}>
                        <Newspaper className="w-3 h-3" />
                        <span className="font-semibold">{activity.newMediaCount}</span>
                        <span>media {activity.newMediaCount > 1 ? 'mentions' : 'mention'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {watchedLegislators.length > 5 && (
          <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            +{watchedLegislators.length - 5} more legislators
          </p>
        )}
      </div>

      {/* Footer */}
      <div className={`border-t pt-4 flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button
          onClick={() => onNavigateToLegislator('')}
          className={`
            text-sm font-medium flex items-center gap-1 transition-colors
            ${isDarkMode 
              ? 'text-purple-400 hover:text-purple-300' 
              : 'text-purple-600 hover:text-purple-700'
            }
          `}
        >
          View All Legislators
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNavigateToLegislator('')}
          className={`
            px-3 py-1.5 text-sm border rounded-lg font-medium transition-colors
            ${isDarkMode 
              ? 'border-slate-600 hover:bg-slate-700 text-gray-300' 
              : 'border-gray-300 hover:bg-gray-50 text-gray-900'
            }
          `}
        >
          Log Interaction
        </button>
      </div>
    </div>
  );
}