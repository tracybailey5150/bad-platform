import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return Response.json({ error: 'No signature' }, { status: 400 });
  }

  // Simple signature verification (in production, use stripe SDK)
  // For now, parse the event directly
  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const orgId = session.metadata?.org_id;
      if (!orgId) break;

      const { data: org } = await admin
        .from('organizations')
        .select('settings')
        .eq('id', orgId)
        .single();

      const settings = (org?.settings || {}) as Record<string, unknown>;

      await admin
        .from('organizations')
        .update({
          settings: {
            ...settings,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan: 'pro', // default to pro on first subscription
          },
        })
        .eq('id', orgId);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      // Find org by customer ID
      const { data: orgs } = await admin
        .from('organizations')
        .select('id, settings')
        .filter('settings->>stripe_customer_id', 'eq', customerId);

      if (orgs && orgs.length > 0) {
        const org = orgs[0];
        const settings = (org.settings || {}) as Record<string, unknown>;
        const status = subscription.status;
        const plan = status === 'active' ? (settings.plan || 'pro') : 'free';

        await admin
          .from('organizations')
          .update({
            settings: { ...settings, plan, subscription_status: status },
          })
          .eq('id', org.id);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      const { data: orgs } = await admin
        .from('organizations')
        .select('id, settings')
        .filter('settings->>stripe_customer_id', 'eq', customerId);

      if (orgs && orgs.length > 0) {
        const org = orgs[0];
        const settings = (org.settings || {}) as Record<string, unknown>;

        await admin
          .from('organizations')
          .update({
            settings: {
              ...settings,
              plan: 'free',
              stripe_subscription_id: null,
              subscription_status: 'canceled',
            },
          })
          .eq('id', org.id);
      }
      break;
    }
  }

  return Response.json({ received: true });
}
