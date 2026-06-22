import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

const SIZES = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-2xl md:text-3xl',
} as const;

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
};

/**
 * Brand section heading — bold, wide-tracked, uppercase. Use instead of
 * retyping `font-bold tracking-wide uppercase` across pages.
 */
export const Heading = ({ as: Tag = 'h2', size = 'md', className, children }: HeadingProps) => (
  <Tag className={cn('font-bold tracking-wide uppercase', SIZES[size], className)}>{children}</Tag>
);
