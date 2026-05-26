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
  if (lastHit && (Date.now() - parseInt(lastHit)) < oneHour) {
    console.log('[CipherBuilds Analytics] Skipped (dedup):', location.pathname);
    return;
  }
  localStorage.setItem(storageKey, Date.now().toString());

  console.log('[CipherBuilds Analytics] Firing beacon for:', location.pathname);

  fetch(API + '/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: location.pathname || '/' }),
    keepalive: true,
  })
  .then(r => {
    console.log('[CipherBuilds Analytics] Response status:', r.status);
    return r.json();
  })
  .then(d => console.log('[CipherBuilds Analytics] Tracked:', d))
  .catch(e => {
    console.warn('[CipherBuilds Analytics] Failed:', e.message || 'No message (likely CORS)');
    console.warn('[CipherBuilds Analytics] Error type:', e.name, '| Full error:', e);
  });
})();
