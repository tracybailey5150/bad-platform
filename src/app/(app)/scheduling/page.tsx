'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Booking, BookingStatus } from '@/types';

type CalendarView = 'month' | 'week' | 'day';

const BOOKING_COLORS: Record<BookingStatus, string> = {
  confirmed: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  pending: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  cancelled: 'bg-red-500/15 border-red-500/30 text-red-300',
  completed: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(h: number) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour} ${ampm}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function SchedulingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreate, setShowCreate] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [createDefaults, setCreateDefaults] = useState<{ start?: string; end?: string }>({});

  const fetchBookings = useCallback(async () => {
    // Calculate date range based on view
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (view === 'month') {
      start.setDate(1);
      start.setDate(start.getDate() - start.getDay());
      end.setMonth(end.getMonth() + 1, 0);
      end.setDate(end.getDate() + (6 - end.getDay()));
    } else if (view === 'week') {
      start.setDate(start.getDate() - start.getDay());
      end.setDate(start.getDate() + 6);
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const params = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString(),
    });

    try {
      const res = await fetch(`/api/bookings?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [currentDate, view]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  function goToday() {
    setCurrentDate(new Date());
  }

  function navigate(direction: -1 | 1) {
    const next = new Date(currentDate);
    if (view === 'month') next.setMonth(next.getMonth() + direction);
    else if (view === 'week') next.setDate(next.getDate() + direction * 7);
    else next.setDate(next.getDate() + direction);
    setCurrentDate(next);
  }

  function getTitle() {
    if (view === 'month') {
      return currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    } else if (view === 'week') {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function handleSlotClick(date: Date, hour?: number) {
    const start = new Date(date);
    if (hour !== undefined) start.setHours(hour, 0, 0, 0);
    else start.setHours(9, 0, 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);
    setCreateDefaults({
      start: toDateTimeLocal(start),
      end: toDateTimeLocal(end),
    });
    setShowCreate(true);
  }

  function toDateTimeLocal(d: Date) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + 'T' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  // Upcoming bookings for sidebar
  const now = new Date();
  const upcomingBookings = bookings
    .filter((b) => new Date(b.start_time) >= now && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="secondary" onClick={goToday}>
            Today
          </Button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => navigate(1)}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <h2 className="text-lg font-semibold text-zinc-100">{getTitle()}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            {(['month', 'week', 'day'] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                  view === v ? 'bg-indigo-500/15 text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <Button onClick={() => { setCreateDefaults({}); setShowCreate(true); }}>
            New Booking
          </Button>
        </div>
      </div>

      {/* Calendar + Sidebar */}
      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-zinc-500">Loading calendar...</div>
          ) : view === 'month' ? (
            <MonthView
              currentDate={currentDate}
              bookings={bookings}
              onSlotClick={handleSlotClick}
              onBookingClick={setSelectedBooking}
            />
          ) : view === 'week' ? (
            <WeekView
              currentDate={currentDate}
              bookings={bookings}
              onSlotClick={handleSlotClick}
              onBookingClick={setSelectedBooking}
            />
          ) : (
            <DayView
              currentDate={currentDate}
              bookings={bookings}
              onSlotClick={handleSlotClick}
              onBookingClick={setSelectedBooking}
            />
          )}
        </div>

        {/* Upcoming sidebar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-zinc-200 mb-3">Upcoming</h3>
          {upcomingBookings.length === 0 ? (
            <p className="text-sm text-zinc-500">No upcoming bookings</p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="w-full text-left p-2.5 rounded-lg bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <p className="text-sm font-medium text-zinc-200 truncate">{b.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {new Date(b.start_time).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    {new Date(b.start_time).toLocaleTimeString(undefined, {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={b.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Booking Modal */}
      <CreateBookingModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        defaults={createDefaults}
        onCreated={() => {
          fetchBookings();
          setShowCreate(false);
        }}
      />

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdated={() => {
            fetchBookings();
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
}

/* ---- Month View ---- */
function MonthView({
  currentDate,
  bookings,
  onSlotClick,
  onBookingClick,
}: {
  currentDate: Date;
  bookings: Booking[];
  onSlotClick: (date: Date) => void;
  onBookingClick: (b: Booking) => void;
}) {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks: Date[][] = [];
  const cursor = new Date(startDate);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="grid grid-cols-7">
        {dayNames.map((d) => (
          <div key={d} className="px-2 py-2 text-center text-xs font-medium text-zinc-500 border-b border-zinc-800">
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((date, di) => {
            const isCurrentMonth = date.getMonth() === month;
            const isToday = isSameDay(date, today);
            const dayBookings = bookings.filter((b) => isSameDay(new Date(b.start_time), date));

            return (
              <div
                key={di}
                onClick={() => onSlotClick(date)}
                className={`min-h-[80px] border-b border-r border-zinc-800 p-1.5 cursor-pointer hover:bg-zinc-800/30 transition-colors ${
                  !isCurrentMonth ? 'opacity-40' : ''
                }`}
              >
                <div
                  className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-indigo-500 text-white' : 'text-zinc-400'
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="space-y-0.5">
                  {dayBookings.slice(0, 3).map((b) => (
                    <button
                      key={b.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick(b);
                      }}
                      className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate border ${
                        BOOKING_COLORS[b.status]
                      }`}
                    >
                      {b.title}
                    </button>
                  ))}
                  {dayBookings.length > 3 && (
                    <span className="text-[10px] text-zinc-500 px-1.5">+{dayBookings.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ---- Week View ---- */
function WeekView({
  currentDate,
  bookings,
  onSlotClick,
  onBookingClick,
}: {
  currentDate: Date;
  bookings: Booking[];
  onSlotClick: (date: Date, hour: number) => void;
  onBookingClick: (b: Booking) => void;
}) {
  const today = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-zinc-800">
        <div className="p-2" />
        {days.map((d, i) => {
          const isToday = isSameDay(d, today);
          return (
            <div key={i} className="p-2 text-center border-l border-zinc-800">
              <p className="text-xs text-zinc-500">
                {d.toLocaleDateString(undefined, { weekday: 'short' })}
              </p>
              <p
                className={`text-lg font-semibold ${
                  isToday ? 'text-indigo-400' : 'text-zinc-200'
                }`}
              >
                {d.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto max-h-[600px]">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)]">
            <div className="p-1 text-right pr-2 text-[10px] text-zinc-600">{formatHour(hour)}</div>
            {days.map((d, di) => {
              const hourBookings = bookings.filter((b) => {
                const bDate = new Date(b.start_time);
                return isSameDay(bDate, d) && bDate.getHours() === hour;
              });

              return (
                <div
                  key={di}
                  onClick={() => onSlotClick(d, hour)}
                  className="border-l border-b border-zinc-800 min-h-[40px] p-0.5 cursor-pointer hover:bg-zinc-800/30 transition-colors relative"
                >
                  {hourBookings.map((b) => (
                    <button
                      key={b.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick(b);
                      }}
                      className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate border mb-0.5 ${
                        BOOKING_COLORS[b.status]
                      }`}
                    >
                      {b.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Day View ---- */
function DayView({
  currentDate,
  bookings,
  onSlotClick,
  onBookingClick,
}: {
  currentDate: Date;
  bookings: Booking[];
  onSlotClick: (date: Date, hour: number) => void;
  onBookingClick: (b: Booking) => void;
}) {
  const dayBookings = bookings.filter((b) => isSameDay(new Date(b.start_time), currentDate));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-y-auto max-h-[600px]">
        {HOURS.map((hour) => {
          const hourBookings = dayBookings.filter((b) => new Date(b.start_time).getHours() === hour);
          return (
            <div
              key={hour}
              onClick={() => onSlotClick(currentDate, hour)}
              className="grid grid-cols-[80px_1fr] border-b border-zinc-800 cursor-pointer hover:bg-zinc-800/30 transition-colors"
            >
              <div className="p-3 text-right pr-4 text-xs text-zinc-500">{formatHour(hour)}</div>
              <div className="p-2 border-l border-zinc-800 min-h-[56px]">
                {hourBookings.map((b) => (
                  <button
                    key={b.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookingClick(b);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg border mb-1 ${BOOKING_COLORS[b.status]}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{b.title}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs opacity-70 mt-0.5">
                      {new Date(b.start_time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                      {' - '}
                      {new Date(b.end_time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                    </p>
                    {b.client_name && <p className="text-xs opacity-60 mt-0.5">{b.client_name}</p>}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Create Booking Modal ---- */
function CreateBookingModal({
  open,
  onClose,
  defaults,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  defaults: { start?: string; end?: string };
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [status, setStatus] = useState<BookingStatus>('confirmed');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setStartTime(defaults.start || '');
      setEndTime(defaults.end || '');
    }
  }, [open, defaults]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          client_name: clientName || null,
          client_email: clientEmail || null,
          client_phone: clientPhone || null,
          status,
          notes,
        }),
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setStartTime('');
        setEndTime('');
        setClientName('');
        setClientEmail('');
        setClientPhone('');
        setStatus('confirmed');
        setNotes('');
        onCreated();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Booking" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <Input
            label="End Time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <Input label="Client Email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
          <Input label="Client Phone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus)}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Create Booking</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ---- Booking Detail Modal ---- */
function BookingDetailModal({
  booking,
  onClose,
  onUpdated,
}: {
  booking: Booking;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [saving, setSaving] = useState(false);

  async function handleStatusChange(newStatus: BookingStatus) {
    setStatus(newStatus);
    setSaving(true);
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: booking.id, status: newStatus }),
      });
      onUpdated();
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    await fetch('/api/bookings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: booking.id }),
    });
    onUpdated();
  }

  return (
    <Modal open={true} onClose={onClose} title={booking.title} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-zinc-500">Start</p>
              <p className="text-sm text-zinc-200">
                {new Date(booking.start_time).toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">End</p>
              <p className="text-sm text-zinc-200">
                {new Date(booking.end_time).toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {booking.client_name && (
              <div>
                <p className="text-xs text-zinc-500">Client</p>
                <p className="text-sm text-zinc-200">{booking.client_name}</p>
              </div>
            )}
            {booking.client_email && (
              <div>
                <p className="text-xs text-zinc-500">Email</p>
                <p className="text-sm text-zinc-200">{booking.client_email}</p>
              </div>
            )}
            {booking.client_phone && (
              <div>
                <p className="text-xs text-zinc-500">Phone</p>
                <p className="text-sm text-zinc-200">{booking.client_phone}</p>
              </div>
            )}
          </div>
        </div>

        {booking.description && (
          <div>
            <p className="text-xs text-zinc-500 mb-1">Description</p>
            <p className="text-sm text-zinc-300">{booking.description}</p>
          </div>
        )}

        {booking.notes && (
          <div>
            <p className="text-xs text-zinc-500 mb-1">Notes</p>
            <p className="text-sm text-zinc-300">{booking.notes}</p>
          </div>
        )}

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
            disabled={saving}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex justify-between pt-4 border-t border-zinc-800">
          <Button variant="danger" size="sm" onClick={handleCancel}>
            Cancel Booking
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
