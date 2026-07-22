import { ChevronRight } from 'lucide-react';
import { Fragment, useEffect, useRef } from 'react';

import { HOME_MARQUEE } from '~/content/home';

/** Pixels of row shift per pixel of page scroll. */
const SCROLL_GAIN = 0.3;
/** Per-frame decay of the shift back toward the pure drift. */
const DECAY = 0.92;
/** Clamp — must stay well under one set width so no track edge shows. */
const MAX_SHIFT = 240;

/**
 * The values strip under the hero (7PA-300): a slow constant marquee drift
 * with a scroll-direction-reactive layer on top — scrolling down nudges the
 * row left, scrolling up nudges it right, then it settles back to the pure
 * drift. The two motions live on nested elements so they compose as plain
 * transforms: the outer wrapper carries the scroll shift via a CSS custom
 * property written imperatively in rAF (no React re-renders, transform-only,
 * no layout work); the inner track runs the infinite keyframe animation
 * (`--animate-marquee-slow`) over three copies of the set, so the shift can
 * never expose an edge.
 *
 * Reduced motion: the drift stops via `motion-reduce:animate-none` and the
 * scroll listener is never attached.
 */
export const ValuesMarquee = () => {
  const shiftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = shiftRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let shift = 0;
    let lastY = window.scrollY;
    let frame = 0;

    const settle = () => {
      shift *= DECAY;
      if (Math.abs(shift) < 0.1) {
        shift = 0;
        frame = 0;
      } else {
        frame = requestAnimationFrame(settle);
      }
      el.style.setProperty('--marquee-shift', `${shift}px`);
    };

    const onScroll = () => {
      const y = window.scrollY;
      shift = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, shift - (y - lastY) * SCROLL_GAIN));
      lastY = y;
      if (!frame) frame = requestAnimationFrame(settle);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Three copies of the set; keys carry the copy index so lines can repeat.
  const track = [0, 1, 2].flatMap((copy) =>
    HOME_MARQUEE.items.map((item) => (
      <Fragment key={`${copy}-${item}`}>
        <span className="tracking-spec px-6 font-mono text-sm uppercase whitespace-nowrap">
          {item}
        </span>
        <ChevronRight className="text-fog size-3 shrink-0" />
      </Fragment>
    ))
  );

  return (
    <section className="bg-carbon text-chalk flex h-14 items-center overflow-hidden">
      <div
        ref={shiftRef}
        className="flex w-max [transform:translateX(var(--marquee-shift,0px))] will-change-transform"
      >
        <div
          className="animate-marquee-slow flex w-max items-center motion-reduce:animate-none"
          aria-hidden
        >
          {track}
        </div>
      </div>
      <p className="sr-only">{HOME_MARQUEE.items.join(' · ')}</p>
    </section>
  );
};
