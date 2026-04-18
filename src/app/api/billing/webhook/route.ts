export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createHmac, timingSafeEqual } from 'crypto';

function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    // Stripe signature format: t=timestamp,v1=hash
    const parts = signature.split(',');
    const timestampPart = parts.find((p) => p.startsWith('t='));
    const sigPart = parts.find((p) => p.startsWith('v1='));

    if (!timestampPart || !sigPart) return false;

    const timestamp = timestampPart.slice(2);
    const expectedSig = sigPart.slice(3);

    // Check timestamp is within 5 minutes
    const age = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
    if (age > 300) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const computed = createHmac('sha256', secret).update(signedPayload).digest('hex');

    return timingSafeEqual(Buffer.from(computed), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

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

  if (!verifySignature(body, signature, webhookSecret)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

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
            plan: 'pro',
          },
        })
        .eq('id', orgId);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

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
