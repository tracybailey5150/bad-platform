import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callAI } from '@/lib/ai/provider';
import type { AIAction } from '@/lib/ai/provider';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { action, data } = body as { action: AIAction; data: Record<string, string> };

  if (!action || !data) {
    return Response.json({ error: 'action and data required' }, { status: 400 });
  }

  try {
    let prompt = '';
    let systemPrompt = '';

    switch (action) {
      case 'summarize': {
        systemPrompt = 'You are a business assistant. Summarize the given text, extracting key points, action items, contact info, and next steps. Format with clear sections.';
        prompt = data.text || '';
        break;
      }

      case 'draft_reply': {
        const tone = data.tone || 'friendly';
        systemPrompt = `You are a professional business assistant. Draft a ${tone} reply to the lead described below. Keep it concise and actionable. Output just the email body text, no subject line.`;
        prompt = `Lead name: ${data.name || 'Unknown'}\nLead email: ${data.email || 'N/A'}\nCompany: ${data.company || 'N/A'}\nNotes: ${data.notes || 'None'}\nSource: ${data.source || 'Unknown'}`;
        break;
      }

      case 'route': {
        systemPrompt = 'You are a business automation assistant. Analyze the lead and suggest: 1) Which workflow to assign (e.g., Sales Pipeline, Support, Onboarding) 2) Priority level (low, medium, high, urgent) 3) Recommended team member role (sales, support, manager). Output as JSON with keys: workflow, priority, reasoning.';
        prompt = `Lead: ${data.name || 'Unknown'}\nEmail: ${data.email || 'N/A'}\nCompany: ${data.company || 'N/A'}\nSource: ${data.source || 'Unknown'}\nNotes: ${data.notes || 'None'}`;
        break;
      }

      case 'search': {
        systemPrompt = 'You are a search query parser. Convert the natural language search query into structured filters. Output JSON with keys: entity (leads/forms/workflows/bookings/quotes), filters (object with field:value pairs), dateRange (optional, {from, to}), keywords (array of search terms).';
        prompt = data.query || '';
        break;
      }

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await callAI({ action, prompt, systemPrompt });

    return Response.json({
      result: result.text,
      model: result.model,
      provider: result.provider,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
