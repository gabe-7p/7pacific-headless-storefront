# Meta Pixel — testing checklist

How to confirm the Meta Pixel fires correctly on the storefront, in about 15 minutes. No engineering background needed; every command is copy-paste and the expected result is written next to it.

**What the storefront sends** (the Shopify "Facebook & Instagram" app keeps sending `InitiateCheckout` and `Purchase` from the checkout under the same pixel ID):

| Event         | When                                                             | Parameters                                                                 |
| ------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `PageView`    | Every page load and every in-site navigation                     | —                                                                          |
| `ViewContent` | A product page opens (and again when a different size is chosen) | `content_ids`, `content_type=product`, `content_name`, `value`, `currency` |
| `AddToCart`   | Add to cart, and each later quantity increase                    | the same, plus `num_items` = the units just added (not the cart total)     |
| `Search`      | Not yet — the storefront has no search page                      | `search_string`                                                            |

The pixel loads only after Shopify's Customer Privacy API allows analytics (immediately for US visitors; after the banner elsewhere).

**Every event is a GET** (`Request Method: GET`, type `img`, ~1.3 KB). Meta's **Automatic Configuration** is switched off (`fbq('set', 'autoConfig', false, …)` before `init`), because with it on fbevents.js scrapes the page and appends ~8 KB to each event, anything over 2048 URL characters is sent as a `navigator.sendBeacon` POST instead, and those beacons were exactly the events Events Manager never showed (every `AddToCart`, and `ViewContent` on every product whose meta description is longer than the hat's). Off also means **no** `SubscribedButtonClick` automatic events and no `[Meta Pixel] - Invalid parameter format for currency` warning in the console. If you ever see a `POST` to `facebook.com/tr/` (type `ping`) again, autoConfig is back on — check that the `set` call still precedes `init` in `app/lib/analytics/meta-pixel.client.ts`.

## 0. Before you start (one-time)

1. **Pixel ID.** `.env` must contain `PUBLIC_META_PIXEL_ID=<your pixel id>` (the same ID the Facebook & Instagram app uses). Oxygen's Production and Preview environments need the same variable.
2. **Traffic Permissions.** The pixel currently has an allow-list in Meta Events Manager, and `localhost` is not on it, so Meta's script refuses to send anything from a local server. Fix: Events Manager → your pixel → **Settings → Traffic permissions** → add `localhost` (and, for step 4, your Oxygen preview domain, e.g. `xxxx.o2.myshopify.dev`). Without this, sections 1, 2 and 4 show **no** `facebook.com/tr` requests, and the browser console says:

   ```
   [Meta pixel] <your pixel id> is unavailable on this website due to it's traffic permission settings.
   ```

   That message means configuration, not a storefront bug. Section 3's automated test does not depend on it.

## 1. Local check in Chrome DevTools (5 min)

```bash
pnpm dev
```

Expected: `➜  Local: http://localhost:3000/`. Open that URL in Chrome, press `F12`, open the **Network** tab and type `facebook.com/tr` in the filter box. Then walk the funnel:

| Step                                                 | Requests you should see (click one → **Payload** tab)                                                                                                                                                     |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Load the homepage                                    | 1 request: `ev: PageView`, `id: <your pixel id>`                                                                                                                                                          |
| Click a product                                      | 1 more `ev: PageView` and 1 `ev: ViewContent` with `cd[content_ids]: ["shopify_US_<product>_<variant>"]`, `cd[content_type]: product`, `cd[content_name]`, `cd[value]: <unit price>`, `cd[currency]: USD` |
| Click **Add to cart**                                | 1 `ev: AddToCart` with `cd[num_items]: 1`, `cd[value]` = the unit price, `cd[currency]`, `cd[content_ids]` (and no `ev: SubscribedButtonClick` — that is Meta's automatic configuration, which is off)    |
| In the cart drawer, click **+** once                 | 1 more `ev: AddToCart`, again `cd[num_items]: 1` (if it says `2`, that is a bug: it is sending the cart total)                                                                                            |
| Click **−** or **Remove**                            | nothing new (removals are not Meta events)                                                                                                                                                                |
| Reload a product page while the cart still has items | only `PageView` + `ViewContent`, **no** `AddToCart` (a pre-existing cart must not re-fire)                                                                                                                |

Then the **Console** tab:

```js
typeof window.fbq;
```

Expected: `"function"`. If it says `"undefined"`, the pixel ID is missing from `.env` or consent has not been granted yet.

**What a CSP failure looks like** (also in the Console, in red):

```
Refused to load the script 'https://connect.facebook.net/en_US/fbevents.js' because it violates the following Content Security Policy directive: "script-src ..."
```

or the same for `connect-src` (`https://www.facebook.com`) or `img-src`. Fix: the allow-list lives in `app/lib/csp.ts` (`metaPixel` hosts); `pnpm test` includes a test that pins them.

## 2. Meta Pixel Helper (2 min)

Install the [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension, then repeat the funnel from section 1 and click the extension icon on each page.

**Good:** one pixel listed with your ID, a green check, and under it the events for that page: `PageView` on the homepage; `PageView` + `ViewContent` on a product page; `AddToCart` after the click, each shown **once**. Expanding `ViewContent`/`AddToCart` shows `content_ids`, `value`, `currency`.

**Bugs the Helper would flag:**

- "Pixel activated multiple times" / the same pixel ID listed twice → the destination registered twice (should be impossible: `app/lib/analytics/meta-pixel.client.ts` guards it).
- "Missing value/currency" on `AddToCart` or `ViewContent` → a price mapping problem in `app/lib/analytics/meta-pixel.ts`.
- Two identical rows for one click → duplicate events; confirm in section 3 that it is not just dev mode.

## 3. Production build + the automated test (3 min)

Dev mode runs React in Strict Mode, which can double some events on purpose. The production build is what ships, so confirm the counts there:

```bash
pnpm build && pnpm preview
```

Expected: `➜  Local:   http://localhost:4173/`. Repeat the section 1 funnel at that URL: exactly one request per action.

Then run the automated funnel (it builds and starts the preview server by itself, ~1–2 minutes the first time):

```bash
pnpm test:pixel
```

Expected output:

```
Running 1 test using 1 worker
  ✓  1 e2e/meta-pixel.spec.ts:24:1 › Meta Pixel pre-checkout funnel (stubbed fbevents.js) (20.5s)
  1 passed (25.2s)
```

This run swaps Meta's remote script for a local stand-in (`e2e/fbevents-stub.js`), so it works offline and regardless of Traffic Permissions, and nothing is sent to Meta. It checks: one `PageView` with your ID on load; one `PageView` + one `ViewContent` (with `content_ids`, `value`, `currency`) on in-site navigation to a product; one `AddToCart` with `num_items=1`; one more `AddToCart` with `num_items=1` after a quantity increase; no CSP/Facebook console errors; Shopify's own analytics still reach `monorail-edge.shopifysvc.com`.

Once `localhost` is on the Traffic Permissions allow-list, the same funnel against Meta's real script:

```bash
pnpm test:pixel:live
```

Expected: the same `1 passed` line, titled `(real fbevents.js)`. If the allow-list is still missing the domain, the test stops with `Meta refused pixel … Traffic Permissions …` and tells you what to do.

Options: `TEST_PRODUCT_HANDLE=<handle>` picks the product; `PIXEL_BASE_URL=http://localhost:3000` runs against a server you already started.

## 4. Meta Events Manager end to end (5 min)

1. Deploy a preview (ask before running this — it creates a deployment):

   ```bash
   npx shopify hydrogen deploy
   ```

   Note the preview URL it prints (`https://<something>.o2.myshopify.dev`). Add that domain to Traffic Permissions if it is not there (section 0).

2. Events Manager → your pixel → **Test Events** → paste the preview URL → **Open website**. Walk the funnel (home → product → add to cart → **+**). Expected in the Test Events panel, in order: `PageView`, `PageView` + `ViewContent`, `AddToCart`, `AddToCart` — each with the parameters from the table above, source **Browser**.
3. Click **Checkout** and complete a test order with Shopify's **Bogus Gateway** (card number `1`, any future expiry, any CVC). Expected to follow in the same panel: `InitiateCheckout`, then `Purchase`, both from the Shopify app, under the **same pixel ID**. `Purchase` should appear once with "Deduplicated" (browser + server copies merged on `event_id`), not twice.
4. Refund or archive the test order in Shopify admin afterwards.

## 5. Do `content_ids` match the checkout's?

In Events Manager → **Test Events** (or **Overview → Event details**), open a `Purchase` event and look at `content_ids`. Compare with a storefront `ViewContent` from the same product.

- Both look like `shopify_US_1234567890_9876543210` → match, nothing to do.
- The Purchase shows bare numbers like `9876543210` → open `app/lib/analytics/meta-pixel.ts`, find `toMetaContentId`, and change its one return line to `return numericId(variantId);` (the comment above it says exactly this). Run `pnpm test` (two unit tests pin the format — update their expected strings) and `pnpm test:pixel`.

## 6. What good looks like

| Event              | Trigger                             | Expected parameters                                                                             | Where to see it                                  |
| ------------------ | ----------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `PageView`         | Each page load / in-site navigation | `id` = your pixel                                                                               | DevTools Network, Pixel Helper, Events Manager   |
| `ViewContent`      | Product page (and size change)      | `content_ids` `["shopify_US_…"]`, `content_type` `product`, `content_name`, `value`, `currency` | same                                             |
| `AddToCart`        | Add to cart; each quantity increase | the above + `num_items` = units added                                                           | same                                             |
| `InitiateCheckout` | Checkout button (Shopify app)       | cart contents, `value`, `currency`                                                              | Events Manager only (checkout is Shopify-hosted) |
| `Purchase`         | Order placed (Shopify app)          | `content_ids`, `value`, `currency`, deduplicated browser/server                                 | Events Manager only                              |
| _(none)_           | Quantity decrease, remove, reload   | nothing new                                                                                     | DevTools Network stays quiet                     |
