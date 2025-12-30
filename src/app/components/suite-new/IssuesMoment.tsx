import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flag, TrendingUp, MapPin, Radio, Newspaper, Users, AlertTriangle, CheckCircle, BarChart3, Globe, Zap, Target, Calendar, Eye, Flame, MessageSquare, ThumbsUp, ThumbsDown, TrendingDown, Activity, Sparkles, Hash } from 'lucide-react';
import { Button } from '../ui/Button';
import { USMap } from './USMap';

const capabilities = [
  {
    title: 'Real-Time Media Monitoring',
    description: 'Track news, social media, blogs, and press releases mentioning your issues across all channels',
  },
  {
    title: 'Geographic Heat Mapping',
    description: 'Visualize where issues are gaining traction with interactive state and district-level maps',
  },
  {
    title: 'Sentiment Analysis',
    description: 'Pythia analyzes tone, urgency, and positioning across thousands of mentions',
  },
  {
    title: 'Stakeholder Tracking',
    description: 'Monitor who\'s talking about your issues—legislators, advocates, opposition, media',
  },
  {
    title: 'Trend Detection',
    description: 'AI identifies emerging narratives and momentum shifts before they go mainstream',
  },
  {
    title: 'Custom Alert Rules',
    description: 'Set triggers for spike detection, negative coverage, or key stakeholder activity',
  },
];

// Mock media mentions data
const MEDIA_MENTIONS = [
  {
    source: 'The Hill',
    headline: 'Senate Democrats push healthcare reform package',
    sentiment: 'neutral',
    timestamp: '2 hours ago',
    reach: '2.4M',
  },
  {
    source: 'Twitter/X',
    headline: '@SenatorSmith: "We need comprehensive healthcare reform now"',
    sentiment: 'positive',
    timestamp: '4 hours ago',
    reach: '487K',
  },
  {
    source: 'Fox News',
    headline: 'Republican leaders oppose healthcare overhaul proposal',
    sentiment: 'negative',
    timestamp: '6 hours ago',
    reach: '3.1M',
  },
  {
    source: 'Bloomberg',
    headline: 'Healthcare industry braces for major policy shift',
    sentiment: 'neutral',
    timestamp: '8 hours ago',
    reach: '1.8M',
  },
];

// Mock state activity data for heat map with full US coverage
const STATE_ACTIVITY = [
  { state: 'CA', name: 'California', activity: 92, mentions: 847, sentiment: 0.65, insight: 'Strong grassroots support in major metros. Healthcare providers alliance driving positive coverage. Recommend accelerating digital ad spend to maintain momentum through Q2.' },
  { state: 'TX', name: 'Texas', activity: 78, mentions: 621, sentiment: -0.42, insight: 'Conservative media pushing cost concerns. Dallas and Houston suburbs show mixed sentiment. Deploy patient testimonials and economic impact studies to counter negative narratives.' },
  { state: 'NY', name: 'New York', activity: 85, mentions: 734, sentiment: 0.51, insight: 'Urban centers strongly supportive. Upstate showing moderate activity. Leverage NYC success stories for national media strategy. Partner with labor unions for broader reach.' },
  { state: 'FL', name: 'Florida', activity: 71, mentions: 542, sentiment: -0.28, insight: 'Swing state showing partisan split. Seniors concerned about Medicare impacts. Target Tampa and Orlando markets with age-focused messaging. Counter misinformation on social platforms.' },
  { state: 'PA', name: 'Pennsylvania', activity: 68, mentions: 489, sentiment: 0.34, insight: 'Moderate positive sentiment in Philadelphia and Pittsburgh. Rural areas need attention. Deploy field teams to swing districts. Emphasize bipartisan support from local officials.' },
  { state: 'OH', name: 'Ohio', activity: 64, mentions: 412, sentiment: 0.18, insight: 'Battleground state with opportunity for growth. Cleveland showing momentum. Cincinnati more skeptical. Coordinate with manufacturing unions. Focus on job protection messaging.' },
  { state: 'IL', name: 'Illinois', activity: 73, mentions: 556, sentiment: 0.42, insight: 'Chicago driving majority of activity. Strong healthcare worker support. Downstate coverage limited. Expand outreach beyond Chicagoland. Amplify rural clinic success stories.' },
  { state: 'MI', name: 'Michigan', activity: 59, mentions: 387, sentiment: 0.22, insight: 'Detroit area moderately engaged. Auto industry cautiously supportive. Upper Peninsula quiet. Partner with UAW for broader coverage. Address employer mandate concerns proactively.' },
  { state: 'GA', name: 'Georgia', activity: 55, mentions: 312, sentiment: 0.15, insight: 'Atlanta metro showing growth potential. Suburban swing voters key demographic. Rural opposition organized. Increase digital targeting. Coordinate with faith leaders for community outreach.' },
  { state: 'NC', name: 'North Carolina', activity: 52, mentions: 289, sentiment: 0.08, insight: 'Research Triangle showing moderate support. Charlotte business community divided. Coastal regions need activation. Deploy academic partnerships. Emphasize innovation and research benefits.' },
  { state: 'AZ', name: 'Arizona', activity: 48, mentions: 267, sentiment: -0.12, insight: 'Phoenix suburbs critical battleground. Senior population skeptical. Tucson more supportive. Counter retirement security fears. Partner with AARP-affiliated groups for credibility.' },
  { state: 'WA', name: 'Washington', activity: 62, mentions: 398, sentiment: 0.58, insight: 'Seattle strongly supportive. Tech industry engaged. Eastern Washington oppositional. Leverage tech sector endorsements. Address rural healthcare access gaps in messaging.' },
  { state: 'MA', name: 'Massachusetts', activity: 58, mentions: 354, sentiment: 0.72, insight: 'Highest positive sentiment nationwide. Boston healthcare institutions leading advocacy. Use as national model. Amplify academic research. Package success metrics for other states.' },
  { state: 'VA', name: 'Virginia', activity: 51, mentions: 294, sentiment: 0.19, insight: 'Northern Virginia suburbs engaged. Richmond moderate. Southwest opposition. Target NoVA federal workforce. Emphasize bipartisan governor support. Address rural concerns.' },
  { state: 'WI', name: 'Wisconsin', activity: 47, mentions: 256, sentiment: 0.11, insight: 'Milwaukee positive, Madison very supportive. Rural areas resistant. Dairy farmers concerned about costs. Partner with agricultural co-ops. Frame as supporting family farms.' },
  { state: 'CO', name: 'Colorado', activity: 54, mentions: 318, sentiment: 0.38, insight: 'Denver metro driving activity. Outdoor recreation industry supportive. Rural Western Slope opposed. Leverage environmental health angle. Partner with ski resorts and tourism sector.' },
  { state: 'MN', name: 'Minnesota', activity: 49, mentions: 271, sentiment: 0.44, insight: 'Twin Cities strongly engaged. Mayo Clinic influence positive. Iron Range mixed. Utilize healthcare quality rankings. Coordinate with medical device manufacturers.' },
  { state: 'NV', name: 'Nevada', activity: 44, mentions: 234, sentiment: 0.06, insight: 'Las Vegas hospitality workers key demographic. Reno moderate. Rural counties resistant. Partner with Culinary Union. Address service industry healthcare gaps. Focus on affordability.' },
  { state: 'TN', name: 'Tennessee', activity: 41, mentions: 221, sentiment: -0.22, insight: 'Nashville healthcare sector engaged but cautious. Memphis moderate. Rural areas strongly opposed. Emphasize hospital system support. Address faith community concerns. Counter misinformation.' },
  { state: 'OR', name: 'Oregon', activity: 46, mentions: 248, sentiment: 0.51, insight: 'Portland very supportive. Eugene progressive messaging resonates. Eastern Oregon opposition. Leverage tech and outdoor industries. Address rural healthcare provider shortages.' },
  { state: 'IN', name: 'Indiana', activity: 38, mentions: 203, sentiment: -0.18, insight: 'Indianapolis moderately engaged. South Bend potential. Rural counties resistant. Manufacturing sector concerned about costs. Partner with Notre Dame for academic credibility.' },
  { state: 'SC', name: 'South Carolina', activity: 37, mentions: 194, sentiment: -0.31, insight: 'Charleston and Columbia showing activity. Rural Upstate strongly opposed. Coastal retirees mixed. Focus on veteran healthcare benefits. Partner with military installations.' },
  { state: 'MO', name: 'Missouri', activity: 39, mentions: 208, sentiment: -0.15, insight: 'St. Louis moderate support. Kansas City divided. Rural areas opposed. Healthcare systems cautiously supportive. Emphasize local control. Address agricultural community concerns.' },
  { state: 'AL', name: 'Alabama', activity: 32, mentions: 176, sentiment: -0.44, insight: 'Birmingham minimal activity. Montgomery political focus. Rural opposition organized. UAB medical center potential ally. Focus on Medicaid expansion benefits. Counter partisan framing.' },
  { state: 'LA', name: 'Louisiana', activity: 35, mentions: 187, sentiment: -0.38, insight: 'New Orleans moderate engagement. Baton Rouge political resistance. Oil industry concerns. Partner with healthcare providers. Emphasize disaster preparedness. Address coastal community needs.' },
  { state: 'KY', name: 'Kentucky', activity: 34, mentions: 181, sentiment: -0.29, insight: 'Louisville showing activity. Lexington university community supportive. Eastern Kentucky resistant. Coal country healthcare crisis leverage point. Partner with rural clinics.' },
  { state: 'CT', name: 'Connecticut', activity: 43, mentions: 228, sentiment: 0.55, insight: 'Hartford insurance industry engaged. New Haven academic support. Fairfield County affluent skepticism. Leverage Yale medical research. Address insurance industry concerns.' },
  { state: 'IA', name: 'Iowa', activity: 36, mentions: 191, sentiment: 0.09, insight: 'Des Moines moderate activity. Iowa City supportive. Rural farm communities concerned. Agricultural healthcare costs angle. Partner with University of Iowa. Emphasize rural access.' },
  { state: 'UT', name: 'Utah', activity: 40, mentions: 214, sentiment: -0.08, insight: 'Salt Lake City tech sector engaged. Provo conservative opposition. Rural areas resistant. Silicon Slopes potential ally. Address religious community concerns. Focus on family benefits.' },
  { state: 'NM', name: 'New Mexico', activity: 33, mentions: 178, sentiment: 0.28, insight: 'Albuquerque moderately supportive. Santa Fe progressive stronghold. Rural tribal lands critical. Partner with indigenous healthcare advocates. Address border region needs.' },
  { state: 'KS', name: 'Kansas', activity: 31, mentions: 168, sentiment: -0.21, insight: 'Kansas City suburbs divided. Wichita business community skeptical. Rural resistance strong. Healthcare systems potential partners. Address agricultural economy impacts. Emphasize choice.' },
  { state: 'AR', name: 'Arkansas', activity: 29, mentions: 159, sentiment: -0.35, insight: 'Little Rock minimal activity. Northwest corridor growth. Rural areas opposed. Walmart healthcare initiatives potential angle. Address Delta region healthcare deserts.' },
  { state: 'MS', name: 'Mississippi', activity: 28, mentions: 154, sentiment: -0.48, insight: 'Jackson limited engagement. Gulf Coast mixed. Deep South resistance. Healthcare crisis severity leverage point. Partner with community health centers. Address maternal health outcomes.' },
  { state: 'NE', name: 'Nebraska', activity: 30, mentions: 163, sentiment: -0.11, insight: 'Omaha moderate activity. Lincoln university support. Rural counties resistant. Agricultural healthcare consolidation concerns. Partner with UNMC. Emphasize rural provider support.' },
  { state: 'ID', name: 'Idaho', activity: 27, mentions: 148, sentiment: -0.41, insight: 'Boise tech sector cautiously interested. Northern rural opposition. Healthcare provider shortages critical. Focus on access crisis. Address libertarian concerns. Emphasize market solutions.' },
  { state: 'NH', name: 'New Hampshire', activity: 42, mentions: 224, sentiment: 0.32, insight: 'Portsmouth and Concord engaged. North Country healthcare access issues. Live Free or Die skepticism. Emphasize individual choice. Partner with Dartmouth medical. Address addiction crisis.' },
  { state: 'WV', name: 'West Virginia', activity: 26, mentions: 142, sentiment: -0.17, insight: 'Charleston minimal coverage. Coal country healthcare collapse. Opioid crisis leverage. Partner with rural hospitals. Emphasize Medicaid expansion success. Address economic transition.' },
  { state: 'HI', name: 'Hawaii', activity: 25, mentions: 137, sentiment: 0.61, insight: 'Honolulu strongly supportive. Neighbor islands moderate. Healthcare tourism concerns. Leverage universal coverage history. Address island accessibility challenges. Emphasize aloha values.' },
  { state: 'ME', name: 'Maine', activity: 24, mentions: 131, sentiment: 0.24, insight: 'Portland progressive support. Rural areas mixed. Aging population healthcare needs critical. Partner with coastal community health. Address seasonal economy impacts. Focus on senior benefits.' },
  { state: 'RI', name: 'Rhode Island', activity: 23, mentions: 126, sentiment: 0.48, insight: 'Providence healthcare sector engaged. Statewide support moderate. Small state advantage for grassroots. Partner with Brown University. Leverage compact size for outreach. Emphasize community.' },
  { state: 'MT', name: 'Montana', activity: 22, mentions: 119, sentiment: -0.06, insight: 'Missoula and Bozeman moderate support. Eastern plains resistant. Rural healthcare crisis severe. Partner with tribal healthcare systems. Address rancher community concerns. Focus on access.' },
  { state: 'DE', name: 'Delaware', activity: 21, mentions: 114, sentiment: 0.37, insight: 'Wilmington financial sector engaged. Dover political focus. Small state grassroots potential. Leverage Biden legacy connections. Address DuPont corridor concerns. Focus on affordability.' },
  { state: 'SD', name: 'South Dakota', activity: 20, mentions: 108, sentiment: -0.19, insight: 'Sioux Falls limited activity. Rural tribal lands critical. Agricultural opposition. Partner with IHS facilities. Address frontier healthcare challenges. Emphasize telehealth solutions.' },
  { state: 'ND', name: 'North Dakota', activity: 19, mentions: 103, sentiment: -0.14, insight: 'Fargo moderate engagement. Oil patch resistance. Tribal healthcare partnerships. Address energy industry concerns. Partner with UND medical school. Emphasize rural provider recruitment.' },
  { state: 'AK', name: 'Alaska', activity: 18, mentions: 98, sentiment: 0.03, insight: 'Anchorage divided sentiment. Bush communities healthcare deserts. Oil industry influence. Address unique geography challenges. Partner with native corporations. Emphasize telehealth critical role.' },
  { state: 'VT', name: 'Vermont', activity: 45, mentions: 241, sentiment: 0.68, insight: 'Burlington very progressive. Statewide single-payer history. Rural healthcare cooperative models. Leverage Sanders legacy. Partner with community health teams. National progressive model.' },
  { state: 'WY', name: 'Wyoming', activity: 17, mentions: 92, sentiment: -0.33, insight: 'Cheyenne minimal activity. Jackson Hole outlier support. Energy industry opposition. Healthcare provider shortage critical. Address rural access crisis. Focus on individual freedom framing.' },
];

export function IssuesMoment() {
  const [activeView, setActiveView] = useState<'overview' | 'media' | 'heatmap' | 'sentiment'>('overview');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="issues" className="py-32 px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-amber-50/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-50/30 to-transparent pointer-events-none" />
      
      {/* Animated background elements */}
      {/* Flowing background gradients - Orange/Red */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-orange-100/70 via-orange-50/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-red-100/60 via-red-50/40 to-transparent" />
        <div className="absolute top-1/3 right-1/3 w-3/4 h-3/4 bg-gradient-to-bl from-orange-50/50 via-red-50/30 to-red-100/40 blur-3xl" />
      </div>
      
      {/* Transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-red-50/20 to-green-50/30 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-6">
            <Hash className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Issues Intelligence</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Know When Your Issues
            <br />
            Are Moving.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time media monitoring, geographic heat mapping, sentiment analysis, and stakeholder tracking—all powered by Pythia to keep you ahead of the narrative.
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
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 border border-gray-200'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Issue Dashboard
          </button>
          <button
            onClick={() => setActiveView('media')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'media'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 border border-gray-200'
            }`}
          >
            <Radio className="w-4 h-4 inline mr-2" />
            Media Tracking
          </button>
          <button
            onClick={() => setActiveView('heatmap')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'heatmap'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 border border-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Heat Map
          </button>
          <button
            onClick={() => setActiveView('sentiment')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'sentiment'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 border border-gray-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Sentiment Analysis
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeView === 'overview' && <OverviewView key="overview" />}
          {activeView === 'media' && <MediaTrackingView key="media" />}
          {activeView === 'heatmap' && <HeatMapView key="heatmap" />}
          {activeView === 'sentiment' && <SentimentView key="sentiment" />}
        </AnimatePresence>

        {/* Capabilities Grid */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Complete Issues Intelligence System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredCard === index
                    ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 shadow-xl scale-105'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <CheckCircle className={`w-6 h-6 mb-3 transition-colors ${hoveredCard === index ? 'text-orange-600' : 'text-gray-400'}`} />
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
          className="flex items-center justify-center gap-4 mt-12"
        >
          <Button variant="secondary" size="sm">
            See an example
          </Button>
          <Button variant="secondary" size="sm">
            Learn more
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Issue Overview Dashboard
function OverviewView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        {/* Header Section with Taglines */}
        <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-orange-50/30 to-red-50/30 -m-8 p-8 rounded-t-[28px]">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Pythia doesn't just track issues. It measures momentum.
            </h3>
            <p className="text-base text-gray-700">
              Real-time scoring combines media mentions, stakeholder activity, sentiment, and geographic spread.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Healthcare Reform - Live Tracking</h3>
          <p className="text-sm text-gray-600">Comprehensive view of issue momentum, coverage, and stakeholder activity</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">MOMENTUM SCORE</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">78/100</div>
            <div className="text-xs text-orange-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +12 points this week
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">MEDIA MENTIONS</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">2,847</div>
            <div className="text-xs text-gray-600 mt-1">
              Last 7 days
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-green-700">SENTIMENT</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">+42%</div>
            <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              Majority positive
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">TOTAL REACH</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">42.8M</div>
            <div className="text-xs text-gray-600 mt-1">
              Estimated impressions
            </div>
          </motion.div>
        </div>

        {/* Trending Topics */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="mb-8"
        >
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-orange-600" />
            Trending Narratives
          </h4>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Medicare expansion</span>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-bold">HOT</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={prefersReducedMotion ? { width: '85%' } : { width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                    className="h-full bg-orange-500"
                  />
                </div>
                <span className="text-sm font-semibold text-orange-600">85%</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">1,247 mentions • +34% from yesterday</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Prescription drug pricing</span>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold">RISING</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={prefersReducedMotion ? { width: '67%' } : { width: 0 }}
                    animate={{ width: '67%' }}
                    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
                    className="h-full bg-yellow-500"
                  />
                </div>
                <span className="text-sm font-semibold text-yellow-600">67%</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">892 mentions • +18% from yesterday</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Pre-existing conditions coverage</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">STEADY</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={prefersReducedMotion ? { width: '52%' } : { width: 0 }}
                    animate={{ width: '52%' }}
                    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                    className="h-full bg-green-500"
                  />
                </div>
                <span className="text-sm font-semibold text-green-600">52%</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">708 mentions • +2% from yesterday</div>
            </div>
          </div>
        </motion.div>

        {/* Pythia Alert */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Pythia Momentum Alert</h4>
              <div className="text-sm text-gray-700 mb-4">
                <strong>Narrative Shift Detected:</strong> "Medicare expansion" jumped 34% in the last 24 hours. Senator Johnson's press conference drove 487 new mentions across major outlets. Momentum is accelerating.
              </div>
              <div className="text-sm text-gray-700 mb-4 space-y-1">
                <div><strong>Recommended Actions:</strong></div>
                <div>• Brief your allied legislators on coordinated messaging</div>
                <div>• Prep stakeholder talking points before opposition responds</div>
                <div>• Schedule media hits within 48 hours to ride momentum</div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                View Full Analysis
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Overview Description */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          Comprehensive issue tracking dashboard displays momentum score (0-100), total mentions across all sources, sentiment breakdown, geographic activity heat map, and top stakeholder engagement—all updated in real-time. Track multiple issues simultaneously with AI-powered trend detection and narrative shift alerts.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Media Tracking View
function MediaTrackingView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        {/* Header Section with Taglines */}
        <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-orange-50/30 to-red-50/30 -m-8 p-8 rounded-t-[28px]">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Pythia doesn't just scan headlines. It reads the entire narrative.
            </h3>
            <p className="text-base text-gray-700">
              Real-time monitoring across news, social media, blogs, and press releases—with sentiment scoring.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">Real-Time Media Monitoring</h3>
            <div className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live
            </div>
          </div>
          <p className="text-sm text-gray-600">Tracking mentions across news, social media, blogs, and press releases</p>
        </div>

        {/* Media Source Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="p-4 rounded-xl bg-white border border-gray-200 text-center"
          >
            <Newspaper className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-xs text-gray-500">News Articles</div>
          </motion.div>
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="p-4 rounded-xl bg-white border border-gray-200 text-center"
          >
            <MessageSquare className="w-6 h-6 text-sky-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,092</div>
            <div className="text-xs text-gray-500">Social Posts</div>
          </motion.div>
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="p-4 rounded-xl bg-white border border-gray-200 text-center"
          >
            <Radio className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">342</div>
            <div className="text-xs text-gray-500">Broadcast</div>
          </motion.div>
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="p-4 rounded-xl bg-white border border-gray-200 text-center"
          >
            <Globe className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">166</div>
            <div className="text-xs text-gray-500">Blogs & Opinion</div>
          </motion.div>
        </div>

        {/* Recent Mentions Feed */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Recent Mentions</h4>
          <div className="space-y-3">
            {MEDIA_MENTIONS.map((mention, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 + index * 0.1 }}
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{mention.source}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{mention.timestamp}</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{mention.headline}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {mention.reach} reach
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    mention.sentiment === 'positive' 
                      ? 'bg-green-100 text-green-700'
                      : mention.sentiment === 'negative'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {mention.sentiment === 'positive' && <ThumbsUp className="w-3 h-3 inline mr-1" />}
                    {mention.sentiment === 'negative' && <ThumbsDown className="w-3 h-3 inline mr-1" />}
                    {mention.sentiment.toUpperCase()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alert Configuration */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
          className="p-4 rounded-xl bg-blue-50 border border-blue-200"
        >
          <div className="flex items-center gap-2 text-sm text-blue-900">
            <Zap className="w-4 h-4" />
            <span><strong>Custom Alerts Active:</strong> Email + Slack notifications for spikes &gt;20%, negative sentiment from major outlets, mentions by key legislators</span>
          </div>
        </motion.div>
      </div>

      {/* Media Tracking Description */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          Real-time media monitoring tracks your issue across news outlets, social media platforms (Twitter/X, Facebook, Instagram), blogs, and press releases with live updates. Each mention includes source, headline, timestamp, reach estimate, and Pythia sentiment analysis (Positive/Negative/Neutral) with custom alert rules for spike detection.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Heat Map View
function HeatMapView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12"
    >
      {/* Header Section with Taglines */}
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-orange-50/30 to-red-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't just monitor nationwide. It pinpoints where to act.
          </h3>
          <p className="text-base text-gray-700">
            Real-time state-level heat mapping shows momentum, identifies opportunities, and guides resource deployment—strategically.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Geographic Intelligence</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time state-level tracking powered by Pythia—see where your issue is gaining momentum, 
            identify opportunities, and deploy resources strategically.
          </p>
        </div>

        {/* Interactive US Heat Map */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <USMap stateData={STATE_ACTIVITY} />
        </motion.div>

        {/* Key Insights Grid */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-xs font-bold text-green-700">STRONGEST MOMENTUM</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">California</div>
            <div className="text-sm text-gray-700 mb-3">92% activity • 847 mentions</div>
            <div className="text-xs text-gray-600 leading-relaxed">
              Strong grassroots support in major metros. Healthcare providers alliance driving positive coverage.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-bold text-orange-700">OPPORTUNITY ZONE</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">Pennsylvania</div>
            <div className="text-sm text-gray-700 mb-3">68% activity • 489 mentions</div>
            <div className="text-xs text-gray-600 leading-relaxed">
              Moderate positive sentiment in key metros. Deploy field teams to swing districts for maximum impact.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-xs font-bold text-red-700">NEEDS ATTENTION</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">Texas</div>
            <div className="text-sm text-gray-700 mb-3">78% activity • 621 mentions</div>
            <div className="text-xs text-gray-600 leading-relaxed">
              Conservative media pushing cost concerns. Deploy patient testimonials and economic impact studies.
            </div>
          </div>
        </motion.div>

        {/* Top States Leaderboard */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-900">Top 10 States by Activity</h4>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">Sorted by:</div>
              <select className="text-sm font-medium text-gray-900 border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>Activity Score</option>
                <option>Total Mentions</option>
                <option>Sentiment</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
          {STATE_ACTIVITY.sort((a, b) => b.activity - a.activity).slice(0, 10).map((state, index) => (
            <motion.div
              key={state.state}
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 + index * 0.05 }}
              className="group relative p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50 hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                  index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400' :
                  'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}>
                  #{index + 1}
                </div>

                {/* State Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-900">{state.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-white border border-gray-300 rounded-full text-gray-600 font-medium">
                      {state.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {state.mentions} mentions
                    </span>
                    <span className="flex items-center gap-1">
                      {state.sentiment > 0 ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-green-600 font-medium">
                            +{(state.sentiment * 100).toFixed(0)}% sentiment
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 text-red-600" />
                          <span className="text-red-600 font-medium">
                            {(state.sentiment * 100).toFixed(0)}% sentiment
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Activity Score */}
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">{state.activity}</div>
                  <div className="text-xs text-gray-500 font-medium">SCORE</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={prefersReducedMotion ? { width: `${state.activity}%` } : { width: 0 }}
                  animate={{ width: `${state.activity}%` }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 + index * 0.05 }}
                  className={`h-full ${
                    state.activity >= 85 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                    state.activity >= 70 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                    state.activity >= 55 ? 'bg-gradient-to-r from-orange-300 to-orange-400' :
                    'bg-gradient-to-r from-orange-200 to-orange-300'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pythia Recommendations */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 border-2 border-purple-200 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-purple-900">PYTHIA STRATEGIC RECOMMENDATIONS</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              1
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Capitalize on California momentum:</strong> Strong grassroots support + healthcare provider alliances. 
              Accelerate digital ad spend to maintain Q2 momentum through November.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              2
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Deploy resources to Pennsylvania swing districts:</strong> Moderate positive sentiment in Philadelphia/Pittsburgh. 
              Field teams + bipartisan messaging = high ROI opportunity.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              3
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Counter Texas negative narratives immediately:</strong> Conservative media driving cost concerns. 
              Launch patient testimonial campaign + economic impact studies in Dallas/Houston suburbs.
            </p>
          </div>
          </div>
        </motion.div>

        {/* Heat Map Description */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mt-8"
        >
          <p className="text-gray-600 leading-relaxed">
            Interactive U.S. heat map displays real-time state-level activity scores (0-100), total mentions, sentiment analysis, and strategic recommendations. Hover over any state for detailed insights including activity breakdown, momentum trends, and Pythia-powered deployment strategies tailored to local conditions.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Sentiment Analysis View
function SentimentView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        {/* Header Section with Taglines */}
        <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-orange-50/30 to-red-50/30 -m-8 p-8 rounded-t-[28px]">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Pythia doesn't just count mentions. It reads the room.
            </h3>
            <p className="text-base text-gray-700">
              AI analyzes tone, urgency, and positioning across thousands of sources in real-time.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Pythia Sentiment Analysis</h3>
          <p className="text-sm text-gray-600">AI-powered analysis of tone, positioning, and narrative framing across all mentions</p>
        </div>

        {/* Overall Sentiment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200"
          >
            <ThumbsUp className="w-8 h-8 text-green-600 mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">42%</div>
            <div className="text-sm font-medium text-green-700">Positive</div>
            <div className="text-xs text-gray-600 mt-2">1,196 mentions</div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200"
          >
            <MessageSquare className="w-8 h-8 text-gray-600 mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">37%</div>
            <div className="text-sm font-medium text-gray-700">Neutral</div>
            <div className="text-xs text-gray-600 mt-2">1,053 mentions</div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200"
          >
            <ThumbsDown className="w-8 h-8 text-red-600 mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">21%</div>
            <div className="text-sm font-medium text-red-700">Negative</div>
            <div className="text-xs text-gray-600 mt-2">598 mentions</div>
          </motion.div>
        </div>

        {/* Sentiment by Source Type */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">Sentiment by Source</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Traditional News</span>
                <span className="text-xs text-green-600 font-bold">+28% positive</span>
              </div>
              <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={prefersReducedMotion ? { width: '48%' } : { width: 0 }}
                  animate={{ width: '48%' }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  className="bg-green-500"
                />
                <motion.div
                  initial={prefersReducedMotion ? { width: '32%' } : { width: 0 }}
                  animate={{ width: '32%' }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                  className="bg-gray-400"
                />
                <motion.div
                  initial={prefersReducedMotion ? { width: '20%' } : { width: 0 }}
                  animate={{ width: '20%' }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                  className="bg-red-500"
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>48% positive</span>
                <span>32% neutral</span>
                <span>20% negative</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Social Media</span>
                <span className="text-xs text-green-600 font-bold">+18% positive</span>
              </div>
              <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={prefersReducedMotion ? { width: '39%' } : { width: 0 }}
                  animate={{ width: '39%' }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
                  className="bg-green-500"
                />
                <motion.div
                  initial={prefersReducedMotion ? { width: '40%' } : { width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                  className="bg-gray-400"
                />
                <motion.div
                  initial={prefersReducedMotion ? { width: '21%' } : { width: 0 }}
                  animate={{ width: '21%' }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
                  className="bg-red-500"
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>39% positive</span>
                <span>40% neutral</span>
                <span>21% negative</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Opinion & Blogs</span>
                <span className="text-xs text-red-600 font-bold">-8% negative</span>
              </div>
              <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={prefersReducedMotion ? { width: '34%' } : { width: 0 }}
                  animate={{ width: '34%' }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
                  className="bg-green-500"
                />
                <motion.div
                  initial={prefersReducedMotion ? { width: '38%' } : { width: 0 }}
                  animate={{ width: '38%' }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
                  className="bg-gray-400"
                />
                <motion.div
                  initial={prefersReducedMotion ? { width: '28%' } : { width: 0 }}
                  animate={{ width: '28%' }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
                  className="bg-red-500"
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>34% positive</span>
                <span>38% neutral</span>
                <span>28% negative</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Opposition Narratives */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.3 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Opposition Narrative Alert</h4>
              <div className="text-sm text-gray-700 mb-3">
                <strong>Pythia Detection:</strong> Conservative media outlets and think tanks are pushing "cost concerns" and "government overreach" narratives. 28% of negative mentions use this framing.
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <div><strong>Recommended Response:</strong></div>
                <div>• Deploy cost-savings research and CBO analysis to allied media</div>
                <div>• Brief supporters on countering "overreach" with patient stories</div>
                <div>• Monitor for coordinated campaigns—Pythia detects similar language patterns</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sentiment Analysis Description */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          Pythia sentiment analysis uses natural language processing to categorize every mention as Positive, Negative, or Neutral with percentage breakdowns and trend tracking. Analyze sentiment by source type (news vs. social), region, stakeholder group, and time period—with narrative framing detection to identify coordinated messaging patterns and opposition talking points.
        </p>
      </motion.div>
    </motion.div>
  );
}