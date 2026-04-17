import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const admin = createAdminClient();
  const { data: org } = await admin
    .from('organizations')
    .select('settings')
    .eq('id', profile.org_id)
    .single();

  const settings = (org?.settings || {}) as Record<string, unknown>;
  const customerId = settings.stripe_customer_id as string | null;

  if (!customerId) {
    return Response.json({ error: 'No Stripe customer found. Subscribe to a plan first.' }, { status: 400 });
  }

  const origin = request.headers.get('origin') || 'http://localhost:3000';

  const portalRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      customer: customerId,
      return_url: `${origin}/billing`,
    }),
  });

  if (!portalRes.ok) {
    const err = await portalRes.text();
    return Response.json({ error: `Stripe error: ${err}` }, { status: 500 });
  }

  const session = await portalRes.json();
  return Response.json({ url: session.url });
}
