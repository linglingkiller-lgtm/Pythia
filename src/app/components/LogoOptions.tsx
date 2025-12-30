import React from 'react';

// Option 1: Geometric Hexagon Star
export const GeometricStar = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="geometricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dc2626">
          <animate attributeName="stop-color" values="#dc2626; #ffffff; #3b82f6; #dc2626" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#ffffff">
          <animate attributeName="stop-color" values="#ffffff; #3b82f6; #dc2626; #ffffff" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    <path d="M20 2 L28 12 L38 15 L30 25 L32 35 L20 30 L8 35 L10 25 L2 15 L12 12 Z" fill="url(#geometricGradient)" stroke="url(#geometricGradient)" strokeWidth="1.5" strokeLinejoin="miter"/>
  </svg>
);

// Option 2: Modern Compass/Navigation Star
export const CompassStar = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dc2626">
          <animate attributeName="stop-color" values="#dc2626; #ffffff; #3b82f6; #dc2626" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" stopColor="#ffffff">
          <animate attributeName="stop-color" values="#ffffff; #3b82f6; #dc2626; #ffffff" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#3b82f6">
          <animate attributeName="stop-color" values="#3b82f6; #dc2626; #ffffff; #3b82f6" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    <g>
      <path d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z" fill="url(#compassGradient)"/>
      <circle cx="20" cy="20" r="5" fill="#1f2937" opacity="0.3"/>
    </g>
  </svg>
);

// Option 3: Sharp Diamond Star
export const DiamondStar = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dc2626">
          <animate attributeName="stop-color" values="#dc2626; #ffffff; #3b82f6; #dc2626" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#ffffff">
          <animate attributeName="stop-color" values="#ffffff; #3b82f6; #dc2626; #ffffff" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    <g>
      <path d="M20 2 L26 14 L38 14 L28 22 L32 34 L20 26 L8 34 L12 22 L2 14 L14 14 Z" fill="url(#diamondGradient)"/>
      <path d="M20 8 L23 16 L30 16 L24 21 L26 29 L20 24 L14 29 L16 21 L10 16 L17 16 Z" fill="#1f2937" opacity="0.2"/>
    </g>
  </svg>
);

// Option 4: Burst/Sunburst Star
export const BurstStar = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="burstGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dc2626">
          <animate attributeName="stop-color" values="#dc2626; #ffffff; #3b82f6; #dc2626" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#ffffff">
          <animate attributeName="stop-color" values="#ffffff; #3b82f6; #dc2626; #ffffff" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
      <radialGradient id="burstRadial">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#dc2626" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <g>
      <path d="M20 3 L22 15 L32 10 L25 20 L37 22 L27 27 L35 35 L23 30 L23 40 L20 28 L17 40 L17 30 L5 35 L13 27 L3 22 L15 20 L8 10 L18 15 Z" fill="url(#burstGradient)"/>
      <circle cx="20" cy="20" r="15" fill="url(#burstRadial)"/>
    </g>
  </svg>
);

// Option 5: Layered Pentagon Star
export const LayeredStar = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="layeredGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dc2626">
          <animate attributeName="stop-color" values="#dc2626; #ffffff; #3b82f6; #dc2626" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#ffffff">
          <animate attributeName="stop-color" values="#ffffff; #3b82f6; #dc2626; #ffffff" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
      <linearGradient id="layeredGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6">
          <animate attributeName="stop-color" values="#3b82f6; #dc2626; #ffffff; #3b82f6" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#dc2626">
          <animate attributeName="stop-color" values="#dc2626; #ffffff; #3b82f6; #dc2626" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    <g>
      <path d="M20 2 L25 14 L38 15 L27 24 L31 37 L20 30 L9 37 L13 24 L2 15 L15 14 Z" fill="url(#layeredGradient1)"/>
      <path d="M20 10 L23 17 L30 18 L25 23 L26 30 L20 26 L14 30 L15 23 L10 18 L17 17 Z" fill="url(#layeredGradient2)" opacity="0.7"/>
    </g>
  </svg>
);

// Option 6: Abstract Oracle Star (Most Modern)
export const OracleStar = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="oracleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dc2626">
          <animate attributeName="stop-color" values="#dc2626; #ffffff; #3b82f6; #dc2626" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" stopColor="#ffffff">
          <animate attributeName="stop-color" values="#ffffff; #3b82f6; #dc2626; #ffffff" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#3b82f6">
          <animate attributeName="stop-color" values="#3b82f6; #dc2626; #ffffff; #3b82f6" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    <g>
      {/* Outer points */}
      <path d="M20 2 L23 18 L38 18 L26 26 L30 38 L20 31 L10 38 L14 26 L2 18 L17 18 Z" fill="url(#oracleGradient)" opacity="0.3"/>
      {/* Inner star */}
      <path d="M20 6 L22 16 L32 16 L24 22 L27 32 L20 26 L13 32 L16 22 L8 16 L18 16 Z" fill="url(#oracleGradient)"/>
      {/* Center accent */}
      <circle cx="20" cy="20" r="3" fill="#ffffff" opacity="0.8">
        <animate attributeName="opacity" values="0.8; 0.3; 0.8" dur="2s" repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
);

// Option 7: North Star (Navigation theme)
export const NorthStar = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="northGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff">
          <animate attributeName="stop-color" values="#ffffff; #3b82f6; #dc2626; #ffffff" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#dc2626">
          <animate attributeName="stop-color" values="#dc2626; #ffffff; #3b82f6; #dc2626" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    <g>
      {/* Main vertical point */}
      <path d="M20 2 L23 17 L20 20 L17 17 Z" fill="url(#northGradient)"/>
      {/* Cross arms */}
      <path d="M20 20 L38 20 L35 23 L20 20 L5 23 L2 20 Z" fill="url(#northGradient)" opacity="0.8"/>
      <path d="M20 20 L20 38 L17 35 L20 20 L23 35 L20 38 Z" fill="url(#northGradient)" opacity="0.8"/>
      {/* Diagonal points */}
      <path d="M20 20 L32 8 L30 11 L20 20 L10 11 L8 8 Z" fill="url(#northGradient)" opacity="0.6"/>
      <path d="M20 20 L32 32 L30 29 L20 20 L10 29 L8 32 Z" fill="url(#northGradient)" opacity="0.6"/>
      {/* Center glow */}
      <circle cx="20" cy="20" r="4" fill="#ffffff" opacity="0.5">
        <animate attributeName="r" values="4; 6; 4" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5; 0.8; 0.5" dur="3s" repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
);

// Preview component to see all options
export function LogoPreview() {
  return (
    <div className="p-8 bg-red-900 space-y-6">
      <h2 className="text-white text-2xl font-bold mb-6">Logo Options</h2>
      <div className="grid grid-cols-4 gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-red-800 p-4 rounded-lg">
            <GeometricStar />
          </div>
          <span className="text-white text-sm">Geometric</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-red-800 p-4 rounded-lg">
            <CompassStar />
          </div>
          <span className="text-white text-sm">Compass</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-red-800 p-4 rounded-lg">
            <DiamondStar />
          </div>
          <span className="text-white text-sm">Diamond</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-red-800 p-4 rounded-lg">
            <BurstStar />
          </div>
          <span className="text-white text-sm">Burst</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-red-800 p-4 rounded-lg">
            <LayeredStar />
          </div>
          <span className="text-white text-sm">Layered</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-red-800 p-4 rounded-lg">
            <OracleStar />
          </div>
          <span className="text-white text-sm">Oracle (Recommended)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-red-800 p-4 rounded-lg">
            <NorthStar />
          </div>
          <span className="text-white text-sm">North Star</span>
        </div>
      </div>
    </div>
  );
}
