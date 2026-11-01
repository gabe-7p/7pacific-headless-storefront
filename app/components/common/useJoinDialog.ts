import { createContext, useContext } from 'react';

import type { JoinList } from '~/content/join';

export type JoinDialogContextValue = { open: (list: JoinList) => void };

/**
 * Provided by `JoinDialogProvider` (JoinDialog.tsx). The hook lives apart
 * from the dialog so `Cta` can open it without importing the dialog that
 * renders `JoinForm` — which itself renders a `Cta` (a cycle otherwise).
 */
export const JoinDialogContext = createContext<JoinDialogContextValue | null>(null);

/** Returns null outside the provider so a CTA can fall back to a plain link. */
export const useJoinDialog = () => useContext(JoinDialogContext);
