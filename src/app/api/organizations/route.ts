import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { welcomeEmail } from '@/lib/email/templates';
import { sendEmail } from '@/lib/email/send';

export async function GET(): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const admin = createAdminClient();
  const { data: org, error } = await admin
    .from('organizations')
    .select('*')
    .eq('id', profile.org_id)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ organization: org });
}

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();
  const { name, user_id, full_name } = body;

  if (!name || !user_id) {
    return Response.json({ error: 'Name and user_id required' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Create organization
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { data: org, error: orgError } = await admin
    .from('organizations')
    .insert({ name, slug })
    .select()
    .single();

  if (orgError) {
    // Rollback: delete the orphaned auth user since org creation failed
    await admin.auth.admin.deleteUser(user_id);
    return Response.json({ error: 'Failed to create organization. Please try signing up again.' }, { status: 500 });
  }

  // Update or create profile
  const { error: profileError } = await admin
    .from('profiles')
    .upsert({
      id: user_id,
      full_name: full_name || name,
      org_id: org.id,
      role: 'owner',
    });

  if (profileError) {
    // Rollback: delete org and user since profile creation failed
    await admin.from('organizations').delete().eq('id', org.id);
    await admin.auth.admin.deleteUser(user_id);
    return Response.json({ error: 'Failed to create profile. Please try signing up again.' }, { status: 500 });
  }

  // Send welcome email
  const { data: authUser } = await admin.auth.admin.getUserById(user_id);
  if (authUser?.user?.email) {
    const welcome = welcomeEmail({ name: full_name || name });
    await sendEmail({ to: authUser.user.email, subject: welcome.subject, html: welcome.html });
  }

  return Response.json({ organization: org });
}

export async function PATCH(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('org_id, role').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });
  if (profile.role !== 'owner' && profile.role !== 'admin') {
    return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  const body = await request.json();
  const admin = createAdminClient();

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.settings !== undefined) updates.settings = body.settings;
  updates.updated_at = new Date().toISOString();

  const { data: org, error } = await admin
    .from('organizations')
    .update(updates)
    .eq('id', profile.org_id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ organization: org });
}
