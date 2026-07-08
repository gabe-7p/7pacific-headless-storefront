import type { ComponentProps } from 'react';
import { Link } from 'react-router';

import { cn } from '~/lib/cn';

/**
 * The brand's underlined text link ("Continue shopping" and friends).
 * Layout concerns (margins, display) come in via className; color can be
 * overridden the same way (cn/tailwind-merge resolves the conflict).
 */
export const TextLink = ({ className, ...props }: ComponentProps<typeof Link>) => (
  <Link
    {...props}
    className={cn(
      'text-sm text-neutral-600 underline underline-offset-4 transition-colors hover:text-black',
      className
    )}
  />
);
