import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
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

export async function POST(request: NextRequest) {
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

  if (orgError) return Response.json({ error: orgError.message }, { status: 500 });

  // Update or create profile
  const { error: profileError } = await admin
    .from('profiles')
    .upsert({
      id: user_id,
      full_name: full_name || name,
      org_id: org.id,
      role: 'owner',
    });

  if (profileError) return Response.json({ error: profileError.message }, { status: 500 });

  return Response.json({ organization: org });
}

export async function PATCH(request: NextRequest) {
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
