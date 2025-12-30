import React, { useEffect, useState, useRef } from 'react';
import { useScroll, motion, AnimatePresence } from 'motion/react';
import { NewHeroChapter } from '../components/suite-new/NewHeroChapter';
import { PlatformOverview } from '../components/suite-new/PlatformOverview';
import { BenefitsROI } from '../components/suite-new/BenefitsROI';
import { FeaturesDivider } from '../components/suite-new/FeaturesDivider';
import { WarRoomMoment } from '../components/suite-new/WarRoomMoment';
import { DashboardMoment } from '../components/suite-new/DashboardMoment';
import { BillTrackerMoment } from '../components/suite-new/BillTrackerMoment';
import { LegislatorTrackerMoment } from '../components/suite-new/LegislatorTrackerMoment';
import { TeamMoment } from '../components/suite-new/TeamMoment';
import { IssuesMoment } from '../components/suite-new/IssuesMoment';
import { ClientsMoment } from '../components/suite-new/ClientsMoment';
import { ProjectHubMoment } from '../components/suite-new/ProjectHubMoment';
import { CalendarMoment } from '../components/suite-new/CalendarMoment';
import { RecordsMoment } from '../components/suite-new/RecordsMoment';
import { MessagingMoment } from '../components/suite-new/MessagingMoment';
import { FinalCTAChapter } from '../components/suite-new/FinalCTAChapter';
import { SuiteBuilderChapter } from '../components/suite-new/SuiteBuilderChapter';
import { StickyNav } from '../components/suite-new/StickyNav';
import { ScrollProgress } from '../components/suite-new/ScrollProgress';

export default function SuitePage() {
  const [showNav, setShowNav] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const builderRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to builder when opened
  useEffect(() => {
    if (showBuilder && builderRef.current) {
      setTimeout(() => {
        builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showBuilder]);

  return (
    <div className="bg-white relative overflow-hidden">
      {/* Unified gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-50/20 via-white to-blue-50/20" />
      
      {/* Subtle mesh gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-red-500/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-red-500/6 rounded-full blur-[130px]" />
      </div>

      {/* Noise overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Light vignette */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-gray-900/[0.03]" />
      </div>

      <ScrollProgress progress={scrollYProgress} />
      <StickyNav show={showNav} />

      <div className="relative z-10">
        <NewHeroChapter />
        <PlatformOverview />
        <BenefitsROI />
        <FeaturesDivider />
        <DashboardMoment />
        <WarRoomMoment />
        <BillTrackerMoment />
        <LegislatorTrackerMoment />
        <TeamMoment />
        <IssuesMoment />
        <ClientsMoment />
        <ProjectHubMoment />
        <CalendarMoment />
        <RecordsMoment />
        <MessagingMoment />
        <FinalCTAChapter onOpenBuilder={() => setShowBuilder(true)} />
        
        {/* Builder Section - Revealed on demand at the bottom */}
        <AnimatePresence>
          {showBuilder && (
            <motion.div
              ref={builderRef}
              initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <SuiteBuilderChapter />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}