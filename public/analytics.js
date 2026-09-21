(function () {
  var config = window.DIVERSE_SITE_CONFIG || {};
  var id = String(config.googleAnalyticsId || '').trim();
  window.dataLayer = window.dataLayer || [];
  window.dcTrack = function (eventName, details) {
    var event = Object.assign({ event: eventName, page_path: location.pathname }, details || {});
    window.dataLayer.push(event);
    if (typeof window.gtag === 'function') window.gtag('event', eventName, details || {});
  };
  if (!/^G-[A-Z0-9]+$/i.test(id)) return;
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(script);
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a,button');
    if (!link) return;
    var label = (link.textContent || link.getAttribute('aria-label') || '').trim().slice(0, 80);
    if (/consult|demo|book|contact/i.test(label)) window.dcTrack('conversion_click', { link_text: label });
  });
}());
