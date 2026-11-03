import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'app',
  // `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server`
  // (package.json `deploy`, the Oxygen workflow) reads this layout.
  buildDirectory: 'dist',
  ssr: true,
  future: {
    // Hydrogen's request handlers run in the root middleware (app/root.tsx).
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: false,
    // Honour vite.config's ssr.optimizeDeps under MiniOxygen.
    unstable_optimizeDeps: true,
    // Loaders, actions and middleware receive the raw request (`.data` suffix,
    // `_routes` param); routing logic reads the normalized `url` arg instead of
    // `request.url` — see .claude/rules/common-pitfalls.md.
    v8_passThroughRequests: true,
    // Data requests for `/a/b/` become `/a/b/_.data` (root: `/_.data`), so a path
    // with and without a trailing slash no longer share one `.data` URL.
    v8_trailingSlashAwareDataRequests: true,
  },
} satisfies Config;
