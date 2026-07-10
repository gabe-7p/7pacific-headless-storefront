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
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => open('cart')}
        className="bg-brand text-brand-text min-h-[58px] w-full px-6 py-4 text-base font-medium tracking-[0.03em] uppercase transition-opacity hover:opacity-90 disabled:opacity-50 min-[769px]:bg-neutral-900 min-[769px]:text-white"
        lines={
          selectedVariant
            ? [{ merchandiseId: selectedVariant.id, quantity: 1, selectedVariant }]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart //' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
};
