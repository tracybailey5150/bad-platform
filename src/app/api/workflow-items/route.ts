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
  const workflowId = searchParams.get('workflow_id');
  const status = searchParams.get('status');
  const assignee = searchParams.get('assignee');
  const priority = searchParams.get('priority');

  const admin = createAdminClient();
  let query = admin
    .from('workflow_items')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('position', { ascending: true });

  if (workflowId) query = query.eq('workflow_id', workflowId);
  if (status) query = query.eq('status', status);
  if (assignee) query = query.eq('assigned_to', assignee);
  if (priority) query = query.eq('priority', priority);

  const { data: items, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ items: items || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const body = await request.json();
  const admin = createAdminClient();

  // Get max position for the target status column
  const { data: existing } = await admin
    .from('workflow_items')
    .select('position')
    .eq('workflow_id', body.workflow_id)
    .eq('status', body.status || 'New')
    .order('position', { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const { data: item, error } = await admin
    .from('workflow_items')
    .insert({
      workflow_id: body.workflow_id,
      org_id: profile.org_id,
      title: body.title,
      description: body.description || null,
      status: body.status || 'New',
      priority: body.priority || 'medium',
      assigned_to: body.assigned_to || null,
      due_date: body.due_date || null,
      notes: body.notes || null,
      subtasks: body.subtasks || [],
      position: nextPosition,
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  await admin.from('activity_events').insert({
    org_id: profile.org_id,
    type: 'workflow_updated',
    title: `Item created: ${body.title}`,
    description: `Added to workflow`,
    metadata: { workflow_item_id: item.id, workflow_id: body.workflow_id },
    actor_id: user.id,
  });

  return Response.json({ item });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Item ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const admin = createAdminClient();
  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.status !== undefined) updates.status = body.status;
  if (body.priority !== undefined) updates.priority = body.priority;
  if (body.assigned_to !== undefined) updates.assigned_to = body.assigned_to;
  if (body.due_date !== undefined) updates.due_date = body.due_date;
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.subtasks !== undefined) updates.subtasks = body.subtasks;
  if (body.position !== undefined) updates.position = body.position;
  updates.updated_at = new Date().toISOString();

  const { data: item, error } = await admin
    .from('workflow_items')
    .update(updates)
    .eq('id', body.id)
    .eq('org_id', profile.org_id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Log activity on status change
  if (body.status) {
    await admin.from('activity_events').insert({
      org_id: profile.org_id,
      type: 'workflow_updated',
      title: `Item moved: ${item.title}`,
      description: `Status changed to ${body.status}`,
      metadata: { workflow_item_id: item.id, workflow_id: item.workflow_id },
      actor_id: user.id,
    });
  }

  return Response.json({ item });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Item ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from('workflow_items')
    .delete()
    .eq('id', body.id)
    .eq('org_id', profile.org_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
