import React from 'react';
import { Issue } from '../../../../demo/legislatorPredictiveInsightsDemo';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'motion/react';

interface IssueConstellationProps {
  issues: Issue[];
  selectedIssue: string | null;
  onSelectIssue: (issue: string) => void;
  legislatorName: string;
  legislatorPhotoUrl?: string;
  legislatorParty?: 'R' | 'D';
}

export function IssueConstellation({
  issues,
  selectedIssue,
  onSelectIssue,
  legislatorName,
  legislatorPhotoUrl,
  legislatorParty
}: IssueConstellationProps) {
  const { isDarkMode } = useTheme();
  const [hoveredIssue, setHoveredIssue] = React.useState<string | null>(null);

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'Strong Support': return '#10b981'; // green
      case 'Lean Support': return '#14b8a6'; // teal
      case 'Mixed/Unclear': return '#6b7280'; // gray
      case 'Lean Oppose': return '#f97316'; // orange
      case 'Strong Oppose': return '#ef4444'; // red
      default: return '#6b7280';
    }
  };

  // Get party-based border colors
  const getPartyBorderColors = () => {
    if (legislatorParty === 'R') {
      return {
        outer: isDarkMode ? '#dc2626' : '#ef4444', // red-600 : red-500
        inner: isDarkMode ? '#b91c1c' : '#dc2626', // red-700 : red-600
      };
    } else if (legislatorParty === 'D') {
      return {
        outer: isDarkMode ? '#2563eb' : '#3b82f6', // blue-600 : blue-500
        inner: isDarkMode ? '#1d4ed8' : '#2563eb', // blue-700 : blue-600
      };
    }
    // Fallback to gray for independent or unknown
    return {
      outer: isDarkMode ? '#64748b' : '#94a3b8',
      inner: isDarkMode ? '#475569' : '#cbd5e1',
    };
  };

  const partyColors = getPartyBorderColors();

  // Calculate positions in a circular orbit
  const centerX = 300;
  const centerY = 250;
  const orbitRadius = 160;

  const issuePositions = issues.map((issue, index) => {
    const angle = (index / issues.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...issue,
      x: centerX + Math.cos(angle) * orbitRadius,
      y: centerY + Math.sin(angle) * orbitRadius,
      angle
    };
  });

  return (
    <div className={`rounded-lg border backdrop-blur-sm p-6 ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Issue Constellation
        </h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Visual map of predicted positions • Node size = salience • Color = stance
        </p>
      </div>

      <svg
        width="600"
        height="500"
        viewBox="0 0 600 500"
        className="w-full"
        style={{ maxHeight: '500px' }}
      >
        {/* Background gradient */}
        <defs>
          <radialGradient id="bg-gradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor={isDarkMode ? '#1e293b' : '#f8fafc'} stopOpacity="0.8" />
            <stop offset="100%" stopColor={isDarkMode ? '#0f172a' : '#e2e8f0'} stopOpacity="0.3" />
          </radialGradient>

          {/* Clip path for circular photo */}
          <clipPath id="center-photo-clip">
            <circle cx={centerX} cy={centerY} r="32" />
          </clipPath>

          {/* Filters for glows */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx={centerX} cy={centerY} r={orbitRadius + 40} fill="url(#bg-gradient)" opacity="0.3" />

        {/* Relationship lines */}
        {issuePositions.map((issue, i) => 
          issue.related?.map(relatedName => {
            const relatedIssue = issuePositions.find(ip => ip.issue === relatedName);
            if (!relatedIssue) return null;
            
            return (
              <line
                key={`${i}-${relatedName}`}
                x1={issue.x}
                y1={issue.y}
                x2={relatedIssue.x}
                y2={relatedIssue.y}
                stroke={isDarkMode ? '#475569' : '#cbd5e1'}
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.3"
              />
            );
          })
        )}

        {/* Orbit circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={orbitRadius}
          fill="none"
          stroke={isDarkMode ? '#334155' : '#e2e8f0'}
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.4"
        />

        {/* Center node (legislator) */}
        <g>
          {/* Outer border ring with subtle glow */}
          <circle
            cx={centerX}
            cy={centerY}
            r="38"
            fill="none"
            stroke={partyColors.outer}
            strokeWidth="2"
            opacity="0.6"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r="35"
            fill="none"
            stroke={partyColors.inner}
            strokeWidth="3"
          />
          
          {/* Profile photo or fallback */}
          {legislatorPhotoUrl ? (
            <image
              href={legislatorPhotoUrl}
              x={centerX - 32}
              y={centerY - 32}
              width="64"
              height="64"
              clipPath="url(#center-photo-clip)"
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <>
              {/* Fallback background */}
              <circle
                cx={centerX}
                cy={centerY}
                r="32"
                fill={isDarkMode ? '#1e293b' : '#f1f5f9'}
              />
              {/* Fallback text */}
              <text
                x={centerX}
                y={centerY - 5}
                textAnchor="middle"
                className={`text-xs font-semibold ${isDarkMode ? 'fill-white' : 'fill-gray-900'}`}
              >
                {legislatorName.split(' ')[0]}
              </text>
              <text
                x={centerX}
                y={centerY + 8}
                textAnchor="middle"
                className={`text-xs font-semibold ${isDarkMode ? 'fill-white' : 'fill-gray-900'}`}
              >
                {legislatorName.split(' ')[1]}
              </text>
            </>
          )}
          
          {/* Name label below photo */}
          <text
            x={centerX}
            y={centerY + 52}
            textAnchor="middle"
            className={`text-xs font-semibold ${isDarkMode ? 'fill-gray-300' : 'fill-gray-700'}`}
          >
            {legislatorName}
          </text>
        </g>

        {/* Issue nodes */}
        {issuePositions.map((issue, index) => {
          const nodeSize = 8 + (issue.salience / 100) * 22; // 8-30px based on salience
          const color = getStanceColor(issue.stance);
          const isSelected = selectedIssue === issue.issue;
          const isHovered = hoveredIssue === issue.issue;

          return (
            <g key={index}>
              {/* Glow ring for selected/hovered */}
              {(isSelected || isHovered) && (
                <circle
                  cx={issue.x}
                  cy={issue.y}
                  r={nodeSize + 8}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity={isSelected ? 0.6 : 0.3}
                  filter="url(#glow)"
                >
                  {isSelected && (
                    <animate
                      attributeName="r"
                      values={`${nodeSize + 8};${nodeSize + 12};${nodeSize + 8}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              )}

              {/* Confidence ring */}
              <circle
                cx={issue.x}
                cy={issue.y}
                r={nodeSize + 4}
                fill="none"
                stroke={color}
                strokeWidth={Math.max(1, issue.confidence / 25)}
                opacity="0.4"
              />

              {/* Main node */}
              <circle
                cx={issue.x}
                cy={issue.y}
                r={nodeSize}
                fill={color}
                opacity="0.9"
                cursor="pointer"
                onMouseEnter={() => setHoveredIssue(issue.issue)}
                onMouseLeave={() => setHoveredIssue(null)}
                onClick={() => onSelectIssue(issue.issue)}
                style={{ transition: 'all 0.2s' }}
              />

              {/* Label */}
              <text
                x={issue.x}
                y={issue.y < centerY ? issue.y - nodeSize - 8 : issue.y + nodeSize + 18}
                textAnchor="middle"
                className={`text-xs font-medium pointer-events-none ${
                  isDarkMode ? 'fill-gray-300' : 'fill-gray-700'
                }`}
              >
                {issue.issue}
              </text>

              {/* Tooltip on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={issue.x - 80}
                    y={issue.y - nodeSize - 70}
                    width="160"
                    height="60"
                    rx="6"
                    fill={isDarkMode ? '#1e293b' : '#ffffff'}
                    stroke={color}
                    strokeWidth="2"
                    opacity="0.98"
                    filter="url(#glow)"
                  />
                  <text
                    x={issue.x}
                    y={issue.y - nodeSize - 48}
                    textAnchor="middle"
                    className={`text-xs font-bold ${isDarkMode ? 'fill-white' : 'fill-gray-900'}`}
                  >
                    {issue.issue}
                  </text>
                  <text
                    x={issue.x}
                    y={issue.y - nodeSize - 34}
                    textAnchor="middle"
                    className={`text-xs ${isDarkMode ? 'fill-gray-300' : 'fill-gray-600'}`}
                  >
                    {issue.stance}
                  </text>
                  <text
                    x={issue.x}
                    y={issue.y - nodeSize - 20}
                    textAnchor="middle"
                    className={`text-xs ${isDarkMode ? 'fill-gray-400' : 'fill-gray-500'}`}
                  >
                    {issue.confidence}% confidence • {issue.salience}% salience
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Strong Support</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-teal-500" />
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Lean Support</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-500" />
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Mixed/Unclear</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-500" />
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Lean Oppose</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Strong Oppose</span>
        </div>
      </div>
    </div>
  );
}