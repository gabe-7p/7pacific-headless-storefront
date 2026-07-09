import { cn } from '~/lib/cn';

/**
 * Styled wrapper for Shopify-authored HTML (page bodies, product
 * descriptions) rendered via dangerouslySetInnerHTML. The single source of
 * prose styling — don't hand-roll `[&_p]:…` strings at call sites.
 */
const PROSE_VARIANTS = {
  /** Full document prose: headings, lists, images (generic Shopify pages). */
  page: '[&_a]:text-brand [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-wide [&_h2]:uppercase [&_h3]:mt-6 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:tracking-[0.1em] [&_h3]:text-neutral-900 [&_h3]:uppercase [&_img]:mt-4 [&_img]:w-full [&_li]:mt-1 [&_li]:text-sm [&_li]:leading-6 [&_li]:text-neutral-600 [&_p]:mt-4 [&_p]:text-sm [&_p]:leading-7 [&_p]:text-neutral-600 [&_strong]:font-semibold [&_strong]:text-neutral-900 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5',
  /**
   * Contact-page flow. Live keeps subheadings in title case at ~28px and
   * renders links as plain underlined black text (not brand orange).
   */
  compact:
    '[&_a]:text-black [&_a]:underline [&_h2]:mt-8 [&_h2]:text-[1.75rem] [&_h2]:font-semibold [&_h2:first-of-type]:mt-6 [&_p]:mt-3 [&_p]:text-base [&_p]:leading-7 [&_p]:text-neutral-700 [&_strong]:font-semibold [&_strong]:text-neutral-900',
  /** Plain paragraphs only (PDP description) — live's tight 13px/1.3 rhythm. */
  description: 'text-[13px] leading-[1.3] text-neutral-600 [&_p]:mb-4 [&_p:last-child]:mb-0',
  /**
   * Shopify policy bodies (`/policies/*`). Live sets both heading levels at
   * 22px/600 with generous spacing, 12px paragraphs, and real bulleted lists.
   */
  policy:
    '[&_a]:text-black [&_a]:underline [&_h1]:mt-10 [&_h1]:text-[22px] [&_h1]:font-semibold [&_h1:first-child]:mt-0 [&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-semibold [&_li]:mt-1 [&_li]:text-xs [&_li]:leading-6 [&_li]:text-neutral-700 [&_p]:mt-4 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-neutral-700 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5',
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
