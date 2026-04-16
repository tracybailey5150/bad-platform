'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Form, FormField } from '@/types';

export default function PublicIntakePage() {
  const params = useParams();
  const formId = params.formId as string;
  const [form, setForm] = useState<Form | null>(null);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState<Record<string, string | boolean>>({});

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`/api/intake/${formId}`);
        if (res.ok) {
          const data = await res.json();
          setForm(data.form);
          setOrgName(data.orgName || '');
          // Init values
          const init: Record<string, string | boolean> = {};
          data.form.fields.forEach((f: FormField) => {
            init[f.id] = f.type === 'checkbox' ? false : '';
          });
          setValues(init);
        } else {
          setError('Form not found or inactive.');
        }
      } catch {
        setError('Failed to load form.');
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [formId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/intake/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: values }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit form.');
      }
    } catch {
      setError('Failed to submit form.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">Thank you!</h2>
          <p className="text-sm text-zinc-400">
            Your submission has been received. We will be in touch soon.
          </p>
          {orgName && <p className="text-xs text-zinc-600 mt-4">{orgName}</p>}
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {orgName && (
          <p className="text-center text-xs text-zinc-500 mb-6">{orgName}</p>
        )}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">{form.name}</h1>
          {form.description && (
            <p className="text-sm text-zinc-400 mb-6">{form.description}</p>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {form.fields.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={values[field.id]}
                onChange={(val) => setValues({ ...values, [field.id]: val })}
              />
            ))}
            <Button type="submit" loading={submitting} className="w-full">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string | boolean;
  onChange: (val: string | boolean) => void;
}) {
  const baseInput = "w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  switch (field.type) {
    case 'textarea':
      return (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </label>
          <textarea
            className={baseInput}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            rows={4}
          />
        </div>
      );
    case 'select':
      return (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </label>
          <select
            className={baseInput}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    case 'checkbox':
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => onChange(e.target.checked)}
            required={field.required}
            className="rounded border-zinc-600 bg-zinc-800 text-indigo-500 focus:ring-indigo-500"
          />
          <span className="text-sm text-zinc-300">{field.label}</span>
          {field.required && <span className="text-red-400 text-xs">*</span>}
        </label>
      );
    default:
      return (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </label>
          <input
            type={field.type}
            className={baseInput}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        </div>
      );
  }
}
