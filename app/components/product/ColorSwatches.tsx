import { Link } from 'react-router';

import { cn } from '~/lib/cn';
import type { ColorSwatch } from '~/lib/colors';

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
  className,
}: ColorSwatchesProps) => {
  if (swatches.length < (alwaysRender ? 1 : 2)) return null;

  const dimension = size === 'lg' ? 'size-6' : 'size-4';

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {swatches.map((swatch) => {
        const isActive = swatch.handle === currentHandle;
        return (
          <li key={swatch.handle}>
            <Link
              to={`/products/${swatch.handle}`}
              prefetch="intent"
              title={swatch.name}
              aria-label={swatch.name}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'block rounded-full ring-1 ring-black/20 transition-shadow hover:ring-black',
                dimension,
                isActive && 'ring-2 ring-black ring-offset-1'
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
