import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

/**
 * The mono spec-strip class — JetBrains Mono caps at +0.1em tracking, the
 * brand's recurring readout-label device. Exported for surfaces that compose
 * it into many spans; everywhere else render through <SpecLine>.
 */
export const SPEC_LINE_CLASS = 'font-mono text-xs tracking-spec uppercase';

/** `strip` is the 11px tier: product-card lines and the Spec Card's labels. */
const SIZES = {
  xs: undefined,
  strip: 'text-[11px]',
} as const;

type SpecLineProps = {
  as?: 'p' | 'span' | 'dt';
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
};

export const SpecLine = ({ as: Tag = 'p', size = 'xs', className, children }: SpecLineProps) => (
  <Tag className={cn(SPEC_LINE_CLASS, SIZES[size], className)}>{children}</Tag>
);
