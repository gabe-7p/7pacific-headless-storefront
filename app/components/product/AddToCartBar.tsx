import { ChevronRight } from 'lucide-react';
import type { ProductFragment } from 'storefrontapi.generated';

import { AddToCartButton } from '~/components/cart/AddToCartButton';
import { useAside } from '~/components/layout/Aside';

/**
 * The PDP add-to-cart bar — rendered flush at the bottom edge of the buy card,
 * spanning its full width. Extracted from ProductForm so the buy-card layout
 * (7PA-99) and per-breakpoint bar styling (7PA-154) can evolve independently.
 * Black on desktop, orange full-bleed on mobile/tablet.
 */
export const AddToCartBar = ({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) => {
  const { open } = useAside();

  return (
    // The base layer caps every `form` at 400px from md up; the bar has to span
    // its card (and the full viewport when sticky), so opt this one out.
    <div className="[&>form]:max-w-none">
      {/* The PDP's one Ember moment (7PA-230) — Ember at every breakpoint,
          mono caps with the trailing-chevron CTA device. Tailwind v4's
          preflight leaves buttons at cursor: default, so opt into pointer. */}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => open('cart')}
        className="bg-brand text-brand-text inline-flex min-h-[58px] w-full cursor-pointer items-center justify-center gap-2 px-6 py-4 font-mono text-sm font-medium tracking-caps uppercase transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50 [&_svg]:size-4 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-0.5 hover:[&_svg]:scale-110"
        lines={
          selectedVariant
            ? [{ merchandiseId: selectedVariant.id, quantity: 1, selectedVariant }]
            : []
        }
      >
        {selectedVariant?.availableForSale ? (
          <>
            Add to cart
            <ChevronRight />
          </>
        ) : (
          'Sold out'
        )}
      </AddToCartButton>
    </div>
  );
};
