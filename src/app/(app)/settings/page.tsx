'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

type SettingsTab = 'profile' | 'organization' | 'team' | 'modules' | 'integrations';

interface MemberData {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface ModuleData {
  module_key: string;
  enabled: boolean;
}

const MODULE_DEFINITIONS = [
  { key: 'leads', label: 'Lead Inbox', description: 'Track and manage incoming leads' },
  { key: 'forms', label: 'Forms', description: 'Build intake forms and collect submissions' },
  { key: 'workflows', label: 'Workflows', description: 'Kanban-style workflow boards' },
  { key: 'scheduling', label: 'Scheduling', description: 'Calendar and booking management' },
  { key: 'quotes', label: 'Quotes', description: 'Generate and send quotes/estimates' },
  { key: 'ai_assist', label: 'AI Assist', description: 'AI-powered summarization, drafting, routing' },
  { key: 'notifications', label: 'Notifications', description: 'In-app and email notifications' },
];

const ROLES = ['admin', 'manager', 'member', 'viewer'];

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Profile
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Org
  const [orgName, setOrgName] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [taxRate, setTaxRate] = useState('0');

  // Team
  const [members, setMembers] = useState<MemberData[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');

  // Modules
  const [modules, setModules] = useState<Record<string, boolean>>({});

  // Integrations
  const [webhookUrl, setWebhookUrl] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('');
  const [emailFrom, setEmailFrom] = useState('');
  const [emailReplyTo, setEmailReplyTo] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setFullName(data.profile.full_name || '');
          setEmail(data.profile.email || '');
        }
        if (data.org) {
          setOrgName(data.org.name || '');
          const s = data.org.settings || {};
          setOrgAddress(s.address || '');
          setOrgPhone(s.phone || '');
          setOrgWebsite(s.website || '');
          setTaxRate(String(s.tax_rate || 0));
          setWebhookUrl(s.webhook_url || '');
          setSlackWebhook(s.slack_webhook || '');
          setEmailFrom(s.email_from || '');
          setEmailReplyTo(s.email_reply_to || '');
        }
      }
    } catch {
      // silent
    }
  }, []);

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch('/api/settings?section=team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch {
      // silent
    }
  }, []);

  const fetchModules = useCallback(async () => {
    try {
      const res = await fetch('/api/settings?section=modules');
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, boolean> = {};
        MODULE_DEFINITIONS.forEach((m) => { map[m.key] = true; }); // defaults on
        (data.modules || []).forEach((m: ModuleData) => { map[m.module_key] = m.enabled; });
        setModules(map);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (tab === 'team') fetchTeam();
    if (tab === 'modules') fetchModules();
  }, [tab, fetchTeam, fetchModules]);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  async function saveProfile() {
    setSaving(true);
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'profile', full_name: fullName, email }),
    });
    setSaving(false);
    flash(res.ok ? 'Profile saved' : 'Failed to save');
  }

  async function saveOrg() {
    setSaving(true);
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'organization',
        name: orgName,
        settings: {
          address: orgAddress,
          phone: orgPhone,
          website: orgWebsite,
          tax_rate: parseFloat(taxRate) || 0,
        },
      }),
    });
    setSaving(false);
    flash(res.ok ? 'Organization saved' : 'Failed to save');
  }

  async function saveIntegrations() {
    setSaving(true);
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'organization',
        settings: {
          address: orgAddress,
          phone: orgPhone,
          website: orgWebsite,
          tax_rate: parseFloat(taxRate) || 0,
          webhook_url: webhookUrl,
          slack_webhook: slackWebhook,
          email_from: emailFrom,
          email_reply_to: emailReplyTo,
        },
      }),
    });
    setSaving(false);
    flash(res.ok ? 'Integrations saved' : 'Failed to save');
  }

  async function changeRole(memberId: string, role: string) {
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'team', memberId, role }),
    });
    fetchTeam();
  }

  async function removeMember(memberId: string) {
    if (!confirm('Remove this member from the organization?')) return;
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'team', memberId, action: 'remove' }),
    });
    fetchTeam();
  }

  async function toggleModule(key: string, enabled: boolean) {
    setModules((prev) => ({ ...prev, [key]: enabled }));
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'modules', module_key: key, enabled }),
    });
  }

  const tabs: { key: SettingsTab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'organization', label: 'Organization' },
    { key: 'team', label: 'Team' },
    { key: 'modules', label: 'Modules' },
    { key: 'integrations', label: 'Integrations' },
  ];

  return (
    <div className="space-y-6">
      {/* Flash message */}
      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              tab === t.key
                ? 'bg-indigo-500/15 text-indigo-400'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <Card>
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">Profile Settings</h3>
          <div className="space-y-4 max-w-lg">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button onClick={saveProfile} loading={saving}>Save Profile</Button>
          </div>
        </Card>
      )}

      {/* Organization Tab */}
      {tab === 'organization' && (
        <Card>
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">Organization Settings</h3>
          <div className="space-y-4 max-w-lg">
            <Input label="Organization Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            <Input label="Address" value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} />
              <Input label="Website" value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} />
            </div>
            <Input
              label="Default Tax Rate (%)"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="0"
            />
            <Button onClick={saveOrg} loading={saving}>Save Organization</Button>
          </div>
        </Card>
      )}

      {/* Team Tab */}
      {tab === 'team' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Invite Member</h3>
            <div className="flex gap-3 max-w-lg">
              <Input
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => {
                  flash('Invite sent (placeholder - email integration required)');
                  setInviteEmail('');
                }}
                disabled={!inviteEmail.trim()}
              >
                Send Invite
              </Button>
            </div>
          </Card>

          <Card padding={false}>
            <div className="px-6 py-4 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-100">Team Members</h3>
            </div>
            <div className="divide-y divide-zinc-800">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                      {(m.full_name || m.email || '?')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-100">{m.full_name || 'Unnamed'}</p>
                      <p className="text-xs text-zinc-500">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={m.role}
                      onChange={(e) => changeRole(m.id, e.target.value)}
                      className="px-2 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r} className="capitalize">{r}</option>
                      ))}
                    </select>
                    <span className="text-[10px] text-zinc-600">
                      {new Date(m.updated_at || m.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => removeMember(m.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remove member"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <div className="p-6 text-center text-sm text-zinc-500">No team members found.</div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Modules Tab */}
      {tab === 'modules' && (
        <Card>
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">Feature Modules</h3>
          <p className="text-sm text-zinc-400 mb-6">Toggle features on or off for your organization.</p>
          <div className="space-y-3">
            {MODULE_DEFINITIONS.map((mod) => (
              <div
                key={mod.key}
                className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-100">{mod.label}</p>
                  <p className="text-xs text-zinc-500">{mod.description}</p>
                </div>
                <button
                  onClick={() => toggleModule(mod.key, !modules[mod.key])}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    modules[mod.key] ? 'bg-indigo-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      modules[mod.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Integrations Tab */}
      {tab === 'integrations' && (
        <Card>
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">Integrations</h3>
          <div className="space-y-6 max-w-lg">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Webhooks</h4>
              <Input
                label="Webhook URL"
                placeholder="https://..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <Input
                label="Slack Incoming Webhook"
                placeholder="https://hooks.slack.com/..."
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Email</h4>
              <Input
                label="From Address"
                placeholder="noreply@yourdomain.com"
                value={emailFrom}
                onChange={(e) => setEmailFrom(e.target.value)}
              />
              <Input
                label="Reply-To"
                placeholder="support@yourdomain.com"
                value={emailReplyTo}
                onChange={(e) => setEmailReplyTo(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Calendar Sync</h4>
              <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
                <p className="text-sm text-zinc-400">Google Calendar and Microsoft Calendar integrations coming soon.</p>
              </div>
            </div>

            <Button onClick={saveIntegrations} loading={saving}>Save Integrations</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
