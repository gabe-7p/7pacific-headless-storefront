import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

import type { CartLayout } from '~/components/cart/CartMain';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/cn';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export const CartSummary = ({ cart, layout }: CartSummaryProps) => {
  return (
    <div
      aria-labelledby="cart-summary"
      className={cn(
        'px-5 py-5',
        layout === 'aside'
          ? // Pinned to the drawer's bottom edge, as on live.
            'border-border-subtle mt-auto border-t'
          : // Mobile/tablet: plain full-width rows with a separating top rule (no
            // card). Desktop: a light-gray panel, no rule.
            'border-border-subtle border-t lg:w-80 lg:flex-none lg:border-t-0 lg:bg-neutral-50 lg:p-6'
      )}
    >
      <div className="flex items-baseline justify-between">
        {/* Live's drawer letterspaces the label; the /cart page keeps it plain. */}
        <span
          className={cn('text-sm', layout === 'aside' && 'text-[9.6px] tracking-[0.3em] uppercase')}
        >
          Subtotal
        </span>
        <span className="font-mono text-sm font-medium">
          {/* Deliberately raw <Money> ("$74.00"), NOT the brand <Price> ("$74 USD"):
              the live cart shows cents without a currency suffix. Product cards
              and the PDP use <Price>. Mono face per the numbers-live-in-mono rule. */}
          {cart?.cost?.subtotalAmount?.amount ? <Money data={cart?.cost?.subtotalAmount} /> : '-'}
        </span>
      </div>

      {/* Discount / gift-card entry only on the full cart page (cleaner drawer) */}
      {layout === 'page' && (
        <div className="mt-4 space-y-3 text-sm">
          <CartDiscounts discountCodes={cart?.discountCodes} />
          <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
        </div>
      )}

      {/* Live puts the disclaimer above the checkout button. */}
      <p className="mt-3 text-center text-xs text-neutral-500">
        Shipping, taxes, and discount codes calculated at checkout.
      </p>
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
};

const CartCheckoutActions = ({ checkoutUrl }: { checkoutUrl?: string }) => {
  if (!checkoutUrl) return null;
  return (
    // Matches the live theme's .btn/.cart__checkout exactly: full width,
    // 3px radius ("round-slight"), 13px bold, .3em letterspacing — same at
    // every breakpoint. Overrides the brand Button's defaults locally so the
    // marketing CTAs elsewhere keep their own verified styling.
    <Button
      asChild
      variant="brand"
      size="lg"
      className="mt-5 w-full rounded-[3px] text-[13px] font-bold tracking-[0.3em]"
    >
      <a href={checkoutUrl} target="_self">
        Checkout
      </a>
    </Button>
  );
};

const CartDiscounts = ({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) => {
  const codes: Array<string> =
    discountCodes?.filter((discount) => discount.applicable)?.map(({ code }) => code) || [];

  return (
    <div>
      <dl hidden={!codes.length} className="flex items-center justify-between">
        <dt className="text-neutral-500">Discount(s)</dt>
        <UpdateDiscountForm>
          <div className="flex items-center gap-2">
            <code>{codes?.join(', ')}</code>
            <button type="submit" className="underline" aria-label="Remove discount">
              Remove
            </button>
          </div>
        </UpdateDiscountForm>
      </dl>

      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <label htmlFor="discount-code-input" className="sr-only">
            Discount code
          </label>
          <input
            id="discount-code-input"
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="border-border-subtle flex-1 border px-2 py-1.5"
          />
          <Button type="submit" variant="outline" size="sm" aria-label="Apply discount code">
            Apply
          </Button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
};

const UpdateDiscountForm = ({
  discountCodes,
  children,
}: {
  discountCodes?: Array<string>;
  children: React.ReactNode;
}) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{ discountCodes: discountCodes || [] }}
    >
      {children}
    </CartForm>
  );
};

const CartGiftCard = ({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) => {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({ key: 'gift-card-add' });

  useEffect(() => {
    if (giftCardAddFetcher.data && giftCardCodeInput.current) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div>
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl className="space-y-1">
          <dt className="text-neutral-500">Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="flex items-center gap-2">
                <code>***{giftCard.lastCharacters}</code>
                <Money data={giftCard.amountUsed} />
                <button type="submit" className="underline">
                  Remove
                </button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="flex gap-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="border-border-subtle flex-1 border px-2 py-1.5"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={giftCardAddFetcher.state !== 'idle'}
          >
            Apply
          </Button>
        </div>
      </AddGiftCardForm>
    </div>
  );
};

const AddGiftCardForm = ({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) => {
  return (
    <CartForm fetcherKey={fetcherKey} route="/cart" action={CartForm.ACTIONS.GiftCardCodesAdd}>
      {children}
    </CartForm>
  );
};

const RemoveGiftCardForm = ({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{ giftCardCodes: [giftCardId] }}
    >
      {children}
    </CartForm>
  );
};
