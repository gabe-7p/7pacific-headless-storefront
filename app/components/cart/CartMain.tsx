import { type OptimisticCartLine, useOptimisticCart } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

import { type CartLine, CartLineItem } from '~/components/cart/CartLineItem';
import { TextLink } from '~/components/common/TextLink';
import { useAside } from '~/components/layout/Aside';

import { CartSummary } from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = { [parentId: string]: CartLine[] };

/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const nested = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(nested)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

/**
 * The cart contents, shared by the /cart route (`page`) and the drawer (`aside`).
 */
export const CartMain = ({ layout, cart: originalCart }: CartMainProps) => {
  // useOptimisticCart applies pending actions so the UI updates immediately.
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = (cart?.totalQuantity ?? 0) > 0;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  if (!linesCount) return <CartEmpty layout={layout} />;

  const lines = (
    <ul aria-labelledby="cart-lines" className="divide-border-subtle divide-y">
      {(cart?.lines?.nodes ?? []).map((line) => {
        // root cart only renders parent lines; children render nested
        if ('parentRelationship' in line && line.parentRelationship?.parent) return null;
        return <CartLineItem key={line.id} line={line} layout={layout} childrenMap={childrenMap} />;
      })}
    </ul>
  );

  return (
    <div className={layout === 'page' ? 'lg:flex lg:items-start lg:gap-12' : 'flex flex-col'}>
      <p id="cart-lines" className="sr-only">
        Line items
      </p>
      <div className={layout === 'page' ? 'lg:flex-1' : 'px-5'}>{lines}</div>
      {cartHasItems && <CartSummary cart={cart} layout={layout} />}
    </div>
  );
};

const CartEmpty = ({ layout }: { layout: CartMainProps['layout'] }) => {
  const { close } = useAside();
  return (
    <div className={layout === 'aside' ? 'px-5 py-10' : 'py-16 text-center'}>
      <p className="text-sm text-neutral-600">Your cart is currently empty.</p>
      <TextLink
        to="/collections/summer-25"
        onClick={close}
        prefetch="viewport"
        className="mt-2 inline-block"
      >
        Continue shopping
      </TextLink>
    </div>
  );
};
