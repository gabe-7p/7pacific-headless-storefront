import { ChevronRight } from 'lucide-react';
import type { ProductFragment } from 'storefrontapi.generated';

import { AddToCartButton } from '~/components/cart/AddToCartButton';
import { useAside } from '~/components/layout/Aside';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/cn';

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
      {/* The PDP's one Ember moment (7PA-230) — the `brand` CTA device
          (mono caps, trailing chevron, pointer cursor) shared via
          buttonVariants; only the bar's dimensions are local. This is the one
          CTA that can't render through <Cta> (it's a CartForm submit). */}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => open('cart')}
        className={cn(buttonVariants({ variant: 'brand' }), 'h-auto min-h-[58px] w-full px-6 py-4')}
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
