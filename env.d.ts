/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type { CacheInstance } from '@shopify/hydrogen';

import type { AppEnv } from './app/lib/env';

/** What server.ts puts on the router context for every request. */
type OxygenRouterContext = {
  cache: CacheInstance;
  env: Env;
  waitUntil: ExecutionContext['waitUntil'];
};

declare module 'react-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation must be an interface
  interface AppLoadContext extends OxygenRouterContext {}
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation must be an interface
  interface RouterContextProvider extends OxygenRouterContext {}
}

declare global {
  /** The Oxygen worker bindings (`.env` locally). Shape lives in app/lib/env.ts. */
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- global augmentation must be an interface
  interface Env extends AppEnv {}
}
