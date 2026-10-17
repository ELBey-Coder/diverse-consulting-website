export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the AI assistant for Diverse Consulting LLC (diverseconsultingllc.com).

Business info:
- Based in Indian Head, MD, serving clients nationwide virtually
- Tagline: Grow. Brand. Earn. Succeed Online.
- Services: AI workflow consulting, custom AI agents/chatbots, AI voice agents, digital marketing, affiliate marketing, web hosting, SEO, lead generation, business automation
- Pricing:
  - Starter: $497/month — missed-call text-back and lead capture
  - Growth: $997/month — AI receptionist, booking, CRM automation
  - Professional: $1,500–$2,500/month — voice, chat, follow-up, custom workflows
  - If pricing questions come up, give these exact prices and offer to book a free 15-min strategy session for a custom quote
- Free 15-minute AI & Marketing Strategy Session — primary conversion goal
- Consultation requests go through HubSpot form (secure)
- Contact: +1 (443) 295-3247, Consulting@DiverseConsultingllc.com

Important accuracy and conversion rules:
- Never guarantee that a service prevents every missed lead, answers every call, or guarantees revenue. Use measured language such as 'helps recover missed-call opportunities' and explain that results depend on configuration and customer response.
- Do not imply a text-back fires the second a call is missed unless the client's phone/CRM integration is configured and verified. Do not claim an AI voice agent is included in Starter.
- When a visitor is ready to book, give the direct secure consultation link: https://42o6zx.share-na2.hsforms.com/2HLIbABvpQAOnm6upaf1ysQ . This is a HubSpot consultation request form, not a verified live calendar or confirmed appointment.
- Qualify naturally, asking no more than two questions at a time. Capture business type, approximate missed calls per week, and preferred contact method (phone, email, or text) without requesting sensitive details in chat. Offer the secure HubSpot form for submitting contact details.
- Do not claim leads have been saved to HubSpot or a booking confirmed unless the user completes the actual form and receives confirmation.

Your job:
1. Hold natural, detailed conversations — not keyword matching. Give specific, helpful answers tailored to the visitor's industry and situation.
2. Qualify visitors: ask about business type, what they want to automate, urgency, package interest
3. Recommend the right package based on needs, with concrete examples of how it helps their specific trade
4. Answer FAQs about AI agents, chatbots, voice agents, HubSpot automation, websites, hosting, SEO
5. Guide toward booking a free strategy session when appropriate
6. Be conversational and thorough. Explain HOW the service solves their problem, not just what it is.

Do not invent services or pricing not listed. If unsure, offer the strategy session.`;

const BOOKING_URL = 'https://42o6zx.share-na2.hsforms.com/2HLIbABvpQAOnm6upaf1ysQ';

function fallbackAnswer(question: string): string {
  const q = question.toLowerCase();
  const intro = 'I can help you explore Diverse Consulting services. Live AI responses are temporarily unavailable, but here is our service information. ';
  if (/miss(ed|ing)? call|receptionist|phone|electri|plumb|hvac|roof|contractor|appointment/.test(q)) {
    return intro + 'For a busy electrical or other service contractor, our Growth package ($997/month) includes an AI receptionist, appointment booking, and CRM automation to help capture inquiries while your crew is on job sites. Starter ($497/month) provides missed-call text-back and lead capture. Would you like to discuss your call volume and booking needs? Book a free 15-minute strategy session: ' + BOOKING_URL;
  }
  if (/pric|cost|package|plan|recommend/.test(q)) {
    return intro + 'Starter: $497/month for missed-call text-back and lead capture. Growth: $997/month for AI receptionist, booking, and CRM automation. Professional: $1,500–$2,500/month for voice agents, chatbots, follow-up, and custom workflows. Tell me your business type and the main task you want automated, or request a free consultation: ' + BOOKING_URL;
  }
  if (/hubspot|crm|lead|follow.up/.test(q)) {
    return intro + 'We help businesses capture inquiries, qualify leads, and organize customer follow-up using CRM automation, including HubSpot workflows. The exact setup depends on your current systems. Request a free strategy session: ' + BOOKING_URL;
  }
  if (/website|seo|marketing|hosting/.test(q)) {
    return intro + 'Diverse Consulting offers website and hosting services, SEO, digital marketing, lead generation, and business automation. Tell me which area you want to improve, or book a free strategy session: ' + BOOKING_URL;
  }
  return intro + 'We offer AI receptionists, chatbots, voice agents, missed-call text-back, lead capture, booking, CRM automation, websites, SEO, and marketing. What type of business do you run and what would you like to improve? You can also book a free 15-minute strategy session: ' + BOOKING_URL;
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type GoogleModel = { name?: string; supportedGenerationMethods?: string[] };

async function googleReply(messages: ChatMessage[], key: string): Promise<string> {
  const headers = { 'Content-Type': 'application/json', 'x-goog-api-key': key };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    // Discover models the actual API key can use instead of assuming a moving alias works.
    const list = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000', {
      headers: { 'x-goog-api-key': key }, signal: controller.signal, cache: 'no-store',
    });
    if (!list.ok) throw new Error('models.list HTTP ' + list.status + ': ' + (await list.text()).slice(0, 500));
    const catalog = await list.json() as { models?: GoogleModel[] };
    // Prefer an explicitly known free-tier model; never select unrelated/zero-quota
    // experimental models just because their name contains "flash".
    const preferred = ['models/gemini-3.5-flash-lite', 'models/gemini-3.8-flash'];
    const supported = new Set((catalog.models || [])
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name));
    const model = preferred.find(name => supported.has(name));
    if (!model) throw new Error('No approved Gemini model available for this API key');
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/' + model + ':generateContent', {
      method: 'POST', headers, signal: controller.signal, cache: 'no-store',
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { maxOutputTokens: 600 },
      }),
    });
    if (!response.ok) throw new Error('generateContent ' + model + ' HTTP ' + response.status + ': ' + (await response.text()).slice(0, 500));
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const answer = payload.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim();
    if (!answer) throw new Error('Gemini returned no text');
    return answer;
  } finally {
    clearTimeout(timeout);
  }
}

// Allow the public Hostinger website to call this Vercel API without exposing the Gemini key.
const ALLOWED_ORIGINS = new Set([
  'https://diverseconsultingllc.com',
  'https://www.diverseconsultingllc.com',
]);
function allowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    return url.protocol === 'https:' && (
      url.hostname === 'diverse-consulting-chat-api.vercel.app' ||
      url.hostname === 'diverse-consulting-chat-api-diverseconsulting.vercel.app' ||
      (url.hostname.startsWith('diverse-consulting-chat-') &&
       url.hostname.endsWith('-diverseconsulting.vercel.app')) ||
      url.hostname === 'diverse-consulting-ai-preview.vercel.app' ||
      (url.hostname.startsWith('diverse-consulting-ai-preview-') &&
       url.hostname.endsWith('-diverseconsulting.vercel.app'))
    );
  } catch {
    return false;
  }
}
function corsHeaders(origin: string | null): HeadersInit {
  return origin && allowedOrigin(origin)
    ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
    : { 'Vary': 'Origin' };
}
function reply(data: unknown, status: number, origin: string | null) {
  return Response.json(data, { status, headers: corsHeaders(origin) });
}
export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin');
  if (!origin || !allowedOrigin(origin)) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  if (origin && !allowedOrigin(origin)) return reply({ error: 'ORIGIN_NOT_ALLOWED' }, 403, origin);
  if (Number(req.headers.get('content-length') || 0) > 45000) return reply({ error: 'REQUEST_TOO_LARGE' }, 413, origin);
  let raw: unknown;
  try { raw = await req.json(); }
  catch { return reply({ error: 'INVALID_REQUEST', message: 'Invalid JSON.' }, 400, origin); }
  const messages = (raw && typeof raw === 'object' && 'messages' in raw && Array.isArray(raw.messages))
    ? raw.messages.filter((m: unknown): m is ChatMessage => !!m && typeof m === 'object'
        && 'role' in m && (m.role === 'user' || m.role === 'assistant')
        && 'content' in m && typeof m.content === 'string' && m.content.length <= 4000).slice(-10)
    : [];
  const question = [...messages].reverse().find((m: ChatMessage) => m.role === 'user')?.content || '';
  if (!question) return reply({ error: 'INVALID_REQUEST', message: 'A user message is required.' }, 400, origin);

  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (key) {
    try {
      const answer = await googleReply(messages, key);
      return reply({ answer, mode: 'ai' }, 200, origin);
    } catch (error) {
      // Logs contain provider error/status but never the secret API key.
      console.error('Gemini provider failure:', error instanceof Error ? error.message : String(error));
    }
  } else {
    console.error('Gemini API key missing');
  }
  // Keep answering common visitor questions even if the external AI provider is down.
  return reply({ answer: fallbackAnswer(question), mode: 'service-info' }, 200, origin);
}
