# Industry AI demonstrations preview test report

Date: 2026-09-21

Base commit: `5b4aeeb` (verified working Hostinger source)

Branch: `preview/industry-ai-demos`

## Automated checks

- Dependency installation: passed
- Static production build: passed
- JavaScript syntax checks: passed
- AI Solutions route: HTTP 200
- Eight industry landing-page routes: HTTP 200
- Existing homepage, About, Services, and Contact source files: unchanged
- Industry landing pages generated: 8

## Integration status

- Chatbot: working browser-based demonstration
- Appointment booking: interactive sample calendar
- CRM handoff: interactive sample CRM
- Follow-up: sample confirmation message
- Analytics: browser event layer and local preview event log installed
- HubSpot, live calendar, SMS, and voice calling: not connected; credentials and provider approval are required

## Production status

Not approved or deployed to production. Complete visual browser review and owner approval before merging to `main`.
# September 21, 2026 stabilization update

- Build: passed with `npm ci` and `npm run build`
- HTML pages: 24
- Industry pages: 8, each with a unique server-visible title, description, canonical URL, and Open Graph metadata
- Internal local file references: 0 missing
- Updated videos: 3 local MP4 files, used in all 9 Video Learning Center sections (27 references total)
- Old YouTube embeds: 0 remaining
- Oversized embedded base64 logos: 0 remaining
- Main HTML size after optimization: approximately 108–131 KB per page
- SEO discovery: `sitemap.xml` and `robots.txt` included
- Analytics: GA4 loader and conversion-click tracking included; activation requires the owner's GA4 measurement ID in `public/site-config.js`
- Scheduling: current HubSpot lead form preserved; sample calendar and CRM activity are explicitly labeled as demonstrations until a HubSpot Meetings URL is supplied
- Route smoke test: homepage, services, AI Solutions, industry page, all three videos, sitemap, and robots file returned HTTP 200
