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
   * Announcement spec strip (7PA-242) — mono caps, middle-dot separators
   * (never slash/pipe). Keeps the true shipping fact, framed as spec data
   * inside the edition-number system (7PA-246).
   */
  announcement: {
    message: "ED. 01 · SUMMER '25 · LIVE NOW · FREE SHIPPING OVER $200",
    href: '',
  },

  /** Base URL for brand assets uploaded to Shopify Files (one source; content files build URLs from it). */
  filesCdn: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files',

  social: [
    { platform: 'Instagram', href: 'https://www.instagram.com/7_pacific/' },
  ] satisfies Array<SocialLink>,

  /**
   * Newsletter copy (7PA-241) — acquisition through community, not price:
   * no discount language, ever. One signup per page (the footer); the old
   * site-wide popup is gone.
   */
  newsletter: {
    heading: 'The Early One',
    body: 'Drop dates, training days, the occasional film. First word when editions go live. No discounts — we don’t run sales.',
    placeholder: 'Enter your email',
    submitLabel: 'Sign up',
    successMessage: 'You’re in. See you out there.',
  },

  /** Fallback footer links, used only if the Storefront `footer` menu is empty. */
  footerLinks: [
    { title: 'Terms of Service', url: '/pages/terms-of-service' },
    { title: 'Contact Us', url: '/pages/contact-us' },
    { title: 'Returns', url: '/pages/returns' },
  ] satisfies Array<NavLink>,

  /**
   * Fallback header nav, used only if the Storefront `main-menu` is empty.
   * Mirrors the locked nav (7PA-235): Shop · Drops · Journal · About ·
   * Account — Drops and Journal join once their routes exist (7PA-247/248);
   * never ship a dead link. Contact lives in the footer only.
   */
  headerLinks: [
    { title: 'Shop', url: STORE_LINKS.shopAll },
    { title: 'About', url: '/pages/our-story' },
    { title: 'Account', url: '/account' },
  ] satisfies Array<NavLink>,
} as const;
