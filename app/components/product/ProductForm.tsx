import { type MappedProductOptions } from '@shopify/hydrogen';
import { useNavigate } from 'react-router';
import type { ProductFragment } from 'storefrontapi.generated';

import { cn } from '~/lib/cn';

/** Map Shopify's verbose size values to the short labels the live PDP shows. */
const SIZE_LABELS: Record<string, string> = {
  'extra small': 'XS',
  small: 'S',
  medium: 'M',
  large: 'L',
  'extra large': 'XL',
  'x-large': 'XL',
  'xx-large': 'XXL',
  'one size': 'OS',
};

const shortLabel = (value: string) => SIZE_LABELS[value.trim().toLowerCase()] ?? value;

/**
 * Buy-box options (size/variant selector), styled for the white PDP buy card.
 * Size values render as buttons (mapped to S/M/L/XL); a single-value option
 * (e.g. the hat's "One Size") renders as a disabled pill. Add-to-cart lives in
 * a separate AddToCartBar rendered flush at the card bottom.
 */
export const ProductForm = ({ productOptions }: { productOptions: MappedProductOptions[] }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {productOptions.map((option) => {
        const isSingle = option.optionValues.length === 1;
        return (
          <div key={option.name}>
            <p className="mb-2 text-xs font-semibold tracking-[0.15em] text-neutral-500 uppercase">
              {option.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const { name, selected, available, exists, variantUriQuery } = value;
                return (
                  <button
                    type="button"
                    key={option.name + name}
                    disabled={isSingle || !exists}
                    aria-pressed={selected}
                    onClick={() => {
                      if (!selected && exists) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                    className={cn(
                      'min-w-11 border px-3 py-2 text-sm font-medium transition-colors',
                      selected
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-300 text-neutral-900 hover:border-neutral-900',
                      !available && 'opacity-40',
                      isSingle && 'cursor-default'
                    )}
                  >
                    {shortLabel(name)}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
