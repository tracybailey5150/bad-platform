// AI Provider Abstraction
// Routes by use case: fast tasks -> haiku, quality tasks -> sonnet
// Falls back to OpenAI if Anthropic unavailable

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

const FAST_ACTIONS: AIAction[] = ['summarize', 'route'];
const QUALITY_ACTIONS: AIAction[] = ['draft_reply', 'search'];

function getAnthropicModel(action: AIAction): string {
  if (FAST_ACTIONS.includes(action)) return 'claude-haiku-4-5-20241022';
  return 'claude-sonnet-4-6-20250514';
}

function getOpenAIModel(action: AIAction): string {
  if (FAST_ACTIONS.includes(action)) return 'gpt-4o-mini';
  return 'gpt-4o';
}

async function callAnthropic(request: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const model = getAnthropicModel(request.action);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: request.systemPrompt || 'You are a helpful business assistant.',
      messages: [{ role: 'user', content: request.prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';

  return { text, model, provider: 'anthropic' };
}

async function callOpenAI(request: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const model = getOpenAIModel(request.action);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
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
  // Try Anthropic first
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await callAnthropic(request);
    } catch {
      // Fall through to OpenAI
    }
  }

  // Fallback to OpenAI
  if (process.env.OPENAI_API_KEY) {
    return await callOpenAI(request);
  }

  throw new Error('No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.');
}

void QUALITY_ACTIONS;
