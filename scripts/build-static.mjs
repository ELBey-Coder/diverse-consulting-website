import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('public');
const destination = resolve('out');

if (!existsSync(source)) {
  throw new Error('The public directory is missing.');
}

rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
cpSync(source, destination, { recursive: true, force: true });

const chatbotAssets = '\n<link rel="stylesheet" href="/chatbot.css">\n<script src="/chatbot.js" defer></script>\n';
const staticRoutes = ['about', 'services', 'pricing', 'reviews', 'blog', 'resources', 'contact', 'ai-tools', 'free-tools', 'ai-resource-center', 'partner-marketplace', 'case-studies', 'privacy', 'thank-you'];

function addSitewideChatbot(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      addSitewideChatbot(filePath);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const html = readFileSync(filePath, 'utf8');
    if (html.includes('/chatbot.js')) continue;
    let normalized = html
      .replaceAll('tel:+(443) 295-32477', 'tel:+14432953247')
      .replaceAll('href="/contact">✉ Consulting@DiverseConsultingllc.com', 'href="mailto:Consulting@DiverseConsultingllc.com">✉ Consulting@DiverseConsultingllc.com');
    for (const route of staticRoutes) {
      normalized = normalized
        .replaceAll(`href="/${route}"`, `href="/${route}.html"`)
        .replaceAll(`action="/${route}"`, `action="/${route}.html"`);
    }
    const updated = normalized.includes('</head>')
      ? normalized.replace('</head>', `${chatbotAssets}</head>`)
      : `${chatbotAssets}${normalized}`;
    writeFileSync(filePath, updated);
  }
}

addSitewideChatbot(destination);

console.log('Static website copied successfully to out/.');
