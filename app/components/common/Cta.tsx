import { ChevronRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router';

import { useNewsletterDialog } from '~/components/common/NewsletterDialog';
import { Button } from '~/components/ui/button';

/**
 * Content files mark membership CTAs with this href instead of a real path;
 * `Cta` turns it into a button that opens the newsletter dialog.
 */
export const NEWSLETTER_HREF = '#newsletter';

type CtaProps = {
  /** `brand` is the page's ONE Ember moment; everything else is outline or
      the borderless `brand-text` treatment. */
  variant?: 'brand' | 'brand-outline' | 'brand-text';
  size?: ComponentProps<typeof Button>['size'];
  className?: string;
  /** The label only — the trailing chevron is added here, once. */
  children: ReactNode;
  /** Internal link (renders a react-router <Link>). */
  to?: ComponentProps<typeof Link>['to'];
  prefetch?: ComponentProps<typeof Link>['prefetch'];
  /** External/absolute link, e.g. checkout (renders an <a>). */
  href?: string;
  /** With neither `to` nor `href`, renders a real <button>. */
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
};

/**
 * The brand CTA — mono caps label + trailing ChevronRight (which nudges right
 * and grows on hover; the animation lives in the `brand`/`brand-outline`
 * Button variants). ALL link/button CTAs render through this so the icon and
 * its behavior are defined once — don't hand-assemble `Button` + chevron at
 * callsites. The one exception is the PDP `AddToCartButton` (a CartForm
 * submit), which composes `buttonVariants` directly.
 */
export const Cta = ({
  variant = 'brand-outline',
  size,
  className,
  children,
  to,
  prefetch,
  href,
  type = 'button',
  disabled,
  onClick,
}: CtaProps) => {
  const newsletter = useNewsletterDialog();

  const label = (
    <>
      {children}
      <ChevronRight />
    </>
  );

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
        <a href={href} onClick={onClick}>
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
