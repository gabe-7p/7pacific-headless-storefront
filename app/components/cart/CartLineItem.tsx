import { Minus, Plus } from 'lucide-react';
import { Link } from 'react-router';

import type { CartLayout } from '~/components/cart/CartMain';
import { useCartDrawer } from '~/components/cart/useCartDrawer';
import { FieldError } from '~/components/common/FieldError';
import { Image } from '~/components/common/Image';
import { Price } from '~/components/common/Price';
import { CART_COPY } from '~/content/cart';
import { type CartLine, isOptimisticLine, useCart, useCartForm } from '~/lib/cart';
import { cn } from '~/lib/cn';
import { cartUrl, productUrl } from '~/lib/urls';

const STEP_BUTTON =
  'flex size-8 cursor-pointer items-center justify-center transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-30';

/**
 * A single cart line. A line the server hasn't confirmed yet (`optimistic:` id)
 * can't be edited.
 */
export const CartLineItem = ({ layout, line }: { layout: CartLayout; line: CartLine }) => {
  const { id, merchandise, quantity } = line;
  const { formProps, register } = useCartForm();
  const lineError = useCart((state) => state.errors.lines.get(id));
  const pending = useCart((state) => state.pending.lines.has(id));
  const { close } = useCartDrawer();
  const closeIfAside = () => layout === 'aside' && close();

  const product = merchandise?.product;
  const title = product?.title ?? merchandise?.title ?? CART_COPY.productFallback;
  const selectedOptions = merchandise?.selectedOptions ?? [];
  const lineItemUrl = product?.handle ? productUrl(product.handle, selectedOptions) : cartUrl();
  const isOptimistic = isOptimisticLine(line);
  const errorMessage = lineError?.userErrors[0]?.message;

  return (
    <li className={cn('mb-2 py-4 transition-opacity', pending && 'opacity-60')} aria-busy={pending}>
      <div className="flex gap-4">
        {merchandise?.image && (
          <Link prefetch="intent" to={lineItemUrl} onClick={closeIfAside} className="flex-none">
            <Image
              alt={title}
              data={merchandise.image}
              width={80}
              height={96}
              loading="lazy"
              className="bg-field"
            />
          </Link>
        )}

        <div className="flex flex-1 flex-col">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={closeIfAside}
            className="text-sm font-medium transition-opacity hover:opacity-70"
          >
            {title}
          </Link>
          {selectedOptions.length > 0 && (
            <ul className="mt-1 text-sm text-ink">
              {selectedOptions.map((option) => (
                <li key={option.name} className="mb-2">
                  <span className="font-semibold text-ink">{option.name}:</span> {option.value}
                </li>
              ))}
            </ul>
          )}
          <form
            {...formProps()}
            className="mt-3 flex items-center justify-between gap-4 md:max-w-100"
          >
            <button {...register('set')} />
            <input type="hidden" {...register('lineId', { value: id })} />
            <div className="border-border-subtle inline-flex items-center border">
              <button
                type="submit"
                {...register('decrease')}
                aria-label={quantity <= 1 ? 'Remove item' : 'Decrease quantity'}
                disabled={isOptimistic}
                className={STEP_BUTTON}
              >
                <Minus className="size-3.5" />
              </button>
              <input
                {...register('quantity', { value: quantity, interactive: true })}
                aria-label="Quantity"
                aria-invalid={errorMessage ? true : undefined}
                disabled={isOptimistic}
                className="w-9 bg-transparent text-center font-mono text-sm tabular-nums [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="submit"
                {...register('increase')}
                aria-label="Increase quantity"
                disabled={isOptimistic}
                className={STEP_BUTTON}
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <div className="text-sm font-medium">
              <Price data={line.cost.totalAmount} variant="cart" />
            </div>
          </form>
          <form {...formProps()}>
            <input type="hidden" {...register('lineId', { value: id })} />
            <button
              type="submit"
              {...register('remove')}
              disabled={isOptimistic}
              className="mt-2 cursor-pointer text-xs text-support transition-colors hover:text-ink disabled:cursor-default"
            >
              Remove
            </button>
          </form>
          {errorMessage && <FieldError className="mt-2">{errorMessage}</FieldError>}
        </div>
      </div>
    </li>
  );
};
