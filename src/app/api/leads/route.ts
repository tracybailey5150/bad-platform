import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

interface LeadsListResponse {
  leads: Record<string, unknown>[];
  total?: number;
}

interface LeadActivityResponse {
  activity: Record<string, unknown>[];
}

interface LeadResponse {
  lead: Record<string, unknown>;
}

async function getAuthProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, error: Response.json({ error: 'Unauthorized' }, { status: 401 }) };

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return { user, profile: null, error: Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 }) };

  return { user, profile, error: null };
}

export async function GET(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { user, profile, error: authError } = await getAuthProfile(supabase);
  if (authError || !user || !profile) return authError!;

  const searchParams = request.nextUrl.searchParams;
  const activityLeadId = searchParams.get('activity');

  if (activityLeadId) {
    const admin = createAdminClient();
    const { data: activity } = await admin
      .from('activity_events')
      .select('*')
      .eq('org_id', profile.org_id)
      .contains('metadata', { lead_id: activityLeadId })
      .order('created_at', { ascending: false })
      .limit(20);
    return Response.json({ activity: activity || [] } satisfies LeadActivityResponse);
  }

  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200);
  const offset = parseInt(searchParams.get('offset') || '0', 10) || 0;

  const admin = createAdminClient();
  let query = admin
    .from('leads')
    .select('*', { count: 'exact' })
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);

  const { data: leads, count, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ leads: leads || [], total: count ?? undefined } satisfies LeadsListResponse);
}

export async function POST(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { user, profile, error: authError } = await getAuthProfile(supabase);
  if (authError || !user || !profile) return authError!;

  const body = await request.json();
  const admin = createAdminClient();

  const { data: lead, error } = await admin
    .from('leads')
    .insert({
      org_id: profile.org_id,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      company: body.company || null,
      source: body.source || 'other',
      notes: body.notes || null,
      status: 'new',
      score: 0,
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  await admin.from('activity_events').insert({
    org_id: profile.org_id,
    type: 'lead_created',
    title: `New lead: ${body.name}`,
    description: body.email || null,
    metadata: { lead_id: lead.id },
    actor_id: user.id,
  });

  return Response.json({ lead } satisfies LeadResponse);
}

export async function PATCH(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { user, profile, error: authError } = await getAuthProfile(supabase);
  if (authError || !user || !profile) return authError!;

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Lead ID required' }, { status: 400 });

  const admin = createAdminClient();
  const updates: Record<string, unknown> = {};
  if (body.status !== undefined) updates.status = body.status;
  if (body.assigned_to !== undefined) updates.assigned_to = body.assigned_to;
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.score !== undefined) updates.score = body.score;
  updates.updated_at = new Date().toISOString();

  const { data: lead, error } = await admin
    .from('leads')
    .update(updates)
    .eq('id', body.id)
    .eq('org_id', profile.org_id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  await admin.from('activity_events').insert({
    org_id: profile.org_id,
    type: 'lead_updated',
    title: `Lead updated: ${lead.name}`,
    description: body.status ? `Status changed to ${body.status}` : 'Lead details updated',
    metadata: { lead_id: lead.id },
    actor_id: user.id,
  });

  return Response.json({ lead } satisfies LeadResponse);
}

export async function DELETE(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { user, profile, error: authError } = await getAuthProfile(supabase);
  if (authError || !user || !profile) return authError!;

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Lead ID required' }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from('leads')
    .delete()
    .eq('id', body.id)
    .eq('org_id', profile.org_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
