/**
 * Cookie-free analytics for the studio dashboard. Nothing is stored on the visitor's device: the
 * visit ID below lives only in memory, and the server turns IP + browser into an anonymous ID
 * that changes every day. Browsers that set the studio's "don't count me" switch send nothing.
 */
const ENDPOINT = '/api/collect';
export const IGNORE_KEY = 'studio:ignore';

const session =
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

let source = null;
let page = null;

const ignored = () => {
  try {
    return localStorage.getItem(IGNORE_KEY) === '1';
  } catch {
    return false;
  }
};

function send(payload) {
  if (ignored() || !source) return;
  const body = JSON.stringify({
    ...payload,
    ...source,
    session,
    screen: window.screen?.width,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const blob = new Blob([body], { type: 'application/json' });
  if (navigator.sendBeacon?.(ENDPOINT, blob)) return;
  fetch(ENDPOINT, { method: 'POST', body: blob, keepalive: true }).catch(() => {});
}

/** Where the visit came from, read once: the external referrer and any utm_ tags in the URL. */
function captureSource() {
  const params = new URLSearchParams(window.location.search);
  let referrer = null;
  try {
    const url = new URL(document.referrer);
    if (url.host !== window.location.host) referrer = url.href;
  } catch {
    referrer = null;
  }
  return {
    referrer,
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
  };
}

/** Time on the current page, counting only while the tab is visible. */
function flushEngagement() {
  if (!page) return;
  const visibleMs = page.visibleMs + (page.since ? performance.now() - page.since : 0);
  page.visibleMs = 0;
  page.since = document.visibilityState === 'visible' ? performance.now() : null;
  if (visibleMs >= 1000)
    send({ kind: 'engagement', path: page.path, duration: Math.round(visibleMs) });
}

function onVisibility() {
  if (!page) return;
  if (document.visibilityState === 'hidden') flushEngagement();
  else page.since = performance.now();
}

function onClick(event) {
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!link) return;
  if (link.protocol === 'mailto:') trackEvent('email', link.pathname);
  else if (/^https?:$/.test(link.protocol) && link.host !== window.location.host) {
    trackEvent('outbound', link.hostname.replace(/^www\./, ''));
  }
}

let started = false;

function start() {
  if (started) return;
  started = true;
  source = captureSource();
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', flushEngagement);
  document.addEventListener('click', onClick, { capture: true });
}

export function trackPageview(path) {
  start();
  if (page?.path === path) return;
  flushEngagement();
  page = {
    path,
    visibleMs: 0,
    since: document.visibilityState === 'visible' ? performance.now() : null,
  };
  send({ kind: 'pageview', path });
}

/** A named moment worth counting, such as `play` with the track's ID as the label. */
export function trackEvent(name, label) {
  start();
  const path = window.location.pathname;
  send({ kind: 'event', name, label: label == null ? null : String(label), path });
}
