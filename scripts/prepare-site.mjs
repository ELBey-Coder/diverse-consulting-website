import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';

const root = resolve('public');
const domain = 'https://diverseconsultingllc.com';

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
  const title = industry ? `AI Receptionist for ${industryNames[industry[1]]} | Diverse Consulting` : fallbackTitle;
  const fallbackDescription = (html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] || 'AI automation, websites, and digital growth systems for service businesses.').trim();
  const description = industry ? `See how an AI receptionist answers, qualifies, schedules, and follows up with customers for ${industryNames[industry[1]]}.` : fallbackDescription;

  if (industry) {
    html = html.replace(/<title>.*?<\/title>/is, `<title>${title}</title>`)
      .replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="description" content="${description}">`);
  }

  for (const [youtube, source, label] of replacements) {
    const iframe = new RegExp(`<iframe[^>]*title=["']${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*src=["']${youtube.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*><\\/iframe>`, 'gi');
    html = html.replace(iframe, `<video controls preload="metadata" playsinline aria-label="${label}" style="width:100%;height:100%;aspect-ratio:16/9;border:0;border-radius:16px;display:block"><source src="${source}" type="video/mp4">Your browser does not support this video.</video>`);
  }

  html = html.replace(/data:image\/[^;"']+;base64,[A-Za-z0-9+/=]{100000,}/g, '/assets/diverse-consulting-logo.png');
  if (!/<link\s+rel=["']canonical["']/i.test(html)) html = html.replace('</head>', `<link rel="canonical" href="${canonical}"></head>`);
  if (!/<meta\s+property=["']og:title["']/i.test(html)) html = html.replace('</head>', `<meta property="og:type" content="website"><meta property="og:title" content="${title.replaceAll('"', '&quot;')}"><meta property="og:description" content="${description.replaceAll('"', '&quot;')}"><meta property="og:url" content="${canonical}"></head>`);
  if (!html.includes('/analytics.js')) html = html.replace('</head>', '<script src="/site-config.js"></script><script src="/analytics.js" defer></script></head>');
  html = html.replaceAll('See packages and book a demo', 'See packages and request a demo')
    .replaceAll('Appointment booked</span>', 'Sample appointment</span>')
    .replaceAll('✓ Confirmation text and team alert queued', '✓ Demonstration only — no calendar or CRM was changed')
    .replace(/<div class="time"><button>/g, '<div class="time" aria-label="Sample appointment times"><button type="button" disabled>')
    .replace(/<button class="active">Tomorrow 1:00<\/button><button>Thursday 10:30<\/button><\/div>/g, '<button class="active" type="button" disabled>Tomorrow 1:00</button><button type="button" disabled>Thursday 10:30</button></div>');
  writeFileSync(file, html);
}

const urls = ['/', '/about.html', '/services.html', '/pricing.html', '/reviews.html', '/blog.html', '/resources.html', '/contact.html', '/ai-tools.html', '/free-tools.html', '/ai-resource-center.html', '/partner-marketplace.html', '/case-studies.html', '/privacy.html', '/ai-solutions/', ...Object.keys(industryNames).map(slug => `/ai-for-${slug}/`)];
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${domain}${url}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml\n`);

console.log('Videos, metadata, analytics hooks, sitemap, robots, and performance optimizations prepared.');
