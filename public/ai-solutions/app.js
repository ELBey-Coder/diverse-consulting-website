const industries = [
  {
    id: "electrician", short: "Electrician", name: "Electrical Contractors", icon: "⚡",
    pain: "Capture urgent calls, identify the job type, and route qualified leads without interrupting field work.",
    impact: "18+", impactLabel: "more leads captured each month",
    steps: [
      ["Call or web inquiry arrives", "AI responds around the clock, even while your crew is on a job."],
      ["Safety and service triage", "The system checks urgency, issue type, property, and ZIP code."],
      ["Qualified appointment offered", "A matching service window is proposed using your real availability."],
      ["CRM, dispatch, and follow-up", "The job is logged, your team is alerted, and the lead receives confirmation."]
    ],
    recommendation: "The Always-On Lead Desk",
    copy: "A focused system that answers calls, recovers missed leads, and books qualified service requests.",
    services: ["AI Receptionist", "Missed-Call Text Back", "Appointment Booking", "CRM Automation"],
    outcome: "Faster response. Fewer lost jobs.",
    message: "I can help with that. Is this an urgent electrical issue, and what ZIP code is the property in?",
    result: "Emergency service"
  },
  {
    id: "plumber", short: "Plumber", name: "Plumbing Companies", icon: "◉",
    pain: "Separate emergencies from routine work, answer common questions, and fill the right service windows automatically.",
    impact: "24/7", impactLabel: "emergency inquiry coverage",
    steps: [
      ["Customer calls with a problem", "The AI receptionist answers instantly and gathers the location."],
      ["Issue and urgency identified", "Leak, backup, fixture, or install details determine the next action."],
      ["Right appointment is booked", "Emergency or routine windows are offered using your dispatch rules."],
      ["Confirmation and updates sent", "The CRM record, technician alert, and customer reminders happen automatically."]
    ],
    recommendation: "The Smart Dispatch Assistant",
    copy: "A responsive intake and scheduling system designed to turn plumbing calls into organized service jobs.",
    services: ["AI Voice Agent", "Lead Qualification", "Appointment Booking", "Automated Follow-Up"],
    outcome: "Urgent jobs routed. Schedule protected.",
    message: "I’ll help you get the right service. Is water actively leaking or backing up right now?",
    result: "Urgency confirmed"
  },
  {
    id: "hvac", short: "HVAC", name: "HVAC Companies", icon: "❄",
    pain: "Handle seasonal call volume, triage no-heat and no-cool requests, and keep maintenance leads moving.",
    impact: "3×", impactLabel: "faster first response during peaks",
    steps: [
      ["High-volume inquiry received", "Voice and chat respond immediately during seasonal call spikes."],
      ["System and symptoms captured", "Equipment type, symptoms, location, and urgency are recorded."],
      ["Service or estimate scheduled", "Repair, maintenance, or replacement opportunities follow different paths."],
      ["Reminders and nurture begin", "Your CRM stays current while customers receive helpful updates."]
    ],
    recommendation: "The Seasonal Demand Engine",
    copy: "AI intake, booking, and follow-up that flex with high-demand weather and maintenance seasons.",
    services: ["AI Receptionist", "Website Chatbot", "Lead Qualification", "CRM Automation"],
    outcome: "Peak demand captured without call-center overload.",
    message: "I’m sorry your system isn’t working. Is this a no-heat or no-cool emergency, and what type of system do you have?",
    result: "Repair lead qualified"
  },
  {
    id: "roofer", short: "Roofer", name: "Roofing Companies", icon: "⌂",
    pain: "Qualify inspection requests, prioritize storm damage, and nurture estimates without chasing every lead manually.",
    impact: "40%", impactLabel: "less manual lead follow-up",
    steps: [
      ["Ad or website lead arrives", "The chatbot responds before the prospect contacts another roofer."],
      ["Roof and damage details collected", "Property type, roof age, damage, insurance, and timeline are captured."],
      ["Inspection is scheduled", "Qualified homeowners choose an available inspection time."],
      ["Estimate follow-up runs", "Reminders and helpful messages keep the opportunity active in your CRM."]
    ],
    recommendation: "The Inspection Pipeline",
    copy: "A lead capture and estimate-nurture system built for inspections, storm response, and longer sales cycles.",
    services: ["Website Chatbot", "Lead Qualification", "Appointment Booking", "AI Sales Assistant"],
    outcome: "More inspections. Stronger estimate follow-through.",
    message: "I can help arrange an inspection. Is the roof actively leaking, and was the damage related to a recent storm?",
    result: "Inspection opportunity"
  },
  {
    id: "tint", short: "Window Tint", name: "Window Tint Shops", icon: "◩",
    pain: "Turn social and website questions into priced, scheduled jobs while reducing repetitive quote conversations.",
    impact: "10+ hrs", impactLabel: "of weekly message handling reduced",
    steps: [
      ["Social or web message arrives", "The assistant replies instantly with a polished, consistent experience."],
      ["Vehicle and tint goals captured", "Year, make, model, windows, film preferences, and location are collected."],
      ["Service and range recommended", "The customer sees an appropriate option and transparent starting range."],
      ["Bay time booked", "A deposit-ready appointment and pre-visit reminders move the job forward."]
    ],
    recommendation: "The Instant Quote-to-Bay System",
    copy: "A visual sales assistant that answers product questions, qualifies vehicles, and fills installation bays.",
    services: ["AI Sales Assistant", "Website Chatbot", "Appointment Booking", "Automated Follow-Up"],
    outcome: "Fewer DMs. More booked installations.",
    message: "Let’s find the right tint package. What year, make, and model is your vehicle—and which windows are you considering?",
    result: "Vehicle details captured"
  },
  {
    id: "investor", short: "Real Estate", name: "Real Estate Investors", icon: "◆",
    pain: "Respond to motivated sellers quickly, gather property details, and prioritize acquisition calls by lead quality.",
    impact: "60 sec", impactLabel: "target seller response time",
    steps: [
      ["Seller inquiry is received", "A text or voice conversation begins while motivation is high."],
      ["Property and motivation captured", "Condition, timeline, asking price, occupancy, and reason for selling are logged."],
      ["Opportunity is scored", "The assistant applies your buy box and identifies high-priority sellers."],
      ["Acquisition follow-up starts", "The lead enters the correct CRM stage and the next conversation is scheduled."]
    ],
    recommendation: "The Motivated Seller Qualifier",
    copy: "A fast, empathetic intake and scoring workflow that helps acquisition teams focus on viable opportunities.",
    services: ["AI Voice Agent", "Lead Qualification", "CRM Automation", "Automated Follow-Up"],
    outcome: "Quicker contact. Clearer acquisition priorities.",
    message: "Thanks for reaching out about the property. What’s prompting the sale, and what timeline would work best for you?",
    result: "Seller motivation logged"
  },
  {
    id: "dealer", short: "Car Dealer", name: "Car Dealerships", icon: "▰",
    pain: "Answer inventory questions, qualify buying intent, and schedule appointments before shoppers move to another dealer.",
    impact: "2×", impactLabel: "more after-hours conversations",
    steps: [
      ["Inventory inquiry arrives", "AI replies through voice, text, or web chat—even after the showroom closes."],
      ["Buying needs are qualified", "Vehicle, timeline, financing, trade-in, and preferred contact are captured."],
      ["Showroom visit is scheduled", "The shopper receives a convenient appointment and clear next steps."],
      ["Salesperson and CRM updated", "A complete summary routes to the right rep with follow-up already queued."]
    ],
    recommendation: "The Digital BDC Assistant",
    copy: "A responsive sales concierge that supports shoppers, books visits, and keeps every lead moving.",
    services: ["AI Customer Support", "AI Sales Assistant", "Appointment Booking", "CRM Automation"],
    outcome: "More shopper conversations become showroom visits.",
    message: "I can help with that vehicle. Are you planning to finance, and will you be trading in a current vehicle?",
    result: "Buyer intent qualified"
  },
  {
    id: "contractor", short: "Contractor", name: "General Contractors", icon: "▦",
    pain: "Collect scope, budget, and timeline before consultations so estimators spend time on the best-fit projects.",
    impact: "35%", impactLabel: "less time on unqualified inquiries",
    steps: [
      ["Project inquiry is submitted", "The assistant responds and begins a professional discovery conversation."],
      ["Scope and fit are assessed", "Project type, address, budget, timeline, plans, and decision-makers are captured."],
      ["Consultation path is chosen", "Qualified projects book a call; early-stage leads receive helpful nurture."],
      ["Pipeline is organized", "The CRM receives the brief, files, stage, owner, and next follow-up date."]
    ],
    recommendation: "The Preconstruction Qualifier",
    copy: "An intelligent discovery workflow that organizes complex inquiries before they reach your estimating team.",
    services: ["Website Chatbot", "Lead Qualification", "CRM Automation", "AI Sales Assistant"],
    outcome: "Better project fit. More productive consultations.",
    message: "Tell me a little about your project. What work are you planning, where is it located, and when would you like to begin?",
    result: "Project scope captured"
  }
];

const services = [
  ["AR", "AI Receptionist", "Professional, always-on call answering and routing."],
  ["CB", "Website Chatbots", "Helpful conversations that turn visitors into leads."],
  ["VA", "AI Voice Agents", "Natural voice interactions for inbound and outbound calls."],
  ["AB", "Appointment Booking", "Real-time scheduling based on your rules and availability."],
  ["MT", "Missed-Call Text Back", "Instant recovery messages when your team cannot answer."],
  ["LQ", "Lead Qualification", "Consistent questions, scoring, and priority routing."],
  ["CR", "CRM Automation", "Clean records, pipeline updates, alerts, and handoffs."],
  ["CS", "AI Customer Support", "Fast answers and smart escalation for customer needs."],
  ["SA", "AI Sales Assistant", "Personalized guidance that keeps prospects moving."],
  ["FU", "Automated Follow-Up", "Timely reminders and nurture across text and email."]
];

let activeIndustry = industries[0];
const tabs = document.querySelector("#industry-tabs");
const bookingIndustry = document.querySelector("#booking-industry");

industries.forEach((industry) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "industry-tab";
  button.dataset.id = industry.id;
  button.setAttribute("aria-pressed", String(industry.id === activeIndustry.id));
  button.innerHTML = `<span aria-hidden="true">${industry.icon}</span>${industry.short}`;
  button.addEventListener("click", () => selectIndustry(industry.id));
  tabs.appendChild(button);

  if (bookingIndustry) {
    const option = document.createElement("option");
    option.value = industry.name;
    option.textContent = industry.name;
    bookingIndustry.appendChild(option);
  }
});

document.querySelector("#services-grid").innerHTML = services.map(([icon, name, detail]) => `
  <article class="service-card">
    <div class="service-icon" aria-hidden="true">${icon}</div>
    <h3>${name}</h3>
    <p>${detail}</p>
  </article>
`).join("");

function selectIndustry(id) {
  activeIndustry = industries.find((industry) => industry.id === id) || industries[0];
  document.querySelectorAll(".industry-tab").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.id === activeIndustry.id));
  });
  document.querySelector("#industry-icon").textContent = activeIndustry.icon;
  document.querySelector("#industry-name").textContent = activeIndustry.name;
  document.querySelector("#industry-pain").textContent = activeIndustry.pain;
  document.querySelector("#impact-number").textContent = activeIndustry.impact;
  document.querySelector("#impact-label").textContent = activeIndustry.impactLabel;
  document.querySelector("#recommendation-name").textContent = activeIndustry.recommendation;
  document.querySelector("#recommendation-copy").textContent = activeIndustry.copy;
  document.querySelector("#outcome-text").textContent = activeIndustry.outcome;
  if (bookingIndustry) bookingIndustry.value = activeIndustry.name;

  const message = document.querySelector("#hero-message");
  message.style.opacity = "0";
  setTimeout(() => {
    message.textContent = activeIndustry.message;
    document.querySelector("#hero-result").textContent = activeIndustry.result;
    message.style.opacity = "1";
  }, 180);

  document.querySelector("#workflow").innerHTML = activeIndustry.steps.map(([title, detail], index) => `
    <div class="workflow-step" style="animation-delay:${index * 65}ms">
      <div class="step-number">${index === activeIndustry.steps.length - 1 ? "✓" : index + 1}</div>
      <div class="step-copy"><strong>${title}</strong><span>${detail}</span></div>
    </div>
  `).join("");

  document.querySelector("#solution-stack").innerHTML = activeIndustry.services.map((service) => `
    <div class="solution-item"><span>✓</span>${service}</div>
  `).join("");
}

selectIndustry(activeIndustry.id);
document.querySelector("#year").textContent = new Date().getFullYear();

const modal = document.querySelector("#booking-modal");
const formView = document.querySelector("#booking-form-view");
const successView = document.querySelector("#success-view");
const hubSpotConsultationUrl = "https://42o6zx.share-na2.hsforms.com/2HLIbABvpQAOnm6upaf1ysQ";
let lastFocused;

function openModal() {
  const bookingWindow = window.open(hubSpotConsultationUrl, "_blank", "noopener,noreferrer");
  if (!bookingWindow) window.location.href = hubSpotConsultationUrl;
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".open-booking").forEach((button) => button.addEventListener("click", openModal));
document.querySelectorAll("[data-close-modal]").forEach((element) => element.addEventListener("click", closeModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});
