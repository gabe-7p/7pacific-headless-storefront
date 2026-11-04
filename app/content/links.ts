import { collectionUrl, dropUrl, journalUrl, pageUrl, productUrl } from '~/lib/urls';

/**
 * THE single place a Shopify handle may appear in app code — when a handle
 * changes in Shopify, update it here and every query and CTA follows.
 */
export const HANDLES = {
  /** The shop-all collection (titled BASELINE) — hero CTA, cart "Continue
      shopping", and the one collection page that opens on the BASELINE masthead. */
  shopAllCollection: 'baseline',
  /**
   * Manual collection whose product order drives the homepage BASELINE grid —
   * reorder it in the Shopify admin to reorder the homepage. Not linked in
   * any navigation.
   */
  homepageCollection: 'homepage-first-drop',
  /** The one blog the journal publishes (index, article and sitemap). */
  journalBlog: 'journal',
  /** The Shopify navigation menus the root loader reads for the chrome. */
  headerMenu: 'main-menu',
  footerMenu: 'footer',
  /** The Shopify page whose body renders above the contact form. */
  contactPage: 'contact-us',
} as const;

export const STORE_LINKS = {
  /** The shop-all collection (titled BASELINE) — hero CTA, cart "Continue shopping". */
  shopAll: collectionUrl(HANDLES.shopAllCollection),
  /** Core Values card CTAs ("Shop tees" / "Shop shorts"). */
  shopShirts: productUrl('tracefiber-performance-tech-tee-mountain-mist'),
  shopShorts: productUrl('airrail-6-performance-shorts-mountain-mist'),
  /** Homepage Name/Spec banner cells — one per live product family: */
  shopShortsMidnight: productUrl('airrail-6-performance-shorts-midnight'),
  shopShirtsMidnight: productUrl('tracefiber-performance-tech-tee-midnight'),
  shopHat: productUrl('motionframe-running-hat-white'),
  /** Drop 02 teaser card target — the FW26 FIRST LIGHT teaser page. Point it
      at the /collections/first-light collection once the drop is live. */
  firstLight: dropUrl('first-light'),
  /** Homepage BASELINE intro card target — the Baseline editorial drop page. */
  baselineDrop: dropUrl('baseline'),
  /** The journal index (fallback nav). */
  journal: journalUrl(),
  /** Our Story — the homepage "Read the story" CTAs and the fallback nav's About. */
  ourStory: pageUrl('our-story'),
  /** The contact page (fallback footer nav). */
  contact: pageUrl(HANDLES.contactPage),
} as const;

/**
 * Display prices for the products the marketing surfaces name, keyed by the
 * `STORE_LINKS` entry that targets them (every color of a family shares one
 * price). Hand-typed copy that mirrors the live Shopify products (2026-08-25)
 * — update here if pricing changes; the PDP and cart read Shopify directly.
 */
export const PRODUCT_PRICES = {
  shopShirts: '$72',
  shopShirtsMidnight: '$72',
  shopShorts: '$79',
  shopShortsMidnight: '$79',
  shopHat: '$42',
} as const satisfies Partial<Record<keyof typeof STORE_LINKS, string>>;

/**
 * Content files mark membership CTAs with this href instead of a real path;
 * `common/Cta` turns it into a button that opens the `JoinDialog` on the
 * newsletter list (copy in content/join.ts).
 */
export const NEWSLETTER_HREF = '#newsletter';
