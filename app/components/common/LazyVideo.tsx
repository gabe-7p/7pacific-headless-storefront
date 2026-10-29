import { useEffect, useRef } from 'react';

type LazyVideoProps = {
  src: string;
  /** Shown until the clip scrolls near (Shopify's first-frame thumbnail). */
  poster?: string;
  label?: string;
  className?: string;
};

/**
 * Below-the-fold background loop: renders poster-only, then attaches `src`
 * and plays once within half a viewport of the fold, so clips don't all
 * download at once. Above the fold use a plain `<video autoPlay>` — it must
 * start before hydration.
 */
export const LazyVideo = ({ src, poster, label, className }: LazyVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.src = src;
        // Rejects if autoplay is blocked; the poster stays up.
        el.play().catch(() => undefined);
        observer.disconnect();
      },
      { rootMargin: '50% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
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
