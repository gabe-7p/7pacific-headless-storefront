/**
 * Brand content — the single source of truth for site-wide text and links
 * (header logo, announcement, footer, social). English-only.
 * See CLAUDE.md › Brand single-sources for where everything else lives.
 */

import { STORE_LINKS } from '~/content/links';
import { pageUrl } from '~/lib/urls';

type SocialPlatform = 'Instagram';
type SocialLink = { platform: SocialPlatform; href: string };
type NavLink = { title: string; url: string };

export const BRAND = {
  /** Legal/display name (also the Storefront shop.name). */
  name: '7Pacific',

  /**
   * Announcement spec strip: mono caps. The one shipping fact, nothing else.
   */
  announcement: {
    message: 'FREE SHIPPING ON ORDERS $200+',
  },

  social: [
    { platform: 'Instagram', href: 'https://www.instagram.com/7_pacific/' },
  ] satisfies Array<SocialLink>,

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
    { title: 'Shop', url: STORE_LINKS.shopAll },
    { title: 'Journal', url: STORE_LINKS.journal },
    { title: 'About', url: STORE_LINKS.ourStory },
  ] satisfies Array<NavLink>,
} as const;
