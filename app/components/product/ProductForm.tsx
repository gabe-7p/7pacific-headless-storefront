import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';

import { Eyebrow } from '~/components/common/Eyebrow';
import {
  SEGMENT_CELL,
  SEGMENT_IDLE,
  SEGMENT_JOIN,
  SEGMENT_SELECTED,
} from '~/components/product/SegmentedCell';
import { SizeGuide } from '~/components/product/SizeGuide';
import { cn } from '~/lib/cn';
import { isPlainActivation } from '~/lib/events';
import { shortSizeLabel } from '~/lib/product/display';
import { useProductForm } from '~/lib/product/store';
import { productUrl } from '~/lib/urls';

const SIZE_CELL = cn(SEGMENT_CELL, 'flex-1 py-3 text-center');

/** Idle cells sit on the buy card, and each can neighbour another idle cell, so
    one lifts on hover or focus to keep its dark border on top. */
const IDLE_CELL = cn(SEGMENT_IDLE, 'bg-field hover:z-10 focus-visible:z-10');

/** The label row above a segmented bar; `action` rides its right edge. */
const OptionLabel = ({ children, action }: { children: string; action?: ReactNode }) => (
  <div className="mb-2 flex items-baseline justify-between">
    <Eyebrow className="text-support">{children}</Eyebrow>
    {action}
  </div>
);

/**
 * Buy-box options (size selector). Shopify's internal single-variant "Title"
 * option is filtered out; products with no real size option (e.g. the hat)
 * render a single "One Size" cell.
 */
export const ProductForm = () => {
  const { options, register } = useProductForm();
  const { search } = useLocation();

  // "Title" is Shopify's placeholder option for single-variant products.
  const sizeOptions = options.filter((option) => option.name !== 'Title');

  if (sizeOptions.length === 0) {
    return (
      <div>
        <OptionLabel>Size</OptionLabel>
        <div className="flex w-full">
          <span className={cn(SIZE_CELL, 'cursor-default', SEGMENT_SELECTED)}>One Size</span>
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
                  SEGMENT_JOIN,
                  selected ? SEGMENT_SELECTED : IDLE_CELL,
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
                    to={productUrl(
                      value.handle,
                      value.selectedOptions,
                      new URLSearchParams(search)
                    )}
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
