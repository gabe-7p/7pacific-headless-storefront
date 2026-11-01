/**
 * Brand content & config — the single source of truth for site-wide text and
 * links (ported from the live store, verified against the live DOM). Change it
 * here and it applies everywhere it's consumed (header logo, announcement,
 * footer, social). English-only per our scope.
 *
 * Visual design tokens (colors, fonts, layout sizes) live in
 * app/styles/tailwind.css; this file is for content/data. Signup copy (the
 * roster + the drop waitlist) lives in app/content/join.ts.
 */

import { STORE_LINKS } from '~/content/links';

type SocialPlatform = 'Instagram';
type SocialLink = { platform: SocialPlatform; href: string };
export type NavLink = { title: string; url: string };

export const BRAND = {
  /** Legal/display name (also the Storefront shop.name). */
  name: '7Pacific',
  /** Logotype shown in the header/footer. */
  wordmark: 'Pacific',

  /**
   * Announcement spec strip (7PA-242): mono caps. The one shipping fact,
   * nothing else (per Gabe, 2026-07-19).
   */
  announcement: {
    message: 'FREE SHIPPING ON ORDERS $200+',
    href: '',
  },

  /** Base URL for Shopify Files assets — only lib/shopifyFiles.ts reads it. */
  filesCdn: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files',

  social: [
    { platform: 'Instagram', href: 'https://www.instagram.com/7_pacific/' },
  ] satisfies Array<SocialLink>,

  /** Fallback footer links, used only if the Storefront `footer` menu is empty. */
  footerLinks: [
    { title: 'Terms of Service', url: '/pages/terms-of-service' },
    { title: 'Contact Us', url: '/pages/contact-us' },
    { title: 'Returns', url: '/pages/returns' },
  ] satisfies Array<NavLink>,

  /**
   * Fallback header nav, used only if the Storefront `main-menu` is empty —
   * mirrors the locked nav (7PA-235); Contact lives in the footer only.
   * NB: `/account` has no local route (guest checkout) — the live menu's
   * entry points at Shopify's hosted portal, so this fallback link only
   * matters in the degraded no-menu case.
   */
  headerLinks: [
    { title: 'Shop', url: STORE_LINKS.shopAll },
    { title: 'Journal', url: '/journal' },
    { title: 'About', url: '/pages/our-story' },
    { title: 'Account', url: '/account' },
  ] satisfies Array<NavLink>,
} as const;
