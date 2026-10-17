(function () {
  'use strict';

  const HUBSPOT_FORM = 'https://42o6zx.share-na2.hsforms.com/2HLIbABvpQAOnm6upaf1ysQ';
  const BOOKING_LINK_LABEL = 'Request a free 15-minute consultation';
  const PHONE = '(443) 295-3247';
  const EMAIL = 'Consulting@DiverseConsultingllc.com';
  const CHAT_API = /^(www\.)?diverseconsultingllc\.com$/i.test(window.location.hostname)
    ? 'https://diverse-consulting-ai-preview-git-chat-96cf54-diverseconsulting.vercel.app/api/chat'
    : '/api/chat';

  // Conversation history for the Gemini API (kept in memory per page load)
  const conversation = [];

  function removeLegacyChatbots() {
    ['dcChatbotLauncher', 'dcChatbotPanel', 'chat-launch', 'ai-chat'].forEach(function (id) {
      const node = document.getElementById(id);
      if (node) node.remove();
    });
  }

  function pageIndustry() {
    const path = location.pathname.toLowerCase();
    if (path.includes('electric')) return 'electrician';
    if (path.includes('plumb')) return 'plumber';
    if (path.includes('hvac')) return 'HVAC';
    if (path.includes('roof')) return 'roofer';
    if (path.includes('contractor')) return 'contractor';
    if (path.includes('car-deal')) return 'car dealership';
    if (path.includes('real-estate')) return 'real-estate investor';
    if (path.includes('window-tint')) return 'window-tint business';
    return '';
  }

  removeLegacyChatbots();
  document.body.insertAdjacentHTML('beforeend',
    '<button id="dcSiteChatLauncher" type="button" aria-expanded="false" aria-controls="dcSiteChat">💬 AI Solutions Assistant</button>' +
    '<section id="dcSiteChat" aria-label="Diverse Consulting AI Solutions Assistant" aria-hidden="true">' +
      '<header class="dc-site-chat-head"><div class="dc-site-chat-title"><strong>Diverse AI Solutions Assistant</strong><small><span class="dc-site-chat-status"></span>Ready to help</small></div><button class="dc-site-chat-close" type="button" aria-label="Close chatbot">×</button></header>' +
      '<div class="dc-site-chat-messages" aria-live="polite"></div>' +
      '<div class="dc-site-chat-quick"><button type="button" data-question="Recommend a package">Recommend a package</button><button type="button" data-question="What AI services do you offer?">AI services</button><button type="button" data-question="How does HubSpot work?">HubSpot</button><button type="button" data-book-chat>Book consultation</button></div>' +
      '<form class="dc-site-chat-form"><input aria-label="Chat message" autocomplete="off" placeholder="Ask about services, pricing, or your industry…"><button type="submit">Send</button></form>' +
      '<small class="dc-site-chat-note">Website assistant. Do not enter sensitive information in chat.</small>' +
    '</section>');

  const launcher = document.getElementById('dcSiteChatLauncher');
  const panel = document.getElementById('dcSiteChat');
  const messages = panel.querySelector('.dc-site-chat-messages');
  const input = panel.querySelector('input');
  const form = panel.querySelector('form');
  let busy = false;

  function addMessage(text, role, html) {
    const message = document.createElement('div');
    message.className = 'dc-site-chat-message ' + role;
    if (html) message.innerHTML = text;
    else message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function openChat() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    if (!messages.children.length) {
      const context = pageIndustry();
      const greeting = context
        ? 'Welcome! I can show how our AI receptionist answers, qualifies, and schedules customers for a ' + context + '.'
        : 'Welcome! I can explain our AI services, recommend the right package, answer industry questions, and help you request a consultation.';
      addMessage(greeting, 'bot');
      conversation.push({ role: 'assistant', content: greeting });
    }
    input.focus();
  }

  function closeChat() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  function setBusy(state) {
    busy = state;
    input.disabled = state;
    form.querySelector('button[type="submit"]').disabled = state;
  }

  async function ask(text) {
    const question = text.trim();
    if (!question || busy) return;
    addMessage(question, 'user');
    conversation.push({ role: 'user', content: question });
    setBusy(true);

    // Placeholder bot message that we stream into
    const botEl = addMessage('…', 'bot');

    try {
      const res = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation.slice(-10) }),
      });

      const data = await res.json().catch(function () { return {}; });
      if (!res.ok || !data.answer) {
        const code = typeof data.error === 'string' ? data.error : 'AI_REQUEST_FAILED';
        const detail = typeof data.message === 'string' ? data.message : 'The AI service could not answer.';
        throw new Error(code + ': ' + detail);
      }
      botEl.textContent = data.answer;
      // Add a trusted, clickable booking link when the assistant invites a consultation.
      // Never render model output as HTML.
      if (/consultation|strategy session|book (a |your |the )?(call|session|meeting)|schedule (a |your )?(call|session|meeting)/i.test(data.answer)) {
        const link = document.createElement('a');
        link.href = HUBSPOT_FORM;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = BOOKING_LINK_LABEL;
        link.className = 'dc-site-chat-booking-link';
        botEl.appendChild(document.createElement('br'));
        botEl.appendChild(link);
      }
      messages.scrollTop = messages.scrollHeight;
      conversation.push({ role: 'assistant', content: data.answer });
    } catch (err) {
      // Display an actionable error instead of hiding every failure behind a generic apology.
      const message = err instanceof Error ? err.message : 'Connection failed';
      botEl.textContent = 'AI assistant unavailable: ' + message + ' You can also call ' + PHONE + ' or email ' + EMAIL + '.';

    } finally {
      setBusy(false);
      input.focus();
    }
  }

  function openBooking() {
    const localBooking = document.querySelector('.open-booking');
    if (localBooking) {
      localBooking.click();
      closeChat();
      return;
    }
    addMessage('Open the secure <a href="' + HUBSPOT_FORM + '" target="_blank" rel="noopener noreferrer">HubSpot consultation request form</a>. Complete the form to request a free 15-minute strategy session; a request is not a confirmed booking.', 'bot', true);
  }

  launcher.addEventListener('click', function () { panel.classList.contains('open') ? closeChat() : openChat(); });
  panel.querySelector('.dc-site-chat-close').addEventListener('click', closeChat);
  panel.querySelectorAll('[data-question]').forEach(function (button) { button.addEventListener('click', function () { ask(button.dataset.question || ''); }); });
  panel.querySelector('[data-book-chat]').addEventListener('click', openBooking);
  form.addEventListener('submit', function (event) { event.preventDefault(); ask(input.value); input.value = ''; });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && panel.classList.contains('open')) closeChat(); });
})();
