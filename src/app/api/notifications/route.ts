import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: notifications, error } = await admin
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const unreadCount = (notifications || []).filter((n: { read: boolean }) => !n.read).length;

  return Response.json({ notifications: notifications || [], unreadCount });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, read } = body;

  if (!id) return Response.json({ error: 'Notification ID required' }, { status: 400 });

  const admin = createAdminClient();

  if (id === 'all') {
    // Mark all as read
    const { error } = await admin
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  }

  const { data: notification, error } = await admin
    .from('notifications')
    .update({ read: read !== undefined ? read : true })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ notification });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id } = body;

  if (!id) return Response.json({ error: 'Notification ID required' }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
