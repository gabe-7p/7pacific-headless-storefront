import { usePostHog } from '@posthog/react';

import type { CartLayout } from '~/components/cart/CartMain';
import { Cta } from '~/components/common/Cta';
import { Price } from '~/components/common/Price';
import { Button } from '~/components/ui/button';
import { ANALYTICS_EVENT, checkoutStartedProperties } from '~/lib/analytics/posthog.events';
import { useCart, useCartForm } from '~/lib/cart';
import { cn } from '~/lib/cn';

export const CartSummary = ({ layout }: { layout: CartLayout }) => {
  const subtotal = useCart((state) => state.data.cost.subtotalAmount);
  const pending = useCart((state) => state.pending);
  const revalidating = useCart((state) => state.revalidating === true);
  // Totals are the server's; while a price-affecting change is in flight they
  // read as pending rather than showing a stale number at full strength.
  const totalsPending =
    (pending.cost ?? (pending.lines.size > 0 || pending.discountCodes.size > 0)) || revalidating;

  return (
    <div
      aria-labelledby="cart-summary"
      className={cn(
        'px-5 py-5',
        layout === 'aside'
          ? // Pinned to the drawer's bottom edge, as on live.
            'border-border-subtle mt-auto border-t'
          : // Mobile/tablet: plain full-width rows with a separating top rule (no
            // card). Desktop: a Zinc-tinted panel (distinct from the Court page
            // field), no rule.
            'border-border-subtle border-t lg:w-80 lg:flex-none lg:border-t-0 lg:bg-panel lg:p-6'
      )}
    >
      <div className="flex items-baseline justify-between" aria-busy={totalsPending}>
        {/* Live's drawer letterspaces the label; the /cart page keeps it plain. */}
        <span
          className={cn('text-sm', layout === 'aside' && 'text-[9.6px] tracking-[0.3em] uppercase')}
        >
          Subtotal
        </span>
        <span
          className={cn(
            'font-mono text-sm font-medium transition-opacity',
            totalsPending && 'opacity-50'
          )}
        >
          <Price data={subtotal} variant="cart" /> {subtotal?.amount ? null : '-'}
        </span>
      </div>

      {/* Discount entry only on the full cart page (cleaner drawer) */}
      {layout === 'page' && (
        <div className="mt-4 text-sm">
          <CartDiscounts />
        </div>
      )}

      {/* Live puts the disclaimer above the checkout button. */}
      <p className="mt-3 text-center text-xs text-support">
        Shipping, taxes, and discount codes calculated at checkout.
      </p>
      <CartCheckoutActions layout={layout} />
    </div>
  );
};

const CartCheckoutActions = ({ layout }: { layout: CartLayout }) => {
  const posthog = usePostHog();
  const cart = useCart((state) => state.data);

  if (!cart.checkoutUrl) return null;
  return (
    // The cart's one Ember moment.
    <Cta
      href={cart.checkoutUrl}
      variant="brand"
      size="lg"
      className="mt-5 w-full"
      onClick={() =>
        posthog.capture(ANALYTICS_EVENT.checkoutStarted, checkoutStartedProperties(cart, layout))
      }
    >
      Checkout
    </Cta>
  );
};

/** Discount codes: one remove form per applied code, one apply form. */
const CartDiscounts = () => {
  const { formProps, register } = useCartForm();
  const discountCodes = useCart((state) => state.data.discountCodes);
  const errors = useCart((state) => state.errors.discountCodes);
  const codes = discountCodes.filter((discount) => discount.applicable).map(({ code }) => code);
  const errorMessage = [...errors.values()].flatMap((group) => group.userErrors)[0]?.message;

  return (
    <div>
      {codes.length > 0 && (
        <dl className="flex items-center justify-between">
          <dt className="text-support">Discount(s)</dt>
          <dd className="flex items-center gap-3">
            {codes.map((code) => (
              <form key={code} {...formProps()} className="flex items-center gap-2">
                <input type="hidden" {...register('discountCode', { value: code })} />
                <code>{code}</code>
                <button
                  type="submit"
                  {...register('discount-remove')}
                  className="underline"
                  aria-label={`Remove discount ${code}`}
                >
                  Remove
                </button>
              </form>
            ))}
          </dd>
        </dl>
      )}

      <form {...formProps()} className="mt-2 flex gap-2">
        <label htmlFor="discount-code-input" className="sr-only">
          Discount code
        </label>
        <input
          id="discount-code-input"
          type="text"
          {...register('discountCode', { defaultValue: '' })}
          placeholder="Discount code"
          className="border-border-subtle m-0 flex-1 rounded-none border px-2 py-1.5"
        />
        <Button type="submit" {...register('discount-apply')} variant="outline" size="sm">
          Apply
        </Button>
      </form>
      {errorMessage && (
        <p className="mt-2 text-xs text-ember" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
