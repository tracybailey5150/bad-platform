import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | BAD — Business Automation & Development',
  description:
    'Transparent pricing for custom business automation. Discovery consulting, custom implementations, and ongoing platform support.',
};

const tiers = [
  {
    name: 'Discovery & Consulting',
    price: '$500 - $1,500',
    period: 'one-time',
    description: 'Understand your business before building anything. We audit workflows, map pain points, and deliver a clear plan.',
    features: [
      'Workflow audit and process mapping',
      'Pain point identification and prioritization',
      'Technology recommendation report',
      'Custom solution architecture document',
      'ROI projections for automation',
      'Implementation roadmap',
    ],
    cta: 'Book a Discovery Call',
    highlighted: false,
  },
  {
    name: 'Custom Implementation',
    price: '$3,000 - $12,000+',
    period: 'per project',
    description: 'Full design and build of your custom platform. From architecture to deployment, tailored to your workflows.',
    features: [
      'Everything in Discovery & Consulting',
      'Custom UI/UX design',
      'Full-stack platform development',
      'Database architecture and setup',
      'API integrations (CRM, email, etc.)',
      'AI/automation implementation',
      'Testing and quality assurance',
      'Deployment and team training',
    ],
    cta: 'Get a Quote',
    highlighted: true,
  },
  {
    name: 'Monthly Platform & Support',
    price: '$199 - $999+',
    period: '/month',
    description: 'Ongoing hosting, maintenance, and optimization. Your system keeps running and improving as your business grows.',
    features: [
      'Cloud hosting and infrastructure',
      'Security updates and monitoring',
      'Performance optimization',
      'Bug fixes and issue resolution',
      'Monthly feature enhancements',
      'Priority support channel',
      'Analytics and reporting',
      'Quarterly business reviews',
    ],
    cta: 'Start a Conversation',
    highlighted: false,
  },
];

const faqs = [
  {
    q: 'How long does a typical build take?',
    a: 'Most projects take 4-8 weeks from kickoff to launch, depending on complexity. Discovery and consulting usually wraps in 1-2 weeks. We will give you a clear timeline during the discovery phase.',
  },
  {
    q: 'What tech stack do you use?',
    a: 'We primarily build with Next.js, React, TypeScript, Supabase (PostgreSQL), and Tailwind CSS. For AI features, we integrate leading LLM providers. Everything is modern, performant, and built to scale.',
  },
  {
    q: 'Do you provide ongoing support?',
    a: 'Yes. Every platform we build comes with the option for ongoing hosting, maintenance, and feature development. Most clients stay on a monthly support plan to keep their systems optimized and evolving.',
  },
  {
    q: 'Can you integrate with our existing tools?',
    a: 'Absolutely. We regularly integrate with CRMs, email platforms, calendars, payment processors, and other SaaS tools. If it has an API, we can connect it.',
  },
  {
    q: 'What if I only need consulting, not a full build?',
    a: 'That is perfectly fine. Many engagements start with a consulting-only phase where we audit your workflows, identify automation opportunities, and deliver a recommendation report. You can use that to build internally or come back to us when you are ready.',
  },
  {
    q: 'Do you work with businesses outside of a specific industry?',
    a: 'Yes. We have built platforms across field operations, AV technology, music licensing, digital signage, and more. The consulting-first approach means we learn your industry before we build.',
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bad-blue/10 border border-bad-blue/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-bad-blue animate-pulse" />
          <span className="text-xs font-medium text-bad-blue tracking-wide">Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          Transparent Pricing.{' '}
          <span className="bg-gradient-to-r from-bad-blue to-blue-400 bg-clip-text text-transparent">
            Real Value.
          </span>
        </h1>
        <p className="text-lg text-bad-gray max-w-2xl mx-auto leading-relaxed">
          Every project is custom, but our pricing is straightforward. No hidden fees, no surprise invoices.
          Every engagement starts with a conversation.
        </p>
      </section>

      {/* Pricing Tiers */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 lg:p-10 flex flex-col ${
                tier.highlighted
                  ? 'bg-bad-card border-bad-blue/40 shadow-lg shadow-bad-blue/10'
                  : 'bg-bad-card border-bad-border'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 text-xs font-semibold bg-bad-blue text-white rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-bad-light mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl font-bold text-bad-light">{tier.price}</span>
                  <span className="text-sm text-bad-gray">/{tier.period}</span>
                </div>
                <p className="text-sm text-bad-gray leading-relaxed">{tier.description}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-bad-light/80">
                    <svg className="w-4 h-4 text-bad-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`block text-center px-6 py-3.5 text-sm font-semibold rounded-lg transition-all ${
                  tier.highlighted
                    ? 'bg-bad-blue hover:bg-bad-blue/90 text-white shadow-lg shadow-bad-blue/25'
                    : 'border border-bad-border text-bad-light hover:border-bad-blue/40 hover:bg-bad-card'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-bad-gray mt-10">
          All pricing is project-dependent. Exact quotes provided after discovery consultation.
        </p>
      </section>

      {/* CTA Banner */}
      <section className="border-y border-bad-border bg-bad-card/30">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Every project starts with a conversation.
          </h2>
          <p className="text-bad-gray mb-8 max-w-lg mx-auto">
            Book a free 30-minute discovery call. We will audit your biggest workflow bottleneck
            and show you what the solution looks like.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 text-base font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-all shadow-lg shadow-bad-blue/25 hover:shadow-bad-blue/40"
          >
            Book a Discovery Call
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl bg-bad-card border border-bad-border p-6 lg:p-8"
            >
              <h3 className="text-base font-semibold text-bad-light mb-3">{faq.q}</h3>
              <p className="text-sm text-bad-gray leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
