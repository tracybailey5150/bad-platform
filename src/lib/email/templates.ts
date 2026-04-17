/**
 * BAD Platform — Branded Email Templates
 *
 * Usage:
 *   import { welcomeEmail, contactConfirmation, leadNotification, quoteSentNotification } from '@/lib/email/templates';
 *   const { subject, html } = welcomeEmail({ name: 'John' });
 */

const BRAND = {
  name: 'BAD — Business Automation & Development',
  url: 'https://badsaas.app',
  logo: 'https://badsaas.app/bad-logo-transparent.png',
  blue: '#2563EB',
  bg: '#0B1220',
  card: '#1A1F2B',
  border: '#1E293B',
  gray: '#94A3B8',
  light: '#F1F5F9',
  email: 'tracy@badsaas.app',
  phone: '(479) 670-6073',
};

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:'Inter','Helvetica Neue',Arial,sans-serif;color:${BRAND.light};">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid ${BRAND.border};">
      <img src="${BRAND.logo}" alt="BAD" style="height:48px;margin-bottom:12px;" />
      <p style="font-size:11px;color:${BRAND.gray};letter-spacing:2px;text-transform:uppercase;margin:0;">
        Business Automation & Development
      </p>
    </div>

    <!-- Content -->
    <div style="padding:32px 0;">
      ${content}
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid ${BRAND.border};padding-top:24px;text-align:center;">
      <p style="font-size:12px;color:${BRAND.gray};margin:0 0 8px;">
        ${BRAND.name}
      </p>
      <p style="font-size:12px;color:${BRAND.gray};margin:0 0 4px;">
        <a href="mailto:${BRAND.email}" style="color:${BRAND.blue};text-decoration:none;">${BRAND.email}</a>
        &nbsp;&middot;&nbsp;
        ${BRAND.phone}
      </p>
      <p style="font-size:11px;color:#475569;margin:16px 0 0;">
        <a href="${BRAND.url}" style="color:#475569;text-decoration:none;">${BRAND.url.replace('https://', '')}</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function button(text: string, href: string): string {
  return `<div style="text-align:center;margin:28px 0;">
  <a href="${href}" style="display:inline-block;padding:14px 32px;background:${BRAND.blue};color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
    ${text}
  </a>
</div>`;
}

// ─── Welcome Email ──────────────────────────────────────────────────

export function welcomeEmail({ name }: { name: string }) {
  return {
    subject: `Welcome to BAD — Let's build something great`,
    html: layout(`
      <h1 style="font-size:24px;font-weight:700;color:${BRAND.light};margin:0 0 16px;">
        Welcome, ${name}.
      </h1>
      <p style="font-size:15px;color:${BRAND.gray};line-height:1.7;margin:0 0 16px;">
        Thanks for joining BAD. You now have access to the platform where we manage your
        custom automation systems, workflows, and reporting.
      </p>
      <p style="font-size:15px;color:${BRAND.gray};line-height:1.7;margin:0 0 16px;">
        Here is what happens next:
      </p>
      <ul style="font-size:14px;color:${BRAND.gray};line-height:1.8;padding-left:20px;margin:0 0 16px;">
        <li>Log in to your dashboard to view your project status</li>
        <li>Review any workflows or automations already in progress</li>
        <li>Reach out if you have questions — we are always available</li>
      </ul>
      ${button('Go to Dashboard', `${BRAND.url}/dashboard`)}
      <p style="font-size:13px;color:#475569;margin:0;">
        If you did not create this account, please contact us at ${BRAND.email}.
      </p>
    `),
  };
}

// ─── Contact Form Confirmation ──────────────────────────────────────

export function contactConfirmation({ name }: { name: string }) {
  return {
    subject: `We received your message — BAD`,
    html: layout(`
      <h1 style="font-size:24px;font-weight:700;color:${BRAND.light};margin:0 0 16px;">
        Thanks for reaching out, ${name}.
      </h1>
      <p style="font-size:15px;color:${BRAND.gray};line-height:1.7;margin:0 0 16px;">
        We received your message and Tracy will get back to you within 24 hours.
      </p>
      <p style="font-size:15px;color:${BRAND.gray};line-height:1.7;margin:0 0 16px;">
        In the meantime, here are a few ways to learn more about what we do:
      </p>
      <ul style="font-size:14px;color:${BRAND.gray};line-height:1.8;padding-left:20px;margin:0 0 16px;">
        <li><a href="${BRAND.url}/solutions" style="color:${BRAND.blue};text-decoration:none;">Our Solutions</a> — See what we build</li>
        <li><a href="${BRAND.url}/portfolio" style="color:${BRAND.blue};text-decoration:none;">Portfolio</a> — Real platforms for real businesses</li>
        <li><a href="${BRAND.url}/pricing" style="color:${BRAND.blue};text-decoration:none;">Pricing</a> — Transparent, project-based pricing</li>
      </ul>
      <p style="font-size:15px;color:${BRAND.gray};line-height:1.7;margin:0;">
        Talk soon.
      </p>
    `),
  };
}

// ─── Lead Notification (to Tracy) ────────────────────────────────────

export function leadNotification({
  name,
  email,
  phone,
  company,
  projectType,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  message: string;
}) {
  const fields = [
    { label: 'Name', value: name },
    { label: 'Email', value: email },
    { label: 'Phone', value: phone || '—' },
    { label: 'Company', value: company || '—' },
    { label: 'Project Type', value: projectType || '—' },
  ];

  const rows = fields
    .map(
      (f) =>
        `<tr>
          <td style="padding:8px 12px;font-size:13px;color:${BRAND.gray};border-bottom:1px solid ${BRAND.border};width:120px;font-weight:600;">${f.label}</td>
          <td style="padding:8px 12px;font-size:13px;color:${BRAND.light};border-bottom:1px solid ${BRAND.border};">${f.value}</td>
        </tr>`
    )
    .join('');

  return {
    subject: `New Lead: ${name}${company ? ` — ${company}` : ''}`,
    html: layout(`
      <h1 style="font-size:24px;font-weight:700;color:${BRAND.light};margin:0 0 16px;">
        New Contact Form Submission
      </h1>
      <table style="width:100%;border-collapse:collapse;background:${BRAND.card};border-radius:8px;overflow:hidden;margin:0 0 20px;">
        ${rows}
      </table>
      <div style="background:${BRAND.card};border-radius:8px;padding:16px;margin:0 0 20px;">
        <p style="font-size:12px;color:${BRAND.gray};text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;font-weight:600;">Message</p>
        <p style="font-size:14px;color:${BRAND.light};line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
      </div>
      ${button('Reply to Lead', `mailto:${email}?subject=RE: Your inquiry to BAD`)}
    `),
  };
}

// ─── Quote Sent Notification ─────────────────────────────────────────

export function quoteSentNotification({
  clientName,
  quoteTitle,
  total,
  quoteId,
}: {
  clientName: string;
  quoteTitle: string;
  total: string;
  quoteId: string;
}) {
  return {
    subject: `Your quote from BAD — ${quoteTitle}`,
    html: layout(`
      <h1 style="font-size:24px;font-weight:700;color:${BRAND.light};margin:0 0 16px;">
        Hi ${clientName},
      </h1>
      <p style="font-size:15px;color:${BRAND.gray};line-height:1.7;margin:0 0 16px;">
        A new quote has been prepared for you:
      </p>
      <div style="background:${BRAND.card};border-radius:8px;padding:20px;margin:0 0 20px;text-align:center;">
        <p style="font-size:14px;color:${BRAND.gray};margin:0 0 8px;">${quoteTitle}</p>
        <p style="font-size:32px;font-weight:700;color:${BRAND.light};margin:0;">${total}</p>
      </div>
      <p style="font-size:15px;color:${BRAND.gray};line-height:1.7;margin:0 0 16px;">
        Review the full quote details and let us know if you have any questions. We are
        happy to adjust the scope or walk through any line items.
      </p>
      ${button('View Quote', `${BRAND.url}/quotes/${quoteId}`)}
      <p style="font-size:13px;color:#475569;margin:0;">
        Questions? Reply to this email or call Tracy at ${BRAND.phone}.
      </p>
    `),
  };
}
