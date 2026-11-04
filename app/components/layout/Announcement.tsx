import { BRAND } from '~/content/brand';

/**
 * Thin promo bar above the header. It scrolls away with the page (the sticky
 * topbar wrapper in PageLayout is offset by its height, so only the header
 * pins). Spec-strip type: JetBrains Mono caps at +0.1em.
 */
export const Announcement = () => (
  <div className="bg-announcement text-announcement-text flex h-(--announcement-h) items-center justify-center">
    <span className="tracking-spec font-mono text-xs uppercase">{BRAND.announcement.message}</span>
  </div>
);
