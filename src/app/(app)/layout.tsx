import { createClient } from '@/lib/supabase/server';
import { AppShellWrapper } from './app-shell-wrapper';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let org = null;

  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = profileData;

    if (profile?.org_id) {
      const { data: orgData } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.org_id)
        .single();
      org = orgData;
    }
  }

  return (
    <AppShellWrapper
      orgName={org?.name || ''}
      userName={profile?.full_name || user?.email || ''}
    >
      {children}
    </AppShellWrapper>
  );
}
