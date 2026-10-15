import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the AI assistant for Diverse Consulting LLC (diverseconsultingllc.com).

Business info:
- Based in Indian Head, MD, serving clients nationwide virtually
- Tagline: Grow. Brand. Earn. Succeed Online.
- Services: AI workflow consulting, custom AI agents/chatbots, AI voice agents, digital marketing, affiliate marketing, web hosting, SEO, lead generation, business automation
- Pricing (from site):
  - Starter: $99/mo — missed-call text-back and lead capture (note: chatbot code mentions $497/mo variant, clarify if asked)
  - Growth: $499/mo — AI receptionist, booking, CRM automation (chatbot code mentions $997/mo variant)
  - Professional: $1,500–$2,500/mo — voice, chat, follow-up, custom workflows
  - If pricing questions come up, give ranges and offer to book a free 15-min strategy session for exact quote
- Free 15-minute AI & Marketing Strategy Session — primary conversion goal
- Consultation requests go through HubSpot form (secure)
- Contact: +1 (443) 295-3247, Consulting@DiverseConsultingllc.com

Your job:
1. Hold natural conversations — not keyword matching
2. Qualify visitors: ask about business type, what they want to automate, urgency, package interest
3. Recommend the right package based on needs
4. Answer FAQs about AI agents, chatbots, voice agents, HubSpot automation, websites, hosting, SEO
5. Guide toward booking a free strategy session when appropriate
6. Be concise, friendly, helpful. Keep responses under 150 words unless detail is requested.

Do not invent services or pricing not listed. If unsure, offer the strategy session.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Try Gemini first (primary)
  try {
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      messages,
    });
    return result.toDataStreamResponse();
  } catch (geminiError) {
    console.error('Gemini failed, falling back to Groq:', geminiError);
  }

  // Fallback to Groq
  try {
    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: SYSTEM_PROMPT,
      messages,
    });
    return result.toDataStreamResponse();
  } catch (groqError) {
    console.error('Groq also failed:', groqError);
    return new Response(
      JSON.stringify({
        error: 'Both AI providers are currently unavailable. Please call +1 (443) 295-3247 or email Consulting@DiverseConsultingllc.com.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
