import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200);
  const offset = parseInt(searchParams.get('offset') || '0', 10) || 0;

  const admin = createAdminClient();
  const { data: workflows, count, error } = await admin
    .from('workflows')
    .select('*', { count: 'exact' })
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ workflows: workflows || [], total: count });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const body = await request.json();
  const admin = createAdminClient();

  const { data: workflow, error } = await admin
    .from('workflows')
    .insert({
      org_id: profile.org_id,
      name: body.name,
      description: body.description || null,
      statuses: body.statuses || ['New', 'In Progress', 'Review', 'Done'],
      status: 'active',
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  await admin.from('activity_events').insert({
    org_id: profile.org_id,
    type: 'workflow_created',
    title: `Workflow created: ${body.name}`,
    description: null,
    metadata: { workflow_id: workflow.id },
    actor_id: user.id,
  });

  return Response.json({ workflow });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Workflow ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const admin = createAdminClient();
  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;
  if (body.statuses !== undefined) updates.statuses = body.statuses;
  if (body.status !== undefined) updates.status = body.status;
  updates.updated_at = new Date().toISOString();

  const { data: workflow, error } = await admin
    .from('workflows')
    .update(updates)
    .eq('id', body.id)
    .eq('org_id', profile.org_id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ workflow });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Workflow ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const admin = createAdminClient();

  // Delete workflow items first
  await admin.from('workflow_items').delete().eq('workflow_id', body.id).eq('org_id', profile.org_id);

  const { error } = await admin
    .from('workflows')
    .delete()
    .eq('id', body.id)
    .eq('org_id', profile.org_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
