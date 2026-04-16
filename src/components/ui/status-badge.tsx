import { Badge } from './badge';
import type { LeadStatus, WorkflowStatus, WorkflowItemStatus, BookingStatus, QuoteStatus } from '@/types';

type StatusType = LeadStatus | WorkflowStatus | WorkflowItemStatus | BookingStatus | QuoteStatus;

const statusConfig: Record<string, { variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
  // Lead statuses
  new: { variant: 'info', label: 'New' },
  contacted: { variant: 'warning', label: 'Contacted' },
  qualified: { variant: 'success', label: 'Qualified' },
  won: { variant: 'success', label: 'Won' },
  lost: { variant: 'danger', label: 'Lost' },
  // Workflow statuses
  active: { variant: 'success', label: 'Active' },
  paused: { variant: 'warning', label: 'Paused' },
  completed: { variant: 'success', label: 'Completed' },
  archived: { variant: 'default', label: 'Archived' },
  // Workflow item statuses
  todo: { variant: 'default', label: 'To Do' },
  in_progress: { variant: 'info', label: 'In Progress' },
  review: { variant: 'warning', label: 'Review' },
  done: { variant: 'success', label: 'Done' },
  // Booking statuses
  pending: { variant: 'warning', label: 'Pending' },
  confirmed: { variant: 'success', label: 'Confirmed' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
  // Quote statuses
  draft: { variant: 'default', label: 'Draft' },
  sent: { variant: 'info', label: 'Sent' },
  accepted: { variant: 'success', label: 'Accepted' },
  rejected: { variant: 'danger', label: 'Rejected' },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status] || { variant: 'default' as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
