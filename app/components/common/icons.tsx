/**
 * Header/drawer glyphs traced from the live theme's icon sprite (all on a
 * 64x64 viewBox). lucide's equivalents have a visibly different weight and
 * shape, so these are inlined rather than approximated.
 */
const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

type IconProps = { className?: string };

export const HamburgerIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <path d="M7 15h51M7 32h43M7 49h51" {...STROKE} />
  </svg>
);

export const UserIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <path
      d="M35 39.84v-2.53c3.3-1.91 6-6.66 6-11.41 0-7.63 0-13.82-9-13.82s-9 6.19-9 13.82c0 4.75 2.7 9.51 6 11.41v2.53c-10.18.85-18 6-18 12.16h42c0-6.19-7.82-11.31-18-12.16Z"
      fill="currentColor"
    />
  </svg>
);

export const BagIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <g fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M25 26c0-15.79 3.57-20 8-20s8 4.21 8 20" />
      <path d="M14.74 18h36.51l3.59 36.73h-43.7z" />
    </g>
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <path d="m19 17.61 27.12 27.13m0-27.12L19 44.74" {...STROKE} />
  </svg>
);
