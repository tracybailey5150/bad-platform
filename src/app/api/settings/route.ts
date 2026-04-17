import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const admin = createAdminClient();
  const section = request.nextUrl.searchParams.get('section');

  if (section === 'team') {
    const { data: members } = await admin
      .from('profiles')
      .select('id, email, full_name, avatar_url, role, created_at, updated_at')
      .eq('org_id', profile.org_id)
      .order('created_at', { ascending: true });
    return Response.json({ members: members || [] });
  }

  if (section === 'modules') {
    const { data: modules } = await admin
      .from('org_modules')
      .select('*')
      .eq('org_id', profile.org_id);
    return Response.json({ modules: modules || [] });
  }

  // Default: return org + profile
  const { data: org } = await admin
    .from('organizations')
    .select('*')
    .eq('id', profile.org_id)
    .single();

  return Response.json({ profile, org });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile?.org_id) return Response.json({ error: 'No organization' }, { status: 400 });

  const body = await request.json();
  const admin = createAdminClient();
  const { section } = body;

  // Profile update
  if (section === 'profile') {
    const updates: Record<string, unknown> = {};
    if (body.full_name !== undefined) updates.full_name = body.full_name;
    if (body.email !== undefined) updates.email = body.email;
    if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await admin
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ profile: data });
  }

  // Organization update (admin/owner only)
  if (section === 'organization') {
    if (profile.role !== 'owner' && profile.role !== 'admin') {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.settings !== undefined) updates.settings = body.settings;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await admin
      .from('organizations')
      .update(updates)
      .eq('id', profile.org_id)
      .select()
      .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ org: data });
  }

  // Team member role update
  if (section === 'team') {
    if (profile.role !== 'owner' && profile.role !== 'admin') {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { memberId, role, action: teamAction } = body;

    if (teamAction === 'remove') {
      const { error } = await admin
        .from('profiles')
        .update({ org_id: null })
        .eq('id', memberId)
        .eq('org_id', profile.org_id);

      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true });
    }

    if (role) {
      const { error } = await admin
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', memberId)
        .eq('org_id', profile.org_id);

      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Invalid team action' }, { status: 400 });
  }

  // Module toggle
  if (section === 'modules') {
    if (profile.role !== 'owner' && profile.role !== 'admin') {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { module_key, enabled } = body;

    // Upsert
    const { error } = await admin
      .from('org_modules')
      .upsert({
        org_id: profile.org_id,
        module_key,
        enabled,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'org_id,module_key' });

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Invalid section' }, { status: 400 });
}
