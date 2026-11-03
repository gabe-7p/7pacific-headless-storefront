import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'app',
  // `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server`
  // (package.json `deploy`, the Oxygen workflow) reads this layout.
  buildDirectory: 'dist',
  ssr: true,
  // React Router 8 defaults: middleware always on, raw requests passed through
  // (loaders read the normalized `url` arg), trailing-slash-aware data requests,
  // the Vite Environment API, and route-module splitting (`splitRouteModules`
  // defaults to true).
  future: {
    // Honour vite.config's ssr.optimizeDeps under MiniOxygen.
    unstable_optimizeDeps: true,
  },
} satisfies Config;
