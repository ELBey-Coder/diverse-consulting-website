// Vercel serverless function. Never expose the Gemini key in browser code.
const SYSTEM = `You are the Diverse Consulting website AI assistant. Be conversational, specific, and helpful. Diverse Consulting helps electricians, plumbers, HVAC contractors, roofers, contractors, car dealerships, real estate investors, and window tint businesses with AI receptionists, missed-call text-back, website chatbots, appointment requests, lead qualification, CRM automation, voice agents, and follow-up. Starter is $497/month for missed-call text-back and lead capture. Growth is $997/month for AI receptionist, booking and CRM automation. Professional is $1,500–$2,500/month for custom voice agents, chatbots, follow-up and workflows. Prices and scope are indicative; invite prospects to request a consultation for a firm quote. Explain how solutions work for the customer's industry; ask one relevant follow-up question. Do not claim to have booked an appointment, submitted a lead, or integrated with HubSpot unless confirmed by a real tool. Do not invent guarantees or capabilities. For consultations, refer users to https://42o6zx.share-na2.hsforms.com/2HLIbABvpQAOnm6upaf1ysQ. Contact: (443) 295-3247 and Consulting@DiverseConsultingllc.com. Keep answers concise and natural. Never ask for sensitive personal information in chat.`;
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const origin = req.headers.origin;
  if (origin) {
    try {
      const host = new URL(origin).host;
      const requestHost = req.headers.host;
      if (host !== requestHost) return res.status(403).json({ error: 'Origin not allowed' });
    } catch { return res.status(403).json({ error: 'Origin not allowed' }); }
  }
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) return res.status(503).json({ error: 'AI service not configured' });
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12) return res.status(400).json({ error: 'Invalid conversation' });
  const valid = messages.every(m => ['user','model'].includes(m?.role) && typeof m?.text === 'string' && m.text.length > 0 && m.text.length <= 1200);
  if (!valid || messages[messages.length-1].role !== 'user') return res.status(400).json({ error: 'Invalid message' });
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    let response;
    try {
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          generationConfig: { maxOutputTokens: 500, temperature: 0.6 }
        }),
        signal: controller.signal
      });
    } finally { clearTimeout(timeout); }
    if (!response.ok) {
      console.error('Gemini upstream status:', response.status);
      return res.status(response.status === 429 ? 429 : 502).json({ error: response.status === 429 ? 'AI is busy; please try again shortly.' : 'AI service temporarily unavailable.' });
    }
    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim();
    if (!answer) return res.status(502).json({ error: 'AI returned no answer. Please try again.' });
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('Gemini request failed:', err?.name || 'unknown');
    return res.status(502).json({ error: 'Could not reach the AI service. Please try again.' });
  }
};
