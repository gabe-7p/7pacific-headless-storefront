import { reactRouter } from '@react-router/dev/vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), hydrogen(), oxygen(), reactRouter()],
  resolve: {
    // Vite 8 resolves tsconfig `paths` (the `~/*` alias) natively — no plugin.
    tsconfigPaths: true,
  },
  build: {
    // Allow a strict Content-Security-Policy without inlining assets as base64.
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      // CJS deps pre-bundled for SSR to avoid CJS<>ESM "module is not defined" errors.
      // The `react-router > x` form targets react-router's own nested copies.
      include: ['react-router > set-cookie-parser', 'react-router > cookie', 'react-router'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});
