import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const fs = await import('fs');
    const path = await import('path');

    const sqlFiles: { name: string; content: string }[] = [];

    // Read foundation migration
    try {
      const foundationPath = path.join(process.cwd(), 'supabase', 'migrations', '001_foundation.sql');
      const content = fs.readFileSync(foundationPath, 'utf-8');
      sqlFiles.push({ name: '001_foundation.sql', content });
    } catch {
      // File not found
    }

    // Read contact submissions SQL
    const contactSQL = `
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  project_type text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

create policy "Service role can manage contact submissions" on public.contact_submissions
  for all using (true) with check (true);
`;
    sqlFiles.push({ name: 'contact_submissions', content: contactSQL });

    return NextResponse.json({
      success: true,
      message:
        'Copy and run each SQL block below in the Supabase SQL Editor (Dashboard > SQL Editor > New Query). ' +
        'The exec_sql RPC is not available by default -- these must be run manually.',
      migrations: sqlFiles.map((f) => ({
        name: f.name,
        sql: f.content,
      })),
      note: 'Run these in order. Each block is idempotent (uses IF NOT EXISTS).',
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Failed to read migration files',
        detail: err instanceof Error ? err.message : 'Unknown error',
        note: 'Run supabase/migrations/001_foundation.sql directly in the Supabase SQL editor.',
      },
      { status: 500 }
    );
  }
}
