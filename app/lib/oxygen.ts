import type { CacheInstance } from '@shopify/hydrogen';
import { createContext } from 'react-router';

/**
 * The Oxygen worker bindings `server.ts` threads onto the router context for
 * every request. Read them with `context.get(oxygenContext)` — in the root
 * middleware, loaders and `entry.server.tsx` — the same typed-key pattern as
 * `storefrontClientContext` and `posthogContext`. (React Router 8 exports
 * `RouterContextProvider` through a re-export, so the old
 * `interface RouterContextProvider { env … }` augmentation no longer merges.)
 */
export type OxygenBindings = {
  /** The worker env (`.env` locally). Shape: the global `Env` in env.d.ts. */
  env: Env;
  /** Oxygen's sub-request cache (`caches.open('hydrogen-v1')`). */
  cache: CacheInstance;
  waitUntil: ExecutionContext['waitUntil'];
};

export const oxygenContext = createContext<OxygenBindings>();
