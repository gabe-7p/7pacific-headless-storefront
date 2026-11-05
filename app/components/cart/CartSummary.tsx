import { usePostHog } from '@posthog/react';
import type { FormEvent } from 'react';

import type { CartLayout } from '~/components/cart/CartMain';
import { Cta } from '~/components/common/Cta';
import { FieldError } from '~/components/common/FieldError';
import { Price } from '~/components/common/Price';
import { SEGMENT_LABEL } from '~/components/product/SegmentedCell';
import { Button } from '~/components/ui/button';
import { CART_COPY } from '~/content/cart';
import { ANALYTICS_EVENT, checkoutStartedProperties } from '~/lib/analytics/posthog.events';
import { nextDiscountCodes, useCart, useCartForm } from '~/lib/cart';
import { cn } from '~/lib/cn';
import { getUpdateCartAction } from '~/lib/shopifyRuntime';

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
      role="region"
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
      <p id="cart-summary" className="sr-only">
        {CART_COPY.summaryLabel}
      </p>
      <div className="flex items-baseline justify-between" aria-busy={totalsPending}>
        {/* Live's drawer letterspaces the label; the /cart page keeps it plain. */}
        <span className={cn('text-sm', layout === 'aside' && SEGMENT_LABEL)}>Subtotal</span>
        <span
          className={cn('text-sm font-medium transition-opacity', totalsPending && 'opacity-50')}
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
      <p className="mt-3 text-center text-xs text-support">{CART_COPY.disclaimer}</p>
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
  const loading = useCart((state) => state.loading);
  const codes = discountCodes.filter((discount) => discount.applicable).map(({ code }) => code);
  // An unknown code comes back as a warning (DISCOUNT_NOT_FOUND), not a user error.
  const errorMessage = [...errors.values()].flatMap((group) => [
    ...group.userErrors,
    ...group.warnings,
  ])[0]?.message;

  // The form's own submit resends every code on the cart, rejected ones
  // included, so send the list through `updateCart` instead. The store observes
  // that call like a form submit. Until it can, the form's submit still works.
  const sendCodes = (event: FormEvent<HTMLFormElement>, next: Array<string>) => {
    const updateCart = loading ? null : getUpdateCartAction();
    if (!updateCart) return;
    event.preventDefault();
    updateCart({ discountCodes: next }).catch(() => {});
  };

  const applyCode = (event: FormEvent<HTMLFormElement>) => {
    const code = new FormData(event.currentTarget).get('discountCode');
    const apply = typeof code === 'string' ? code.trim() : '';
    if (apply) sendCodes(event, nextDiscountCodes(discountCodes, { apply }));
    else event.preventDefault();
  };

  return (
    <div>
      {codes.length > 0 && (
        <dl className="my-2 flex items-center justify-between">
          <dt className="text-support">{CART_COPY.discountLabel}</dt>
          <dd className="flex items-center gap-3">
            {codes.map((code) => (
              <form
                key={code}
                {...formProps({
                  beforeSubmit: (event) =>
                    sendCodes(event, nextDiscountCodes(discountCodes, { remove: code })),
                })}
                className="flex items-center gap-2"
              >
                <input type="hidden" {...register('discountCode', { value: code })} />
                <code className="rounded-[4px] bg-border-subtle p-1 font-mono">{code}</code>
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

      <form {...formProps({ beforeSubmit: applyCode })} className="mt-2 flex gap-2 md:max-w-100">
        <label htmlFor="discount-code-input" className="sr-only">
          {CART_COPY.discountPlaceholder}
        </label>
        <input
          id="discount-code-input"
          type="text"
          {...register('discountCode', { defaultValue: '' })}
          placeholder={CART_COPY.discountPlaceholder}
          className="border-border-subtle flex-1 border px-2 py-1.5 text-[1rem]"
        />
        <Button type="submit" {...register('discount-apply')} variant="outline" size="sm">
          Apply
        </Button>
      </form>
      {errorMessage && <FieldError className="mt-2">{errorMessage}</FieldError>}
    </div>
  );
};
