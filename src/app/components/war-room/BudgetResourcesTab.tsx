import React, { useState } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Users, FileDown, Lock, Plus, Calendar, ChevronDown, ChevronUp, Minus } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';

interface BudgetResourcesTabProps {
  searchQuery: string;
  filters: any;
}

interface SalaryLine {
  id: string;
  position: string;
  payPerMonth: number;
  roleCount: number;
  budgeted: number;
  actual: number;
}

interface ExpenseLine {
  id: string;
  type: string;
  monthlyCost: number;
  units: number;
  months: number;
  budgeted: number;
  actual: number;
}

interface RecruitingLine {
  id: string;
  type: string;
  estimatedCost: number;
  actualCost: number;
}

export const BudgetResourcesTab: React.FC<BudgetResourcesTabProps> = ({ searchQuery, filters }) => {
  const { isDarkMode } = useTheme();
  const [selectedProject, setSelectedProject] = useState('ca-45');
  const [budgetVersion, setBudgetVersion] = useState('v1');
  const [budgetStatus, setBudgetStatus] = useState<'draft' | 'approved' | 'in-flight' | 'closed'>('in-flight');
  
  // Collapsible state for each block
  const [expandedBlocks, setExpandedBlocks] = useState({
    timeline: true,
    salaries: true,
    hourly: true,
    housing: true,
    recruiting: true,
    misc: true,
    pricing: true
  });

  // Timeline & Assumptions
  const [timeframeMonths, setTimeframeMonths] = useState(3);
  const [startDate, setStartDate] = useState('2026-02-01');
  const [endDate, setEndDate] = useState('2026-04-30');
  const [doorsGoal, setDoorsGoal] = useState(65000);
  const [doorsPerHour, setDoorsPerHour] = useState(22);
  const [payPerHour, setPayPerHour] = useState(25);
  const [wageBuffer, setWageBuffer] = useState(15);
  const [w2Burden, setW2Burden] = useState(35);

  // Salaries
  const [salaryLines, setSalaryLines] = useState<SalaryLine[]>([
    { id: '1', position: 'State Director', payPerMonth: 8000, roleCount: 1, budgeted: 24000, actual: 16000 },
    { id: '2', position: 'Project Manager', payPerMonth: 6500, roleCount: 2, budgeted: 39000, actual: 26000 },
    { id: '3', position: 'Regional Manager', payPerMonth: 5500, roleCount: 3, budgeted: 49500, actual: 33000 },
    { id: '4', position: 'Field Director', payPerMonth: 4500, roleCount: 4, budgeted: 54000, actual: 36000 }
  ]);

  // Hourly Labor
  const [hourlyBudgeted, setHourlyBudgeted] = useState(120000);
  const [hourlyActual, setHourlyActual] = useState(72000);

  // Housing & Travel
  const [expenseLines, setExpenseLines] = useState<ExpenseLine[]>([
    { id: '1', type: 'Housing', monthlyCost: 2000, units: 5, months: 3, budgeted: 30000, actual: 20000 },
    { id: '2', type: 'Travel', monthlyCost: 800, units: 8, months: 3, budgeted: 19200, actual: 12800 }
  ]);

  // Recruiting & Retention
  const [recruitingLines, setRecruitingLines] = useState<RecruitingLine[]>([
    { id: '1', type: 'Indeed Ads', estimatedCost: 5000, actualCost: 4200 },
    { id: '2', type: 'Referral Bonuses', estimatedCost: 3000, actualCost: 2400 },
    { id: '3', type: 'Gas Cards', estimatedCost: 4000, actualCost: 3100 },
    { id: '4', type: 'Background Checks', estimatedCost: 2500, actualCost: 1800 }
  ]);

  // Misc
  const [miscLines, setMiscLines] = useState<RecruitingLine[]>([
    { id: '1', type: 'Voter Contact App', estimatedCost: 8000, actualCost: 8000 },
    { id: '2', type: 'GC Cut', estimatedCost: 15000, actualCost: 10000 },
    { id: '3', type: 'Misc', estimatedCost: 5000, actualCost: 2800 }
  ]);

  // Pricing
  const [pricePerDoor, setPricePerDoor] = useState(4.50);

  // Calculations
  const effectiveCostMultiplier = 1 + (wageBuffer / 100) + (w2Burden / 100);
  
  const salariesTotalBudgeted = salaryLines.reduce((sum, line) => sum + line.budgeted, 0);
  const salariesTotalActual = salaryLines.reduce((sum, line) => sum + line.actual, 0);
  const salariesDelta = salariesTotalActual - salariesTotalBudgeted;

  const totalLaborHours = doorsGoal / doorsPerHour;
  const baseLaborCost = totalLaborHours * payPerHour;
  const loadedLaborCost = baseLaborCost * effectiveCostMultiplier;
  const hourlyDelta = hourlyActual - hourlyBudgeted;

  const housingTotalBudgeted = expenseLines.reduce((sum, line) => sum + line.budgeted, 0);
  const housingTotalActual = expenseLines.reduce((sum, line) => sum + line.actual, 0);
  const housingDelta = housingTotalActual - housingTotalBudgeted;

  const recruitingTotalBudgeted = recruitingLines.reduce((sum, line) => sum + line.estimatedCost, 0);
  const recruitingTotalActual = recruitingLines.reduce((sum, line) => sum + line.actualCost, 0);
  const recruitingDelta = recruitingTotalActual - recruitingTotalBudgeted;

  const miscTotalBudgeted = miscLines.reduce((sum, line) => sum + line.estimatedCost, 0);
  const miscTotalActual = miscLines.reduce((sum, line) => sum + line.actualCost, 0);
  const miscDelta = miscTotalActual - miscTotalBudgeted;

  const totalOverheadBudgeted = salariesTotalBudgeted + hourlyBudgeted + housingTotalBudgeted + recruitingTotalBudgeted + miscTotalBudgeted;
  const totalOverheadActual = salariesTotalActual + hourlyActual + housingTotalActual + recruitingTotalActual + miscTotalActual;
  
  const totalBilled = doorsGoal * pricePerDoor;
  const profitBudgeted = totalBilled - totalOverheadBudgeted;
  const profitActual = totalBilled - totalOverheadActual;
  const marginBudgeted = (profitBudgeted / totalBilled) * 100;
  const marginActual = (profitActual / totalBilled) * 100;
  const costPerDoor = totalOverheadBudgeted / doorsGoal;
  const breakEvenPrice = totalOverheadBudgeted / doorsGoal;

  const impliedStaffing = Math.ceil(totalLaborHours / (40 * timeframeMonths * 4.33));

  const toggleBlock = (block: keyof typeof expandedBlocks) => {
    setExpandedBlocks(prev => ({ ...prev, [block]: !prev[block] }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  const formatCurrencyDecimal = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
  };

  const addSalaryLine = () => {
    const newLine: SalaryLine = {
      id: Date.now().toString(),
      position: 'New Position',
      payPerMonth: 5000,
      roleCount: 1,
      budgeted: 15000,
      actual: 0
    };
    setSalaryLines([...salaryLines, newLine]);
  };

  const removeSalaryLine = (id: string) => {
    setSalaryLines(salaryLines.filter(line => line.id !== id));
  };

  const addExpenseLine = () => {
    const newLine: ExpenseLine = {
      id: Date.now().toString(),
      type: 'New Expense',
      monthlyCost: 1000,
      units: 1,
      months: timeframeMonths,
      budgeted: 3000,
      actual: 0
    };
    setExpenseLines([...expenseLines, newLine]);
  };

  const removeExpenseLine = (id: string) => {
    setExpenseLines(expenseLines.filter(line => line.id !== id));
  };

  const addRecruitingLine = () => {
    const newLine: RecruitingLine = {
      id: Date.now().toString(),
      type: 'New Item',
      estimatedCost: 1000,
      actualCost: 0
    };
    setRecruitingLines([...recruitingLines, newLine]);
  };

  const removeRecruitingLine = (id: string) => {
    setRecruitingLines(recruitingLines.filter(line => line.id !== id));
  };

  const addMiscLine = () => {
    const newLine: RecruitingLine = {
      id: Date.now().toString(),
      type: 'New Misc Item',
      estimatedCost: 1000,
      actualCost: 0
    };
    setMiscLines([...miscLines, newLine]);
  };

  const removeMiscLine = (id: string) => {
    setMiscLines(miscLines.filter(line => line.id !== id));
  };

  // Helper styles
  const cardClass = isDarkMode 
    ? 'bg-slate-900 border-slate-800' 
    : 'bg-white border-gray-200';
    
  const inputClass = isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
    : 'bg-white border-gray-300 text-gray-900';

  const tableInputClass = isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white'
    : 'bg-white border-gray-200 text-gray-900';

  const summaryBgClass = isDarkMode
    ? 'bg-slate-800/50 border-t border-slate-700'
    : 'bg-gray-50 border-t border-gray-200';
    
  const headerTextClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextClass = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const labelClass = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className={`rounded-lg border p-5 mb-6 ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Project Selector */}
            <select 
              className={`px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${inputClass}`}
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="ca-45">CA-45 (3 months)</option>
              <option value="nj-11">NJ-11 (4 months)</option>
              <option value="va-24">VA-24 (2 months)</option>
            </select>

            {/* Timeframe Selector */}
            <select 
              className={`px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              value={timeframeMonths}
              onChange={(e) => setTimeframeMonths(parseInt(e.target.value))}
            >
              <option value="1">1 month</option>
              <option value="2">2 months</option>
              <option value="3">3 months</option>
              <option value="4">4 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <FileDown size={16} />
              Export PDF
            </Button>
            <Button variant="ghost" size="sm">
              <FileDown size={16} />
              Export CSV
            </Button>
            <Button variant="secondary" size="sm">
              <Lock size={16} />
              Lock Budget Version
            </Button>
            <Button variant="default" size="sm">
              <Plus size={16} />
              Add Actuals
            </Button>
          </div>
        </div>

        {/* Status Chips */}
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
            Budget {budgetVersion}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            Last updated: {new Date().toLocaleDateString()}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            budgetStatus === 'draft' ? (isDarkMode ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700') :
            budgetStatus === 'approved' ? (isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700') :
            budgetStatus === 'in-flight' ? (isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700') :
            (isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700')
          }`}>
            Status: {budgetStatus.charAt(0).toUpperCase() + budgetStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Block 1: Timeline + High-level Assumptions */}
      <div className={`rounded-lg border mb-6 ${cardClass}`}>
        <div 
          className={`flex items-center justify-between p-5 cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}
          onClick={() => toggleBlock('timeline')}
        >
          <h2 className={`${headerTextClass} flex items-center gap-2`}>
            <Calendar size={20} />
            Timeline & Assumptions
          </h2>
          {expandedBlocks.timeline ? <ChevronUp size={20} className={subTextClass} /> : <ChevronDown size={20} className={subTextClass} />}
        </div>
        
        {expandedBlocks.timeline && (
          <div className={`p-5 border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className={`block text-xs font-medium mb-2 ${labelClass}`}>PROJECT TIMELINE</label>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs mb-1 ${subTextClass}`}>Months</label>
                    <input 
                      type="number" 
                      className={`w-full px-3 py-2 border rounded-md ${inputClass}`}
                      value={timeframeMonths}
                      onChange={(e) => setTimeframeMonths(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${subTextClass}`}>Start Date</label>
                    <input 
                      type="date" 
                      className={`w-full px-3 py-2 border rounded-md ${inputClass}`}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${subTextClass}`}>End Date</label>
                    <input 
                      type="date" 
                      className={`w-full px-3 py-2 border rounded-md ${inputClass}`}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-2 ${labelClass}`}>DOOR GOAL & PRODUCTIVITY</label>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs mb-1 ${subTextClass}`}>Total Door Goal</label>
                    <input 
                      type="number" 
                      className={`w-full px-3 py-2 border rounded-md ${inputClass}`}
                      value={doorsGoal}
                      onChange={(e) => setDoorsGoal(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${subTextClass}`}>Target Doors/Hour</label>
                    <input 
                      type="number" 
                      className={`w-full px-3 py-2 border rounded-md ${inputClass}`}
                      value={doorsPerHour}
                      onChange={(e) => setDoorsPerHour(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${subTextClass}`}>Pay per Hour</label>
                    <input 
                      type="number" 
                      className={`w-full px-3 py-2 border rounded-md ${inputClass}`}
                      value={payPerHour}
                      onChange={(e) => setPayPerHour(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-2 ${labelClass}`}>WAGE LOAD MULTIPLIERS</label>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs mb-1 ${subTextClass}`}>Wage Buffer %</label>
                    <input 
                      type="number" 
                      className={`w-full px-3 py-2 border rounded-md ${inputClass}`}
                      value={wageBuffer}
                      onChange={(e) => setWageBuffer(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${subTextClass}`}>W2 Burden %</label>
                    <input 
                      type="number" 
                      className={`w-full px-3 py-2 border rounded-md ${inputClass}`}
                      value={w2Burden}
                      onChange={(e) => setW2Burden(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="pt-2">
                    <label className={`block text-xs mb-1 ${subTextClass}`}>Effective Cost Multiplier</label>
                    <div className={`px-3 py-2 rounded-md border font-medium ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                      {effectiveCostMultiplier.toFixed(2)}x
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Block 2: Salaries */}
      <div className={`rounded-lg border mb-6 ${cardClass}`}>
        <div 
          className={`flex items-center justify-between p-5 cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}
          onClick={() => toggleBlock('salaries')}
        >
          <h2 className={`${headerTextClass} flex items-center gap-2`}>
            <Users size={20} />
            Salaries
          </h2>
          {expandedBlocks.salaries ? <ChevronUp size={20} className={subTextClass} /> : <ChevronDown size={20} className={subTextClass} />}
        </div>
        
        {expandedBlocks.salaries && (
          <div className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="p-5">
              {/* Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                      <th className={`text-left text-xs font-medium pb-3 pr-4 ${labelClass}`}>POSITION</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>PAY/MONTH</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}># ROLES</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>BUDGETED</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>ACTUAL</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>DELTA</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryLines.map((line) => (
                      <tr key={line.id} className={`border-b ${isDarkMode ? 'border-slate-800/50' : 'border-gray-100'}`}>
                        <td className="py-3 pr-4">
                          <input 
                            type="text" 
                            className={`w-full px-2 py-1 border rounded text-sm ${tableInputClass}`}
                            value={line.position}
                            onChange={(e) => {
                              const updated = salaryLines.map(l => 
                                l.id === line.id ? { ...l, position: e.target.value } : l
                              );
                              setSalaryLines(updated);
                            }}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.payPerMonth}
                            onChange={(e) => {
                              const updated = salaryLines.map(l => 
                                l.id === line.id ? { 
                                  ...l, 
                                  payPerMonth: parseFloat(e.target.value),
                                  budgeted: parseFloat(e.target.value) * l.roleCount * timeframeMonths
                                } : l
                              );
                              setSalaryLines(updated);
                            }}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.roleCount}
                            onChange={(e) => {
                              const updated = salaryLines.map(l => 
                                l.id === line.id ? { 
                                  ...l, 
                                  roleCount: parseInt(e.target.value),
                                  budgeted: l.payPerMonth * parseInt(e.target.value) * timeframeMonths
                                } : l
                              );
                              setSalaryLines(updated);
                            }}
                          />
                        </td>
                        <td className={`py-3 pr-4 text-right text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{formatCurrency(line.budgeted)}</td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.actual}
                            onChange={(e) => {
                              const updated = salaryLines.map(l => 
                                l.id === line.id ? { ...l, actual: parseFloat(e.target.value) } : l
                              );
                              setSalaryLines(updated);
                            }}
                          />
                        </td>
                        <td className={`py-3 pr-4 text-right text-sm font-medium ${
                          line.actual - line.budgeted > 0 ? (isDarkMode ? 'text-red-400' : 'text-red-600') : 
                          line.actual - line.budgeted < 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : 
                          (isDarkMode ? 'text-gray-400' : 'text-gray-900')
                        }`}>
                          {formatCurrency(line.actual - line.budgeted)}
                        </td>
                        <td className="py-3">
                          <button 
                            onClick={() => removeSalaryLine(line.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button variant="ghost" size="sm" onClick={addSalaryLine}>
                <Plus size={16} />
                Add Position
              </Button>
            </div>

            {/* Summary */}
            <div className={`px-5 py-4 ${summaryBgClass}`}>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>BUDGETED TOTAL</p>
                  <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(salariesTotalBudgeted)}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>ACTUAL TOTAL</p>
                  <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(salariesTotalActual)}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>DELTA</p>
                  <p className={`text-xl font-bold ${
                    salariesDelta > 0 ? (isDarkMode ? 'text-red-400' : 'text-red-600') : 
                    salariesDelta < 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : 
                    (isDarkMode ? 'text-gray-300' : 'text-gray-900')
                  }`}>
                    {formatCurrency(salariesDelta)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Block 3: Hourly (Production Labor) */}
      <div className={`rounded-lg border mb-6 ${cardClass}`}>
        <div 
          className={`flex items-center justify-between p-5 cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}
          onClick={() => toggleBlock('hourly')}
        >
          <h2 className={`${headerTextClass} flex items-center gap-2`}>
            <DollarSign size={20} />
            Hourly (Production Labor)
          </h2>
          {expandedBlocks.hourly ? <ChevronUp size={20} className={subTextClass} /> : <ChevronDown size={20} className={subTextClass} />}
        </div>
        
        {expandedBlocks.hourly && (
          <div className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="p-5">
              {/* Labor Economics Display */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>TOTAL LABOR HOURS NEEDED</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>{totalLaborHours.toFixed(0)} hrs</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>({doorsGoal.toLocaleString()} doors ÷ {doorsPerHour} doors/hr)</p>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-xs mb-1 ${labelClass}`}>BASE HOURLY LABOR COST</p>
                    <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(baseLaborCost)}</p>
                    <p className={`text-xs mt-1 ${subTextClass}`}>({totalLaborHours.toFixed(0)} hrs × {formatCurrencyDecimal(payPerHour)}/hr)</p>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>LOADED HOURLY LABOR COST</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-100' : 'text-green-900'}`}>{formatCurrency(loadedLaborCost)}</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>(Base × {effectiveCostMultiplier.toFixed(2)}x multiplier)</p>
                  </div>
                </div>

                <div>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'}`}>
                    <p className={`text-xs mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>IMPLIED STAFFING</p>
                    <p className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-purple-100' : 'text-purple-900'}`}>~{impliedStaffing} canvassers</p>
                    <p className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                      At {doorsPerHour} doors/hr and 40 hrs/week, you need approximately {impliedStaffing} full-time equivalent canvassers over {timeframeMonths} months.
                    </p>
                  </div>

                  <div className={`mt-4 p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-xs mb-2 ${labelClass}`}>ACTUAL HOURLY SPEND</p>
                    <input 
                      type="number" 
                      className={`w-full px-3 py-2 border rounded-md mb-2 ${inputClass}`}
                      value={hourlyActual}
                      onChange={(e) => setHourlyActual(parseFloat(e.target.value))}
                    />
                    <p className={`text-xs ${subTextClass}`}>Update with actual labor costs as they occur</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className={`px-5 py-4 ${summaryBgClass}`}>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>BUDGETED TOTAL</p>
                  <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(hourlyBudgeted)}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>ACTUAL TOTAL</p>
                  <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(hourlyActual)}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>DELTA</p>
                  <p className={`text-xl font-bold ${
                    hourlyDelta > 0 ? (isDarkMode ? 'text-red-400' : 'text-red-600') : 
                    hourlyDelta < 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : 
                    (isDarkMode ? 'text-gray-300' : 'text-gray-900')
                  }`}>
                    {formatCurrency(hourlyDelta)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Block 4: Housing + Travel */}
      <div className={`rounded-lg border mb-6 ${cardClass}`}>
        <div 
          className={`flex items-center justify-between p-5 cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}
          onClick={() => toggleBlock('housing')}
        >
          <h2 className={headerTextClass}>Housing + Travel (Operating Expenses)</h2>
          {expandedBlocks.housing ? <ChevronUp size={20} className={subTextClass} /> : <ChevronDown size={20} className={subTextClass} />}
        </div>
        
        {expandedBlocks.housing && (
          <div className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="p-5">
              {/* Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                      <th className={`text-left text-xs font-medium pb-3 pr-4 ${labelClass}`}>TYPE</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>COST/MONTH</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}># UNITS</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>MONTHS</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>BUDGETED</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>ACTUAL</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>DELTA</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseLines.map((line) => (
                      <tr key={line.id} className={`border-b ${isDarkMode ? 'border-slate-800/50' : 'border-gray-100'}`}>
                        <td className="py-3 pr-4">
                          <input 
                            type="text" 
                            className={`w-full px-2 py-1 border rounded text-sm ${tableInputClass}`}
                            value={line.type}
                            onChange={(e) => {
                              const updated = expenseLines.map(l => 
                                l.id === line.id ? { ...l, type: e.target.value } : l
                              );
                              setExpenseLines(updated);
                            }}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.monthlyCost}
                            onChange={(e) => {
                              const updated = expenseLines.map(l => 
                                l.id === line.id ? { 
                                  ...l, 
                                  monthlyCost: parseFloat(e.target.value),
                                  budgeted: parseFloat(e.target.value) * l.units * l.months
                                } : l
                              );
                              setExpenseLines(updated);
                            }}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.units}
                            onChange={(e) => {
                              const updated = expenseLines.map(l => 
                                l.id === line.id ? { 
                                  ...l, 
                                  units: parseInt(e.target.value),
                                  budgeted: l.monthlyCost * parseInt(e.target.value) * l.months
                                } : l
                              );
                              setExpenseLines(updated);
                            }}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.months}
                            onChange={(e) => {
                              const updated = expenseLines.map(l => 
                                l.id === line.id ? { 
                                  ...l, 
                                  months: parseInt(e.target.value),
                                  budgeted: l.monthlyCost * l.units * parseInt(e.target.value)
                                } : l
                              );
                              setExpenseLines(updated);
                            }}
                          />
                        </td>
                        <td className={`py-3 pr-4 text-right text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{formatCurrency(line.budgeted)}</td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.actual}
                            onChange={(e) => {
                              const updated = expenseLines.map(l => 
                                l.id === line.id ? { ...l, actual: parseFloat(e.target.value) } : l
                              );
                              setExpenseLines(updated);
                            }}
                          />
                        </td>
                        <td className={`py-3 pr-4 text-right text-sm font-medium ${
                          line.actual - line.budgeted > 0 ? (isDarkMode ? 'text-red-400' : 'text-red-600') : 
                          line.actual - line.budgeted < 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : 
                          (isDarkMode ? 'text-gray-400' : 'text-gray-900')
                        }`}>
                          {formatCurrency(line.actual - line.budgeted)}
                        </td>
                        <td className="py-3">
                          <button 
                            onClick={() => removeExpenseLine(line.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button variant="ghost" size="sm" onClick={addExpenseLine}>
                <Plus size={16} />
                Add Expense
              </Button>
            </div>

            {/* Summary */}
            <div className={`px-5 py-4 ${summaryBgClass}`}>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>BUDGETED TOTAL</p>
                  <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(housingTotalBudgeted)}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>ACTUAL TOTAL</p>
                  <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(housingTotalActual)}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>DELTA</p>
                  <p className={`text-xl font-bold ${
                    housingDelta > 0 ? (isDarkMode ? 'text-red-400' : 'text-red-600') : 
                    housingDelta < 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : 
                    (isDarkMode ? 'text-gray-300' : 'text-gray-900')
                  }`}>
                    {formatCurrency(housingDelta)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Block 5: Recruitment & Retention */}
      <div className={`rounded-lg border mb-6 ${cardClass}`}>
        <div 
          className={`flex items-center justify-between p-5 cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}
          onClick={() => toggleBlock('recruiting')}
        >
          <h2 className={headerTextClass}>Recruitment & Retention</h2>
          {expandedBlocks.recruiting ? <ChevronUp size={20} className={subTextClass} /> : <ChevronDown size={20} className={subTextClass} />}
        </div>
        
        {expandedBlocks.recruiting && (
          <div className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="p-5">
              {/* Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                      <th className={`text-left text-xs font-medium pb-3 pr-4 ${labelClass}`}>TYPE</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>ESTIMATED COST</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>ACTUAL COST</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>DELTA</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recruitingLines.map((line) => (
                      <tr key={line.id} className={`border-b ${isDarkMode ? 'border-slate-800/50' : 'border-gray-100'}`}>
                        <td className="py-3 pr-4">
                          <input 
                            type="text" 
                            className={`w-full px-2 py-1 border rounded text-sm ${tableInputClass}`}
                            value={line.type}
                            onChange={(e) => {
                              const updated = recruitingLines.map(l => 
                                l.id === line.id ? { ...l, type: e.target.value } : l
                              );
                              setRecruitingLines(updated);
                            }}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.estimatedCost}
                            onChange={(e) => {
                              const updated = recruitingLines.map(l => 
                                l.id === line.id ? { ...l, estimatedCost: parseFloat(e.target.value) } : l
                              );
                              setRecruitingLines(updated);
                            }}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.actualCost}
                            onChange={(e) => {
                              const updated = recruitingLines.map(l => 
                                l.id === line.id ? { ...l, actualCost: parseFloat(e.target.value) } : l
                              );
                              setRecruitingLines(updated);
                            }}
                          />
                        </td>
                        <td className={`py-3 pr-4 text-right text-sm font-medium ${
                          line.actualCost - line.estimatedCost > 0 ? (isDarkMode ? 'text-red-400' : 'text-red-600') : 
                          line.actualCost - line.estimatedCost < 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : 
                          (isDarkMode ? 'text-gray-400' : 'text-gray-900')
                        }`}>
                          {formatCurrency(line.actualCost - line.estimatedCost)}
                        </td>
                        <td className="py-3">
                          <button 
                            onClick={() => removeRecruitingLine(line.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button variant="ghost" size="sm" onClick={addRecruitingLine}>
                <Plus size={16} />
                Add Item
              </Button>

              {/* Background Check Cost Per Applicant */}
              <div className={`mt-4 p-4 rounded-lg border ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>BACKGROUND CHECK METRICS</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>Cleared applicants this period: <span className="font-bold">18</span></p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>Cost per cleared applicant: <span className="font-bold">{formatCurrency(1800 / 18)}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className={`px-5 py-4 ${summaryBgClass}`}>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>BUDGETED TOTAL</p>
                  <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(recruitingTotalBudgeted)}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>ACTUAL TOTAL</p>
                  <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(recruitingTotalActual)}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>DELTA</p>
                  <p className={`text-xl font-bold ${
                    recruitingDelta > 0 ? (isDarkMode ? 'text-red-400' : 'text-red-600') : 
                    recruitingDelta < 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : 
                    (isDarkMode ? 'text-gray-300' : 'text-gray-900')
                  }`}>
                    {formatCurrency(recruitingDelta)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Block 6: Misc */}
      <div className={`rounded-lg border mb-6 ${cardClass}`}>
        <div 
          className={`flex items-center justify-between p-5 cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}
          onClick={() => toggleBlock('misc')}
        >
          <h2 className={headerTextClass}>Miscellaneous</h2>
          {expandedBlocks.misc ? <ChevronUp size={20} className={subTextClass} /> : <ChevronDown size={20} className={subTextClass} />}
        </div>
        
        {expandedBlocks.misc && (
          <div className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="p-5">
              {/* Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                      <th className={`text-left text-xs font-medium pb-3 pr-4 ${labelClass}`}>TYPE</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>ESTIMATED COST</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>ACTUAL COST</th>
                      <th className={`text-right text-xs font-medium pb-3 pr-4 ${labelClass}`}>DELTA</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {miscLines.map((line) => (
                      <tr key={line.id} className={`border-b ${isDarkMode ? 'border-slate-800/50' : 'border-gray-100'}`}>
                        <td className="py-3 pr-4">
                          <input 
                            type="text" 
                            className={`w-full px-2 py-1 border rounded text-sm ${tableInputClass}`}
                            value={line.type}
                            onChange={(e) => {
                              const updated = miscLines.map(l => 
                                l.id === line.id ? { ...l, type: e.target.value } : l
                              );
                              setMiscLines(updated);
                            }}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.estimatedCost}
                            onChange={(e) => {
                              const updated = miscLines.map(l => 
                                l.id === line.id ? { ...l, estimatedCost: parseFloat(e.target.value) } : l
                              );
                              setMiscLines(updated);
                            }}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <input 
                            type="number" 
                            className={`w-full px-2 py-1 border rounded text-sm text-right ${tableInputClass}`}
                            value={line.actualCost}
                            onChange={(e) => {
                              const updated = miscLines.map(l => 
                                l.id === line.id ? { ...l, actualCost: parseFloat(e.target.value) } : l
                              );
                              setMiscLines(updated);
                            }}
                          />
                        </td>
                        <td className={`py-3 pr-4 text-right text-sm font-medium ${
                          line.actualCost - line.estimatedCost > 0 ? (isDarkMode ? 'text-red-400' : 'text-red-600') : 
                          line.actualCost - line.estimatedCost < 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : 
                          (isDarkMode ? 'text-gray-400' : 'text-gray-900')
                        }`}>
                          {formatCurrency(line.actualCost - line.estimatedCost)}
                        </td>
                        <td className="py-3">
                          <button 
                            onClick={() => removeMiscLine(line.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button variant="ghost" size="sm" onClick={addMiscLine}>
                <Plus size={16} />
                Add Item
              </Button>
            </div>

            {/* Summary */}
            <div className={`px-5 py-4 ${summaryBgClass}`}>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>BUDGETED TOTAL</p>
                  <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(miscTotalBudgeted)}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>ACTUAL TOTAL</p>
                  <p className={`text-xl font-bold ${headerTextClass}`}>{formatCurrency(miscTotalActual)}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${labelClass}`}>DELTA</p>
                  <p className={`text-xl font-bold ${
                    miscDelta > 0 ? (isDarkMode ? 'text-red-400' : 'text-red-600') : 
                    miscDelta < 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : 
                    (isDarkMode ? 'text-gray-300' : 'text-gray-900')
                  }`}>
                    {formatCurrency(miscDelta)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Block 7: Pricing (THE MOST IMPORTANT BLOCK) */}
      <div className={`rounded-lg border-2 mb-6 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
      }`}>
        <div 
          className={`flex items-center justify-between p-5 cursor-pointer ${
            isDarkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-100/50'
          }`}
          onClick={() => toggleBlock('pricing')}
        >
          <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2 text-lg font-bold`}>
            <TrendingUp size={24} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            Pricing & Profitability
          </h2>
          {expandedBlocks.pricing ? <ChevronUp size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} /> : <ChevronDown size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />}
        </div>
        
        {expandedBlocks.pricing && (
          <div className={`border-t ${isDarkMode ? 'border-blue-900' : 'border-blue-200'}`}>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column: Inputs & Summary */}
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <label className={`block text-xs font-medium mb-2 ${labelClass}`}>TOTAL OVERHEAD</label>
                    <div className={`text-3xl font-bold mb-2 ${headerTextClass}`}>{formatCurrency(totalOverheadBudgeted)}</div>
                    <div className={`text-xs ${subTextClass}`}>
                      Salaries + Hourly + Housing + Recruiting + Misc
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <label className={`block text-xs font-medium mb-2 ${labelClass}`}>TOTAL DOORS</label>
                    <div className={`text-3xl font-bold ${headerTextClass}`}>{doorsGoal.toLocaleString()}</div>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <label className={`block text-xs font-medium mb-2 ${labelClass}`}>PRICE PER DOOR</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className={`w-full px-4 py-3 border-2 rounded-md text-2xl font-bold ${
                        isDarkMode 
                          ? 'bg-slate-900 border-blue-600 text-white' 
                          : 'bg-white border-blue-500 text-gray-900'
                      }`}
                      value={pricePerDoor}
                      onChange={(e) => setPricePerDoor(parseFloat(e.target.value))}
                    />
                  </div>

                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                    <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>TOTAL BILLED</label>
                    <div className={`text-3xl font-bold ${isDarkMode ? 'text-green-100' : 'text-green-900'}`}>{formatCurrency(totalBilled)}</div>
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                      ({doorsGoal.toLocaleString()} doors × {formatCurrencyDecimal(pricePerDoor)}/door)
                    </div>
                  </div>
                </div>

                {/* Right Column: Profitability Metrics */}
                <div className="space-y-4">
                  <div className={`p-5 rounded-lg border-2 ${
                    profitBudgeted >= 0 
                      ? (isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-300') 
                      : (isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-300')
                  }`}>
                    <label className={`block text-xs font-medium mb-2 ${
                      profitBudgeted >= 0 
                        ? (isDarkMode ? 'text-green-400' : 'text-green-700') 
                        : (isDarkMode ? 'text-red-400' : 'text-red-700')
                    }`}>PROFIT (BUDGETED)</label>
                    <div className={`text-4xl font-bold mb-2 ${
                      profitBudgeted >= 0 
                        ? (isDarkMode ? 'text-green-100' : 'text-green-900') 
                        : (isDarkMode ? 'text-red-100' : 'text-red-900')
                    }`}>
                      {formatCurrency(profitBudgeted)}
                    </div>
                    <div className="h-4 bg-white/50 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full ${profitBudgeted >= 0 ? 'bg-green-600' : 'bg-red-600'}`}
                        style={{ width: `${Math.min(Math.abs((profitBudgeted / totalBilled) * 100), 100)}%` }}
                      />
                    </div>
                    <div className={`text-sm ${
                      profitBudgeted >= 0 
                        ? (isDarkMode ? 'text-green-300' : 'text-green-700') 
                        : (isDarkMode ? 'text-red-300' : 'text-red-700')
                    }`}>
                      {marginBudgeted.toFixed(1)}% margin
                    </div>
                  </div>

                  <div className={`p-5 rounded-lg border-2 ${
                    profitActual >= 0 
                      ? (isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-300') 
                      : (isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-300')
                  }`}>
                    <label className={`block text-xs font-medium mb-2 ${
                      profitActual >= 0 
                        ? (isDarkMode ? 'text-green-400' : 'text-green-700') 
                        : (isDarkMode ? 'text-red-400' : 'text-red-700')
                    }`}>PROFIT (ACTUAL)</label>
                    <div className={`text-4xl font-bold mb-2 ${
                      profitActual >= 0 
                        ? (isDarkMode ? 'text-green-100' : 'text-green-900') 
                        : (isDarkMode ? 'text-red-100' : 'text-red-900')
                    }`}>
                      {formatCurrency(profitActual)}
                    </div>
                    <div className="h-4 bg-white/50 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full ${profitActual >= 0 ? 'bg-green-600' : 'bg-red-600'}`}
                        style={{ width: `${Math.min(Math.abs((profitActual / totalBilled) * 100), 100)}%` }}
                      />
                    </div>
                    <div className={`text-sm ${
                      profitActual >= 0 
                        ? (isDarkMode ? 'text-green-300' : 'text-green-700') 
                        : (isDarkMode ? 'text-red-300' : 'text-red-700')
                    }`}>
                      {marginActual.toFixed(1)}% margin
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                      <label className={`block text-xs font-medium mb-1 ${labelClass}`}>COST PER DOOR</label>
                      <div className={`text-xl font-bold ${headerTextClass}`}>{formatCurrencyDecimal(costPerDoor)}</div>
                    </div>

                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                      <label className={`block text-xs font-medium mb-1 ${labelClass}`}>BREAK-EVEN PRICE</label>
                      <div className={`text-xl font-bold ${headerTextClass}`}>{formatCurrencyDecimal(breakEvenPrice)}</div>
                    </div>
                  </div>

                  {profitBudgeted < 0 && (
                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                      <AlertTriangle size={16} className={`mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-red-200' : 'text-red-900'}`}>
                        This budget is currently underwater. Consider:
                      </p>
                      <ul className={`text-xs mt-2 space-y-1 ml-4 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                        <li>• Increase price per door to {formatCurrencyDecimal(breakEvenPrice * 1.15)} for 15% margin</li>
                        <li>• Reduce overhead costs</li>
                        <li>• Increase door goal efficiency</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Export Bar */}
      <div className={`rounded-lg border p-4 flex items-center justify-between ${cardClass}`}>
        <div className={`text-sm ${subTextClass}`}>
          Budget ready to export • Last saved: {new Date().toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <FileDown size={16} />
            Download Budget Summary PDF
          </Button>
          <Button variant="default" size="sm">
            Save Budget
          </Button>
        </div>
      </div>
    </div>
  );
};