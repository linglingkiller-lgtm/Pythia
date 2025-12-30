import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import { Button } from '../ui/Button';

export function OpportunityChapter() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className="py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Revere doesn't just track.
            <br />
            It spots opportunities.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Patterns, timing, and access points—so you move first.
          </p>
        </motion.div>

        {/* Opportunity Alert Example */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40, scale: 0.98 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                    Opportunity Detected
                  </span>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Sponsor alignment on clean energy bill
                </h3>

                <p className="text-gray-700 mb-6">
                  Rep. Martinez (Energy Committee Chair) just co-sponsored HB 247. Her district demographics align 
                  with your client's interests. Window for outreach: next 72 hours before committee vote.
                </p>

                {/* Suggested path */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 mb-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 mb-2">Suggested Path</div>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
                          <span>Committee outreach to Rep. Martinez</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
                          <span>Generate district-specific talking points</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
                          <span>Coordinate stakeholder coalition</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button variant="primary" size="sm">
                    Create outreach plan
                  </Button>
                  <Button variant="secondary" size="sm">
                    Save to Records
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Supporting copy */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="text-center text-lg text-gray-600 max-w-3xl mx-auto"
        >
          One strong example beats ten weak ones. Revere finds the patterns you'd miss.
        </motion.p>
      </div>
    </section>
  );
}