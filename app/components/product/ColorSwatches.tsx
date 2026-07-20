import { Link } from 'react-router';

import { cn } from '~/lib/cn';
import type { ColorSwatch } from '~/lib/colors';

/**
 * Per-index stagger for the card-hover cascade — matches the live theme's
 * nth-child animation-delays exactly. Static literals so Tailwind sees them;
 * `!` (important) so the delay survives the `animate-cascade-in` shorthand,
 * which would otherwise reset animation-delay to 0s.
 */
const CASCADE_DELAYS = [
  '[animation-delay:0s]!',
  '[animation-delay:0.1s]!',
  '[animation-delay:0.15s]!',
  '[animation-delay:0.2s]!',
  '[animation-delay:0.3s]!',
  '[animation-delay:0.4s]!',
] as const;

type ColorSwatchesProps = {
  /** The product's color family (from `getColorSwatches`), in display order. */
  swatches: Array<ColorSwatch>;
  /** Handle of the product being viewed — its swatch gets the active ring. */
  currentHandle: string;
  size?: 'sm' | 'lg';
  /**
   * Render even when the product has a single color. On grids we hide the row
   * for single-color products; on the PDP the COLOR row always shows (a lone
   * swatch with the active ring), matching live.
   */
  alwaysRender?: boolean;
  /**
   * Card-hover mode (product grids): swatches animate in one-by-one
   * left-to-right while the parent `group` is hovered, styled like the live
   * card swatches (24px, white border, black outline when active) with a
   * color-name tooltip pill above each. The PDP row leaves this off.
   */
  cascade?: boolean;
  className?: string;
};

/**
 * One swatch per color in the product's family, each linking to the sibling
 * color product (separate-product-per-color model). The current color is
 * highlighted.
 */
export const ColorSwatches = ({
  swatches,
  currentHandle,
  size = 'sm',
  alwaysRender = false,
  cascade = false,
  className,
}: ColorSwatchesProps) => {
  if (swatches.length < (alwaysRender ? 1 : 2)) return null;

  // `lg` is the PDP's selection cluster; `sm` the card overlay.
  const dimension = size === 'lg' ? 'size-5' : 'size-4';

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', cascade && 'gap-1.5', className)}>
      {swatches.map((swatch, index) => {
        const isActive = swatch.handle === currentHandle;
        return (
          <li
            key={swatch.handle}
            className={cn(
              cascade && 'group/swatch relative opacity-0 group-hover:animate-cascade-in',
              cascade && CASCADE_DELAYS[Math.min(index, CASCADE_DELAYS.length - 1)]
            )}
          >
            {cascade && (
              // Color-name pill above the swatch (live's .color-swatch-tooltip).
              <span
                className="bg-concrete after:border-t-concrete pointer-events-none invisible absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-[2px] px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover/swatch:visible group-hover/swatch:opacity-100 after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:content-['']"
                aria-hidden
              >
                {swatch.name}
              </span>
            )}
            <Link
              to={`/products/${swatch.handle}`}
              prefetch="intent"
              title={cascade ? undefined : swatch.name}
              aria-label={swatch.name}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'block rounded-full',
                cascade
                  ? // Live card swatch: 24px, white border, black outline on
                    // hover/active (border-neutral-300 keeps White visible).
                    cn(
                      'size-6 border transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(0,0,0,1)]',
                      swatch.name === 'White' ? 'border-neutral-300' : 'border-white',
                      isActive && 'shadow-[0_0_0_1px_rgba(0,0,0,1)]'
                    )
                  : cn(
                      'ring-1 ring-black/20 transition-shadow hover:ring-black',
                      dimension,
                      isActive && 'ring-2 ring-black ring-offset-1'
                    )
              )}
              // Dynamic, data-driven color value — the one accepted inline style
              // (it can't be enumerated as a Tailwind class).
              style={{ backgroundColor: swatch.hex }}
            >
              <span className="sr-only">{swatch.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
