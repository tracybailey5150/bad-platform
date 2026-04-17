import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solutions | BAD — Business Automation & Development',
  description:
    'Custom automation solutions: lead response, workflow operations, scheduling, dashboards, analytics, and AI integration for your business.',
};

const solutions = [
  {
    title: 'Lead Response & Automation',
    description:
      'Capture, qualify, score, and route leads the moment they come in. AI-powered follow-up sequences and smart intake forms that never let a prospect slip through the cracks. We build systems that respond to leads in seconds, not hours.',
    features: [
      'Instant lead capture from web forms, ads, and email',
      'AI-drafted follow-up emails and SMS sequences',
      'Smart scoring and prioritization algorithms',
      'CRM integration and automatic data enrichment',
      'Custom intake forms branded to your business',
      'Real-time lead routing to the right team member',
    ],
    useCases: [
      'Service businesses getting 50+ leads/week that need instant follow-up',
      'Sales teams losing deals because response time is too slow',
      'Multi-location businesses needing centralized lead management',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  },
  {
    title: 'Workflow & Operations',
    description:
      'Replace spreadsheets and manual tracking with custom workflow systems built around how your team actually works. Tasks, approvals, status boards, automated handoffs, and full visibility for managers and owners.',
    features: [
      'Custom task management and Kanban boards',
      'Automated approval chains and escalation workflows',
      'Real-time status boards and progress tracking',
      'Team notification flows (email, SMS, in-app)',
      'Document management and version control',
      'Role-based access and permission systems',
    ],
    useCases: [
      'Operations teams tracking work across spreadsheets and email',
      'Businesses with multi-step approval processes that slow everything down',
      'Companies needing real-time visibility into project and task status',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    title: 'Scheduling & Intake',
    description:
      'Client-facing booking pages, custom intake forms, automated reminders, and calendar management. All branded to your business, all connected to your backend systems. No more back-and-forth emails to book a meeting.',
    features: [
      'Branded booking pages with availability management',
      'Custom intake forms with conditional logic',
      'Automated reminders and confirmation emails',
      'Calendar sync (Google, Outlook, Apple)',
      'Service selection and dynamic pricing',
      'Client portal for self-service rescheduling',
    ],
    useCases: [
      'Service businesses spending hours per week scheduling appointments',
      'Companies needing custom intake forms tied to their backend systems',
      'Teams coordinating schedules across multiple locations or time zones',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Dashboards, Reporting & Analytics',
    description:
      'Real-time KPIs, operational dashboards, analytics, and reporting platforms that give owners and managers actual visibility into what matters. Stop guessing. Start measuring.',
    features: [
      'Real-time KPI tracking and analytics dashboards',
      'Trend analysis and forecasting tools',
      'Custom report builders with export capabilities',
      'Team performance and revenue views',
      'Automated report delivery (daily, weekly, monthly)',
      'Data visualization with charts, graphs, and heatmaps',
    ],
    useCases: [
      'Executives needing real-time visibility across multiple business units',
      'Operations managers who currently rely on manual report compilation',
      'Companies making decisions based on gut feel instead of data',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'AI Integration & Consulting',
    description:
      'Strategic AI integration that actually makes sense for your business. Not chatbot gimmicks -- real AI that drafts proposals, extracts data, routes work, and saves your team hours every week.',
    features: [
      'Document and data extraction (invoices, contracts, forms)',
      'AI-drafted communications (proposals, emails, reports)',
      'Intelligent routing and triage for incoming requests',
      'Workflow recommendations based on historical patterns',
      'Natural language search across your business data',
      'Custom AI assistants trained on your processes',
    ],
    useCases: [
      'Businesses spending hours on repetitive document processing',
      'Teams that need faster, more consistent communication drafting',
      'Organizations wanting to leverage AI but unsure where to start',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
];

export default function SolutionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bad-blue/10 border border-bad-blue/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-bad-blue animate-pulse" />
          <span className="text-xs font-medium text-bad-blue tracking-wide">Our Solutions</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          Systems Built Around{' '}
          <span className="bg-gradient-to-r from-bad-blue to-blue-400 bg-clip-text text-transparent">
            How You Work
          </span>
        </h1>
        <p className="text-lg text-bad-gray max-w-2xl mx-auto leading-relaxed">
          Every business is different. That is why we consult first, then design and build custom systems
          that solve your specific problems -- not generic software you have to work around.
        </p>
      </section>

      {/* Solutions */}
      <section className="max-w-7xl mx-auto px-6 pb-24 space-y-16">
        {solutions.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl bg-bad-card border border-bad-border p-8 lg:p-12 hover:border-bad-blue/30 transition-colors"
            style={{ boxShadow: '0 0 60px rgba(37, 99, 235, 0.04)' }}
          >
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left: title + description */}
              <div className="lg:w-1/2">
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-bad-blue/10 text-bad-blue mb-6">
                  {s.icon}
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-bad-light mb-4">{s.title}</h2>
                <p className="text-bad-gray leading-relaxed mb-8">{s.description}</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-colors"
                >
                  Book a Call
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

              {/* Right: features + use cases */}
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-bad-blue uppercase tracking-wider mb-4">Features</h3>
                  <ul className="grid gap-3">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-bad-light/80">
                        <svg className="w-4 h-4 text-bad-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-bad-blue uppercase tracking-wider mb-4">Use Cases</h3>
                  <ul className="grid gap-3">
                    {s.useCases.map((u) => (
                      <li key={u} className="flex items-start gap-3 text-sm text-bad-gray">
                        <span className="w-1.5 h-1.5 rounded-full bg-bad-blue flex-shrink-0 mt-1.5" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="border-y border-bad-border bg-bad-card/30">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Not Sure Which Solution Fits?
          </h2>
          <p className="text-lg text-bad-gray mb-10 max-w-xl mx-auto">
            Every project starts with a conversation. Book a free discovery call and we will map your
            biggest bottleneck together.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 text-base font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-all shadow-lg shadow-bad-blue/25 hover:shadow-bad-blue/40"
          >
            Book a Discovery Call
          </Link>
        </div>
      </section>
    </>
  );
}
