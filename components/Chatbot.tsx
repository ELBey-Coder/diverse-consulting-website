'use client';
import { useState, useRef, useEffect } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'Recommend a package',
  'What AI services do you offer?',
  'How does HubSpot integration work?',
  'Book a free consultation',
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm the Diverse Consulting assistant. I can explain our AI services, recommend a package, answer questions about your industry, and help you book a free strategy session. What's your business type and what are you looking to automate?",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Msg = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error('Request failed');

      // Handle streaming response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      // Add placeholder assistant message
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          // Parse AI SDK data stream (simple text extraction)
          // Format is like: 0:"text"\n — we extract quoted strings
          const matches = chunk.match(/0:"((?:[^"\\]|\\.)*)"/g);
          if (matches) {
            for (const m of matches) {
              try {
                const parsed = JSON.parse(m.slice(2));
                assistantText += parsed;
              } catch {}
            }
            setMessages([...newMessages, { role: 'assistant', content: assistantText }]);
          }
        }
      }

      // Fallback: if streaming parse failed, try plain text
      if (!assistantText) {
        const text = await res.text();
        setMessages([...newMessages, { role: 'assistant', content: text || 'Sorry, I had trouble responding. Please try again.' }]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I’m having trouble right now. You can call +1 (443) 295-3247 or email Consulting@DiverseConsultingllc.com, or try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#111',
          color: '#fff',
          fontSize: 28,
          border: 'none',
          cursor: 'pointer',
          zIndex: 9999,
        }}
        aria-label="Open chat"
      >
        💬
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 380,
        maxWidth: 'calc(100vw - 48px)',
        height: 520,
        maxHeight: 'calc(100vh - 48px)',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 16, background: '#111', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Diverse AI Solutions Assistant</strong>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>
          ✕
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? '#111' : '#f1f1f1',
              color: m.role === 'user' ? '#fff' : '#111',
              padding: '10px 14px',
              borderRadius: 12,
              maxWidth: '85%',
              whiteSpace: 'pre-wrap',
            }}
          >
            {m.content || (loading && i === messages.length - 1 ? '...' : '')}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={loading}
            style={{
              fontSize: 12,
              padding: '6px 10px',
              borderRadius: 20,
              border: '1px solid #ddd',
              background: '#fafafa',
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        style={{ display: 'flex', borderTop: '1px solid #eee' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about services, pricing, or your industry..."
          style={{ flex: 1, padding: 14, border: 'none', outline: 'none' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{ padding: '0 18px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
