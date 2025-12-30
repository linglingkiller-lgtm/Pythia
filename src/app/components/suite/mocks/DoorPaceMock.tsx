import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Calendar, Users, AlertCircle } from 'lucide-react';

export function DoorPaceMock() {
  const [progress, setProgress] = useState(0);
  const [showProjection, setShowProjection] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const targetDoors = 15000;
  const currentDoors = 10000;
  const daysRemaining = 12;

  useEffect(() => {
    // Animate progress bar
    const timer1 = setTimeout(() => setProgress((currentDoors / targetDoors) * 100), 300);
    const timer2 = setTimeout(() => setShowProjection(true), 1200);
    const timer3 = setTimeout(() => setShowRecommendation(true), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-gray-200/50 shadow-2xl p-8">
        {/* Progress Meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Doors Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Doors Knocked</span>
              <span className="text-2xl font-bold text-gray-900">
                {currentDoors.toLocaleString()} / {targetDoors.toLocaleString()}
              </span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 rounded-full relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={prefersReducedMotion ? {} : { x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {((currentDoors / targetDoors) * 100).toFixed(1)}% complete
            </p>
          </div>

          {/* Days Remaining */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Days Remaining</span>
              <span className="text-2xl font-bold text-red-600">{daysRemaining}</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" style={{ width: '40%' }} />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Deadline: Jan 3, 2025
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-700">Daily Avg</span>
            </div>
            <span className="text-xl font-bold text-gray-900">417</span>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-red-50 rounded-xl border border-purple-200/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-gray-700">Canvassers</span>
            </div>
            <span className="text-xl font-bold text-gray-900">12</span>
          </div>
          <div className="p-4 bg-gradient-to-br from-red-50 to-amber-50 rounded-xl border border-red-200/50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-red-600" />
              <span className="text-xs font-semibold text-gray-700">Per Day Needed</span>
            </div>
            <span className="text-xl font-bold text-gray-900">417</span>
          </div>
        </div>

        {/* Projection Line */}
        {showProjection && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium opacity-90">Projected Completion</span>
                <p className="text-2xl font-bold">Jan 3, 2025</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendation Card */}
        {showRecommendation && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 bg-gradient-to-br from-amber-50 to-red-50 rounded-xl border border-amber-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">Pythia Recommendation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                    <span>Add 2 canvassers to stay on pace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                    <span>Shift coverage to high-density turfs</span>
                  </li>
                </ul>
                <button className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Apply Recommendations
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
