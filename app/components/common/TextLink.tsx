import type { ComponentProps } from 'react';
import { NavLink } from 'react-router';

import { cn } from '~/lib/cn';

/**
 * The underlined text-link class. Exported for a control that isn't a link
 * (the size guide's trigger and CLOSE); every link renders through <TextLink>.
 */
export const TEXT_LINK_CLASS =
  'text-support underline underline-offset-4 transition-colors hover:text-ink';

const VARIANTS = {
  /** "Continue shopping" and friends. */
  underline: `text-sm ${TEXT_LINK_CLASS}`,
  /** The footer's link list. */
  night: 'text-support-night transition-colors hover:text-ink-night',
  /** No device of its own: the caller's className is the whole treatment. */
  bare: undefined,
} as const;

type TextLinkProps = {
  variant?: keyof typeof VARIANTS;
  className?: string;
} & (
  | (Omit<ComponentProps<typeof NavLink>, 'className'> & { href?: never })
  | (Omit<ComponentProps<'a'>, 'className' | 'href' | 'target' | 'rel'> & {
      href: string;
      to?: never;
    })
);

/**
 * A text link: `to` is an in-app route, `href` an absolute URL, which opens in a
 * new tab. `NavLink` so a link to the current page carries `aria-current`.
 */
export const TextLink = ({ variant = 'underline', className, ...props }: TextLinkProps) => {
  const classes = cn(VARIANTS[variant], className);
  if (typeof props.href !== 'string') return <NavLink {...props} className={classes} />;
  const { children, ...anchor } = props;
  return (
    <a {...anchor} target="_blank" rel="noopener noreferrer" className={classes}>
      {children}
    </a>
  );
};
