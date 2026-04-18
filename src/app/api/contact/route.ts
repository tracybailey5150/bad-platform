import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { contactConfirmation, leadNotification } from '@/lib/email/templates';
import { sendEmail, CONTACT_EMAIL } from '@/lib/email/send';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip, 10)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, company, projectType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitize = (s: string | undefined) => s ? s.replace(/[<>]/g, '').trim().slice(0, 2000) : null;

    const supabase = createAdminClient();

    const { error: insertError } = await supabase.from('contact_submissions').insert({
      name: sanitize(name)!,
      email: sanitize(email)!,
      phone: sanitize(phone),
      company: sanitize(company),
      project_type: sanitize(projectType),
      message: sanitize(message)!,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to save your message. Please try again or email ' + CONTACT_EMAIL + ' directly.' },
        { status: 500 }
      );
    }

    // Send confirmation email to submitter
    const confirmation = contactConfirmation({ name });
    await sendEmail({ to: email, subject: confirmation.subject, html: confirmation.html });

    // Send lead notification to admin
    const notification = leadNotification({ name, email, phone, company, projectType, message });
    await sendEmail({ to: CONTACT_EMAIL, subject: notification.subject, html: notification.html });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out. We will get back to you within 24 hours.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again or email ' + CONTACT_EMAIL + ' directly.' },
      { status: 500 }
    );
  }
}
