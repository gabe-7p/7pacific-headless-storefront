import type { ReactNode } from 'react';

import { SpecLine } from '~/components/common/SpecLine';

/**
 * Ember live-signal dot with the radar ping ("signal live") — the drop-page
 * eyebrow device. The ring expands out of the dot and dissolves; the dot
 * itself never moves, and the ring sits out under motion-reduce. The
 * accent-ration exception (7PA-230) has this one owner.
 */
export const LiveDot = () => (
  <span aria-hidden className="relative size-2.5 shrink-0">
    <span className="animate-radar-ping border-brand absolute inset-0 rounded-full border motion-reduce:hidden" />
    <span className="bg-brand absolute inset-0 rounded-full" />
  </span>
);

/** The drop-page eyebrow: the live dot leading a mono spec line. */
export const LiveEyebrow = ({ children }: { children: ReactNode }) => (
  <SpecLine className="flex items-center gap-3 text-sm text-ink">
    <LiveDot />
    {children}
  </SpecLine>
);
