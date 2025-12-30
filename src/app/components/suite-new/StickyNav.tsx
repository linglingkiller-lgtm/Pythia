import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StickyNavProps {
  show: boolean;
}

const NAV_ITEMS = [
  { id: 'platform', label: 'Platform' },
  { id: 'roi', label: 'ROI' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'war-room', label: 'War Room' },
  { id: 'bill-tracker', label: 'Bills' },
  { id: 'legislator-tracker', label: 'Legislators' },
  { id: 'team', label: 'Team' },
  { id: 'issues', label: 'Issues' },
  { id: 'clients', label: 'Clients' },
  { id: 'projects', label: 'Projects' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'records', label: 'Records' },
];

export function StickyNav({ show }: StickyNavProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-full shadow-lg px-6 py-3">
            <div className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}