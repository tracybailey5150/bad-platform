'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { Timeline } from '@/components/ui/timeline';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/table';
import type { Lead, LeadStatus, LeadSource, ActivityEvent } from '@/types';

const statuses: (LeadStatus | 'all')[] = ['all', 'new', 'contacted', 'qualified', 'won', 'lost'];
const sources: LeadSource[] = ['website', 'referral', 'social', 'cold_outreach', 'form', 'other'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website' as LeadSource,
    notes: '',
  });
  const [creating, setCreating] = useState(false);

  const fetchLeads = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search) params.set('search', search);

    try {
      const res = await fetch(`/api/leads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setCreateForm({ name: '', email: '', phone: '', company: '', source: 'website', notes: '' });
        fetchLeads();
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleStatusChange(leadId: string, status: LeadStatus) {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: leadId, status }),
    });
    fetchLeads();
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, status });
    }
  }

  async function handleBulkAction(action: string) {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);

    if (action === 'delete') {
      if (!confirm(`Delete ${ids.length} lead${ids.length > 1 ? 's' : ''}? This cannot be undone.`)) return;
      for (const id of ids) {
        await fetch('/api/leads', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
      }
    } else {
      for (const id of ids) {
        await fetch('/api/leads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: action }),
        });
      }
    }
    setSelectedIds(new Set());
    fetchLeads();
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  function toggleSelectAll() {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
        <Button onClick={() => setShowCreateModal(true)}>Add Lead</Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 w-fit">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
              statusFilter === s
                ? 'bg-indigo-500/15 text-indigo-400'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
          <span className="text-sm text-zinc-400">{selectedIds.size} selected</span>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="secondary" onClick={() => handleBulkAction('contacted')}>
              Mark Contacted
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleBulkAction('qualified')}>
              Mark Qualified
            </Button>
            <Button size="sm" variant="danger" onClick={() => handleBulkAction('delete')}>
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-zinc-500">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No leads found. Click &quot;Add Lead&quot; to create your first one.
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader className="w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === leads.length && leads.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-600"
                  />
                </TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Source</TableHeader>
                <TableHeader>Score</TableHeader>
                <TableHeader>Created</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} onClick={() => setSelectedLead(lead)}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(lead.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(lead.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-zinc-600"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-zinc-100">{lead.name}</TableCell>
                  <TableCell>{lead.email || '—'}</TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="capitalize">{lead.source.replace('_', ' ')}</TableCell>
                  <TableCell>{lead.score}</TableCell>
                  <TableCell className="text-zinc-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add Lead" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            />
            <Input
              label="Phone"
              value={createForm.phone}
              onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
            />
            <Input
              label="Company"
              value={createForm.company}
              onChange={(e) => setCreateForm({ ...createForm, company: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Source</label>
            <select
              value={createForm.source}
              onChange={(e) => setCreateForm({ ...createForm, source: e.target.value as LeadSource })}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {sources.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Notes</label>
            <textarea
              value={createForm.notes}
              onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={creating}>
              Create Lead
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail Slide-out */}
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
          onRefresh={fetchLeads}
        />
      )}
    </div>
  );
}

function LeadDetailPanel({
  lead,
  onClose,
  onStatusChange,
  onRefresh,
}: {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onRefresh: () => void;
}) {
  const [notes, setNotes] = useState(lead.notes || '');
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch(`/api/leads?activity=${lead.id}`);
        if (res.ok) {
          const data = await res.json();
          setActivity(data.activity || []);
        }
      } catch {
        // silent
      }
    }
    fetchActivity();
  }, [lead.id]);

  async function saveNotes() {
    setSaving(true);
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, notes }),
    });
    setSaving(false);
    onRefresh();
  }

  const allStatuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'won', 'lost'];

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl z-40 overflow-y-auto">
      <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">{lead.name}</h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Info */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Email</span>
            <span className="text-zinc-200">{lead.email || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Phone</span>
            <span className="text-zinc-200">{lead.phone || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Company</span>
            <span className="text-zinc-200">{lead.company || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Source</span>
            <span className="text-zinc-200 capitalize">{lead.source.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Score</span>
            <span className="text-zinc-200">{lead.score}</span>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Status</label>
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {allStatuses.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button size="sm" variant="secondary" onClick={saveNotes} loading={saving} className="mt-2">
            Save Notes
          </Button>
        </div>

        {/* Activity */}
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Activity</h3>
          <Timeline events={activity} />
        </div>
      </div>
    </div>
  );
}
