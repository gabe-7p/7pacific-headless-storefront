/**
 * Store links that point at Shopify resources. THE single place
 * product/collection handles may appear in app code — when a handle changes in
 * Shopify, update it here and every CTA follows. (Nav/footer links come from
 * Shopify menus; these are the marketing-CTA targets baked into page content.)
 */
export const STORE_LINKS = {
  /** The shop-all collection — hero CTA, cart "Continue shopping". */
  shopAll: '/collections/summer-25',
  shopShirts: '/products/tracefiber-performance-tech-tee-mountain-mist',
  shopShorts: '/products/airrail-6-performance-shorts-mountain-mist',
} as const;

/**
 * Manual Shopify collection whose product order drives the homepage
 * "Our First Drop" grid — reorder it in the Shopify admin to reorder the
 * homepage. Not linked in any navigation.
 */
export const HOMEPAGE_COLLECTION_HANDLE = 'homepage-first-drop';
