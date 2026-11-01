import { describe, expect, it } from 'vitest';

import { createCsp } from '~/lib/csp';

const env = {
  PUBLIC_STORE_DOMAIN: '7pacific-7311.myshopify.com',
  PUBLIC_CHECKOUT_DOMAIN: 'checkout.7pacificapparel.com',
  PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com',
};

const directives = (header: string) =>
  Object.fromEntries(header.split('; ').map((d) => [d.split(' ')[0], d]));

describe('createCsp', () => {
  it('nonces scripts and allows Shopify, the store, checkout and PostHog', () => {
    const csp = directives(createCsp({ nonce: 'abc123', env }));
    expect(csp['script-src']).toContain("'nonce-abc123'");
    expect(csp['script-src']).toContain('https://cdn.shopify.com');
    expect(csp['connect-src']).toContain('https://checkout.7pacificapparel.com');
    expect(csp['connect-src']).toContain('https://7pacific-7311.myshopify.com');
    expect(csp['connect-src']).toContain('https://us.i.posthog.com');
    expect(csp['connect-src']).toContain('https://us-assets.i.posthog.com');
    expect(csp['worker-src']).toBe("worker-src 'self' blob:");
    expect(csp['frame-ancestors']).toBe("frame-ancestors 'none'");
  });

  it('leaves PostHog out when it is off', () => {
    const csp = createCsp({ nonce: 'n', env: { ...env, PUBLIC_POSTHOG_HOST: undefined } });
    expect(csp).not.toContain('posthog');
  });
  it('allows the Meta Pixel script, beacons and tracking image', () => {
    const csp = directives(createCsp({ nonce: 'n', env }));
    expect(csp['script-src']).toContain('https://connect.facebook.net');
    expect(csp['connect-src']).toContain('https://www.facebook.com');
    expect(csp['connect-src']).toContain('https://connect.facebook.net');
    expect(csp['img-src']).toContain('https://www.facebook.com');
  });

  it('keeps the img-src sources that default-src used to cover', () => {
    const csp = directives(createCsp({ nonce: 'n', env }));
    expect(csp['img-src']).toContain("'self'");
    expect(csp['img-src']).toContain('https://cdn.shopify.com');
  });
});
