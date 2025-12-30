import React from 'react';
import { X, Download, ChevronDown, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { Bill } from '../../data/billsData';
import { useTheme } from '../../contexts/ThemeContext';

interface RedlineComparisonModalProps {
  bill: Bill;
  onClose: () => void;
}

export function RedlineComparisonModal({ bill, onClose }: RedlineComparisonModalProps) {
  const { isDarkMode } = useTheme();
  const versions = bill.versions;
  const [leftVersion, setLeftVersion] = React.useState(versions.length > 1 ? versions[versions.length - 2].id : versions[0].id);
  const [rightVersion, setRightVersion] = React.useState(versions[versions.length - 1].id);

  const leftVersionData = versions.find(v => v.id === leftVersion);
  const rightVersionData = versions.find(v => v.id === rightVersion);

  const getVersionTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'introduced': 'Introduced',
      'committee-substitute': 'Committee Substitute',
      'amendment': 'Amendment',
      'engrossed': 'Engrossed',
      'enrolled': 'Enrolled',
    };
    return labels[type] || type;
  };

  // Mock legislative text with realistic sections
  const getMockBillText = (versionId: string): Array<{section: string; text: string; changed?: boolean; added?: boolean; removed?: boolean}> => {
    if (versionId === 'v1') {
      return [
        {
          section: 'SECTION 1. SHORT TITLE',
          text: 'This Act may be cited as the "Renewable Energy Standards Act".'
        },
        {
          section: 'SECTION 2. FINDINGS AND PURPOSE',
          text: 'The Legislature finds that:\n\n(a) Renewable energy sources are essential for Arizona\'s long-term energy security and economic development;\n\n(b) Grid modernization is necessary to accommodate increasing renewable energy deployment;\n\n(c) Investment in renewable energy infrastructure will create jobs and economic opportunities throughout the state.'
        },
        {
          section: 'SECTION 3. RENEWABLE PORTFOLIO STANDARD',
          text: 'A.R.S. § 40-1234 is amended to read:\n\n§ 40-1234. Renewable energy standard\n\nA. Electric utilities serving more than 25,000 customers shall source at least fifty percent (50%) of their retail electric sales from renewable energy resources by December 31, 2030.\n\nB. Renewable energy resources include solar, wind, geothermal, biomass, and qualified hydroelectric facilities.\n\nC. Utilities may meet up to thirty percent (30%) of the requirement through renewable energy credits purchased from other utilities or renewable energy generators.'
        },
        {
          section: 'SECTION 4. INFRASTRUCTURE INVESTMENT REQUIREMENTS',
          text: 'A. Electric utilities shall invest a minimum of two billion dollars ($2,000,000,000) in grid modernization infrastructure between 2025 and 2030.\n\nB. Grid modernization investments shall include:\n\n(1) Smart grid technologies;\n\n(2) Energy storage systems with minimum capacity of 500 megawatts;\n\n(3) Transmission upgrades to accommodate renewable energy integration;\n\n(4) Distribution system improvements for enhanced reliability.'
        },
        {
          section: 'SECTION 5. COMPLIANCE AND PENALTIES',
          text: 'A. The Arizona Corporation Commission shall enforce compliance with this Act.\n\nB. Utilities failing to meet annual compliance targets shall pay penalties of $100 per megawatt-hour of shortfall.\n\nC. Penalty funds shall be deposited in the Renewable Energy Development Fund established under A.R.S. § 40-1240.'
        },
        {
          section: 'SECTION 6. EFFECTIVE DATE',
          text: 'This Act is effective immediately upon the signature of the Governor.'
        }
      ];
    } else {
      // v2 - Committee Substitute with changes
      return [
        {
          section: 'SECTION 1. SHORT TITLE',
          text: 'This Act may be cited as the "Renewable Energy Standards Act".'
        },
        {
          section: 'SECTION 2. FINDINGS AND PURPOSE',
          text: 'The Legislature finds that:\n\n(a) Renewable energy sources are essential for Arizona\'s long-term energy security and economic development;\n\n(b) Grid modernization is necessary to accommodate increasing renewable energy deployment;\n\n(c) Investment in renewable energy infrastructure will create jobs and economic opportunities throughout the state;\n\n(d) Rural electric cooperatives require flexibility in compliance timelines due to unique infrastructure constraints.',
          changed: true,
          added: true
        },
        {
          section: 'SECTION 3. RENEWABLE PORTFOLIO STANDARD',
          text: 'A.R.S. § 40-1234 is amended to read:\n\n§ 40-1234. Renewable energy standard\n\nA. Electric utilities serving more than 25,000 customers shall source at least fifty percent (50%) of their retail electric sales from renewable energy resources by December 31, 2035.\n\nB. Rural electric cooperatives serving fewer than 50 megawatts of peak demand are exempt from the requirements of subsection A until December 31, 2040.\n\nC. Renewable energy resources include solar, wind, geothermal, biomass, and qualified hydroelectric facilities.\n\nD. Utilities may meet up to thirty percent (30%) of the requirement through renewable energy credits purchased from other utilities or renewable energy generators.',
          changed: true
        },
        {
          section: 'SECTION 4. INFRASTRUCTURE INVESTMENT REQUIREMENTS',
          text: 'A. Electric utilities shall invest a minimum of two billion dollars ($2,000,000,000) in grid modernization infrastructure between 2025 and 2035.\n\nB. Grid modernization investments shall include:\n\n(1) Smart grid technologies;\n\n(2) Energy storage systems with minimum capacity of 500 megawatts;\n\n(3) Transmission upgrades to accommodate renewable energy integration;\n\n(4) Distribution system improvements for enhanced reliability.\n\nC. The Corporation Commission may approve alternative compliance plans for utilities demonstrating good faith efforts but facing documented technical or financial constraints.',
          changed: true,
          added: true
        },
        {
          section: 'SECTION 4A. RENEWABLE ENERGY CREDIT VALUE INCREASE',
          text: 'A. The value of renewable energy credits issued under A.R.S. § 40-1235 is increased by fifteen percent (15%) for credits generated from:\n\n(1) Solar facilities located in economically distressed counties;\n\n(2) Wind facilities that include community benefit agreements;\n\n(3) Energy storage projects paired with renewable generation.\n\nB. The increased credit value shall remain in effect through December 31, 2035.',
          added: true
        },
        {
          section: 'SECTION 5. COMPLIANCE AND PENALTIES',
          text: 'A. The Arizona Corporation Commission shall enforce compliance with this Act.\n\nB. Utilities failing to meet annual compliance targets shall pay penalties of $100 per megawatt-hour of shortfall.\n\nC. Penalty funds shall be deposited in the Renewable Energy Development Fund established under A.R.S. § 40-1240.'
        },
        {
          section: 'SECTION 6. EFFECTIVE DATE',
          text: 'This Act is effective immediately upon the signature of the Governor.'
        }
      ];
    }
  };

  const leftText = leftVersionData ? getMockBillText(leftVersionData.id) : [];
  const rightText = rightVersionData ? getMockBillText(rightVersionData.id) : [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-lg shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col ${
        isDarkMode
          ? 'bg-slate-800/95 backdrop-blur-xl'
          : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Side-by-Side Redline Comparison</h2>
            <p className={`text-sm mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Compare bill text between versions to identify changes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <Download size={16} />
              Export PDF
            </Button>
            <button
              onClick={onClose}
              className={isDarkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-400 hover:text-gray-600'
              }
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Version Selectors */}
        <div className={`px-6 py-4 border-b ${
          isDarkMode
            ? 'bg-slate-700/30 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="grid grid-cols-2 gap-6">
            {/* Left Version Selector */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Original Version
              </label>
              <div className="relative">
                <select
                  value={leftVersion}
                  onChange={(e) => setLeftVersion(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded appearance-none pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode
                      ? 'bg-slate-700 border-white/10 text-gray-300'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {versions.map((version) => (
                    <option key={version.id} value={version.id}>
                      {getVersionTypeLabel(version.type)} - {new Date(version.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
              </div>
            </div>

            {/* Right Version Selector */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Compare To
              </label>
              <div className="relative">
                <select
                  value={rightVersion}
                  onChange={(e) => setRightVersion(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded appearance-none pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode
                      ? 'bg-slate-700 border-white/10 text-gray-300'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {versions.map((version) => (
                    <option key={version.id} value={version.id}>
                      {getVersionTypeLabel(version.type)} - {new Date(version.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 border rounded ${
                isDarkMode
                  ? 'bg-green-500/20 border-green-500/30'
                  : 'bg-green-100 border-green-300'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Added text</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 border rounded ${
                isDarkMode
                  ? 'bg-red-500/20 border-red-500/30'
                  : 'bg-red-100 border-red-300'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Removed text</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 border rounded ${
                isDarkMode
                  ? 'bg-amber-500/20 border-amber-500/30'
                  : 'bg-amber-100 border-amber-300'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Modified text</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className={`flex-1 grid grid-cols-2 divide-x overflow-hidden ${
          isDarkMode ? 'divide-white/10' : 'divide-gray-200'
        }`}>
          {/* Left Panel */}
          <div className="overflow-y-auto">
            <div className="p-6">
              <div className={`sticky top-0 pb-3 mb-4 border-b ${
                isDarkMode
                  ? 'bg-slate-800/95 border-white/10'
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {leftVersionData && getVersionTypeLabel(leftVersionData.type)}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {leftVersionData && new Date(leftVersionData.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="space-y-6">
                {leftText.map((section, index) => (
                  <div key={index} className="relative">
                    <h4 className={`font-bold text-sm mb-3 uppercase tracking-wide ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {section.section}
                    </h4>
                    <div className={`text-sm leading-relaxed whitespace-pre-wrap font-mono p-4 rounded-lg border ${
                      isDarkMode
                        ? 'bg-slate-700/30 border-white/10 text-gray-300'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}>
                      {section.text}
                    </div>
                    {section.removed && (
                      <div className={`absolute inset-0 border-l-4 pointer-events-none rounded-lg ${
                        isDarkMode
                          ? 'bg-red-500/20 border-red-500'
                          : 'bg-red-100/60 border-red-500'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="overflow-y-auto">
            <div className="p-6">
              <div className={`sticky top-0 pb-3 mb-4 border-b ${
                isDarkMode
                  ? 'bg-slate-800/95 border-white/10'
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {rightVersionData && getVersionTypeLabel(rightVersionData.type)}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {rightVersionData && new Date(rightVersionData.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="space-y-6">
                {rightText.map((section, index) => (
                  <div key={index} className="relative">
                    <h4 className={`font-bold text-sm mb-3 uppercase tracking-wide ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {section.section}
                    </h4>
                    <div className={`text-sm leading-relaxed whitespace-pre-wrap font-mono p-4 rounded-lg border ${
                      section.added && section.changed
                        ? (isDarkMode
                          ? 'bg-amber-500/10 border-amber-500/30 text-gray-300'
                          : 'bg-amber-50 border-amber-300 text-gray-700')
                        : section.added
                        ? (isDarkMode
                          ? 'bg-green-500/10 border-green-500/30 text-gray-300'
                          : 'bg-green-50 border-green-300 text-gray-700')
                        : section.changed
                        ? (isDarkMode
                          ? 'bg-amber-500/10 border-amber-500/30 text-gray-300'
                          : 'bg-amber-50 border-amber-300 text-gray-700')
                        : (isDarkMode
                          ? 'bg-slate-700/30 border-white/10 text-gray-300'
                          : 'bg-gray-50 border-gray-200 text-gray-700')
                    }`}>
                      {section.text}
                    </div>
                    {(section.added || section.changed) && (
                      <div className="mt-2 flex items-start gap-2 text-xs">
                        <Info size={14} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                        <div className={isDarkMode ? 'text-amber-300' : 'text-amber-900'}>
                          {section.added && !section.changed && (
                            <span className="font-medium">New section added in this version</span>
                          )}
                          {section.changed && (
                            <div>
                              <span className="font-medium">Changes in this section:</span>
                              <ul className="mt-1 space-y-0.5 ml-4">
                                {section.section.includes('FINDINGS') && (
                                  <li>• Added finding (d) regarding rural cooperative flexibility</li>
                                )}
                                {section.section.includes('PORTFOLIO STANDARD') && (
                                  <>
                                    <li>• Extended compliance deadline from 2030 → 2035</li>
                                    <li>• Added exemption for rural cooperatives under 50MW</li>
                                    <li>• Renumbered subsections B→C and C→D</li>
                                  </>
                                )}
                                {section.section.includes('INFRASTRUCTURE') && (
                                  <>
                                    <li>• Extended investment timeline from 2030 → 2035</li>
                                    <li>• Added subsection C for alternative compliance plans</li>
                                  </>
                                )}
                                {section.section.includes('CREDIT VALUE') && (
                                  <li>• Entire section added - increases REC values by 15%</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          isDarkMode
            ? 'border-white/10 bg-slate-700/30'
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <span className="font-medium">Revere Summary:</span> This committee substitute extends compliance timelines by 5 years, adds rural cooperative exemptions, and increases renewable energy credit values by 15%.
            </div>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}