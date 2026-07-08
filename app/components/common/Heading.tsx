import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

const VARIANTS = {
  /** Brand section heading — bold, wide-tracked, uppercase. */
  brand: 'font-bold tracking-wide uppercase',
  /** Quiet page heading — bold, tight-tracked, sentence case (cart, contact, 404). */
  quiet: 'font-bold tracking-tight',
} as const;

const SIZES = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-2xl md:text-3xl',
  xl: 'text-3xl md:text-4xl',
  /** Live-theme homepage section headings (~30px mobile / ~36-40px desktop). */
  display: 'text-3xl tracking-[0.08em] md:text-4xl',
} as const;

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: keyof typeof SIZES;
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: ReactNode;
};

/**
 * Page/section heading. Use instead of retyping heading class strings —
 * every h1/h2 on the site should render through this (weight/tracking
 * one-offs go in className; cn resolves the conflict).
 */
export const Heading = ({
  as: Tag = 'h2',
  size = 'md',
  variant = 'brand',
  className,
  children,
}: HeadingProps) => <Tag className={cn(VARIANTS[variant], SIZES[size], className)}>{children}</Tag>;
