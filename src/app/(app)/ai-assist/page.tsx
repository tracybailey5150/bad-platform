'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Tab = 'summarize' | 'draft_reply' | 'route' | 'search';
type Tone = 'formal' | 'friendly' | 'brief';

export default function AIAssistPage() {
  const [activeTab, setActiveTab] = useState<Tab>('summarize');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Summarizer state
  const [summarizeText, setSummarizeText] = useState('');

  // Draft reply state
  const [draftName, setDraftName] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [draftCompany, setDraftCompany] = useState('');
  const [draftNotes, setDraftNotes] = useState('');
  const [draftSource, setDraftSource] = useState('website');
  const [draftTone, setDraftTone] = useState<Tone>('friendly');

  // Route state
  const [routeName, setRouteName] = useState('');
  const [routeEmail, setRouteEmail] = useState('');
  const [routeCompany, setRouteCompany] = useState('');
  const [routeNotes, setRouteNotes] = useState('');
  const [routeSource, setRouteSource] = useState('website');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  async function callAI(action: Tab, data: Record<string, string>) {
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'AI request failed');
      setResult(json.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleSummarize() {
    if (!summarizeText.trim()) return;
    callAI('summarize', { text: summarizeText });
  }

  function handleDraftReply() {
    if (!draftName.trim()) return;
    callAI('draft_reply', {
      name: draftName,
      email: draftEmail,
      company: draftCompany,
      notes: draftNotes,
      source: draftSource,
      tone: draftTone,
    });
  }

  function handleRoute() {
    if (!routeName.trim()) return;
    callAI('route', {
      name: routeName,
      email: routeEmail,
      company: routeCompany,
      notes: routeNotes,
      source: routeSource,
    });
  }

  function handleSearch() {
    if (!searchQuery.trim()) return;
    callAI('search', { query: searchQuery });
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'summarize',
      label: 'Summarizer',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: 'draft_reply',
      label: 'Draft Reply',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'route',
      label: 'Routing',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      key: 'search',
      label: 'Smart Search',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setResult(''); setError(''); }}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-indigo-500/15 text-indigo-400'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'summarize' && 'Text Summarizer'}
              {activeTab === 'draft_reply' && 'Draft Reply Generator'}
              {activeTab === 'route' && 'Lead Routing Suggestions'}
              {activeTab === 'search' && 'Smart Search'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'summarize' && 'Paste text to extract key points, action items, and next steps.'}
              {activeTab === 'draft_reply' && 'Enter lead details to generate a professional response.'}
              {activeTab === 'route' && 'Analyze a lead to get workflow, priority, and team assignment suggestions.'}
              {activeTab === 'search' && 'Search across all your data using natural language.'}
            </CardDescription>
          </CardHeader>

          {activeTab === 'summarize' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Text to Summarize</label>
                <textarea
                  value={summarizeText}
                  onChange={(e) => setSummarizeText(e.target.value)}
                  rows={8}
                  placeholder="Paste an email, lead notes, submission, or any text..."
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button onClick={handleSummarize} loading={loading} disabled={!summarizeText.trim()}>
                Summarize
              </Button>
            </div>
          )}

          {activeTab === 'draft_reply' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Lead Name" value={draftName} onChange={(e) => setDraftName(e.target.value)} required />
                <Input label="Email" type="email" value={draftEmail} onChange={(e) => setDraftEmail(e.target.value)} />
                <Input label="Company" value={draftCompany} onChange={(e) => setDraftCompany(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Source</label>
                  <select
                    value={draftSource}
                    onChange={(e) => setDraftSource(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {['website', 'referral', 'social', 'cold_outreach', 'form', 'other'].map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Notes / Context</label>
                <textarea
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Tone</label>
                <div className="flex gap-2">
                  {(['formal', 'friendly', 'brief'] as Tone[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setDraftTone(t)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                        draftTone === t
                          ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleDraftReply} loading={loading} disabled={!draftName.trim()}>
                Generate Draft
              </Button>
            </div>
          )}

          {activeTab === 'route' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Lead Name" value={routeName} onChange={(e) => setRouteName(e.target.value)} required />
                <Input label="Email" type="email" value={routeEmail} onChange={(e) => setRouteEmail(e.target.value)} />
                <Input label="Company" value={routeCompany} onChange={(e) => setRouteCompany(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Source</label>
                  <select
                    value={routeSource}
                    onChange={(e) => setRouteSource(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {['website', 'referral', 'social', 'cold_outreach', 'form', 'other'].map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Notes / Context</label>
                <textarea
                  value={routeNotes}
                  onChange={(e) => setRouteNotes(e.target.value)}
                  rows={4}
                  placeholder="Describe the lead's needs, what they're looking for..."
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button onClick={handleRoute} loading={loading} disabled={!routeName.trim()}>
                Get Suggestions
              </Button>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Natural Language Query</label>
                <textarea
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  rows={3}
                  placeholder='e.g. "show me leads from last week that mention HVAC" or "find all open quotes over $5000"'
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button onClick={handleSearch} loading={loading} disabled={!searchQuery.trim()}>
                Search
              </Button>
            </div>
          )}
        </Card>

        {/* Result panel */}
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 bg-zinc-800 p-4 rounded-lg leading-relaxed font-sans">
                  {result}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigator.clipboard.writeText(result)}
                >
                  Copy
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-sm">Run an AI action to see results here</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
