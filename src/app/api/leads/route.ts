import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const searchParams = request.nextUrl.searchParams;
  const activityLeadId = searchParams.get('activity');

  // If requesting activity for a specific lead
  if (activityLeadId) {
    const admin = createAdminClient();
    const { data: activity } = await admin
      .from('activity_events')
      .select('*')
      .eq('org_id', profile.org_id)
      .contains('metadata', { lead_id: activityLeadId })
      .order('created_at', { ascending: false })
      .limit(20);
    return Response.json({ activity: activity || [] });
  }

  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const admin = createAdminClient();
  let query = admin
    .from('leads')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);

  const { data: leads, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ leads: leads || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

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

  // Log activity
  await admin.from('activity_events').insert({
    org_id: profile.org_id,
    type: 'lead_created',
    title: `New lead: ${body.name}`,
    description: body.email || null,
    metadata: { lead_id: lead.id },
    actor_id: user.id,
  });

  return Response.json({ lead });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Lead ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

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

  // Log activity
  await admin.from('activity_events').insert({
    org_id: profile.org_id,
    type: 'lead_updated',
    title: `Lead updated: ${lead.name}`,
    description: body.status ? `Status changed to ${body.status}` : 'Lead details updated',
    metadata: { lead_id: lead.id },
    actor_id: user.id,
  });

  return Response.json({ lead });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Lead ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from('leads')
    .delete()
    .eq('id', body.id)
    .eq('org_id', profile.org_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
