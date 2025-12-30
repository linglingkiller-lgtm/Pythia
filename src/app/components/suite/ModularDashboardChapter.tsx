import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GripVertical, Plus, Check } from 'lucide-react';

const MODULES = [
  { id: 'war-room', title: 'War Room', position: { x: 0, y: 0 }, size: 'large' },
  { id: 'tasks', title: 'Tasks', position: { x: 1, y: 0 }, size: 'medium' },
  { id: 'bills', title: 'Bills Watchlist', position: { x: 0, y: 1 }, size: 'medium' },
  { id: 'legislators', title: 'Legislator Watchlist', position: { x: 1, y: 1 }, size: 'medium' },
];

export function ModularDashboardChapter() {
  const [customizeMode, setCustomizeMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const timers = [
      setTimeout(() => setCustomizeMode(true), 1000),
      setTimeout(() => {
        // Simulate dragging a module
        setCustomizeMode(true);
      }, 2000),
      setTimeout(() => setShowModal(true), 3500),
      setTimeout(() => {
        setShowModal(false);
        setSaved(true);
      }, 5500),
      setTimeout(() => setSaved(false), 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="py-32 container mx-auto px-6">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Make the dashboard yours.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Move modules, resize them, and build the view you need—without losing the signal.
          </p>
        </motion.div>

        {/* Dashboard Mock */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white/90 backdrop-blur-xl rounded-[28px] border border-gray-200/50 shadow-2xl p-8"
        >
          {/* Customize Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">My Dashboard</h3>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                customizeMode
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {customizeMode ? 'Customizing...' : 'Customize'}
            </button>
          </div>

          {/* Module Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {MODULES.map((module, i) => (
              <motion.div
                key={module.id}
                layout={!prefersReducedMotion}
                className={`relative p-6 bg-gradient-to-br from-gray-50 to-white rounded-[20px] border-2 transition-all ${
                  customizeMode
                    ? 'border-purple-300 shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                {/* Drag Handle */}
                <AnimatePresence>
                  {customizeMode && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-2 left-2 w-8 h-8 rounded bg-purple-100 flex items-center justify-center cursor-move"
                    >
                      <GripVertical className="w-4 h-4 text-purple-600" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <h4 className="font-bold text-gray-900 mb-2">{module.title}</h4>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Module Button */}
          <AnimatePresence>
            {customizeMode && (
              <motion.button
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => setShowModal(true)}
                className="w-full p-6 border-2 border-dashed border-purple-300 rounded-[20px] flex items-center justify-center gap-2 text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Module</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Add Module Modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-[28px] p-8 z-10"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-6">Add Module</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['War Room', 'Tasks', 'Bills Watchlist', 'Legislator Watchlist', 'Door Pace', 'Analytics'].map((name, i) => (
                    <motion.button
                      key={name}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all text-left"
                    >
                      <span className="font-semibold text-gray-900">{name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Saved Toast */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-600 text-white rounded-full shadow-lg flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span className="font-semibold">Dashboard saved</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
