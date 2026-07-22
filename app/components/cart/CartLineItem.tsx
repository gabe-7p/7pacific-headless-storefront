import { CartForm, Image, Money, type OptimisticCartLine } from '@shopify/hydrogen';
import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import { Minus, Plus } from 'lucide-react';
import { Link } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

import type { CartLayout, LineItemChildrenMap } from '~/components/cart/CartMain';
import { useAside } from '~/components/layout/Aside';
import { useVariantUrl } from '~/lib/variants';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single cart line: product image, title, options, price, a quantity stepper,
 * and a remove control. Child component lines (warranties, gift wrapping) render
 * nested below the parent.
 */
export const CartLineItem = ({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) => {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;
  const closeIfAside = () => layout === 'aside' && close();

  return (
    <li key={id} className="py-4">
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
              className="h-24 w-20 bg-court object-cover"
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
            <ul className="mt-1 text-sm text-carbon">
              {selectedOptions.map((option) => (
                <li key={option.name}>
                  <span className="font-semibold text-carbon">{option.name}:</span> {option.value}
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
              {line?.cost?.totalAmount ? <Money data={line.cost.totalAmount} /> : null}
            </div>
          </div>
          {/* Live's drawer removes via the stepper; the /cart page has the link. */}
          {layout === 'page' && (
            <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
          )}
        </div>
      </div>

      {lineItemChildren ? (
        <div>
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="mt-2 ml-24">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
};

/** Quantity stepper (−/value/+). */
const QuantityStepper = ({ line }: { line: CartLine }) => {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="border-border-subtle inline-flex items-center border">
      <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="flex size-8 items-center justify-center transition-opacity hover:opacity-60 disabled:opacity-30"
        >
          <Minus className="size-3.5" />
        </button>
      </CartLineUpdateButton>
      <span className="min-w-8 text-center font-mono text-sm tabular-nums">{quantity}</span>
      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="flex size-8 items-center justify-center transition-opacity hover:opacity-60 disabled:opacity-30"
        >
          <Plus className="size-3.5" />
        </button>
      </CartLineUpdateButton>
    </div>
  );
};

const CartLineRemoveButton = ({
  lineIds,
  disabled,
}: {
  lineIds: Array<string>;
  disabled: boolean;
}) => {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <button
        disabled={disabled}
        type="submit"
        className="mt-2 text-xs text-graphite transition-colors hover:text-carbon"
      >
        Remove
      </button>
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
