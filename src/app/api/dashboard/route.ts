import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const admin = createAdminClient();
  const orgId = profile.org_id;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // KPIs
  const [
    { count: newLeadsThisWeek },
    { count: newLeadsLastWeek },
    { count: activeWorkflows },
    { count: upcomingBookings },
    { count: pendingQuotes },
  ] = await Promise.all([
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', weekAgo.toISOString()),
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', twoWeeksAgo.toISOString()).lt('created_at', weekAgo.toISOString()),
    admin.from('workflows').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'active'),
    admin.from('bookings').select('*', { count: 'exact', head: true }).eq('org_id', orgId).gte('start_time', now.toISOString()).lte('start_time', weekAhead.toISOString()),
    admin.from('quotes').select('*', { count: 'exact', head: true }).eq('org_id', orgId).in('status', ['draft', 'sent']),
  ]);

  const thisWeek = newLeadsThisWeek || 0;
  const lastWeek = newLeadsLastWeek || 0;
  const change = lastWeek === 0 ? (thisWeek > 0 ? 100 : 0) : Math.round(((thisWeek - lastWeek) / lastWeek) * 100);

  // Lead volume last 7 days
  const leadVolume: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const { count } = await admin
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .gte('created_at', dayStart.toISOString())
      .lte('created_at', dayEnd.toISOString());

    leadVolume.push({
      day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
      count: count || 0,
    });
  }

  // Workflow distribution
  const { data: workflows } = await admin
    .from('workflows')
    .select('status')
    .eq('org_id', orgId);

  const wfCounts: Record<string, number> = {};
  (workflows || []).forEach((w) => {
    wfCounts[w.status] = (wfCounts[w.status] || 0) + 1;
  });
  const workflowDistribution = Object.entries(wfCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Recent activity
  const { data: recentActivity } = await admin
    .from('activity_events')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(10);

  return Response.json({
    kpis: {
      newLeads: { count: thisWeek, change },
      activeWorkflows: activeWorkflows || 0,
      upcomingBookings: upcomingBookings || 0,
      pendingQuotes: pendingQuotes || 0,
    },
    leadVolume,
    workflowDistribution,
    recentActivity: recentActivity || [],
  });
}
