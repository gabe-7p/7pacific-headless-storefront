import { BRAND } from '~/lib/brand';

/**
 * Thin promo bar fixed to the very top of the viewport, above the header.
 * Message comes from BRAND.announcement; height is the shared --announcement-h
 * constant (the header offsets itself by the same amount).
 */
export const Announcement = () => {
  const { message, href } = BRAND.announcement;
  const content = (
    <span className="text-[10px] font-semibold tracking-[0.18em] uppercase md:text-[11px]">
      {message}
    </span>
  );

  return (
    <div className="bg-announcement text-announcement-text fixed inset-x-0 top-0 z-50 flex h-(--announcement-h) items-center justify-center px-4 text-center">
      {href ? (
        <a href={href} className="transition-opacity hover:opacity-80">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};
