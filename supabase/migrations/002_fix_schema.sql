-- ============================================================
-- BAD Platform — Schema Fix Migration
-- Adds missing columns, tables, and fixes mismatches
-- ============================================================

-- ── Fix profiles: add full_name column ──────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Populate full_name from existing data
UPDATE public.profiles SET full_name = COALESCE(display_name, first_name || ' ' || last_name) WHERE full_name IS NULL;

-- ── Fix workflows: add statuses column ──────────────────────
ALTER TABLE public.workflows ADD COLUMN IF NOT EXISTS statuses jsonb DEFAULT '["New","In Progress","Review","Done"]'::jsonb;

-- ── Fix workflow_items: add missing columns + relax status check ──
ALTER TABLE public.workflow_items ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium';
ALTER TABLE public.workflow_items ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.workflow_items DROP CONSTRAINT IF EXISTS workflow_items_status_check;

-- ── Fix bookings: add missing columns + relax status check ──
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_phone text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- ── Fix quotes: add missing columns + relax status check ────
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS subtotal numeric(10,2) DEFAULT 0;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS tax_rate numeric(5,2) DEFAULT 0;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS tax_amount numeric(10,2) DEFAULT 0;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS discount numeric(10,2) DEFAULT 0;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS valid_until date;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS terms text;
ALTER TABLE public.quotes DROP CONSTRAINT IF EXISTS quotes_status_check;

-- ── Create notifications table ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'system',
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read, created_at DESC);

-- ── Create contact_submissions table ────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view contact submissions" ON public.contact_submissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can insert contact submissions" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);
