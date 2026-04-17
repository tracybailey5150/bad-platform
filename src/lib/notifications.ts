import { createAdminClient } from '@/lib/supabase/admin';

export type NotificationType =
  | 'lead_assigned'
  | 'status_changed'
  | 'booking_reminder'
  | 'quote_accepted'
  | 'workflow_due'
  | 'form_submitted'
  | 'team_invite'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  org_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export async function createNotification(
  userId: string,
  orgId: string,
  type: NotificationType,
  title: string,
  body?: string,
  link?: string
) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('notifications')
    .insert({
      user_id: userId,
      org_id: orgId,
      type,
      title,
      body: body || null,
      link: link || null,
      read: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }

  return data;
}

export async function sendEmailNotification(
  to: string,
  subject: string,
  html: string
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn('RESEND_API_KEY not set, skipping email notification');
    return null;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'BAD Platform <notifications@badsaas.app>',
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Email send failed:', err);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('Email send error:', err);
    return null;
  }
}
