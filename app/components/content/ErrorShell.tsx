import type { ReactNode } from 'react';

/**
 * The frame both error surfaces share (the 404 view and the root error
 * boundary), so they sit identically. Measured on live: a fixed distance below
 * the header (120px, 155px from md), text 20px from the viewport edge until
 * `gutterless:`, where the page reaches --page-max.
 */
export const ErrorShell = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto min-h-[60vh] max-w-(--page-max) px-3 pt-[120px] pb-20 md:px-5 md:pt-[155px] gutterless:px-0">
    {children}
  </div>
);
