import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

interface DashboardResponse {
  kpis: {
    newLeads: { count: number; change: number };
    activeWorkflows: number;
    upcomingBookings: number;
    pendingQuotes: number;
  };
  leadVolume: { day: string; count: number }[];
  workflowDistribution: { name: string; value: number }[];
  recentActivity: Record<string, unknown>[];
}

export async function GET(): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const admin = createAdminClient();
  const orgId = profile.org_id;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // KPIs + lead volume in a single batch (fix #5: eliminate N+1)
  const [
    { count: newLeadsThisWeek },
    { count: newLeadsLastWeek },
    { count: activeWorkflows },
    { count: upcomingBookings },
    { count: pendingQuotes },
    { data: recentLeads },
    { data: workflowItems },
    { data: recentActivity },
  ] = await Promise.all([
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', weekAgo.toISOString()),
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', twoWeeksAgo.toISOString()).lt('created_at', weekAgo.toISOString()),
    admin.from('workflow_items').select('*', { count: 'exact', head: true }).eq('org_id', orgId).neq('status', 'Done'),
    admin.from('bookings').select('*', { count: 'exact', head: true }).eq('org_id', orgId).gte('start_time', now.toISOString()).lte('start_time', weekAhead.toISOString()),
    admin.from('quotes').select('*', { count: 'exact', head: true }).eq('org_id', orgId).in('status', ['draft', 'sent']),
    // Single query for 7-day lead volume -- bucket client-side
    admin.from('leads').select('created_at').eq('org_id', orgId).gte('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    admin.from('workflow_items').select('status').eq('org_id', orgId),
    admin.from('activity_events').select('*').eq('org_id', orgId).order('created_at', { ascending: false }).limit(10),
  ]);

  const thisWeek = newLeadsThisWeek || 0;
  const lastWeek = newLeadsLastWeek || 0;
  const change = lastWeek === 0 ? (thisWeek > 0 ? 100 : 0) : Math.round(((thisWeek - lastWeek) / lastWeek) * 100);

  // Bucket leads by day client-side instead of 7 separate queries
  const leadVolume: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const count = (recentLeads || []).filter((l: { created_at: string }) => {
      const d = new Date(l.created_at);
      return d >= dayStart && d <= dayEnd;
    }).length;

    leadVolume.push({
      day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
      count,
    });
  }

  // Workflow item status distribution
  const wfCounts: Record<string, number> = {};
  (workflowItems || []).forEach((w: { status: string }) => {
    wfCounts[w.status] = (wfCounts[w.status] || 0) + 1;
  });
  const workflowDistribution = Object.entries(wfCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const response: DashboardResponse = {
    kpis: {
      newLeads: { count: thisWeek, change },
      activeWorkflows: activeWorkflows || 0,
      upcomingBookings: upcomingBookings || 0,
      pendingQuotes: pendingQuotes || 0,
    },
    leadVolume,
    workflowDistribution,
    recentActivity: (recentActivity || []) as Record<string, unknown>[],
  };

  return Response.json(response);
}
