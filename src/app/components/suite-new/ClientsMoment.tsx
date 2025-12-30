import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Building2, TrendingUp, AlertTriangle, DollarSign, Users, Sparkles, Calendar, Target, Activity, Heart, Clock, Zap, FileText, Eye, CheckCircle } from 'lucide-react';

export function ClientsMoment() {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'contract' | 'pipeline'>('overview');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div id="clients" className="relative py-32 overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-emerald-50/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cyan-50/30 to-transparent pointer-events-none z-10" />
      
      {/* Flowing background gradients - Green/White */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-green-100/70 via-green-50/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-green-50/40 via-white to-transparent" />
        <div className="absolute top-1/3 left-1/3 w-2/3 h-2/3 bg-gradient-to-br from-green-50/50 via-transparent to-green-100/40 blur-3xl" />
      </div>
      
      {/* Transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-green-50/20 to-cyan-50/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full mb-6">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-900">CLIENT COMMAND CENTER</span>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Client Portfolio,
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Always Under Control
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From health monitoring to contract tracking, manage every client relationship with strategic precision. 
            Real-time insights ensure nothing slips through the cracks.
          </p>
        </motion.div>

        {/* Main Visual */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-20"
        >
          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[
              { id: 'overview', label: 'Client Pulse', icon: Activity },
              { id: 'health', label: 'Health Status', icon: Heart },
              { id: 'contract', label: 'Contract Intel', icon: DollarSign },
              { id: 'pipeline', label: 'Opportunities', icon: Target },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Client Pulse Overview */}
            {activeTab === 'overview' && (
              <>
                {/* Header Section with Taglines */}
                <div className="p-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-emerald-50/30 to-teal-50/30">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Pythia doesn't just track metrics. It reads the room.
                    </h3>
                    <p className="text-base text-gray-700">
                      Every client signal—engagement, budget, momentum—aggregated into one actionable view.
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">TechGrid Alliance</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          HEALTHY
                        </span>
                        <span className="text-sm text-gray-500">Energy & Utilities</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">Federal + 12 States</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">$485K</div>
                      <div className="text-sm text-gray-500">YTD Revenue</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Active Issues', value: '14', trend: '+3', color: 'orange' },
                      { label: 'Bills Tracked', value: '47', trend: '+8', color: 'blue' },
                      { label: 'Weekly Hrs', value: '23.5', trend: '-2', color: 'purple' },
                      { label: 'Next Deliverable', value: '4 days', trend: '', color: 'gray' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          {stat.label}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                          {stat.trend && (
                            <div className={`text-xs font-semibold ${
                              stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stat.trend}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-50 to-orange-50 rounded-2xl border border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-purple-900 mb-2">Pythia Weekly Insight</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <strong>Strong momentum this week.</strong> HB 2847 cleared committee with bipartisan support. 
                          Recommend scheduling celebration call with client and pivoting resources to Senate coalition building. 
                          Watch for amendment activity in Agriculture crossover.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Health Status */}
            {activeTab === 'health' && (
              <>
                {/* Header Section with Taglines */}
                <div className="p-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-emerald-50/30 to-teal-50/30">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Pythia doesn't wait for clients to complain. It predicts the problem.
                    </h3>
                    <p className="text-base text-gray-700">
                      Real-time health scores analyze budget, engagement, deliverables, and communication patterns.
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Client Health Dashboard</h3>
                  
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {[
                      { 
                        name: 'TechGrid Alliance', 
                        health: 'healthy', 
                        score: 92, 
                        factors: ['On budget', 'High engagement', 'Clear deliverables']
                      },
                      { 
                        name: 'AmMaj Coalition', 
                        health: 'warning', 
                        score: 68, 
                        factors: ['Budget concerns', 'Deliverable delay', 'Good communication']
                      },
                      { 
                        name: 'Builders First', 
                        health: 'critical', 
                        score: 45, 
                        factors: ['Payment overdue', 'Scope creep', 'Low responsiveness']
                      },
                    ].map((client, i) => (
                      <motion.div
                        key={client.name}
                        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className={`p-5 rounded-xl border-2 ${
                          client.health === 'healthy' 
                            ? 'bg-green-50 border-green-300'
                            : client.health === 'warning'
                            ? 'bg-yellow-50 border-yellow-300'
                            : 'bg-red-50 border-red-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            client.health === 'healthy'
                              ? 'bg-green-200 text-green-800'
                              : client.health === 'warning'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-red-200 text-red-800'
                          }`}>
                            {client.health === 'healthy' ? '● HEALTHY' : client.health === 'warning' ? '▲ WARNING' : '✕ CRITICAL'}
                          </span>
                          <div className={`text-2xl font-bold ${
                            client.health === 'healthy'
                              ? 'text-green-700'
                              : client.health === 'warning'
                              ? 'text-yellow-700'
                              : 'text-red-700'
                          }`}>
                            {client.score}
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-3">{client.name}</h4>
                        <ul className="space-y-1">
                          {client.factors.map((factor, j) => (
                            <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-gray-400">•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-blue-900 mb-1">Pythia Alert</h4>
                        <p className="text-sm text-blue-800">
                          2 clients need immediate attention. Builders First: Payment 14 days overdue, recommend escalation. 
                          AmMaj Coalition: Deliverable due in 3 days, team capacity at 95%.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Contract Intelligence */}
            {activeTab === 'contract' && (
              <>
                {/* Header Section with Taglines */}
                <div className="p-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-emerald-50/30 to-teal-50/30">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Pythia doesn't just remind you about renewals. It forecasts revenue risk.
                    </h3>
                    <p className="text-base text-gray-700">
                      Track contract runways, portfolio value, and renewal probability across every client relationship.
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Contract & Revenue Intelligence</h3>
                  
                  {/* Portfolio Overview */}
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                      <div className="text-xs font-semibold text-emerald-700 mb-2 uppercase">Portfolio Value</div>
                      <div className="text-3xl font-bold text-gray-900">$2.4M</div>
                      <div className="text-xs text-gray-600 mt-1">8 active clients</div>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200">
                      <div className="text-xs font-semibold text-orange-700 mb-2 uppercase">At Risk (60d)</div>
                      <div className="text-3xl font-bold text-gray-900">$655K</div>
                      <div className="text-xs text-gray-600 mt-1">3 contracts</div>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                      <div className="text-xs font-semibold text-blue-700 mb-2 uppercase">Avg Renewal Rate</div>
                      <div className="text-3xl font-bold text-gray-900">87%</div>
                      <div className="text-xs text-gray-600 mt-1">Last 12 months</div>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                      <div className="text-xs font-semibold text-purple-700 mb-2 uppercase">Revenue Forecast</div>
                      <div className="text-3xl font-bold text-gray-900">$2.1M</div>
                      <div className="text-xs text-gray-600 mt-1">Next 12 months</div>
                    </div>
                  </div>

                  {/* Contract Details with Intelligence */}
                  <div className="space-y-4">
                    {/* Contract 1 - Builders First (Critical) */}
                    <motion.div
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-gray-900 text-lg">Builders First</h4>
                            <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold uppercase">
                              ✕ Critical Risk
                            </span>
                            <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-bold">
                              45 Days
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">Annual Contract • Ends Feb 15, 2025</div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">$275K</div>
                          <div className="text-xs text-gray-500">Annual value</div>
                        </div>
                      </div>

                      {/* Intelligence Grid */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Renewal Probability</div>
                          <div className="text-xl font-bold text-red-600">34%</div>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Budget Utilization</div>
                          <div className="text-xl font-bold text-orange-600">142%</div>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Health Score</div>
                          <div className="text-xl font-bold text-red-600">45/100</div>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Last Contact</div>
                          <div className="text-xl font-bold text-red-600">18d</div>
                        </div>
                      </div>

                      {/* Pythia Risk Analysis */}
                      <div className="p-4 bg-red-100 border-2 border-red-300 rounded-xl mb-3">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h5 className="font-bold text-red-900 mb-1">Pythia Risk Assessment</h5>
                            <p className="text-sm text-red-800 leading-relaxed">
                              <strong>HIGH CHURN RISK.</strong> Payment 14 days overdue, budget overrun by 42%, zero contact in 18 days. 
                              Similar patterns led to 3 non-renewals in 2024. Immediate escalation required.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Recommended Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-700 uppercase">Pythia Recommends:</span>
                        <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-all">
                          Schedule Executive Call
                        </button>
                        <button className="px-3 py-1.5 bg-white border-2 border-red-300 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-50 transition-all">
                          Review Scope & Budget
                        </button>
                        <button className="px-3 py-1.5 bg-white border-2 border-red-300 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-50 transition-all">
                          View Payment History
                        </button>
                      </div>
                    </motion.div>

                    {/* Contract 2 - AmMaj Coalition (Warning) */}
                    <motion.div
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-gray-900 text-lg">AmMaj Coalition</h4>
                            <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold uppercase">
                              ▲ Action Needed
                            </span>
                            <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-bold">
                              89 Days
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">Annual Contract • Ends Mar 24, 2025</div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">$380K</div>
                          <div className="text-xs text-gray-500">Annual value</div>
                        </div>
                      </div>

                      {/* Intelligence Grid */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Renewal Probability</div>
                          <div className="text-xl font-bold text-yellow-600">68%</div>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Budget Utilization</div>
                          <div className="text-xl font-bold text-green-600">78%</div>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Health Score</div>
                          <div className="text-xl font-bold text-yellow-600">68/100</div>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Last Contact</div>
                          <div className="text-xl font-bold text-green-600">4d</div>
                        </div>
                      </div>

                      {/* Pythia Intelligence */}
                      <div className="p-4 bg-yellow-100 border-2 border-yellow-300 rounded-xl mb-3">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h5 className="font-bold text-yellow-900 mb-1">Pythia Renewal Forecast</h5>
                            <p className="text-sm text-yellow-800 leading-relaxed">
                              <strong>MODERATE RENEWAL PROBABILITY.</strong> Budget on track, good communication cadence, but deliverable delayed by 5 days. 
                              Start renewal conversation now at 89 days out. Emphasize recent legislative wins to build confidence.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Recommended Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-700 uppercase">Pythia Recommends:</span>
                        <button className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs font-semibold hover:bg-yellow-700 transition-all">
                          Draft Renewal Proposal
                        </button>
                        <button className="px-3 py-1.5 bg-white border-2 border-yellow-300 text-yellow-700 rounded-lg text-xs font-semibold hover:bg-yellow-50 transition-all">
                          Highlight Recent Wins
                        </button>
                        <button className="px-3 py-1.5 bg-white border-2 border-yellow-300 text-yellow-700 rounded-lg text-xs font-semibold hover:bg-yellow-50 transition-all">
                          Schedule Check-In
                        </button>
                      </div>
                    </motion.div>

                    {/* Contract 3 - TechGrid Alliance (Healthy) */}
                    <motion.div
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-gray-900 text-lg">TechGrid Alliance</h4>
                            <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold uppercase">
                              ● Healthy
                            </span>
                            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">
                              287 Days
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">Annual Contract • Ends Oct 18, 2025</div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">$485K</div>
                          <div className="text-xs text-gray-500">Annual value</div>
                        </div>
                      </div>

                      {/* Intelligence Grid */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Renewal Probability</div>
                          <div className="text-xl font-bold text-green-600">94%</div>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Budget Utilization</div>
                          <div className="text-xl font-bold text-green-600">62%</div>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Health Score</div>
                          <div className="text-xl font-bold text-green-600">92/100</div>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Last Contact</div>
                          <div className="text-xl font-bold text-green-600">2d</div>
                        </div>
                      </div>

                      {/* Pythia Intelligence */}
                      <div className="p-4 bg-green-100 border-2 border-green-300 rounded-xl mb-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h5 className="font-bold text-green-900 mb-1">Pythia Growth Opportunity</h5>
                            <p className="text-sm text-green-800 leading-relaxed">
                              <strong>EXCELLENT RENEWAL CANDIDATE.</strong> All KPIs green, strong engagement, under budget. 
                              High probability of renewal + expansion. Consider proposing 20% scope increase at 6-month mark based on recent legislative victories.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Recommended Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-700 uppercase">Pythia Recommends:</span>
                        <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-all">
                          Propose Scope Expansion
                        </button>
                        <button className="px-3 py-1.5 bg-white border-2 border-green-300 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-50 transition-all">
                          Celebrate Recent Wins
                        </button>
                        <button className="px-3 py-1.5 bg-white border-2 border-green-300 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-50 transition-all">
                          Multi-Year Contract Pitch
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Revenue Forecast Timeline */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">12-Month Revenue Forecast</h4>
                        <p className="text-white/90 text-sm">
                          Pythia predicts $2.1M in contract renewals (87% probability) with $340K in expansion opportunities based on client health scores, 
                          engagement patterns, budget utilization, and historical renewal data.
                        </p>
                      </div>
                    </div>

                    {/* Forecast Breakdown */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                        <div className="text-xs font-semibold text-white/70 mb-1 uppercase">Likely Renewals</div>
                        <div className="text-2xl font-bold mb-1">$1.74M</div>
                        <div className="text-xs text-white/80">5 contracts (90%+ probability)</div>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                        <div className="text-xs font-semibold text-white/70 mb-1 uppercase">At Risk</div>
                        <div className="text-2xl font-bold mb-1">$655K</div>
                        <div className="text-xs text-white/80">3 contracts (requires action)</div>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                        <div className="text-xs font-semibold text-white/70 mb-1 uppercase">Expansion Potential</div>
                        <div className="text-2xl font-bold mb-1">$340K</div>
                        <div className="text-xs text-white/80">2 upsell opportunities</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Opportunities Pipeline */}
            {activeTab === 'pipeline' && (
              <>
                {/* Header Section with Taglines */}
                <div className="p-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-emerald-50/30 to-teal-50/30">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Pythia doesn't just track. It spots opportunities.
                    </h3>
                    <p className="text-base text-gray-700">
                      Patterns, timing, and access points—so you move first.
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pythia-Detected Opportunities</h3>
                    <p className="text-sm text-gray-600">AI-powered opportunity detection from budget changes, RFPs, leadership shifts, and policy developments</p>
                  </div>
                  
                  {/* Opportunity Detection Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'New This Week', count: 8, icon: TrendingUp, color: 'emerald' },
                      { label: 'High Priority', count: 5, icon: Zap, color: 'orange' },
                      { label: 'Action Required', count: 3, icon: AlertTriangle, color: 'red' },
                      { label: 'Watching', count: 14, icon: Eye, color: 'blue' },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className={`p-4 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-xl border-2 border-${stat.color}-200`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                            <span className={`text-xs font-bold text-${stat.color}-700 uppercase`}>{stat.label}</span>
                          </div>
                          <div className={`text-3xl font-bold text-gray-900`}>{stat.count}</div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Detected Opportunities List */}
                  <div className="space-y-4">
                    {[
                      { 
                        type: 'RFP Detected',
                        title: 'Federal Infrastructure Bill - Clean Energy Advocacy',
                        client: 'Potential: Department of Energy',
                        detected: 'Detected 2 hours ago',
                        value: '$340K',
                        confidence: 92,
                        icon: FileText,
                        color: 'emerald',
                        details: 'New RFP posted for clean energy policy advocacy. Deadline: Jan 15. Your team has 4 relevant past projects.',
                        actions: ['Download RFP', 'See similar wins', 'Draft proposal outline']
                      },
                      { 
                        type: 'Budget Increase',
                        title: 'California CPUC Expands Legislative Affairs Budget',
                        client: 'Existing: CA Public Utilities Commission',
                        detected: 'Detected 5 hours ago',
                        value: '$180K',
                        confidence: 88,
                        icon: DollarSign,
                        color: 'blue',
                        details: 'Budget increased 40% for Q1 2025. Your contact Maria Rodriguez authored the expansion memo. Strike now.',
                        actions: ['Email Maria', 'See current contract', 'Propose expansion']
                      },
                      { 
                        type: 'Policy Development',
                        title: 'Texas Grid Modernization Bill Advancing',
                        client: 'Potential: TX Energy Coalition',
                        detected: 'Detected 2 days ago',
                        value: '$220K',
                        confidence: 68,
                        icon: Building2,
                        color: 'orange',
                        details: 'HB 2847 passed committee. Coalition forming to support passage. Your expertise in grid policy is highly relevant.',
                        actions: ['Track bill', 'Contact coalition', 'Review policy brief']
                      },
                    ].map((opp, i) => {
                      const Icon = opp.icon;
                      return (
                        <motion.div
                          key={opp.title}
                          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className={`p-6 bg-white rounded-2xl border-2 border-${opp.color}-200 hover:border-${opp.color}-400 hover:shadow-xl transition-all group`}
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`p-2 bg-${opp.color}-100 rounded-lg`}>
                                  <Icon className={`w-4 h-4 text-${opp.color}-600`} />
                                </div>
                                <span className={`px-3 py-1 bg-${opp.color}-100 text-${opp.color}-700 rounded-full text-xs font-bold uppercase`}>
                                  {opp.type}
                                </span>
                                <span className="text-xs text-gray-500">{opp.detected}</span>
                              </div>
                              <h4 className="font-bold text-gray-900 text-lg mb-1">{opp.title}</h4>
                              <div className="text-sm text-gray-600">{opp.client}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900 mb-1">{opp.value}</div>
                              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                <CheckCircle className="w-3 h-3" />
                                {opp.confidence}% confidence
                              </div>
                            </div>
                          </div>

                          {/* Pythia Insight */}
                          <div className={`p-4 bg-gradient-to-br from-${opp.color}-50 to-${opp.color}-100/50 rounded-xl mb-4`}>
                            <div className="flex items-start gap-2">
                              <Sparkles className={`w-4 h-4 text-${opp.color}-600 mt-0.5 flex-shrink-0`} />
                              <p className="text-sm text-gray-700">{opp.details}</p>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {opp.actions.map((action, idx) => (
                              <button
                                key={idx}
                                className={`px-4 py-2 bg-white border-2 border-${opp.color}-200 text-${opp.color}-700 rounded-lg text-sm font-semibold hover:bg-${opp.color}-50 hover:border-${opp.color}-400 transition-all`}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Summary Banner */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl text-white">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">Pythia Opportunity Intelligence</h4>
                        <p className="text-white/90 text-sm mb-4">
                          Pythia monitors budgets, RFPs, leadership changes, policy developments, and contract cycles across 50 states and federal agencies. 
                          Every opportunity is scored by relevance, timing, and win probability based on your team's expertise and relationships.
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>247 sources monitored</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            <span>Real-time alerts</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            <span>AI-powered matching</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Complete Client Management Platform */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Complete Client Management Platform</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: 'Health Monitoring',
                description: 'Real-time client health scores track engagement, budget, deliverables, and relationship strength with automatic alerts.',
              },
              {
                icon: DollarSign,
                title: 'Contract Intelligence',
                description: 'Never miss a renewal. Track contract runways, revenue forecasts, and billing metrics across your entire portfolio.',
              },
              {
                icon: Target,
                title: 'Growth Pipeline',
                description: 'Manage opportunities from prospect to close. Track probability, next steps, and revenue potential in one view.',
              },
              {
                icon: Activity,
                title: 'Engagement Tracking',
                description: 'Monitor client touchpoints, deliverable completion, and satisfaction metrics to maintain strong relationships.',
              },
              {
                icon: Clock,
                title: 'Renewal Forecasting',
                description: 'AI-powered predictions for contract renewals based on health scores, engagement patterns, and historical data.',
              },
              {
                icon: Sparkles,
                title: 'Pythia Recommendations',
                description: 'Get strategic guidance on upsell opportunities, risk mitigation, and relationship strengthening actions.',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`p-6 rounded-2xl border transition-all duration-300 ${
                    hoveredCard === index
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-xl scale-105'
                      : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-3 transition-colors ${hoveredCard === index ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">360° Client View</div>
                <div className="text-sm text-gray-600">Every relationship, fully visible</div>
              </div>
            </div>
            <p className="text-gray-700 max-w-md">
              From first prospect meeting to contract renewal, manage the entire client lifecycle with strategic intelligence and automated alerts.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}