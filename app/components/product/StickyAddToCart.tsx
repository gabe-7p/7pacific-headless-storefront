import { useEffect, useRef, useState } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';

import { AddToCartBar } from '~/components/product/AddToCartBar';
import { cn } from '~/lib/cn';

/**
 * Mobile/tablet sticky add-to-cart bar (7PA-166). The in-card bar can't pin via
 * CSS `sticky` (it's the flush last child, so there's no travel room), so a
 * fixed orange bar slides up once the buy card scrolls out of view and hides
 * again when it returns. Desktop keeps the static in-card bar (`lg:hidden`).
 */
export const StickyAddToCart = ({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    // Pin the bar once the buy section's end has scrolled above the viewport.
    // A scroll listener (vs IntersectionObserver) reliably handles fast jumps.
    const update = () => {
      const sentinel = sentinelRef.current;
      if (sentinel) setPinned(sentinel.getBoundingClientRect().top < 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-0" />
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:hidden',
          pinned ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <AddToCartBar selectedVariant={selectedVariant} />
      </div>
    </>
  );
};
