import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | BAD — Business Automation & Development',
  description:
    'Real platforms built for real businesses. See the custom automation systems, AI tools, and workflows BAD has delivered.',
};

const projects = [
  {
    name: 'AgentPilot',
    description: 'AI-powered lead automation and client engagement platform for service businesses. Captures, qualifies, and routes leads with AI-drafted follow-ups and smart intake forms.',
    url: 'https://aiagentpilot.org',
    tag: 'Lead Automation',
    stack: ['Next.js', 'Supabase', 'AI/LLM', 'Tailwind CSS'],
  },
  {
    name: 'DFO Platform',
    description: 'Field operations management with JSA reports, issue tracking, crew coordination, and real-time operational dashboards for field teams.',
    url: 'https://dailyfieldops.com',
    tag: 'Field Ops',
    stack: ['Next.js', 'Supabase', 'PDF Generation', 'Real-time'],
  },
  {
    name: 'AV Orchestrator',
    description: 'Enterprise AV commissioning and system management platform with room control, device monitoring, presentation management, and technical documentation.',
    url: 'https://avorchestrator.com',
    tag: 'Enterprise AV',
    stack: ['Next.js', 'Supabase', 'IoT Integration', 'Tailwind CSS'],
  },
  {
    name: 'DSD Platform',
    description: 'Digital signage content operations platform for enterprise display networks. Content scheduling, approval workflows, and network-wide deployment.',
    url: 'https://dsdpilot.com',
    tag: 'Digital Signage',
    stack: ['Next.js', 'Supabase', 'Content Management', 'Scheduling'],
  },
  {
    name: 'HookVault',
    description: 'An entertainment and creative licensing platform built for managing and presenting digital assets, with media-focused tools for image, video, audio, and creator workflows.',
    url: 'https://hookvault.app',
    tag: 'Creative Platform',
    stack: ['Next.js', 'Supabase', 'Audio Streaming', 'Stripe'],
  },
  {
    name: 'expNWA',
    description: 'A local real estate and lifestyle website built as a public-facing platform for branding, regional content, discovery, and lead generation.',
    url: 'https://expnwa.com',
    tag: 'Public-Facing',
    stack: ['Next.js', 'Supabase', 'SEO', 'Lead Capture'],
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
              {/* Screenshot placeholder */}
              <div className="aspect-video bg-bad-bg border-b border-bad-border flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-bad-blue/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-bad-blue">
                      {p.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-xs text-bad-gray/60">{p.url.replace('https://', '')}</p>
                </div>
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

                {/* Visit link */}
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
