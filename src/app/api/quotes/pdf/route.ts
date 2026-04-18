import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Quote ID required' }, { status: 400 });

  const admin = createAdminClient();

  const { data: quote, error } = await admin
    .from('quotes')
    .select('*')
    .eq('id', body.id)
    .eq('org_id', profile.org_id)
    .single();

  if (error || !quote) return Response.json({ error: 'Quote not found' }, { status: 404 });

  // Get org info for header
  const { data: org } = await admin
    .from('organizations')
    .select('name')
    .eq('id', profile.org_id)
    .single();

  const items = (quote.items || []) as Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Quote - ${quote.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #6366f1; padding-bottom: 20px; }
    .company-name { font-size: 24px; font-weight: 700; color: #6366f1; }
    .quote-label { font-size: 28px; font-weight: 300; color: #71717a; text-align: right; }
    .quote-number { font-size: 14px; color: #71717a; text-align: right; margin-top: 4px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .info-block h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; margin-bottom: 8px; }
    .info-block p { font-size: 14px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #f4f4f5; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #52525b; border-bottom: 1px solid #e4e4e7; }
    td { padding: 12px; font-size: 14px; border-bottom: 1px solid #f4f4f5; }
    td:nth-child(2), td:nth-child(3), td:nth-child(4),
    th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: right; }
    .totals { margin-left: auto; width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .totals-row.grand { border-top: 2px solid #18181b; padding-top: 10px; margin-top: 6px; font-weight: 700; font-size: 18px; }
    .notes { margin-top: 30px; padding: 16px; background: #fafafa; border-radius: 8px; }
    .notes h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; margin-bottom: 8px; }
    .notes p { font-size: 13px; line-height: 1.6; color: #3f3f46; white-space: pre-wrap; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company-name">${org?.name || 'Company'}</div>
    </div>
    <div>
      <div class="quote-label">QUOTE</div>
      <div class="quote-number">#${quote.id.slice(0, 8).toUpperCase()}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-block">
      <h3>Bill To</h3>
      <p><strong>${quote.client_name}</strong></p>
      ${quote.client_email ? `<p>${quote.client_email}</p>` : ''}
    </div>
    <div class="info-block" style="text-align: right;">
      <h3>Quote Details</h3>
      <p>Title: ${quote.title}</p>
      <p>Date: ${new Date(quote.created_at).toLocaleDateString()}</p>
      ${quote.valid_until ? `<p>Valid Until: ${new Date(quote.valid_until).toLocaleDateString()}</p>` : ''}
      <p>Status: ${quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>$${Number(item.unit_price).toFixed(2)}</td>
          <td>$${(item.quantity * item.unit_price).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal</span>
      <span>$${Number(quote.subtotal || 0).toFixed(2)}</span>
    </div>
    ${Number(quote.tax_rate) > 0 ? `
    <div class="totals-row">
      <span>Tax (${quote.tax_rate}%)</span>
      <span>$${Number(quote.tax_amount || 0).toFixed(2)}</span>
    </div>
    ` : ''}
    ${Number(quote.discount) > 0 ? `
    <div class="totals-row">
      <span>Discount</span>
      <span>-$${Number(quote.discount).toFixed(2)}</span>
    </div>
    ` : ''}
    <div class="totals-row grand">
      <span>Total</span>
      <span>$${Number(quote.total || 0).toFixed(2)}</span>
    </div>
  </div>

  ${quote.notes ? `
  <div class="notes">
    <h3>Notes</h3>
    <p>${quote.notes}</p>
  </div>
  ` : ''}

  ${quote.terms ? `
  <div class="notes" style="margin-top: 16px;">
    <h3>Terms & Conditions</h3>
    <p>${quote.terms}</p>
  </div>
  ` : ''}
</body>
</html>`;

  const filename = `quote-${quote.id.slice(0, 8).toUpperCase()}.html`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
