/**
 * Brand content & config — the single source of truth for site-wide text and
 * links (ported from the live store, verified against the live DOM). Change it
 * here and it applies everywhere it's consumed (header logo, announcement,
 * footer, newsletter, social). English-only per our scope.
 *
 * Visual design tokens (colors, fonts, layout sizes) live in
 * app/styles/tailwind.css; this file is for content/data.
 */

import { STORE_LINKS } from '~/content/links';

type SocialPlatform = 'Instagram';
export type SocialLink = { platform: SocialPlatform; href: string };
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

  /**
   * Signup copy (7PA-241) — acquisition through community, not price: no
   * discount language, ever. One set of lines shared by the footer signup and
   * the click-triggered "Join the roster" dialog (Gabe 2026-10-08), so the
   * dialog continues the CTA that opened it. Homepage v2 (Oct 2026): the
   * membership is the roster.
   */
  newsletter: {
    heading: 'Join the roster',
    body: 'We’re creating a community where competition and connection go hand in hand, bringing athletes together through training sessions, challenges, and experiences beyond the gym. Leave your email and we add your name to the book.',
    placeholder: 'your@email.com',
    submitLabel: 'Add my name',
    successMessage: 'You’re in the book. See you at the next session.',
  },

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
