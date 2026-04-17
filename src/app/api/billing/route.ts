import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const admin = createAdminClient();
  const { data: org } = await admin
    .from('organizations')
    .select('*')
    .eq('id', profile.org_id)
    .single();

  const settings = (org?.settings || {}) as Record<string, unknown>;

  return Response.json({
    plan: (settings.plan as string) || 'free',
    stripe_customer_id: settings.stripe_customer_id || null,
    stripe_subscription_id: settings.stripe_subscription_id || null,
    usage: {
      users: 1,
      leads: 0,
      forms: 0,
    },
  });
}

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id, email').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const body = await request.json();
  const { priceId } = body;

  if (!priceId) return Response.json({ error: 'priceId required' }, { status: 400 });

  const admin = createAdminClient();
  const { data: org } = await admin
    .from('organizations')
    .select('*')
    .eq('id', profile.org_id)
    .single();

  const settings = (org?.settings || {}) as Record<string, unknown>;
  let customerId = settings.stripe_customer_id as string | null;

  // Create Stripe customer if needed
  if (!customerId) {
    const customerRes = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: profile.email || user.email || '',
        'metadata[org_id]': profile.org_id,
      }),
    });

    if (!customerRes.ok) {
      return Response.json({ error: 'Failed to create customer' }, { status: 500 });
    }

    const customer = await customerRes.json();
    customerId = customer.id;

    await admin
      .from('organizations')
      .update({ settings: { ...settings, stripe_customer_id: customerId } })
      .eq('id', profile.org_id);
  }

  // Create checkout session
  const origin = request.headers.get('origin') || 'http://localhost:3000';
  const sessionRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      customer: customerId!,
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      mode: 'subscription',
      success_url: `${origin}/billing?success=true`,
      cancel_url: `${origin}/billing?canceled=true`,
      'metadata[org_id]': profile.org_id,
    }),
  });

  if (!sessionRes.ok) {
    const err = await sessionRes.text();
    return Response.json({ error: `Stripe error: ${err}` }, { status: 500 });
  }

  const session = await sessionRes.json();
  return Response.json({ url: session.url });
}
