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
    <AddToCartButton
      disabled={!selectedVariant || !selectedVariant.availableForSale}
      onClick={() => open('cart')}
      className="bg-brand text-brand-text w-full px-6 py-4 text-sm font-bold tracking-[0.15em] uppercase transition-opacity hover:opacity-90 disabled:opacity-50 lg:bg-neutral-900 lg:text-white"
      lines={
        selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1, selectedVariant }] : []
      }
    >
      {selectedVariant?.availableForSale ? 'Add to cart //' : 'Sold out'}
    </AddToCartButton>
  );
};
