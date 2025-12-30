import React, { useState } from 'react';
import { X, Sparkles, Calendar, MapPin, Users, Target, TrendingUp, Clock, CheckCircle2, Loader2, DollarSign, Send } from 'lucide-react';
import { Button } from '../ui/button';

interface GenerateWeeklyPlanModalProps {
  onClose: () => void;
  onGenerate: (planData: any) => void;
}

export const GenerateWeeklyPlanModal: React.FC<GenerateWeeklyPlanModalProps> = ({ onClose, onGenerate }) => {
  const [step, setStep] = useState<'config' | 'generating' | 'review'>('config');
  const [configData, setConfigData] = useState({
    weekOf: '',
    districts: [] as string[],
    priority: 'balanced',
    goals: {
      doorsPerDay: 2500,
      canvassersNeeded: 85,
      hoursPerDay: 8,
    },
    compensation: {
      basePayPerHour: 18,
      bonusIncentives: 0,
      bonusType: 'per-door' as 'per-door' | 'per-shift' | 'daily-bonus',
    },
    constraints: {
      weather: true,
      availability: true,
      resources: true,
    },
  });

  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const availableDistricts = [
    'CA-45', 'NJ-11', 'VA-24', 'PA-18', 'GA-34',
    'TX-32', 'FL-27', 'MI-08', 'AZ-06', 'NC-13'
  ];

  const handleGenerate = async () => {
    setStep('generating');
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Calculate budget
    const totalHours = configData.goals.canvassersNeeded * configData.goals.hoursPerDay * 7;
    const baseLabor = totalHours * configData.compensation.basePayPerHour;
    
    // Calculate number of shifts based on hours per day (assuming 4-hour shifts)
    const shiftsPerDay = Math.ceil(configData.goals.hoursPerDay / 4);
    
    let bonusCost = 0;
    if (configData.compensation.bonusIncentives > 0) {
      if (configData.compensation.bonusType === 'per-door') {
        bonusCost = (configData.goals.doorsPerDay * 7) * configData.compensation.bonusIncentives;
      } else if (configData.compensation.bonusType === 'per-shift') {
        bonusCost = (shiftsPerDay * 7) * configData.goals.canvassersNeeded * configData.compensation.bonusIncentives;
      } else if (configData.compensation.bonusType === 'daily-bonus') {
        bonusCost = 7 * configData.goals.canvassersNeeded * configData.compensation.bonusIncentives;
      }
    }
    
    const totalBudget = baseLabor + bonusCost;
    
    const plan = {
      weekOf: configData.weekOf,
      districts: configData.districts,
      configData: configData,
      overview: {
        totalDoors: configData.goals.doorsPerDay * 7,
        totalCanvassers: configData.goals.canvassersNeeded,
        totalHours: totalHours,
        estimatedContacts: Math.round(configData.goals.doorsPerDay * 7 * 0.45),
      },
      budget: {
        baseLabor,
        bonusCost,
        totalBudget,
        breakdown: {
          hoursPerWeek: totalHours,
          basePayRate: configData.compensation.basePayPerHour,
          bonusAmount: configData.compensation.bonusIncentives,
          bonusType: configData.compensation.bonusType,
        },
      },
      dailyPlans: generateDailyPlans(configData),
      resourceAllocation: generateResourceAllocation(configData),
      riskFactors: generateRiskFactors(configData),
      recommendations: generateRecommendations(configData),
    };

    setGeneratedPlan(plan);
    setStep('review');
  };

  const generateDailyPlans = (config: any) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map((day, idx) => ({
      day,
      date: new Date(new Date(config.weekOf).getTime() + idx * 24 * 60 * 60 * 1000).toLocaleDateString(),
      shifts: [
        { time: '9:00 AM - 12:00 PM', volunteers: Math.floor(config.goals.canvassersNeeded * 0.25), doors: Math.floor(config.goals.doorsPerDay * 0.25) },
        { time: '12:00 PM - 3:00 PM', volunteers: Math.floor(config.goals.canvassersNeeded * 0.25), doors: Math.floor(config.goals.doorsPerDay * 0.25) },
        { time: '3:00 PM - 6:00 PM', volunteers: Math.floor(config.goals.canvassersNeeded * 0.3), doors: Math.floor(config.goals.doorsPerDay * 0.3) },
        { time: '6:00 PM - 8:00 PM', volunteers: Math.floor(config.goals.canvassersNeeded * 0.2), doors: Math.floor(config.goals.doorsPerDay * 0.2) },
      ],
      districts: config.districts.slice(0, 3),
      priority: idx >= 5 ? 'high' : 'medium',
    }));
  };

  const generateResourceAllocation = (config: any) => {
    return config.districts.map((district: string) => ({
      district,
      volunteers: Math.floor(config.goals.canvassersNeeded / config.districts.length),
      doors: Math.floor(config.goals.doorsPerDay / config.districts.length),
      materials: ['Walk packets', 'Turf maps', 'Scripts'],
      staging: `${district} Field Office`,
    }));
  };

  const generateRiskFactors = (config: any) => {
    const risks = [];
    if (config.districts.length > 5) {
      risks.push({ type: 'Resource Spread', severity: 'medium', message: 'High number of districts may spread resources thin' });
    }
    if (config.goals.doorsPerDay > 3000) {
      risks.push({ type: 'Ambitious Goals', severity: 'medium', message: 'Door goals are above historical average' });
    }
    if (!config.constraints.weather) {
      risks.push({ type: 'Weather Risk', severity: 'low', message: 'Weather constraints not enabled' });
    }
    return risks;
  };

  const generateRecommendations = (config: any) => {
    const recommendations = [];
    
    // Weekend strategy
    recommendations.push('Focus Saturday/Sunday efforts on high-priority districts with best historical contact rates');
    
    // Training based on team size
    if (config.goals.canvassersNeeded > 50) {
      recommendations.push('Schedule canvasser training sessions on Monday and Wednesday evenings to ensure consistent messaging');
    } else {
      recommendations.push('Conduct canvasser training session on Monday morning before first shifts begin');
    }
    
    // Materials distribution
    recommendations.push('Coordinate with district managers to pre-distribute walk packets and literature by Friday evening to avoid delays');
    
    // Weather considerations
    const weatherDays = [
      { day: 'Tuesday', chance: 35 },
      { day: 'Thursday', chance: 60 },
      { day: 'Saturday', chance: 25 }
    ];
    const highRainDay = weatherDays.find(d => d.chance >= 50);
    if (highRainDay) {
      recommendations.push(`${highRainDay.chance}% chance of rain on ${highRainDay.day} - consider shifting canvassers to phone banking or postponing non-priority turf`);
    } else {
      const moderateRainDay = weatherDays.find(d => d.chance >= 30);
      if (moderateRainDay) {
        recommendations.push(`${moderateRainDay.chance}% chance of rain on ${moderateRainDay.day} - have backup indoor activities ready if weather deteriorates`);
      }
    }
    
    // Bonus-related recommendations
    if (config.compensation.bonusIncentives > 0) {
      if (config.compensation.bonusType === 'per-door') {
        recommendations.push(`Per-door bonus of $${config.compensation.bonusIncentives} should motivate high throughput - monitor quality metrics to ensure conversations remain substantive`);
      } else if (config.compensation.bonusType === 'per-shift') {
        recommendations.push(`Per-shift bonuses will incentivize attendance - consider attendance tracking system for accurate bonus distribution`);
      } else {
        recommendations.push(`Daily bonuses provide consistent motivation - ensure canvassers understand bonus structure before shifts begin`);
      }
    }
    
    // Resource spread warning
    if (config.districts.length > 5) {
      recommendations.push(`Operating across ${config.districts.length} districts - assign dedicated managers to each district cluster to maintain operational control`);
    }
    
    return recommendations;
  };

  const toggleDistrict = (district: string) => {
    if (configData.districts.includes(district)) {
      setConfigData({
        ...configData,
        districts: configData.districts.filter(d => d !== district),
      });
    } else {
      setConfigData({
        ...configData,
        districts: [...configData.districts, district],
      });
    }
  };

  const handleApprove = () => {
    onGenerate({ ...generatedPlan, status: 'pending-approval', submittedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={step !== 'generating' ? onClose : undefined} />

      {/* Modal */}
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={24} className="text-blue-600" />
                <h2 className="text-gray-900">Generate Weekly Plan with Pythia</h2>
              </div>
              <p className="text-sm text-gray-600">
                {step === 'config' && 'Configure parameters and let Pythia build an optimized weekly canvassing plan'}
                {step === 'generating' && 'Pythia is analyzing your configuration and generating an optimized plan...'}
                {step === 'review' && 'Review and approve your generated weekly plan'}
              </p>
            </div>
            {step !== 'generating' && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {step === 'config' && (
            <div className="space-y-6">
              {/* Week Selection */}
              <div>
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} />
                  Planning Week
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Week Starting (Monday) *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={configData.weekOf}
                    onChange={(e) => setConfigData({ ...configData, weekOf: e.target.value })}
                  />
                </div>
              </div>

              {/* District Selection */}
              <div>
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} />
                  Target Districts
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {availableDistricts.map((district) => (
                    <button
                      key={district}
                      type="button"
                      onClick={() => toggleDistrict(district)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                        configData.districts.includes(district)
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {configData.districts.length} districts selected
                </p>
              </div>

              {/* Goals */}
              <div>
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Target size={18} />
                  Daily Goals
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doors per Day
                    </label>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={configData.goals.doorsPerDay}
                      onChange={(e) => setConfigData({
                        ...configData,
                        goals: { ...configData.goals, doorsPerDay: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Canvassers Needed
                    </label>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={configData.goals.canvassersNeeded}
                      onChange={(e) => setConfigData({
                        ...configData,
                        goals: { ...configData.goals, canvassersNeeded: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours per Day
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="16"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={configData.goals.hoursPerDay}
                      onChange={(e) => setConfigData({
                        ...configData,
                        goals: { ...configData.goals, hoursPerDay: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Priority Strategy */}
              <div>
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} />
                  Priority Strategy
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {['aggressive', 'balanced', 'conservative'].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setConfigData({ ...configData, priority })}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        configData.priority === priority
                          ? 'bg-blue-50 border-blue-500'
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium text-gray-900 capitalize mb-1">{priority}</div>
                      <div className="text-xs text-gray-600">
                        {priority === 'aggressive' && 'Max doors, tight schedules'}
                        {priority === 'balanced' && 'Sustainable pace, quality focus'}
                        {priority === 'conservative' && 'Reliable goals, buffer time'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Compensation */}
              <div>
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={18} />
                  Compensation & Bonuses
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Pay (per hour)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={configData.compensation.basePayPerHour}
                        onChange={(e) => setConfigData({
                          ...configData,
                          compensation: { ...configData.compensation, basePayPerHour: parseFloat(e.target.value) || 0 }
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bonus Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={configData.compensation.bonusType}
                      onChange={(e) => setConfigData({
                        ...configData,
                        compensation: { ...configData.compensation, bonusType: e.target.value as any }
                      })}
                    >
                      <option value="per-door">Per Door</option>
                      <option value="per-shift">Per Shift</option>
                      <option value="daily-bonus">Daily Bonus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bonus Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.25"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      value={configData.compensation.bonusIncentives}
                      onChange={(e) => setConfigData({
                        ...configData,
                        compensation: { ...configData.compensation, bonusIncentives: parseFloat(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {configData.compensation.bonusType === 'per-door' && 'Bonus paid for each door knocked'}
                    {configData.compensation.bonusType === 'per-shift' && 'Bonus paid at the end of each shift'}
                    {configData.compensation.bonusType === 'daily-bonus' && 'Fixed bonus paid per canvasser per day'}
                  </p>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-gray-900 mb-4">Optimization Constraints</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={configData.constraints.weather}
                      onChange={(e) => setConfigData({
                        ...configData,
                        constraints: { ...configData.constraints, weather: e.target.checked }
                      })}
                    />
                    <span className="text-sm font-medium text-gray-900">Consider weather forecasts</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={configData.constraints.availability}
                      onChange={(e) => setConfigData({
                        ...configData,
                        constraints: { ...configData.constraints, availability: e.target.checked }
                      })}
                    />
                    <span className="text-sm font-medium text-gray-900">Factor volunteer availability patterns</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={configData.constraints.resources}
                      onChange={(e) => setConfigData({
                        ...configData,
                        constraints: { ...configData.constraints, resources: e.target.checked }
                      })}
                    />
                    <span className="text-sm font-medium text-gray-900">Optimize resource allocation</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={64} className="text-blue-600 animate-spin mb-6" />
              <h3 className="text-gray-900 mb-2">Generating Your Weekly Plan</h3>
              <p className="text-gray-600 text-center max-w-md">
                Pythia is analyzing {configData.districts.length} districts, optimizing shift schedules, 
                and allocating resources for maximum efficiency...
              </p>
              <div className="mt-8 space-y-2 w-full max-w-md">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span>Analyzing district priorities</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span>Optimizing volunteer schedules</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Loader2 size={16} className="text-blue-600 animate-spin" />
                  <span>Calculating resource allocation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Clock size={16} />
                  <span>Generating daily plans</span>
                </div>
              </div>
            </div>
          )}

          {step === 'review' && generatedPlan && (
            <div className="space-y-6">
              {/* Overview Stats with Budget */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-600 mb-1">Total Doors</div>
                  <div className="text-2xl font-bold text-blue-900">{generatedPlan.overview.totalDoors.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm text-green-600 mb-1">Est. Contacts</div>
                  <div className="text-2xl font-bold text-green-900">{generatedPlan.overview.estimatedContacts.toLocaleString()}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-sm text-purple-600 mb-1">Canvassers</div>
                  <div className="text-2xl font-bold text-purple-900">{generatedPlan.overview.totalCanvassers}</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-sm text-orange-600 mb-1">Total Hours</div>
                  <div className="text-2xl font-bold text-orange-900">{generatedPlan.overview.totalHours.toLocaleString()}</div>
                </div>
                <div className="bg-gray-800 border border-gray-900 rounded-lg p-4">
                  <div className="text-sm text-gray-300 mb-1">Est. Budget</div>
                  <div className="text-2xl font-bold text-white">${(generatedPlan.budget.totalBudget / 1000).toFixed(1)}K</div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign size={18} />
                  Budget Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Base Labor ({generatedPlan.budget.breakdown.hoursPerWeek}h @ ${generatedPlan.budget.breakdown.basePayRate}/hr)</span>
                      <span className="font-medium text-gray-900">${generatedPlan.budget.baseLabor.toLocaleString()}</span>
                    </div>
                    {generatedPlan.budget.bonusCost > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Bonus Incentives (${generatedPlan.budget.breakdown.bonusAmount} {generatedPlan.budget.breakdown.bonusType.replace('-', ' ')})
                        </span>
                        <span className="font-medium text-gray-900">${generatedPlan.budget.bonusCost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-300">
                    <span className="font-medium text-gray-900">Total Estimated Cost</span>
                    <span className="text-xl font-bold text-gray-900">${generatedPlan.budget.totalBudget.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Daily Plans Summary */}
              <div>
                <h3 className="text-gray-900 mb-3">Daily Plans</h3>
                <div className="space-y-2">
                  {generatedPlan.dailyPlans.slice(0, 3).map((day: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{day.day}</div>
                          <div className="text-xs text-gray-600">{day.date}</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">{day.shifts.length} shifts</span>
                          <span className="text-gray-600">
                            {day.shifts.reduce((acc: number, s: any) => acc + s.doors, 0)} doors
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-sm text-gray-500 text-center py-2">
                    + {generatedPlan.dailyPlans.length - 3} more days
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-gray-900 mb-3">Pythia Recommendations</h3>
                <div className="space-y-2">
                  {generatedPlan.recommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Sparkles size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-800">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              {generatedPlan.riskFactors.length > 0 && (
                <div>
                  <h3 className="text-gray-900 mb-3">Risk Factors</h3>
                  <div className="space-y-2">
                    {generatedPlan.riskFactors.map((risk: any, idx: number) => (
                      <div key={idx} className={`flex items-start gap-2 p-3 rounded-lg border ${
                        risk.severity === 'high' ? 'bg-red-50 border-red-200' :
                        risk.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          risk.severity === 'high' ? 'bg-red-100 text-red-700' :
                          risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {risk.type}
                        </span>
                        <span className="text-sm text-gray-800">{risk.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {step === 'config' && (
              <>
                <p className="text-sm text-gray-600">
                  Generation takes 30-60 seconds
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleGenerate}
                    disabled={!configData.weekOf || configData.districts.length === 0}
                  >
                    <Sparkles size={16} />
                    Generate Plan
                  </Button>
                </div>
              </>
            )}
            {step === 'review' && (
              <>
                <p className="text-sm text-gray-600">
                  Plan will be sent to management for approval before implementation
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setStep('config')}>
                    Regenerate
                  </Button>
                  <Button variant="primary" onClick={handleApprove}>
                    <Send size={16} />
                    Send for Approval
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};