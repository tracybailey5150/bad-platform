'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Form, FormField } from '@/types';

const fieldTypes: FormField['type'][] = ['text', 'email', 'phone', 'textarea', 'select', 'checkbox'];

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchForms = useCallback(async () => {
    try {
      const res = await fetch('/api/forms');
      if (res.ok) {
        const data = await res.json();
        setForms(data.forms || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  async function toggleActive(form: Form) {
    await fetch('/api/forms', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: form.id, active: !form.active }),
    });
    fetchForms();
  }

  async function deleteForm(id: string) {
    await fetch('/api/forms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchForms();
  }

  function copyLink(formId: string) {
    const url = `${window.location.origin}/intake/${formId}`;
    navigator.clipboard.writeText(url);
    setCopied(formId);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">
            Build intake forms and share public links with clients.
          </p>
        </div>
        <Button onClick={() => { setEditingForm(null); setShowBuilder(true); }}>
          Create Form
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-zinc-500">Loading forms...</div>
      ) : forms.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-zinc-500">No forms yet. Create your first intake form.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-zinc-100">{form.name}</h3>
                  <Badge variant={form.active ? 'success' : 'default'}>
                    {form.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {form.description && (
                  <p className="text-sm text-zinc-500 mt-1">{form.description}</p>
                )}
                <p className="text-xs text-zinc-600 mt-2">
                  {form.fields.length} field{form.fields.length !== 1 ? 's' : ''} &middot;
                  Created {new Date(form.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyLink(form.id)}
                >
                  {copied === form.id ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => toggleActive(form)}
                >
                  {form.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setEditingForm(form); setShowBuilder(true); }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteForm(form.id)}
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <FormBuilderModal
        open={showBuilder}
        onClose={() => { setShowBuilder(false); setEditingForm(null); }}
        existingForm={editingForm}
        onSaved={fetchForms}
      />
    </div>
  );
}

function FormBuilderModal({
  open,
  onClose,
  existingForm,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  existingForm: Form | null;
  onSaved: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingForm) {
      setName(existingForm.name);
      setDescription(existingForm.description || '');
      setFields(existingForm.fields);
    } else {
      setName('');
      setDescription('');
      setFields([]);
    }
  }, [existingForm, open]);

  function addField(type: FormField['type']) {
    setFields([
      ...fields,
      {
        id: crypto.randomUUID(),
        type,
        label: '',
        placeholder: '',
        required: false,
        options: type === 'select' ? ['Option 1'] : undefined,
      },
    ]);
  }

  function updateField(id: string, updates: Partial<FormField>) {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }

  function removeField(id: string) {
    setFields(fields.filter((f) => f.id !== id));
  }

  function moveField(idx: number, dir: -1 | 1) {
    const newFields = [...fields];
    const target = idx + dir;
    if (target < 0 || target >= newFields.length) return;
    [newFields[idx], newFields[target]] = [newFields[target], newFields[idx]];
    setFields(newFields);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = { name, description, fields };

    try {
      if (existingForm) {
        await fetch('/api/forms', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: existingForm.id, ...payload }),
        });
      } else {
        await fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={existingForm ? 'Edit Form' : 'Create Form'} size="xl">
      <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <Input label="Form Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <div>
          <p className="text-sm font-medium text-zinc-300 mb-2">Fields</p>
          {fields.length === 0 && (
            <p className="text-sm text-zinc-500 mb-2">No fields added yet.</p>
          )}
          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div key={field.id} className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-400 uppercase">{field.type}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveField(idx, -1)} className="text-zinc-500 hover:text-zinc-300 p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button type="button" onClick={() => moveField(idx, 1)} className="text-zinc-500 hover:text-zinc-300 p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <button type="button" onClick={() => removeField(field.id)} className="text-red-400 hover:text-red-300 p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Label"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    required
                  />
                  <input
                    className="px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Placeholder"
                    value={field.placeholder || ''}
                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                  />
                </div>
                {field.type === 'select' && (
                  <input
                    className="w-full px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Options (comma-separated)"
                    value={field.options?.join(', ') || ''}
                    onChange={(e) =>
                      updateField(field.id, {
                        options: e.target.value.split(',').map((o) => o.trim()),
                      })
                    }
                  />
                )}
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="rounded border-zinc-600"
                  />
                  Required
                </label>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {fieldTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addField(type)}
                className="px-3 py-1 text-xs font-medium bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors capitalize"
              >
                + {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>
            {existingForm ? 'Update Form' : 'Create Form'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
