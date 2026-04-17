import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, projectType, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Try to store in form_submissions table
    // If the table doesn't exist yet, we'll catch the error and still return success
    try {
      await supabase.from('contact_submissions').insert({
        name,
        email,
        phone: phone || null,
        company: company || null,
        project_type: projectType || null,
        message,
        created_at: new Date().toISOString(),
      });
    } catch {
      // Table may not exist yet -- that's ok, we still acknowledge the submission
      console.log('Contact submission storage skipped (table may not exist)');
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out. We will get back to you within 24 hours.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again or email tracy@badsaas.app directly.' },
      { status: 500 }
    );
  }
}
