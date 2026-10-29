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
 * within half a viewport of the fold (so it buffers before it's needed), and
 * plays only while it's actually on screen — paused again off screen. Above
 * the fold use a plain `<video autoPlay>`; it must start before hydration.
 */
export const LazyVideo = ({ src, poster, label, className }: LazyVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.src = src;
        loader.disconnect();
      },
      { rootMargin: '50% 0px' }
    );

    const player = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
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
