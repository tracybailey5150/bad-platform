import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG)                                                 */
/* ------------------------------------------------------------------ */
function GearIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.212-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PuzzleIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Mockup Component (preserved, not rendered)               */
/* ------------------------------------------------------------------ */
function DashboardMockup() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-bad-border bg-bad-card p-5 shadow-2xl shadow-bad-blue/5">
      {/* Top bar */}
      <div className="flex items-center gap-2 mb-5">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-auto text-[11px] text-bad-gray font-medium tracking-wide">BAD Dashboard</span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-lg bg-bad-bg/80 border border-bad-border p-3">
          <p className="text-[11px] text-bad-gray mb-1 uppercase tracking-wider">Leads Today</p>
          <p className="text-2xl font-bold text-bad-light">47</p>
          <p className="text-xs text-green-400 font-medium mt-0.5">+24% vs avg</p>
        </div>
        <div className="rounded-lg bg-bad-bg/80 border border-bad-border p-3">
          <p className="text-[11px] text-bad-gray mb-1 uppercase tracking-wider">Automations</p>
          <p className="text-2xl font-bold text-bad-light">12</p>
          <p className="text-xs text-bad-blue font-medium mt-0.5">Active</p>
        </div>
      </div>

      {/* Workflow status */}
      <div className="space-y-3">
        <p className="text-[11px] text-bad-gray uppercase tracking-wider font-medium">Workflow Status</p>
        {[
          { label: 'Lead Intake', pct: 92, color: 'bg-bad-blue' },
          { label: 'Proposal Gen', pct: 78, color: 'bg-bad-blue' },
          { label: 'Follow-ups', pct: 65, color: 'bg-amber-500' },
          { label: 'Onboarding', pct: 88, color: 'bg-green-500' },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-bad-light/80">{item.label}</span>
              <span className="text-bad-gray">{item.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-bad-bg/80">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-5 pt-4 border-t border-bad-border">
        <p className="text-[11px] text-bad-gray uppercase tracking-wider font-medium mb-2">Recent Activity</p>
        <div className="space-y-1.5">
          {[
            'New lead: Atlas HVAC — $12k est.',
            'Proposal sent — Greenfield AV',
            'Automation triggered: follow-up',
          ].map((a) => (
            <p key={a} className="text-xs text-bad-light/60 truncate">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-bad-blue mr-2 align-middle" />
              {a}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Solutions data                                                     */
/* ------------------------------------------------------------------ */
const solutions = [
  {
    title: 'Lead Response & Automation',
    desc: 'Capture, qualify, score, and route leads the moment they come in. AI-powered follow-up sequences and smart intake forms that never let a prospect slip through the cracks.',
    bullets: ['Instant lead capture & routing', 'AI-drafted follow-up emails', 'Smart scoring & prioritization', 'CRM integration'],
    icon: <InboxIcon />,
  },
  {
    title: 'Workflow & Operations',
    desc: 'Replace spreadsheets and manual tracking with custom workflow systems built around how your team actually works. Tasks, approvals, status boards, and automated handoffs.',
    bullets: ['Custom task management', 'Automated approval chains', 'Real-time status boards', 'Team notification flows'],
    icon: <WorkflowIcon />,
  },
  {
    title: 'Scheduling & Intake',
    desc: 'Client-facing booking pages, custom intake forms, automated reminders, and calendar management. All branded to your business, all connected to your systems.',
    bullets: ['Branded booking pages', 'Custom intake forms', 'Automated reminders & confirmations', 'Calendar sync'],
    icon: <CalendarIcon />,
  },
  {
    title: 'Dashboards, Reporting & Analytics',
    desc: 'Real-time KPIs, operational dashboards, analytics, and reporting platforms that give owners and managers actual visibility into what matters — trends, performance, and where to focus next.',
    bullets: ['Real-time KPI tracking & analytics', 'Trend analysis & forecasting', 'Custom report builders', 'Team performance & revenue views'],
    icon: <DashboardIcon />,
  },
  {
    title: 'AI Integration & Consulting',
    desc: 'Strategic AI integration that actually makes sense for your business. Not chatbot gimmicks -- real AI that drafts proposals, extracts data, routes work, and saves hours.',
    bullets: ['Document & data extraction', 'AI-drafted communications', 'Intelligent routing & triage', 'Workflow recommendations'],
    icon: <BrainIcon />,
  },
];

/* ------------------------------------------------------------------ */
/*  Portfolio data                                                     */
/* ------------------------------------------------------------------ */
const portfolio = [
  {
    name: 'AgentPilot',
    desc: 'AI-powered lead automation and client engagement platform for service businesses.',
    tag: 'Lead Automation',
  },
  {
    name: 'DFO',
    desc: 'Field operations management with JSA reports, issue tracking, and crew coordination.',
    tag: 'Field Ops',
  },
  {
    name: 'AV Orchestrator',
    desc: 'Enterprise AV system management with room control, device monitoring, and presentations.',
    tag: 'Enterprise AV',
  },
  {
    name: 'DSD',
    desc: 'Digital signage content operations platform for enterprise display networks.',
    tag: 'Digital Signage',
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bad-bg text-bad-light relative">
      {/* ── Background Effects ──────────────────────────────────── */}
      <div className="foil-shimmer" />
      <div className="bg-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${Math.random() * 100}%`,
              width: `${3 + Math.random() * 6}px`,
              height: `${3 + Math.random() * 6}px`,
              animationDuration: `${8 + Math.random() * 16}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-black border-b border-bad-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <img src="/bad-logo.png" alt="BAD" className="h-16" />
            <div className="hidden sm:block border-l border-bad-border pl-4">
              <div className="text-[11px] font-semibold text-bad-light tracking-widest uppercase leading-tight">Business Automation & Development</div>
              <div className="text-[10px] text-bad-blue tracking-wider">AI Integration · Analytics · Consulting</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Solutions', 'How We Work', 'Portfolio', 'About', 'Contact'].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-bad-gray hover:text-bad-light transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="px-5 py-2 text-sm font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-colors"
          >
            Book a Call
          </a>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Analytics-style chart background with realistic ups and downs */}
        <svg className="growth-line" viewBox="0 0 1200 300" preserveAspectRatio="none">
          {/* Main analytics line — volatile with overall upward trend */}
          <path d="M0,260 L40,250 L80,265 L120,240 L160,255 L200,230 L240,245 L280,220 L320,235 L360,200 L400,215 L440,190 L480,210 L520,180 L560,195 L600,165 L640,185 L680,155 L720,170 L760,140 L800,160 L840,130 L880,145 L920,115 L960,135 L1000,100 L1040,120 L1080,85 L1120,95 L1160,60 L1200,40" fill="none" stroke="#2563EB" strokeWidth="2.5" />
          {/* Gradient fill under the line */}
          <path d="M0,260 L40,250 L80,265 L120,240 L160,255 L200,230 L240,245 L280,220 L320,235 L360,200 L400,215 L440,190 L480,210 L520,180 L560,195 L600,165 L640,185 L680,155 L720,170 L760,140 L800,160 L840,130 L880,145 L920,115 L960,135 L1000,100 L1040,120 L1080,85 L1120,95 L1160,60 L1200,40 L1200,300 L0,300 Z" fill="url(#chartGradient)" />
          {/* Secondary line — smoother moving average */}
          <path d="M0,265 C100,255 200,240 300,230 C400,215 500,200 600,180 C700,160 800,145 900,125 C1000,110 1100,80 1200,50" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="6 4" />
          {/* Data points on the peaks */}
          <circle cx="360" cy="200" r="3" fill="#2563EB" />
          <circle cx="520" cy="180" r="3" fill="#2563EB" />
          <circle cx="680" cy="155" r="3" fill="#2563EB" />
          <circle cx="920" cy="115" r="3" fill="#2563EB" />
          <circle cx="1160" cy="60" r="4" fill="#2563EB" />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bad-blue/10 border border-bad-blue/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-bad-blue animate-pulse" />
              <span className="text-xs font-medium text-bad-blue tracking-wide">Business Automation & AI Consulting</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight">
              We Build the Systems{' '}
              <span className="bg-gradient-to-r from-bad-blue to-blue-400 bg-clip-text text-transparent">
                Your Business
              </span>{' '}
              Actually Needs
            </h1>
            <p className="mt-7 text-lg lg:text-xl text-bad-gray max-w-xl mx-auto lg:mx-0 leading-relaxed">
              We consult and build custom workflows for executives, multi-business owners, and small to medium-size businesses. Custom software, workflow automation, AI integration, and consulting for organizations tired of duct-taping spreadsheets and disconnected tools together.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#contact"
                className="px-8 py-3.5 text-sm font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-all shadow-lg shadow-bad-blue/25 hover:shadow-bad-blue/40"
              >
                Book a Discovery Call
              </a>
              <a
                href="#portfolio"
                className="px-8 py-3.5 text-sm font-semibold border border-bad-border text-bad-light hover:border-bad-blue/40 hover:bg-bad-card rounded-lg transition-colors"
              >
                See Our Work
              </a>
            </div>
            <p className="mt-8 text-sm text-bad-gray/70">
              Custom software for businesses that demand better
            </p>
          </div>

          {/* Right — Solutions showcase image */}
          <div className="flex-shrink-0 w-full max-w-xl lg:max-w-2xl flex justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-bad-border/50 shadow-2xl shadow-bad-blue/10">
              <img src="/bad-hero-solutions.png" alt="What BAD Builds — Lead Response, CRM Integration, Workflow, Scheduling, Dashboards, AI" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics Bar ──────────────────────────────────────────── */}
      <section className="border-y border-bad-border bg-bad-card/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: '12+', label: 'Custom Platforms Built' },
              { value: '146k+', label: 'Lines of Production Code' },
              { value: '6', label: 'Industries Served' },
              { value: 'AI', label: 'Powered Workflows' },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-bad-blue to-blue-400 bg-clip-text text-transparent">
                  {m.value}
                </p>
                <p className="text-sm text-bad-gray mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CEO Quotes ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-center text-xs font-semibold text-bad-blue tracking-widest uppercase mb-12">What CEOs of Fortune 500 Companies Are Saying</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "If you are not using this technology now, you won't be in business in two years.",
              name: "Jensen Huang",
              title: "CEO, NVIDIA",
            },
            {
              quote: "AI is probably the most important thing humanity has ever worked on. I think of it as something more profound than electricity or fire.",
              name: "Sundar Pichai",
              title: "CEO, Google",
            },
            {
              quote: "The businesses that will thrive are the ones that figure out how to use AI to do things that were previously impossible.",
              name: "Satya Nadella",
              title: "CEO, Microsoft",
            },
          ].map((q) => (
            <div key={q.name} className="relative p-8 rounded-xl bg-bad-card/60 border border-bad-border hover:border-bad-blue/30 transition-colors">
              <div className="text-5xl text-bad-blue/20 font-serif absolute top-4 left-6">&ldquo;</div>
              <p className="text-sm text-bad-light/90 leading-relaxed italic mt-6 mb-6">{q.quote}</p>
              <div className="border-t border-bad-border pt-4">
                <p className="text-sm font-semibold text-bad-light">{q.name}</p>
                <p className="text-xs text-bad-gray">{q.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Problem ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Your Business Runs on Manual Work.{' '}
            <span className="bg-gradient-to-r from-bad-blue to-blue-400 bg-clip-text text-transparent">
              It Doesn&apos;t Have To.
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              emoji: '01',
              title: 'Leads fall through the cracks',
              desc: 'No follow-up system. No lead scoring. Prospects go cold because nobody got back to them in time.',
            },
            {
              emoji: '02',
              title: 'Your team tracks everything in spreadsheets',
              desc: 'No real-time visibility. No accountability. Status updates require a meeting or a phone call.',
            },
            {
              emoji: '03',
              title: "You're paying for 6 tools that don't talk to each other",
              desc: 'Data lives in silos. Manual copy-paste between systems. No single source of truth.',
            },
          ].map((pain) => (
            <div
              key={pain.title}
              className="p-8 rounded-2xl bg-bad-card border border-bad-border hover:border-bad-blue/30 transition-all group"
              style={{ boxShadow: '0 0 40px rgba(37, 99, 235, 0.03)' }}
            >
              <span className="inline-block text-sm font-bold text-bad-blue/60 mb-4">{pain.emoji}</span>
              <h3 className="text-lg font-semibold text-bad-light mb-3">{pain.title}</h3>
              <p className="text-sm text-bad-gray leading-relaxed">{pain.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <p className="text-xl lg:text-2xl font-semibold text-bad-light">
            BAD fixes this. We design and build <span className="text-bad-blue">the system</span> -- not just another tool.
          </p>
        </div>
      </section>

      {/* ── Solutions ────────────────────────────────────────────── */}
      <section id="solutions" className="bg-bad-card/30 border-y border-bad-border">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
              What We Build
            </h2>
            <p className="text-lg text-bad-gray">
              From lead capture to AI integration, we build complete systems that replace manual work and disconnected tools.
            </p>
          </div>

          <div className="space-y-20 lg:space-y-28">
            {solutions.map((s, i) => (
              <div
                key={s.title}
                className={`flex flex-col gap-10 lg:gap-16 items-center ${
                  i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Text side */}
                <div className="flex-1">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-bad-blue/10 text-bad-blue mb-6">
                    {s.icon}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-bad-light mb-4">{s.title}</h3>
                  <p className="text-bad-gray leading-relaxed mb-6">{s.desc}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm text-bad-light/80">
                        <svg className="w-4 h-4 text-bad-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Visual side */}
                <div className="flex-1 w-full max-w-md">
                  <div
                    className="w-full aspect-[4/3] rounded-2xl bg-bad-card border border-bad-border flex items-center justify-center"
                    style={{ boxShadow: '0 0 60px rgba(37, 99, 235, 0.06)' }}
                  >
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-bad-blue/10 text-bad-blue scale-150">
                      {s.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Work ──────────────────────────────────────────── */}
      <section id="how-we-work" className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            How We Work
          </h2>
          <p className="text-lg text-bad-gray">
            A consulting-led process that starts with understanding your business, not selling you software.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              step: '01',
              title: 'Discovery',
              desc: 'We sit down with executives and business owners to audit current workflows, tools, and pain points. Whether you run one company or ten — we learn how your operations actually work before proposing anything.',
            },
            {
              step: '02',
              title: 'Design & Build',
              desc: 'We architect and build custom systems around how your business actually operates. Every feature exists because your workflow needs it.',
            },
            {
              step: '03',
              title: 'Launch & Support',
              desc: 'We deploy, train your team, and provide ongoing optimization. Your system evolves as your business grows.',
            },
          ].map((s) => (
            <div key={s.step} className="relative p-8 rounded-2xl bg-bad-card border border-bad-border hover:border-bad-blue/30 transition-all group">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-bad-blue/10 border-2 border-bad-blue/30 mb-6">
                <span className="text-lg font-bold text-bad-blue">{s.step}</span>
              </div>
              <h3 className="text-xl font-bold text-bad-light mb-3">{s.title}</h3>
              <p className="text-sm text-bad-gray leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Portfolio ────────────────────────────────────────────── */}
      <section id="portfolio" className="bg-bad-card/30 border-y border-bad-border">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
              Systems We&apos;ve Built
            </h2>
            <p className="text-lg text-bad-gray">
              Real platforms built for real businesses. Not templates -- custom systems designed around specific workflows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {portfolio.map((p) => (
              <div
                key={p.name}
                className="p-8 rounded-2xl bg-bad-card border border-bad-border hover:border-bad-blue/30 transition-all group"
                style={{ boxShadow: '0 0 40px rgba(37, 99, 235, 0.03)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-bad-light">{p.name}</h3>
                  <span className="text-xs font-medium text-bad-blue bg-bad-blue/10 px-3 py-1 rounded-full">
                    {p.tag}
                  </span>
                </div>
                <p className="text-sm text-bad-gray leading-relaxed mb-5">{p.desc}</p>
                <span className="text-sm font-medium text-bad-blue group-hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                  View Project
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tracy Bailey ─────────────────────────────────────────── */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          {/* Avatar / Initials */}
          <div className="flex-shrink-0">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-bad-blue to-blue-400 flex items-center justify-center shadow-lg shadow-bad-blue/20">
              <span className="text-4xl font-bold text-white">TB</span>
            </div>
          </div>
          {/* Info */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Tracy Bailey</h2>
            <p className="text-bad-blue font-semibold text-sm tracking-wide mb-6">
              Business Automation Developer & AI Solutions Consultant
            </p>
            <p className="text-bad-gray leading-relaxed mb-6 max-w-lg">
              Tracy consults with executives and business owners to design and build custom systems that replace manual work with automation. From single-location service companies to multi-business operators managing complex portfolios — BAD delivers software and workflows that actually work.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
              <a href="mailto:tracy@badsaas.app" className="text-bad-gray hover:text-bad-light transition-colors">
                tracy@badsaas.app
              </a>
              <a href="tel:4796706073" className="text-bad-gray hover:text-bad-light transition-colors">
                (479) 670-6073
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section id="contact" className="border-y border-bad-border">
        <div className="max-w-7xl mx-auto px-6 py-28 lg:py-36 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Stop Managing Your Business{' '}
            <span className="bg-gradient-to-r from-bad-blue to-blue-400 bg-clip-text text-transparent">
              in Spreadsheets
            </span>
          </h2>
          <p className="text-lg text-bad-gray mb-10 max-w-2xl mx-auto leading-relaxed">
            Book a free 30-minute workflow review. We&apos;ll map your biggest bottleneck and show you exactly how to fix it.
          </p>
          <a
            href="mailto:tracy@badsaas.app"
            className="inline-block px-10 py-4 text-base font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-all shadow-lg shadow-bad-blue/25 hover:shadow-bad-blue/40"
          >
            Book a Discovery Call
          </a>
          <p className="mt-6 text-sm text-bad-gray/60">
            No commitment. No pitch deck. Just solutions.
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-black border-t border-bad-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src="/bad-logo-transparent.png" alt="BAD" className="h-7" />
              <span className="text-xs text-bad-gray">
                &copy; 2026 BAD &mdash; Business Automation & Development
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-bad-gray">
              {[
                { label: 'Solutions', href: '#solutions' },
                { label: 'How We Work', href: '#how-we-work' },
                { label: 'Portfolio', href: '#portfolio' },
                { label: 'About', href: '#about' },
                { label: 'Contact', href: '#contact' },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="hover:text-bad-light transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-bad-gray/50 mt-8">www.badsaas.app</p>
        </div>
      </footer>
    </div>
  );
}
