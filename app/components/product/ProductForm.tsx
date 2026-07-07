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

const OptionLabel = ({ children }: { children: string }) => (
  <p className="mb-2 text-xs font-semibold tracking-[0.15em] text-neutral-500 uppercase">
    {children}
  </p>
);

/**
 * Buy-box options (size selector), styled for the white PDP buy card as a
 * full-width joined segmented bar (selected cell filled black). Shopify's
 * internal single-variant "Title" option is filtered out; products with no
 * real size option (e.g. the hat) render a single "One Size" cell like live.
 * Add-to-cart lives in a separate AddToCartBar flush at the card bottom.
 */
export const ProductForm = ({ productOptions }: { productOptions: MappedProductOptions[] }) => {
  const navigate = useNavigate();

  // "Title" is Shopify's placeholder option for single-variant products.
  const options = productOptions.filter((option) => option.name !== 'Title');

  if (options.length === 0) {
    return (
      <div>
        <OptionLabel>Size</OptionLabel>
        <div className="flex w-full">
          <span className="flex-1 cursor-default border border-neutral-900 bg-neutral-900 py-3 text-center text-sm font-medium text-white">
            One Size
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {options.map((option) => {
        const isSingle = option.optionValues.length === 1;
        return (
          <div key={option.name}>
            <OptionLabel>{option.name}</OptionLabel>
            <div className="flex w-full">
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
                      '-ml-px flex-1 border py-3 text-center text-sm font-medium transition-colors first:ml-0',
                      selected
                        ? 'z-10 border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900',
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
