'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { Notification as AppNotification } from '@/lib/notifications';

const typeLabels: Record<string, { label: string; color: string }> = {
  lead_assigned: { label: 'Lead', color: 'bg-blue-500/15 text-blue-400' },
  status_changed: { label: 'Status', color: 'bg-amber-500/15 text-amber-400' },
  booking_reminder: { label: 'Booking', color: 'bg-green-500/15 text-green-400' },
  quote_accepted: { label: 'Quote', color: 'bg-emerald-500/15 text-emerald-400' },
  workflow_due: { label: 'Workflow', color: 'bg-purple-500/15 text-purple-400' },
  form_submitted: { label: 'Form', color: 'bg-cyan-500/15 text-cyan-400' },
  team_invite: { label: 'Team', color: 'bg-indigo-500/15 text-indigo-400' },
  system: { label: 'System', color: 'bg-zinc-500/15 text-zinc-400' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  async function markRead(id: string, read: boolean) {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read }),
    });
    fetchNotifications();
  }

  async function markAllRead() {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'all' }),
    });
    fetchNotifications();
  }

  async function deleteNotification(id: string) {
    await fetch('/api/notifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchNotifications();
  }

  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'all' ? 'bg-indigo-500/15 text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'unread' ? 'bg-indigo-500/15 text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Unread{unreadCount > 0 && ` (${unreadCount})`}
            </button>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="secondary" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
        {loading ? (
          <div className="p-8 text-center text-zinc-500">Loading notifications...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
          </div>
        ) : (
          filtered.map((n) => {
            const typeInfo = typeLabels[n.type] || typeLabels.system;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 transition-colors ${
                  !n.read ? 'bg-indigo-500/5' : ''
                }`}
              >
                {/* Unread dot */}
                <div className="pt-1.5">
                  <div className={`w-2 h-2 rounded-full ${!n.read ? 'bg-indigo-500' : 'bg-transparent'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-100">{n.title}</p>
                  {n.body && <p className="text-sm text-zinc-400 mt-0.5">{n.body}</p>}
                  {n.link && (
                    <a
                      href={n.link}
                      className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 inline-block"
                    >
                      View details
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => markRead(n.id, !n.read)}
                    title={n.read ? 'Mark unread' : 'Mark read'}
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-800"
                  >
                    {n.read ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => deleteNotification(n.id)}
                    title="Delete"
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
