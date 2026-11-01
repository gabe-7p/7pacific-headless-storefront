/**
 * The storefront's one market and its formatting locales — English/US only
 * for v1, no locale detection. A market-aware storefront would resolve these
 * per request; until then every consumer reads them from here so the
 * Storefront client, `<ShopifyScripts>`, the money formatter and the journal
 * date strip can't drift apart.
 */

/** `@inContext` country/language for the Storefront client and Shopify's scripts.
    The currency is not fixed here: the root loader reads the live one off the
    shop's localization so a Markets change in the admin flows through. */
export const MARKET = { country: 'US', language: 'EN' } as const;

/** `Intl` locale for prices ("$74 USD", "$74.00"). */
export const MONEY_LOCALE = 'en-US';

/**
 * `Intl` locale for the journal's mono date strip. Deliberately en-GB: it
 * gives the day-first "14 JUL 2026" the strip wants; en-US would render
 * "JUL 14 2026". Not a market setting — don't fold it into `MARKET`.
 */
export const DATE_LOCALE = 'en-GB';
