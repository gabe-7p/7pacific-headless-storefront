/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type { AppEnv } from './app/lib/env';

// The worker bindings (env, cache, waitUntil) travel on the router context
// under the typed `oxygenContext` key — see app/lib/oxygen.ts.

declare global {
  /** The Oxygen worker bindings (`.env` locally). Shape lives in app/lib/env.ts. */
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- global augmentation must be an interface
  interface Env extends AppEnv {}
}
