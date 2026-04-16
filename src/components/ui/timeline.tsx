import type { ActivityEvent } from '@/types';

const eventIcons: Record<string, string> = {
  lead_created: 'bg-indigo-500',
  lead_updated: 'bg-blue-500',
  form_submitted: 'bg-emerald-500',
  workflow_created: 'bg-purple-500',
  workflow_updated: 'bg-violet-500',
  booking_created: 'bg-amber-500',
  booking_updated: 'bg-yellow-500',
  quote_created: 'bg-teal-500',
  quote_updated: 'bg-cyan-500',
};

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function Timeline({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-zinc-500 py-4">No recent activity</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, idx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {idx !== events.length - 1 && (
                <span className="absolute top-4 left-3.5 -ml-px h-full w-0.5 bg-zinc-800" />
              )}
              <div className="relative flex items-start gap-3">
                <div
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-zinc-950 ${
                    eventIcons[event.type] || 'bg-zinc-600'
                  }`}
                >
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200">{event.title}</p>
                  {event.description && (
                    <p className="text-xs text-zinc-500 mt-0.5">{event.description}</p>
                  )}
                  <p className="text-xs text-zinc-600 mt-1">{formatTimeAgo(event.created_at)}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
