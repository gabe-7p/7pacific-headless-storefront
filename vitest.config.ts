import path from 'node:path';

import { defineConfig } from 'vitest/config';

// Deliberately separate from vite.config.ts: unit tests exercise pure lib
// logic and must not boot the Hydrogen/Oxygen/React Router plugin stack.
export default defineConfig({
  resolve: {
    alias: { '~': path.resolve(__dirname, 'app') },
  },
  test: {
    include: ['app/**/*.test.{ts,tsx}'],
    // Pure lib tests run in node; component tests opt into jsdom with a
    // `// @vitest-environment jsdom` docblock at the top of the file.
    environment: 'node',
  },
});
