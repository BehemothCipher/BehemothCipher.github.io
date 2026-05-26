/**
 * CipherBuilds Analytics Beacon v2
 * Add <script src="/analytics.js"></script> before </body> on every page.
 */
(function () {
  const API = 'https://behemothcipher-github-io.onrender.com';

  console.log('[CipherBuilds Analytics] Script loaded on:', location.pathname);

  // Deduplicate: one hit per page per hour per browser
  const storageKey = 'cb_v_' + location.pathname;
  const lastHit = localStorage.getItem(storageKey);
  const oneHour = 60 * 60 * 1000;
  if (lastHit && (Date.now() - parseInt(lastHit)) < oneHour) {
    console.log('[CipherBuilds Analytics] Skipped (dedup) — clear with: localStorage.removeItem("' + storageKey + '")');
    return;
  }
  localStorage.setItem(storageKey, Date.now().toString());

  console.log('[CipherBuilds Analytics] Firing beacon...');

  fetch(API + '/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: location.pathname || '/' }),
    keepalive: true,
  })
  .then(r => {
    console.log('[CipherBuilds Analytics] Server response:', r.status);
    return r.json();
  })
  .then(d => console.log('[CipherBuilds Analytics] Success:', d))
  .catch(e => {
    console.warn('[CipherBuilds Analytics] Error:', e.name, e.message || '(CORS or network — no message available)');
  });
})();
