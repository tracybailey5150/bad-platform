export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  org_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
export type LeadSource = 'website' | 'referral' | 'social' | 'cold_outreach' | 'form' | 'other';

export interface Lead {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: LeadStatus;
  source: LeadSource;
  score: number;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select fields
}

export interface Form {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  fields: FormField[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  org_id: string;
  lead_id: string | null;
  data: Record<string, unknown>;
  created_at: string;
}

export type WorkflowStatus = 'active' | 'paused' | 'completed' | 'archived';
export type WorkflowItemStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Workflow {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  status: WorkflowStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowItem {
  id: string;
  workflow_id: string;
  org_id: string;
  title: string;
  description: string | null;
  status: WorkflowItemStatus;
  assigned_to: string | null;
  due_date: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  org_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  client_name: string | null;
  client_email: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Quote {
  id: string;
  org_id: string;
  title: string;
  client_name: string;
  client_email: string | null;
  items: QuoteLineItem[];
  total: number;
  status: QuoteStatus;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export type ActivityEventType =
  | 'lead_created'
  | 'lead_updated'
  | 'form_submitted'
  | 'workflow_created'
  | 'workflow_updated'
  | 'booking_created'
  | 'booking_updated'
  | 'quote_created'
  | 'quote_updated';

export interface ActivityEvent {
  id: string;
  org_id: string;
  type: ActivityEventType;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  actor_id: string | null;
  created_at: string;
}
