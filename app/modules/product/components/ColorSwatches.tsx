import { Link } from 'react-router';

import { cn } from '~/lib/cn';
import {
  getAvailableColors,
  getColorHex,
  getColorVariantHandle,
  getCurrentColor,
} from '~/modules/product/lib/colorMap';

type ColorSwatchesProps = {
  /** A product handle (with or without a color suffix). */
  handle: string;
  size?: 'sm' | 'lg';
  /** Ring color: 'dark' (default, for light backgrounds) or 'light' (for dark panels like the PDP buy box). */
  tone?: 'dark' | 'light';
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
  tone = 'dark',
  className,
}: ColorSwatchesProps) => {
  const colors = getAvailableColors(handle);
  if (colors.length < 2) return null;

  const current = getCurrentColor(handle);
  const dimension = size === 'lg' ? 'size-6' : 'size-4';
  const ring =
    tone === 'light' ? 'ring-white/40 hover:ring-white' : 'ring-black/20 hover:ring-black';
  const activeRing = tone === 'light' ? 'ring-2 ring-white' : 'ring-2 ring-black';

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
                'block rounded-full ring-1 transition-shadow',
                ring,
                dimension,
                isActive && `${activeRing} ring-offset-1`
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
