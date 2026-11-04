import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'app',
  // `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server`
  // (package.json `deploy`, the Oxygen workflow) reads this layout.
  buildDirectory: 'dist',
  ssr: true,
  future: {
    // Honour vite.config's ssr.optimizeDeps under MiniOxygen.
    unstable_optimizeDeps: true,
  },
} satisfies Config;
