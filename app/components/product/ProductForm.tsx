import { type MappedProductOptions } from '@shopify/hydrogen';
import { useNavigate } from 'react-router';
import type { ProductFragment } from 'storefrontapi.generated';

import { AddToCartButton } from '~/components/cart/AddToCartButton';
import { useAside } from '~/components/layout/Aside';
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
 * Buy-box options + add-to-cart, styled for the dark PDP buy-box panel.
 * Size values render as buttons (mapped to S/M/L/XL); a single-value option
 * (e.g. the hat's "One Size") renders as a disabled pill.
 */
export const ProductForm = ({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) => {
  const navigate = useNavigate();
  const { open } = useAside();

  return (
    <div className="flex flex-col gap-6">
      {productOptions.map((option) => {
        const isSingle = option.optionValues.length === 1;
        return (
          <div key={option.name}>
            <p className="mb-2 text-xs font-semibold tracking-[0.15em] text-white/70 uppercase">
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
                        ? 'border-white bg-white text-black'
                        : 'border-white/40 text-white hover:border-white',
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

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => open('cart')}
        className="bg-brand text-brand-text mt-2 w-full px-6 py-4 text-sm font-bold tracking-[0.15em] uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
        lines={
          selectedVariant
            ? [{ merchandiseId: selectedVariant.id, quantity: 1, selectedVariant }]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart //' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
};
