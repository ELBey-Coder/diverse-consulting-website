import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

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

Your job:
1. Hold natural, detailed conversations — not keyword matching. Give specific, helpful answers tailored to the visitor's industry and situation.
2. Qualify visitors: ask about business type, what they want to automate, urgency, package interest
3. Recommend the right package based on needs, with concrete examples of how it helps their specific trade
4. Answer FAQs about AI agents, chatbots, voice agents, HubSpot automation, websites, hosting, SEO
5. Guide toward booking a free strategy session when appropriate
6. Be conversational and thorough. Explain HOW the service solves their problem, not just what it is.

Do not invent services or pricing not listed. If unsure, offer the strategy session.`;

export async function POST(req: Request) {
  let messages: Array<{ role: string; content: string }> = [];
  try {
    const body = await req.json();
    messages = body.messages || [];
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Keep only valid chat roles and cap history length
  const clean = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-10);

  if (!clean.length) {
    return new Response(JSON.stringify({ error: 'No messages provided.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      messages: clean,
    });
    // Plain text stream — easy for the vanilla JS sitewide chatbot to consume
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Gemini failed:', error);
    return new Response(
      'Sorry, the AI assistant is currently unavailable. Please call +1 (443) 295-3247 or email Consulting@DiverseConsultingllc.com.',
      { status: 503, headers: { 'Content-Type': 'text/plain' } }
    );
  }
}
