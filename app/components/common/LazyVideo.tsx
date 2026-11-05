import { useEffect, useRef } from 'react';

type LazyVideoProps = {
  src: string;
  /** Shown until the clip scrolls near (Shopify's first-frame thumbnail). */
  poster?: string;
  label?: string;
  className?: string;
};

/**
 * Below-the-fold background loop: renders poster-only, attaches `src` once
 * within half a viewport of the fold, and plays only while it's actually on
 * screen — paused again off screen. `preload="none"` means the file is first
 * requested at that first play, not when `src` lands. Above the fold use a
 * plain `<video autoPlay>`; it must start before hydration.
 */
export const LazyVideo = ({ src, poster, label, className }: LazyVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Both observers fire in one frame for a clip that starts in view, in no
    // guaranteed order, and setting `src` aborts a pending play(). So either
    // may attach it, and the player always does so before playing.
    const attach = () => {
      if (el.getAttribute('src') !== src) el.src = src;
    };

    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        attach();
        loader.disconnect();
      },
      { rootMargin: '50% 0px' }
    );

    const player = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        attach();
        // Rejects if autoplay is blocked; the poster stays up.
        el.play().catch(() => undefined);
      } else {
        el.pause();
      }
    });

    loader.observe(el);
    player.observe(el);
    return () => {
      loader.disconnect();
      player.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      aria-label={label}
      preload="none"
      loop
      muted
      playsInline
      className={className}
    />
  );
};
