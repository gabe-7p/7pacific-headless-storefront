import { ArrowRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router';

import { useNewsletterDialog } from '~/components/common/NewsletterDialog';
import { Button } from '~/components/ui/button';

/**
 * Content files mark membership CTAs with this href instead of a real path;
 * `Cta` turns it into a button that opens the newsletter dialog.
 */
export const NEWSLETTER_HREF = '#newsletter';

/**
 * The brand CTA label device: text + trailing ArrowRight. On hover (or
 * focus-visible) of the enclosing `group/cta` button, the whole track slides
 * right by one icon+gap slot — a second arrow enters from the left edge while
 * the trailing arrow exits past the right one, both clipped by the
 * overflow-hidden wrapper. One transform, no opacity fades.
 *
 * Size-agnostic by design: the slide distance reads the `--cta-slide` var and
 * the gap inherits from the button, both published per size by the Button
 * `size` variants (ui/button.tsx) — sizing facts live there, in one place.
 */
export const CtaLabel = ({ children }: { children: ReactNode }) => (
  <span data-cta-label className="inline-flex [gap:inherit] overflow-hidden">
    <span className="inline-flex items-center [gap:inherit] transition-transform duration-500 ease-(--ease-brand) group-hover/cta:translate-x-(--cta-slide) group-focus-visible/cta:translate-x-(--cta-slide) motion-reduce:transition-none">
      <ArrowRight aria-hidden className="-ml-(--cta-slide)" />
      {children}
      <ArrowRight aria-hidden />
    </span>
  </span>
);

/** `brand` is the page's ONE Ember moment; everything else is outline or
    the borderless `brand-text` treatment. */
export type CtaVariant = 'brand' | 'brand-outline' | 'brand-text';

type CtaProps = {
  variant?: CtaVariant;
  size?: ComponentProps<typeof Button>['size'];
  className?: string;
  /** The label only — the arrow device (`CtaLabel`) is added here, once. */
  children: ReactNode;
  /** Internal link (renders a react-router <Link>). */
  to?: ComponentProps<typeof Link>['to'];
  prefetch?: ComponentProps<typeof Link>['prefetch'];
  /** External/absolute link, e.g. checkout (renders an <a>). */
  href?: string;
  /** For external links that should leave the storefront in a new tab. */
  target?: '_blank';
  /** With neither `to` nor `href`, renders a real <button>. */
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
};

/**
 * The brand CTA — mono caps label + trailing ArrowRight (on hover the whole
 * label slides right: a second arrow enters from the left while the trailing
 * one exits, via `CtaLabel`). ALL link/button CTAs render through this so the
 * icon and its behavior are defined once — don't hand-assemble `Button` +
 * arrow at callsites. The one exception is the PDP `AddToCartButton` (a
 * CartForm submit), which composes `buttonVariants` + `CtaLabel` directly.
 */
export const Cta = ({
  variant = 'brand-outline',
  size,
  className,
  children,
  to,
  prefetch,
  href,
  target,
  type = 'button',
  disabled,
  onClick,
}: CtaProps) => {
  const newsletter = useNewsletterDialog();

  const label = <CtaLabel>{children}</CtaLabel>;

  // Membership CTAs open the signup dialog rather than navigating. Falls
  // through to a normal link if rendered outside the provider.
  if ((href === NEWSLETTER_HREF || to === NEWSLETTER_HREF) && newsletter) {
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={newsletter.open}
      >
        {label}
      </Button>
    );
  }

  if (to !== undefined) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link to={to} prefetch={prefetch} onClick={onClick}>
          {label}
        </Link>
      </Button>
    );
  }

  if (href !== undefined) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <a
          href={href}
          target={target}
          rel={target === '_blank' ? 'noreferrer' : undefined}
          onClick={onClick}
        >
          {label}
        </a>
      </Button>
    );
  }

  return (
    <Button
      type={type}
      disabled={disabled}
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
