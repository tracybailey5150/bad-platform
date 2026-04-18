'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timeline } from '@/components/ui/timeline';
import type { ActivityEvent } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface KpiData {
  newLeads: { count: number; change: number };
  activeWorkflows: number;
  upcomingBookings: number;
  pendingQuotes: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KpiData>({
    newLeads: { count: 0, change: 0 },
    activeWorkflows: 0,
    upcomingBookings: 0,
    pendingQuotes: 0,
  });
  const [leadVolume, setLeadVolume] = useState<{ day: string; count: number }[]>([]);
  const [workflowDist, setWorkflowDist] = useState<{ name: string; value: number }[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setFetchError(data.error || 'Failed to load dashboard data');
          return;
        }
        const data = await res.json();
        setKpis(data.kpis);
        setLeadVolume(data.leadVolume);
        setWorkflowDist(data.workflowDistribution);
        setActivity(data.recentActivity);
      } catch {
        setFetchError('Failed to connect to the server. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      title: 'New Leads',
      value: kpis.newLeads.count,
      change: kpis.newLeads.change,
      changeLabel: 'vs last week',
    },
    {
      title: 'Active Items',
      value: kpis.activeWorkflows,
      changeLabel: 'workflow items',
    },
    {
      title: 'Upcoming Bookings',
      value: kpis.upcomingBookings,
      changeLabel: 'next 7 days',
    },
    {
      title: 'Pending Quotes',
      value: kpis.pendingQuotes,
    },
  ];

  return (
    <div className="space-y-6">
      {fetchError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-red-400">{fetchError}</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <p className="text-sm text-zinc-400">{kpi.title}</p>
            <p className="text-3xl font-bold text-zinc-100 mt-1">
              {loading ? '—' : kpi.value}
            </p>
            {kpi.change !== undefined && (
              <p className={`text-xs mt-1 ${kpi.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.change >= 0 ? '+' : ''}
                {kpi.change}% {kpi.changeLabel}
              </p>
            )}
            {kpi.change === undefined && kpi.changeLabel && (
              <p className="text-xs text-zinc-500 mt-1">{kpi.changeLabel}</p>
            )}
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Lead Volume (Last 7 Days)</CardTitle>
          <div className="h-64 mt-4">
            {loading ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#71717a" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#e4e4e7',
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Workflow Status</CardTitle>
          <div className="h-64 mt-4">
            {loading ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">Loading...</div>
            ) : workflowDist.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">No workflows yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workflowDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {workflowDist.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#e4e4e7',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {!loading && workflowDist.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-2">
              {workflowDist.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-zinc-400">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {item.name} ({item.value})
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardTitle>Recent Activity</CardTitle>
          <div className="mt-4">
            {loading ? (
              <p className="text-sm text-zinc-500">Loading...</p>
            ) : (
              <Timeline events={activity} />
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Quick Actions</CardTitle>
          <div className="mt-4 space-y-3">
            <Link href="/leads?action=create" className="block">
              <Button variant="secondary" className="w-full justify-start">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Lead
              </Button>
            </Link>
            <Link href="/workflows?action=create" className="block">
              <Button variant="secondary" className="w-full justify-start">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Workflow
              </Button>
            </Link>
            <Link href="/scheduling?action=create" className="block">
              <Button variant="secondary" className="w-full justify-start">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Schedule Booking
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
