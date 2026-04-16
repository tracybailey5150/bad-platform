-- BAD Platform Foundation Schema
-- Tables: forms, form_submissions, workflows, workflow_items, activity_events, bookings, quotes
-- Note: organizations, profiles, and leads tables already exist

-- Forms
create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  fields jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.forms enable row level security;

create policy "Users can view forms in their org" on public.forms
  for select using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can insert forms in their org" on public.forms
  for insert with check (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can update forms in their org" on public.forms
  for update using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can delete forms in their org" on public.forms
  for delete using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Public read for active forms (intake pages)
create policy "Anyone can read active forms" on public.forms
  for select using (active = true);

-- Form Submissions
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.form_submissions enable row level security;

create policy "Users can view submissions in their org" on public.form_submissions
  for select using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Anyone can insert submissions" on public.form_submissions
  for insert with check (true);

-- Workflows
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workflows enable row level security;

create policy "Users can view workflows in their org" on public.workflows
  for select using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can insert workflows in their org" on public.workflows
  for insert with check (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can update workflows in their org" on public.workflows
  for update using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can delete workflows in their org" on public.workflows
  for delete using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Workflow Items
create table if not exists public.workflow_items (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  assigned_to uuid references auth.users(id) on delete set null,
  due_date timestamptz,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workflow_items enable row level security;

create policy "Users can view workflow items in their org" on public.workflow_items
  for select using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can insert workflow items in their org" on public.workflow_items
  for insert with check (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can update workflow items in their org" on public.workflow_items
  for update using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can delete workflow items in their org" on public.workflow_items
  for delete using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Activity Events
create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  type text not null,
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.activity_events enable row level security;

create policy "Users can view events in their org" on public.activity_events
  for select using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Anyone can insert events" on public.activity_events
  for insert with check (true);

-- Bookings
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  client_name text,
  client_email text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Users can view bookings in their org" on public.bookings
  for select using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can insert bookings in their org" on public.bookings
  for insert with check (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can update bookings in their org" on public.bookings
  for update using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can delete bookings in their org" on public.bookings
  for delete using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Quotes
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  client_name text not null,
  client_email text,
  items jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null default 0,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected')),
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quotes enable row level security;

create policy "Users can view quotes in their org" on public.quotes
  for select using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can insert quotes in their org" on public.quotes
  for insert with check (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can update quotes in their org" on public.quotes
  for update using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can delete quotes in their org" on public.quotes
  for delete using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Indexes for performance
create index if not exists idx_forms_org_id on public.forms(org_id);
create index if not exists idx_form_submissions_org_id on public.form_submissions(org_id);
create index if not exists idx_form_submissions_form_id on public.form_submissions(form_id);
create index if not exists idx_workflows_org_id on public.workflows(org_id);
create index if not exists idx_workflow_items_org_id on public.workflow_items(org_id);
create index if not exists idx_workflow_items_workflow_id on public.workflow_items(workflow_id);
create index if not exists idx_activity_events_org_id on public.activity_events(org_id);
create index if not exists idx_activity_events_created_at on public.activity_events(created_at desc);
create index if not exists idx_bookings_org_id on public.bookings(org_id);
create index if not exists idx_bookings_start_time on public.bookings(start_time);
create index if not exists idx_quotes_org_id on public.quotes(org_id);
