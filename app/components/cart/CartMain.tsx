import { useOptimisticCart } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

import { type CartLine, CartLineItem } from '~/components/cart/CartLineItem';
import { Cta } from '~/components/common/Cta';
import { useAside } from '~/components/layout/Aside';
import { STORE_LINKS } from '~/content/links';
import { MICROCOPY } from '~/content/microcopy';

import { CartSummary } from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = { [parentId: string]: Array<CartLine> };

/** Returns a map of all line items and their children. */
const getLineItemChildrenMap = (lines: Array<CartLine>): LineItemChildrenMap => {
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
};

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
    // In the drawer the lines scroll and the summary pins to the bottom, as on live.
    <div
      className={layout === 'page' ? 'lg:flex lg:items-start lg:gap-12' : 'flex h-full flex-col'}
    >
      <p id="cart-lines" className="sr-only">
        Line items
      </p>
      <div className={layout === 'page' ? 'lg:flex-1' : 'flex-1 overflow-y-auto px-5'}>{lines}</div>
      {cartHasItems && <CartSummary cart={cart} layout={layout} />}
    </div>
  );
};

const CartEmpty = ({ layout }: { layout: CartMainProps['layout'] }) => {
  const { close } = useAside();
  return (
    <div className={layout === 'aside' ? 'px-5 py-10' : 'py-16 text-center'}>
      {/* Locked microcopy (7PA-243) — verbatim from the guidelines. */}
      <p className="text-sm text-support">{MICROCOPY.emptyCart}</p>
      <Cta to={STORE_LINKS.shopAll} onClick={close} prefetch="viewport" size="sm" className="mt-4">
        Shop the drop
      </Cta>
    </div>
  );
};
