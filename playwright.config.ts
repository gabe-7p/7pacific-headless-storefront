import { defineConfig } from '@playwright/test';

/**
 * Playwright runs the Meta Pixel funnel test (e2e/meta-pixel.spec.ts) against
 * the PRODUCTION preview build by default: `react-router build` + `vite
 * preview` (MiniOxygen, reads `.env`). The dev server runs React in Strict
 * Mode, which double-invokes effects and can publish a page view twice, so
 * "exactly one event" assertions only hold against a production build.
 *
 * Stub vs live mode: see e2e/pixel.ts.
 *
 * Attach to a server that is already running (dev or preview) instead with
 * `PIXEL_BASE_URL=http://localhost:3000 pnpm test:pixel`.
 */
const baseURL = process.env.PIXEL_BASE_URL ?? 'http://localhost:4173';

export default defineConfig({
  testDir: 'e2e',
  workers: 1,
  retries: 0,
  timeout: 120_000,
  reporter: 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  webServer: process.env.PIXEL_BASE_URL
    ? undefined
    : {
        command: 'pnpm preview --port 4173 --strictPort',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 300_000,
      },
});
