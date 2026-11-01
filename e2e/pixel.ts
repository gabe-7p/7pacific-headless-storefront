import { readFileSync } from 'node:fs';
import path from 'node:path';

import type { Page, Request } from '@playwright/test';

/**
 * Helpers for the Meta Pixel funnel test.
 *
 * Every hit the pixel sends goes to https://www.facebook.com/tr — as a GET
 * image (params in the query string) or a POST (form-encoded body). The
 * capture below records both shapes and answers them locally, so a test run
 * never reaches Meta. fbevents.js prefers `navigator.sendBeacon` when it
 * exists; beacons bypass Playwright's request interception in some
 * browser builds, so the init script removes it and the pixel (and Shopify's
 * own analytics) fall back to XHR/image requests, which are always intercepted.
 *
 * META_PIXEL_STUB=1 swaps Meta's fbevents.js for e2e/fbevents-stub.js: the
 * storefront code under test is unchanged, but the hits come from a local
 * script, so the run is offline and immune to the pixel's Traffic
 * Permissions (which block domains that aren't allow-listed, like localhost).
 */
export type PixelHit = { ev: string; id: string; cd: Record<string, string>; method: string };

export const SETTLE_MS = 1500;

/** Meta's config script logs this when the pixel's Traffic Permissions exclude the current domain. */
export const TRAFFIC_BLOCKED = /traffic permission/i;

export const isStubMode = () => process.env.META_PIXEL_STUB === '1';

const PIXEL_ENDPOINT = /^https:\/\/www\.facebook\.com\/tr\/?(\?|$)/;

export const parsePixelRequest = (request: Request): PixelHit | null => {
  const url = new URL(request.url());
  if (!PIXEL_ENDPOINT.test(url.origin + url.pathname + (url.search ? '?' : ''))) return null;
  const params = new URLSearchParams(url.search);
  if (request.method() === 'POST') {
    for (const [key, value] of new URLSearchParams(request.postData() ?? ''))
      params.set(key, value);
  }
  const cd: Record<string, string> = {};
  for (const [key, value] of params) {
    const match = /^cd\[(.+)\]$/.exec(key);
    if (match?.[1]) cd[match[1]] = value;
  }
  return { ev: params.get('ev') ?? '', id: params.get('id') ?? '', cd, method: request.method() };
};

export const installPixelCapture = async (page: Page) => {
  const hits: Array<PixelHit> = [];
  await page.context().addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'sendBeacon', {
      value: undefined,
      configurable: true,
    });
  });
  if (isStubMode()) {
    const body = readFileSync(path.resolve(process.cwd(), 'e2e/fbevents-stub.js'), 'utf8');
    await page.route(/https:\/\/connect\.facebook\.net\/en_US\/fbevents\.js/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/javascript', body })
    );
  }
  await page.route(/https:\/\/www\.facebook\.com\/tr\/?(\?|$)/, async (route) => {
    const hit = parsePixelRequest(route.request());
    if (hit) hits.push(hit);
    await route.fulfill({ status: 200, body: '' });
  });
  return {
    hits,
    count: (ev: string) => hits.filter((hit) => hit.ev === ev).length,
    last: (ev: string) => hits.filter((hit) => hit.ev === ev).at(-1),
  };
};

/** `process.env` first, then the repo's gitignored `.env` (what the preview server reads). */
export const readEnvVar = (name: string): string | undefined => {
  if (process.env[name]) return process.env[name];
  try {
    const env = readFileSync(path.resolve(process.cwd(), '.env'), 'utf8');
    const line = env.split('\n').find((row) => row.startsWith(`${name}=`));
    return (
      line
        ?.slice(name.length + 1)
        .trim()
        .replace(/^["']|["']$/g, '') || undefined
    );
  } catch {
    return undefined;
  }
};
