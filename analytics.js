/**
 * CipherBuilds Analytics Beacon v2
 * Add <script src="/analytics.js"></script> before </body> on every page.
 */
(function () {
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  const API = 'https://behemothcipher-github-io.onrender.com';

  // Deduplicate: one hit per page per hour per browser
  const storageKey = 'cb_v_' + location.pathname;
  const lastHit = localStorage.getItem(storageKey);
  const oneHour = 60 * 60 * 1000;
  if (lastHit && (Date.now() - parseInt(lastHit)) < oneHour) return;
  localStorage.setItem(storageKey, Date.now().toString());

  fetch(API + '/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: location.pathname || '/' }),
    keepalive: true,
  })
  .then(r => r.json())
  .then(d => console.log('[CipherBuilds Analytics] Tracked:', d.tracked))
  .catch(e => console.warn('[CipherBuilds Analytics] Failed:', e.message));
})();
