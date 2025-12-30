import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, Users, Sparkles, TrendingUp, MapPin, Target, Mail, Phone, FileText, Calendar, Eye, Shield, Briefcase, AlertCircle, CheckCircle2, Clock, ChevronRight, BarChart3, Vote, DollarSign, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

// Hemicycle Visualization Component
interface HemicycleProps {
  totalSeats: number;
  republican: number;
  democrat: number;
  independent?: number;
  chamber: 'house' | 'senate';
}

function Hemicycle({ totalSeats, republican, democrat, independent = 0, chamber }: HemicycleProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Determine number of rows based on total seats
  const rows = chamber === 'house' ? 5 : 4;
  
  // Calculate seats distribution across rows (outer rows have more seats)
  const seatsPerRow: number[] = [];
  const totalRowWeight = (rows * (rows + 1)) / 2; // Sum of 1+2+3+...+rows
  
  for (let i = 0; i < rows; i++) {
    const weight = (i + 1) / totalRowWeight;
    const seatsInThisRow = Math.round(totalSeats * weight);
    seatsPerRow.push(seatsInThisRow);
  }
  
  // Adjust to match exact total
  const currentTotal = seatsPerRow.reduce((sum, seats) => sum + seats, 0);
  const diff = totalSeats - currentTotal;
  if (diff !== 0) {
    seatsPerRow[seatsPerRow.length - 1] += diff;
  }
  
  // SVG dimensions
  const width = 500;
  const height = 280;
  const centerX = width / 2;
  const centerY = height - 30;
  const minRadius = 80;
  const maxRadius = 220;
  const radiusStep = (maxRadius - minRadius) / (rows - 1);
  
  // Determine seat radius based on chamber
  const seatRadius = chamber === 'house' ? 3.5 : 5.5;
  const seatSpacing = chamber === 'house' ? 1.2 : 1.3;
  
  // Create party assignment (left to right: R -> I -> D)
  const partyAssignment: Array<'R' | 'D' | 'I'> = [];
  for (let i = 0; i < republican; i++) partyAssignment.push('R');
  for (let i = 0; i < independent; i++) partyAssignment.push('I');
  for (let i = 0; i < democrat; i++) partyAssignment.push('D');
  
  // Generate seat positions
  const seats: Array<{ x: number; y: number; party: 'R' | 'D' | 'I'; row: number }> = [];
  let seatIndex = 0;
  
  seatsPerRow.forEach((count, rowIndex) => {
    const radius = minRadius + rowIndex * radiusStep;
    const angleStart = Math.PI * 0.95; // Start slightly before π
    const angleEnd = Math.PI * 0.05; // End slightly after 0
    const angleRange = angleStart - angleEnd;
    
    for (let i = 0; i < count && seatIndex < totalSeats; i++) {
      const angle = angleStart - (angleRange * (i + 0.5)) / count;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY - radius * Math.sin(angle);
      
      seats.push({
        x,
        y,
        party: partyAssignment[seatIndex] || 'I',
        row: rowIndex,
      });
      seatIndex++;
    }
  });
  
  return (
    <div className="relative w-full flex items-center justify-center py-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Background arc guides */}
        {Array.from({ length: rows }).map((_, idx) => {
          const radius = minRadius + idx * radiusStep;
          const startAngle = Math.PI * 0.95;
          const endAngle = Math.PI * 0.05;
          
          const startX = centerX + radius * Math.cos(startAngle);
          const startY = centerY - radius * Math.sin(startAngle);
          const endX = centerX + radius * Math.cos(endAngle);
          const endY = centerY - radius * Math.sin(endAngle);
          
          return (
            <motion.path
              key={`arc-${idx}`}
              d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
            />
          );
        })}
        
        {/* Center podium/focus point */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <rect
            x={centerX - 20}
            y={centerY - 8}
            width={40}
            height={16}
            rx={4}
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth="1"
          />
          <text
            x={centerX}
            y={centerY + 3}
            textAnchor="middle"
            className="fill-gray-500"
            style={{ fontSize: '10px', fontWeight: 600 }}
          >
            {totalSeats}
          </text>
        </motion.g>
        
        {/* Seats */}
        {seats.map((seat, index) => (
          <motion.g key={index}>
            {/* Seat glow effect */}
            <motion.circle
              cx={seat.x}
              cy={seat.y}
              r={seatRadius * seatSpacing}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.5 + index * 0.003,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={
                seat.party === 'R'
                  ? 'fill-red-400'
                  : seat.party === 'D'
                  ? 'fill-blue-400'
                  : 'fill-gray-400'
              }
            />
            {/* Main seat */}
            <motion.circle
              cx={seat.x}
              cy={seat.y}
              r={seatRadius}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.5 + index * 0.003,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={
                seat.party === 'R'
                  ? 'fill-red-600'
                  : seat.party === 'D'
                  ? 'fill-blue-600'
                  : 'fill-gray-500'
              }
              stroke="white"
              strokeWidth="0.8"
            />
          </motion.g>
        ))}
        
        {/* Party labels with better positioning */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* Republicans - Left */}
          <g>
            <rect
              x={40}
              y={height - 50}
              width={100}
              height={36}
              rx={8}
              fill="#fef2f2"
              stroke="#fecaca"
              strokeWidth="1.5"
            />
            <text
              x={90}
              y={height - 32}
              textAnchor="middle"
              className="fill-red-700"
              style={{ fontSize: '22px', fontWeight: 800 }}
            >
              {republican}
            </text>
            <text
              x={90}
              y={height - 18}
              textAnchor="middle"
              className="fill-red-600"
              style={{ fontSize: '11px', fontWeight: 600 }}
            >
              Republican
            </text>
          </g>
          
          {/* Independents - Center (if any) */}
          {independent > 0 && (
            <g>
              <rect
                x={centerX - 35}
                y={height - 50}
                width={70}
                height={36}
                rx={8}
                fill="#f9fafb"
                stroke="#d1d5db"
                strokeWidth="1.5"
              />
              <text
                x={centerX}
                y={height - 32}
                textAnchor="middle"
                className="fill-gray-700"
                style={{ fontSize: '22px', fontWeight: 800 }}
              >
                {independent}
              </text>
              <text
                x={centerX}
                y={height - 18}
                textAnchor="middle"
                className="fill-gray-600"
                style={{ fontSize: '11px', fontWeight: 600 }}
              >
                Independent
              </text>
            </g>
          )}
          
          {/* Democrats - Right */}
          <g>
            <rect
              x={width - 140}
              y={height - 50}
              width={100}
              height={36}
              rx={8}
              fill="#eff6ff"
              stroke="#bfdbfe"
              strokeWidth="1.5"
            />
            <text
              x={width - 90}
              y={height - 32}
              textAnchor="middle"
              className="fill-blue-700"
              style={{ fontSize: '22px', fontWeight: 800 }}
            >
              {democrat}
            </text>
            <text
              x={width - 90}
              y={height - 18}
              textAnchor="middle"
              className="fill-blue-600"
              style={{ fontSize: '11px', fontWeight: 600 }}
            >
              Democrat
            </text>
          </g>
        </motion.g>
      </svg>
    </div>
  );
}

const capabilities = [
  {
    title: 'Election Intelligence',
    description: 'Track competitiveness ratings, margin trends, and candidate field analysis',
  },
  {
    title: 'Campaign Services Pipeline',
    description: 'Automated lead qualification scores high-value campaign opportunities',
  },
  {
    title: 'Revere Relationship Strategy',
    description: 'AI recommends best angles, topics to avoid, and next best actions',
  },
  {
    title: 'Complete Interaction History',
    description: 'Log calls, meetings, emails with bill/issue linking and attachments',
  },
  {
    title: 'Committee & Bill Tracking',
    description: 'See all committee roles, sponsored bills, and voting patterns',
  },
  {
    title: 'Staff Contact Intelligence',
    description: 'Direct phone and email for Chiefs of Staff, LDs, and district directors',
  },
];

export function LegislatorTrackerMoment() {
  const [activeView, setActiveView] = useState<'overview' | 'profiles' | 'election' | 'ai-strategy'>('overview');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="legislator-tracker" className="py-32 px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-green-50/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-50/30 to-transparent pointer-events-none" />
      
      {/* Animated background elements */}
      {/* Flowing background gradients - Red/Blue */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-red-100/60 via-purple-50/40 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-blue-100/60 via-indigo-50/40 to-transparent" />
        <div className="absolute top-1/3 left-1/3 w-2/3 h-2/3 bg-gradient-to-br from-red-50/40 via-purple-50/30 to-blue-50/40 blur-3xl" />
      </div>
      
      {/* Transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-50/20 to-green-50/30 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-blue-100 rounded-full mb-6">
            <UserCheck className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Legislator Tracker</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Legislator Intelligence.
            <br />
            From Chamber Control to Campaign Leads.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track relationships, predict elections, score campaign opportunities, and turn government relations intelligence into business development - all with Revere AI strategy.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-12 flex-wrap"
        >
          <button
            onClick={() => setActiveView('overview')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'overview'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-red-300 hover:bg-red-50 border border-gray-200'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Chamber Overview
          </button>
          <button
            onClick={() => setActiveView('profiles')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'profiles'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-red-300 hover:bg-red-50 border border-gray-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            6-Tab Profiles
          </button>
          <button
            onClick={() => setActiveView('election')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'election'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-red-300 hover:bg-red-50 border border-gray-200'
            }`}
          >
            <Vote className="w-4 h-4 inline mr-2" />
            Election Intel
          </button>
          <button
            onClick={() => setActiveView('ai-strategy')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'ai-strategy'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-red-300 hover:bg-red-50 border border-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Revere Strategy
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeView === 'overview' && <ChamberOverviewView key="overview" />}
          {activeView === 'profiles' && <ProfilesView key="profiles" />}
          {activeView === 'election' && <ElectionIntelView key="election" />}
          {activeView === 'ai-strategy' && <AIStrategyView key="ai-strategy" />}
        </AnimatePresence>

        {/* Capabilities Grid */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="mt-24"
        >
          <h3 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
            The Only Tracker Built for Lobbying Firms Running Campaign Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 + index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredCard === index
                    ? 'bg-gradient-to-br from-red-50 to-blue-50 border-red-200 shadow-xl scale-105'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <CheckCircle2 className={`w-6 h-6 mb-3 transition-colors ${hoveredCard === index ? 'text-red-600' : 'text-gray-400'}`} />
                <h4 className="font-semibold text-gray-900 mb-2">{capability.title}</h4>
                <p className="text-sm text-gray-600">{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-16"
        >
          <Button variant="secondary" size="md">
            See Full Demo
          </Button>
          <Button variant="secondary" size="md">
            Compare Features
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Chamber Overview View
function ChamberOverviewView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12"
    >
      {/* Header Section with Taglines */}
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-red-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Revere doesn't just show party breakdown. It shows power structure.
          </h3>
          <p className="text-base text-gray-700">
            Visual chamber seating with real-time seat counts, leadership positions, and majority/minority dynamics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* House Card */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
        >
          {/* Top Accent */}
          <div className="h-2 bg-gradient-to-r from-red-600 to-red-700" />
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">House</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>Updated 2 hours ago</span>
                </div>
              </div>
              <Shield size={28} className="text-gray-300" />
            </div>

            {/* Control Badge */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                <div className="text-sm font-bold tracking-wide uppercase text-red-700">
                  Republicans Control
                </div>
              </div>
              <div className="text-5xl font-black text-red-600 mb-1">33</div>
              <div className="text-xs text-gray-600 font-medium">
                of 60 seats • Majority: 31
              </div>
            </div>

            {/* Hemicycle Visualization */}
            <div className="mb-6">
              <Hemicycle
                totalSeats={60}
                republican={33}
                democrat={27}
                independent={0}
                chamber="house"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-xs text-gray-600">Competitive Seats</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-xs text-gray-600">Leadership Tracked</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Senate Card */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
        >
          {/* Top Accent */}
          <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-700" />
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Senate</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>Updated 2 hours ago</span>
                </div>
              </div>
              <Shield size={28} className="text-gray-300" />
            </div>

            {/* Control Badge */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                <div className="text-sm font-bold tracking-wide uppercase text-red-700">
                  Republicans Control
                </div>
              </div>
              <div className="text-5xl font-black text-red-600 mb-1">16</div>
              <div className="text-xs text-gray-600 font-medium">
                of 30 seats • Majority: 16
              </div>
            </div>

            {/* Hemicycle Visualization */}
            <div className="mb-6">
              <Hemicycle
                totalSeats={30}
                republican={16}
                democrat={14}
                independent={0}
                chamber="senate"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-xs text-gray-600">Competitive Seats</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-xs text-gray-600">Leadership Tracked</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leadership Quick Access */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        className="mt-8 p-6 bg-white rounded-2xl border border-gray-200"
      >
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={18} className="text-red-600" />
          Leadership Quick Access
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Speaker Thompson', role: 'House Speaker', party: 'R' },
            { name: 'Sen. Rodriguez', role: 'Senate Majority Leader', party: 'D' },
            { name: 'Rep. Chen', role: 'House Minority Leader', party: 'D' },
          ].map((leader, idx) => (
            <motion.button
              key={leader.name}
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 + idx * 0.1 }}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                  {leader.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  leader.party === 'R' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {leader.party}
                </span>
              </div>
              <div className="text-sm text-gray-600">{leader.role}</div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-red-600 transition-colors mt-2" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Profiles View - Split into 2 parts due to length
function ProfilesView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [activeProfileTab, setActiveProfileTab] = useState('overview');

  const profileTabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'staff', label: 'Staff & Contacts', icon: Phone },
    { id: 'bills', label: 'Bills & Activity', icon: FileText },
    { id: 'records', label: 'Records', icon: Calendar },
    { id: 'election', label: 'Election Intel', icon: Vote },
    { id: 'media', label: 'Media', icon: BarChart3 },
  ];

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12"
    >
      {/* Header Section with Taglines */}
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-red-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Revere doesn't just list legislators. It profiles them completely.
          </h3>
          <p className="text-base text-gray-700">
            6-tab deep-dive profiles with contact info, voting records, bill activity, staff networks, election intel, and media mentions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Profile Header */}
        <div className="lg:col-span-3">
          {/* Profile Header */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="p-6 bg-white rounded-2xl border border-gray-200 mb-6"
          >
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Rep. Sarah Martinez</h3>
                <div className="text-gray-600 mb-3">District 14 • Energy & Commerce Chair</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">Democrat</span>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">3rd Term</span>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">High Priority</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 6-Tab Navigation */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mb-6"
          >
            <div className="grid grid-cols-3 gap-2 p-2 bg-gray-100 rounded-xl">
              {profileTabs.map((tab, idx) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProfileTab(tab.id)}
                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                      activeProfileTab === tab.id
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Content - Render based on active tab */}
          <ProfileTabContent activeTab={activeProfileTab} prefersReducedMotion={prefersReducedMotion} />
        </div>

        {/* Right: Revere Strategy Card */}
        <RevereStrategyCard prefersReducedMotion={prefersReducedMotion} />
      </div>
    </motion.div>
  );
}

// Profile Tab Content Component
function ProfileTabContent({ activeTab, prefersReducedMotion }: { activeTab: string; prefersReducedMotion: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {activeTab === 'overview' && (
        <motion.div
          key="overview"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Committee Assignments</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Energy & Commerce', role: 'Chair' },
                { name: 'Health Subcommittee', role: 'Vice Chair' },
                { name: 'Technology & Innovation', role: 'Member' },
              ].map((committee, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-900 text-sm mb-1">{committee.name}</div>
                  <div className="text-xs text-gray-600">{committee.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Issue Affinities</h4>
            <div className="space-y-3">
              {[
                { issue: 'Clean Energy', strength: 92 },
                { issue: 'Healthcare Access', strength: 85 },
                { issue: 'Education Funding', strength: 78 },
              ].map((affinity, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700">{affinity.issue}</span>
                    <span className="text-sm font-semibold text-gray-900">{affinity.strength}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={prefersReducedMotion ? { width: `${affinity.strength}%` } : { width: 0 }}
                      animate={{ width: `${affinity.strength}%` }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 + idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-red-500 to-red-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'staff' && (
        <motion.div
          key="staff"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="p-6 bg-white rounded-2xl border border-gray-200"
        >
          <h4 className="font-semibold text-gray-900 mb-4">Staff Contacts</h4>
          <div className="space-y-3">
            {[
              { name: 'Michael Chen', role: 'Chief of Staff', email: 'mchen@state.gov', phone: '555-0123' },
              { name: 'Jennifer Lopez', role: 'Legislative Director', email: 'jlopez@state.gov', phone: '555-0124' },
              { name: 'David Kim', role: 'District Director', email: 'dkim@state.gov', phone: '555-0125' },
            ].map((staff, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{staff.name}</div>
                    <div className="text-sm text-gray-600">{staff.role}</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Active</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <a href={`mailto:${staff.email}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                    <Mail size={14} />
                    <span>{staff.email}</span>
                  </a>
                  <a href={`tel:${staff.phone}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                    <Phone size={14} />
                    <span>{staff.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'bills' && (
        <motion.div
          key="bills"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="p-6 bg-white rounded-2xl border border-gray-200"
        >
          <h4 className="font-semibold text-gray-900 mb-4">Recent Bill Activity</h4>
          <div className="space-y-3">
            {[
              { number: 'HB 247', title: 'Clean Energy Standards Act', status: 'Committee', type: 'primary', stance: 'support' },
              { number: 'HB 189', title: 'Healthcare Affordability Bill', status: 'Floor Vote', type: 'co-sponsor', stance: 'support' },
              { number: 'HB 302', title: 'Education Funding Reform', status: 'Introduced', type: 'primary', stance: 'monitor' },
            ].map((bill, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors group cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-sm text-gray-900">{bill.number}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        bill.type === 'primary' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {bill.type === 'primary' ? 'Sponsor' : 'Co-Sponsor'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 mb-2">{bill.title}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{bill.status}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        bill.stance === 'support' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {bill.stance === 'support' ? 'We Support' : 'Monitoring'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-red-600 transition-colors flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'records' && (
        <motion.div
          key="records"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="p-6 bg-white rounded-2xl border border-gray-200"
        >
          <h4 className="font-semibold text-gray-900 mb-4">Interaction History</h4>
          <div className="space-y-3">
            {[
              { type: 'meeting', title: 'District priorities discussion', date: 'Dec 9, 2024', owner: 'Sarah J.' },
              { type: 'email', title: 'HB 247 position briefing sent', date: 'Nov 28, 2024', owner: 'Michael T.' },
              { type: 'call', title: 'Follow-up on energy bill', date: 'Nov 15, 2024', owner: 'Sarah J.' },
            ].map((record, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    {record.type === 'meeting' && <Calendar size={16} className="text-purple-600" />}
                    {record.type === 'email' && <Mail size={16} className="text-blue-600" />}
                    {record.type === 'call' && <Phone size={16} className="text-green-600" />}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm mb-1">{record.title}</div>
                      <div className="text-xs text-gray-600">
                        {record.date} • Logged by {record.owner}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'election' && <ElectionTabContent prefersReducedMotion={prefersReducedMotion} />}
      {activeTab === 'media' && <MediaTabContent prefersReducedMotion={prefersReducedMotion} />}
    </AnimatePresence>
  );
}

// Election Tab Content
function ElectionTabContent({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <motion.div
      key="election"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">2026 Race Status</h4>
            <div className="text-sm text-gray-600">Up for re-election this cycle</div>
          </div>
          <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-lg text-sm font-bold">LEAN DEM</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-white rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Competitiveness Score</div>
            <div className="text-2xl font-bold text-amber-700">64/100</div>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <div className="text-xs text-gray-600 mb-1">2024 Margin</div>
            <div className="text-2xl font-bold text-gray-900">+8.2%</div>
          </div>
        </div>

        <div className="text-xs text-gray-600 mb-2">Margin Trend (3 cycles)</div>
        <div className="flex items-end gap-2 h-20">
          {[12, 9.5, 8.2].map((margin, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <motion.div
                initial={prefersReducedMotion ? { height: `${margin * 6}px` } : { height: 0 }}
                animate={{ height: `${margin * 6}px` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 + idx * 0.1 }}
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
              />
              <div className="text-xs text-gray-700 font-medium mt-1">{2020 + idx * 2}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Briefcase size={16} className="text-red-600" />
          Campaign Services Opportunity
        </h4>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold text-sm shadow-lg">
            HIGH OPPORTUNITY
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            Pipeline: Contacted
          </span>
        </div>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span>Competitive race (Lean Dem)</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span>Narrowing margins (trend analysis)</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span>Strong incumbent with fundraising capacity</span>
          </li>
        </ul>
        <Button variant="primary" size="sm" className="w-full">
          <Mail size={16} className="mr-2" />
          Draft Campaign Outreach Email
        </Button>
      </div>
    </motion.div>
  );
}

// Media Tab Content
function MediaTabContent({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <motion.div
      key="media"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 bg-white rounded-2xl border border-gray-200"
    >
      <h4 className="font-semibold text-gray-900 mb-4">Media Mentions</h4>
      <div className="space-y-3">
        {[
          { type: 'news', title: 'Martinez champions clean energy bill in committee hearing', source: 'State Times', sentiment: 'positive', time: '2 days ago' },
          { type: 'social', title: 'Twitter thread on healthcare affordability', source: '@RepMartinez', sentiment: 'neutral', time: '5 days ago' },
          { type: 'press-release', title: 'Statement on education funding priorities', source: 'Official Release', sentiment: 'positive', time: '1 week ago' },
        ].map((mention, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm mb-1">{mention.title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">{mention.source}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-600">{mention.time}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ml-2 ${
                mention.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                mention.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                'bg-gray-200 text-gray-700'
              }`}>
                {mention.sentiment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Revere Strategy Card
function RevereStrategyCard({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className="lg:col-span-2"
    >
      <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl sticky top-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-600" />
            Revere Strategy
          </h4>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
            High Confidence
          </span>
        </div>

        <div className="space-y-4">
          {/* Recommended Angle */}
          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <div className="flex items-start gap-3 mb-2">
              <Target size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Recommended Angle</div>
                <p className="text-sm text-gray-900">
                  Focus on district-specific clean energy job creation. Her Energy & Commerce chairmanship makes this perfect timing.
                </p>
              </div>
            </div>
          </div>

          {/* Avoid */}
          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <div className="flex items-start gap-3 mb-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Avoid</div>
                <p className="text-sm text-gray-900">
                  Healthcare cost containment - she's neutral on aggressive reforms. Stick to access messaging.
                </p>
              </div>
            </div>
          </div>

          {/* Next Step */}
          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <div className="flex items-start gap-3 mb-3">
              <Zap size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Suggested Next Step</div>
                <p className="text-sm text-gray-900 mb-3">
                  Share district-specific brief on HB 247 clean energy impacts before Feb 12 committee hearing.
                </p>
              </div>
            </div>
            <Button variant="primary" size="sm" className="w-full">
              <Mail size={16} className="mr-2" />
              Generate Brief & Email
            </Button>
          </div>

          {/* Relationship Meter Mini */}
          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Relationship Health</div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={prefersReducedMotion ? { width: '79%' } : { width: 0 }}
                    animate={{ width: '79%' }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                  />
                </div>
              </div>
              <div className="text-xl font-bold text-orange-600">79</div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              <span className="font-semibold text-orange-600">Warm</span> • Last contact 12 days ago
            </div>
          </div>

          {/* Data Sources */}
          <div className="p-4 bg-white/50 rounded-xl border border-purple-100">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Analysis Sources</div>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• 8 sponsored bills (3 active)</li>
              <li>• 3 committee leadership positions</li>
              <li>• 12 recorded interactions</li>
              <li>• 6 recent media mentions</li>
              <li>• District demographic profile</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Election Intel View - Will continue in next file part
function ElectionIntelView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12"
    >
      {/* Header Section with Taglines */}
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-red-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Revere doesn't wait for election night. It forecasts who's vulnerable now.
          </h3>
          <p className="text-base text-gray-700">
            Competitive race tracking with vulnerability scores, fundraising analysis, and challenger intelligence—months before Election Day.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Competitive Races */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Vote size={20} className="text-red-600" />
            2026 Competitive Races
          </h3>

          <div className="space-y-4">
            {[
              { name: 'Rep. Sarah Martinez', district: 'HD-14', rating: 'lean', margin: 8.2, party: 'D', color: 'amber' },
              { name: 'Rep. John Thompson', district: 'HD-22', rating: 'tossup', margin: 2.1, party: 'R', color: 'red' },
              { name: 'Sen. Maria Garcia', district: 'SD-8', rating: 'lean', margin: 6.5, party: 'R', color: 'amber' },
            ].map((race, idx) => (
              <motion.div
                key={race.name}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 + idx * 0.1 }}
                className={`p-5 rounded-2xl border-2 bg-gradient-to-br ${
                  race.color === 'red' 
                    ? 'from-red-50 to-red-100 border-red-300' 
                    : 'from-amber-50 to-amber-100 border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{race.name}</h4>
                    <div className="text-sm text-gray-600">{race.district}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      race.party === 'D' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {race.party}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      race.color === 'red' ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {race.rating.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">2024 Margin</div>
                    <div className="text-xl font-bold text-gray-900">+{race.margin}%</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Competitive Score</div>
                    <div className="text-xl font-bold text-gray-900">{race.rating === 'tossup' ? '88' : '72'}/100</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-green-600" />
                  <span className="text-xs text-gray-700 font-medium">Campaign Services Opportunity Identified</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Services Pipeline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase size={20} className="text-red-600" />
            Campaign Services Pipeline
          </h3>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Pipeline Overview</h4>
            <div className="space-y-3">
              {[
                { stage: 'High Opportunity', count: 8, color: 'red' },
                { stage: 'Added to Pipeline', count: 5, color: 'amber' },
                { stage: 'Contacted', count: 3, color: 'blue' },
                { stage: 'Active Clients', count: 2, color: 'green' },
              ].map((stage, idx) => (
                <motion.div
                  key={stage.stage}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 + idx * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${stage.color}-500`} />
                    <span className="text-sm text-gray-700">{stage.stage}</span>
                  </div>
                  <span className="font-bold text-gray-900">{stage.count}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap size={18} className="text-green-600" />
              Automated Lead Qualification
            </h4>
            <p className="text-sm text-gray-700 mb-4">
              Revere automatically scores campaign service opportunities based on:
            </p>
            <ul className="space-y-2 mb-5">
              {[
                'Competitiveness rating (Tossup/Lean = Higher score)',
                'Margin trends (Narrowing = Higher score)',
                'Incumbent vs. open seat status',
                'Fundraising capacity indicators',
                'District demographics & past spending',
              ].map((factor, idx) => (
                <motion.li
                  key={idx}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 + idx * 0.1 }}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </motion.li>
              ))}
            </ul>
            <Button variant="primary" size="md" className="w-full">
              Export Campaign Leads Report
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// AI Strategy View
function AIStrategyView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-[28px] bg-gradient-to-br from-purple-50/50 to-blue-50/50 backdrop-blur-xl border border-purple-200/50 shadow-2xl mb-12"
    >
      {/* Header Section with Taglines */}
      <div className="mb-8 pb-6 border-b border-purple-200 bg-gradient-to-br from-purple-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Revere doesn't just give you data. It gives you a strategy.
          </h3>
          <p className="text-base text-gray-700">
            AI-powered engagement recommendations prioritize targets, suggest messaging angles, and optimize outreach timing—automatically.
          </p>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4">
          <Sparkles size={32} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Revere Strategy Intelligence</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Every legislator profile includes personalized AI strategy based on bills, voting patterns, interactions, media coverage, and district demographics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Example Strategy Cards */}
        {[
          {
            legislator: 'Rep. Sarah Martinez',
            district: 'HD-14',
            confidence: 'high',
            angle: 'Focus on district-specific clean energy job creation tied to her Energy & Commerce chairmanship.',
            avoid: 'Healthcare cost containment - she\'s neutral on aggressive reforms.',
            nextStep: 'Share district brief on HB 247 clean energy impacts before Feb 12 hearing.',
          },
          {
            legislator: 'Sen. John Thompson',
            district: 'SD-22',
            confidence: 'medium',
            angle: 'Emphasize bipartisan support and economic development angle for infrastructure projects.',
            avoid: 'Education funding increases - he\'s voted against K-12 spending 3 times this session.',
            nextStep: 'Schedule 15-min call with Chief of Staff to discuss infrastructure timeline.',
          },
          {
            legislator: 'Rep. Maria Garcia',
            district: 'HD-8',
            confidence: 'high',
            angle: 'Lead with small business impact and regulatory simplification - matches her committee work.',
            avoid: 'Environmental regulations - she\'s sponsored 2 bills rolling back EPA authority.',
            nextStep: 'Invite to small business roundtable on April 3rd (her district).',
          },
        ].map((strategy, idx) => (
          <motion.div
            key={strategy.legislator}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 + idx * 0.15 }}
            className="p-6 bg-white rounded-2xl border-2 border-purple-200 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-bold text-gray-900">{strategy.legislator}</h4>
                <div className="text-sm text-gray-600">{strategy.district}</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                strategy.confidence === 'high' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {strategy.confidence.toUpperCase()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2 mb-1">
                  <Target size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Angle</div>
                </div>
                <p className="text-sm text-gray-900 pl-5">{strategy.angle}</p>
              </div>

              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-2 mb-1">
                  <AlertCircle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Avoid</div>
                </div>
                <p className="text-sm text-gray-900 pl-5">{strategy.avoid}</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2 mb-1">
                  <Zap size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Next Step</div>
                </div>
                <p className="text-sm text-gray-900 pl-5">{strategy.nextStep}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* How it Works */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        className="mt-8 p-6 bg-white/80 backdrop-blur rounded-2xl border border-purple-200"
      >
        <h4 className="font-bold text-gray-900 mb-4 text-center">How Revere Strategy Works</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { icon: FileText, label: 'Bill Analysis', desc: 'Sponsored bills & voting patterns' },
            { icon: Users, label: 'Committee Work', desc: 'Leadership roles & focus areas' },
            { icon: Calendar, label: 'Interactions', desc: 'Your team\'s engagement history' },
            { icon: BarChart3, label: 'Media Intel', desc: 'Public statements & coverage' },
            { icon: MapPin, label: 'District Data', desc: 'Demographics & priorities' },
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-2">
                  <Icon size={20} className="text-purple-600" />
                </div>
                <div className="font-semibold text-sm text-gray-900 mb-1">{step.label}</div>
                <div className="text-xs text-gray-600">{step.desc}</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
