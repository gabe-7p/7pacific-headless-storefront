import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

const VARIANTS = {
  /**
   * Brand section heading — uppercase Barlow. Live renders every display
   * heading at weight 500 with 1.1 line-height and modest tracking; sizes and
   * per-page tracking one-offs layer on top.
   */
  brand: 'font-medium tracking-[0.03em] uppercase leading-[1.1]',
  /** Quiet page heading — bold, tight-tracked, sentence case (cart, contact, 404). */
  quiet: 'font-bold tracking-tight',
} as const;

const SIZES = {
  /** No size — the caller owns the full responsive scale via className. */
  none: '',
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
 *
 * A preset `size` also sets responsive steps (`md:`/`xl:`), which className
 * can't override at those breakpoints — pass `size="none"` when a page needs
 * to own its whole scale.
 */
export const Heading = ({
  as: Tag = 'h2',
  size = 'md',
  variant = 'brand',
  className,
  children,
}: HeadingProps) => <Tag className={cn(VARIANTS[variant], SIZES[size], className)}>{children}</Tag>;
