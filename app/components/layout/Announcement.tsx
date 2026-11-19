import { SpecLine } from '~/components/common/SpecLine';
import { BRAND } from '~/content/brand';

/**
 * Thin promo bar above the header, on every page. It pins with the header (both
 * sit in PageLayout's sticky topbar); the athlete signing pages, which skip the
 * site chrome, render it above their own bar. Spec-strip type: JetBrains Mono
 * caps at +0.1em.
 */
export const Announcement = () => (
  <div className="bg-announcement text-announcement-text flex h-(--announcement-h) items-center justify-center">
    <SpecLine as="span">{BRAND.announcement.message}</SpecLine>
  </div>
);
