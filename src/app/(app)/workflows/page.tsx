'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import type { Workflow, WorkflowItem, WorkflowItemPriority, Subtask } from '@/types';

const PRIORITY_COLORS: Record<WorkflowItemPriority, string> = {
  low: 'bg-zinc-600 text-zinc-200',
  medium: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  high: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  urgent: 'bg-red-500/15 text-red-400 border border-red-500/20',
};

const PRIORITIES: WorkflowItemPriority[] = ['low', 'medium', 'high', 'urgent'];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [items, setItems] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WorkflowItem | null>(null);
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterPriority, setFilterPriority] = useState<WorkflowItemPriority | ''>('');
  const dragItem = useRef<WorkflowItem | null>(null);

  const fetchWorkflows = useCallback(async () => {
    try {
      const res = await fetch('/api/workflows');
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data.workflows || []);
        if (data.workflows?.length > 0 && !selectedWorkflow) {
          setSelectedWorkflow(data.workflows[0]);
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [selectedWorkflow]);

  const fetchItems = useCallback(async () => {
    if (!selectedWorkflow) return;
    const params = new URLSearchParams({ workflow_id: selectedWorkflow.id });
    if (filterAssignee) params.set('assignee', filterAssignee);
    if (filterPriority) params.set('priority', filterPriority);

    try {
      const res = await fetch(`/api/workflow-items?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
      // silent
    }
  }, [selectedWorkflow, filterAssignee, filterPriority]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  useEffect(() => {
    if (selectedWorkflow) fetchItems();
  }, [selectedWorkflow, fetchItems]);

  function handleDragStart(item: WorkflowItem) {
    dragItem.current = item;
  }

  async function handleDrop(targetStatus: string) {
    if (!dragItem.current || dragItem.current.status === targetStatus) {
      dragItem.current = null;
      return;
    }
    const item = dragItem.current;
    dragItem.current = null;

    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: targetStatus } : i))
    );

    await fetch('/api/workflow-items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, status: targetStatus }),
    });
    fetchItems();
  }

  const statuses = selectedWorkflow?.statuses || ['New', 'In Progress', 'Review', 'Done'];

  function getItemsForStatus(status: string) {
    return items.filter((i) => i.status === status);
  }

  function isDueSoon(dateStr: string | null) {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    return diff > 0 && diff < 2 * 24 * 60 * 60 * 1000;
  }

  function isOverdue(dateStr: string | null) {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-zinc-500">Loading workflows...</div>;
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select
            value={selectedWorkflow?.id || ''}
            onChange={(e) => {
              const wf = workflows.find((w) => w.id === e.target.value);
              if (wf) setSelectedWorkflow(wf);
            }}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {workflows.length === 0 && <option value="">No workflows</option>}
            {workflows.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as WorkflowItemPriority | '')}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p} className="capitalize">
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>

          <Input
            placeholder="Filter assignee..."
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="w-40 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowCreateWorkflow(true)}>
            New Workflow
          </Button>
          {selectedWorkflow && (
            <Button onClick={() => setShowCreateItem(true)}>Add Item</Button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      {!selectedWorkflow ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-500 mb-4">No workflows yet. Create one to get started.</p>
            <Button onClick={() => setShowCreateWorkflow(true)}>Create Workflow</Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {statuses.map((status) => {
            const colItems = getItemsForStatus(status);
            return (
              <div
                key={status}
                className="flex-shrink-0 w-72 flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-xl"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(status)}
              >
                {/* Column header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-200">{status}</h3>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full">
                      {colItems.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {colItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      onClick={() => setSelectedItem(item)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 cursor-pointer hover:border-zinc-700 transition-colors"
                    >
                      <p className="text-sm font-medium text-zinc-100 mb-2">{item.title}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            PRIORITY_COLORS[item.priority as WorkflowItemPriority] || PRIORITY_COLORS.medium
                          }`}
                        >
                          {(item.priority || 'medium').charAt(0).toUpperCase() + (item.priority || 'medium').slice(1)}
                        </span>
                        {item.assigned_to && (
                          <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                            <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[8px] font-bold">
                              {(item.assignee_name || item.assigned_to || '?').charAt(0).toUpperCase()}
                            </span>
                          </span>
                        )}
                        {item.due_date && (
                          <span
                            className={`text-[10px] ${
                              isOverdue(item.due_date)
                                ? 'text-red-400'
                                : isDueSoon(item.due_date)
                                ? 'text-amber-400'
                                : 'text-zinc-500'
                            }`}
                          >
                            {new Date(item.due_date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Workflow Modal */}
      <CreateWorkflowModal
        open={showCreateWorkflow}
        onClose={() => setShowCreateWorkflow(false)}
        onCreated={() => {
          fetchWorkflows();
          setShowCreateWorkflow(false);
        }}
      />

      {/* Create Item Modal */}
      {selectedWorkflow && (
        <CreateItemModal
          open={showCreateItem}
          onClose={() => setShowCreateItem(false)}
          workflow={selectedWorkflow}
          onCreated={() => {
            fetchItems();
            setShowCreateItem(false);
          }}
        />
      )}

      {/* Item Detail Modal */}
      {selectedItem && selectedWorkflow && (
        <ItemDetailModal
          item={selectedItem}
          workflow={selectedWorkflow}
          onClose={() => setSelectedItem(null)}
          onUpdated={() => {
            fetchItems();
          }}
          onDeleted={() => {
            setSelectedItem(null);
            fetchItems();
          }}
        />
      )}
    </div>
  );
}

/* ---- Create Workflow Modal ---- */
function CreateWorkflowModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [statusesStr, setStatusesStr] = useState('New, In Progress, Review, Done');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const statuses = statusesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, statuses }),
      });
      if (res.ok) {
        setName('');
        setDescription('');
        setStatusesStr('New, In Progress, Review, Done');
        onCreated();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Workflow" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Workflow Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Statuses (comma-separated)
          </label>
          <input
            value={statusesStr}
            onChange={(e) => setStatusesStr(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="New, In Progress, Review, Done"
            required
          />
          <p className="text-xs text-zinc-500 mt-1">These become your Kanban columns.</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Create Workflow
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ---- Create Item Modal ---- */
function CreateItemModal({
  open,
  onClose,
  workflow,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  workflow: Workflow;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<WorkflowItemPriority>('medium');
  const [status, setStatus] = useState(workflow.statuses?.[0] || 'New');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/workflow-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow_id: workflow.id,
          title,
          description,
          priority,
          status,
          due_date: dueDate || null,
        }),
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setStatus(workflow.statuses?.[0] || 'New');
        setDueDate('');
        onCreated();
      }
    } finally {
      setSaving(false);
    }
  }

  const statuses = workflow.statuses || ['New', 'In Progress', 'Review', 'Done'];

  return (
    <Modal open={open} onClose={onClose} title="Add Item" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as WorkflowItemPriority)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Create Item
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ---- Item Detail Modal ---- */
function ItemDetailModal({
  item,
  workflow,
  onClose,
  onUpdated,
  onDeleted,
}: {
  item: WorkflowItem;
  workflow: Workflow;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [priority, setPriority] = useState<WorkflowItemPriority>(item.priority || 'medium');
  const [status, setStatus] = useState(item.status);
  const [dueDate, setDueDate] = useState(item.due_date ? item.due_date.split('T')[0] : '');
  const [notes, setNotes] = useState(item.notes || '');
  const [subtasks, setSubtasks] = useState<Subtask[]>(item.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [saving, setSaving] = useState(false);
  const [activity, setActivity] = useState<{ id: string; title: string; description: string | null; created_at: string }[]>([]);

  useEffect(() => {
    // Fetch activity for this item
    async function loadActivity() {
      try {
        const res = await fetch('/api/workflow-items?workflow_id=' + workflow.id);
        if (res.ok) {
          // Activity is tracked via activity_events, but we do not have a dedicated endpoint.
          // For simplicity, we skip dedicated activity fetching here.
        }
      } catch {
        // silent
      }
    }
    loadActivity();
  }, [item.id, workflow.id]);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch('/api/workflow-items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          title,
          description,
          priority,
          status,
          due_date: dueDate || null,
          notes,
          subtasks,
        }),
      });
      onUpdated();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await fetch('/api/workflow-items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id }),
    });
    onDeleted();
  }

  function addSubtask() {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { id: crypto.randomUUID(), title: newSubtask.trim(), done: false }]);
    setNewSubtask('');
  }

  function toggleSubtask(id: string) {
    setSubtasks(subtasks.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  }

  function removeSubtask(id: string) {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  }

  const statuses = workflow.statuses || ['New', 'In Progress', 'Review', 'Done'];

  return (
    <Modal open={true} onClose={onClose} title="Item Details" size="xl">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as WorkflowItemPriority)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Add notes..."
          />
        </div>

        {/* Subtasks */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Subtasks</label>
          <div className="space-y-1.5 mb-2">
            {subtasks.map((sub) => (
              <div key={sub.id} className="flex items-center gap-2 group">
                <input
                  type="checkbox"
                  checked={sub.done}
                  onChange={() => toggleSubtask(sub.id)}
                  className="rounded border-zinc-600"
                />
                <span
                  className={`flex-1 text-sm ${
                    sub.done ? 'line-through text-zinc-500' : 'text-zinc-200'
                  }`}
                >
                  {sub.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeSubtask(sub.id)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              placeholder="Add subtask..."
              className="flex-1 px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="button" size="sm" variant="secondary" onClick={addSubtask}>
              Add
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-zinc-800">
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete Item
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
