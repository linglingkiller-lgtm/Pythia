import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Users, 
  Lock, 
  Zap,
  FileText,
  Image as ImageIcon,
  CheckCheck,
  Sparkles,
  Shield,
  Clock,
  TrendingUp,
  Layers,
  Hash,
  ArrowRight,
  Star,
  Bot
} from 'lucide-react';

export function MessagingMoment() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [activeFeature, setActiveFeature] = useState(0);
  const [typingText, setTypingText] = useState('');
  
  const fullText = "Draft a follow-up message for Senator Martinez about HB-450...";
  
  // Typing animation effect
  useEffect(() => {
    if (prefersReducedMotion) {
      setTypingText(fullText);
      return;
    }
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypingText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const features = [
    {
      icon: Zap,
      title: 'Real-Time Messaging',
      description: 'Instant communication with your team and legislators',
      color: 'from-blue-500 to-cyan-500',
      stat: '< 100ms',
      statLabel: 'Delivery Time'
    },
    {
      icon: Paperclip,
      title: 'Rich Attachments',
      description: 'Share files, images, and documents seamlessly',
      color: 'from-purple-500 to-pink-500',
      stat: '50MB',
      statLabel: 'Max File Size'
    },
    {
      icon: Layers,
      title: 'Thread Organization',
      description: 'Keep conversations organized by topic and legislator',
      color: 'from-green-500 to-emerald-500',
      stat: 'Unlimited',
      statLabel: 'Threads'
    },
    {
      icon: Users,
      title: 'Direct Messaging',
      description: 'Connect directly with legislators and their staff',
      color: 'from-orange-500 to-red-500',
      stat: '1000+',
      statLabel: 'Contacts'
    },
    {
      icon: Lock,
      title: 'Secure Communications',
      description: 'End-to-end encryption for sensitive conversations',
      color: 'from-indigo-500 to-purple-500',
      stat: 'AES-256',
      statLabel: 'Encryption'
    },
    {
      icon: Sparkles,
      title: 'Revere Message Assistant',
      description: 'AI-powered suggestions and drafting assistance',
      color: 'from-red-500 to-pink-500',
      stat: 'AI',
      statLabel: 'Powered'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Internal team channels and group conversations',
      color: 'from-teal-500 to-cyan-500',
      stat: 'Teams',
      statLabel: 'Built-in'
    }
  ];

  const messagePreview = [
    {
      sender: 'You',
      message: 'Looking forward to discussing HB-450 support',
      time: '2:30 PM',
      read: true,
      attachments: 0
    },
    {
      sender: 'Sen. Martinez',
      message: 'Thanks for the policy brief. Let\'s schedule a call.',
      time: '2:45 PM',
      read: true,
      attachments: 0
    },
    {
      sender: 'You',
      message: 'Perfect! How does Thursday at 3 PM work?',
      time: '2:47 PM',
      read: true,
      attachments: 1
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white" />
      
      {/* Animated Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
            animate={prefersReducedMotion ? {} : {
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.1)',
                '0 0 40px rgba(147, 51, 234, 0.2)',
                '0 0 20px rgba(59, 130, 246, 0.1)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Messaging Feature
            </span>
          </motion.div>

          <h2 
            className="text-6xl md:text-7xl font-black mb-6 leading-tight"
            style={{ fontFamily: '"Corpline", sans-serif' }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Connect. Collaborate.
            </span>
            <br />
            <span className="text-gray-900">Communicate.</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay in constant contact with legislators, your team, and stakeholders through our advanced messaging platform—powered by Revere intelligence.
          </p>
        </motion.div>

        {/* Main Interactive Demo */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Left: Message Interface Mockup */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -50 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
              {/* Message Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Senator Sarah Martinez</div>
                    <div className="text-white/70 text-xs flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Active now
                    </div>
                  </div>
                </div>
                <Shield className="w-5 h-5 text-white/70" />
              </div>

              {/* Messages */}
              <div className="p-6 space-y-4 h-80 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/50">
                {messagePreview.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.sender === 'You' ? 'order-2' : 'order-1'}`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.sender === 'You' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        {msg.attachments > 0 && (
                          <div className={`mt-2 flex items-center gap-1 text-xs ${
                            msg.sender === 'You' ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            <Paperclip className="w-3 h-3" />
                            <span>{msg.attachments} attachment</span>
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                        msg.sender === 'You' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{msg.time}</span>
                        {msg.sender === 'You' && msg.read && (
                          <CheckCheck className="w-3 h-3 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Revere AI Suggestion */}
                <motion.div
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-r from-red-50 to-purple-50 border border-red-200 rounded-2xl px-4 py-3 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                        Revere Suggestion
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      "Thursday at 3 PM works well. I'll send the updated brief with Q4 projections."
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Use This
                      </button>
                      <button className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <div className="bg-gray-100 rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-2">
                      <Bot className="w-5 h-5 text-purple-600 animate-pulse" />
                      <span className="text-sm text-gray-500 flex-1">
                        {typingText}
                        <span className="animate-pulse">|</span>
                      </span>
                    </div>
                  </div>
                  <button className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white hover:shadow-lg transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white hover:shadow-lg transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>End-to-end encrypted</span>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <motion.div
              className="absolute -right-6 top-20 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl px-6 py-4 shadow-2xl"
              animate={prefersReducedMotion ? {} : {
                y: [0, -10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900" style={{ fontFamily: '"Corpline", sans-serif' }}>
                    99.9%
                  </div>
                  <div className="text-xs text-gray-600">Delivery Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-6 bottom-32 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl px-6 py-4 shadow-2xl"
              animate={prefersReducedMotion ? {} : {
                y: [0, 10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900" style={{ fontFamily: '"Corpline", sans-serif' }}>
                    &lt;100ms
                  </div>
                  <div className="text-xs text-gray-600">Response Time</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Feature List */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 50 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onMouseEnter={() => setActiveFeature(idx)}
                  className={`group relative overflow-hidden bg-white/60 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                    activeFeature === idx 
                      ? 'border-blue-500/50 shadow-2xl scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  {/* Gradient overlay on active */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-gray-900" style={{ fontFamily: '"Corpline", sans-serif' }}>
                            {feature.stat}
                          </span>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {feature.statLabel}
                          </span>
                        </div>
                        
                        <ArrowRight className={`w-5 h-5 text-gray-400 transition-all duration-300 ${
                          activeFeature === idx ? 'translate-x-1 text-blue-600' : ''
                        }`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom Feature Grid */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h3 
              className="text-4xl font-black text-gray-900 mb-4"
              style={{ fontFamily: '"Corpline", sans-serif' }}
            >
              Built for Government Relations
            </h3>
            <p className="text-gray-600 text-lg">
              Everything you need to manage legislative communications effectively
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Attachment Types */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Paperclip className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">
                  Rich Attachments
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Policy briefs & documents</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  <span>Images & infographics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Presentations & reports</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: '"Corpline", sans-serif' }}>
                  50MB
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  Maximum file size
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">
                  Enterprise Security
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>AES-256 encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Message history logs</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: '"Corpline", sans-serif' }}>
                  100%
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  Secure & private
                </div>
              </div>
            </div>

            {/* Revere Intelligence */}
            <div className="bg-gradient-to-br from-red-50 to-purple-50 border border-red-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">
                  Revere Powered
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Star className="w-4 h-4 text-amber-600" />
                  <span>Smart message drafting</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>Sentiment analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>Quick response suggestions</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-red-200">
                <div className="text-3xl font-black text-transparent bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text mb-1" style={{ fontFamily: '"Corpline", sans-serif' }}>
                  AI
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  Intelligent assistant
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-20"
        >
          <button className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">
              Start Messaging Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Join thousands of government relations professionals using Revere Messaging
          </p>
        </motion.div>
      </div>
    </section>
  );
}