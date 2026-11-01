/**
 * PostHog commerce events — names and payload builders in one place, so every
 * capture site sends the same fields and a dashboard never has to reconcile
 * two shapes of the same event.
 */
export const ANALYTICS_EVENT = {
  productViewed: 'product_viewed',
  productAddedToCart: 'product_added_to_cart',
  checkoutStarted: 'checkout_started',
} as const;

type Money = { amount?: string | null; currencyCode?: string | null };

export const productViewedProperties = ({
  product,
  variant,
}: {
  product: { id: string; handle: string };
  variant: { id: string; price: Money; availableForSale: boolean };
}) => ({
  product_id: product.id,
  product_handle: product.handle,
  variant_id: variant.id,
  price: variant.price.amount,
  currency: variant.price.currencyCode,
  available_for_sale: variant.availableForSale,
});

export const productAddedToCartProperties = (
  variant: { id: string; title: string; price: Money; product: { handle: string } },
  quantity = 1
) => ({
  product_handle: variant.product.handle,
  variant_id: variant.id,
  variant_title: variant.title,
  quantity,
  price: variant.price.amount,
  currency: variant.price.currencyCode,
});

export const checkoutStartedProperties = (
  cart: { totalQuantity?: number | null; cost?: { subtotalAmount?: Money | null } | null },
  layout: string
) => ({
  cart_layout: layout,
  total_quantity: cart.totalQuantity,
  subtotal: cart.cost?.subtotalAmount?.amount,
  currency: cart.cost?.subtotalAmount?.currencyCode,
});
