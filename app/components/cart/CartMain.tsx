import { CartLineItem } from '~/components/cart/CartLineItem';
import { CartSummary } from '~/components/cart/CartSummary';
import { Cta } from '~/components/common/Cta';
import { useAside } from '~/components/layout/Aside';
import { STORE_LINKS } from '~/content/links';
import { MICROCOPY } from '~/content/microcopy';
import { useCart } from '~/lib/cart';

export type CartLayout = 'page' | 'aside';

/**
 * The cart contents, shared by the /cart route (`page`) and the drawer
 * (`aside`). Reads the client cart store: optimistic lines appear at once and
 * settle when `/api/cart` confirms them.
 */
export const CartMain = ({ layout }: { layout: CartLayout }) => {
  const lines = useCart((state) => state.data.lines.nodes);
  // totalQuantity (not line count) gates the summary: optimistically-removed
  // lines can still be rendering while the quantity is already 0.
  const cartHasItems = useCart((state) => state.data.totalQuantity > 0);

  if (lines.length === 0) return <CartEmpty layout={layout} />;

  const list = (
    <ul aria-labelledby="cart-lines" className="divide-border-subtle divide-y">
      {lines.map((line) => (
        <CartLineItem key={line.id} line={line} layout={layout} />
      ))}
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
      <div className={layout === 'page' ? 'lg:flex-1' : 'flex-1 overflow-y-auto px-5'}>{list}</div>
      {cartHasItems && <CartSummary layout={layout} />}
    </div>
  );
};

const CartEmpty = ({ layout }: { layout: CartLayout }) => {
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
