'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PlanDef {
  id: string;
  name: string;
  price: string;
  priceId: string;
  features: string[];
  limits: string;
  popular?: boolean;
}

const plans: PlanDef[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceId: '',
    limits: '1 user, 100 leads, 5 forms',
    features: [
      '1 team member',
      '100 leads',
      '5 forms',
      'Basic workflows',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49/mo',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
    limits: '5 users, unlimited leads/forms',
    popular: true,
    features: [
      '5 team members',
      'Unlimited leads',
      'Unlimited forms',
      'AI Assist',
      'Email notifications',
      'Priority support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: '$149/mo',
    priceId: process.env.NEXT_PUBLIC_STRIPE_BIZ_PRICE_ID || 'price_business',
    limits: 'Unlimited users, everything',
    features: [
      'Unlimited team members',
      'Everything in Pro',
      'Custom branding',
      'API access',
      'Webhook integrations',
      'Priority support',
      'Dedicated account manager',
    ],
  },
];

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const fetchBilling = useCallback(async () => {
    try {
      const res = await fetch('/api/billing');
      if (res.ok) {
        const data = await res.json();
        setCurrentPlan(data.plan || 'free');
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  async function handleCheckout(priceId: string, planId: string) {
    if (!priceId || planId === 'free') return;
    setCheckoutLoading(planId);
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // silent
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing/portal');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // silent
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Success/cancel banners */}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400">
          Subscription activated successfully.
        </div>
      )}
      {canceled && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-400">
          Checkout was canceled. No changes were made.
        </div>
      )}

      {/* Current plan */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Current Plan</h3>
            <p className="text-sm text-zinc-400 mt-1">
              {loading ? 'Loading...' : (
                <>
                  You are on the <span className="text-indigo-400 font-medium capitalize">{currentPlan}</span> plan.
                </>
              )}
            </p>
          </div>
          {currentPlan !== 'free' && (
            <Button variant="secondary" onClick={handlePortal} loading={portalLoading}>
              Manage Subscription
            </Button>
          )}
        </div>
      </Card>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <div
              key={plan.id}
              className={`relative bg-zinc-900 border rounded-xl p-6 flex flex-col ${
                plan.popular
                  ? 'border-indigo-500/50 ring-1 ring-indigo-500/20'
                  : 'border-zinc-800'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-100">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-zinc-100">{plan.price}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{plan.limits}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <svg className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <Button variant="secondary" disabled className="w-full">
                  Current Plan
                </Button>
              ) : plan.id === 'free' ? (
                <Button variant="ghost" disabled className="w-full">
                  Free Tier
                </Button>
              ) : (
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full"
                  loading={checkoutLoading === plan.id}
                  onClick={() => handleCheckout(plan.priceId, plan.id)}
                >
                  {currentPlan === 'free' ? 'Upgrade' : 'Switch'} to {plan.name}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Billing history placeholder */}
      <Card>
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Billing History</h3>
        {currentPlan === 'free' ? (
          <p className="text-sm text-zinc-500">No billing history. Subscribe to a plan to see invoices here.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              View and download invoices from the{' '}
              <button onClick={handlePortal} className="text-indigo-400 hover:text-indigo-300 underline">
                Stripe Customer Portal
              </button>.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
