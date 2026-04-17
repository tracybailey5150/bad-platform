'use client';

import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leads': 'Lead Inbox',
  '/forms': 'Forms',
  '/workflows': 'Workflows',
  '/calendar': 'Calendar',
  '/bookings': 'Bookings',
  '/quotes': 'Quotes',
  '/reports': 'Reports',
  '/ai-assist': 'AI Assist',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/billing': 'Billing',
  '/team': 'Team',
};

export function AppShellWrapper({
  children,
  orgName,
  userName,
}: {
  children: React.ReactNode;
  orgName: string;
  userName: string;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'BAD Platform';

  return (
    <AppShell title={title} orgName={orgName} userName={userName}>
      {children}
    </AppShell>
  );
}
