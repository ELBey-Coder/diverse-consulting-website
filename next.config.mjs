import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// Hostinger may launch Next.js instead of the standalone static server.
// Serve existing public HTML at the same clean URLs in both modes.
function htmlRewrites(directory = 'public', prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) return htmlRewrites(join(directory, entry.name), relative);
    if (!entry.isFile() || !entry.name.endsWith('.html') || relative === '/index.html') return [];
    const source = relative.endsWith('/index.html')
      ? relative.slice(0, -'/index.html'.length)
      : relative.slice(0, -'.html'.length);
    return [{ source, destination: relative }];
  });
}

const nextConfig = {
  images: { unoptimized: true },
  async rewrites() { return htmlRewrites(); }
};
export default nextConfig;
