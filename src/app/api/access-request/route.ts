import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, CONTACT_EMAIL } from '@/lib/email/send';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip, 5)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, company, reason, project } = body;

    if (!name || !email || !reason) {
      return NextResponse.json(
        { error: 'Name, email, and reason are required.' },
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

    const sanitize = (s: string | undefined) => s ? s.replace(/[<>]/g, '').trim().slice(0, 2000) : null;

    const supabase = createAdminClient();

    const { error: insertError } = await supabase.from('access_requests').insert({
      name: sanitize(name)!,
      email: sanitize(email)!,
      company: sanitize(company),
      reason: sanitize(reason)!,
      project: sanitize(project),
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('[access-request] insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save request.' },
        { status: 500 }
      );
    }

    // Notify Tracy
    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `Portfolio Access Request: ${sanitize(project) || 'General'} — ${sanitize(name)}`,
      html: `
        <h2>New Portfolio Access Request</h2>
        <p><strong>Name:</strong> ${sanitize(name)}</p>
        <p><strong>Email:</strong> ${sanitize(email)}</p>
        <p><strong>Company:</strong> ${sanitize(company) || 'N/A'}</p>
        <p><strong>Project:</strong> ${sanitize(project) || 'General'}</p>
        <p><strong>Reason:</strong> ${sanitize(reason)}</p>
        <hr />
        <p style="color:#888;font-size:12px;">Reply to this email or log in to the BAD admin to manage access.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request.' },
      { status: 500 }
    );
  }
}
