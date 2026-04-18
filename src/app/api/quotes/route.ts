import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { quoteSentNotification } from '@/lib/email/templates';
import { sendEmail } from '@/lib/email/send';

interface QuoteLineItem {
  quantity: number;
  unit_price: number;
  description?: string;
}

function validateLineItems(items: QuoteLineItem[]): string | null {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.quantity || item.quantity <= 0) {
      return `Line item ${i + 1}: quantity must be greater than 0`;
    }
    if (item.unit_price === undefined || item.unit_price < 0) {
      return `Line item ${i + 1}: unit_price must be 0 or greater`;
    }
  }
  return null;
}

export async function GET(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200);
  const offset = parseInt(searchParams.get('offset') || '0', 10) || 0;

  const admin = createAdminClient();
  let query = admin
    .from('quotes')
    .select('*', { count: 'exact' })
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);

  const { data: quotes, count, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ quotes: quotes || [], total: count });
}

export async function POST(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const body = await request.json();
  const admin = createAdminClient();

  const items: QuoteLineItem[] = body.items || [];

  // Validate line items (#17)
  const validationError = validateLineItems(items);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const taxRate = body.tax_rate || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const discount = body.discount || 0;
  const total = subtotal + taxAmount - discount;

  if (total < 0) {
    return Response.json({ error: 'Quote total cannot be negative' }, { status: 400 });
  }

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

export async function PATCH(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Quote ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

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
    const items: QuoteLineItem[] = body.items;

    // Validate line items (#17)
    const validationError = validateLineItems(items);
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const taxRate = body.tax_rate ?? 0;
    const taxAmount = subtotal * (taxRate / 100);
    const discount = body.discount ?? 0;
    const total = subtotal + taxAmount - discount;

    if (total < 0) {
      return Response.json({ error: 'Quote total cannot be negative' }, { status: 400 });
    }

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

  // Send email when status changes to 'sent' (#2)
  if (body.status === 'sent' && quote.client_email) {
    const notification = quoteSentNotification({
      clientName: quote.client_name,
      quoteTitle: quote.title,
      total: `$${Number(quote.total || 0).toFixed(2)}`,
      quoteId: quote.id,
    });
    await sendEmail({ to: quote.client_email, subject: notification.subject, html: notification.html });
  }

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

export async function DELETE(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Quote ID required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization found. Complete signup first.' }, { status: 403 });

  const admin = createAdminClient();
  const { error } = await admin
    .from('quotes')
    .delete()
    .eq('id', body.id)
    .eq('org_id', profile.org_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
