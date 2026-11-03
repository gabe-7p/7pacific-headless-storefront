import { canAddToCart } from '@shopify/hydrogen';

import { useCartDrawer } from '~/components/cart/CartDrawer';
import { CtaLabel } from '~/components/common/Cta';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/cn';
import type { ProductData } from '~/lib/product/queries';
import { useProductForm } from '~/lib/product/store';

/**
 * The PDP add-to-cart bar (also rendered in the mobile sticky bar). The
 * `product_added_to_cart` analytics event comes from the cart's own tracking,
 * not from this click.
 */
export const AddToCartBar = ({ product }: { product: ProductData }) => {
  const { options, selectedVariant, register, formProps, pending } = useProductForm();
  const { open: openCart } = useCartDrawer();
  const addable = canAddToCart(product, options);

  return (
    // The base layer caps every `form` at 400px from md up; the bar has to span
    // its card (and the full viewport when sticky), so opt this one out.
    <div className="[&>form]:max-w-none">
      <form {...formProps({ afterSubmit: openCart })}>
        <input type="hidden" {...register('merchandiseId', {})} />
        <input type="hidden" {...register('quantity', { value: 1 })} />
        {/* The PDP's one Ember moment. Can't render through <Cta> (it's the
            product form's submit): see ui-components.md. */}
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
