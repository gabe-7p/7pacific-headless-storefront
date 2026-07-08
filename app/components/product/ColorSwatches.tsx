import { Link } from 'react-router';

import { cn } from '~/lib/cn';
import {
  getAvailableColors,
  getColorHex,
  getColorVariantHandle,
  getCurrentColor,
} from '~/lib/colorMap';

type ColorSwatchesProps = {
  /** A product handle (with or without a color suffix). */
  handle: string;
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
 * One swatch per available color for the product, each linking to the sibling
 * color product (separate-product-per-color model). The current color is
 * highlighted.
 */
export const ColorSwatches = ({
  handle,
  size = 'sm',
  alwaysRender = false,
  className,
}: ColorSwatchesProps) => {
  const colors = getAvailableColors(handle);
  if (colors.length < (alwaysRender ? 1 : 2)) return null;

  const current = getCurrentColor(handle);
  const dimension = size === 'lg' ? 'size-6' : 'size-4';

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {colors.map((color) => {
        const isActive = color === current;
        return (
          <li key={color}>
            <Link
              to={`/products/${getColorVariantHandle(handle, color)}`}
              prefetch="intent"
              title={color}
              aria-label={color}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'block rounded-full ring-1 ring-black/20 transition-shadow hover:ring-black',
                dimension,
                isActive && 'ring-2 ring-black ring-offset-1'
              )}
              // Dynamic, data-driven color value — the one accepted inline style
              // (it can't be enumerated as a Tailwind class).
              style={{ backgroundColor: getColorHex(color) }}
            >
              <span className="sr-only">{color}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
