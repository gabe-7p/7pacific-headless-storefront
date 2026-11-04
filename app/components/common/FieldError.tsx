import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

const TONES = {
  day: 'text-error',
  night: 'text-error-night',
} as const;

/**
 * The one form-error line: cart, contact and signup all render through it, in
 * the `--color-error` role tokens. `tone` follows the ground the form sits on;
 * `className` is for spacing and size only.
 */
export const FieldError = ({
  tone = 'day',
  className,
  children,
}: {
  tone?: keyof typeof TONES;
  className?: string;
  children: ReactNode;
}) => (
  <p role="alert" className={cn('mt-1 text-xs', TONES[tone], className)}>
    {children}
  </p>
);
