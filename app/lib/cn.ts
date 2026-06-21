import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Used by the generated shadcn/ui primitives in `app/components/ui/`
 * and available to any component that needs class merging.
 */
export const cn = (...inputs: Array<ClassValue>) => twMerge(clsx(inputs));
