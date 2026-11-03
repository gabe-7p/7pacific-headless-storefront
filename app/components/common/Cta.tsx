import { ArrowRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router';

import { useJoinDialog } from '~/components/common/useJoinDialog';
import { Button } from '~/components/ui/button';
import { NEWSLETTER_HREF } from '~/content/links';

/**
 * The brand CTA label device: text + trailing ArrowRight — see
 * ui-components.md › CtaLabel. The slide distance reads the `--cta-slide` var
 * and the gap inherits from the button, both published per size by the Button
 * `size` variants (ui/button.tsx).
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
 * The brand CTA — mono caps label + trailing ArrowRight (via `CtaLabel`). ALL
 * link/button CTAs render through this; don't hand-assemble `Button` + arrow.
 * The one exception is `product/AddToCartBar` (see ui-components.md).
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
  const join = useJoinDialog();

  const label = <CtaLabel>{children}</CtaLabel>;

  // Membership CTAs open the roster signup dialog rather than navigating.
  // Falls through to a normal link if rendered outside the provider.
  if ((href === NEWSLETTER_HREF || to === NEWSLETTER_HREF) && join) {
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => join.open('newsletter')}
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
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
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
