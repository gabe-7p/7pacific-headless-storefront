import { expect, test } from '@playwright/test';

import { STORE_LINKS } from '~/content/links';

import { installPixelCapture, isStubMode, readEnvVar, SETTLE_MS, TRAFFIC_BLOCKED } from './pixel';

/**
 * The Meta Pixel pre-checkout funnel: PageView → ViewContent → AddToCart
 * (+1 quantity), with Shopify's own analytics still flowing and no CSP
 * violations. Run with `pnpm test:pixel` (see playwright.config.ts).
 *
 * Env: PUBLIC_META_PIXEL_ID (from .env), TEST_PRODUCT_HANDLE (optional; the
 * default is the first product in the shop-all collection grid).
 *
 * Stub vs live mode and the Traffic Permissions caveat: e2e/pixel.ts and
 * docs/META_PIXEL_TESTING.md §0.
 *
 * Not covered: Search — the storefront has no search route yet, so nothing
 * publishes `search_viewed`. The destination's mapping is unit-tested in
 * app/lib/analytics/meta-pixel.test.ts.
 */
const CONTENT_ID = /^shopify_US_\d+_\d+$/;
const MODE = isStubMode() ? 'stubbed fbevents.js' : 'real fbevents.js';

test(`Meta Pixel pre-checkout funnel (${MODE})`, async ({ page }) => {
  const pixelId = readEnvVar('PUBLIC_META_PIXEL_ID');
  if (!pixelId) throw new Error('PUBLIC_META_PIXEL_ID is not set (process.env or .env)');
  const productHandle = process.env.TEST_PRODUCT_HANDLE;

  const pixel = await installPixelCapture(page);
  const consoleErrors: Array<string> = [];
  let trafficBlocked = false;
  const isRelevant = (text: string) => /Content Security Policy|facebook/i.test(text);
  page.on('console', (message) => {
    const text = message.text();
    if (TRAFFIC_BLOCKED.test(text)) trafficBlocked = true;
    if (message.type() === 'error' && isRelevant(text)) consoleErrors.push(text);
  });
  page.on('pageerror', (error) => {
    if (isRelevant(error.message)) consoleErrors.push(error.message);
  });
  // Shopify's destination must keep reporting; registered before the first load.
  const monorail = page.waitForRequest(/monorail-edge\.shopifysvc\.com/, { timeout: 60_000 });

  /** Waits until exactly `expected` events of `ev` arrived and no more follow. */
  const expectExactly = async (ev: string, expected: number) => {
    await expect.poll(() => pixel.count(ev), { timeout: 30_000 }).toBe(expected);
    await page.waitForTimeout(SETTLE_MS);
    expect(pixel.count(ev)).toBe(expected);
  };

  await test.step('1. homepage load fires exactly one PageView with the configured id', async () => {
    await page.goto('/');
    // -1 short-circuits the wait as soon as Meta refuses this domain.
    await expect
      .poll(() => (trafficBlocked ? -1 : pixel.count('PageView')), { timeout: 30_000 })
      .not.toBe(0);
    if (trafficBlocked) {
      throw new Error(
        [
          `Meta refused pixel ${pixelId} on ${new URL(page.url()).hostname}: its Traffic Permissions`,
          'allow-list does not include this domain, so fbevents.js sends nothing (the same',
          'applies to any Oxygen preview domain). Either add the domain under Events Manager →',
          'Settings → Traffic permissions, or run the funnel offline against a local stand-in:',
          '  META_PIXEL_STUB=1 pnpm test:pixel',
        ].join('\n')
      );
    }
    await expectExactly('PageView', 1);
    expect(pixel.last('PageView')?.id).toBe(pixelId);
    expect(await page.evaluate(() => typeof window.fbq)).toBe('function');
  });

  await test.step('2. client-side navigation to a product fires one PageView and one ViewContent', async () => {
    // The homepage's product links scroll in a marquee (never "stable" for a
    // click), so the collection grid is the navigation source.
    await page.goto(STORE_LINKS.shopAll);
    await expectExactly('PageView', 2);
    const link = page
      .locator(`a[href^="/products/${productHandle ?? ''}"]`)
      .filter({ hasNot: page.locator('[aria-label]') })
      .first();
    await link.click();
    await expect(page).toHaveURL(/\/products\//);
    await expectExactly('PageView', 3);
    await expectExactly('ViewContent', 1);

    const { cd } = pixel.lastOrThrow('ViewContent');
    const contentIds = JSON.parse(cd['content_ids'] ?? 'null') as unknown;
    expect(Array.isArray(contentIds) && contentIds.length === 1).toBe(true);
    expect((contentIds as Array<string>)[0]).toMatch(CONTENT_ID);
    expect(cd['content_type']).toBe('product');
    expect(Number(cd['value'])).toBeGreaterThan(0);
    expect(cd['currency']).toMatch(/^[A-Z]{3}$/);
  });

  const addToCart = page.getByRole('button', { name: /add to cart/i }).first();

  await test.step('3. add to cart fires exactly one AddToCart with num_items=1', async () => {
    if (await addToCart.isDisabled()) {
      // No size preselected: pick the first selectable size cell.
      await page.locator('a[href*="?"]:not([aria-current])').first().click();
      await expect(addToCart).toBeEnabled();
    }
    await addToCart.click();
    await expectExactly('AddToCart', 1);
    await expect(page.getByRole('dialog')).toBeVisible();

    const { cd } = pixel.lastOrThrow('AddToCart');
    expect(cd['num_items']).toBe('1');
    expect(Number(cd['value'])).toBeGreaterThan(0);
    expect(cd['currency']).toMatch(/^[A-Z]{3}$/);
    expect(cd['content_type']).toBe('product');
    const contentIds = JSON.parse(cd['content_ids'] ?? 'null') as Array<string>;
    expect(contentIds[0]).toMatch(CONTENT_ID);
  });

  await test.step('4. increasing the quantity by one fires one more AddToCart with num_items=1', async () => {
    await page.getByRole('button', { name: 'Increase quantity' }).first().click();
    await expectExactly('AddToCart', 2);
    expect(pixel.last('AddToCart')?.cd['num_items']).toBe('1');
  });

  // 5. Search: no search route on this storefront yet (see the file header).

  await test.step('6. no CSP or pixel errors in the console', async () => {
    expect(consoleErrors).toEqual([]);
  });

  await test.step("7. Shopify's own analytics still reach monorail", async () => {
    await monorail;
  });
});
