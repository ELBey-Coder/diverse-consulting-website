(function () {
  'use strict';

  const HUBSPOT_FORM = 'https://42o6zx.share-na2.hsforms.com/2HLIbABvpQAOnm6upaf1ysQ';
  const PHONE = '(443) 295-3247';
  const EMAIL = 'Consulting@DiverseConsultingllc.com';
  const industries = ['electrician', 'plumber', 'hvac', 'roofer', 'contractor', 'car dealership', 'real-estate investor', 'window tint'];

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

  function recommendation(text) {
    if (/voice|reception|answer call|phone|book|schedule|crm/i.test(text)) return 'Growth — $997/month is the best starting point. It includes an AI receptionist, appointment booking, and CRM automation.';
    if (/custom|follow.?up|multiple|advanced|professional|workflow/i.test(text)) return 'Professional — $1,500–$2,500/month fits custom voice agents, chatbot, follow-up, and connected workflows.';
    return 'Starter — $497/month fits missed-call text-back and lead capture. If you also need calls answered and appointments booked, choose Growth.';
  }

  function answer(question) {
    const q = question.toLowerCase();
    const industry = industries.find(function (name) { return q.includes(name); }) || pageIndustry();
    if (/price|pricing|cost|package|plan|recommend/.test(q)) return recommendation(q);
    if (/book|schedule|appointment|consult|demo/.test(q)) return 'You can request a consultation securely through HubSpot. Use the booking button below and select “AI Appointment Requested.”';
    if (/hubspot|crm|lead/.test(q)) return 'Qualified website leads can be sent to HubSpot with their industry, urgency, package interest, service need, and appointment request. Your current consultation form already creates the contact and starts the follow-up email.';
    if (/service|what do you do|help me/.test(q)) return 'We provide AI receptionists, website chatbots, voice agents, appointment booking, missed-call text-back, lead qualification, HubSpot CRM automation, customer support, sales assistance, and automated follow-up.';
    if (/website|hosting|seo|marketing/.test(q)) return 'Diverse Consulting also helps with websites, hosting, SEO, digital marketing, lead generation, and business automation.';
    if (/phone|call|email|contact/.test(q)) return 'Call ' + PHONE + ' or email ' + EMAIL + '. You can also use the secure HubSpot consultation form.';
    if (industry) return 'For a ' + industry + ', the AI receptionist can answer immediately, ask industry-specific qualification questions, offer an approved appointment, send the lead to HubSpot, and trigger follow-up.';
    return 'I can explain services, recommend a package, show an industry workflow, or help you request a consultation. Tell me your business type and what you want to automate.';
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

  function addMessage(text, role, html) {
    const message = document.createElement('div');
    message.className = 'dc-site-chat-message ' + role;
    if (html) message.innerHTML = text;
    else message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function openChat() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    if (!messages.children.length) {
      const context = pageIndustry();
      addMessage(context
        ? 'Welcome! I can show how our AI receptionist answers, qualifies, and schedules customers for a ' + context + '.'
        : 'Welcome! I can explain our AI services, recommend the right package, answer industry questions, and help you request a consultation.', 'bot');
    }
    input.focus();
  }

  function closeChat() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  function ask(text) {
    const question = text.trim();
    if (!question) return;
    addMessage(question, 'user');
    window.setTimeout(function () { addMessage(answer(question), 'bot'); }, 180);
  }

  function openBooking() {
    const localBooking = document.querySelector('.open-booking');
    if (localBooking) {
      localBooking.click();
      closeChat();
      return;
    }
    addMessage('Open the secure <a href="' + HUBSPOT_FORM + '" target="_blank" rel="noopener">HubSpot consultation form</a>. Select your industry, package, urgency, and whether you want an appointment.', 'bot', true);
  }

  launcher.addEventListener('click', function () { panel.classList.contains('open') ? closeChat() : openChat(); });
  panel.querySelector('.dc-site-chat-close').addEventListener('click', closeChat);
  panel.querySelectorAll('[data-question]').forEach(function (button) { button.addEventListener('click', function () { ask(button.dataset.question || ''); }); });
  panel.querySelector('[data-book-chat]').addEventListener('click', openBooking);
  panel.querySelector('form').addEventListener('submit', function (event) { event.preventDefault(); ask(input.value); input.value = ''; });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && panel.classList.contains('open')) closeChat(); });
})();
