import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

const VARIANTS = {
  /**
   * Brand display heading — Archivo Condensed Medium (500), ALL CAPS (the only
   * display weight in the system; hierarchy comes from size, not weight).
   * Section-header tracking (+0.01em) is the default; hero (-0.005em) and
   * product-name (+0.04em) tiers override via className.
   */
  brand: 'font-display font-medium tracking-header uppercase leading-[1.1]',
  /** Quiet page heading — Inter medium, tight-tracked, sentence case (cart, contact, 404). */
  quiet: 'font-medium tracking-tight',
  /** Caption title — Inter medium, wide-tracked caps (detail-card captions,
      PLP marketing blocks, tech-stack row labels). */
  caps: 'font-medium tracking-wide uppercase',
} as const;

const SIZES = {
  /** No size — the caller owns the full responsive scale via className. */
  none: '',
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-2xl md:text-3xl',
  xl: 'text-3xl md:text-4xl',
  /** Section-header tier (36px, 48px from md) — Brand Guidelines type table. */
  display: 'text-4xl leading-[1.1] md:text-5xl md:leading-[1.1]',
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
