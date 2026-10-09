import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';

const root = resolve('public');
const domain = 'https://diverseconsultingllc.com';
const hubspotForm = 'https://42o6zx.share-na2.hsforms.com/2HLIbABvpQAOnm6upaf1ysQ';
const hubspotMeeting = hubspotForm;
const defaultDescription = 'AI receptionists, chatbots, appointment booking, missed-call text-back, and CRM automation for contractors and local service businesses.';
const consultationCard = `<article class="upgrade-card">
        <h3>Request an AI Automation Consultation</h3>
        <p>Tell us what your business needs. Your information will be submitted securely through HubSpot.</p>
        <a class="btn btn-primary" href="${hubspotForm}" target="_blank" rel="noopener">Open Secure HubSpot Form</a>
      </article>`;

const videos = [
  ['source-media/4.1-invideo-seedance_2_5.mp4', 'welcome-to-diverse-consulting.mp4'],
  ['source-media/5.1-invideo-seedance_2_5.mp4', 'ai-workflow-consulting.mp4'],
  ['source-media/6.1-invideo-seedance_2_5.mp4', 'digital-growth-for-service-businesses.mp4']
];

mkdirSync(join(root, 'videos'), { recursive: true });
for (const [source, name] of videos) copyFileSync(resolve(source), join(root, 'videos', name));

const replacements = [
  ['https://www.youtube.com/embed/mIjqKUah64s', '/videos/welcome-to-diverse-consulting.mp4', 'Welcome to Diverse Consulting'],
  ['https://www.youtube.com/embed/HvgkwPwHcqM', '/videos/ai-workflow-consulting.mp4', 'What Is AI Workflow Consulting?'],
  ['https://www.youtube.com/embed/H7jpB4WnAH8', '/videos/digital-growth-for-service-businesses.mp4', 'How Digital Marketing Drives Growth']
];

const industryNames = {
  electricians: 'Electricians', plumbers: 'Plumbers', hvac: 'HVAC Companies', roofers: 'Roofing Companies',
  'window-tint': 'Window Tint Shops', 'real-estate-investors': 'Real Estate Investors',
  'car-dealerships': 'Car Dealerships', contractors: 'General Contractors'
};

function files(dir) {
  return readdirSync(dir).flatMap(name => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? files(full) : [full];
  });
}

for (const file of files(root).filter(file => extname(file) === '.html')) {
  let html = readFileSync(file, 'utf8');
  const path = '/' + relative(root, file).replaceAll('\\', '/').replace(/index\.html$/, '').replace(/\.html$/, '.html');
  const canonical = domain + (path === '/' ? '/' : path);
  const industry = path.match(/^\/ai-for-([^/]+)\/$/);
  const fallbackTitle = (html.match(/<title>(.*?)<\/title>/is)?.[1] || 'Diverse Consulting').trim();
  const title = industry ? `AI Receptionist for ${industryNames[industry[1]]} | Diverse Consulting` : path === '/' ? 'AI Automation for Service Businesses | Diverse Consulting' : fallbackTitle;
  const fallbackDescription = (html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] || defaultDescription).trim();
  const description = industry ? `See how an AI receptionist answers, qualifies, schedules, and follows up with customers for ${industryNames[industry[1]]}.` : fallbackDescription;

  if (industry || path === '/') {
    html = html.replace(/<title>.*?<\/title>/is, `<title>${title}</title>`)
  }
  if (/<meta\s+name=["']description["']/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="description" content="${description}">`);
  } else {
    html = html.replace('</head>', `<meta name="description" content="${description}"></head>`);
  }

  for (const [youtube, source, label] of replacements) {
    const iframe = new RegExp(`<iframe[^>]*title=["']${label.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&')}["'][^>]*src=["']${youtube.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&')}["'][^>]*><\\/iframe>`, 'gi');
    html = html.replace(iframe, `<video controls preload="metadata" playsinline aria-label="${label}" style="width:100%;height:100%;aspect-ratio:16/9;border:0;border-radius:16px;display:block"><source src="${source}" type="video/mp4">Your browser does not support this video.</video>`);
  }

  html = html.replace(/data:image\/[^;"']+;base64,[A-Za-z0-9+/=]{100000,}/g, '/assets/diverse-consulting-logo.png');
  html = html.replaceAll('https://diverseconsulting.netlify.app', domain);
  // Use verifiable process evidence until real client results and permissions exist.
  html = html.replace(/<div class="container testgrid">[\s\S]*?<\/div>\s*<\/section>/gi, `<div class="container testgrid"><div class="testintro"><h3>Practical support for service businesses</h3><p>Start with your actual inquiry process and choose a bounded first improvement.</p><a class="btn small" href="/ai-for-electricians/">Request a lead-response review</a></div><article class="testcard"><h3>Review</h3><p>Map your current call and website inquiry flow.</p></article><article class="testcard"><h3>Verify</h3><p>Confirm software compatibility and human handoff rules.</p></article><article class="testcard"><h3>Test</h3><p>Use agreed acceptance checks before launch.</p></article></div></section>`);
  html = html.replace(/<section class="stats">[\s\S]*?<\/section>/gi, '');
  html = html.replaceAll('Join thousands of entrepreneurs who trust Diverse Consulting.', 'Discuss a practical next step for your business with Diverse Consulting.')
    .replaceAll('Trusted by entrepreneurs worldwide', 'Practical guidance for service businesses')
    .replaceAll('Quick Videos Coming Soon', 'Videos from Diverse Consulting')
    .replaceAll('Use these examples to show visitors how your services connect to business outcomes.', 'Illustrative scenarios only. These examples are not verified client results.')
    .replaceAll('HubSpot will create your contact record and send the approved follow-up automatically.', 'Our team must confirm your consultation request. Automatic follow-up is not promised until verified.');
  html = html.replace(/<div[^>]*id=["']netlify-form-detection["'][\s\S]*?<\/div>/gi, '');
  html = html.replace(/<div\s+style=["']display:none;["']\s+aria-hidden=["']true["']>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<form class=["']ai-(readiness|savings)-form["'][^>]*>/gi, '<form class="ai-$1-form">');
  html = html.replace(/\s*<input type=["']hidden["'] name=["']form-name["'][^>]*>\s*/gi, '\n');
  html = html.replace(/\s*<p style=["']display:none;["']><label>Do not fill this out: <input name=["']bot-field["']><\/label><\/p>\s*/gi, '\n');
  html = html.replace(/<article class=["']upgrade-card["']>\s*<h3>Lead Capture Form<\/h3>[\s\S]*?<\/form>\s*<\/article>/gi, consultationCard);
  html = html.replace(/<form class=["']footform["'][\s\S]*?<\/form>/gi, `<p><a class="btn" href="${hubspotForm}" target="_blank" rel="noopener">Get AI &amp; Marketing Tips</a></p>`);
  html = html.replace(/<form[^>]*data-netlify=["']true["'][\s\S]*?<\/form>/gi, `<p><a class="btn" href="${hubspotForm}" target="_blank" rel="noopener">Continue with HubSpot</a></p>`);
  html = html.replace(/<a class=["']btn btn-primary["'] href=["']\/contact(?:\.html)?["']>Request a Time<\/a>/gi, `<a class="btn btn-primary" href="${hubspotMeeting}" target="_blank" rel="noopener">Request a Consultation</a>`);
  if (!/<link\s+rel=["']canonical["']/i.test(html)) html = html.replace('</head>', `<link rel="canonical" href="${canonical}"></head>`);
  if (/<meta\s+property=["']og:title["']/i.test(html)) {
    html = html
      .replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:title" content="${title.replaceAll('"', '&quot;')}">`)
      .replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:description" content="${description.replaceAll('"', '&quot;')}">`)
      .replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:url" content="${canonical}">`);
  } else {
    html = html.replace('</head>', `<meta property="og:type" content="website"><meta property="og:title" content="${title.replaceAll('"', '&quot;')}"><meta property="og:description" content="${description.replaceAll('"', '&quot;')}"><meta property="og:url" content="${canonical}"></head>`);
  }
  if (!/<meta\s+property=["']og:image["']/i.test(html)) html = html.replace('</head>', `<meta property="og:image" content="${domain}/assets/diverse-consulting-logo.png"></head>`);
  if (!/<meta\s+name=["']twitter:card["']/i.test(html)) html = html.replace('</head>', '<meta name="twitter:card" content="summary_large_image"></head>');
  if (!html.includes('/analytics.js')) html = html.replace('</head>', '<script src="/site-config.js"></script><script src="/analytics.js" defer></script></head>');
  html = html.replaceAll('See packages and book a demo', 'See packages and request a demo')
    .replaceAll('Appointment booked</span>', 'Sample appointment</span>')
    .replaceAll('✓ Confirmation text and team alert queued', '✓ Demonstration only — no calendar or CRM was changed')
    .replace(/<div class="time"><button>/g, '<div class="time" aria-label="Sample appointment times"><button type="button" disabled>')
    .replace(/<button class="active">Tomorrow 1:00<\/button><button>Thursday 10:30<\/button><\/div>/g, '<button class="active" type="button" disabled>Tomorrow 1:00</button><button type="button" disabled>Thursday 10:30</button></div>');
  writeFileSync(file, html);
}

const urls = ['/', '/about.html', '/services.html', '/pricing.html', '/reviews.html', '/blog.html', '/resources.html', '/contact.html', '/ai-tools.html', '/free-tools.html', '/ai-resource-center.html', '/partner-marketplace.html', '/case-studies.html', '/privacy.html', '/ai-solutions/', '/lead-response-checklist/', '/lead-response-guides/', '/guides/missed-inquiries-electrical-contractors/', '/guides/ai-receptionist-versus-answering-service/', '/guides/electrical-contractor-booking-checklist/', '/guides/electrical-office-lead-information/', ...Object.keys(industryNames).map(slug => `/ai-for-${slug}/`)];
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${domain}${url}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml\n`);

console.log('Videos, metadata, analytics hooks, sitemap, robots, and performance optimizations prepared.');
