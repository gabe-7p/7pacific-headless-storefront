import { cn } from '~/lib/cn';

/**
 * Styled wrapper for Shopify-authored HTML (page bodies, product
 * descriptions) rendered via dangerouslySetInnerHTML. The single source of
 * prose styling — don't hand-roll `[&_p]:…` strings at call sites.
 */
const PROSE_VARIANTS = {
  /** Full document prose: headings, lists, images (generic Shopify pages).
   * Links are underlined black, not Ember — the accent is rationed to one
   * moment per page (7PA-230), and body links never earn it. */
  page: '[&_a]:text-black [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:tracking-wide [&_h2]:uppercase [&_h3]:mt-6 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:tracking-[0.1em] [&_h3]:text-neutral-900 [&_h3]:uppercase [&_img]:mt-4 [&_img]:w-full [&_li]:mt-1 [&_li]:text-sm [&_li]:leading-6 [&_li]:text-neutral-600 [&_p]:mt-4 [&_p]:text-sm [&_p]:leading-7 [&_p]:text-neutral-600 [&_strong]:font-semibold [&_strong]:text-neutral-900 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5',
  /**
   * Contact-page flow. Live keeps subheadings in title case at ~28px and
   * renders links as plain underlined black text (not brand orange).
   */
  compact:
    '[&_a]:text-black [&_a]:underline [&_h2]:mt-8 [&_h2]:text-[1.75rem] [&_h2]:font-semibold [&_h2:first-of-type]:mt-6 [&_p]:mt-3 [&_p]:text-base [&_p]:leading-7 [&_p]:text-neutral-700 [&_strong]:font-semibold [&_strong]:text-neutral-900',
  /** Plain paragraphs only (PDP description) — live's tight 13px/1.3 rhythm. */
  description: 'text-[12px] leading-[1.35] text-neutral-600 [&_p]:mb-4 [&_p:last-child]:mb-0',
  /**
   * Journal long-form (7PA-248). The one surface the type table sets at 18px:
   * body 18px / lh 1.65, 65ch measure, block paragraphs with no indents.
   */
  journal:
    'max-w-[65ch] text-lg leading-[1.65] text-neutral-800 [&_a]:text-black [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-medium [&_h2]:tracking-header [&_h2]:uppercase [&_img]:mt-8 [&_img]:w-full [&_li]:mt-2 [&_li]:leading-[1.65] [&_p]:mt-6 [&_strong]:font-semibold [&_ul]:mt-6 [&_ul]:list-disc [&_ul]:pl-5',
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
