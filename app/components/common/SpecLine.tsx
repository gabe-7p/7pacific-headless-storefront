import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

/**
 * The mono spec-strip class — JetBrains Mono caps at +0.1em tracking, the
 * brand's recurring readout-label device. Exported for surfaces that compose
 * it into many spans (AthleteSigning's MONO_LABEL); everywhere else render
 * through <SpecLine>.
 */
export const SPEC_LINE_CLASS = 'font-mono text-xs tracking-spec uppercase';

type SpecLineProps = {
  as?: 'p' | 'span';
  className?: string;
  children: ReactNode;
};

export const SpecLine = ({ as: Tag = 'p', className, children }: SpecLineProps) => (
  <Tag className={cn(SPEC_LINE_CLASS, className)}>{children}</Tag>
);
