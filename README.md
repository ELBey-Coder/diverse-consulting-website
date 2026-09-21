# Diverse Consulting Next.js Original Design Upgrade

Preserves original design, logo, favicon, theme, content, chatbot concept, and assets while improving contrast and wrapping the site in Next.js.

Run:

```cmd
cd nextsite
npm install
npm run dev
```

Netlify: build `npm run build`, publish `out`.
# Diverse Consulting website

This package contains the editable source and a repeatable Hostinger-ready build.

## Build and preview

1. Run `npm ci`.
2. Run `npm run build`.
3. Run `npm start` and open `http://localhost:3000`.
4. Upload the contents of `out/` to Hostinger's `public_html` directory.

## Analytics and scheduling configuration

Edit `public/site-config.js` before building:

- Set `googleAnalyticsId` to the site's Google Analytics 4 ID (for example, `G-XXXXXXXXXX`) to enable live reporting and conversion-click events.
- Set `hubspotMeetingUrl` when a HubSpot Meetings calendar is created. Until then, the website correctly describes the current form as a consultation or appointment request and clearly labels calendar/CRM examples as demonstrations.

The secure HubSpot consultation form remains connected. The chatbot routes prospective customers to that form so their information can be submitted to HubSpot.

## Included safeguards

- Unique, server-visible titles and descriptions for all eight industry pages
- Canonical links and Open Graph metadata
- `sitemap.xml` and `robots.txt`
- Local video assets with no third-party YouTube dependency
- No duplicated base64 logo payloads inside HTML pages
- Honest labels for simulated appointment and CRM screens
- Static preview server that matches the Hostinger deployment output
