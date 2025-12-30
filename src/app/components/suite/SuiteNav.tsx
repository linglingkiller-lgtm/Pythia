import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SuiteNavProps {
  show: boolean;
}

const NAV_LINKS = [
  { label: 'Overview', href: '#hero' },
  { label: 'Ask', href: '#ask-pythia' },
  { label: 'Structure', href: '#smart-structuring' },
  { label: 'War Room', href: '#war-room' },
  { label: 'Bills', href: '#bills-intelligence' },
  { label: 'Pace', href: '#door-pace' },
  { label: 'Security', href: '#security' },
];

export function SuiteNav({ show }: SuiteNavProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg"
        >
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
