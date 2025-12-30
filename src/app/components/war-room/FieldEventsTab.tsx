import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, FileText, Plus, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { campaignEvents, fieldShifts } from '../../data/campaignData';
import { useTheme } from '../../contexts/ThemeContext';

interface FieldEventsTabProps {
  searchQuery: string;
  filters: any;
}

export const FieldEventsTab: React.FC<FieldEventsTabProps> = ({ searchQuery, filters }) => {
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<'events' | 'shifts' | 'performance'>('events');

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'high': 
        return isDarkMode 
          ? 'bg-red-900/30 text-red-200 border-red-800' 
          : 'bg-red-100 text-red-700 border-red-200';
      case 'medium': 
        return isDarkMode 
          ? 'bg-yellow-900/30 text-yellow-200 border-yellow-800' 
          : 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: 
        return isDarkMode 
          ? 'bg-slate-800 text-gray-300 border-slate-700' 
          : 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMaterialsStatusColor = (status: string) => {
    switch (status) {
      case 'ready': 
        return isDarkMode 
          ? 'bg-green-900/30 text-green-300' 
          : 'bg-green-100 text-green-700';
      case 'pending': 
        return isDarkMode 
          ? 'bg-yellow-900/30 text-yellow-300' 
          : 'bg-yellow-100 text-yellow-700';
      default: 
        return isDarkMode 
          ? 'bg-slate-800 text-gray-400' 
          : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant={viewMode === 'events' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setViewMode('events')}
        >
          <CalendarIcon size={16} />
          Event Radar
        </Button>
        <Button 
          variant={viewMode === 'shifts' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setViewMode('shifts')}
        >
          <Users size={16} />
          Field Schedule
        </Button>
        <Button 
          variant={viewMode === 'performance' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setViewMode('performance')}
        >
          <TrendingUp size={16} />
          Performance
        </Button>
      </div>

      {/* Event Radar */}
      {viewMode === 'events' && (
        <div>
          <div className="mb-6">
            <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Event Radar</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Strategic events ranked by Pythia relevance and influence</p>
          </div>

          <div className="space-y-3">
            {campaignEvents.map((event) => (
              <div 
                key={event.id} 
                className={`
                  rounded-lg border p-5 transition-shadow
                  ${isDarkMode 
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/80' 
                    : 'bg-white border-gray-200 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-start gap-6">
                  {/* Left: Event details */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                        <div className={`flex items-center gap-3 text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <CalendarIcon size={14} />
                            <span>{new Date(event.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                          </div>
                          <span>•</span>
                          <span className="capitalize">{event.type.replace('-', ' ')}</span>
                        </div>
                        <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event.districtName}</p>
                      </div>
                    </div>

                    {/* Pythia scoring */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Pythia Score</span>
                        <span className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{event.aiScore}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getRelevanceColor(event.relevance)}`}>
                        {event.relevance.toUpperCase()} relevance
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Influence:</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-24 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                            <div 
                              className={`h-full rounded-full ${isDarkMode ? 'bg-purple-500' : 'bg-purple-600'}`}
                              style={{ width: `${event.expectedInfluence}%` }}
                            />
                          </div>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{event.expectedInfluence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommended objective */}
                    <div className={`rounded-md p-3 mb-3 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>RECOMMENDED OBJECTIVE</p>
                      <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>{event.recommendedObjective}</p>
                    </div>

                    {/* Assigned staff */}
                    {event.assignedStaffIds.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={14} className="text-gray-400" />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Assigned:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{event.assignedStaffIds.length} staff member(s)</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="default" size="sm">
                      <FileText size={14} />
                      Create Brief
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Users size={14} />
                      Assign Staff
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Plus size={14} />
                      Add Follow-up
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Field Schedule */}
      {viewMode === 'shifts' && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Field Schedule</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upcoming canvass shifts and phone banks</p>
            </div>
            <Button variant="default" size="sm">
              <Plus size={16} />
              Schedule Shift
            </Button>
          </div>

          <div className="space-y-3">
            {fieldShifts.map((shift) => (
              <div 
                key={shift.id} 
                className={`
                  rounded-lg border p-5
                  ${isDarkMode 
                    ? 'bg-slate-900 border-slate-800' 
                    : 'bg-white border-gray-200'
                  }
                `}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.projectName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getMaterialsStatusColor(shift.materialsStatus)}`}>
                        Materials {shift.materialsStatus}
                      </span>
                    </div>

                    <div className={`flex items-center gap-4 text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-1">
                        <CalendarIcon size={14} />
                        <span>{new Date(shift.dateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{shift.turfName}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>Lead: {shift.leadName}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-blue-300' : 'text-gray-600'}`}>Goal: Doors</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.goalMetrics.doors}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-green-300' : 'text-gray-600'}`}>Goal: Contacts</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.goalMetrics.contacts}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>Roster</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.roster.length} volunteers</p>
                      </div>
                    </div>

                    {shift.actualResults && (
                      <div className={`border-t pt-3 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Actual Results</p>
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Doors: </span>
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.actualResults.doorsKnocked}</span>
                            <span className={`ml-1 text-xs ${
                              shift.actualResults.doorsKnocked >= shift.goalMetrics.doors 
                                ? isDarkMode ? 'text-green-400' : 'text-green-600' 
                                : isDarkMode ? 'text-orange-400' : 'text-orange-600'
                            }`}>
                              ({Math.round((shift.actualResults.doorsKnocked / shift.goalMetrics.doors) * 100)}%)
                            </span>
                          </div>
                          <div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Conversations: </span>
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.actualResults.conversations}</span>
                          </div>
                          <div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Persuasion IDs: </span>
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.actualResults.persuasionIds}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" size="sm">Edit Shift</Button>
                    {shift.actualResults ? (
                      <Button variant="ghost" size="sm">
                        <CheckCircle size={14} />
                        View Report
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <FileText size={14} />
                        Enter Results
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Dashboard */}
      {viewMode === 'performance' && (
        <div>
          <div className="mb-6">
            <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Field Performance Dashboard</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weekly performance metrics and Pythia insights</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className={`rounded-lg border p-5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                  <TrendingUp size={24} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Doors</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1,425</p>
                </div>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className={isDarkMode ? 'text-green-400 font-medium' : 'text-green-600 font-medium'}>+12%</span> vs last week
              </div>
            </div>

            <div className={`rounded-lg border p-5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                  <Users size={24} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Conversations</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>652</p>
                </div>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className={isDarkMode ? 'text-green-400 font-medium' : 'text-green-600 font-medium'}>46%</span> contact rate
              </div>
            </div>

            <div className={`rounded-lg border p-5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                  <CheckCircle size={24} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Persuasion IDs</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>28</p>
                </div>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className={isDarkMode ? 'text-blue-400 font-medium' : 'text-blue-600 font-medium'}>4.3%</span> persuasion rate
              </div>
            </div>
          </div>

          {/* Pythia Insights */}
          <div className={`
            rounded-lg border p-5 mb-6
            ${isDarkMode 
              ? 'bg-gradient-to-br from-blue-900/10 to-indigo-900/10 border-blue-800' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
            }
          `}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pythia Field Insights</h3>
            </div>

            <div className="space-y-3">
              <div className={`
                rounded-md p-4 border
                ${isDarkMode 
                  ? 'bg-slate-900 border-slate-700' 
                  : 'bg-white border-blue-200'
                }
              `}>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-full bg-orange-500 rounded-full" />
                  <div className="flex-1">
                    <p className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Turf North Precinct 12 underperforming vs expected</p>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Contact rate 15% below district average. Consider reassigning volunteers or adjusting shift times.</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-orange-900/30 text-orange-200' : 'bg-orange-100 text-orange-700'}`}>Medium Confidence</span>
                  </div>
                </div>
              </div>

              <div className={`
                rounded-md p-4 border
                ${isDarkMode 
                  ? 'bg-slate-900 border-slate-700' 
                  : 'bg-white border-blue-200'
                }
              `}>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-full bg-red-500 rounded-full" />
                  <div className="flex-1">
                    <p className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shift staffing shortfall Friday evening</p>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Only 2 volunteers committed for 200-door goal. Recommend recruiting 3 more or reducing turf size.</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-700'}`}>High Confidence</span>
                  </div>
                </div>
              </div>

              <div className={`
                rounded-md p-4 border
                ${isDarkMode 
                  ? 'bg-slate-900 border-slate-700' 
                  : 'bg-white border-blue-200'
                }
              `}>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-full bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>High-performing script detected</p>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>South Precinct script achieving 58% contact rate vs 46% average. Recommend expanding to other turfs.</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-700'}`}>High Confidence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance by shift */}
          <div className={`
            rounded-lg border p-5
            ${isDarkMode 
              ? 'bg-slate-900 border-slate-800' 
              : 'bg-white border-gray-200'
            }
          `}>
            <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance by Shift</h3>
            <div className="space-y-3">
              {fieldShifts.filter(s => s.actualResults).map((shift) => (
                <div key={shift.id} className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.turfName}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(shift.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Doors: </span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.actualResults!.doorsKnocked}</span>
                    </div>
                    <div className="text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Contact Rate: </span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {Math.round((shift.actualResults!.conversations / shift.actualResults!.doorsKnocked) * 100)}%
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Persuasion: </span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.actualResults!.persuasionIds}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
