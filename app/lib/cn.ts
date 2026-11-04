import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge's stock config lets a font-size class evict any earlier
 * `leading-*`, modelling Tailwind v3. In v4 `text-*` emits
 * `line-height: var(--tw-leading, …)`, so the two compose in CSS and the
 * eviction only ever deleted a leading the author asked for.
 */
const twMerge = extendTailwindMerge({
  override: { conflictingClassGroups: { 'font-size': [] } },
});

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 */
export const cn = (...inputs: Array<ClassValue>) => twMerge(clsx(inputs));
