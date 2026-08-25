import { domAnimation, LazyMotion, m, MotionConfig } from 'motion/react';
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

/** Easing pulled to one place; same curve as the CSS `--ease-brand` token. */
const EASE_BRAND = [0.165, 0.84, 0.44, 1] as const;

/**
 * reducedMotion="user" is what actually makes the primitives' "respects
 * reduced-motion" promise true — Motion's default is to ignore the OS
 * setting; with it, transform tweens are dropped for those users while
 * opacity fades still run, so nothing arrives with movement.
 */
export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
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
 *
 * `amount: 'some'` (any part visible), NOT a fraction: these wrap whole page
 * sections, and a fraction is measured against the element's own height — a
 * 2000px section with `amount: 0.3` stays invisible until you've scrolled 600px
 * into it, which reads as the section failing to load.
 */
export const FadeIn = ({ children, delay = 0, className }: FadeInProps) => (
  <m.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 'some' }}
    transition={{ duration: 0.6, delay, ease: EASE_BRAND }}
  >
    {children}
  </m.div>
);

type SettleInProps = {
  children: ReactNode;
  /** Seconds to delay the settle. */
  delay?: number;
  className?: string;
};

/**
 * Fade + slow scale-settle for photography: starts a touch large (1.04) and
 * eases to rest over 1.2s on the brand curve — one slow exhale, then
 * stillness (the 404's Lands End photograph). Fires on mount and ends at
 * rest by design: no loops. The scale overshoots the element's box, so give
 * the parent `overflow-hidden` when the bleed would touch a neighbor. Must
 * render inside a `<MotionProvider>`.
 */
export const SettleIn = ({ children, delay = 0, className }: SettleInProps) => (
  <m.div
    className={className}
    initial={{ opacity: 0, scale: 1.04 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, delay, ease: EASE_BRAND }}
  >
    {children}
  </m.div>
);
