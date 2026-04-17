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
export type WorkflowItemPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Workflow {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  statuses: string[];
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
  status: string;
  priority: WorkflowItemPriority;
  assigned_to: string | null;
  assignee_name?: string | null;
  due_date: string | null;
  notes: string | null;
  subtasks: Subtask[];
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
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
  client_phone: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface Quote {
  id: string;
  org_id: string;
  title: string;
  client_name: string;
  client_email: string | null;
  items: QuoteLineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  status: QuoteStatus;
  valid_until: string | null;
  notes: string | null;
  terms: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export type NotificationType =
  | 'lead_assigned'
  | 'status_changed'
  | 'booking_reminder'
  | 'quote_accepted'
  | 'workflow_due'
  | 'form_submitted'
  | 'team_invite'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  org_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export type BillingPlan = 'free' | 'pro' | 'business';

export interface OrgModule {
  org_id: string;
  module_key: string;
  enabled: boolean;
  updated_at: string;
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
