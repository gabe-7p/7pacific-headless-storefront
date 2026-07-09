import { cn } from '~/lib/cn';

/**
 * Styled wrapper for Shopify-authored HTML (page bodies, product
 * descriptions) rendered via dangerouslySetInnerHTML. The single source of
 * prose styling — don't hand-roll `[&_p]:…` strings at call sites.
 */
const PROSE_VARIANTS = {
  /** Full document prose: headings, lists, images (generic Shopify pages). */
  page: '[&_a]:text-brand [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-wide [&_h2]:uppercase [&_h3]:mt-6 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:tracking-[0.1em] [&_h3]:text-neutral-900 [&_h3]:uppercase [&_img]:mt-4 [&_img]:w-full [&_li]:mt-1 [&_li]:text-sm [&_li]:leading-6 [&_li]:text-neutral-600 [&_p]:mt-4 [&_p]:text-sm [&_p]:leading-7 [&_p]:text-neutral-600 [&_strong]:font-semibold [&_strong]:text-neutral-900 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5',
  /** Tighter paragraph rhythm for boxed/card content (contact page). */
  compact:
    '[&_a]:text-brand [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-wide [&_h2]:uppercase [&_h2:first-of-type]:mt-6 [&_p]:mt-3 [&_p]:text-sm [&_p]:leading-7 [&_p]:text-neutral-600 [&_strong]:font-semibold [&_strong]:text-neutral-900',
  /** Plain paragraphs only (PDP description) — live's tight 13px/1.3 rhythm. */
  description: 'text-[13px] leading-[1.3] text-neutral-600 [&_p]:mb-4 [&_p:last-child]:mb-0',
} as const;

type ProseProps = {
  html: string;
  variant?: keyof typeof PROSE_VARIANTS;
  /** Layout-specific extras (margins, card chrome) — not prose styling. */
  className?: string;
};

export const Prose = ({ html, variant = 'page', className }: ProseProps) => (
  <div
    className={cn(PROSE_VARIANTS[variant], className)}
    dangerouslySetInnerHTML={{ __html: html }}
  />
);
