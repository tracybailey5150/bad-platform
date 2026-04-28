'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RequestAccessForm() {
  const searchParams = useSearchParams();
  const project = searchParams.get('project') || '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    reason: '',
    project,
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/access-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-bad-light mb-3">Request Received</h2>
        <p className="text-bad-gray max-w-md mx-auto mb-8">
          We&apos;ll review your request and send temporary access credentials to your email shortly.
        </p>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-medium text-bad-blue hover:text-blue-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const inputClass =
    'w-full bg-bad-bg border border-bad-border rounded-lg px-4 py-3 text-sm text-bad-light placeholder:text-bad-gray/40 outline-none focus:border-bad-blue/50 focus:ring-1 focus:ring-bad-blue/20 transition-all';

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5">
      {project && (
        <div className="px-4 py-3 rounded-lg bg-bad-blue/5 border border-bad-blue/15 text-sm">
          <span className="text-bad-gray">Requesting access to: </span>
          <span className="font-semibold text-bad-light">{project}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-bad-gray/70 uppercase tracking-wider mb-1.5">
          Full Name *
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-bad-gray/70 uppercase tracking-wider mb-1.5">
          Email *
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="you@company.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-bad-gray/70 uppercase tracking-wider mb-1.5">
          Company / Organization
        </label>
        <input
          type="text"
          value={form.company}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          placeholder="Optional"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-bad-gray/70 uppercase tracking-wider mb-1.5">
          Why are you interested? *
        </label>
        <textarea
          required
          rows={3}
          value={form.reason}
          onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
          placeholder="Tell us briefly what you're looking for"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-6 py-3.5 text-sm font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-all shadow-lg shadow-bad-blue/25 hover:shadow-bad-blue/40 disabled:opacity-50"
      >
        {status === 'sending' ? 'Submitting...' : 'Request Access'}
      </button>

      {status === 'error' && (
        <p className="text-sm text-red-400 text-center">Something went wrong. Please try again or contact us directly.</p>
      )}
    </form>
  );
}

export default function RequestAccessPage() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bad-blue/10 border border-bad-blue/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-bad-blue animate-pulse" />
          <span className="text-xs font-medium text-bad-blue tracking-wide">Private Preview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
          Request{' '}
          <span className="bg-gradient-to-r from-bad-blue to-blue-400 bg-clip-text text-transparent">
            Demo Access
          </span>
        </h1>
        <p className="text-base text-bad-gray max-w-xl mx-auto leading-relaxed mb-12">
          This project is currently in private preview. Submit your info below and we&apos;ll
          send you temporary credentials to explore the live platform.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Suspense fallback={<div className="text-center text-bad-gray">Loading...</div>}>
          <RequestAccessForm />
        </Suspense>
      </section>
    </>
  );
}
