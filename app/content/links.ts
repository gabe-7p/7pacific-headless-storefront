/**
 * Store links that point at Shopify resources. THE single place
 * product/collection handles may appear in app code — when a handle changes in
 * Shopify, update it here and every CTA follows. (Nav/footer links come from
 * Shopify menus; these are the marketing-CTA targets baked into page content.)
 */
export const STORE_LINKS = {
  /** The shop-all collection (titled BASELINE) — hero CTA, cart "Continue shopping". */
  shopAll: '/collections/baseline',
  /** Core Values card CTAs ("Shop tees" / "Shop shorts"). */
  shopShirts: '/products/tracefiber-performance-tech-tee-mountain-mist',
  shopShorts: '/products/airrail-6-performance-shorts-mountain-mist',
  /** Homepage hero CTA target. */
  shopShortsMint: '/products/airrail-6-performance-shorts-mint',
  /** Homepage Name/Spec banner cells — one per live product family: */
  shopShortsMidnight: '/products/airrail-6-performance-shorts-midnight',
  shopShirtsMidnight: '/products/tracefiber-performance-tech-tee-midnight',
  shopHat: '/products/motionframe-running-hat-white',
  /** Drop 02 teaser card target — the FW26 FIRST LIGHT teaser page. Point it
      at the /collections/first-light collection once the drop is live. */
  firstLight: '/drops/first-light',
  /** Homepage BASELINE intro card target — the Baseline editorial drop page. */
  baselineDrop: '/drops/baseline',
} as const;

/**
 * Manual Shopify collection whose product order drives the homepage
 * homepage BASELINE grid — reorder it in the Shopify admin to reorder the
 * homepage. Not linked in any navigation.
 */
export const HOMEPAGE_COLLECTION_HANDLE = 'homepage-first-drop';
