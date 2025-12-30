import React from 'react';
import { motion } from 'motion/react';

export function SectionDivider() {
  return (
    <div className="relative h-32 flex items-center justify-center">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </motion.div>
    </div>
  );
}
