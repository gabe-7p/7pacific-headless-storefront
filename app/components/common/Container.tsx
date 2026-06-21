import type { ComponentProps } from 'react';

import { cn } from '~/lib/cn';

/**
 * Centers content and applies the standard page gutter. Use instead of
 * repeating `mx-auto max-w-[1400px] px-4 md:px-8` across layout/sections.
 */
export const Container = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('mx-auto w-full max-w-[1400px] px-4 md:px-8', className)} {...props} />
);
