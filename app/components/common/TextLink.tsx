import type { ComponentProps } from 'react';
import { Link } from 'react-router';

import { cn } from '~/lib/cn';

/**
 * The brand's underlined text link ("Continue shopping" and friends).
 */
export const TextLink = ({ className, ...props }: ComponentProps<typeof Link>) => (
  <Link
    {...props}
    className={cn(
      'text-sm text-support underline underline-offset-4 transition-colors hover:text-ink',
      className
    )}
  />
);
