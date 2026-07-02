import { domAnimation, LazyMotion, m } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Brand motion primitives. Single-sources our animation vocabulary the same way
 * `tailwind.css @theme` single-sources color — tweak the variants here and every
 * consumer follows.
 *
 * Bundle discipline: we import `m` (not `motion`) under a strict `LazyMotion`
 * provider, so only the `domAnimation` feature set ships — ~5–15kb instead of the
 * full ~34kb. `strict` makes any stray `motion.*` usage throw, keeping us honest.
 * Wrap the app (or a subtree that animates) once in `<MotionProvider>`.
 */

/** Easing + duration pulled to one place; mirrors the `--ease-brand` intent. */
const EASE_BRAND = [0.22, 1, 0.36, 1] as const;

export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
);

type FadeInProps = {
  children: ReactNode;
  /** Seconds to delay the reveal — stagger siblings by passing 0, 0.1, 0.2… */
  delay?: number;
  className?: string;
};

/**
 * Fade + rise reveal that fires once when the element scrolls into view.
 * Respects reduced-motion (Motion disables transform/opacity tweens automatically
 * when the user requests it). Must render inside a `<MotionProvider>`.
 */
export const FadeIn = ({ children, delay = 0, className }: FadeInProps) => (
  <m.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay, ease: EASE_BRAND }}
  >
    {children}
  </m.div>
);
