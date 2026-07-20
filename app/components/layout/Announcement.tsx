import { BRAND } from '~/lib/brand';

/**
 * Thin promo bar above the header. It scrolls away with the page (the sticky
 * topbar wrapper in PageLayout is offset by its height, so only the header
 * pins — matching live). The message scrolls as an infinite marquee: it's
 * repeated to fill the bar and the track is duplicated so a -50% translate
 * loops seamlessly. Respects reduced-motion (the animation is disabled,
 * leaving the message static).
 */
export const Announcement = () => {
  const { message } = BRAND.announcement;
  // One "set" of repeats wide enough to fill the bar; rendered twice in the track.
  // Spec-strip type (7PA-242): JetBrains Mono caps at +0.1em — the brand's
  // signature utility device.
  const set = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="tracking-spec px-8 font-mono text-[10px] uppercase whitespace-nowrap">
      {message}
    </span>
  ));

  return (
    <div className="bg-announcement text-announcement-text flex h-(--announcement-h) items-center overflow-hidden">
      <div
        className="flex w-max animate-marquee items-center motion-reduce:animate-none"
        aria-hidden
      >
        {set}
        {set}
      </div>
      <span className="sr-only">{message}</span>
    </div>
  );
};
