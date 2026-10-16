'use client';
import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';

const SUGGESTIONS = [
  'Recommend a package',
  'What AI services do you offer?',
  'How does HubSpot integration work?',
  'Book a free consultation',
];

const INITIAL_MESSAGE =
  "Hi! I'm the Diverse Consulting assistant. I can explain our AI services, recommend a package, answer questions about your industry, and help you book a free strategy session. What's your business type and what are you looking to automate?";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } =
    useChat({
      api: '/api/chat',
      initialMessages: [{ id: 'init', role: 'assistant', content: INITIAL_MESSAGE }],
      onError: (err) => {
        console.error('Chat error:', err);
      },
    });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function sendSuggestion(text: string) {
    append({ role: 'user', content: text });
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
        {messages.map((m) => (
          <div
            key={m.id}
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
            {m.content || (isLoading ? '...' : '')}
          </div>
        ))}
        {error && (
          <div
            style={{
              alignSelf: 'flex-start',
              background: '#fde8e8',
              color: '#b00',
              padding: '10px 14px',
              borderRadius: 12,
              maxWidth: '85%',
            }}
          >
            Sorry, I'm having trouble right now. You can call +1 (443) 295-3247 or email
            Consulting@DiverseConsultingllc.com, or try again in a moment.
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => sendSuggestion(s)}
            disabled={isLoading}
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
        onSubmit={handleSubmit}
        style={{ display: 'flex', borderTop: '1px solid #eee' }}
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about services, pricing, or your industry..."
          style={{ flex: 1, padding: 14, border: 'none', outline: 'none' }}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()} style={{ padding: '0 18px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
