import { formatMoney } from '@shopify/hydrogen';

import { MONEY_LOCALE } from '~/lib/i18n';

/** A (possibly partial) MoneyV2 — optimistic cart lines can carry an incomplete price. */
export type MoneyLike = { amount?: string | null; currencyCode?: string | null };

export type PriceFormat = 'brand' | 'compact' | 'cart';

/**
 * The one money formatter. Three formats, each matching the live surface it
 * replaced:
 * - `brand`   — "$74 USD": whole dollars + currency code (PDP price).
 * - `compact` — "$74": whole dollars, no code (the product card's mono strip).
 * - `cart`    — "$74.00": cents, no code (cart lines and subtotal).
 * Returns null for an incomplete amount so the caller can render a placeholder.
 */
export const formatPrice = (
  money: MoneyLike | null | undefined,
  format: PriceFormat
): string | null => {
  if (!money?.amount || !money.currencyCode) return null;
  const value = { amount: money.amount, currencyCode: money.currencyCode };
  switch (format) {
    case 'brand':
      return `${formatMoney(value, { locale: MONEY_LOCALE, withoutTrailingZeros: true })} ${value.currencyCode}`;
    case 'compact':
      return formatMoney(value, { locale: MONEY_LOCALE, withoutTrailingZeros: true }).toString();
    case 'cart':
      return formatMoney(value, { locale: MONEY_LOCALE }).toString();
  }
};
