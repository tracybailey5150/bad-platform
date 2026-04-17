import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | BAD — Business Automation & Development',
  description:
    'BAD was founded to help businesses replace manual work with purpose-built systems. Meet Tracy Bailey, Business Automation Developer & AI Solutions Consultant.',
};

const values = [
  {
    title: 'Consulting-Led',
    desc: 'We design first. Every project starts with understanding your business, not selling you software. We audit your workflows, map your pain points, and build a plan before writing a single line of code.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: 'Custom-Built',
    desc: 'No templates. No off-the-shelf solutions repackaged with your logo. Every system is designed and built from the ground up around your specific workflows and requirements.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1h12.76m-5.66 5.1l5.1-5.1m0 0l-5.1-5.1m5.1 5.1H5.66" />
      </svg>
    ),
  },
  {
    title: 'AI-Powered',
    desc: 'Smart automation that goes beyond simple if/then rules. We integrate AI where it matters: drafting communications, extracting data, routing work, and surfacing insights.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    title: 'Results-Driven',
    desc: 'Measurable outcomes, not vague promises. We track the metrics that matter: time saved, leads captured, response times, and revenue impact. If it does not move the needle, we do not build it.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bad-blue/10 border border-bad-blue/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-bad-blue animate-pulse" />
          <span className="text-xs font-medium text-bad-blue tracking-wide">About BAD</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          We Build Smart Systems.{' '}
          <span className="bg-gradient-to-r from-bad-blue to-blue-400 bg-clip-text text-transparent">
            Drive Real Results.
          </span>
        </h1>
        <p className="text-xl text-bad-gray max-w-3xl mx-auto leading-relaxed">
          We build smart systems. Automate workflows. Integrate AI. Drive real business results.
        </p>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-bad-card border border-bad-border p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-bad-light mb-6">Our Story</h2>
            <div className="space-y-4 text-bad-gray leading-relaxed">
              <p>
                BAD -- Business Automation &amp; Development -- was founded to help businesses replace
                manual work with purpose-built systems. Too many companies run on spreadsheets,
                disconnected tools, and processes that depend entirely on someone remembering to do
                something.
              </p>
              <p>
                We saw the same problems over and over: leads falling through the cracks, teams tracking
                work in email, managers with no visibility into operations, and businesses paying for
                six tools that do not talk to each other.
              </p>
              <p>
                So we built a consulting-led development practice that starts with understanding how a
                business actually operates, then designs and builds custom systems that replace the
                chaos with clarity. Every platform we build is purpose-built -- not a template, not a
                plugin, not a workaround.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tracy Bailey */}
      <section className="border-y border-bad-border bg-bad-card/30">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-bad-blue to-blue-400 flex items-center justify-center shadow-lg shadow-bad-blue/20">
                <span className="text-5xl font-bold text-white">TB</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Tracy Bailey</h2>
              <p className="text-bad-blue font-semibold text-sm tracking-wide mb-6">
                Business Automation Developer &amp; AI Solutions Consultant
              </p>
              <p className="text-bad-gray leading-relaxed mb-4">
                Tracy consults with executives and business owners to design and build custom systems that
                replace manual work with automation. From single-location service companies to multi-business
                operators managing complex portfolios -- BAD delivers software and workflows that actually work.
              </p>
              <p className="text-bad-gray leading-relaxed mb-6">
                With experience building 12+ production platforms across industries including field operations,
                AV technology, music licensing, digital signage, and AI-powered lead automation, Tracy brings
                both technical depth and business understanding to every engagement.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <a href="mailto:tracy@badsaas.app" className="text-bad-blue hover:text-blue-400 transition-colors">
                  tracy@badsaas.app
                </a>
                <a href="tel:4796706073" className="text-bad-gray hover:text-bad-light transition-colors">
                  (479) 670-6073
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">How We Operate</h2>
          <p className="text-lg text-bad-gray max-w-2xl mx-auto">
            Four principles that guide every project we take on.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-8 rounded-2xl bg-bad-card border border-bad-border hover:border-bad-blue/30 transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-bad-blue/10 text-bad-blue mb-5">
                {v.icon}
              </div>
              <h3 className="text-xl font-bold text-bad-light mb-3">{v.title}</h3>
              <p className="text-sm text-bad-gray leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-bad-border bg-bad-card/30">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Ready to Talk?
          </h2>
          <p className="text-lg text-bad-gray mb-10 max-w-xl mx-auto">
            Every project starts with a conversation. Tell us about your business and we will show you
            what is possible.
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
