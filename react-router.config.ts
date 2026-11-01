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
  },
} satisfies Config;
