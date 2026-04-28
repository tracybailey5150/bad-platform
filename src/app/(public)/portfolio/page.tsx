import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | BAD — Business Automation & Development',
  description:
    'Real platforms built for real businesses. See the custom automation systems, AI tools, and workflows BAD has delivered.',
};

// Projects open to the public (direct links)
const PUBLIC_PROJECTS = ['BAD Platform', 'expNWA'];

const projects = [
  {
    name: 'AV Orchestrator',
    description: 'Enterprise AV commissioning and system management platform with 16 features including real-time monitoring, scheduled scans, floor plan viewer, video wall designer, Dante route manager, config builder, firmware drift alerts, and multi-org enforcement.',
    url: 'https://avorchestrator.com',
    tag: 'Enterprise AV',
    stack: ['Next.js 16', 'Supabase', 'SNMP/SSH', 'Claude AI', 'Resend'],
    logo: '/portfolio/av-orchestrator.png',
  },
  {
    name: 'Edge Agent',
    description: 'Enterprise network discovery and fingerprinting agent with 8-phase scanning — mDNS, SSDP, 30+ ports, SNMP, HTTP probing, and device classification. Runs on-premise for real-time equipment catalog building.',
    url: 'https://avorchestrator.com',
    tag: 'Network Agent',
    stack: ['Python', 'mDNS', 'SSDP', 'SNMP', 'net-snmp'],
    logo: '/portfolio/edge-agent.png',
  },
  {
    name: 'DSD Platform',
    description: 'Digital signage content operations platform with 27+ modules, DSD Calendar kiosk booking, Samsung MDC integration, SSO/SAML, and content scheduling across enterprise display networks.',
    url: 'https://dsdpilot.com',
    tag: 'Digital Signage',
    stack: ['Next.js 16', 'Supabase', 'OpenAI', 'Samsung MDC', 'SSO'],
    logo: '/portfolio/dsd.png',
  },
  {
    name: 'DFO Platform',
    description: 'Field operations management with AI-powered JSA review, daily reports, Kanban issue tracking, safety meetings, knowledge base, and crew coordination dashboards.',
    url: 'https://dailyfieldops.com',
    tag: 'Field Ops',
    stack: ['Next.js', 'Supabase', 'Resend', 'ElevenLabs', 'PDF'],
    logo: '/portfolio/dfo.png',
  },
  {
    name: 'BAD Platform',
    description: 'Business Automation & Development — lead intake, workflow engine, scheduling, dashboards, AI-assisted tools, quotes with PDF generation, notifications, and Stripe billing.',
    url: 'https://badsaas.app',
    tag: 'Business SaaS',
    stack: ['Next.js 15', 'Supabase', 'Stripe', 'Trigger.dev', 'Zod'],
    logo: '/portfolio/bad.png',
  },
  {
    name: 'AgentPilot',
    description: 'AI-powered lead automation and client engagement platform. Captures, qualifies, and routes leads with AI-drafted follow-ups, smart intake forms, and Stripe live mode checkout.',
    url: 'https://aiagentpilot.org',
    tag: 'Lead Automation',
    stack: ['Next.js', 'Supabase', 'Claude AI', 'Stripe', 'Drizzle'],
    logo: '/portfolio/agentpilot.png',
  },
  {
    name: 'HookVault',
    description: 'Music licensing platform with HookVault Radio featuring ElevenLabs DJ with 20 voices, per-artist stations, announcements, ad slots, and full catalog management with Stripe payments.',
    url: 'https://hookvault.app',
    tag: 'Creative Platform',
    stack: ['Next.js 14', 'Supabase', 'Stripe', 'ElevenLabs', 'OpenAI'],
    logo: '/portfolio/hookvault.png',
  },
  {
    name: 'LessonPilot',
    description: 'AI teaching and learning platform with course creation, quizzes, RAG-powered Q&A from uploaded materials, and Stripe checkout for paid courses.',
    url: 'https://lessonpilot.org',
    tag: 'EdTech',
    stack: ['Next.js', 'Supabase', 'RAG', 'AI/LLM', 'Stripe'],
    logo: '/portfolio/lessonpilot.png',
  },
  {
    name: 'SocialPilot',
    description: 'AI social media management platform with multi-platform scheduling, content generation, Facebook and YouTube API integration, and analytics dashboards.',
    url: 'https://socialpilot.org',
    tag: 'Social Media',
    stack: ['Next.js', 'Supabase', 'Facebook API', 'YouTube API', 'AI'],
    logo: '/portfolio/socialpilot.png',
  },
  {
    name: 'expNWA',
    description: 'NWA lifestyle and real estate platform with city guides, blog content, lead capture, and SEO-optimized pages for Northwest Arkansas communities.',
    url: 'https://expnwa.com',
    tag: 'Real Estate',
    stack: ['Next.js', 'Supabase', 'Vercel', 'Tailwind', 'SEO'],
    logo: '/portfolio/expnwa.png',
  },
];

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bad-blue/10 border border-bad-blue/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-bad-blue animate-pulse" />
          <span className="text-xs font-medium text-bad-blue tracking-wide">Our Work</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          Systems We&apos;ve{' '}
          <span className="bg-gradient-to-r from-bad-blue to-blue-400 bg-clip-text text-transparent">
            Built
          </span>
        </h1>
        <p className="text-lg text-bad-gray max-w-2xl mx-auto leading-relaxed">
          Real platforms built for real businesses. Not templates -- custom systems designed around
          specific workflows and operational needs.
        </p>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p) => (
            <div
              key={p.name}
              className="group rounded-2xl bg-bad-card border border-bad-border hover:border-bad-blue/30 transition-all overflow-hidden"
              style={{ boxShadow: '0 0 40px rgba(37, 99, 235, 0.03)' }}
            >
              {/* Project Logo */}
              <div className="aspect-video bg-bad-bg border-b border-bad-border flex items-center justify-center overflow-hidden group-hover:border-bad-blue/20 transition-all">
                {p.logo ? (
                  <img
                    src={p.logo}
                    alt={`${p.name} logo`}
                    className="w-full h-full object-contain p-8 transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:brightness-110"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-bad-blue/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-bad-blue">
                        {p.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-xs text-bad-gray/60">{p.url.replace('https://', '')}</p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-bad-light">{p.name}</h3>
                  <span className="text-xs font-medium text-bad-blue bg-bad-blue/10 px-3 py-1 rounded-full flex-shrink-0 ml-3">
                    {p.tag}
                  </span>
                </div>
                <p className="text-sm text-bad-gray leading-relaxed mb-5">{p.description}</p>

                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-medium text-bad-light/60 bg-bad-bg border border-bad-border px-2.5 py-1 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Visit link or Request Access */}
                {PUBLIC_PROJECTS.includes(p.name) ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-bad-blue group-hover:text-blue-400 transition-colors"
                  >
                    Visit Site
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    href={`/portfolio/request-access?project=${encodeURIComponent(p.name)}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-bad-blue group-hover:text-blue-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    Request Access
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-bad-border bg-bad-card/30">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Your Platform Could Be Next
          </h2>
          <p className="text-lg text-bad-gray mb-10 max-w-xl mx-auto">
            Tell us about your business. We will design a custom system that replaces manual work
            with automation.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 text-base font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-all shadow-lg shadow-bad-blue/25 hover:shadow-bad-blue/40"
          >
            Start a Project
          </Link>
        </div>
      </section>
    </>
  );
}
