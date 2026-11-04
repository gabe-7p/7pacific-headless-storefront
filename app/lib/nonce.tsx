import { createContext, type ReactNode, useContext } from 'react';

/**
 * The per-request CSP nonce. entry.server.tsx generates it and provides it;
 * `Layout` reads it for React Router's `<Scripts>` and `<ShopifyScripts>`;
 * entry.client.tsx re-provides the value it finds on the rendered scripts so
 * hydration matches.
 */
const NonceContext = createContext<string | undefined>(undefined);

export const NonceProvider = ({ value, children }: { value?: string; children: ReactNode }) => (
  <NonceContext.Provider value={value}>{children}</NonceContext.Provider>
);

export const useNonce = () => useContext(NonceContext);
