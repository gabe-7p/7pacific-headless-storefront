import { BRAND } from '~/lib/brand';

/**
 * Thin promo bar above the header. It scrolls away with the page (the sticky
 * topbar wrapper in PageLayout is offset by its height, so only the header
 * pins — matching live). Static since Gabe 2026-07-24 (was an infinite
 * marquee): the message renders once, centered. Spec-strip type (7PA-242):
 * JetBrains Mono caps at +0.1em — the brand's signature utility device.
 */
export const Announcement = () => (
  <div className="bg-announcement text-announcement-text flex h-(--announcement-h) items-center justify-center">
    <span className="tracking-spec font-mono text-xs uppercase">{BRAND.announcement.message}</span>
  </div>
);
