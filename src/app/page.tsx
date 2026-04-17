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

/* ------------------------------------------------------------------ */
/*  Dashboard Mockup Component                                         */
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
/*  Pillars                                                            */
/* ------------------------------------------------------------------ */
const pillars = [
  { title: 'AUTOMATION', desc: 'Streamline processes and eliminate busywork.', icon: <GearIcon /> },
  { title: 'INTEGRATION', desc: 'Connect your tools and data seamlessly.', icon: <PuzzleIcon /> },
  { title: 'VISIBILITY', desc: 'Real-time insights that drive better decisions.', icon: <ChartIcon /> },
  { title: 'GROWTH', desc: 'Scale your business with confidence.', icon: <RocketIcon /> },
];

/* ------------------------------------------------------------------ */
/*  Solutions                                                          */
/* ------------------------------------------------------------------ */
const solutions = [
  {
    title: 'Lead Response System',
    desc: 'Capture, score, and route leads from multiple sources. Never miss a prospect with automated intake and instant notifications.',
    icon: <InboxIcon />,
  },
  {
    title: 'Operations Workflow App',
    desc: 'Tasks, approvals, and internal workflow management. Keep your team aligned and projects moving forward.',
    icon: <WorkflowIcon />,
  },
  {
    title: 'Scheduling & Intake System',
    desc: 'Public booking pages, custom intake forms, automated reminders, and calendar management.',
    icon: <CalendarIcon />,
  },
  {
    title: 'Dashboard / Orchestration Platform',
    desc: 'Real-time KPIs, reporting, and full operational orchestration. Data-driven decisions at a glance.',
    icon: <DashboardIcon />,
  },
];

/* ------------------------------------------------------------------ */
/*  Industries                                                         */
/* ------------------------------------------------------------------ */
const industries = [
  'HVAC',
  'AV Integration',
  'Construction',
  'Real Estate',
  'Field Services',
  'Professional Services',
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bad-bg text-bad-light">
      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-bad-bg/90 backdrop-blur-md border-b border-bad-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-10">
            <img src="/bad-logo-transparent.png" alt="BAD" className="h-8" />
            <div className="hidden md:flex items-center gap-6">
              {['Solutions', 'Modules', 'Industries', 'About', 'Contact'].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="text-sm text-bad-gray hover:text-bad-light transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
          <Link
            href="/signup"
            className="px-5 py-2 text-sm font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Custom Business Apps.
              <br />
              Smarter Workflows.
              <br />
              <span className="text-bad-blue">Real Results.</span>
            </h1>
            <p className="mt-6 text-lg text-bad-gray max-w-xl mx-auto lg:mx-0 leading-relaxed">
              BAD builds AI-assisted software, automation systems, and custom
              applications that help businesses work smarter and grow faster.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#solutions"
                className="px-7 py-3 text-sm font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-colors shadow-lg shadow-bad-blue/20"
              >
                Explore Solutions
              </a>
              <a
                href="#contact"
                className="px-7 py-3 text-sm font-semibold border border-bad-border text-bad-light hover:bg-bad-card rounded-lg transition-colors"
              >
                Book a Discovery Call
              </a>
            </div>
          </div>

          {/* Right — Dashboard mockup */}
          <div className="flex-shrink-0 w-full max-w-md lg:max-w-lg flex justify-center">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── What BAD Delivers ────────────────────────────────────── */}
      <section className="bg-bad-card/40 border-y border-bad-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 tracking-tight">
            What BAD Delivers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((p) => (
              <div key={p.title} className="text-center">
                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-bad-blue/10 text-bad-blue mb-4">
                  {p.icon}
                </div>
                <h3 className="text-sm font-bold tracking-widest text-bad-light mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-bad-gray leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solutions ────────────────────────────────────────────── */}
      <section id="solutions" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 tracking-tight">
          Solutions
        </h2>
        <p className="text-bad-gray text-center mb-14 max-w-2xl mx-auto">
          Purpose-built modules designed to handle the real workflows your business runs on every day.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {solutions.map((s) => (
            <div
              key={s.title}
              className="p-7 rounded-xl bg-bad-card border border-bad-border hover:border-bad-blue/40 transition-colors group"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-bad-blue/10 text-bad-blue mb-4 group-hover:bg-bad-blue/20 transition-colors">
                {s.icon}
              </div>
              <h3 className="text-lg font-semibold text-bad-light mb-2">{s.title}</h3>
              <p className="text-sm text-bad-gray leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Industries ───────────────────────────────────────────── */}
      <section id="industries" className="bg-bad-card/40 border-y border-bad-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 tracking-tight">
            Industries We Serve
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((ind) => (
              <span
                key={ind}
                className="px-6 py-3 rounded-full border border-bad-border bg-bad-card text-sm font-medium text-bad-light hover:border-bad-blue/50 transition-colors"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight">
          Ready to eliminate manual work?
        </h2>
        <p className="text-bad-gray mb-8 max-w-xl mx-auto">
          Let BAD build the systems your team actually needs — so you can focus on growth.
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-3.5 text-sm font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-colors shadow-lg shadow-bad-blue/20"
        >
          Get Started
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-bad-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src="/bad-logo-transparent.png" alt="BAD" className="h-7" />
              <span className="text-xs text-bad-gray">
                &copy; 2026 BAD &mdash; Business Automation &amp; Development
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-bad-gray">
              {['Solutions', 'Modules', 'About', 'Contact', 'Privacy', 'Terms'].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="hover:text-bad-light transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-bad-gray/60 mt-6">www.badsaas.app</p>
        </div>
      </footer>
    </div>
  );
}
