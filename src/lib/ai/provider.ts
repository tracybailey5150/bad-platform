// AI Provider Abstraction
// Cascade: Opus 4 -> Sonnet 4.6 -> OpenAI o4-mini
// Falls through on failure at each tier

export type AIAction = 'summarize' | 'draft_reply' | 'route' | 'search';

interface AIRequest {
  action: AIAction;
  prompt: string;
  systemPrompt?: string;
}

interface AIResponse {
  text: string;
  model: string;
  provider: 'anthropic' | 'openai';
}

const ANTHROPIC_MODELS = [
  process.env.ANTHROPIC_MODEL_PRIMARY || 'claude-opus-4-0-20250514',
  process.env.ANTHROPIC_MODEL_FALLBACK || 'claude-sonnet-4-6-20250514',
];

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'o4-mini';

async function callAnthropic(request: AIRequest, model: string): Promise<AIResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: request.systemPrompt || 'You are a helpful business assistant.',
      messages: [{ role: 'user', content: request.prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error (${model}): ${res.status} ${err}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';

  return { text, model, provider: 'anthropic' };
}

async function callOpenAI(request: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const model = OPENAI_MODEL;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: request.systemPrompt || 'You are a helpful business assistant.' },
        { role: 'user', content: request.prompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';

  return { text, model, provider: 'openai' };
}

export async function callAI(request: AIRequest): Promise<AIResponse> {
  // Tier 1 & 2: Anthropic Opus -> Sonnet
  if (process.env.ANTHROPIC_API_KEY) {
    for (const model of ANTHROPIC_MODELS) {
      try {
        return await callAnthropic(request, model);
      } catch {
        // Fall through to next model
      }
    }
  }

  // Tier 3: OpenAI o4-mini
  if (process.env.OPENAI_API_KEY) {
    return await callOpenAI(request);
  }

  throw new Error('No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.');
}
