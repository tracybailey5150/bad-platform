'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

const projectTypes = [
  'Lead Response & Automation',
  'Workflow & Operations',
  'Scheduling & Intake',
  'Dashboards & Analytics',
  'AI Integration',
  'Full Platform Build',
  'Consulting / Audit Only',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }
      setStatus('success');
      setForm({ name: '', email: '', phone: '', company: '', projectType: '', message: '' });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send message');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bad-blue/10 border border-bad-blue/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-bad-blue animate-pulse" />
          <span className="text-xs font-medium text-bad-blue tracking-wide">Get in Touch</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          Let&apos;s Build Something{' '}
          <span className="bg-gradient-to-r from-bad-blue to-blue-400 bg-clip-text text-transparent">
            That Works
          </span>
        </h1>
        <p className="text-lg text-bad-gray max-w-2xl mx-auto leading-relaxed">
          Every project starts with a conversation. Tell us about your business and we will map out
          a plan together.
        </p>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-bad-card border border-bad-border p-8 lg:p-10">
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-bad-light mb-3">Message Sent</h3>
                  <p className="text-bad-gray">
                    Thanks for reaching out. Tracy will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-bad-light mb-2">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-bad-bg border border-bad-border rounded-lg text-bad-light placeholder:text-bad-gray/50 focus:border-bad-blue focus:outline-none focus:ring-1 focus:ring-bad-blue transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-bad-light mb-2">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-bad-bg border border-bad-border rounded-lg text-bad-light placeholder:text-bad-gray/50 focus:border-bad-blue focus:outline-none focus:ring-1 focus:ring-bad-blue transition-colors"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-bad-light mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-bad-bg border border-bad-border rounded-lg text-bad-light placeholder:text-bad-gray/50 focus:border-bad-blue focus:outline-none focus:ring-1 focus:ring-bad-blue transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-bad-light mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-bad-bg border border-bad-border rounded-lg text-bad-light placeholder:text-bad-gray/50 focus:border-bad-blue focus:outline-none focus:ring-1 focus:ring-bad-blue transition-colors"
                        placeholder="Your company"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-bad-light mb-2">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={form.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-bad-bg border border-bad-border rounded-lg text-bad-light focus:border-bad-blue focus:outline-none focus:ring-1 focus:ring-bad-blue transition-colors"
                    >
                      <option value="">Select a project type...</option>
                      {projectTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-bad-light mb-2">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-bad-bg border border-bad-border rounded-lg text-bad-light placeholder:text-bad-gray/50 focus:border-bad-blue focus:outline-none focus:ring-1 focus:ring-bad-blue transition-colors resize-none"
                      placeholder="Tell us about your business and what you need..."
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full px-8 py-4 text-base font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-all shadow-lg shadow-bad-blue/25 hover:shadow-bad-blue/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Direct Contact */}
            <div className="rounded-2xl bg-bad-card border border-bad-border p-8">
              <h3 className="text-lg font-bold text-bad-light mb-6">Direct Contact</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-bad-blue/10 text-bad-blue flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-bad-light">Email</p>
                    <a href="mailto:tracy@badsaas.app" className="text-sm text-bad-blue hover:text-blue-400 transition-colors">
                      tracy@badsaas.app
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-bad-blue/10 text-bad-blue flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-bad-light">Phone</p>
                    <a href="tel:4796706073" className="text-sm text-bad-gray hover:text-bad-light transition-colors">
                      (479) 670-6073
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-bad-blue/10 text-bad-blue flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-bad-light">Location</p>
                    <p className="text-sm text-bad-gray">Remote — Serving businesses nationwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Book a Discovery Call */}
            <div className="rounded-2xl bg-gradient-to-br from-bad-blue/10 to-bad-blue/5 border border-bad-blue/20 p-8">
              <h3 className="text-lg font-bold text-bad-light mb-3">Book a Discovery Call</h3>
              <p className="text-sm text-bad-gray leading-relaxed mb-6">
                Free 30-minute workflow review. We will map your biggest bottleneck and show you exactly
                how to fix it. No pitch deck. No commitment.
              </p>
              <a
                href="mailto:tracy@badsaas.app?subject=Discovery Call Request"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-colors w-full justify-center"
              >
                Schedule a Call
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

            {/* Response Time */}
            <div className="rounded-2xl bg-bad-card border border-bad-border p-8">
              <p className="text-sm text-bad-gray leading-relaxed">
                <span className="font-semibold text-bad-light">Typical response time:</span> Within 24 hours
                on business days. For urgent project needs, call directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
