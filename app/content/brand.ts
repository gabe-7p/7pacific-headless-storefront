/**
 * Brand content — the single source of truth for site-wide text and links
 * (header logo, announcement, footer, social). English-only.
 * See CLAUDE.md › Brand single-sources for where everything else lives.
 */

import { STORE_LINKS } from '~/content/links';
import { instagramProfileUrl, pageUrl } from '~/lib/urls';

/** Free shipping starts here (USD) — the announcement and the default meta description both quote it. */
const FREE_SHIPPING_THRESHOLD = 150;

type SocialPlatform = 'Instagram';
type SocialLink = { platform: SocialPlatform; handle: string; href: string };

const instagram = (handle: string): SocialLink => ({
  platform: 'Instagram',
  handle,
  href: instagramProfileUrl(handle),
});
type NavLink = { title: string; url: string };

export const BRAND = {
  /** Legal/display name (also the Storefront shop.name). */
  name: '7Pacific',

  /** The canonical production origin (canonical links, absolute og:image URLs). */
  siteUrl: 'https://7pacificapparel.com',

  /** Where the product is designed — the homepage eyebrow and every signing page footer. */
  provenance: 'Designed in San Francisco',

  shipping: { threshold: FREE_SHIPPING_THRESHOLD },

  /**
   * Announcement spec strip: mono caps. The one shipping fact, nothing else.
   */
  announcement: {
    message: `FREE SHIPPING ON ORDERS $${FREE_SHIPPING_THRESHOLD}+`,
  },

  /** Fallback meta description for any page without its own (see lib/seo.ts). */
  seo: {
    defaultDescription: `Lightweight, breathable training gear built for performance. Free shipping on orders over $${FREE_SHIPPING_THRESHOLD}.`,
  },

  footer: {
    /** The footer's link column (the Storefront `footer` menu) title. */
    supportTitle: 'Support',
    poweredBy: 'Powered by Shopify',
  },

  social: [instagram('7_pacific')] satisfies Array<SocialLink>,

  /** Fallback footer links, used only if the Storefront `footer` menu is empty. */
  footerLinks: [
    { title: 'Terms of Service', url: pageUrl('terms-of-service') },
    { title: 'Contact Us', url: STORE_LINKS.contact },
    { title: 'Returns', url: pageUrl('returns') },
  ] satisfies Array<NavLink>,

  /**
   * Fallback header nav, used only if the Storefront `main-menu` is empty —
   * mirrors the locked nav (7PA-235); Contact lives in the footer only.
   * No Account entry: there is no local /account route (guest checkout), and
   * the header's log-in glyph already points at Shopify's hosted portal.
   */
  headerLinks: [
    { title: 'Shop', url: STORE_LINKS.firstLightCollection },
    { title: 'Journal', url: STORE_LINKS.journal },
    { title: 'About', url: STORE_LINKS.ourStory },
  ] satisfies Array<NavLink>,
} as const;
