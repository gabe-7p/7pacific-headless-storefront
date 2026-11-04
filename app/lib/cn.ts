import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge's stock config lists `leading` as a conflict of `font-size`,
 * so a `text-*` removes any earlier `leading-*`. Our Tailwind emits `text-*` as
 * `line-height: var(--tw-leading, …)`, which already honors the leading, so the
 * conflict is cleared here. `text-lg/7` still evicts: its postfix sets the
 * line-height, and that lives in `conflictingClassGroupModifiers`.
 *
 * `theme` names the custom tokens merge can't place by itself: without `brand`,
 * `rounded-brand` wouldn't replace the primitives' `rounded-lg`, and any unknown
 * `font-*` reads as a font family, so `font-campaign` would evict
 * `font-display-narrow`.
 */
const twMerge = extendTailwindMerge({
  override: { conflictingClassGroups: { 'font-size': [] } },
  extend: { theme: { radius: ['brand'], 'font-weight': ['campaign'] } },
});

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 */
export const cn = (...inputs: Array<ClassValue>) => twMerge(clsx(inputs));
