'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card } from '@/components/ui/card';
import type { Quote, QuoteStatus, QuoteLineItem } from '@/types';

const STATUS_TABS: (QuoteStatus | 'all')[] = ['all', 'draft', 'sent', 'accepted', 'declined', 'expired'];

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const fetchQuotes = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);

    try {
      const res = await fetch(`/api/quotes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  async function handleSendQuote(quote: Quote) {
    await fetch('/api/quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: quote.id, status: 'sent' }),
    });
    fetchQuotes();
  }

  async function handleDeleteQuote(id: string) {
    await fetch('/api/quotes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchQuotes();
  }

  function handleDuplicate(quote: Quote) {
    setEditingQuote({
      ...quote,
      id: '',
      title: `${quote.title} (Copy)`,
      status: 'draft' as QuoteStatus,
    });
    setShowEditor(true);
  }

  async function handleGeneratePdf(quote: Quote) {
    try {
      const res = await fetch('/api/quotes/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: quote.id }),
      });
      if (res.ok) {
        const html = await res.text();
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(html);
          win.document.close();
        }
      }
    } catch {
      // silent
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">Create and manage client quotes and estimates.</p>
        <Button onClick={() => { setEditingQuote(null); setShowEditor(true); }}>
          Create Quote
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 w-fit">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
              statusFilter === s
                ? 'bg-indigo-500/15 text-indigo-400'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Quotes list */}
      {loading ? (
        <div className="text-center py-8 text-zinc-500">Loading quotes...</div>
      ) : quotes.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-zinc-500">No quotes found. Create your first one.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-zinc-100 truncate">{quote.title}</h3>
                    <StatusBadge status={quote.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>{quote.client_name}</span>
                    {quote.client_email && <span>{quote.client_email}</span>}
                    <span>{new Date(quote.created_at).toLocaleDateString()}</span>
                    {quote.valid_until && (
                      <span>
                        Valid until {new Date(quote.valid_until).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-xl font-bold text-zinc-100">${Number(quote.total || 0).toFixed(2)}</p>
                  <p className="text-xs text-zinc-500">{(quote.items || []).length} line items</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingQuote(quote);
                    setShowEditor(true);
                  }}
                >
                  Edit
                </Button>
                {quote.status === 'draft' && (
                  <Button size="sm" variant="secondary" onClick={() => handleSendQuote(quote)}>
                    Send Quote
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => handleGeneratePdf(quote)}>
                  Generate PDF
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDuplicate(quote)}>
                  Duplicate
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteQuote(quote.id)}>
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote Editor Modal */}
      <QuoteEditorModal
        open={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingQuote(null);
        }}
        existingQuote={editingQuote}
        onSaved={() => {
          fetchQuotes();
          setShowEditor(false);
          setEditingQuote(null);
        }}
      />
    </div>
  );
}

/* ---- Quote Editor Modal ---- */
function QuoteEditorModal({
  open,
  onClose,
  existingQuote,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  existingQuote: Quote | null;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [items, setItems] = useState<QuoteLineItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [saving, setSaving] = useState(false);

  const isUpdate = existingQuote && existingQuote.id;

  useEffect(() => {
    if (existingQuote) {
      setTitle(existingQuote.title);
      setClientName(existingQuote.client_name);
      setClientEmail(existingQuote.client_email || '');
      setValidUntil(existingQuote.valid_until ? existingQuote.valid_until.split('T')[0] : '');
      setItems(existingQuote.items || []);
      setTaxRate(existingQuote.tax_rate || 0);
      setDiscount(existingQuote.discount || 0);
      setNotes(existingQuote.notes || '');
      setTerms(existingQuote.terms || '');
    } else {
      setTitle('');
      setClientName('');
      setClientEmail('');
      setValidUntil('');
      setItems([]);
      setTaxRate(0);
      setDiscount(0);
      setNotes('');
      setTerms('');
    }
  }, [existingQuote, open]);

  function addLineItem() {
    setItems([
      ...items,
      { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0, total: 0 },
    ]);
  }

  function updateItem(id: string, field: string, value: string | number) {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.total = updated.quantity * updated.unit_price;
        return updated;
      })
    );
  }

  function removeItem(id: string) {
    setItems(items.filter((i) => i.id !== id));
  }

  function moveItem(idx: number, dir: -1 | 1) {
    const newItems = [...items];
    const target = idx + dir;
    if (target < 0 || target >= newItems.length) return;
    [newItems[idx], newItems[target]] = [newItems[target], newItems[idx]];
    setItems(newItems);
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        client_name: clientName,
        client_email: clientEmail || null,
        valid_until: validUntil || null,
        items: items.map((i) => ({ ...i, total: i.quantity * i.unit_price })),
        tax_rate: taxRate,
        discount,
        notes: notes || null,
        terms: terms || null,
      };

      if (isUpdate) {
        await fetch('/api/quotes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: existingQuote.id, ...payload }),
        });
      } else {
        await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isUpdate ? 'Edit Quote' : 'Create Quote'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Quote Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input
            label="Valid Until"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          <Input
            label="Client Email"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-zinc-300">Line Items</p>
            <Button type="button" size="sm" variant="secondary" onClick={addLineItem}>
              Add Item
            </Button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-zinc-500 py-4 text-center bg-zinc-800/50 rounded-lg border border-zinc-800">
              No line items. Click &quot;Add Item&quot; to start.
            </p>
          ) : (
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 px-1">
                <span className="text-xs text-zinc-500 font-medium">Description</span>
                <span className="text-xs text-zinc-500 font-medium text-right">Qty</span>
                <span className="text-xs text-zinc-500 font-medium text-right">Unit Price</span>
                <span className="text-xs text-zinc-500 font-medium text-right">Amount</span>
                <span />
              </div>
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 items-center">
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Description"
                    className="px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                    min={1}
                    className="px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-zinc-100 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => updateItem(item.id, 'unit_price', Number(e.target.value))}
                    min={0}
                    step="0.01"
                    className="px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-zinc-100 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-sm text-zinc-300 text-right pr-1">
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveItem(idx, -1)}
                      className="text-zinc-500 hover:text-zinc-300 p-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300 p-0.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-zinc-200">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Tax Rate (%)</span>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                min={0}
                step="0.1"
                className="w-20 px-2 py-1 text-sm bg-zinc-900 border border-zinc-700 rounded text-zinc-100 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <span className="text-zinc-200">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Discount ($)</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                min={0}
                step="0.01"
                className="w-20 px-2 py-1 text-sm bg-zinc-900 border border-zinc-700 rounded text-zinc-100 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <span className="text-zinc-200">-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-zinc-700">
            <span className="text-zinc-200">Total</span>
            <span className="text-zinc-100">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Additional notes..."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Terms & Conditions</label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={3}
              placeholder="Payment terms, conditions..."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {isUpdate ? 'Update Quote' : 'Create Quote'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
