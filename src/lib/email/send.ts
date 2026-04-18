const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'tracy@badsaas.app';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    // No email provider configured -- log and return false
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info(`[EMAIL] To: ${payload.to} | Subject: ${payload.subject}`);
    }
    return false;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `BAD <noreply@${process.env.RESEND_DOMAIN || 'badsaas.app'}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    return res.ok;
  } catch {
    return false;
  }
}

export { CONTACT_EMAIL };
