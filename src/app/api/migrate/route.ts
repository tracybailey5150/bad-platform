import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const CONTACT_TABLE_SQL = `
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

export async function POST() {
  try {
    const supabase = createAdminClient();
    const created: string[] = [];

    // Check which tables already exist
    const { data: existingTables } = await supabase
      .from('information_schema.tables' as string)
      .select('table_name')
      .eq('table_schema', 'public');

    const tableNames = new Set(
      (existingTables || []).map((t: { table_name: string }) => t.table_name)
    );

    // Run the foundation migration SQL via rpc if tables don't exist
    const foundationTables = [
      'forms',
      'form_submissions',
      'workflows',
      'workflow_items',
      'activity_events',
      'bookings',
      'quotes',
    ];

    const missingFoundation = foundationTables.filter((t) => !tableNames.has(t));

    if (missingFoundation.length > 0) {
      // Execute the foundation migration
      const { error: migrationError } = await supabase.rpc('exec_sql', {
        sql: await getFoundationSQL(),
      });

      if (migrationError) {
        // Try direct query approach
        console.log('RPC exec_sql not available, trying direct approach:', migrationError.message);
      } else {
        created.push(...missingFoundation.map((t) => `public.${t}`));
      }
    }

    // Create contact_submissions table
    if (!tableNames.has('contact_submissions')) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: CONTACT_TABLE_SQL,
      });
      if (!error) {
        created.push('public.contact_submissions');
      } else {
        console.log('Could not create contact_submissions via RPC:', error.message);
      }
    }

    if (created.length === 0 && missingFoundation.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All tables already exist. No migration needed.',
        tables: foundationTables,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Migration complete. Created: ${created.join(', ') || 'none (may require manual SQL execution)'}`,
      created,
      note: missingFoundation.length > 0 && created.length === 0
        ? 'Some tables are missing but could not be created via RPC. Run the SQL in supabase/migrations/001_foundation.sql directly in the Supabase SQL editor.'
        : undefined,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Migration failed',
        detail: err instanceof Error ? err.message : 'Unknown error',
        note: 'You may need to run supabase/migrations/001_foundation.sql directly in the Supabase SQL editor.',
      },
      { status: 500 }
    );
  }
}

async function getFoundationSQL(): Promise<string> {
  // Read the migration file content
  // In production, this would be embedded. For now, return the key statements.
  const fs = await import('fs');
  const path = await import('path');
  try {
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '001_foundation.sql');
    return fs.readFileSync(migrationPath, 'utf-8');
  } catch {
    return '-- Migration file not found. Run SQL manually from supabase/migrations/001_foundation.sql';
  }
}
