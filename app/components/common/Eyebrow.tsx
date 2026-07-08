import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

type EyebrowProps = {
  as?: 'p' | 'h4' | 'span';
  className?: string;
  children: ReactNode;
};

/**
 * Small uppercase letterspaced label above a control or column
 * ("COLOR", "SIZE", "MATERIALS"). Color/margins come in via className.
 */
export const Eyebrow = ({ as: Tag = 'p', className, children }: EyebrowProps) => (
  <Tag className={cn('text-xs font-semibold tracking-[0.15em] uppercase', className)}>
    {children}
  </Tag>
);
