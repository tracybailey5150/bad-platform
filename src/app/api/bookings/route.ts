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
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const status = searchParams.get('status');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200);
  const offset = parseInt(searchParams.get('offset') || '0', 10) || 0;

  const admin = createAdminClient();
  let query = admin
    .from('bookings')
    .select('*', { count: 'exact' })
    .eq('org_id', profile.org_id)
    .order('start_time', { ascending: true })
    .range(offset, offset + limit - 1);

  if (startDate) query = query.gte('start_time', startDate);
  if (endDate) query = query.lte('start_time', endDate);
  if (status) query = query.eq('status', status);

  const { data: bookings, count, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ bookings: bookings || [], total: count });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const body = await request.json();
  const admin = createAdminClient();

  const { data: booking, error } = await admin
    .from('bookings')
    .insert({
      org_id: profile.org_id,
      title: body.title,
      description: body.description || null,
      start_time: body.start_time,
      end_time: body.end_time,
      status: body.status || 'confirmed',
      client_name: body.client_name || null,
      client_email: body.client_email || null,
      client_phone: body.client_phone || null,
      notes: body.notes || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  await admin.from('activity_events').insert({
    org_id: profile.org_id,
    type: 'booking_created',
    title: `Booking created: ${body.title}`,
    description: `${new Date(body.start_time).toLocaleDateString()} ${new Date(body.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    metadata: { booking_id: booking.id },
    actor_id: user.id,
  });

  return Response.json({ booking });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Booking ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const admin = createAdminClient();
  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.start_time !== undefined) updates.start_time = body.start_time;
  if (body.end_time !== undefined) updates.end_time = body.end_time;
  if (body.status !== undefined) updates.status = body.status;
  if (body.client_name !== undefined) updates.client_name = body.client_name;
  if (body.client_email !== undefined) updates.client_email = body.client_email;
  if (body.client_phone !== undefined) updates.client_phone = body.client_phone;
  if (body.notes !== undefined) updates.notes = body.notes;
  updates.updated_at = new Date().toISOString();

  const { data: booking, error } = await admin
    .from('bookings')
    .update(updates)
    .eq('id', body.id)
    .eq('org_id', profile.org_id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  await admin.from('activity_events').insert({
    org_id: profile.org_id,
    type: 'booking_updated',
    title: `Booking updated: ${booking.title}`,
    description: body.status ? `Status changed to ${body.status}` : 'Details updated',
    metadata: { booking_id: booking.id },
    actor_id: user.id,
  });

  return Response.json({ booking });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Booking ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const admin = createAdminClient();
  const { error } = await admin
    .from('bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', body.id)
    .eq('org_id', profile.org_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
