import { canAddToCart } from '@shopify/hydrogen';

import { CtaLabel } from '~/components/common/Cta';
import { useAside } from '~/components/layout/Aside';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/cn';
import type { ProductData } from '~/lib/product/queries';
import { useProductForm } from '~/lib/product/store';

/**
 * The PDP add-to-cart bar — rendered flush at the bottom edge of the buy card,
 * spanning its full width (and again in the mobile sticky bar). The form is
 * the product-form store's: it posts the selected variant to `/api/cart`
 * through the cart store (optimistic line at once) and opens the drawer once
 * the cart has handled it. The `product_added_to_cart` analytics event comes
 * from the cart's own tracking, not from this click.
 */
export const AddToCartBar = ({ product }: { product: ProductData }) => {
  const { options, selectedVariant, register, formProps, pending } = useProductForm();
  const { open } = useAside();
  const addable = canAddToCart(product, options);

  return (
    // The base layer caps every `form` at 400px from md up; the bar has to span
    // its card (and the full viewport when sticky), so opt this one out.
    <div className="[&>form]:max-w-none">
      <form {...formProps({ afterSubmit: () => open('cart') })}>
        <input type="hidden" {...register('merchandiseId', {})} />
        <input type="hidden" {...register('quantity', { value: 1 })} />
        {/* The PDP's one Ember moment (7PA-230) — the `brand` CTA device
            (mono caps, arrow-slide label via CtaLabel, pointer cursor) shared via
            buttonVariants; only the bar's dimensions are local. This is the one
            CTA that can't render through <Cta> (it's the product form's submit). */}
        <button
          {...register('addToCart', {})}
          disabled={!addable || pending}
          className={cn(
            buttonVariants({ variant: 'brand' }),
            'h-auto min-h-[58px] w-full px-6 py-4'
          )}
        >
          {addable ? (
            <CtaLabel>Add to cart</CtaLabel>
          ) : selectedVariant ? (
            'Sold out'
          ) : (
            'Select a size'
          )}
        </button>
      </form>
    </div>
  );
};
