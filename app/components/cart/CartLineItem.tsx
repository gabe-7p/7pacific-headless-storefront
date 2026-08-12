import { CartForm, Image, Money, type OptimisticCartLine } from '@shopify/hydrogen';
import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import { Minus, Plus } from 'lucide-react';
import { Link } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

import type { CartLayout } from '~/components/cart/CartMain';
import { useAside } from '~/components/layout/Aside';
import { useVariantUrl } from '~/lib/variants';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single cart line: product image, title, options, price, a quantity stepper,
 * and a remove control.
 */
export const CartLineItem = ({ layout, line }: { layout: CartLayout; line: CartLine }) => {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();
  const closeIfAside = () => layout === 'aside' && close();

  return (
    <li className="py-4">
      <div className="flex gap-4">
        {image && (
          <Link prefetch="intent" to={lineItemUrl} onClick={closeIfAside} className="flex-none">
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={96}
              loading="lazy"
              width={80}
              className="h-24 w-20 bg-field object-cover"
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
            {product.title}
          </Link>
          {selectedOptions.length > 0 && (
            <ul className="mt-1 text-sm text-ink">
              {selectedOptions.map((option) => (
                <li key={option.name}>
                  <span className="font-semibold text-ink">{option.name}:</span> {option.value}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex items-center justify-between gap-4">
            <QuantityStepper line={line} />
            <div className="font-mono text-sm font-medium">
              {/* Raw <Money> ("$79.00") to match the cart's subtotal, not the
                  brand <Price> ("$79 USD") the PDP and product cards use.
                  Mono face per the numbers-live-in-mono rule. */}
              {line.cost?.totalAmount ? <Money data={line.cost.totalAmount} /> : null}
            </div>
          </div>
          <CartLineRemoveForm lineIds={[id]}>
            <button
              disabled={!!line.isOptimistic}
              type="submit"
              className="mt-2 cursor-pointer text-xs text-support transition-colors hover:text-ink disabled:cursor-default"
            >
              Remove
            </button>
          </CartLineRemoveForm>
        </div>
      </div>
    </li>
  );
};

const QuantityStepper = ({ line }: { line: CartLine }) => {
  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  const decreaseButton = (
    <button
      aria-label={quantity <= 1 ? 'Remove item' : 'Decrease quantity'}
      disabled={!!isOptimistic}
      name="decrease-quantity"
      value={prevQuantity}
      className="flex size-8 cursor-pointer items-center justify-center transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-30"
    >
      <Minus className="size-3.5" />
    </button>
  );

  return (
    <div className="border-border-subtle inline-flex items-center border">
      {quantity <= 1 ? (
        <CartLineRemoveForm lineIds={[lineId]}>{decreaseButton}</CartLineRemoveForm>
      ) : (
        <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          {decreaseButton}
        </CartLineUpdateButton>
      )}
      <span className="min-w-8 text-center font-mono text-sm tabular-nums">{quantity}</span>
      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="flex size-8 cursor-pointer items-center justify-center transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-30"
        >
          <Plus className="size-3.5" />
        </button>
      </CartLineUpdateButton>
    </div>
  );
};

/** Wraps a submit button in a LinesRemove form. Shares the update fetcher key
    so a pending quantity update and a remove cancel rather than race. */
const CartLineRemoveForm = ({
  lineIds,
  children,
}: {
  lineIds: Array<string>;
  children: React.ReactNode;
}) => {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      {children}
    </CartForm>
  );
};

const CartLineUpdateButton = ({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: Array<CartLineUpdateInput>;
}) => {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
};

/** Stable key so rapid +/- on the same line cancel rather than race. */
const getUpdateKey = (lineIds: Array<string>) =>
  [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
