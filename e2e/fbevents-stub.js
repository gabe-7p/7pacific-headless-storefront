/**
 * A stand-in for https://connect.facebook.net/en_US/fbevents.js, served by
 * the test when META_PIXEL_STUB=1. It does what the real script does with the
 * storefront's calls — drains the snippet's queue, remembers `init`ed pixel
 * ids, and sends one GET https://www.facebook.com/tr/?id=…&ev=…&cd[…]=… image
 * request per `track` — using the same parameter encoding Meta uses (custom
 * data under `cd[key]`, non-strings JSON-encoded). It skips Meta's remote
 * config, so it also skips the Traffic Permissions check that blocks
 * unlisted domains such as localhost.
 */
(() => {
  const fbq = window.fbq;
  if (!fbq || fbq.callMethod) return;
  const pixelIds = [];

  const send = (id, event, params) => {
    const query = new URLSearchParams({ id, ev: event, dl: window.location.href });
    for (const [key, value] of Object.entries(params ?? {})) {
      query.set(`cd[${key}]`, typeof value === 'string' ? value : JSON.stringify(value));
    }
    new Image().src = `https://www.facebook.com/tr/?${query.toString()}`;
  };

  const call = (method, ...args) => {
    if (method === 'init') pixelIds.push(String(args[0]));
    if (method === 'track' || method === 'trackCustom') {
      for (const id of pixelIds) send(id, args[0], args[1]);
    }
  };

  fbq.callMethod = call;
  for (const queued of fbq.queue) call(...Array.from(queued));
  fbq.queue.length = 0;
})();
