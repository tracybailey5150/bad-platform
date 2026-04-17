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
  const status = searchParams.get('status');

  const admin = createAdminClient();
  let query = admin
    .from('quotes')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data: quotes, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ quotes: quotes || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const body = await request.json();
  const admin = createAdminClient();

  const items = body.items || [];
  const subtotal = items.reduce((sum: number, item: { quantity: number; unit_price: number }) => sum + item.quantity * item.unit_price, 0);
  const taxRate = body.tax_rate || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const discount = body.discount || 0;
  const total = subtotal + taxAmount - discount;

  const { data: quote, error } = await admin
    .from('quotes')
    .insert({
      org_id: profile.org_id,
      title: body.title,
      client_name: body.client_name,
      client_email: body.client_email || null,
      items,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      discount,
      total,
      status: body.status || 'draft',
      valid_until: body.valid_until || null,
      notes: body.notes || null,
      terms: body.terms || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  await admin.from('activity_events').insert({
    org_id: profile.org_id,
    type: 'quote_created',
    title: `Quote created: ${body.title}`,
    description: `$${total.toFixed(2)} for ${body.client_name}`,
    metadata: { quote_id: quote.id },
    actor_id: user.id,
  });

  return Response.json({ quote });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Quote ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const admin = createAdminClient();
  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.client_name !== undefined) updates.client_name = body.client_name;
  if (body.client_email !== undefined) updates.client_email = body.client_email;
  if (body.status !== undefined) updates.status = body.status;
  if (body.valid_until !== undefined) updates.valid_until = body.valid_until;
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.terms !== undefined) updates.terms = body.terms;

  if (body.items !== undefined) {
    const items = body.items;
    const subtotal = items.reduce((sum: number, item: { quantity: number; unit_price: number }) => sum + item.quantity * item.unit_price, 0);
    const taxRate = body.tax_rate ?? 0;
    const taxAmount = subtotal * (taxRate / 100);
    const discount = body.discount ?? 0;
    const total = subtotal + taxAmount - discount;
    updates.items = items;
    updates.subtotal = subtotal;
    updates.tax_rate = taxRate;
    updates.tax_amount = taxAmount;
    updates.discount = discount;
    updates.total = total;
  }

  updates.updated_at = new Date().toISOString();

  const { data: quote, error } = await admin
    .from('quotes')
    .update(updates)
    .eq('id', body.id)
    .eq('org_id', profile.org_id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  await admin.from('activity_events').insert({
    org_id: profile.org_id,
    type: 'quote_updated',
    title: `Quote updated: ${quote.title}`,
    description: body.status ? `Status changed to ${body.status}` : 'Details updated',
    metadata: { quote_id: quote.id },
    actor_id: user.id,
  });

  return Response.json({ quote });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Quote ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from('quotes')
    .delete()
    .eq('id', body.id)
    .eq('org_id', profile.org_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
