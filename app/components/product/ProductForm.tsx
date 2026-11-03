import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router';

import { Eyebrow } from '~/components/common/Eyebrow';
import { SizeGuide } from '~/components/product/SizeGuide';
import { cn } from '~/lib/cn';
import { shortSizeLabel } from '~/lib/product/display';
import { useProductForm } from '~/lib/product/store';
import { productUrl } from '~/lib/urls';

/** Live's segmented size cell: 9.6px, semibold, 0.3em tracking, uppercase. */
const SIZE_CELL =
  'flex-1 border py-3 text-center text-[9.6px] font-semibold tracking-[0.3em] uppercase';

const SELECTED_CELL = 'z-10 border-ink bg-field-night text-ink-night';
const IDLE_CELL =
  'border-border-subtle bg-field text-ink hover:z-10 hover:border-ink focus-visible:z-10';

/** The label row above a segmented bar; `action` rides its right edge. */
const OptionLabel = ({ children, action }: { children: string; action?: ReactNode }) => (
  <div className="mb-2 flex items-baseline justify-between">
    <Eyebrow className="text-support">{children}</Eyebrow>
    {action}
  </div>
);

// A modified or non-primary click belongs to the browser (new tab, new
// window), so the href stays in charge of it.
const isPlainActivation = (event: MouseEvent<HTMLAnchorElement>) =>
  !event.defaultPrevented &&
  event.button === 0 &&
  !event.metaKey &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.shiftKey;

/**
 * Buy-box options (size selector), styled for the white PDP buy card as a
 * full-width joined segmented bar (selected cell filled black). Each value is
 * a real link to the variant URL (crawlable, works without JS); with JS the
 * product-form store resolves the click client-side and `onSelect` rewrites
 * the URL, so a size change never waits on a loader round-trip. Shopify's
 * internal single-variant "Title" option is filtered out; products with no
 * real size option (e.g. the hat) render a single "One Size" cell like live.
 * Add-to-cart lives in a separate AddToCartBar flush at the card bottom.
 */
export const ProductForm = () => {
  const { options, register } = useProductForm();

  // "Title" is Shopify's placeholder option for single-variant products.
  const sizeOptions = options.filter((option) => option.name !== 'Title');

  if (sizeOptions.length === 0) {
    return (
      <div>
        <OptionLabel>Size</OptionLabel>
        <div className="flex w-full">
          <span className={cn(SIZE_CELL, 'cursor-default', SELECTED_CELL)}>One Size</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {sizeOptions.map((option, index) => {
        const isSingle = option.values.length === 1;
        return (
          <div key={option.name}>
            {/* The size guide rides the first option's label row — the live
                range is one option (Size) per product. It stays off the One
                Size branch above, where an S-XL body chart would mislead. */}
            <OptionLabel action={index === 0 ? <SizeGuide /> : undefined}>
              {option.name}
            </OptionLabel>
            <div className="flex w-full">
              {option.values.map((value) => {
                const { name, selected, available, exists } = value;
                const label = shortSizeLabel(name);
                // The cells overlap by 1px, so a neighbour's pale left border
                // paints over this one's darkened right border on hover — lift
                // the hovered cell like the selected one.
                const className = cn(
                  SIZE_CELL,
                  '-ml-px transition-colors first:ml-0',
                  selected ? SELECTED_CELL : IDLE_CELL,
                  !available && 'opacity-40'
                );

                if (isSingle) {
                  return (
                    <span key={name} className={cn(className, 'cursor-default')}>
                      {label}
                    </span>
                  );
                }

                // No variant for this combination at all (not merely sold out).
                if (!exists) {
                  return (
                    <button
                      key={name}
                      type="button"
                      disabled
                      aria-pressed={selected}
                      className={className}
                    >
                      {label}
                    </button>
                  );
                }

                const registered = register('optionValue', {
                  optionName: option.name,
                  value: name,
                });
                return (
                  <Link
                    key={name}
                    to={productUrl(value.handle, value.selectedOptions)}
                    replace
                    preventScrollReset
                    aria-current={selected ? 'true' : undefined}
                    className={className}
                    onClick={(event) => {
                      if (!isPlainActivation(event)) return;
                      // The store resolves the selection and `onSelect` has
                      // already rewritten the URL; letting the Link navigate too
                      // would refetch the loader the resolved selection skipped.
                      registered.onClick();
                      event.preventDefault();
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
