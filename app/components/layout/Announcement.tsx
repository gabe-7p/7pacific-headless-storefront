import { BRAND } from '~/lib/brand';

/**
 * Thin promo bar fixed to the top of the viewport, above the header. The message
 * scrolls as an infinite marquee (matching live): it's repeated to fill the bar
 * and the track is duplicated so a -50% translate loops seamlessly. Respects
 * reduced-motion (the animation is disabled, leaving the message static).
 */
export const Announcement = () => {
  const { message } = BRAND.announcement;
  // One "set" of repeats wide enough to fill the bar; rendered twice in the track.
  const set = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="px-8 text-xs font-normal tracking-wide whitespace-nowrap">
      {message}
    </span>
  ));

  return (
    <div className="bg-announcement text-announcement-text fixed inset-x-0 top-0 z-50 flex h-(--announcement-h) items-center overflow-hidden">
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
