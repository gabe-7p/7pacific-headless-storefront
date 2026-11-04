import type { ComponentProps } from 'react';

import { cn } from '~/lib/cn';

/**
 * Centers content to `--page-max` and applies the standard page gutter.
 */
export const Container = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('mx-auto w-full max-w-(--page-max) px-4 md:px-8', className)} {...props} />
);
