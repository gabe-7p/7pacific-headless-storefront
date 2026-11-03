import { reactRouter } from '@react-router/dev/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

// Hydrogen 2026.10 is a library: there is no `hydrogen()` plugin. Oxygen's
// plugin runs the worker (workerd) locally and injects `.env`; React Router
// owns routing and the build.
const oxygenPlugins = oxygen();
const oxygenPlugin = oxygenPlugins.find((plugin) => plugin.name === 'oxygen:main');
if (!oxygenPlugin?.api) throw new Error('MiniOxygen plugin API is unavailable.');

// MiniOxygen infers the compatibility date 2026-10-01 from Hydrogen 2026.10.x,
// but its runtime doesn't support that date yet (the 2026-10 template carries
// the same override). Remove once MiniOxygen handles inferred dates it can't run.
const COMPATIBILITY_DATE = '2026-04-01';
oxygenPlugin.api.registerPluginOptions({ compatibilityDate: COMPATIBILITY_DATE });

/**
 * Emits `dist/server/oxygen.json` (the workerd compatibility date Oxygen reads)
 * from the ssr environment — ADR 0012. Drop this once MiniOxygen's plugin
 * supports the Environment API build.
 */
const oxygenManifest = (): Plugin => ({
  name: 'app:oxygen-manifest',
  generateBundle() {
    if (this.environment.name !== 'ssr') return;
    this.emitFile({
      type: 'asset',
      fileName: 'oxygen.json',
      source: JSON.stringify({ version: 1, compatibility_date: COMPATIBILITY_DATE }, null, 2),
    });
  },
});

export default defineConfig({
  plugins: [tailwindcss(), ...oxygenPlugins, reactRouter(), oxygenManifest()],
  resolve: {
    // Vite 8 resolves tsconfig `paths` (the `~/*` alias) natively.
    tsconfigPaths: true,
  },
  build: {
    // Allow a strict Content-Security-Policy without inlining assets as base64.
    assetsInlineLimit: 0,
  },
  environments: {
    ssr: {
      build: {
        // The worker entry wraps React Router's server build (ADR 0012).
        rollupOptions: { input: 'server.ts' },
      },
    },
  },
  ssr: {
    optimizeDeps: {
      // CJS deps pre-bundled for the workerd SSR environment; without these,
      // dev fails with "module is not defined" / "require is not defined".
      include: [
        'react',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom',
        'react-dom/server',
        'react-router',
      ],
    },
  },
  server: {
    // Keep the dev URL the docs and PostHog dev flag have always used.
    port: 3000,
  },
});
