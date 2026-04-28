create table if not exists access_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  reason text not null,
  project text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table access_requests enable row level security;

create policy "Service role full access" on access_requests
  for all using (true) with check (true);
