import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 */
export const cn = (...inputs: Array<ClassValue>) => twMerge(clsx(inputs));
