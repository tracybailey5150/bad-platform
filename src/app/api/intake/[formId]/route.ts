import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
): Promise<Response> {
  const { formId } = await params;
  const admin = createAdminClient();

  const { data: form, error } = await admin
    .from('forms')
    .select('*')
    .eq('id', formId)
    .eq('active', true)
    .single();

  if (error || !form) {
    return Response.json({ error: 'Form not found or inactive' }, { status: 404 });
  }

  // Verify org exists (#11)
  const { data: org } = await admin
    .from('organizations')
    .select('name')
    .eq('id', form.org_id)
    .single();

  if (!org) {
    return Response.json({ error: 'Form organization not found' }, { status: 404 });
  }

  return Response.json({ form, orgName: org.name || '' });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
): Promise<Response> {
  // Rate limit (#20)
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip, 20)) {
    return Response.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  const { formId } = await params;
  const admin = createAdminClient();

  // Fetch form
  const { data: form, error: formError } = await admin
    .from('forms')
    .select('*')
    .eq('id', formId)
    .eq('active', true)
    .single();

  if (formError || !form) {
    return Response.json({ error: 'Form not found or inactive' }, { status: 404 });
  }

  // Verify org exists (#11)
  const { data: org } = await admin
    .from('organizations')
    .select('id')
    .eq('id', form.org_id)
    .single();

  if (!org) {
    return Response.json({ error: 'Form organization not found' }, { status: 404 });
  }

  const body = await request.json();
  const submissionData = body.data || {};

  // Extract lead info from submission
  let leadName = 'Unknown';
  let leadEmail: string | null = null;
  let leadPhone: string | null = null;

  for (const field of form.fields) {
    const val = submissionData[field.id];
    if (typeof val !== 'string') continue;

    // Sanitize (#23-25)
    const sanitized = val.replace(/[<>]/g, '').trim().slice(0, 2000);

    if (field.type === 'email' && sanitized) leadEmail = sanitized;
    if (field.type === 'phone' && sanitized) leadPhone = sanitized;
    if (field.type === 'text' && field.label.toLowerCase().includes('name') && sanitized) {
      leadName = sanitized;
    }
  }

  // Create lead -- check for success before continuing (#7)
  const { data: lead, error: leadError } = await admin
    .from('leads')
    .insert({
      org_id: form.org_id,
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      source: 'form',
      status: 'new',
      score: 0,
      notes: `Submitted via form: ${form.name}`,
    })
    .select()
    .single();

  if (leadError || !lead) {
    return Response.json({ error: 'Failed to create lead from submission' }, { status: 500 });
  }

  // Create form submission
  const { error: subError } = await admin
    .from('form_submissions')
    .insert({
      form_id: form.id,
      org_id: form.org_id,
      lead_id: lead.id,
      data: submissionData,
    });

  if (subError) {
    return Response.json({ error: 'Failed to save submission' }, { status: 500 });
  }

  // Log activity
  await admin.from('activity_events').insert({
    org_id: form.org_id,
    type: 'form_submitted',
    title: `Form submission: ${form.name}`,
    description: leadEmail || leadName,
    metadata: { form_id: form.id, lead_id: lead.id },
    actor_id: null,
  });

  return Response.json({ success: true });
}
