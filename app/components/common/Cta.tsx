import { ArrowRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router';

import { useNewsletterDialog } from '~/components/common/NewsletterDialog';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/cn';

/**
 * Content files mark membership CTAs with this href instead of a real path;
 * `Cta` turns it into a button that opens the newsletter dialog.
 */
export const NEWSLETTER_HREF = '#newsletter';

type CtaSize = ComponentProps<typeof Button>['size'];

// Slide distance = icon width + flex gap for the Button size, so the leading
// arrow starts exactly one slot left of the clip edge and the trailing arrow
// exits exactly past it (default/lg: 16+8, sm: 16+6, xs: 12+4).
const trackBySize: Partial<Record<NonNullable<CtaSize>, string>> = {
  default: 'gap-2 group-hover/cta:translate-x-6 group-focus-visible/cta:translate-x-6',
  lg: 'gap-2 group-hover/cta:translate-x-6 group-focus-visible/cta:translate-x-6',
  sm: 'gap-1.5 group-hover/cta:translate-x-[22px] group-focus-visible/cta:translate-x-[22px]',
  xs: 'gap-1 group-hover/cta:translate-x-4 group-focus-visible/cta:translate-x-4',
};
const leadingArrowBySize: Partial<Record<NonNullable<CtaSize>, string>> = {
  default: '-ml-6',
  lg: '-ml-6',
  sm: '-ml-[22px]',
  xs: '-ml-4',
};

/**
 * The brand CTA label device: text + trailing ArrowRight. On hover (or
 * focus-visible) of the enclosing `group/cta` button, the whole track slides
 * right by one icon+gap slot — a second arrow enters from the left edge while
 * the trailing arrow exits past the right one, both clipped by the
 * overflow-hidden wrapper. One transform, no opacity fades.
 */
export const CtaLabel = ({ size, children }: { size?: CtaSize; children: ReactNode }) => {
  const key = size ?? 'default';
  return (
    <span data-cta-label className="inline-flex overflow-hidden">
      <span
        className={cn(
          'inline-flex items-center transition-transform duration-500 ease-(--ease-brand) motion-reduce:transition-none',
          trackBySize[key] ?? trackBySize.default
        )}
      >
        <ArrowRight aria-hidden className={leadingArrowBySize[key] ?? leadingArrowBySize.default} />
        {children}
        <ArrowRight aria-hidden />
      </span>
    </span>
  );
};

type CtaProps = {
  /** `brand` is the page's ONE Ember moment; everything else is outline or
      the borderless `brand-text` treatment. */
  variant?: 'brand' | 'brand-outline' | 'brand-text';
  size?: ComponentProps<typeof Button>['size'];
  className?: string;
  /** The label only — the arrow device (`CtaLabel`) is added here, once. */
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
  type = 'button',
  disabled,
  onClick,
}: CtaProps) => {
  const newsletter = useNewsletterDialog();

  const label = <CtaLabel size={size}>{children}</CtaLabel>;

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
