'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  orgName?: string;
  userName?: string;
}

export function AppShell({ children, title, orgName, userName }: AppShellProps) {
  return (
    <div className="flex h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} orgName={orgName} userName={userName} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
