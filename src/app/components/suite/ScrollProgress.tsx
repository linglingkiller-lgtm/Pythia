import React from 'react';
import { motion, MotionValue } from 'motion/react';

interface ScrollProgressProps {
  progress: MotionValue<number>;
}

export function ScrollProgress({ progress }: ScrollProgressProps) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-red-50 to-blue-600 origin-left z-50"
      style={{ scaleX: progress }}
    />
  );
}