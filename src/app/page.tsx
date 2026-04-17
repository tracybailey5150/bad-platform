import Link from 'next/link';

const features = [
  {
    title: 'Lead Response',
    description: 'Capture, score, and route leads from multiple sources. Never miss a prospect with automated intake forms and instant notifications.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  },
  {
    title: 'Operations Workflow',
    description: 'Kanban boards, task management, and workflow automation. Keep your team aligned and projects moving forward.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    title: 'Scheduling & Intake',
    description: 'Public booking pages, custom intake forms, and calendar management. Let clients self-serve while you stay organized.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Dashboards & Reporting',
    description: 'Real-time KPIs, lead analytics, workflow metrics, and financial reporting. Data-driven decisions at a glance.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <img src="/bad-logo-transparent.png" alt="BAD" className="h-10" />
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <img src="/bad-logo-transparent.png" alt="BAD — Business Automation & Development" className="h-32 md:h-44 mx-auto mb-8" />
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
          Business Automation
          <br />
          <span className="text-indigo-400">& Development</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Custom-built business tools that actually work. Manage leads, automate workflows,
          schedule clients, and track performance — all in one platform.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-8 py-3 text-base font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 text-base font-medium border border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-4 group-hover:bg-indigo-500/15 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-zinc-600">BAD Platform</p>
          <p className="text-xs text-zinc-600">Business Automation & Development</p>
        </div>
      </footer>
    </div>
  );
}
